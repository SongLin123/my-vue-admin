const CompressionWebpackPlugin = require('compression-webpack-plugin')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const forElementUI = require('webpack-theme-color-replacer/forElementUI')
const cdnDependencies = require('./dependencies-cdn')

const StyleLintPlugin = require('stylelint-webpack-plugin')

// 分析工具
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// dllPlugin
const fs = require('fs')
const path = require('path')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin') // 给 index.html 注入 dll 生成的链接库
const { DllReferencePlugin } = require('webpack')

const { chain, set, each } = require('lodash')

// 拼接路径
const resolve = dir => require('path').join(__dirname, dir)

// 增加环境变量
process.env.VUE_APP_PROJECT_NAME = require('./package.json').name
process.env.VUE_APP_BUILD_TIME = require('dayjs')().format('YYYY-M-D HH:mm:ss')

// 基础路径 注意发布之前要先修改这里
const publicPath = process.env.VUE_APP_PUBLIC_PATH || '/'

// 设置不参与构建的库
const externals = {}

cdnDependencies.forEach(pkg => {
  pkg.name && (externals[pkg.name] = pkg.library)
})

// 引入文件的 cdn 链接
const cdn = {
  dnsPrefetch: cdnDependencies.map(e => e.dnsPrefetch || '').filter(e => e),
  css: cdnDependencies.map(e => e.css || '').filter(e => e),
  js: cdnDependencies.map(e => e.js || '').filter(e => e)
}

// 设置必须使用cdn加载的包
const alwaysUseCdn = {
  dnsPrefetch: cdnDependencies.map(e => e.skipBuild ? e.dnsPrefetch : '').filter(e => e),
  css: cdnDependencies.map(e => e.skipBuild ? e.css : '').filter(e => e),
  js: cdnDependencies.map(e => e.skipBuild ? e.js : '').filter(e => e)
}

// 多页配置，默认未开启，如需要请参考 https://cli.vuejs.org/zh/config/#pages
const pages = undefined
// const pages = {
//   index: './src/main.js',
//   subpage: {
//     // page 的入口
//     entry: './src/subPage.js',
//     // 模板来源
//     template: 'public/subPage.html',
//     // 在 dist/index.html 的输出
//     filename: 'subPage.html'
//   }
// }

module.exports = {
  outputDir: process.env.VUE_APP_PUBLIC_PATH.split('/')[1] || 'dist',
  // 根据你的实际情况更改这里
  publicPath,
  lintOnSave: true,
  devServer: {
    publicPath, // 和 publicPath 保持一致
    disableHostCheck: true, // 关闭 host check，方便使用 ngrok 之类的内网转发工具
    proxy: {
      '/idc-api/idc-utility/file': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/idc-api/idc-utility/file': '/' }
      }
      // '/idc-images': {
      //   target: 'http://10.151.5.96/intersense/',
      //   changeOrigin: true,
      //   pathRewrite: { '^/idc-images': '/' }
      // }
    }
  },
  css: {
    loaderOptions: {
      // 设置 scss 公用变量文件
      sass: {
        prependData: '@import \'~@/assets/style/public.scss\';'
      }
    }
  },
  pages,
  configureWebpack: config => {
    const configNew = {
      externals: {},
      plugins: []
    }
    if (process.env.NODE_ENV === 'production') {
      configNew.externals = externals
      configNew.plugins = [
        // gzip
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false
        })
      ]
    } else {
      configNew.plugins.push( // eslint-disable-line
        new StyleLintPlugin({
          context: 'src',
          files: ['**/*.less', '**/*.s?(a|c)ss', '**/*.vue']
        })
      )
    }

    if (process.env.ANALYZ === 'true') {
      configNew.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server', // 启动展示打包报告的http服务器
          generateStatsFile: false // 是否生成stats.json文件
        })
      )
    }

    // 扫描文件目录，把目录内的文件加入html模板
    const { dllDir } = require('./package.json')
    const DIR = path.resolve(__dirname, dllDir)
    if (fs.existsSync(DIR)) {
      fs.readdirSync(DIR).forEach(file => {
        if (/.*\.dll\.js$/.test(file)) {
          configNew.plugins.push(
            new AddAssetHtmlWebpackPlugin({
              filepath: path.resolve(DIR, file),
              outputPath: 'js', // 输出路径，相对于默认的输出路径（dist）
              publicPath: 'js' // 引入文件路径
            })
          )
        }
        if (/.*\.manifest.json/.test(file)) {
          configNew.plugins.push(
            new DllReferencePlugin({
              manifest: path.resolve(DIR, file)
            })
          )
        }
      })
    }
    return configNew
  },
  // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
  chainWebpack: config => {
    /**
     * 添加 CDN 参数到 htmlWebpackPlugin 配置中
     * 已适配多页
     *
     * 开发模式不引入cdn
     */
    const htmlPluginNames = chain(pages).keys().map(page => 'html-' + page).value()
    const targetHtmlPluginNames = htmlPluginNames.length ? htmlPluginNames : ['html']
    each(targetHtmlPluginNames, name => {
      config.plugin(name).tap(options => {
        set(options, '[0].cdn', process.env.NODE_ENV === 'production' ? cdn : alwaysUseCdn)
        return options
      })
    })

    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
     * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
     */
    config.plugins
      .delete('prefetch')
      .delete('preload')
    // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
    config.resolve
      .symlinks(true)
    config
      .plugin('theme-color-replacer')
      .use(ThemeColorReplacer, [{
        fileName: 'css/theme-colors.[contenthash:8].css',
        matchColors: [
          ...forElementUI.getElementUISeries(process.env.VUE_APP_ELEMENT_COLOR) // Element-ui主色系列
        ],
        externalCssFiles: ['./node_modules/element-ui/lib/theme-chalk/index.css'], // optional, String or string array. Set external css files (such as cdn css) to extract colors.
        changeSelector: forElementUI.changeSelector
      }])

    config
      // 开发环境 sourcemap 不包含列信息
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('source-map')
      )
    if (process.env.NODE_ENV !== 'development') {
      config.optimization.minimizer('terser').tap(args => {
        // 生产环境推荐关闭 sourcemap 防止源码泄漏
        // 服务端通过前端发送的行列，根据 sourcemap 转为源文件位置
        args[0].sourceMap = false
        args[0].terserOptions.warnings = false
        args[0].terserOptions.compress.drop_console = true
        args[0].terserOptions.compress.drop_debugger = true
        return args
      })
    }

    // svg
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .include
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'd2-[name]'
      })
      .end()
    // image exclude
    const imagesRule = config.module.rule('images')
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude
      .add(resolve('src/assets/svg-icons/icons'))
      .end()

    // posthtml viwport

    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('htmlpx-to-viewport-loader')
      .loader(require.resolve('./htmlpx-to-viewport.js'))
      .end()

    // posthtml rem

    // config.module
    //   .rule('vue')
    //   .test(/\.vue$/)
    //   .use('htmlpx-to-rem-loader')
    //   .loader(require.resolve('./htmlpx-to-rem.js'))
    //   .end()

    // 重新设置 alias
    config.resolve.alias
      .set('@api', resolve('src/api'))
  },
  // 不输出 map 文件
  productionSourceMap: false,
  // i18n
  pluginOptions: {
    i18n: false
  }
}

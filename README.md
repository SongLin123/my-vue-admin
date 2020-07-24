## 更新内容
* 优化打包
    1. 增加了 dnsPrefetch 标签在 cdn 中
    2. 增加 DllPlugin 预构建功能
    3. 增加 BundleAnalyzerPlugin 分析打包后文件
    4. 增加 terser 进行代码压缩
    
* 增加了 stylelint

## ps ：关于css单位转换的
    目前主流方案的思路大多是根据视口的宽度或者高度来调节单位，或者转换为rem或者转换为viewport单位。
    这里提供了两种方案，
    1. vw方案，使用postcss-px-to-vw + webpack-html-to-vw,
    2. rem方案，使用postcss-px-to-rem + webpack-html-to-rem + 监听视口宽度调整rem数值

    其实实现出来的效果是类似的，
    vw的方案更直观，方案也更成熟，但是viewport单位的兼容性可能会产生一些问题。
    rem的方案，在面对某些无法转换单位的情况时，如css-in-js的时候计算rem会更加简单一些（vw也需要算）。还可以通过调整rem的 root 单位实现大部分元素的放大变小。

    各有利弊，根据需要取舍。

********


# 项目介绍

基于 vue2.0+ vue-cli3 的项目脚手架。
优化了一些工程化功能

## 使用

### 初始化
```
npm i
```
### npm命令
```
npm run build // 构建
npm run lint // eslint fix模式
npm run styleLint // stylelint fix模式
npm run api-codegen // 根据 config.json 生成api代码
npm run analyz // 预构建，查看分包分析
npm run dll // 使用 DllPlugin 将库预构建
```

## 功能

* 使用 vue-cli3 构建
* eslint
* stylelint
* 全屏
* 全局灰度模式
* 自动注册 SVG 图标
* 公用样式抽离，方便的主题定制
* 美化滚动条 
* cookie 封装
* 模块化全局状态管理 
* 日志记录和错误捕捉 
* 全局菜单搜索 
* 切换全局基础组件尺寸 
* 页面载入进度条 
* 自适应css单位（提供了rem和viewport两种单位的转换方案，兼容html内联样式）
* 打包分析
* terser 代码压缩
* 配置化 DllPlugin
* 配置化 cdn
* sentry 线上日志收集


## 项目结构

```
senseIDC-fe
 ├── api-docs.json  // swagger api
 ├── babel.config.js  
 ├── config.json // api-codegen 配置
 ├── dependencies-cdn.js // cdn加载资源配置，dev环境不生效
 ├── htmlpx-to-rem.js // html-px-to-rem
 ├── .postcssrc.js // css-px-to-rem
 ├── package.json
 ├── public 
 │   ├── html
 │   │   └── demo.html
 │   ├── image
 │   │   ├── theme // 主题资源
 │   │   │   └── youfool
 │   ├── index.html // 单页入口
 │   └── subPage.html // 多页入口（如需）
 ├── src
 │   ├── api // apicode
 │   │   ├── dictEnum.js // 字典加载器
 │   │   ├── index.js // 入口文件
 │   │   ├── modules // 模块
 │   │   └── service.js //拦截器
 │   ├── App.vue 
 │   ├── assets
 │   │   ├── style
 │   │   │   ├── public-class.scss //css公用class
 │   │   │   ├── public.scss //css公用样式
 │   │   │   ├── theme
 │   │   │   └── unit // css 变量
 │   │   └── svg-icons // svg资源
 │   ├── components // 项目级组件，通过index绑定到Vue全局
 │   ├── layout // 外层布局
 │   │   └── header-aside
 │   │       ├── components
 │   │       ├── index.js
 │   │       ├── layout.vue
 │   │       └── mixins
 │   ├── libs // 工具类
 │   │   ├── util.cookies.js
 │   │   ├── util.db.js
 │   │   ├── util.import.development.js
 │   │   ├── util.import.production.js
 │   │   ├── util.js
 │   │   ├── util.log.js
 │   │   └── util.ws.js
 │   ├── main.js
 │   ├── menu // 侧栏菜单
 │   ├── mixins
 │   │   ├── global.js // 全局的mixin
 │   │   └── pages.js
 │   ├── plugin // 项目级插件，通过index绑定到Vue全局
 │   │   ├── index
 │   │   │   └── index.js
 │   │   └── sentry // sentry 日志平台（需要配置密钥，prod启用）
 │   │       └── index.js
 │   ├── rem.js // base rem配置
 │   ├── router // vue-router
 │   │   ├── index.js
 │   │   ├── modules // 静态路由
 │   │   │   ├── attendance.js
 │   │   │   └── staff.js
 │   │   ├── routerComponentMap // 动态路由对应表
 │   │   │   ├── attendance.js
 │   │   │   └── xunjian.js
 │   │   └── routes.js // 路由守卫，动态路由，动态菜单统一处理
 │   ├── setting.js  // 默认配置
 │   ├── store // Vuex
 │   │   ├── index.js
 │   │   └── modules 
 │   │       ├── business // 业务模块
 │   │       └── myadmin // 框架模块
 │   └── views // 页面
 │       ├── system // 框架相关页面
 │       │   ├── backendLog
 │       │   ├── company
 │       │   ├── error
 │       │   ├── function
 │       │   ├── index
 │       │   ├── login
 │       │   ├── role
 │       │   └── user
 │       └── vistor // 业务相关页面
 │           ├── component
 │           ├── vistorLog
 │           └── vistorReservate
 └── vue.config.js // webpack，如需多页配置在此修改
 ```
​
## 外部插件

### api-codegen
https://github.com/SongLin123/api-codegen
### my-element-crud
https://github.com/SongLin123/my-crud

## 框架

### 环境变量

.env   .env.development   .env.production  
分别对应不同环境的环境变量
详情参考<a href="https://cli.vuejs.org/zh/guide/mode-and-env.html#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E5%92%8C%E6%A8%A1%E5%BC%8F"> vue-cli3 环境变量 </a>

### px-ro-rem

使用postcss将css中的px，转化为rem
使用webpack插件将template内敛样式中的px，转化为rem
> template中任何 数字+px 的文字均会被转化如（20px），影响文本的显示。可以添加空格 转化大小写的方式规避

需要跳过转化的样式可以将 px 写为 PX

rem root配置在 src\rem.js ,目前根据可视区域的宽度变化

### 菜单、动态路由、静态路由

在router\routes.js router\modules 中配置静态路由
在menu 中配置静态菜单

在router\routerComponentMap 中配置动态路由对应关系，
动态菜单数据由后端提供

### 模块

api | store 中模块加载使用webpack require.context语法，
详情<a href="https://webpack.docschina.org/guides/dependency-management/#requirecontext">webpack require.context </a>

### 插件

plugin目录中统一编写，在 plugin/index 中注册，通过如 vm.$api 方式使用


## 内置组件

## 编写自定义组件 

### 编写规范
```
|——components
| ├──componentName           组件名
| | |——components            内部组件       
| | |——mixin                 混入函数       
| | |——index.vue             默认组件入口（必须）
```
### src/components
存放项目级别的公用组件，如果有项目级公有业务组件在此位置添加。
编写完成后的组件在 src/components/index.js 统一注册到全局，其他组件或页面使用时可以直接使用。


### layout、views 目录
中私有资源提倡就近原则，在index.vue同级建设components、images、style等目录


## es-lint 代码规范

<a href="https://github.com/standard/standard/blob/master/docs/RULES-zhcn.md#javascript-standard-style">JavaScript standard 代码规范</a> 

更加灵活的 JavaScript 编写规范

需要注意的是，此规范强制句尾不加分号
> 当前主流的代码压缩方案都是基于词法（AST-based）进行的，所以在处理无分号的代码时完全没有压力（何况 JavaScript 中分号本来就不是强制的）。

## stylelint 代码规范



## 注意事项

### 配置环境变量

如 api前缀，element主题色，html title等，在.env文件中配置,以环境变量process.env的形式使用
配置在webpack启动时生效，dev和prod环境分别对应 <.env.preview> 和<.env.preview>文件

### cdn资源

使用 npm install 安装各种组件和依赖到本地，引入的组件越来越多，打包时可能会导致 app.js 过大的问题，对load页面很不友好, 需要把一些包使用cdn形式加载。

cdn配置文件在dependencies-cdn.js ，
在dev模式时会使用node_modules中的库，会忽略配置文件。
在prod模式时会将配置文件的库js加入到html中，不需要手动更改html，webpack打包时会将配置文件中的cdn资源跳过，不参与构建。
（对代码无侵入）
如果有需要使用umd（cdn）加载的包，如zrender，amap.js，请不要在main.js和html中添加（方便统一管理），在dependencies-cdn.js 中添加，提供 skipBuild 属性。








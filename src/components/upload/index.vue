<!--
 * @Date: 2020-05-26 16:01:36
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-29 16:40:21
 * @FilePath: \myadmin\src\components\upload\index.vue
-->
<template>
  <el-upload class="avatar-uploader" action :auto-upload="false" :show-file-list="false" ref="el"
    :on-change="beforeAvatarUpload">
    <img v-if="value" :src="srcImg(value)" class="avatar-uploader-img" />
    <i v-else class="avatar-uploader-img--icon">
      <d2-icon-svg width="48px" height="44px" name="pic"></d2-icon-svg>
    </i>

  </el-upload>
</template>
<script>
  import * as sparkMd5 from 'spark-md5'
  export default {
    props: {
      value: {
        type: String,
        require: true
      },
      imageType: {
        type: String
      }
    },
    data() {
      return {
        file: null
      }
    },
    mounted() {
      // fix 无标题的仍然有左边距
      this.$refs.el.$el.parentNode.style.marginLeft = '0'
    },
    methods: {
      async converFile(file, tar) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          switch (tar) {
            case 'ArrayBuffer':
              reader.readAsArrayBuffer(file)
              break

            case 'BinaryString':
              reader.readAsBinaryString(file)
              break
            case 'Text':
              reader.readAsText(file)
              break
            case 'Base64':
            default:
              reader.readAsDataURL(file)
              break
          }
          reader.onload = e => {
            resolve(e.target.result)
          }
          reader.onerror = reject
          reader.onabort = reject
        })
      },

      upfn({ chunk, fileName }) {
        const formData = new FormData()
        formData.append('fileName', fileName)
        formData.append('chunk', chunk)
        // 上传文件
        return () => this.$api.UTILITY_FILE_UPLOADCHUNK(
          {
            body: formData
          }
        )
      },
      mergefn({ fileName }) {
        this.$api.UTILITY_FILE_UPLOADMERGE(
          {
            params: { fileName }
          }
        )
      },

      async upBychunk(file, suffix) {
        const raw = await this.converFile(file, 'ArrayBuffer')

        const fileMd5 = sparkMd5.ArrayBuffer.hash(raw)
        const chunksize = (1024 * 1024 * 2)
          let index = 0; const fns = []

        while (index * chunksize < raw.byteLength) {
          const chunk = new Blob([raw.slice(index, ++index * chunksize)])

          fns.push(this.upfn({ chunk, fileName: fileMd5 + '_' + index }))
        }
        // 并行
        // Promise.all(fns.map(i => i()))
        // 串行
        fns.reduce((acc, cur) => {
          return acc.then(() => cur())
        }, Promise.resolve())
          .then(() => {
            this.mergefn({ fileName: fileMd5 + suffix })
          })
      },

      // TODO
      async handleUpload(file) {
        const suffix = file.name.match(/\.[0-9a-zA-Z]+$/)[0]
        this.upBychunk(file, suffix)

        //  this.$api.UTILITY_FILE_UPLOADMERGE(
        //     {
        //       params: { type: this.imageType,fileName: }
        //     }
        //   )
        // this.$emit('input', res.data)
      },
      beforeAvatarUpload({ raw }) {
        const file = raw

        // const isJPGPNG = file.type.includes('png') || file.type.includes('jpeg') || file.type.includes('jpg')
        // const isLt2M = file.size / 1024 / 1024 < 2

        // if (!isJPGPNG) {
        //   this.$message.error('只支持jpg/jpeg/png格式，请重新上传')
        //   return
        // }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!')
        //   return
        // }
        this.handleUpload(file)
      }
    }
  }
</script>
<style lang="scss">
  .avatar-uploader {
    width: 100%;
    height: 100%;
    background: rgb(245, 240, 240);
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-img {
    width: 100%;
    height: 100%;
    display: block;

    &--icon {
      font-size: 28px;
      color: #8c939d;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

  }
</style>

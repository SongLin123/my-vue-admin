<!--
 * @Date: 2020-05-26 16:01:36
 * @LastEditors: songlin
 * @LastEditTime: 2020-07-10 14:11:53
 * @FilePath: \senseIDC-fe\src\components\imagecard\index.vue
-->
<template>
  <el-upload
    class="avatar-uploader"
    action="/"
    :auto-upload="true"
    :show-file-list="false"
    ref="el"
    :http-request="handleUpload"
    :before-upload="beforeAvatarUpload"
  >
    <img
      v-if="value"
      :src="srcImg(value)"
      class="avatar"
    />
    <i v-else class="avatar-uploader-icon">
      <d2-icon-svg
        width="48px"
        height="44px"
        name="pic"

      ></d2-icon-svg>
    </i>

  </el-upload>
</template>
<script>
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
    computed: {
      // src() {
      //   return process.env.VUE_APP_IMAGE + this.value
      // }
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
      async handleUpload(par) {
        const formData = new FormData()
        formData.append('image', par.file)
        // 上传文件
        const res = await this.$api.UTILITY_FILE_UPLOADPIC(
          formData,
          this.imageType
        )
        this.$emit('input', res.data)
      },
      beforeAvatarUpload(file) {
        const isJPGPNG = file.type.includes('png') || file.type.includes('jpeg') || file.type.includes('jpg')
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPGPNG) {
          this.$message.error('只支持jpg/jpeg/png格式，请重新上传')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPGPNG && isLt2M
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

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>

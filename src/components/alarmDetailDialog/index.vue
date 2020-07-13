<template>
  <!-- 告警详情弹窗 -->
  <el-dialog width="400px" title="告警详情" v-if="detailVisible" :visible="detailVisible" append-to-body @close="()=>{ this.$emit('update:detailVisible', false);}" class="main">
    <div class="container">
      <div class="c_left">
        <div class="dk_image">
          <p class="detail_label">底库图片：</p>
          <!-- personImage  -->
          <img :src="imgHttp + detailForm.personImage" alt="">
        </div>
        <div class="xsd">
          <p class="text">相似度</p>
          <!-- similarity  -->
          <p class="num">{{parseInt(detailForm.similarity * 100)}}<span class="code">%</span></p>
        </div>
        <div class="zp_image">
          <p class="detail_label">告警抓拍照片：</p>
          <!-- eventImage  -->
          <img :src="imgHttp + detailForm.eventImage" alt="">
        </div>
      </div>
      <div class="c_right">
        <el-row class="detail_row">
          <span class="detail_label">姓名：</span><span class="detail_value">{{detailForm.personName}}</span>
        </el-row>
        <el-row class="detail_row">
          <span class="detail_label">身份证号码：</span><span class="detail_value">{{detailForm.certificateNum}}</span>
        </el-row>
        <el-row class="detail_row">
          <span class="detail_label">手机号码：</span><span class="detail_value">{{detailForm.personTel}}</span>
        </el-row>
        <!-- <el-row class="detail_row">
          <span class="detail_label">人员组：</span><span class="detail_value">{{detailForm.personGroups}}</span>
        </el-row> -->
        <el-row class="detail_row" type="flex">
          <span class="detail_label">人员组：</span><span class="detail_value">
            <div class="list_content">
              <span class="list_span" v-for="item in detailForm.personGroups" :key="item">
                {{item}}
              </span>
            </div>
          </span>
        </el-row>
        <el-row class="detail_row">
          <span class="detail_label">规则名称：</span><span class="detail_value">{{detailForm.ruleName}}</span>
        </el-row>
        <el-row class="detail_row">
          <span class="detail_label">告警类型：</span><span class="detail_value">{{alarmTypeFormat(detailForm.alarmType)}}</span>
          <!-- <span class="detail_label">告警类型：</span><span class="detail_value">{{""}}</span> -->
        </el-row>
        <el-row class="detail_row">
          <span class="detail_label">告警时间：</span><span class="detail_value">{{detailForm.happenTime}}</span>
        </el-row>
        <el-row class="detail_row">
          <span class="detail_label">设备名称：</span><span class="detail_value">{{detailForm.deviceName}}</span>
        </el-row>

      </div>

    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="lookTrack">查看轨迹</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    detailForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      imgHttp: process.env.VUE_APP_IMAGE,
      alarmTypeOption: [
        { label: '黑名单', value: '1' },
        { label: '白名单', value: '2' }
      ]
    }
  },
  created() {},
  watch: {
    detailForm: {
      handler(val) {
        try {
          let str = val.personGroups
          str = str.substr(0, str.length - 1)
          str = str.substr(1, str.length - 1)
          val.personGroups = str.split(',')
        } catch (err) {}
      },
      deep: true
    }
  },
  methods: {
    alarmTypeFormat(type) {
      if (!type) return
      // eslint-disable-next-line eqeqeq
      return this.alarmTypeOption.find(item => item.value == type).label
    },
    lookTrack() {
      this.$router.push({ path: '/track' })
    }
  }
}
</script>
<style lang="scss">
.main {
  .detail_row {
    margin: 15px 0 0 0;
  }
  .detail_label {
    display: inline-block;
    width: 132px;
    font-size: 14px;
    // font-family:Source Han Sans CN;
    font-weight: 500;
    line-height: 16px;
    color: rgba(0, 0, 0, 1);
    opacity: 1;
    text-align: right;
    margin-right: 10px;
    flex-grow: 0;
    flex-shrink: 0;
  }
  .list_content {
    // line-height: 28px;
    .list_span {
      display: inline-block;
      margin: 0 10px 0 0;
      height: 20px;
    }
  }

  .container {
    // display: flex;
    .c_left,
    .c_right {
      .dk_image,
      .zp_image {
        position: relative;
        width: 120px;
      }
      // .dk_image {
      //   left: 5px;
      // }
      // .zp_image {
      //   left: -5px;
      // }
      img {
        width: 120px;
        height: 160px;
      }
    }
    .c_left {
      display: flex;
      justify-content: center;
      .detail_label {
        width: 100%;
        text-align: center;
      }
    }

    .xsd {
      margin: 0 10px;
      width: 72px;
      height: 72px;
      flex-grow: 0;
      flex-shrink: 0;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      top: 90px;
      z-index: 1;
      background: linear-gradient(
        159deg,
        rgba(86, 98, 255, 1) 0%,
        rgba(38, 48, 177, 1) 100%
      );
      border-radius: 50%;
      opacity: 1;
      .text,
      .num {
        margin: 0;
      }
      .text {
        font-size: 14px;
        // font-family: Source Han Sans CN;
        font-weight: 500;
        line-height: 16px;
        color: rgba(255, 255, 255, 1);
        opacity: 1;
      }
      .num,
      .code {
        color: rgba(255, 255, 255, 1);
        opacity: 1;
      }
      .num {
        font-size: 18px;
        font-weight: 800;
      }
      .code {
        font-size: 14px;
      }
    }
  }
  .dialog-footer {
    button {
      width: 112px;
    }
  }
}
</style>

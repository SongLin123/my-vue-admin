<template>
  <div :class="['container',isSimilarity?'similarity_container':'',small?'small':'']">
    <header :class="[titleBgCls]">
      <div v-if="isSimilarity" class="similarity_content">
        <span class="text">相似度</span>
        <span class="xsd">
          <span class="xsd_num">{{data.xsd}}</span> <span class="xsd_code">%</span>
        </span> </div>
      <div v-if="!isSimilarity" class="def_content"><span>{{title}}</span></div>
    </header>
    <div class="content">
      <div class="image">
        <img :src="data.imageUrl" alt="">
        <p class="go_router" v-if="showRouterLink" @click="toTrack">轨迹追踪</p>
      </div>
      <div class="info" v-if="!isSimilarity">
        <el-row class="detail_row" v-if="data.type === '1'" type="flex">
          <span class="detail_label">姓名：</span><span class="detail_value">
            <div class="list_content">
              <span class="list_span">
                {{data.personName}}
              </span>
            </div>
          </span>
        </el-row>
        <el-row class="detail_row" v-if="data.type === '2'" type="flex">
          <span class="detail_label">陌生人ID：</span><span class="detail_value">
            <div class="list_content">
              <span class="list_span">
                {{data.strangerId}}
              </span>
            </div>
          </span>
        </el-row>
        <el-row class="detail_row" type="flex">
          <span class="detail_label">地点：</span><span class="detail_value">
            <div class="list_content">
              <span class="list_span">
                {{data.site}}
              </span>
            </div>
          </span>
        </el-row>
        <el-row class="detail_row" type="flex">
          <span class="detail_label">时间：</span><span class="detail_value">
            <div class="list_content">
              <span class="list_span">
                {{data.time}}
              </span>
            </div>
          </span>
        </el-row>
        <el-row class="detail_row" v-if="data.type === '1'" type="flex">
          <span class="detail_label">人员组：</span><span class="detail_value">
            <div class="list_content">
              <span class="list_span">
                {{data.personGroupList}}
              </span>
            </div>
          </span>
        </el-row>
      </div>
      <div class="info" v-if="isSimilarity">
        <el-row class="detail_row">
          <span class="detail_label"></span><span class="detail_value">
            <div class="list_content similarity">
              <span class="list_span">
                {{data.deviceName}}
              </span>
            </div>
          </span>
        </el-row>
        <el-row class="detail_row">
          <span class="detail_label"></span><span class="detail_value">
            <div class="list_content similarity">
              <span class="list_span">
                {{data.time}}
              </span>
            </div>
          </span>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 是否为相似度展示
    isSimilarity: {
      type: Boolean,
      default: false
    },
    // 标题背景
    titleBgCls: {
      type: String,
      default: 'def_bg'
    },
    // 头部标题
    title: {
      type: String,
      default: ''
    },
    // 是否展示跳转字段
    showRouterLink: {
      type: Boolean,
      default: true
    },
    //
    small: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    toTrack() {
      this.$router.push({ path: '/track' })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  width: 248px;
  height: 168px;
  background: rgba(255, 255, 255, 1);
  // border: 1px solid rgba(103, 120, 167, 1);
  opacity: 1;
  border-radius: 4px;
  margin: 0 30px 30px 0;
  header {
    height: 32px;

    border-radius: 4px 4px 0px 0px;
    opacity: 1;
    .similarity_content,
    .def_content {
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 5px;
      font-size: 14px;
      //   font-family: Source Han Sans CN;
      font-weight: 500;
      line-height: 16px;
      color: rgba(255, 255, 255, 1);
      opacity: 1;
    }
    .similarity_content {
      justify-content: center;
      position: relative;
      .text {
        color: #334d77;
      }
      .xsd {
        position: absolute;
        right: 10px;
        color: #5662ff;
        .xsd_num {
          font-size: 24px;
          // font-family:Source Han Sans CN;
          font-weight: 800;
          opacity: 1;
        }
      }
    }
    .def_content {
      justify-content: flex-end;
    }
  }
  // 默认色
  .def_bg {
    background: rgba(157, 172, 202, 1);
    .def_content {
      font-size: 14px;
      // font-family: Source Han Sans CN;
      font-weight: bold;
      color: rgba(86, 98, 255, 1);
    }
  }
  // 陌生人
  .stranger {
    background: linear-gradient(
      159deg,
      rgba(252, 235, 165, 1) 0%,
      rgba(252, 217, 102, 1) 100%
    );
    .def_content {
      font-size: 14px;
      // font-family: Source Han Sans CN;
      font-weight: 500;
      color: rgba(224, 32, 32, 1);
    }
  }
  .content {
    padding: 10px;
    display: flex;
    justify-content: center;
    height: 120px;
    border: 1px solid rgba(103, 120, 167, 1);
    border-top: none;
    border-radius: 0 0 4px 4px;
    .image {
      width: 90px;
      position: relative;
      top: -25px;
      height: 100%;
      img {
        width: 100%;
        height: 120px;
      }
      .go_router {
        text-align: center;
        font-size: 14px;
        // font-family:Source Han Sans CN;
        font-weight: 500;
        line-height: 24px;
        color: rgba(86, 98, 255, 1);
        text-decoration: underline;
        opacity: 1;
        margin: 0;
        cursor: pointer;
      }
    }
    .info {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      .detail_row {
        margin: 0;
        .detail_label {
          width: 80px;
          font-size: 14px;
          //   font-family: Source Han Sans CN;
          font-weight: bold;
          line-height: 24px;
          color: rgba(48, 49, 51, 1);
          opacity: 1;
          flex-grow: 0;
          flex-shrink: 0;
          text-align: right;
        }
        .detail_value {
          font-size: 14px;
          font-weight: 400;
          color: rgba(0, 0, 0, 1);
          opacity: 1;

          .list_content {
            // line-height: 28px;
            &.similarity {
              padding-left: 30px;
              margin-bottom: 5px;
            }
            padding-top: 3px;
            .list_span {
              display: inline-block;
              margin: 0 10px 0 0;
              height: 20px;
            }
          }
        }
      }
    }
  }
}
.similarity_container {
  height: 152px;
  .content {
    height: 100px;
  }
  &.small {
    height: 115px;
    .content {
      height: 60px;
      .image {
        width: 60px;
        img {
          height: 80px;
        }
      }
    }
  }
}
</style>

<template>
  <div class="dashboard-container" :style="{height:tHeight+'px'}">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-row>
          <el-col>
            <el-card>
              <div class="avatar-container">
                <div class="avatar-wrapper">
                  <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
                  <span class="user-name">{{name}}</span>
                  <div class="user-xm">
                    <span>
                      <span class="xmname">所属单位:{{user.Dwmc}}</span>
                    </span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-card>
              <div slot="header" class="cardhead clearfix">
                <i class="fa fa-newspaper-o"></i>
                <span>访问日志</span>
              </div>
              <el-scrollbar class="leftbar" style="height:170px">
                <div v-for="item in logData" :key="item.id" class="text item">
                  <span class="tztitle " style="width:120px;">登录系统</span>
                  <span class="tztitle tzsj" style="width:90px;"> {{item.LOGTIME|parseTime3('yyyy-MM-dd')}}</span>
                  <span class="tztitle dlip" style="margin-left:20px;">
                    <el-tag type="warning">{{item.USERIP}}</el-tag>
                  </span>
                </div>
              </el-scrollbar>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="10">
          <el-col :span="6">
            <infor-card id-name="addrw" :end-val="form.N1" iconType="tickets" color="#2d8cf0" intro-text="本年立项"></infor-card>
          </el-col>
          <el-col :span="6">
            <infor-card id-name="bnjh" :end-val="form.N2" iconType="tickets" color="#ffd572" intro-text="本年计划"></infor-card>
          </el-col>
          <el-col :span="6">
            <infor-card id-name="jnjz" :end-val="form.N3" iconType="news" color="#f25e43" intro-text="本年接转"></infor-card>
          </el-col>
          <el-col :span="6">
            <infor-card id-name="xmhz" :end-val="form.N4" iconType="news" color="rgb(100, 213, 114)" intro-text="项目汇总"></infor-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-card class="box-card">
              <div slot="header" class="cardhead clearfix">
                <i class="fa fa-bullhorn"></i>
                <span>通知公告</span>
              </div>
              <el-scrollbar class="leftbar" style="height:230px">
                <div v-for="item in tzData" :key="item.id" @click="tzstate(item)" class="text item">
                  <span class="tztitle">{{item.TITLE}}</span>
                  <span class="tztitle" v-if="item.ZT==1">
                    <el-tag type="info">已读</el-tag>
                  </span>
                  <span class="tztitle" v-else>
                    <el-tag type="warning">未读</el-tag>
                  </span>
                  <span class="tztitle tzsj"> {{item.XDSJ|parseTime3('yyyy-MM-dd')}}</span>
                </div>
              </el-scrollbar>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getXmCount, getXDTZ, changeXDXM } from 'api/xmgl/xdjh/index.js'
import { getSysLog } from 'api/common/xm.js'
import { mapGetters } from 'vuex'
// import CountTo from 'vue-count-to'
import inforCard from '../../components/Common/infoCard'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters(['avatar', 'name', 'user', 'rightHeight'])
  },
  watch: {
    rightHeight(val) {
      this.setHeight()
    }
  },
  components: {
    inforCard
  },
  data() {
    return {
      startVal: 0,
      tHeight: 0,
      tzData: [],
      logData: [],
      form: {
        lx: 0,
        all: 0,
        jnjz: 0,
        jnjh: 0
      }
    }
  },

  mounted() {
    this._getXmCount()
    this.setHeight()
    this._getXDTZ()
    this._getUserLog()
  },
  methods: {
    _getUserLog() {
      getSysLog().then(response => {
        // GNM 添加按日期倒序显示
        this.logData = response.data.sort(
          (pre, next) => (pre.LOGTIME > next.LOGTIME ? -1 : 1)
        )
      })
    },
    // 通知更改
    tzstate(item) {
      if (item.ZT == 0) {
        this.$confirm('你确定要将该消息改为已读吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          changeXDXM({ id: item.ID }).then(response => {
            this._getXDTZ()
          })
        })
      }
    },
    // 获取下达通知
    _getXDTZ() {
      getXDTZ().then(response => {
        // GNM 添加按日期倒序显示
        this.tzData = response.data.sort(
          (pre, next) => (pre.XDSJ > next.XDSJ ? -1 : 1)
        )
      })
    },
    setHeight() {
      this.tHeight = this.rightHeight - 1
    },
    _getXmCount() {
      getXmCount().then(response => {
        // console.info(response.data[0])
        this.form = response.data[0]
      })
    }
  }
}
</script>
<style>
.el-scrollbar__wrap {
  overflow: auto;
}
.dashboard-container {
  margin-top: -5px;
  padding: 20px 10px;
  position: relative;
  background-color: #f0f0f0;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.el-card__header {
  padding: 0 !important;
}
.leftbar {
  overflow: hidden;
}
.tztitle {
  font-size: 13px;
  line-height: 30px;
  cursor: pointer;
}
.tzsj {
  float: right;
  width: 80px;
}
.avatar-container {
  height: 120px;
  display: inline-block;

  color: #fff;
  width: 100%;
  .avatar-wrapper {
    cursor: pointer;
    // line-height: 100px;
    height: 100%;
    position: relative;
    .user-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: inline-block;
      vertical-align: middle;
    }
    .user-name {
      margin-left: 30px;
      font-size: 2em;
      color: #2d8cf0;
      position: absolute;
      top: 15px;
    }
    .fgline {
      height: 0;
      width: 210px;
      border-bottom: 1px solid #ccc;
      position: absolute;
      right: 0;
      top: 65px;
    }
    .user-xm {
      position: absolute;
      margin-left: 130px;
      top: 70px;
      font-size: 20px;
      color: rgb(33, 33, 33);
      width: 500px;
      .xmname {
        font-size: 14px;
        margin: 0 3px;
      }
    }
  }
}
.cardhead {
  color: #2d8cf0;
}
</style>

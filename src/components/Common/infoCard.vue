 
<template>
  <el-card :body-style="{ padding: '0px' }" class="hovshadow">
    <div class="infor-card-con">
      <el-row style="height:100%;">
        <el-col class="infor-card-icon-con" :style="{backgroundColor: color, color: 'white'}" style="line-height:120px;" :span="8">
          <i :class="'el-icon-'+iconType" style="font-size:50px;"></i>
        </el-col>
        <el-col :span="16" class="height-100">
          <count-up class="infor-intro-num user-created-count" :id-name="idName" :end-val="endVal" :color="color" :countSize="countSize" :countWeight="countWeight">
            <div class="infor-intro-text" slot="intro">{{ introText }}</div>
          </count-up>

        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import countUp from 'countUp';
export default {
  components: {
    countUp
  },
  name: 'inforCard',
  props: {
    idName: String,
    endVal: Number,
    color: String,
    iconType: String,
    introText: String,
    countSize: {
      type: String,
      default: '30px'
    },
    countWeight: {
      type: Number,
      default: 700
    },
    iconSize: {
      type: Number,
      default: 40
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.hovshadow:hover {
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1); 
}
.infor-card-icon-con {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  height: 100%;
  i {
    text-align: center;
    margin: 0 auto;
  }
}
.height-100 {
  height: 100%;
}
.infor-card-con {
  height: 100px;
  &:hover {
    // box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);
  }
}

.infor-intro-num {
  font-size: 30px;
  font-weight: 700;
  line-height: 55px;
  text-align: center;
}
.infor-intro-text {
  line-height: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #c8c8c8;
}
</style>


<!-- 科协工作-项目评审 -->
<template>
  <div class="jfsb">
    <el-row>
      <el-col>
        <el-form label-position="left" style="width:500px;" label-width="100px">
          <el-form-item label="评委姓名：">
            <el-select v-model="value" placeholder="选择评委">
              <el-option label="黄玉刚" value="1"> </el-option>
              <el-option label="李明" value="2"> </el-option>
              <el-option label="张三" value="2"> </el-option>
              <el-option label="李四" value="2"> </el-option>
              <el-option label="王五" value="2"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="打分：">
            <el-rate v-model="value1"></el-rate>
          </el-form-item>
          <el-form-item label="评委评价：">
            <el-input></el-input>
          </el-form-item>
        </el-form>
          <el-button type="primary" @click="onSubmit">提交打分评价</el-button>

      </el-col>
    </el-row>

  </div>
</template>

<script >
export default {
  name: 'bbgl',
  data() {
    return {
      value1: null,
      value:null
    }
  }
}
</script>
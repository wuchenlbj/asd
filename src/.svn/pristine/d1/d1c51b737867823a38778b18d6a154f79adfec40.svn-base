<!-- 科协工作-项目评审 -->
<template>
  <div class="jfsb">
    <el-row >
      <el-col class='actions-top'>
        <el-select v-model="value" placeholder="按专业">
          <el-option label="采油专业" value="1"> </el-option>
          <el-option label="科研专业" value="2"> </el-option>
        </el-select>
          <el-select v-model="value" placeholder="按单位">
          <el-option label="采油专业" value="1"> </el-option>
          <el-option label="科研专业" value="2"> </el-option>
        </el-select>
        <el-input  placeholder="抽取人数" value="5" style="width:100px;"></el-input>

        <el-button type='primary' icon=''>随机抽取评委</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-bottom:10px;">
      <div class="bgtip">
          抽取专家：黄玉刚、李明、张三、李四、王五
      </div>
    </el-row>
    <el-table border header-row-class-name="headclass">
      <el-table-column prop="date" label="序号" width="100">
      </el-table-column>
      <el-table-column prop="name" label="评委姓名">
      </el-table-column>
      <el-table-column prop="date" label="性别">
      </el-table-column>
      <el-table-column prop="address" label="年龄">
      </el-table-column>
      <el-table-column prop="address" label="专业">
      </el-table-column>
      <el-table-column prop="address" label="...">
      </el-table-column>
      <el-table-column prop="address" width="100" label="备注">
      </el-table-column>
    </el-table>

  </div>
</template>

<script >
export default {
  name: 'bbgl',
  data() {
    return {

    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.bgtip {
 background-color: rgb(252,248,227);margin-top: 5px;
 height:60px;line-height: 60px;border: 1px solid #eee;padding-left: 20px;
 font-size: 20px;
}
</style>

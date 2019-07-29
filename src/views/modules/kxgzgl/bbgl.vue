<!-- 科协工作-报表管理 -->
<template>
  <div class="jfsb">
    <el-row>
      <el-col :span="4" class='actions-top'>
        <el-button style="margin-left:20px;" type='primary' icon='upload2' @click='onDeleteUser(true)'>上传Excel</el-button>
      </el-col>
      <el-col :offset="14" :span="6">
        <el-form :inline="true" label-width="100px" class="demo-form-inline">
          <el-form-item label="月份:">
            <el-date-picker align="left" type="month" placeholder="选择年月">
            </el-date-picker>
             <el-button type='primary' icon='' >查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-table border header-row-class-name="headclass">
      <el-table-column prop="date" label="序号" width="100">
      </el-table-column>
      <el-table-column prop="name" label="Excel名称" width="320">
      </el-table-column>
      <el-table-column prop="date" label="大小" width="100">
      </el-table-column>
      <el-table-column prop="address" label="上传人" width="100">
      </el-table-column>
      <el-table-column prop="address" width="120" label="上传时间">
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
<!-- 成果管理-信息采集 -->
<template>
	<div class="jfsb">
 
	 <el-table 
    border
    style="width: 100%">
    <el-table-column
      prop="date"
      label="序号"
      width="100">
    </el-table-column>
    <el-table-column
      prop="name"
      label="交流会名称"
      width="120">
    </el-table-column>
    <el-table-column
      prop="date"
      label="主办单位"
      width="100">
    </el-table-column>
    <el-table-column
      prop="address"
      label="协办单位"  width="100">
    </el-table-column>
      <el-table-column
      prop="address"   width="100"
      label="会议主题">
    </el-table-column>
      
     <el-table-column
      prop="address"  width="100"
      label="会议时间">
    </el-table-column>
    
     <el-table-column
      prop="address"   width="100"
      label="会议地点">
    </el-table-column>
     <el-table-column
      prop="address"   width="100"
      label="参与人员">
    </el-table-column> 
     <el-table-column
      prop="address"   width="100"
      label="备注">
    </el-table-column>
     
  </el-table>
  </div>
</template>

<script >
	export default{
		name:'jlglxxcj',
		data(){
			return{

			}
		}
	}
</script>
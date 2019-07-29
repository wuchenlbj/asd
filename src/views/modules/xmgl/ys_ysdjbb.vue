<!-- 验收管理 验收登记汇总表 -->
<template>
	<div class="jfsb">
			<h3 style="text-align:center;" >延长油田股份有限公司科技项目验收登记表</h3>
       <el-table v-loading='loading'   size='mini' ref="htqt" border :data="xmxxSelect" style="width: 100%;margin:10px 0;" >
      
        <el-table-column type="index" label="序号"  width="50"></el-table-column>
        <el-table-column prop="XMBH" label="项目编号" width="110"></el-table-column>
        <el-table-column prop="XMMC" label="项目名称" min-width="120"></el-table-column>
        <el-table-column prop="KTBH"  label="课题编号" width="110"></el-table-column>
        <el-table-column prop="KTMC" label="课题名称"  min-width="120"></el-table-column>
        <el-table-column prop="FZDW" label="项目承担单位" show-overflow-tooltip  width="110"></el-table-column>
        <el-table-column prop="XMFZR" label="项目负责人"  width="85"></el-table-column>       
				<el-table-column label="项目批次" show-overflow-tooltip   width="100">
					<template slot-scope="scope">
						<span style="">{{ scope.row.JHND }}年{{ scope.row.XMPC }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="JHFY" label="计划费用"  width="85"></el-table-column>       
				<el-table-column prop="WXDWDM" label="协作单位"  width="85"></el-table-column>       
				<el-table-column prop="HTJ" label="合同价(万元)"  width="65"></el-table-column>       
        <el-table-column  label="第一次验收时间" show-overflow-tooltip  min-width="110">
					<template slot-scope="scope">
						<span >{{ scope.row.DYCYSSJ| parseTime2 }}</span>
					</template>
				</el-table-column>       
				<el-table-column prop="DYCYSJG"  label="验收结果" show-overflow-tooltip  width="70"></el-table-column>       
				<el-table-column  label="第二次验收时间" show-overflow-tooltip  min-width="110">
					<template slot-scope="scope">
						<span >{{ scope.row.DECYSSJ| parseTime2 }}</span>
					</template>
				</el-table-column>       
				<el-table-column prop="DECYSJG"label="验收结果" show-overflow-tooltip width="70"></el-table-column>       
				<el-table-column label="第三次验收时间" show-overflow-tooltip  min-width="110">
					<template slot-scope="scope">
						<span >{{ scope.row.DSCYSSJ| parseTime2 }}</span>
					</template>	
				</el-table-column>       
				<el-table-column prop="DSCYSJG" label="验收结果" show-overflow-tooltip  width="70"></el-table-column>     
				<el-table-column prop="YSCGJJ"  label="项目成果简介"   min-width="100"></el-table-column>     
        <el-table-column  prop="BZ"  label="备注"  min-width="100"></el-table-column>
      </el-table>
  </div>
</template>

<script >

import { getReportYSDJ } from "api/xmgl/ysgl/index.js"
export default {
	name: 'ysdj',
	data() {
		return {
			loading: false,
			xmxxSelect: []
		}
	},
	methods: {
		// 获取合同信息
		getXX() {
			this.loading = true
			getReportYSDJ({ type: this.pagetype }).then(response => {
				this.xmxxSelect = response.data
				this.loading = false
			})
		}
	},
	mounted() {
		this.getXX()
	}
}
</script>
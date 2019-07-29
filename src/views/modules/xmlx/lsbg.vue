<!-- 历史变更 -->
<template>
	<div>
		<div class="linetitle">
			<div class="tt">历史变更数据</div>
		</div>
		<el-table v-loading="loading" :data="tableData" :height="tableHeight" border style="width: 100%" header-row-class-name="headclass">
			<el-table-column prop="XMBH" label="项目编号" show-overflow-tooltip width="80"></el-table-column>
			<el-table-column prop="XMMC" label="项目名称" show-overflow-tooltip width="180"></el-table-column>
			<el-table-column prop="KTBH" label="课题编号" show-overflow-tooltip width="110"></el-table-column>
			<el-table-column prop="KTMC" label="课题名称" show-overflow-tooltip width="180"></el-table-column>
			<el-table-column prop="DZZDDM" label="调整字段代码" width="100"></el-table-column>
			<el-table-column prop="DZQNR" label="调整前内容" show-overflow-tooltip min-width="120"></el-table-column>
			<el-table-column prop="DZHNR" label="调整后内容" show-overflow-tooltip min-width="120"></el-table-column>
			<el-table-column label="调整时间" show-overflow-tooltip width="140">
				<template slot-scope="scope">
					<span>{{ scope.row.DZSJ|parseTime2 }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="LRR" label="调整人" width="80"></el-table-column>
		</el-table>
		<div class="pagination-container" style="margin-top:1px;">
			<el-pagination background @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-size="listQuery.limit" layout="total,prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</div>
</template>

<script >

import { mapGetters } from 'vuex'; // GNM
import { getTZList } from 'api/xtsz/sy'
export default {
  name: 'lsbg',
  data() {
    return {
      tableHeight: 0,
      loading: false,
      total: null,
      tableData: [],
      listQuery: {
      tbanem: 4, // 历史变更
      typeid: 0,
      page: 1,
      limit: 20,
      title: ''
    }
    }
  },
  // GNM
  computed: {
    ...mapGetters(['rightHeight'])
  },
  watch: {
    rightHeight (val) {
      this.tableHeight = val - 120
    }
  },
  mounted() {
    this.tableHeight = this.rightHeight - 120 // GNM
    this.getList()
    // GNM 添加简单的功能说明
    this.$store.dispatch('SetHelpContent', `
    <span style="font-size:14px;font-weight:bold">功能说明：</span><br/>
    <span>&nbsp;&nbsp;1、此功能显示项目基本信息历次变更的内容</span><br/>
    <span>&nbsp;&nbsp;2、鼠标放到单元格时，会显示详细内容</span><br/>
    `)
  },
  destroyed () {
    this.$store.dispatch('SetHelpContent', '')
  },
  methods: {
		// 分页获取数据 查询历史变更数据
    getList() {
      this.loading = true
      getTZList(this.listQuery).then(response => {
      this.tableData = response.data.rows
      this.total = response.data.total
      this.loading = false
    })
    },
		// 每页条数size
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
		// 当前页currentPage改变
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>
<style scoped>
.linetitle {
  width: 98%;
  border-bottom: 1px solid #6691d1;
  padding: 10px 0;
  height: 50px;
  position: relative;
  margin: 0 auto 20px 0;
}
.tt {
  font-size: 18px;
  color: #13438b;
  width: 130px;
  line-height: 40px;
  text-align: center;
}
</style>

<!-- 验收管理 验收登记\验收申报 -->
<template>
	<div class="jfsb">
    <el-alert v-show="!xmxxRow" title="请选择项目"  show-icon type="warning"></el-alert>
    
		<el-form :model="form"  ref="ruleForm"  :inline="true" label-width="100px" >
				<el-form-item v-if="xmxxRow"  label="项目编号：" prop="XMBH">
				<el-input disabled  v-model="xmxxRow.XMBH" style="width:180px;"  placeholder="项目名称"></el-input>
			</el-form-item>   
				<el-form-item v-if="xmxxRow"  label="项目名称" prop="XMMC">
				<el-input disabled  v-model="xmxxRow.XMMC" style="width:180px;"  placeholder="项目名称"></el-input>
			</el-form-item>      
				<el-form-item v-if="xmxxRow"  label="课题编号：" prop="KTBH">
				<el-input disabled  v-model="xmxxRow.KTBH" style="width:180px;"  placeholder="课题编号："></el-input>
			</el-form-item>   
			<el-form-item v-if="xmxxRow"  label="课题名称：" prop="KTMC">
				<el-input disabled v-model="xmxxRow.KTMC"  style="width:180px;"   placeholder="课题名称："></el-input>
			</el-form-item>	
			
			<el-form-item  v-if="xmxxRow" label="项目状态："> 
					<div   style="display:block; width:180px;color:#409EFF;text-align:left;">{{stateTxt}}</div>
			</el-form-item>	
			<el-form-item  v-if="xmxxRow" style="width:600px;margin-left:30px;"> 
			</el-form-item>	
				
			<el-form-item  v-if="xmxxRow&&showbtn" style="margin-left:200px;">
				<el-button type="primary" :loading="loadingbtnsave"  @click="submitForm('ruleForm')">{{btnTxt}}</el-button>
			</el-form-item>		
		</el-form>

  </div>
</template>

<script >
import { mapGetters } from 'vuex'
import { getYsxx, saveYssb } from 'api/xmgl/ysgl/index.js'
import msg from 'utils/loadmsg'

export default {
	name: 'yssb',
	data() {
		return {
			showbtn: true,
			btnTxt: '项目一次申报',
			loadingbtnsave: false,
			form: {
				XMBH: '',
				KTBH: '',
				ZT: '',
				BZ: '',
				TYPE: ''
			},
			loading: false,
			stateTxt: ''
		}
	},
	computed: {
		...mapGetters(['xmxxRow'])
	},
	mounted() {
		if (this.xmxxRow) {
			this.getysxx(this.xmxxRow)
		}
	},
	watch: {
		xmxxRow: function (row) {
			this.getysxx(row)
		}
	},
	methods: {
		// 查询申报信息
		getysxx(row) {
			getYsxx({ xmbh: row.XMBH, ktbh: row.KTBH }).then(response => {
				this.form.XMBH = row.XMBH
				this.form.KTBH = row.KTBH
				this.showState(response.data[0])
			})
		},
		showState(data) {

			if (!data) {
				this.stateTxt = '暂未申报'
				this.form.ZT = 0
				this.form.TYPE = 'add'
				this.btnTxt = '项目一次申报'
				this.showbtn = true
			} else {
				this.form.ZT = data.ZT
				if (data.ZT == '2' || data.ZT == '5') {
					this.showbtn = true
					this.form.TYPE = 'edit'
				} else {
					this.showbtn = false
				}
				if (data.ZT == '0') {
					this.stateTxt = '等待第一次验收安排'
				} else if (data.ZT == '1') {
					this.stateTxt = '等待第一次评审'
				} else if (data.ZT == '2') {
					this.stateTxt = '等待二次申报'
					this.btnTxt = '项目二次申报'
				} else if (data.ZT == '3') {
					this.stateTxt = '等待第二次验收安排'
				} else if (data.ZT == '5') {
					this.stateTxt = '等待三次申报'
					this.btnTxt = '项目三次申报'
				} else if (data.ZT == '6') {
					this.stateTxt = '等待第三次验收安排'
				} else if (data.ZT == '-1') {
					this.stateTxt = '验收完毕'
				}
			}
		},
		// 保存项目立项
		submitForm(formName) {
			var _this = this
			this.loadingbtnsave = true
			saveYssb(this.form).then(response => {
				msg.showsuccess('保存数据成功')
				_this.loadingbtnsave = false
				//
				this.showState(response.data)

			})
		}
	}

}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-form {
  width: 680px;
}
.el-form-item {
  margin-bottom: 10px;
}
</style>
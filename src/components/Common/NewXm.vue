<template>
  <div class="" >
     <el-scrollbar class="page-component__nav" style="height:500px;">
    <el-form ref="form" :inline="true" label-width="80px">
  
      <el-form-item label="项目编号">
         <el-select v-model="form.XMBH" filterable remote  placeholder="请输入项目编号"  >
          <el-option
            v-for="item in xmbhList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目名称">
        <el-input v-model="form.XMMC" placeholder="项目名称"></el-input>
      </el-form-item>
      <el-form-item label="课题编号">
        <el-input v-model="form.KTBH" placeholder="课题编号" ></el-input>
      </el-form-item>
      <el-form-item label="课题名称">
        <el-input v-model="form.KTMC" placeholder="课题名称"></el-input>
      </el-form-item>
     <el-form-item label="计划年度">
        <el-date-picker  v-model="form.JHND" align="right"  type="year" placeholder="计划年度">
      </el-date-picker>
       </el-form-item>
      <el-form-item label="负责单位">
        <el-select v-model="form.FZDWDM" placeholder="请选择" >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="项目批次">
        <el-select v-model="form.XMPCDM" placeholder="请选择" >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="项目级别">
        <el-select v-model="form.XMJBDM" placeholder="请选择" >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="项目分类">
        <el-select v-model="form.XMFLDM" placeholder="请选择" >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参加单位">
        <el-select v-model="form.CJDWDM" placeholder="请选择" >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="协作单位">
        <el-select v-model="form.XZDWDM" placeholder="请选择" >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="立项依据">  
        <el-input type="textarea" v-model="form.LXYJ" placeholder="立项依据" style="width:475px;"></el-input>
      </el-form-item>
       <el-form-item label="研究内容">  
        <el-input type="textarea" v-model="form.ZYYJNR" placeholder="主要研究内容" style="width:475px;"></el-input>
      </el-form-item>
      <el-form-item label="技术经济指标">
        <el-input type="textarea" v-model="form.JSJJZB" placeholder="技术经济指标" style="width:475px;"></el-input>
      </el-form-item>
        <el-form-item label="成果提交方式">
        <el-input type="textarea" v-model="form.CGTJFS" placeholder="成果提交方式" style="width:475px;"></el-input>
      </el-form-item>
      <el-form-item label="协作单位">
        <el-select v-model="form.xzdw" placeholder="请选择" >
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="项目负责人">
        <el-input v-model="form.XMFZR" placeholder="项目负责人"></el-input>
      </el-form-item>
      <el-form-item label="参加人员">
        <el-input v-model="form.CJRY" placeholder="参加人员"></el-input>
      </el-form-item>
      <el-form-item label="起止时间">
        <el-date-picker type="date" placeholder="开始时间" v-model="form.JHQSSJ"></el-date-picker>
         <span class="line">至</span>
          <el-date-picker type="date" placeholder="结束时间" v-model="form.JHZZSJ"></el-date-picker>
      </el-form-item>
     <el-form-item label="备注">  
        <el-input type="textarea" v-model="form.BZ" placeholder="备注" style="width:475px;"></el-input>
      </el-form-item>
      <el-form-item   style="margin-left:200px;">
        <el-button type="primary">立即创建</el-button>
        <el-button>清空</el-button>
      </el-form-item>
    </el-form>
  </el-scrollbar>
    </div>
</template>
<script>
// 立项申报
export default {
  name: "newxm",
  data() {
    return {
      xmbhList: [], // 项目编号的数据源
      // 表单内容
      form: {
        JHND: "",
        XMBH: "",
        KTBH: "",
        XMMC: "",
        KTMC: "",
        FZDWDM: "",
        XMPCDM: "",
        XMJBDM: "",
        XMFLDM: "",
        LXYJ: "",
        ZYYJNR: "",
        JSJJZB: "",
        CGTJFS: "",
        CJDWDM: "",
        XZDWDM: "",
        XMFZR: "",
        CJRY: "",
        JHQSSJ: "",
        JHZZSJ: "",
        SPJG: "",
        BZ: ""
      }
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style scoped >
.el-dialog__body {
  padding: 30px 0px 10px 20px;
}

.el-form {
  width: 650px;
  margin: 10px;
}
.line {
  width: 75px;
  text-align: center;
  box-sizing: border-box;
  display: inline-block;
}
</style>

<style>
label {
  font-weight: 500 !important;
}
</style>


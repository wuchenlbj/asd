<template>
  <div class="xmna">
    <el-form :inline="true" label-width="100px" class="demo-form-inline">
      <el-form-item label="选择项目:">
        <el-date-picker align="right" type="year" placeholder="选择年">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane name="first">
        <span slot="label">
          <i class="fa fa-home fa-lg"></i> 按申报单位</span>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label">
          <i class="fa fa-book fa-lg"></i> 按项目类型</span>
      </el-tab-pane>
    </el-tabs>
    <ul>
      <li v-for="(item, index) in xmlist" @click="toTab(item.id,index)">
        <div class="licard">
          <img :src="'../../public/images/xm.png'">
          <span class="cardtext">{{item.name}}</span>
        </div>
      </li>
    </ul>

  </div>
</template>
<script >
export default {
  data() {
    return {
      activeName: 'second',
      xmlist: [{ name: '科研项目1', type: 0 },
      { name: '科研项目2', type: 0 },
      { name: '科研项目3', type: 0 },
      { name: '科研项目4', type: 0 },
      { name: '科研项目5', type: 0 },
      { name: '科研项目6', type: 0 },
      { name: '科研项目7', type: 0 }
      ]
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style scoped>
.el-tabs__header {
  margin: 0 0 5px;
}
.xmna {
  position: relative;
  height: 170px;
  border-bottom: 2px solid #ffc000;
  margin-bottom: 10px;
}
.demo-form-inline {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 99999;
}
ul {
  list-style-type: none;
  padding: 0;
  width: 100%;
  position: relative;
  padding-left: 50px;
  height: 120px;
}
li {
  margin: 0 4px;
  float: left;
  cursor: pointer;
  border: 1px solid #f5f1eb;
}
li:hover {
  border: 1px solid #ffc000;
  border-radius: 4px;
}
.licard {
  width: 90px;
  height: 85px;
  margin: 5px 0;
  padding-left: 10px;
  /*border: 1px solid #ccc; */
}
.licard > img {
  width: 50px;
  height: 50px;
  margin: 0 auto;
  padding-left: 13px;
}
.cardtext {
  display: inline-block;
  color: #0e7fb7;
  font-size: 1em;
  margin: 5px 0;
  text-align: center;
}

.el-row {
  margin-top: 400px;
}
.tztext {
  color: #0e7fb7;
  cursor: pointer;
}
</style>
<template>
  <div id="homedetail">
    <!-- 头部组件 -->
    <head-nav></head-nav>
    <!-- HomeDetail内容 -->
    <div class="searchwarp">
      <div class="search">
        <div class="search-match">
          <label for="top-search">

            <i class="fa fa-search fa-lg"></i>
            <input type="search" id="search" name="keyword" placeholder="输入问题关键字，找到答案" autocomplete="off" x-webkit-speech="">
          </label>
          <ul id="search-match-list" class="match-list"></ul>
        </div>
        <input type="submit" name="" value="搜索">
      </div>
    </div>
    <div class="cardwarp">
      <ul id="ulcon">

        <li v-for="(item, index) in condata" @click="toTab(item.id,index)">

          <div class="licard">
            <img :src="'../../public/images/'+(index+1)+'.png'">
            <span class="cardtext">{{item.name}}</span>
            <span class="cardnum">0{{index+1}}</span>
            <span class="cardcon">{{item.con}}</span>
          </div>

        </li>

      </ul>

    </div>
  </div>
</template>
<script >
import { mapGetters } from 'vuex'
import HeadNav from '../../components/Common/HeadNav.vue';

export default {
  name: 'homedetail',
  components: {
    HeadNav
  },
  data() {
    return {
      condata: [],
      cardcolors: ['#0E7FB7', '#B9D51F', '#F2685A', '#FFC001', '#2F5597', '#7030A0']
    }
  },
  computed: {
    ...mapGetters([
      'permission_routers'
    ])
  },
  mounted: function () {
    this.getRouterInfo();//获取路由信息
    // console.log(this.condata)
    this.lisetInterval(this.cardcolors);//执行动画
  },
  methods: {
    //获取路由信息
    getRouterInfo: function () {

      const accessedRouters = this.permission_routers.filter(v => {
         if(!v.hidden){

           if( v.children[0].path.indexOf('/')>-1){
              this.condata.push({ id:v.children[0].path, name: v.name, con: v.detail });
           }else{
              this.condata.push({ id:v.path+'/'+v.children[0].path, name: v.name, con: v.detail });
           }
         }
      })
    },
    lisetInterval: function (colordata) {

      var n = 0;
      var t = setInterval(function () {
        if (n >= 6) {
          window.clearInterval(t);
        } else {
          var li = document.getElementById("ulcon").getElementsByTagName("li")[n];
          if (li) {
            animateli(li, n, colordata[n]);
          }
          n++;
        }
      }, 300);

      function animateli(li, num, color) {
        li.style.cssText = "display:inline-block;color:" + color;
        li.getElementsByClassName('cardnum')[0].style.cssText = "background-color:" + color + ";border: 1px " + color + " solid;";
        li.className = "animated fadeInUpBig ";
      }
    },
    toTab: function (id, index) {
      var i = index + 1;
       //alert(id)
      this.$router.push({ path:  id }) // 两种方式 ,params:{id:i}
    }
  }
}
</script>
<style scoped>
.searchwarp {
  height: 120px;
  width: 100%;
  background-color: #f8f6f2;
  padding-top: 40px;
  background: url('../../assets/images/price-bg.jpg') top no-repeat;
  background-size: 100% auto;
  text-align: center;
  margin-top: 70px;
}

.search {
  margin: 0px auto;
  height: 50px;
  display: inline-block;
}

.search .search-match {
  float: left;
  position: relative;
}

.search i {
  position: absolute;
  left: 15px;
  font-size: 24px;
  line-height: 50px;
  color: #cccccc;
}

.search input[type=search] {
  background: #fff;
  height: 50px;
  width: 800px;
  padding-left: 48px;
  padding-right: 20px;
  border-radius: 0;
  border: none;
  font-size: 18px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
  border-radius: 3px 0 0 3px;
  transition: all ease 0.4s;
  outline: none;
}

.search input[type=search]::-webkit-input-placeholder {
  color: #9e9e9e;
}

.search input[type=search]:-moz-placeholder {
  color: #9e9e9e;
}

.search input[type=search]::-moz-placeholder {
  color: #9e9e9e;
}

.search input[type=search]:-ms-input-placeholder {
  color: #9e9e9e;
}

.search input[type=submit] {
  height: 50px;
  border-radius: 0;
  border: none;
  background-color: #4bbcb7;
  width: 90px;
  color: #fff;
  font-size: 18px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
  border-radius: 0 3px 3px 0;
}

.cardwarp {
  width: 1150px;
  height: 450px;
  margin: 50px auto;
}

ul {
  list-style-type: none;
  padding: 0;
  width: 100%; height: 100%; overflow-y: hidden;
  position: relative;
}

li {
  margin: 0 4px;
  display: none;
  float: left;
  cursor: pointer;
  border: 1px solid #f8f6f2;
}

li:hover {
  border: 1px solid #FFC001;
  border-radius: 4px;
}

.licard {
  width: 180px;
  height: 100%;
  margin: 10px 0;
  padding-left: 10px;
  /*border: 1px solid #ccc; */
}

.licard>img {
  width: 160px;
  height: 160px;
}

.cardtext {
  display: inline-block;
  font-size: 1.5em;
  margin: 10px 0;
}

.cardnum {
  display: block;
  width: 30px;
  margin-left: 7px;
  height: 26px;
  line-height: 26px;
  color: #fff;
  position: relative;
  text-align: center;
}

.cardcon {
  display: block;
  width: 80%;
  text-align: left;
  ;
  font-size: 1.2em;
  margin: 15px;
  margin-left: 5px;
}
</style>

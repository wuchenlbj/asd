<template>
  <!-- swiper -->
  <swiper :options="swiperOption">
    <swiper-slide>
      <div  v-show="sliderIndex==0"  class="slider-containder slider-containder1"   v-bind:class="[sliderIndex==0?'animated slideInUp anidelay':'']">
        <div class="main">
          当年项目立项方案
        </div>
        <div class="sub">
          项目初步设想方案，为项目计划的正式下达奠定基础。
        </div>
      </div>
      <img src="../../../public/images/slide-1-v3.jpg" alt="background-image" class="background">

    </swiper-slide>
    <swiper-slide>
      <div v-show="sliderIndex==1"   class="slider-containder slider-containder2" v-bind:class="[sliderIndex==1?'animated slideInUp anidelay':'']">
        <div class="main">
          项目计划
        </div>
        <div class="sub"   >
          协调项目编制，指导项目执行，明确项目信息，分发下达责任部门
        </div>
      </div>
      <img src="../../../public/images/slide-2-v3.jpg" alt="background-image" class="background">
    </swiper-slide>
    <swiper-slide>
      <div  v-show="sliderIndex==2"   class="slider-containder slider-containder3" v-bind:class="[sliderIndex==2?'animated slideInUp anidelay':'']">
        <div class="main">
          资金管理
        </div>
        <div class="sub"  >
          跟踪项目挂账记录，落实项目结算清单，把控项目资金运转
        </div>
      </div>
      <img src="../../../public/images/slide-3.jpg" alt="background-image" class="background">
    </swiper-slide>
    <swiper-slide>
      <div    v-show="sliderIndex==3"  class="slider-containder slider-containder4" v-bind:class="[sliderIndex==3?'animated slideInUp anidelay':'']">
        <div class="main" >
          成果管理
        </div>
        <div class="sub">
          规范项目资料归档，统计项目专利、软著信息，评价项目推广应用
        </div>
      </div>
      <img src="../../../public/images/slide-4.jpg" alt="background-image" class="background">
    </swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>

import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  components: {
    swiper,
    swiperSlide
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    },
    sliderIndex() {
      return this.sliderI;
    } 
  },
  data() {
    var _this=this
    return {
      sliderI: 0,
      activeAnimate:{

      },
      swiperOption: {
        notNextTick: true,
        pagination: '.swiper-pagination',
        direction: 'vertical',
        autoplay: 5000,//可选选项，自动滑动
        slidesPerView: 1,
        paginationClickable: true,
        // spaceBetween: 30,
        speed: 1000,
        height: window.innerHeight,
        mousewheelControl: true,
        onSlideChangeEnd: function(swiper) {
          //animated fadeInUp
          _this.sliderI = swiper.activeIndex
        }
      }

    }
  }
}
</script>
<style>

</style>

<style scoped>
/* 修复分页条错位问题 */

.swiper-container {
  height: 100%;
}

.slider-containder {
  position: absolute;
  white-space: nowrap;
  color: white;
  font-family: PingFangSC-Light, PingFang SC, Roboto, Helvetica Neue, Helvetica, Microsoft YaHei, Hiragino Sans GB, WenQuanYi Micro Hei, sans-serif
}

.slider-containder .main {
  font-size: 30px;
  line-height: 35px;
  letter-spacing: 1.13px
}

.slider-containder .sub {
  margin-top: 10px;
  font-size: 18px;
  line-height: 25px;
  letter-spacing: .68px;
  -webkit-transition-delay: .5s;
  transition-delay: .5s  
}
.anidelay{
  /* animation-delay:0.5s */
}
.slider-containder1 {
  top: 200px;
  right: 20px;
}

.slider-containder2 {
  top: 232px;
  right: 242px; 
  color:#2e2e2e;
}

.slider-containder3 {
  top: 345px;
  right: 200px;
}

.slider-containder4 {
  top: 150px;
  right: 20px;
}

.background {
  margin-left: auto;
  display: block;
  height: 100%;
}

.swiper-pagination-bullet {
  display: block;
  margin-bottom: 12px;
  width: 4px;
  height: 25px;
  -webkit-transition: all .3s linear;
  transition: all .3s linear;
  cursor: pointer;
  background-color: hsla(0, 0%, 100%, .2)
}
</style>

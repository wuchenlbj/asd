<template>
  <svg class="svg-icon"  :class="wscnicon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: "icon-svg",
  props: {
    iconClass: {
      type: String,
      required: true
    },
    bigicon: {
      type: Boolean
    }
  },
   data() {
    return {
      wscnicon: ''
    };
  },
  mounted: function() {
    //炫动模式 大图标
    if (this.bigicon) {
      this.wscnicon = "wscn-icon2"
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.iconClass}`
    }
  }
};
</script>
 
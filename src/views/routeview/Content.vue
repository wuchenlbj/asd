<template>
    <div class="con">
        <transition name="fade" class='animated fadeIn'>
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
export default {
  name: "content",
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {}
};
</script>

<style >

</style>

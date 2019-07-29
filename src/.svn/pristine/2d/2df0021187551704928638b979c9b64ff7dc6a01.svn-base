<template>
  <file-upload :list-height="tbHeight"></file-upload>
</template>
<script>
import FileUpload from 'views/FileUpload'
export default {
  name: 'cgfile',
  components: {
    FileUpload
  },
  data() {
    return {
      tbHeight: 0
    }
  },
  props: {
    tableHeight: {
      type: Number
    }
  },
  watch: {
    tableHeight() {
      this._setHeight()
    }
  },
  methods: {
    _setHeight() {
      this.tbHeight = this.tableHeight
    }
  },
  mounted () {
    this._setHeight()
  }
}
</script>
<style>

</style>

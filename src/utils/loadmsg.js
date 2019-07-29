import { Message } from 'element-ui'

export default {

  // 显示loading
  showloading(msg) {
    Message({
      showClose: true,
      message: msg || '正在保存,请稍后...'
    })
  },
  showsuccess(msg) {
    Message({
      message: msg || '保存成功',
      showClose: true,
      type: 'success'
    })
  },
  showerror(msg) {
    Message({
      message: msg || '保存失败',
      showClose: true,
      type: 'error'
    })
  },
  // 警告信息
  showwarning(msg) {
    Message({
      message: msg || '警告内容',
      showClose: true,
      type: 'warning'
    })
  },
  hideloading() {
    Message.closeAll()
  }
}

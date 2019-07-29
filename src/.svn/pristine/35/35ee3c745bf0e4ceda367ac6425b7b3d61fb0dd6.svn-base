/*
 * @Author: 高年蒙
 * @Date: 2018-04-24 21:57:07
 * @Last Modified by: 高年蒙
 * @Last Modified time: 2018-04-26 12:08:15
 * @Descriptions: 实现VUE全局事件的注册
 * 1、监听路由变化
 * 2、监听对应Dom元素的点击事件
 */

/**
 * 监听事件的选项
 * EventTarget.addEventListener() 中事件监听选项有三个
 * capture:  Boolean，表示 listener 会在该类型的事件捕获阶段传播到该 EventTarget 时触发。
 * once:  Boolean，表示 listener 在添加之后最多只调用一次。如果是 true， listener 会在其被调用之后自动移除。
 * passive: Boolean，表示 listener 永远不会调用 preventDefault()。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。
 * mozSystemGroup: 只能在 XBL 或者是 Firefox' chrome 使用，这是个 Boolean，表示 listener 被添加到 system group。
 * Vue中事件修饰符有
 * .stop  阻止单击事件冒泡
 * .prevent 提交事件不再重载页面
 * .capture 对应addEventListener中的capture
 * .self 只当事件在该元素本身（而不是子元素）触发时触发回调
 * .once 对应addEventListener中的once
 * .passive（2.3.0+ 新增） 对应addEventListener中的passive
 *
 * 添加修饰符后，Vue解析后的会在$listeners中改为相应的前缀，对应如下
 */
const modifiersRE = /^[~!&]*/
const preOptions = {
  '!': 'capture',
  '~': 'once',
  '&': 'passive'
}

function extractEventOptions(eventDescriptor) {
  const [modifiers] = eventDescriptor.match(modifiersRE)
  return modifiers.split('').reduce((options, modifier) => {
    options[preOptions[modifier]] = true
    return options
  }, {})
}
export default {
  name: 'glbEvent',
  render: h => h(),
  data: () => {
    return {
      eventObj: {}
    }
  },
  watch: {
    $route(rtobj) {// 路由变化时，事件更新
      this.eventObj.val = '查看了' + rtobj.name
      this.eventObj.type = '查询'
    }
  },
  mounted() {
    this._listeners = Object.create(null)
    // Vue中对于组件监听的原生事件（用@或v-on），会统一放到$listeners中
    Object.keys(this.$listeners).forEach(event => {
      let listener = this.$listeners[event]
      let handler = e => {
        listener(e, this.eventObj)
      }
      document.attachEvent ?
        document.attachEvent(event.replace(/[!&~]/g, ''), handler) :
        document.addEventListener(
          event.replace(/[!&~]/g, ''),// 只保留事件名称
          handler,
          extractEventOptions(event)
        )
      this._listeners[event] = handler
    })
  },

  beforeDestroy() {
    for (const event in this._listeners) {
      document.removeEventListener(
        event.replace(/[!&~]/g, ''),
        this._listeners[event]
      )
    }
  }
}

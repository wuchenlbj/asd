import axios from 'axios'
import {
  Message
} from 'element-ui'
import store from '../store'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 60000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['ticket'] = store.getters.token
    if (!config.headers['moduleid']) { // 处理公共方法的moduleid
      config.headers['moduleid'] = store.getters.moduleid || ''
    }
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * 下面的注释为通过response自定义status来标示请求状态，当status返回如下情况为权限有问题，登出并返回到登录页
     * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
     */
    const res = response.data;
    if(!res) return Promise.reject('error');
    if (res.status === 400 || res.status === 401 || res.status === 504) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 4000,
        onClose: function () {
          store.dispatch('FedLogOut').then(() => {
            location.reload(); // 为了重新实例化vue-router对象 避免bug
          });
        }
      });

      return Promise.reject('error');
    } else {
      return response;
    }
  },
  error => {
    var msg

    if (error.response) { // ExceptionMessage
      if (error.response.status === 500) {
        msg = error.response.data.ExceptionMessage || error.response.data
      } else msg = error.response.data
    } else if (error.ExceptionMessage) msg = error.ExceptionMessage
    else msg = error.message

    Message({
      message: msg,
      type: 'error',
      showClose: true,
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

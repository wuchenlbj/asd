// 科协工作管理--评委打分

import fetch from 'utils/fetch';

// 获取当前项目的打分信息
export function getPSDfXX(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/KXGZ/GetPSDfXX',
    method: 'get',
    params: query
  })
}

// 获取评审分组下拉数据  附录-获取专业类型下拉数据
export function getPsfz(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/KXGZ/GetPSFZ',
    method: 'get',
    params: query
  })
}
// // 附录-获取专业类型下拉数据 
// export function getPszylx(query) {
//   return fetch({
//     baseURL: process.env.BASE_API,
//     url: '/api/KXGZ/GetPSFZ?type=2',
//     method: 'get',
//     params: query
//   })
// }

// 保存评审打分
export function savePSPZ(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/KXGZ/SavePSPZ',
    method: 'post',
    data
  })
}

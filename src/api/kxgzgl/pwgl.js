// 科协工作管理--评委管理


import fetch from 'utils/fetch';

// 获取专业下拉数据
export function getZY(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/KXGZ/GetZY',
    method: 'get',
    params: query
  })
} 
// 获取评审方式下拉数据
export function getPsfs(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/KXGZ/GetPsfs',
    method: 'get',
    params: query
  })
} 
// 保存评审配置 
export function savenewPSData (data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/KXGZ/SavenewPSData',
    method: 'post',
    data
  })
}
// 保存评审配置 
export function savePSData (data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/KXGZ/SavePSData',
    method: 'post',
    data
  })
}
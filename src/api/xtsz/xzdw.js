import fetch from 'utils/fetch';


// 保存协作单位
export function saveXZDW(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/SaveXZDW',
    method: 'post',
    data
  })
}
// 获取协作单位信息（下拉）
export function getXZDW(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/GetXzdwSelect',
    method: 'get',
    params: query
  })
} 
// 获取协作单位信息（列表）
export function getxzdwList(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/GetXzdw',
    method: 'get',
    params: query
  })
} 
// 获取协作单位黑名单信息（列表）
export function getXZDWHMD(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/GetXZDWHMD',
    method: 'get',
    params: query
  })
} 
// 删除协助单位 
export function delXzdw(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/DelXZDW',
    method: 'post',
    data
  })
}
// 更新协助单位 
export function updateHMD(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/UpdateHMD',
    method: 'post',
    data
  })
}

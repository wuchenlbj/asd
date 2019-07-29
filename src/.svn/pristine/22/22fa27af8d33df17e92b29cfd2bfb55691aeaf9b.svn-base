// 项目管理--合同管理

import fetch from 'utils/fetch';


// 保存申请材料
export function saveSQCL(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/SaveSQCL',
    method: 'post',
    data
  })
}
// 获取申请材料(已上报的)
export function getHaveSqXX(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/GetHaveSqXX',
    method: 'get',
    params: query
  })
}
// 获取申请材料
export function getSqXX(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/GetSqXX',
    method: 'post',
    data
  })
}
// 获取单个合同信息 
export function getHTXX(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/GetHTXX',
    method: 'post',
    data
  })
}

// 保存合同信息 
export function saveQTData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/SaveQTData',
    method: 'post',
    data
  })
}

// 保存excel数据入库
export function saveExcelData (data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/SaveHTExcelData',
    method: 'post',
    data
  })
}

// 签订方式
export function getQdfs(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/GetQdfs',
    method: 'get',
    params: query
  })
}

// 获取合同信息报表-洽谈-商谈-招标
export function getHTXXReport(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/GetHTXXReport',
    method: 'post',
    data
  })
}
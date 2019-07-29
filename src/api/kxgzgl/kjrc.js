// 科协工作管理--科技人才

import fetch from 'utils/fetch';

// 保存科技人才信息
export function saveKJRCXX(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/KXGZ/SaveKJRCXX',
    method: 'post',
    data
  })
}

// 分页获取评审专家信息
export function getKJRCXXData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/KXGZ/GetPszjListByPage',
    method: 'post',
    data
  })
}
// 抽取评审专家信息
export function getZJData(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/KXGZ/GetKJRCXXData',
    method: 'get',
    params: query
  })
}
// 保存excel数据入库
export function saveExcelData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/KXGZ/SaveExcelData_DJZS',
    method: 'post',
    data
  })
}

// 保存人才库信息 
export function saveZJData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/KXGZ/SaveZJData',
    method: 'post',
    data
  })
}
// 分页获取人才库信息 
export function getList(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/KXGZ/GetRCKList',
    method: 'post',
    data
  })
}
// 保存人才库信息 
export function saveData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/KXGZ/SaveRck',
    method: 'post',
    data
  })
}
// 删除人才库 
export function dropRck(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/KXGZ/DropRck',
    method: 'post',
    data
  })
}
// 删除专家库 
export function dropPszj(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/KXGZ/DropPszj',
    method: 'post',
    data
  })
}

import fetch from 'utils/fetch';

// 获取负责单位、参加单位的所有年月
export function getDWNY(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/GetDwNy',
    method: 'get',
    params: query
  })
}
// 保存当前年月的单位数据
export function saveTreeData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/SaveDwTree',
    method: 'post',
    data
  })
}

// 获取项目级别信息
export function getXmJB(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/getXmJB',
    method: 'get',
    params: query
  })
}

// 获取资金来源
export function getZJLY(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/getZJLY',
    method: 'get',
    params: query
  })
}

// 保存项目级别 
export function saveJBData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/SaveJBData',
    method: 'post',
    data
  })
}

// 获取项目分类信息
export function getXmFL(nd) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/GetXmFL',
    method: 'get',
    params: { nd }
  })
}
// 获取项目分类信息（树形）
export function getXMFLTree(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/LX/GetXMFLTree',
    method: 'get',
    params: query
  })
}

// 保存项目分类   
export function saveFLData(data) {
  // const data = {
  //   list: list,
  //   nd: nd
  // }
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/SaveFLData',
    method: 'post',
    data
  })
}
// 获取项目分类年度 
export function getFLND(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/GetFLND',
    method: 'get',
    params: query
  })
}

// 获取项目批次 
export function getXmPC(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/GetXmPC',
    method: 'get',
    params: query
  })
}
// 保存项目批次
export function savePCData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/SavePCData',
    method: 'post',
    data
  })
} 

// 保存负责单位字典 
export function addTreeData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/AddFZDWTreeData',
    method: 'post',
    data
  })
}
// 负责单位重命名 
export function editTreeData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/EditFZDWTreeData',
    method: 'post',
    data
  })
}

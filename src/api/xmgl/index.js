// 项目管理文件

import fetch from 'utils/fetch';


// 保存经费计划
export function saveJFData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/SaveJFData',
    method: 'post',
    data
  })
}
// 获取出资方式信息（下拉）
export function getCZFS(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/GetCZFS',
    method: 'get',
    params: query
  })
} 
// 获取经费计划 
export function getJFMX(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/GetJFMX',
    method: 'get',
    params: query
  })
} 


// 获取一条项目的所有基本信息 GetOneXLXMXX
export function getOneXMXX (query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/GetOneXMXX',
    method: 'get',
    params: query
  })
}

// 保存计划修改信息 
export function saveXMData (data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/SaveXMXX',
    method: 'post',
    data
  })
}

// 保存excel数据入库--进度报表
export function saveExcelData (data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/SaveExcelData_JD',
    method: 'post',
    data
  })
}

// 获取年月进度数据
export function getXmJDData (query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/GetXmJDData',
    method: 'get',
    params: query
  })
}

// 导出excel  
export function exportJDBBExcelData (data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/ExcelOP/ExportJDBBExcelData',
    method: 'post',
    data
  })
}

 
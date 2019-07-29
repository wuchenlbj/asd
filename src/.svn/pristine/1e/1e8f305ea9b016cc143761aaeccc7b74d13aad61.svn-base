
import fetch from 'utils/fetch';

// 获取distinct项目
export function getDistinctXM (query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/LX/GetDistinctXM',
    method: 'get',
    params: query
  })
}
// 获取一条项目的所有基本信息 GetOneXLXMXX
export function getOneXMXX (query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/LX/GetOneXMXX',
    method: 'get',
    params: query
  })
}
// 保存当项目数据
export function saveXMData (data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/LX/SaveXMXX',
    method: 'post',
    data
  })
}
// 获取历史变更记录
export function getLsbg (query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/LX/GetLSBG',
    method: 'get',
    params: query
  })
}
// #region 经费申报
// 获取项目经费明细
export function getJfmx (query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/LX/GetJFSB',
    method: 'get',
    params: query
  })
}
// 获取项目经费明细 年度查询(报表)
export function getJfmxByNd (query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/LX/GetJfmxByNd',
    method: 'get',
    params: query
  })
}
// 保存经费构成
export function saveJFGC (data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/LX/SaveJFGC',
    method: 'post',
    data
  })
}
// #endregion

// 保存excel数据入库
export function saveExcelData (data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/LX/SaveExcelData',
    method: 'post',
    data
  })
}

// 获取年度的所有立项数据 
export function getXmlxData (data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/LX/GetXmlxData',
    method: 'post',
    data
  })
}
// 根据条件获取项目立项数据
export function getLxData (data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/LX/GetLxData',
    method: 'post',
    data
  })
}

// 导出excel  
export function exportExcelData (data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/ExcelOP/ExportExcelData',
    method: 'post',
    data
  })
}

// 导出excel  
export function GetExcelData (query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/ExcelOP/GetEx',
    method: 'get',
    params: query
  })
}
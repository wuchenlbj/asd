import fetch from 'utils/fetch';

// 分页获取归档信息
export function getGDXXList(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/GetGDXXList',
    method: 'post',
    data
  })
}
// 保存excel 
export function saveExcelData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/SaveExcelData',
    method: 'post',
    data
  })
}
// 保存成果归档信息
export function saveGDData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/SaveGDData',
    method: 'post',
    data
  })
}

// 获取成果归档附录
export function getGdFl(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/GetGdFl',
    method: 'get',
    params: query
  })
}

// 根据成果登记号查询归档信息
export function getGdxx(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/GetGDXX',
    method: 'get',
    params: query
  })
}
// 获取专业分类
export function getZYFL(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/GetZYFL',
    method: 'get',
    params: query
  })
}
// 获取当前的文件列表
export function getFileLists(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/GetFileLists',
    method: 'post',
    data
  })
}

// 保存文档列表
export function saveFileXMData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/SaveXMXX',
    method: 'post',
    data
  })
}

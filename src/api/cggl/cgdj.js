// 成果获奖-成果获奖、成果登记
import fetch from 'utils/fetch';


// 分页获取成果获奖信息
export function getHJList(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/GetHJList',
    method: 'post',
    data
  })
} 

// 分页获取成果登记证书信息
export function getDJZSList(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/GetDJZSList',
    method: 'post',
    data
  })
} 

// 保存成果获奖登记信息
export function saveHJData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/SaveHJData',
    method: 'post',
    data
  })
}
// 保存登记证书
export function saveDJZSData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/SaveDJZSData',
    method: 'post',
    data
  })
}

// 删除成果获奖 
export function dropCGHJ(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/DropCGHJ',
    method: 'post',
    data
  })
}
// 删除登记证书
export function dropDJZS(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/DropDJZS',
    method: 'post',
    data
  })
}
// 保存excel 成果获奖
export function saveExcelData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/SaveExcelData_CGHJ',
    method: 'post',
    data
  })
}
// 保存excel 成果登记证书
export function saveExcelDataZS(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/SaveExcelData_DJZS',
    method: 'post',
    data
  })
}

// 保存文档库入库
export function saveFileByFID(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/SaveFileByFID',
    method: 'post',
    data
  })
}





// 保存成果登记信息
export function saveCGDJXX(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/SaveCGDJXX',
    method: 'post',
    data
  })
}
// 获取成果登记信息
export function getcgdjList(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/GetcgdjList',
    method: 'get',
    params: query
  })
}


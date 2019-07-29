import fetch from 'utils/fetch';


// 保存excel数据入库
export function saveExcelData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/SaveExcelData',
    method: 'post',
    data
  })
}

// 获取计划下达-新立项目的数据 年度 类型查询
export function getXmXLData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/GetXmXLData',
    method: 'post',
    data
  })
}
// 计划下达 
export function turnXDXM(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/TurnXDXM',
    method: 'post',
    data
  })
}
// 获取计划下达通知
export function getXDTZ(query) {
  return fetch({
    headers: {
      moduleid: 'd0206b30-bcd2-49e2-b5ed-77557c1bce76'
    },
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/GetXDTZ',
    method: 'get',
    params: query
  })
}
// 更改通知为已读 
export function changeXDXM(query) {
  return fetch({
    headers: {
      moduleid: 'd0206b30-bcd2-49e2-b5ed-77557c1bce76'
    },
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/ChangeXDXM',
    method: 'get',
    params: query
  })
}
// 首页项目汇总
export function getXmCount(query) {
  return fetch({
    headers: {
      moduleid: 'd0206b30-bcd2-49e2-b5ed-77557c1bce76'
    },
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/GetXmCount',
    method: 'get',
    params: query
  })
}

// 获取接转年度的项目
export function getXmJZByNDData(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/GetXmJZByNDData',
    method: 'get',
    params: query
  })
}
// 接转年度的项目
export function saveXmJZData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/SaveXmJZData',
    method: 'post',
    data
  })
}
// 
// 导出excel  
export function exportJHExcelData (data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/ExcelOP/ExportJHExcelData',
    method: 'post',
    data
  })
}

 
import fetch from 'utils/fetch';
// 获取所有文件数据-
export function getdocList(query) {
  return fetch({
    baseURL: process.env.WDK_BASE_API,
    url: '/api/doc/GetDocFL',
    method: 'get',
    params: query
  })
}

// 下载模版
export function downloadMB(data) {
  return fetch({
    baseURL: process.env.WDK_BASE_API,
    url: '/api/doc/ExportExcle',
    method: 'post',
    data
  })
}
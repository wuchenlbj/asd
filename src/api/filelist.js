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

// 删除文件或文件夹
export function dropFile(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMQD/DropXMFile',
    method: 'post',
    data
  })
}
// 保存项目和文件的关系
export function saveFileXMData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMQD/SaveXMXX',
    method: 'post',
    data
  })
}
// 处理保存文件夹
export function SaveFolderRelation(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMQD/SaveFolderRelation',
    method: 'post',
    data
  })
}

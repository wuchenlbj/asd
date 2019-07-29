import fetch from 'utils/fetch';


// 保存负责单位字典 
export function addTreeData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMQD/AddTreeData',
    method: 'post',
    data
  })
}

// 文件夹重命名 
export function editTreeData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMQD/RenameTreeData',
    method: 'post',
    data
  })
}
// 保存默认配置或者单个项目配置
export function saveTreeData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMQD/SaveTreeMR',
    method: 'post',
    data
  })
}
export function saveTreeData2(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMQD/SaveTreeFL',
    method: 'post',
    data
  })
}

// 获取项目分类年度 
export function getZtreeData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMQD/GetZtreeData',
    method: 'post',
    data
  })
}
// 获取默认数据并重新编码 
export function getmrZtreedata(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMQD/GetmrZtreedata',
    method: 'post',
    data
  })
}
// 判断是否存在
export function exitsTreeData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMQD/ExitsTreeData',
    method: 'post',
    data
  })
}

// 获取当前模块下的清单配置信息及上传的文件信息(默认)
export function getFilderConfig(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMQD/GetFilderConfig',
    method: 'post',
    data
  })
}
// 获取当前项目的文件列表
export function getFileLists(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMQD/GetFileLists',
    method: 'post',
    data
  })
}
export function getFilderConfig2(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMQD/GetFilderConfig2',
    method: 'get',
    params: query
  })
}
// 保存项目和文件的关系
export function savexmToqd(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMQD/SavexmToqd',
    method: 'post',
    data
  })
}

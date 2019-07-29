import fetch from 'utils/fetch';


// 保存成果评奖信息
export function savePJData(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/SavePJData',
    method: 'post',
    data
  })
}

// 1-1 获取勘探地质
export function getFormDataKTDZ(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/GetFormDataKTDZ',
    method: 'get',
    params: query
  })
}

// 分页获取勘探地质
export function getDataKTDZ(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/GetDataKTDZ',
    method: 'post',
    data
  })
}
// 1-1保存勘探地质
export function saveDataKTDZ(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/SaveDataKTDZ',
    method: 'post',
    data
  })
}
// 1-2 获取油藏描述
export function getFormDataYCMS(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/GetFormDataYCMS',
    method: 'get',
    params: query
  })
}
// 1-2分页获取勘探地质
export function getDataYCMS(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/GetDataYCMS',
    method: 'post',
    data
  })
}

// 1-2保存油藏描述
export function saveDataYCMS(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/SaveDataYCMS',
    method: 'post',
    data
  })
}
// 1-3获取开发方案
export function getFormDataKFFA(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/GetFormDataKFFA',
    method: 'get',
    params: query
  })
}

// 1-3分页获取开发方案
export function getDataKFFA(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/GetDataKFFA',
    method: 'post',
    data
  })
}
// 1-3保存开发方案
export function saveDataKFFA(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/SaveDataKFFA',
    method: 'post',
    data
  })
}
// 1-4获取调整方案
export function getFormDataTZFA(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/GetFormDataTZFA',
    method: 'get',
    params: query
  })
}
// 1-4分页获取调整方案
export function getDataTZFA(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/GetDataTZFA',
    method: 'post',
    data
  })
}
// 1-4保存调整方案
export function saveDataTZFA(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/saveDataTZFA',
    method: 'post',
    data
  })
}

// 1-5获取新技术研究应用
export function getFormDataYJYY(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/GetFormDataYJYY',
    method: 'get',
    params: query
  })
}
// 1-5分页获研究应用
export function getDataYJYY(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/GetDataYJYY',
    method: 'post',
    data
  })
}

// 1-5保存新技术研究应用
export function saveDataYJYY(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/saveDataYJYY',
    method: 'post',
    data
  })
}

// 措施分类下拉
export function getFLCSLX(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/CGGL/GetFLCSLX',
    method: 'get',
    params: query
  })
}
// // 保存奖金分发
// export function saveJJFFXX(data) {
//   return fetch({
//     baseURL: process.env.BASE_API,
//     url: '/api/CGGL/SaveJJFFXX',
//     method: 'post',
//     data
//   })
// }

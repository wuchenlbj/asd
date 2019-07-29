import fetch from 'utils/fetch'

// 获取项目列表信息--新立数据
export function GetAllXM(data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMGL/GetAllXmXX',
    method: 'post',
    data
  })
}

// 获取负责单位、参加单位树
export function GetUnitTree(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/LX/GetYCUnitTree',
    method: 'get',
    params: query
  })
}
export function GetUnitTree2(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/LX/GetYCUnitTree',
    method: 'get',
    params: query
  })
}

// 获取负责单位、参加单位树
export function GetYCUnitTreeTxl(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/LX/GetYCUnitTreeTxl',
    method: 'get',
    params: query
  })
}

// 获取moduleid下的清单列表
export function getQDName(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/XMQD/GetQDName',
    method: 'get',
    params: query
  })
}

// 获取一周内的登录日志
export function getSysLog(query) {
  return fetch({
    headers: {
      moduleid: 'd0206b30-bcd2-49e2-b5ed-77557c1bce76'
    },
    baseURL: process.env.BASE_API,
    url: '/api/SysConfig/GetSysLog',
    method: 'get',
    params: query
  })
}

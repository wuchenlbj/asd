// 科协工作管理--通讯录

import fetch from 'utils/fetch';

// 获取评审方式下拉数据
export function getTxlXX(query) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/KXGZ/GetTxlXX',
    method: 'get',
    params: query
  })
} 
// 保存通讯录
export function saveTxl (data) {
  return fetch({
    baseURL: process.env.BASE_API,
    url: '/api/KXGZ/SaveTXL',
    method: 'post',
    data
  })
}
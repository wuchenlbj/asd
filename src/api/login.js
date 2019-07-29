import fetch from '@/utils/fetch';

// 登录验证
export function loginByUsername(username, password) {
  const data = {
    UserName: username,
    UserPwd: password
  }
  return fetch({
    baseURL: process.env.PT_BASE_API,
    url: '/api/Page/GetTicketByLogin',
    method: 'post',
    data
  })
}

export function logout() {
  return fetch({
    baseURL: process.env.PT_BASE_API,
    url: '/api/Page/LogOut',
    method: 'post'
  });
}

export function getInfo() {
  return fetch({
    baseURL: process.env.PT_BASE_API,
    url: '/api/Page/GetUserInfo',
    method: 'get'
  });
}

export function getUserRoleInfo() {
  return fetch({
    baseURL: process.env.PT_BASE_API,
    url: '/api/Page/GetUserRoleInfo',
    method: 'get'
  });
}

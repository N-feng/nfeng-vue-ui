import Cookies from 'js-cookie'

const token = 'token'
export function setLocalToken(data) {
  return localStorage.setItem(token, JSON.stringify(data))
}
export function getLocalToken() {
  // return ""
  return window.__POWERED_BY_QIANKUN__ ? Cookies.get('token') : JSON.parse(localStorage.getItem(token)) 
}
export function removeLocalToken() {
  return localStorage.removeItem(token)
}

export function removeRouter() {
  return localStorage.removeItem('router')
}

export function getUserCode() {
  return window.__POWERED_BY_QIANKUN__? JSON.parse(localStorage.getItem('Micro_UserInfo')).userCode : localStorage.getItem("userCode")
}

import axios from 'axios'
import store from '@/store'

const request = axios.create({
  baseURL: 'http://edufront.lagou.com'
})

// 加上身份认证信息
// 设置请求拦截器进行接口鉴权
request.interceptors.request.use(config => {
  // 读取 store 中存储的 user 数据
  const { user } = store.state
  // 检测 user 是否存在数据，如果有，则进行 token 设置(无论接口是否需要token，都会 进过这一步带上token信息)
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
})

// 判断错误码401， 用户token是否失效
request.interceptors.response.use(response => {
  return response
}, error => {
  // 1. 判断是否有响应体，如果没有响应体，将错误往上抛
  if (error.response) {
    const { status } = error.response
    // 2. 确定错误码是否为 401
    if (status === 400) {
      return 0
    } else if (status === 401) {
      return 0
    }
  }
  // 将本次请求的错误对象继续向后抛出，让接收响应的处理函数进行操作
  return Promise.reject(error)
})

export default request

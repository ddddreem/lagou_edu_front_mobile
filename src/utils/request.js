import axios from 'axios'
import store from '@/store'
import qs from 'qs'

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

//  判断是否正在刷新token
let isRefreshing = false
// 存储在等待更新token的其他请求
let requests = []

// 判断错误码401， 用户token是否失效
request.interceptors.response.use(response => {
  return response
}, error => {
  // 1. 判断是否有响应体，如果没有响应体，将错误往上抛
  if (error.response) {
    const { status } = error.response
    // 2. 确定错误码是否为401
    if (status === 400) {
      return 0
    } else if (status === 401) {
      // 3. 确定vuex中是否存有token信息
      if (!store.state.user) {
        return Promise.reject(error)
      }
      if (isRefreshing) {
        return requests.push(() => {
          request(error.config)
        })
      }
      isRefreshing = true
      // 4. 如果有则发送 refresh_token 来刷新 auth_token
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        // 4.1 刷新失败，清空无用的用户信息，随后跳转登录页
        if (res.data.state !== 1) {
          store.commit('setUser', null)
          return Promise.reject(error)
        }
        // 4.2 刷新成功，更新vuex中保存的信息
        store.commit('setUser', res.data.content)
        // 所存储的其他请求再重新发送，并清零等待数组
        requests.forEach(callback => callback())
        requests = []
        //  最后发送本次请求
        return request(error.config)
      }).finally(() => {
        isRefreshing = false
      })
    }
  }
  // 将本次请求的错误对象继续向后抛出，让接收响应的处理函数进行操作
  return Promise.reject(error)
})

export default request

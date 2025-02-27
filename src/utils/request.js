import axios from 'axios'

const request = axios.create({
  baseURL: 'http://edufront.lagou.com'
})

request.interceptors.request.use(request => {

})

request.interceptors.response.use(response => {
  
}, error => {

})

export default request

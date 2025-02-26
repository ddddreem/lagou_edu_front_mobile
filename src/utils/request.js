import axios from 'axios'

const request = axios.create({
  baseURL: 'http://edufront.lagou.com'
})

export default request

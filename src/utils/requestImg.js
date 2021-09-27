import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken, removeToken } from '@/utils/auth'
import url from '@/utils/url'
// create an axios instance
const service = axios.create({
  baseURL: url, // url = base url + request url  process.env.VUE_APP_BASE_API
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 100000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(

  response => {
    getToken() ? ''
      : setToken(response.headers.authorization, 0.5)
    const res = response.data
    return res
  },
  error => {
    if (error && error.response && error.response.status === 401) {
      if (error.response.data && error.response.data.msg) {
        Message({
          message: error.response.data.msg,
          type: 'error',
          duration: 5 * 1000
        })
        return
      } else {
        removeToken()
        // eslint-disable-next-line no-self-assign
        window.location.origin = window.location.origin
        return
      }
    }
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

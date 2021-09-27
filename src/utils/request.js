import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken, removeToken } from '@/utils/auth'
import qs from 'qs'
import url from '@/utils/url'
// create an axios instance
const service = axios.create({
  baseURL: url, // url = base url + request url https://devu.jiayikou.com process.env.VUE_APP_BASE_API https://csu.jiayikou.com https://optu.jiayikou.com
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 100000, // request timeout
  transformRequest: function(data) {
    let datas = fliterfun(data)
    return qs.stringify(datas)
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
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
      if (error.response.data && error.response.data.msg === '无效的token') {
        removeToken()
        // eslint-disable-next-line no-self-assign
        window.location.origin = window.location.origin
        return
      }
      if (error.response.data && error.response.data.msg) {
        Message({
          message: error.response.data.msg,
          type: 'error',
          duration: 5 * 1000
        })
        // return
      } else {
        removeToken()
        // eslint-disable-next-line no-self-assign
        window.location.origin = window.location.origin
        return
      }
    }
    Message({
      message: error.response.data.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
const	fliterfun = function(Obj) {
	for (let key in Obj) {
		if (Obj[key] || Obj[key] === 0) {
			if (Object.prototype.toString.call(Obj[key]) == "[object String]" ) {
				if (Obj[key].indexOf("NaN") != -1) {
					delete Obj[key]
				} else {
					Obj[key] = Obj[key]
				}
			} else {
				Obj[key] = Obj[key]
			}
		} else {
			delete Obj[key]
		}
	}
	return Obj
}

export default service

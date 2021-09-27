/* eslint-disable no-mixed-spaces-and-tabs */
import { login, logout } from '@/api/user'
import { getToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
var jwt = require('jsonwebtoken')
const state = {
  token: getToken(),
  name: JSON.parse(sessionStorage.getItem('roles')) ? JSON.parse(sessionStorage.getItem('roles')).username : '',
  avatar: 'https://xinyipai.oss-cn-hangzhou.aliyuncs.com/pro/xinyiapipai/upload/1/1584700965657.png',
  roles: JSON.parse(sessionStorage.getItem('rolesStorage')) ? JSON.parse(sessionStorage.getItem('rolesStorage')).token : [],
  publicKey:'-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCoLd / wUEkw / Zn496gOYjFPPMgzoZkcRvV6mpVjolwium2GrgxAK5r8AqcEbvXVslrj6LhpVOHYJOgP3oPWigiXiDE0cXh2psmMTk82xphFJa38rAI2U + 6W4QfUU04ETGZaWf53AGl6NUFuhmXFqDsSvf + 93rvFmHYKjg6dXic0lQIDAQAB-----END PUBLIC KEY-----'
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
	  // eslint-disable-next-line no-mixed-spaces-and-tabs
	  state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    removeToken()
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-unused-vars
      login({ username: username.trim(), password: password }).then(response => {
        //在响应拦截器中已经拿到token 设置token了
        const data = getToken()
        commit('SET_TOKEN', data)
        const roles = jwt.decode(data.split(' ')[1]).details.permissionUrl
        const name = jwt.decode(data.split(' ')[1]).details
        commit('SET_ROLES', roles)
        commit('SET_NAME', name.username)
        const obj = {}
        obj.token = roles
        sessionStorage.setItem('roles', JSON.stringify(name))
        sessionStorage.setItem('rolesStorage', JSON.stringify(obj))

        // set all token data
        sessionStorage.setItem('tokenData', JSON.stringify(jwt.decode(data.split(' ')[1])))
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  // eslint-disable-next-line no-unused-vars
  getInfo({ commit, state }) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
		 const roles = sessionStorage.getItem('roles')
		 resolve(roles)
	 // commit('SET_NAME', JSON.parse(roles).username)
      //       getInfo(state.token).then(response => {
      //         const { data } = response
      //
      //         if (!data) {
      //           reject('Verification failed, please Login again.')
      //         }
      //
      //         const { name, avatar } = data
      //
      //         commit('SET_NAME', name)
      //         commit('SET_AVATAR', avatar)
      //         resolve(data)
      //       }).catch(error => {
      //         reject(error)
      //       })
    })
  },

  // user logout
  logout({ commit, state }) {

    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import Cookies from "js-cookie";

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },

  mutations: {
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
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const userAccount = userInfo.userAccount.trim()
      const userPassword = userInfo.userPassword
      return new Promise((resolve, reject) => {
        login(userAccount, userPassword).then(res => {
          Cookies.set("Admin-Token", new Date().getTime(), { expires: 24 * 60 * 60 * 1000 });
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        // getInfo().then(res => {
        const avatar = require("@/assets/images/profile.jpg");
        commit('SET_ROLES', ["admin"])
        commit('SET_PERMISSIONS', ["*:*:*"])
        commit('SET_NAME', "用户")
        commit('SET_AVATAR', avatar)
        resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          Cookies.remove("token");
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user

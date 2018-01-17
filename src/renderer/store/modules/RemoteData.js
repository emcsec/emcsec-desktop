import db from '../db'
import _ from 'lodash'
const DB = db.db

const state = {
  data: {},
  walletId: '',
  lastUpdate: []
}

const getters = {
  getData (state) {
    if (state.data !== null && typeof state.data.pending !== 'undefined') {
      if (state.data.history !== null) state.data.history.pending = state.data.pending
    }
    return state.data
  },
  getEmcLastUpdate (state) {
    return state.lastUpdate.filter(item => item.walletId === state.walletId && item.type === 'emc')
  },
  getBtcLastUpdate (state) {
    return state.lastUpdate.filter(item => item.walletId === state.walletId && item.type === 'btc')
  }
}

const mutations = {
  setData (state, data) {
    state.data = data
  },
  getData (state, data) {
    state.data = data
  },
  setLastUpdate (state, data) {
    state.lastUpdate.push(data)
  },
  updateLastUpdate (state, data) {
    let newData = _.dropRightWhile(state.lastUpdate, (item) => item.walletId === data.walletId)
    newData.push(data)
    state.lastUpdate = newData
  },
  setWalletId (state, id) {
    state.walletId = id
  }
}

const actions = {
  setWalletData ({commit, state}, data) {
    if ((data.walletId) || (state.data.walletId !== data.walletId)) {
      DB.remoteData.findOne({walletId: data.walletId, type: data.type}, function (err, res) {
        if (err) console.log(err)
        if (res !== null) {
          DB.remoteData.update({walletId: data.walletId, type: data.type}, {
            $set: {
              balances: data.balances,
              history: data.history,
              pending: data.history.pending,
              walletId: data.walletId,
              type: data.type
            }
          }, function (err, updRes) {
            if (err) console.log(err)
            updRes = data
            commit('setData', updRes)
          })
        } else {
          DB.remoteData.insert({
            balances: data.balances,
            history: data.history,
            pending: data.history.pending,
            walletId: data.walletId,
            type: data.type
          }, function (err, insRes) {
            if (err) console.log(err)
            commit('setData', insRes)
          })
        }
      })
      commit('setWalletId', data.walletId)
    }
  },
  getWalletData ({commit, state}, data) {
    if (data.walletId || (state.data.walletId === data.walletId)) {
      DB.remoteData.findOne({walletId: data.walletId, type: data.type}, function (err, res) {
        if (err) console.log(err)
        commit('getData', res)
      })
    }
  },
  setLastUpdate ({commit}, data) {
    commit('setLastUpdate', data)
    commit('setWalletId', data.walletId)
  },
  updateLastUpdate ({commit}, data) {
    commit('setLastUpdate', data)
    commit('setWalletId', data.walletId)
  },
  setWalletId ({commit}, walletId) {
    commit('setWalletId', walletId)
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}

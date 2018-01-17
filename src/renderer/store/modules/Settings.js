import db from '../db'
const DB = db.db
const electron = require('electron')
let app = electron.remote.app

const state = {
  emc: {
    host: 'emcx.emercoin.com',
    port: 9110,
    change: ''
  },
  btc: {
    host: 'btcx.emercoin.com',
    port: 50001,
    change: ''
  },
  serverError: true,
  language: app.getLocale()
}

const getters = {
  getSettings (state) {
    let settings = {
      emc: state.emc,
      btc: state.btc,
      language: state.language
    }
    return settings
  }
}

const mutations = {
  setState (state, settings) {
    state.emc = settings.emc
    state.btc = settings.btc
  },
  getState (state, settings) {
    state.emc = settings.emc
    state.btc = settings.btc
  },
  setServerStatus (state, status) {
    state.serverError = status
  },
  getLang (state, code) {
    state.language = code
  },
  setLang (state, code) {
    state.language = code
  }
}

const actions = {
  setSettings ({commit}, settings) {
    console.log('Settings: ', settings)
    DB.settings.findOne({walletId: settings.walletId}, function (err, setting) {
      if (err) console.log(err)
      if (setting === null) {
        DB.settings.insert({
          emc: settings.emc,
          btc: settings.btc,
          walletId: settings.walletId
        }, function (err, count) {
          if (err) console.log(err)
          commit('setState', settings)
        })
      } else {
        DB.settings.update({walletId: settings.walletId}, {$set: {
          emc: settings.emc,
          btc: settings.btc,
          walletId: settings.walletId
        }}, function (err, count) {
          if (err) console.log(err)
          commit('setState', settings)
        })
      }
    })
  },
  getSettings ({commit}, walletId) {
    walletId = walletId || null
    DB.settings.findOne({walletId: walletId}, function (err, settings) {
      if (err) console.log(err)
      if (settings !== null) {
        commit('setState', settings)
      }
    })
  },
  setServerStatus ({commit}, status) {
    commit('setServerStatus', status)
  },
  getLanguage ({commit}) {
    DB.settings.findOne({type: 'lang'}, function (err, result) {
      if (err) console.log(result)
      if (result !== null) commit('getLang', result.code)
    })
  },
  setLanguage ({commit}, code) {
    DB.settings.findOne({type: 'lang'}, function (err, result) {
      if (err) console.log(err)
      if (result) {
        DB.settings.update({_id: result._id}, {$set: {code: code}}, function (err, res) {
          if (err) console.log(err)
          commit('setLang', code)
          console.log(res)
        })
      } else {
        DB.settings.insert({type: 'lang', code: code}, function (err, item) {
          if (err) console.lof(err)
          commit('setLang', code)
          console.log(item, code)
        })
      }
    })
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}

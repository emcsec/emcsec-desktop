import db from '../db'
const DB = db.db

const state = {
  wallets: [],
  currentWallet: [],
  addresses: [],
  changes: [],
  walletType: 'emc'
}

const getters = {
  wallets (state) {
    return state.wallets
  },
  currentWallet (state) {
    return state.currentWallet
  },
  getEmcAddresses: (state) => {
    return state.addresses.filter(item => item.wallet_id === state.currentWallet._id && item.type === 'emc')
  },
  getEmcChanges: (state) => {
    return state.changes.filter(item => item.wallet_id === state.currentWallet._id && item.type === 'emc')
  },
  getBtcAddresses: (state) => {
    return state.addresses.filter(item => item.wallet_id === state.currentWallet._id && item.type === 'btc')
  },
  getBtcChanges: (state) => {
    return state.changes.filter(item => item.wallet_id === state.currentWallet._id && item.type === 'btc')
  }
}

const mutations = {
  get (state, items) {
    state.wallets = items
  },
  getCurrent (state, items) {
    state.currentWallet = items
  },
  getAddresses (state, items) {
    state.addresses = items
  },
  getChanges (state, items) {
    state.changes = items
  },
  setWallet (state, item) {
    state.wallets.push(item)
  },
  setWalletType (state, type) {
    state.walletType = type
  },
  setAddresses (state, items) {
    state.addresses.push(items)
  },
  setChanges (state, items) {
    state.changes.push(items)
  }
}

const actions = {
  get ({commit}) {
    DB.find({}).sort({walletName: 1}).exec(function (err, wallets) {
      if (err) throw err
      if (wallets) commit('get', wallets)
    })
  },
  currentWallet ({commit}, walletName) {
    DB.findOne({walletName: walletName}).exec(function (err, wallet) {
      if (err) throw err
      if (wallet) {
        commit('getCurrent', wallet)
      } else {
        DB.findOne({}).exec(function (err, wallet) {
          if (err) throw err
          commit('getCurrent', wallet)
        })
      }
    })
  },
  getAddresses ({commit}) {
    DB.addresses.find({}).sort({sortOrder: 1}).exec(function (err, res) {
      if (err) throw err
      if (res) commit('getAddresses', res)
    })
  },
  getChanges ({commit}, walletId) {
    DB.changes.find({walletId: walletId}).sort({sortOrder: 1}).exec(function (err, res) {
      if (err) throw err
      if (res) commit('getChanges', res)
    })
  },
  addAddresses ({commit}, addresses) {
    commit('setAddresses', addresses)
  },
  addChanges ({commit}, changes) {
    commit('setChanges', changes)
  },
  setAddresses ({commit}, wallet) {
    let addresses = []
    wallet.keys.emc.forEach(function (value, index, arr) {
      DB.addresses.insert({
        type: 'emc',
        address: value.address,
        name: value.name,
        wallet_id: wallet._id,
        sortOrder: index
      }, function (err, docs) {
        if (err) throw err
        addresses.push(docs)
      })
    })
    wallet.keys.btc.forEach(function (value, index, arr) {
      DB.addresses.insert({
        type: 'btc',
        address: value.address,
        name: value.name,
        wallet_id: wallet._id,
        sortOrder: index
      }, function (err, docs) {
        if (err) throw err
        addresses.push(docs)
      })
    })
    setTimeout(function () {
      commit('setAddresses', addresses)
    }, 1000)
  },
  setChanges ({commit}, wallet) {
    let changes = []
    wallet.keys.emc.changes.forEach(function (value, index, arr) {
      DB.changes.insert({
        type: 'emc',
        address: value.address,
        wallet_id: wallet._id,
        sortOrder: index
      }, function (err, docs) {
        if (err) throw err
        changes.push(docs)
      })
    })
    wallet.keys.btc.changes.forEach(function (value, index, arr) {
      DB.changes.insert({
        type: 'btc',
        address: value.address,
        wallet_id: wallet._id,
        sortOrder: index
      }, function (err, docs) {
        if (err) throw err
        changes.push(docs)
      })
    })
    setTimeout(function () {
      commit('setChanges', changes)
    }, 1000)
  },
  setWallet ({dispatch, commit}, wallet) {
    DB.insert({
      walletName: wallet.name,
      phrase: wallet.phrase,
      keys: wallet.keys,
      sort: wallet.sort
    }, function (err, doc) {
      if (err) alert(err)
      dispatch('setAddresses', doc)
      dispatch('setChanges', doc)
      commit('setWallet', doc)
    })
  },
  setWalletType ({commit}, type) {
    commit('setWalletType', type)
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}

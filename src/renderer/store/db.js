import LinvoDB from 'linvodb3'

let modelName = 'keystore'

LinvoDB.dbPath = [process.cwd(), 'db/keystore.db'].join('/')
LinvoDB.defaults.store = { db: require('level-js') }

let db = new LinvoDB(modelName, { })

let modelName2 = 'addresses'

LinvoDB.dbPath = [process.cwd(), 'db/addresses.db'].join('/')

db.addresses = new LinvoDB(modelName2, { })

let modelName3 = 'settings'

LinvoDB.dbPath = [process.cwd(), 'db/settings.db'].join('/')

db.settings = new LinvoDB(modelName3, { })

let modelName4 = 'fee'

LinvoDB.dbPath = [process.cwd(), 'db/fee.db'].join('/')

db.fee = new LinvoDB(modelName4, { })

let modelName5 = 'remote-data'

LinvoDB.dbPath = [process.cwd(), 'db/remote-data.db'].join('/')

db.remoteData = new LinvoDB(modelName5, { })

let modelName6 = 'changes'

LinvoDB.dbPath = [process.cwd(), 'db/changes.db'].join('/')

db.changes = new LinvoDB(modelName6, { })

let modelName7 = 'utxos'

LinvoDB.dbPath = [process.cwd(), 'db/utxos.db'].join('/')

db.utxos = new LinvoDB(modelName7, { })

let modelName8 = 'language'

LinvoDB.dbPath = [process.cwd(), 'db/language.db'].join('/')

db.language = new LinvoDB(modelName8, { })

export default {
  db,
  install: function (vue) {
    vue.prototype.$db = db
  }
}

import db from '../store/db'
import I18n from '../translations/i18n'
import store from '../store'
let _I18n = I18n.I18n
const DB = db.db
const ElectrumCli = require('electrum-client')
const bitcore = require('bitcore-bip39')
const moment = require('moment')
const Functions = require('./Functions')

export default class {
  constructor (root) {
    this.root = root
    this.store = store
    this.history = []
    this.walletId = null
    this.walletType = 'emc'
    this.balances = []
    this.balances.done = false
    this.error = false
    this.serverTimeout = false
    this.sent = {status: true}
    this.downloadProgress = 0
    this.totalProgress = 0
    this.done = {type: 'emc', status: true, walletId: ''}
  }

  async main (addresses, changes, Id, type) {
    addresses = addresses.concat(changes)
    let i = 0
    this.balances.length = 0
    this.balances.done = false
    this.balances.walletId = ''
    this.balances.type = ''
    let tmpBalances = []
    this.walletId = Id
    this.walletType = type
    let _this = this
    if (this.balances.length <= 1) {
      DB.settings.findOne({walletId: this.walletId}, async function (err, settings) {
        if (err) console.log(err)
        const ecl = new ElectrumCli(settings[type].port, settings[type].host, 'tcp') // tcp or tls
        await ecl.close()
        await ecl.connect() // connect(promise)
        ecl.subscribe.on('blockchain.headers.subscribe', (v) => console.log(v)) // subscribe message(EventEmitter)
        _this.totalProgress += addresses.length
        _this.root.$emit('totalProgress', addresses.length)
        for (addresses.length; i < addresses.length; i++) {
          try {
            tmpBalances.push(await ecl.blockchainAddress_getBalance(addresses[i].address)) // json-rpc(promise)
            _this.downloadProgress++
            _this.root.$emit('downloadProgress', 1)
            _this.error = false
          } catch (e) {
            _this.balances = tmpBalances
            _this.balances.done = true
            _this.balances.walletId = Id
            _this.balances.type = type
            _this.error = true
            await ecl.close() // disconnect(promise)
          }
          if (i >= 24) {
            _this.balances = tmpBalances
            _this.balances.done = true
            _this.balances.walletId = Id
            _this.balances.type = type
            await ecl.close() // disconnect(promise)
          }
        }
      })
    }
  }
  async getHistory (addresses, changes, Id, type) {
    addresses = addresses.concat(changes)
    this.history.length = 0
    this.history.pending = []
    this.done = {type: type, status: false, walletId: Id}
    this.serverTimeout = false
    let _this = this
    let tmp = []
    let pendingTmp = []
    let errorShown = false
    this.walletId = Id
    this.walletType = type
    DB.settings.findOne({walletId: this.walletId}, async function (err, settings) {
      if (err) console.log(err)
      const ecl = new ElectrumCli(settings[type].port, settings[type].host, 'tcp') // tcp or tls
      let connTimer
      ecl.conn.on('connect', function () {
        console.log('Connected')
      })
      ecl.conn.on('error', function (e) {
        console.log('Connection Error', e)
        ecl.close()
      })
      ecl.conn.on('disconnect', function () {
        console.log('Disconnected')
      })
      connTimer = setTimeout(function () {
        console.log('[ERROR] Attempt at connection exceeded timeout value')
        _this.serverTimeout = true
        ecl.close()
      }, 20000)
      await ecl.connect() // connect(promise)
      console.time('time_log')
      ecl.subscribe.on('blockchain.headers.subscribe', (v) => console.log(v)) // subscribe message(EventEmitter)
      let raw = ''
      let tx = {}
      let address = ''
      let outAddress = ''
      let amount = 0
      let header = {}
      let fee = 0
      for (let [i, addr] of addresses.entries()) {
        try {
          let history = await ecl.blockchainAddress_getHistory(addr.address)
          if (history.length !== 0) {
            _this.totalProgress += history.length
            _this.root.$emit('totalProgress', history.length)
            if (addr.address === '1BumbRMPFVL6bixzrTAwRNGziDtLTXwoD2') console.log(history)
            for (let h of history) {
              let ok = false
              let inputAmount = 0
              let inputCheck = false
              let outputCheck = false
              let isChange = false
              let tx_type = ''
              raw = await ecl.blockchainTransaction_get(h.tx_hash)
              _this.downloadProgress++
              _this.root.$emit('downloadProgress', 1)
              if (raw) clearTimeout(connTimer)
              if (type === 'btc') {
                tx = bitcore.Transaction(raw)
              } else {
                tx = bitcore.EMCTransaction(raw)
              }

              let inputAddr = type === 'btc' ? bitcore.Address.fromScript(tx.inputs[0].script, 'livenet').toString() : bitcore.Address.fromScript(tx.inputs[0].script, 'emcnet').toString()
              inputCheck = typeof addresses.find(i => i.address === inputAddr) !== 'undefined'
              for (let input of tx.inputs) {
                DB.utxos.remove({txId: input.prevTxId.toString('hex'), change: true}, function (err, res) {
                  if (err) console.log(err)
                  console.log('Removed changes: ', res)
                })
              }

              for (let output of tx.outputs) {
                address = type === 'btc' ? bitcore.Address.fromScript(output.script, 'livenet').toString() : bitcore.Address.fromScript(output.script, 'emcnet').toString()
                outputCheck = typeof addresses.find(i => i.address === address) !== 'undefined'
                isChange = typeof changes.find(i => i.address === address) !== 'undefined'
                if (address === addr.address && !inputCheck && !isChange) {
                  outAddress = address
                  amount = output.satoshis
                  fee = _I18n.translate('none')
                  tx_type = 'received'
                  ok = true
                }
                if (address !== addr.address && !outputCheck && inputCheck) {
                  outAddress = address
                  amount = output.satoshis
                  tx_type = 'out'
                  ok = true
                }
                if (address === addr.address && inputCheck && !isChange) {
                  outAddress = address
                  amount = output.satoshis
                  tx_type = 'self'
                  ok = true
                }
              }
              let ptxExist = typeof pendingTmp.find(i => tx_type !== 'received' && i.tx_hash === tx.id) !== 'undefined'
              let txExist = typeof tmp.find(i => tx_type !== 'received' && i.tx_hash === tx.id) !== 'undefined'
              if (ok && !ptxExist && !txExist) {
                if (tx_type === 'out' || tx_type === 'self') {
                  _this.totalProgress += tx.inputs.length
                  _this.root.$emit('totalProgress', tx.inputs.length)
                  for (let input of tx.inputs) {
                    let prevOutputIndex = input.outputIndex
                    let prevTxId = input.prevTxId.toString('hex')
                    let prevTxRaw = await ecl.blockchainTransaction_get(prevTxId)
                    _this.downloadProgress++
                    _this.root.$emit('downloadProgress', 1)
                    let prevTx = type === 'btc' ? bitcore.Transaction(prevTxRaw) : bitcore.EMCTransaction(prevTxRaw)
                    inputAmount += prevTx.outputs[prevOutputIndex].satoshis
                  }
                  fee = (inputAmount - tx.outputAmount)
                }
                if (h.height <= 0) {
                  pendingTmp.push({
                    address: outAddress,
                    timestamp: type === 'btc' ? 0 : tx.time,
                    amount: amount,
                    fee: fee,
                    tx_hash: tx.hash,
                    tx_type: tx_type,
                    height: _I18n.translate('unconfirmed')
                  })
                } else {
                  if (type === 'btc') {
                    _this.totalProgress++
                    _this.root.$emit('totalProgress', 1)
                    header = await ecl.blockchainBlock_getHeader(h.height)
                    _this.downloadProgress++
                    _this.root.$emit('downloadProgress', 1)
                  }
                  tmp.push({
                    address: outAddress,
                    timestamp: type === 'btc' ? header.timestamp : tx.time,
                    amount: amount,
                    fee: fee,
                    tx_hash: tx.hash,
                    tx_type: tx_type,
                    height: h.height
                  })
                }
              }
            }
          }
          if (i === (addresses.length - 1)) {
            _this.history = []
            let join = []
            let res = join.concat(_this.history, tmp)
            res.walletId = Id
            res.type = type
            res.pending = pendingTmp
            _this.history = res
            _this.history.sort(function (a, b) {
              return (a.timestamp - b.timestamp)
            }).reverse()
            _this.history.pending.sort(function (a, b) {
              return (a.timestamp - b.timestamp)
            }).reverse()
          }
          _this.error = false
          if (i === 24) {
            _this.done = {type: type, status: true, walletId: Id}
            setTimeout(function () {
              _this.downloadProgress = 0
              _this.root.$emit('downloadProgress', 0)
              _this.totalProgress = 0
              _this.root.$emit('totalProgress', 0)
            }, 500)
            clearTimeout(connTimer)
            console.timeEnd('time_log')
          }
        } catch (e) {
          _this.done = {type: type, status: true, walletId: Id}
          console.log(e)
          if (!errorShown && e.message !== 'close connect' && e.message !== 'ESOCKET') {
            alert(e.message)
            errorShown = true
          }
          _this.error = true
          clearTimeout(connTimer)
          setTimeout(function () {
            _this.downloadProgress = 0
            _this.root.$emit('downloadProgress', 0)
            _this.totalProgress = 0
            _this.root.$emit('totalProgress', 0)
          }, 500)
        }
      }
    })
  }
  async sendCoins (address, amount, fee, keys, changeKeys, addresses, changes, settings, walletId, type, second) {
    second = second || false
    // ERUBMECkNsBLffp6LaQqVdR7zW3E1qTiwr
    addresses = addresses.concat(changes)
    keys = keys.concat(changeKeys)
    let newTx = {}
    let utxos = []
    let headers = []
    let unspent = []
    let usedChanges = []
    let done = false
    this.sent.status = false
    let satoshis = type === 'btc' ? bitcore.Unit.fromBTC(amount).toSatoshis() : bitcore.EMCUnit.fromEMC(amount).toSatoshis()
    fee = type === 'btc' ? bitcore.Unit.fromBTC(fee).toSatoshis() : bitcore.EMCUnit.fromSatoshis(fee).toSatoshis()
    let privateKeys = []
    let signKeys = []
    let ui = 0
    const ecl = new ElectrumCli(settings.port, settings.host, 'tcp') // tcp or tls
    await ecl.connect()
    try {
      DB.utxos.find({walletId: walletId, type: type}, async function (err, localUTXOS) {
        if (err) console.log(err)
        for (let [index, addr] of addresses.entries()) {
          let i = 0
          unspent[index] = await ecl.blockchainAddress_listunspent(addr.address)
          privateKeys.push(bitcore.HDPrivateKey.fromString(keys[index].xpriv).privateKey)
          unspent[index].pubkeyhash = type === 'btc' ?
            bitcore.Script.buildPublicKeyHashOut(bitcore.Address.fromString(addr.address, 'livenet')) :
            bitcore.Script.buildPublicKeyHashOut(bitcore.Address.fromString(addr.address, 'emcnet'))
          unspent[index].address = type === 'btc' ?
            bitcore.Address.fromString(addr.address, 'livenet') :
            bitcore.Address.fromString(addr.address, 'emcnet')
          if (unspent.length === 25) {
            for (let [idx, utx] of unspent.entries()) {
              if (utx.length > 0) {
                for (let item of utx) {
                  if (typeof localUTXOS.find(i => i.change === false && i.txId === item.tx_hash && i.satoshis === item.value && i.outputIndex === item.tx_pos) === 'undefined') {
                    headers[ui] = {}
                    headers[ui].height = item.height
                    headers[ui].tx_hash = item.tx_hash
                    headers[ui].tx_pos = item.tx_pos
                    headers[ui].value = item.value
                    headers[ui].pubkeyhash = unspent[idx].pubkeyhash
                    headers[ui].address = unspent[idx].address
                    headers[ui].xpriv = privateKeys[idx]
                    ui++
                  }
                }
              }
              if (type === 'btc') {
                headers.sort(function (a, b) {
                  return a.value - b.value
                }).reverse()
              } else {
                headers.sort(function (a, b) {
                  return a.height - b.height
                }).reverse()
              }
            }
            if (localUTXOS.length > 0) {
              for (let localUTXO of localUTXOS) {
                if (localUTXO.change === true && typeof headers.find(i => i.tx_hash === localUTXO.txId && i.value === localUTXO.satoshis) === 'undefined') {
                  let pubKeyHash = bitcore.Script.buildPublicKeyHashOut(localUTXO.address)
                  let changeKey = changeKeys.find(key => key.address === localUTXO.address)
                  let changeXPriv = bitcore.HDPrivateKey.fromString(changeKey.xpriv).privateKey
                  headers.unshift({
                    height: 0,
                    tx_hash: localUTXO.txId,
                    tx_pos: localUTXO.outputIndex,
                    value: localUTXO.satoshis,
                    pubkeyhash: pubKeyHash,
                    address: localUTXO.address,
                    xpriv: changeXPriv
                  })
                }
              }
            }
            let utxAmount = 0
            for (let head of headers) {
              let checkUTXO = head.height > 0 ? false : typeof localUTXOS.find(i => i.txId === head.tx_hash && i.change === false) !== 'undefined'
              if (!checkUTXO) {
                utxAmount += head.value
                if (done === false) {
                  if (type === 'btc') {
                    utxos.push(new bitcore.Transaction.UnspentOutput({
                      txid: head.tx_hash,
                      outputIndex: head.tx_pos,
                      script: head.pubkeyhash,
                      satoshis: head.value,
                      address: head.address
                    }))
                  } else {
                    utxos.push(new bitcore.Transaction.EMCUnspentOutput({
                      txid: head.tx_hash,
                      outputIndex: head.tx_pos,
                      script: head.pubkeyhash,
                      satoshis: head.value,
                      address: head.address
                    }))
                  }
                  signKeys.push(head.xpriv)
                  if (head.height === 999999) {
                    usedChanges.push({
                      txId: head.tx_hash,
                      height: head.height
                    })
                  }
                  i++
                }
                if (utxAmount > (satoshis + fee)) {
                  done = true
                }
              }
            }
          }
        }
        // EUGtkZQoi5aoXjcCGCpLHxghDFSAYDpyGA
        // 1GT21zA1NtFmGMaXH2KaxFNDMzLzzBQMRi
        // 0.853062
        if (utxos.length === 1) {
          utxos = utxos[0]
        }
        let change = 0
        if (type === 'btc') {
          newTx = new bitcore.Transaction()
          newTx.from(utxos)
          newTx.to(address, satoshis)
          newTx.change(settings.change)
          newTx.feePerKb(fee)
          newTx = newTx.sign(signKeys)
          if (!second) {
            let txBuffer = newTx.toBuffer()
            let size = Buffer.byteLength(txBuffer)
            let feePerKb = Math.ceil(size * fee / 1000)
            feePerKb = bitcore.Unit.fromSatoshis(feePerKb).toBTC()
            this.sendCoins(address, amount, feePerKb, keys, changeKeys, addresses, changes, settings, walletId, type, true)
          }
        } else {
          newTx = new bitcore.EMCTransaction()
          newTx.from(utxos)
          newTx.to(address, satoshis)
          change = (newTx.inputAmount - newTx.outputAmount)
          if (change > 10000) {
            newTx.change(settings.change)
            newTx.fee(fee)
          }
          newTx = newTx.sign(signKeys)
        }
        let txBuffer = newTx.toBuffer()
        let size = Buffer.byteLength(txBuffer)
        console.log(size)
        console.log(newTx)
        if ((type === 'btc' && second) || (type === 'emc')) {
          let txBuffer = newTx.toBuffer()
          let size = Buffer.byteLength(txBuffer)
          if (utxos.length === 0 || (newTx.inputAmount - fee) < newTx.outputAmount) {
            let message = _I18n.translate('insufficient_funds')
            alert(message, type === 'btc' ? 'Bitcoin - ' + _I18n.translate('send_error') : 'Emercoin - ' + _I18n.translate('send_error'))
            this.sent.status = true
            throw new Error(message)
          }
          let txRaw = newTx.serialize()
          let response = await ecl.blockchainTransaction_broadcast(txRaw)
          let responseError = response.match(/the transaction was rejected by network rules/i)
          if (responseError === null) {
            let changeIndex = 0
            let changeOutput = newTx.getChangeOutput()
            if (changeOutput !== null) {
              let changeAddress = type === 'btc' ?
                bitcore.Address.fromScript(changeOutput.script, 'livenet') :
                bitcore.Address.fromScript(changeOutput.script, 'emcnet')
              let changePubKeyHash = bitcore.Script.buildPublicKeyHashOut(changeAddress.toString())
              for (let i = 0; i < newTx.outputs.length; i++) {
                let outputAddress = type === 'btc' ?
                  bitcore.Address.fromScript(newTx.outputs[i].script, 'livenet').toString() :
                  bitcore.Address.fromScript(newTx.outputs[i].script, 'emcnet').toString()
                if (outputAddress === changeAddress.toString()) {
                  changeIndex = i
                }
              }
              DB.utxos.insert({
                address: changeAddress.toString(),
                outputIndex: changeIndex,
                satoshis: changeOutput.satoshis,
                script: changePubKeyHash,
                txId: newTx.id,
                timestamp: moment().unix(),
                change: true,
                walletId: walletId,
                type: type
              }, function (err, res) {
                if (err) console.log(err)
                console.log(res)
              })
            }
            // ERUBMECkNsBLffp6LaQqVdR7zW3E1qTiwr
            let date = Functions.getDate(moment().unix())
            let normalFee = type === 'btc' ?
              bitcore.Unit.fromSatoshis(fee).toBTC() :
              bitcore.EMCUnit.fromSatoshis(fee).toEMC()
            amount = type === 'btc' ?
              bitcore.Unit.fromSatoshis(satoshis).toBTC() :
              bitcore.EMCUnit.fromSatoshis(satoshis).toEMC()
            let notifyAmount = type === 'btc' ?
              Functions.round(amount, 8) :
              Functions.round(amount, 6)
            let message = type === 'btc' ?
              _I18n.translate('date') + ': ' + date + '\n' + _I18n.translate('amount') + ': -' + notifyAmount + ' BTC\n' + _I18n.translate('fee') + ': -' + normalFee + ' BTC\n' + _I18n.translate('type') + ': ' + _I18n.translate('sent_to') + '\n' + _I18n.translate('address') + ': ' + address :
              _I18n.translate('date') + ': ' + date + '\n' + _I18n.translate('amount') + ': -' + notifyAmount + ' EMC\n' + _I18n.translate('fee') + ': -' + normalFee + ' EMC\n' + _I18n.translate('type') + ': ' + _I18n.translate('sent_to') + '\n' + _I18n.translate('address') + ': ' + address
            if (utxos.length > 1) {
              for (let utxo of utxos) {
                DB.utxos.insert({
                  address: utxo.address.toString(),
                  outputIndex: utxo.outputIndex,
                  satoshis: utxo.satoshis,
                  script: utxo.script.toString(),
                  txId: utxo.txId,
                  timestamp: moment().unix(),
                  change: false,
                  walletId: walletId,
                  type: type
                }, function (err, res) {
                  console.log(err)
                  console.log('Insert UTXOs', res)
                })
              }
            } else {
              DB.utxos.insert({
                address: utxos.address.toString(),
                outputIndex: utxos.outputIndex,
                satoshis: utxos.satoshis,
                script: utxos.script.toString(),
                txId: utxos.txId,
                timestamp: moment().unix(),
                change: false,
                walletId: walletId,
                type: type
              }, function (err, res) {
                if (err) console.log(err)
                console.log('Insert UTXOs', res)
              })
            }
            for (let change of usedChanges) {
              DB.utxos.remove({txId: change.txId}, function (err, res) {
                if (err) console.log(err)
                console.log('Removed changes: ', res)
              })
            }
            this.sent.status = true
            let sent_transaction =  _I18n.translate('sent_transaction')
            alert(message, type === 'btc' ? 'Bitcoin - ' + sent_transaction : 'Emercoin - ' + sent_transaction)
          } else {
            let error = response.replace(/\[[0-9a-zA-Z]*]/g, '')
            this.sent.status = true
            let send_error =  _I18n.translate('send_error')
            alert(error, type === 'btc' ? 'Bitcoin - ' + send_error : 'Emercoin - ' + send_error)
            throw new Error(error)
          }
        }
      }.bind(this))
    } catch (e) {
      this.sent.status = true
      let send_error =  _I18n.translate('send_error')
      alert(e.message, type === 'btc' ? 'Bitcoin - ' + send_error : 'Emercoin - ' + send_error)
      console.error(e.message)
    }
  }
}

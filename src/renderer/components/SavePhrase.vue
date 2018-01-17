<template>
    <div id="wrapper">
        <div class="col-md-8 col-md-offset-2 col-sm-9 col-sm-offset-1-5">
            <div class="panel panel-default small" v-if="Confirmed === false">
                <div v-if="!action">
                    <form @submit.prevent="setActions($event)">
                        <div class="panel-heading">{{ $I18n.translate('select_action') }}</div>
                        <div class="panel-body">
                            <div style="margin-bottom: 5px" class="info">
                                <b>{{ $I18n.translate('want_create_seed') }}</b>
                            </div>
                            <div class="form-group">
                                <label class="radio"><input type="radio" v-model="selected" :value="'new'">{{ $I18n.translate('new_wallet') }}</label>
                                <label class="radio"><input type="radio" v-model="selected" :value="'restore'">{{ $I18n.translate('restore_wallet') }}</label>
                            </div>
                        </div>
                        <div class="panel-footer text-right">
                            <button class="btn btn-xs btn-default" @click="$router.push('/')">{{ $I18n.translate('back') }}</button>
                            <button type="submit" :disabled="selected === false ? true : false" class="btn btn-xs btn-default">{{ $I18n.translate('next') }}</button>
                        </div>
                    </form>
                </div>
                <div v-if="action === 'new'">
                    <div class="panel-heading">{{ $I18n.translate('save_phrase') }}</div>
                    <div class="panel-body">
                        <div style="margin-bottom: 5px">
                            <div class="col-sm-6 info">
                                <p><b>{{ $I18n.translate('please_save_words') }}</b></p>
                            </div>
                            <div class="col-sm-6">
                                <p style="color:red;font-size:11px">

                                    <ul>
                                        <b>{{ $I18n.translate('attention') }}:</b>
                                        <li>{{ $I18n.translate('never_disclose') }}</li>
                                        <li>{{ $I18n.translate('never_type') }}</li>
                                        <li>{{ $I18n.translate('do_not_store') }}</li>
                                    </ul>
                                </p>
                            </div>
                            <b style="font-size:11px">{{ $I18n.translate('your_seed_is') }}:</b>
                        </div>
                        <div class="col-md-6 col-sm-6 info">
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[0]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 1</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[0]" :value="Phrase[0]" disabled class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[1]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 2</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[1]" :value="Phrase[1]" disabled class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[2]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 3</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[2]" :value="Phrase[2]" disabled class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[3]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 4</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[3]" :value="Phrase[3]" disabled class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[4]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 5</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[4]" :value="Phrase[4]" disabled class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[5]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 6</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[5]" :value="Phrase[5]" disabled class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-6 info">
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[6]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 7</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[6]" :value="Phrase[6]" disabled class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[7]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 8</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[7]" :value="Phrase[7]" disabled class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[8]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 9</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[8]" :value="Phrase[8]" disabled class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[9]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 10</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[9]" :value="Phrase[9]" disabled class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[10]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 11</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[10]" :value="Phrase[10]" disabled class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[11]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 12</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[11]" :value="Phrase[11]" disabled class="form-control">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel-footer text-right">
                        <button class="btn btn-xs btn-default" @click="back()">{{ $I18n.translate('back') }}</button>
                        <button class="btn btn-xs btn-default" @click="savePhrase()">{{ $I18n.translate('next') }}</button>
                    </div>
                </div>
                <div v-else-if="action === 'restore'">
                    <div class="panel-heading">{{ $I18n.translate('restore_seed_phrase') }}</div>
                    <div class="panel-body">
                        <div style="margin-bottom: 15px" class="info">
                            <b></b>
                            <b>{{ $I18n.translate('enter_seed') }}</b>
                        </div>
                        <div class="col-md-6 col-sm-6 info">
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[0]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 1</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[0]" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof RestorePhrase[0] !== 'undefined' && validateField(0))}" v-model="RestorePhrase[0]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[1]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 2</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[1]" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof RestorePhrase[1] !== 'undefined' && validateField(1))}" v-model="RestorePhrase[1]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[2]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 3</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[2]" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof RestorePhrase[2] !== 'undefined' && validateField(2))}" v-model="RestorePhrase[2]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[3]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 4</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[3]" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof RestorePhrase[3] !== 'undefined' && validateField(3))}" v-model="RestorePhrase[3]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[4]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 5</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[4]" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof RestorePhrase[4] !== 'undefined' && validateField(4))}" v-model="RestorePhrase[4]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[5]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 6</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[5]" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof RestorePhrase[5] !== 'undefined' && validateField(5))}" v-model="RestorePhrase[5]" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-6 info">
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[6]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 7</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[6]" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof RestorePhrase[6] !== 'undefined' && validateField(6))}" v-model="RestorePhrase[6]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[7]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 8</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[7]" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof RestorePhrase[7] !== 'undefined' && validateField(7))}" v-model="RestorePhrase[7]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[8]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 9</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[8]" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof RestorePhrase[8] !== 'undefined' && validateField(8))}" v-model="RestorePhrase[8]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[9]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 10</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[9]" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof RestorePhrase[9] !== 'undefined' && validateField(9))}" v-model="RestorePhrase[9]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[10]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 11</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[10]" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof RestorePhrase[10] !== 'undefined' && validateField(10))}" v-model="RestorePhrase[10]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label :for="Phrase[11]" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 12</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" :id="Phrase[11]" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof RestorePhrase[11] !== 'undefined' && validateField(11))}" v-model="RestorePhrase[11]" class="form-control">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel-footer">
                        <div class="row">
                            <div class="text-left col-sm-6" style="padding-top: 3px;">
                                <span v-if="isPhraseValid" class="text-danger">
                                    <i class="fa fa-warning"></i>
                                    {{ $I18n.translate('incorrect_phrase') }}
                                </span>
                            </div>
                            <div class="text-right col-sm-6">
                                <button class="btn btn-xs btn-default" @click="back()">{{ $I18n.translate('back') }}</button>
                                <button class="btn btn-xs btn-default" :disabled="!isValid || disabled" @click="restorePhrase(RestorePhrase)">{{ $I18n.translate('restore') }}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Keys from './Models/Keys.vue'
  import $ from 'jquery'
  import Functions from '../tools/Functions'
  let bitcore = require('bitcore-bip39')

  export default {
    name: 'save-phrase',
    data () {
      return {
        Phrase: [],
        RestorePhrase: [],
        isValid: false,
        askPassword: false,
        action: false,
        selected: false,
        Confirmed: false,
        disabled: false,
        Keys: {},
        mask: {
          regex: '[a-zA-Z]*',
          greedy: false
        }
      }
    },
    computed: {
      isPhraseValid () {
        let p = 0
        if (this.RestorePhrase.length === 12) {
          for (let i = 0; i < this.RestorePhrase.length; i++) {
            if (Functions.inArray(this.RestorePhrase[i], bitcore.Bip39.wordlists.english)) {
              p++
            }
          }
          if (p === 12) {
            return !this.validatePhrase(this.RestorePhrase)
          }
        }
      }
    },
    mounted: function () {
      this.updatePhrase()
      setTimeout(function () {
        this.$forceUpdate()
      }.bind(this), 500)
      console.log(this.Phrase.join(' '))
    },
    watch: {
      RestorePhrase () {
        $.each(this.RestorePhrase, function (index, value) {
          if (typeof value !== 'undefined') this.RestorePhrase[index] = value.toLowerCase()
        }.bind(this))
        this.isValid = this.validatePhrase(this.RestorePhrase)
      }
    },
    methods: {
      updatePhrase () {
        this.Phrase = Keys.methods.generateMnemonicPhrase().split(' ')
      },
      clearClipboard () {
        let { clipboard } = require('electron')
        clipboard.writeText('')
      },
      setActions () {
        this.action = this.selected
      },
      savePhrase () {
        this.clearClipboard()
        this.$router.push('/confirm/' + this.$route.params.wallet_name + '/' + this.Phrase.join(' '))
      },
      restorePhrase (Phrase) {
        if (!this.disabled) {
          this.disabled = true
          Phrase = Phrase.join(' ')
          let _this = this
          let addresses = []
          let changes = []
          if (bitcore.Bip39.validateMnemonic(Phrase)) {
            this.Keys = this.getKeys()
            this.$db.insert({
              walletName: this.$route.params.wallet_name,
              phrase: Phrase,
              keys: this.Keys,
              changes: {
                emc: this.Keys.emc.changes,
                btc: this.Keys.btc.changes
              },
              generalKey: _this.Keys.emc[0].generalXPriv
            }, function (err, doc) {
              if (err) alert(err)
              // Set Default Settings for Wallet'
              _this.$db.settings.findOne({walletId: null}, function (err, res) {
                if (err) console.log(err)
                if (res === null) {
                  _this.$store.dispatch('setSettings', {
                    emc: {
                      host: 'emcx.emercoin.com',
                      port: 9110,
                      ssl: false,
                      change: _this.Keys.emc.changes[0].address
                    },
                    btc: {
                      host: 'btcx.emercoin.com',
                      port: 50001,
                      ssl: false,
                      change: _this.Keys.btc.changes[0].address
                    },
                    walletId: doc._id
                  })
                } else {
                  _this.$store.dispatch('setSettings', {
                    emc: {
                      host: res.emc.host,
                      port: res.emc.port,
                      change: _this.Keys.emc.changes[0].address
                    },
                    btc: {
                      host: res.btc.host,
                      port: res.btc.port,
                      change: _this.Keys.btc.changes[0].address
                    },
                    walletId: doc._id
                  })
                }
              })
              // Emc addresses
              for (let i = 0; i < 20; i++) {
                _this.$db.addresses.insert({
                  type: 'emc',
                  generalKey: _this.Keys.emc[i].generalXPriv,
                  address: _this.Keys.emc[i].address,
                  name: _this.Keys.emc[i].name,
                  wallet_id: doc._id,
                  sortOrder: i
                }, function (err, doc) {
                  if (err) alert(err)
                  addresses.push(doc)
                })
              }
              // Btc addresses
              for (let i = 0; i < 20; i++) {
                _this.$db.addresses.insert({
                  type: 'btc',
                  generalKey: _this.Keys.btc[i].generalXPriv,
                  address: _this.Keys.btc[i].address,
                  name: _this.Keys.btc[i].name,
                  wallet_id: doc._id,
                  sortOrder: i
                }, function (err, doc) {
                  if (err) alert(err)
                  addresses.push(doc)
                })
              }
              // Emc changes
              for (let [i, change] of _this.Keys.emc.changes.entries()) {
                _this.$db.changes.insert({
                  type: 'emc',
                  generalKey: change.generalXPriv,
                  address: change.address,
                  wallet_id: doc._id,
                  sortOrder: i
                }, function (err, doc) {
                  if (err) alert(err)
                  changes.push(doc)
                })
              }
              // Btc changes
              for (let [i, change] of _this.Keys.btc.changes.entries()) {
                _this.$db.changes.insert({
                  type: 'btc',
                  generalKey: change.generalXPriv,
                  address: change.address,
                  wallet_id: doc._id,
                  sortOrder: i
                }, function (err, doc) {
                  if (err) alert(err)
                  changes.push(doc)
                })
              }
              // setTimeout(function () {
              //  _this.$store.dispatch('addAddresses', addresses)
              //  _this.$store.dispatch('addChanges', changes)
              // }, 1400)
            })
            this.Confirmed = true
            this.$db.settings.findOne({type: 'password'}, function (err, res) {
              if (err) console.log(err)
              if (res === null) {
                let message = _this.$I18n.translate('ask_set_password')
                let answer = confirm(message, 'Emercoin Secure ' + _this.$I18n.translate('wallet'))
                if (answer) {
                  _this.askPassword = true
                  $('#set-password').modal('show')
                }
              }
            })
            setTimeout(function () {
              this.$router.push('/wallet/' + this.$route.params.wallet_name + '/dashboard?new=true')
            }.bind(this), 1500)
          } else {
            let message = this.$I18n.translate('invalid_seed')
            let title = this.$I18n.translate('warning')
            alert(message, title)
          }
        }
      },
      validatePhrase (Phrase) {
        Phrase = Phrase.join(' ')
        return bitcore.Bip39.validateMnemonic(Phrase)
      },
      validateField (index) {
        if (this.RestorePhrase[index] !== 'undefined') {
          return !Functions.inArray(this.RestorePhrase[index], bitcore.Bip39.wordlists.english)
        } else {
          return false
        }
      },
      getKeys () {
        let keys = {
          emc: Keys.methods.generateEmcKeys(this.RestorePhrase.join(' ')),
          btc: Keys.methods.generateBtcKeys(this.RestorePhrase.join(' '))
        }
        return keys
      },
      back () {
        this.updatePhrase()
        this.RestorePhrase = []
        this.action = false
        this.selected = false
      }
    }
  }
</script>

<style scoped>
    .control-label {
        text-transform: capitalize;
    }
    .form-group {
        min-height: 20px;
    }
    .form-group label.radio {
        margin-left: 20px;
        font-weight: normal;
    }
    .form-group label.control-label {
        font-weight: normal;
        margin-bottom: 0;
        padding: 3px 0 0 12px;
    }
    .panel-footer {
        overflow: auto;
    }
</style>
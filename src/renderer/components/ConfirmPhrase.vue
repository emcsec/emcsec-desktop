<template>
    <div class="wrapper">
        <div class="col-md-8 col-md-offset-2 col-sm-9 col-sm-offset-1-5">
            <div class="panel panel-default small" v-if="!Confirmed">
                <div>
                    <div class="panel-heading">{{ $I18n.translate('confirm_phrase') }}</div>
                    <div class="panel-body">
                        <div class="info" style="margin-bottom: 15px">
                            <b v-html="$I18n.translate('your_phrase_is_important')"></b>
                        </div>
                        <div class="col-md-6 col-sm-6 info">
                            <div class="form-group form-group-xs">
                                <label for="word1" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 1</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" id="word1" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof PhraseConfirm[0] !== 'undefined' && validateField(0))}" v-model="PhraseConfirm[0]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label for="word2" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 2</label>
                                <div class="col-md-6 col-sm-6" :class="{ 'control': true }">
                                    <input type="text" id="word2" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof PhraseConfirm[1] !== 'undefined' && validateField(1))}" v-model="PhraseConfirm[1]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label for="word3" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 3</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" id="word3" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof PhraseConfirm[2] !== 'undefined' && validateField(2))}" v-model="PhraseConfirm[2]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label for="word4" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 4</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" id="word4" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof PhraseConfirm[3] !== 'undefined' && validateField(3))}" v-model="PhraseConfirm[3]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label for="word5" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 5</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" id="word5" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof PhraseConfirm[4] !== 'undefined' && validateField(4))}" v-model="PhraseConfirm[4]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label for="word6" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 6</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" id="word6" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof PhraseConfirm[5] !== 'undefined' && validateField(5))}" v-model="PhraseConfirm[5]" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-sm-6 info">
                            <div class="form-group form-group-xs">
                                <label for="word7" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 7</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" id="word7" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof PhraseConfirm[6] !== 'undefined' && validateField(6))}" v-model="PhraseConfirm[6]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label for="word8" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 8</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" id="word8" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof PhraseConfirm[7] !== 'undefined' && validateField(7))}" v-model="PhraseConfirm[7]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label for="word9" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 9</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" id="word9" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof PhraseConfirm[8] !== 'undefined' && validateField(8))}" v-model="PhraseConfirm[8]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label for="word10" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 10</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" id="word10" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof PhraseConfirm[9] !== 'undefined' && validateField(9))}" v-model="PhraseConfirm[9]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label for="word11" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 11</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" id="word11" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof PhraseConfirm[10] !== 'undefined' && validateField(10))}" v-model="PhraseConfirm[10]" class="form-control">
                                </div>
                            </div>
                            <div class="form-group form-group-xs">
                                <label for="word12" class="control-label col-md-3 col-sm-3">{{ $I18n.translate('word') }} 12</label>
                                <div class="col-md-6 col-sm-6">
                                    <input type="text" id="word12" v-mask="mask" v-validate="'alpha'" :class="{'input': true, 'is-danger': (typeof PhraseConfirm[11] !== 'undefined' && validateField(11))}" v-model="PhraseConfirm[11]" class="form-control">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel-footer text-right">
                        <button class="btn btn-xs btn-default" @click="back()">{{ $I18n.translate('back') }}</button>
                        <button class="btn btn-xs btn-default" :disabled="!isValid ? true : false" @click="confirmPhrase(PhraseConfirm)">{{ $I18n.translate('confirm') }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Keys from './Models/Keys.vue'
    import $ from 'jquery'
    let Bip39 = require('bitcore-bip39').Bip39

    export default {
      name: 'confirm-phrase',
      data () {
        return {
          PhraseConfirm: [],
          Phrase: '',
          isValid: false,
          Keys: {},
          Confirmed: false,
          disabled: false,
          mask: {
            regex: '[a-zA-Z]*',
            greedy: false
          }
        }
      },
      computed: {
      },
      watch: {
        PhraseConfirm () {
          $.each(this.PhraseConfirm, function (index, value) {
            if (typeof value !== 'undefined') this.PhraseConfirm[index] = value.toLowerCase()
          }.bind(this))
          this.isValid = (this.validatePhrase(this.PhraseConfirm) && this.$route.params.phrase === this.PhraseConfirm.join(' '))
        }
      },
      mounted () {
        setTimeout(function () {
          this.$forceUpdate()
        }.bind(this), 500)
      },
      methods: {
        validatePhrase (Phrase) {
          Phrase = Phrase.join(' ')
          return Bip39.validateMnemonic(Phrase)
        },
        validateField (index) {
          if (this.PhraseConfirm[index] !== '') {
            return (this.PhraseConfirm[index] !== this.$route.params.phrase.split(' ')[index])
          } else {
            return false
          }
        },
        confirmPhrase (PhraseConfirm) {
          let _this = this
          if (!this.disabled) {
            this.disabled = true
            PhraseConfirm = PhraseConfirm.join(' ')
            if (this.$route.params.phrase !== PhraseConfirm || !Bip39.validateMnemonic(PhraseConfirm)) {
              let message = this.$I18n.translate('phrase_not_match')
              let title = this.$I18n.translate('warning')
              alert(message, title)
            } else {
              this.Phrase = PhraseConfirm
              this.Keys = this.getKeys()
              this.$db.insert({
                walletName: this.$route.params.wallet_name,
                phrase: PhraseConfirm,
                keys: this.Keys,
                changes: {
                  emc: this.Keys.emc.changes,
                  btc: this.Keys.btc.changes
                },
                generalKey: this.Keys.emc[0].generalXPriv
              }, function (err, doc) {
                if (err) alert(err)
                this.$store.dispatch('setAddresses', doc)
                this.$store.dispatch('setChanges', doc)
                // Set Default Settings for Wallet
                _this.$db.settings.findOne({walletId: null}, function (err, res) {
                  if (err) console.log(err)
                  if (res === null) {
                    _this.$store.dispatch('setSettings', {
                      emc: {
                        host: 'emcx.emercoin.net',
                        port: 9110,
                        ssl: false,
                        change: _this.Keys.emc.changes[0].address
                      },
                      btc: {
                        host: 'btcx.emercoin.net',
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
              }.bind(this))
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
              }.bind(this), 800)
            }
          }
        },
        getKeys () {
          let keys = {
            emc: Keys.methods.generateEmcKeys(this.Phrase),
            btc: Keys.methods.generateBtcKeys(this.Phrase)
          }
          return keys
        },
        back () {
          this.PhraseConfirm = []
          this.$router.push('/save-phrase/' + this.$route.params.wallet_name)
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
    .form-group label.control-label {
        font-weight: normal;
        margin-bottom: 0;
        padding: 3px 0 0 12px;
    }
</style>
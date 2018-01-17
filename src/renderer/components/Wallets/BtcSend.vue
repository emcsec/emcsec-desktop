<template>
    <div class="wrapper">
        <div class="col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3">
            <h5>{{ $I18n.translate('send_bitcoin') }}</h5>
            <div class="form">
                <div class="form-group form-group-sm">
                    <label for="address" class="control-label small">{{ $I18n.translate('address') }}:</label>
                    <div>
                        <input id="address" class="form-control" v-validate="'required|alpha_num'" :class="{'input': true, 'is-danger': data.address !== '' && validateAddress()}" @keyup="validate()" type="text" v-model.trim="data.address">
                    </div>
                </div>
                <div class="form-group form-group-sm">
                    <label for="amount" class="control-label small">{{ $I18n.translate('amount') }}:</label>
                    <div>
                        <input id="amount" class="form-control" v-validate="'required|decimal|min_value:0.00000546'" v-mask="mask" name="amount" :class="{'input': true, 'is-danger': errors.has('amount') && data.amount !== ''}" @keyup="validate()" type="text" v-model="data.amount">
                    </div>
                </div>
                <div class="form-group form-group-sm">
                    <label class="control-label small col-sm-12" style="padding-left:0">{{ $I18n.translate('fee') }} (BTC/Kb):</label>
                    <div class="col-sm-4" style="padding-right:0;padding-left:0">
                      <input type="radio" id="recommended" :value="true" v-model="recommended">
                      <label for="recommended" class="small">{{ $I18n.translate('recommended') }}</label><br>
                      <input type="radio" id="custom" @click="changeFee()" :value="false" v-model="recommended">
                      <label for="custom" class="small">{{ $I18n.translate('custom') }}</label>
                    </div>
                    <div style="height: 40px" class="col-sm-8" v-if="recommended">
                      <vue-slider
                        ref="slider"
                        v-model.number="data.fee"
                        :data="feeArr"
                        :tooltip="'hover'"
                        :piecewise="true"
                        :piecewiseLabel="true"
                        :piecewiseStyle="{
                          'backgroundColor': '#ccc',
                          'visibility': 'visible',
                          'width': '12px',
                          'height': '12px'
                        }"
                        :piecewiseActiveStyle="{
                          'backgroundColor': '#ef9e5b'
                        }"
                        :labelStyle="{
                          'fontSize': '9px'
                        }"
                        :labelActiveStyle="{
                          'color': '#ef9e5b'
                        }"
                        :processStyle="{
                          'backgroundColor': '#ef9e5b'
                        }"
                        :tooltipStyle="{
                          'backgroundColor': '#666',
                          'borderColor': '#666'
                        }"
                      ></vue-slider>
                    </div>
                    <div class="col-sm-8 text-right" style="padding-right:0" v-else>
                        <input type="text" class="form-control" v-validate="'required|decimal|min_value:0.00001'" v-mask="mask" name="fee" :class="{'input': true, 'is-danger': errors.has('fee')}" @keyup="validate()" v-model.number="data.fee">
                        <span class="col-sm-12" style="padding-left:0;padding-right:0;font-size:9px">{{ $I18n.translate('minimum_fee') }}</span>
                    </div>
                </div>
                <div class="form-group-xs col-sm-12 text-right" style="padding-right:0;padding-top:10px;">
                    <button class="btn btn-sm btn-default btc" :disabled="valid ? false : true" @click="send(data)">{{ $I18n.translate('send') }}</button>
                </div>
                <div :class="loader ? 'send-loader' : ''"></div>
                <moon-loader v-if="loader" color="#000" size="40px"></moon-loader>
            </div>
        </div>
    </div>
</template>

<script>
  import { Address } from 'bitcore-bip39'
  import $ from 'jquery'
  import ESRV from '../../tools/ElectrumSRV'
  import vueSlider from 'vue-slider-component'
  import MoonLoader from 'vue-spinner/src/MoonLoader.vue'

  export default {
    name: 'btc-send',
    data () {
      return {
        ElectrumSRV: new ESRV(this.$root),
        data: {
          address: '',
          amount: '',
          fee: 0.00148372
        },
        feeArr: [
          0.00136222,
          0.00148372,
          0.00162258,
          0.00179907,
          0.00199912
        ],
        customFee: 0.00148372,
        recommendedFee: 0.00148372,
        valid: false,
        mask: {
          alias: 'decimal',
          mask: '*{1,9}[.*{0,8}]',
          greedy: false,
          skipOptionalPartCharacter: ' ',
          clearMaskOnLostFocus: true,
          definitions: {
            '*': {
              validator: '[0-9]',
              cardinality: 1,
              casing: 'lower'
            }
          }
        },
        addresses: [],
        changes: [],
        settings: [],
        recommended: true,
        custom: false,
        loader: false
      }
    },
    components: {
      vueSlider,
      MoonLoader
    },
    watch: {
      'data.fee': function () {
        if (this.recommended) {
          this.$db.fee.update({
            walletId: this.$store.state.Keystore.currentWallet._id,
            type: 'recommended'
          }, {$set: {fee: this.data.fee}}, function (err, count) {
            if (err) console.log(err)
            if (count === 0) {
              this.$db.fee.insert({
                walletId: this.$store.state.Keystore.currentWallet._id,
                type: 'recommended',
                fee: this.data.fee
              }, function (err, res) {
                if (err) console.log(err)
                console.log(res)
              })
            }
          }.bind(this))
          setTimeout(function () {
            this.recommendedFee = this.data.fee
          }.bind(this), 110)
        }
      },
      'recommended': function () {
        console.log(this.recommendedFee)
        console.log(this.customFee)
        setTimeout(function () {
          this.data.fee = !this.recommended ? this.customFee : this.recommendedFee
        }.bind(this), 100)
      }
    },
    mounted () {
      this.$store.dispatch('getAddresses')
      this.$store.dispatch('getChanges')
      this.$store.dispatch('getSettings', this.$store.state.Keystore.currentWallet._id)
      $(document).on('click', '#refresh-data', function () {
        this.update()
      }.bind(this))
      setTimeout(function () {
        $('#amount').attr('style', 'text-align: left')
      }, 50)
      setTimeout(function () {
        this.$db.fee.findOne({
          walletId: this.$store.state.Keystore.currentWallet._id,
          type: 'recommended'
        }, function (err, res) {
          if (err) console.log(err)
          if (res) {
            this.data.fee = res.fee
            this.recommendedFee = this.data.fee
          }
        }.bind(this))
      }.bind(this), 200)
      setTimeout(function () {
        console.log('init')
        this.settings = this.$store.getters.getSettings
        this.addresses = this.$store.getters.getBtcAddresses
        this.changes = this.$store.getters.getBtcChanges
        console.log(this.settings)
      }.bind(this), 500)
      this.$watch('data.fee', function () {
        console.log(this.data.fee)
      })
    },
    methods: {
      update () {
        this.data = {
          address: '',
          amount: '',
          fee: this.data.fee
        }
        this.valid = false
        this.error = {
          address: false,
          amount: false
        }
        this.mask = {
          alias: 'decimal',
          mask: '*{1,9}[.*{0,8}]',
          greedy: false,
          skipOptionalPartCharacter: ' ',
          clearMaskOnLostFocus: true,
          definitions: {
            '*': {
              validator: '[0-9]',
              cardinality: 1,
              casing: 'lower'
            }
          }
        }
        this.validate()
      },
      send (data) {
        let keys = this.$store.state.Keystore.currentWallet.keys.btc
        let changeKeys = this.$store.state.Keystore.currentWallet.changes.btc
        this.customFee = data.fee
        setTimeout(function () {
          this.ElectrumSRV.sendCoins(data.address, data.amount, data.fee, keys, changeKeys, this.addresses, this.changes, this.settings.btc, this.$store.state.Keystore.currentWallet.walletId, 'btc')
          let interval = setInterval(function () {
            this.loader = !this.ElectrumSRV.sent.status
          }.bind(this), 500)
          let unwatch = this.$watch('loader', function () {
            if (this.loader === false) {
              clearInterval(interval)
              unwatch()
            }
          })
        }.bind(this), 50)
        this.$db.fee.findOne({walletId: this.$store.state.Keystore.currentWallet._id, type: 'custom'}, function (err, res) {
          if (err) console.log(err)
          if (res !== null) {
            this.$db.fee.update(res, {$set: {fee: this.data.fee}}, function (err, count) {
              if (err) console.log(err)
              console.log(count)
            })
          } else {
            this.$db.fee.insert({
              walletId: this.$store.state.Keystore.currentWallet._id,
              type: 'custom',
              fee: this.data.fee
            }, function (err, result) {
              if (err) console.log(err)
              console.log(result)
            })
          }
        }.bind(this))
        this.update()
      },
      validate () {
        if (this.data.address !== '' && this.data.amount !== 0 && this.data.amount !== '' && Address.isValid(this.data.address, 'livenet') && !this.errors.has('amount') && !this.errors.has('fee')) {
          this.valid = true
        } else {
          this.valid = false
        }
      },
      validateAddress () {
        return !Address.isValid(this.data.address, 'livenet')
      },
      changeFee () {
        this.$db.fee.findOne({
          walletId: this.$store.state.Keystore.currentWallet._id,
          type: 'custom'
        }, function (err, res) {
          if (err) console.log(err)
          if (res !== null) {
            this.customFee = res.fee
          } else {
            this.customFee = 0.00148372
          }
        }.bind(this))
      }
    }
  }
</script>

<style>
    form {
        position: relative;
    }
    .send-loader {
        position: absolute;
        top: 0;
        left: -10px;
        width: 110%;
        height: 110%;
        background-color: rgba(255, 255, 255, .5);
    }
    .v-spinner {
        position: absolute;
        top: 40%;
        left: 47%;
    }
</style>
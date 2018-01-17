<template>
    <div class="wrapper">
        <div class="col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3">
            <h5>{{ $I18n.translate('send_emercoin') }}</h5>
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
                        <input id="amount" class="form-control" v-validate="'required|decimal|min_value:0.01'" v-mask="mask" name="amount" :class="{'input': true, 'is-danger': errors.has('amount') && data.amount !== ''}" @keyup="validate()" type="text" v-model="data.amount">
                    </div>
                </div>
                <div class="form-group-xs text-right">
                    <button class="btn btn-sm btn-default" :disabled="!valid" @click="send(data)">{{ $I18n.translate('send') }}</button>
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
  import MoonLoader from 'vue-spinner/src/MoonLoader.vue'

  export default {
    name: 'emc-send',
    components: { MoonLoader },
    data () {
      return {
        ElectrumSRV: new ESRV(this.$root),
        data: {
          address: '',
          amount: ''
        },
        valid: false,
        error: {
          address: false,
          amount: false
        },
        mask: {
          alias: 'decimal',
          mask: '*{1,9}[.*{0,6}]',
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
        loader: false
      }
    },
    mounted () {
      this.$store.dispatch('getAddresses')
      this.$store.dispatch('getChanges')
      this.$store.dispatch('getSettings', this.$store.state.Keystore.currentWallet._id)
      this.$watch('ElectrumSRV.sent', function () {
        console.log('ElectrumSRV.sent', this.ElectrumSRV.sent)
        this.loader = !this.ElectrumSRV.sent.status
      }, {deep: true})
      $(document).on('click', '#refresh-data', function () {
        this.update()
      }.bind(this))
      setTimeout(function () {
        $('#amount').attr('style', 'text-align: left')
      }, 50)
      setTimeout(function () {
        this.settings = this.$store.getters.getSettings
        this.addresses = this.$store.getters.getEmcAddresses
        this.changes = this.$store.getters.getEmcChanges
        this.$set(this.data, 'address', ' ')
        this.$set(this.data, 'address', '')
      }.bind(this), 800)
    },
    methods: {
      update () {
        this.data = {
          address: '',
          amount: ''
        }
        this.valid = false
        this.error = {
          address: false,
          amount: false
        }
        this.mask = {
          alias: 'decimal',
          mask: '*{1,9}[.*{0,6}]',
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
        let keys = this.$store.state.Keystore.currentWallet.keys.emc
        let changeKeys = this.$store.state.Keystore.currentWallet.changes.emc
        this.loader = true
        this.ElectrumSRV.sendCoins(data.address, data.amount, 100, keys, changeKeys, this.addresses, this.changes, this.settings.emc, this.$store.state.Keystore.currentWallet.walletId, 'emc')
        let interval = setInterval(function () {
          this.loader = !this.ElectrumSRV.sent.status
        }.bind(this), 500)
        let unwatch = this.$watch('loader', function () {
          if (this.loader === false) {
            clearInterval(interval)
            unwatch()
          }
        })
        this.update()
      },
      validate () {
        this.valid = (this.data.address !== '' &&
            this.data.amount !== 0 &&
            this.data.amount !== '' &&
            Address.isValid(this.data.address, 'emcnet') &&
            !this.errors.has('amount'))
      },
      validateAddress () {
        return !Address.isValid(this.data.address, 'emcnet')
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
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, .5);
    }
    .v-spinner {
        position: absolute;
        top: 40%;
        left: 47%;
    }
</style>
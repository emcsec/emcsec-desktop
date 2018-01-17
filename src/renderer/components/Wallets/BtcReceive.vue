<template>
    <div class="wrapper">
        <div class="col-md-8 col-md-offset-2">
            <div :class="address !== '' ? 'col-md-8 col-sm-8' : 'col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2'">
                <h5>{{ $I18n.translate('receive_bitcoin') }}</h5>
                <form class="form">
                    <div class="form-group form-group-sm dd">
                        <label for="address" class="small">{{ $I18n.translate('address') }}: </label>
                        <div class="dropdown">
                            <a role="button" id="address" class="btn btn-default btc dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                {{ address }} <span class="pull-right caret"></span>
                            </a>
                            <ul class="dropdown-menu">
                                <li>
                                    <a role="button" class="addresses form-group-xs" :class="addr.address === address ? 'btc-bg' : ''" v-for="(addr, index) in addresses" @click="selectAddress(addr.address)">
                                        <p class="address-name">
                                            <input type="text" v-model="editedAddress.name" class="form-control" v-if="isEdited && addr._id === editedAddress._id">
                                            <i class="glyphicon glyphicon-ok-circle confirm" role="button" @click="editName(editedAddress)" v-if="isEdited && addr._id === editedAddress._id"></i>
                                            <i class="glyphicon glyphicon-remove-circle cancel" role="button" @click="isEdited = false" v-if="isEdited && addr._id === editedAddress._id"></i>
                                            <span v-else>{{ addr.name }}</span>
                                        </p>
                                        <p class="address-item">{{ addr.address }}</p>
                                        <i class="glyphicon glyphicon-pencil edit-name" @click="isEdited = true; editedAddress = {address: addr.address, name: addr.name, _id: addr._id}"></i>
                                        <i class="glyphicon glyphicon-duplicate copy-address" title="Copy Address" @click="copyAddress(addr.address)"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="form-group form-group-sm">
                        <label for="amount" class="small">{{ $I18n.translate('amount') }}: </label>
                        <div>
                            <input id="amount" class="form-control amount" @change="formatAmount()" max="999999999.999999" type="number" v-model="amount">
                            <div style="color:red;font-weight:bold" v-if="inputError">
                                <span>{{ inputError }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group form-group-sm">
                        <label for="message" class="small">{{ $I18n.translate('message') }}: </label>
                        <div>
                            <textarea id="message" v-model="message" class="form-control" cols="30" rows="2"></textarea>
                        </div>
                    </div>
                </form>
            </div>
            <div class="qr-container">
                <div id="qr-holder" class="text-center col-md-4 col-sm-4 qrcode" style="padding: 20px; background: #fff" v-if="address !== ''">
                    <qrcode :value="qrvalue" :size="170"></qrcode>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import QrcodeVue from 'qrcode.vue'
  import $ from 'jquery'
  require('../../tools/QRCode')

  export default {
    name: 'btc-receive',
    components: {
      'qrcode': QrcodeVue
    },
    data () {
      return {
        address: '',
        amount: 0,
        message: '',
        inputError: false,
        isEdited: false,
        editedAddress: {}
      }
    },
    mounted () {
      this.getAddresses()
      this.$watch('$store.state.Keystore.addresses', function () {
        this.addresses = this.$store.getters.getEmcAddresses
        this.address = this.addresses[0].address
      })
      $(document).on('click', '#refresh-data', function () {
        this.update()
      }.bind(this))
      $(document).on('click', '.dropdown-menu i', function (e) {
        e.preventDefault()
        e.stopPropagation()
      })
    },
    computed: {
      addresses () {
        return this.$store.getters.getBtcAddresses
      },
      qrvalue () {
        let qr = 'bitcoin:' +
          this.address +
          (this.amount > 0 ? '?amount=' + Number(this.amount) : '') +
          ((this.message.length > 0 && this.amount > 0) ? '&message=' + this.message : '') +
          ((this.message.length > 0 && (this.amount === 0 || this.amount === '')) ? '?message=' + this.message : '')
        return qr
      }
    },
    methods: {
      update () {
        this.address = this.addresses[0].address
        this.amount = 0
        this.message = ''
        this.inputError = false
        this.isEdited = false
        this.editedAddress = {}
      },
      getAddresses () {
        this.$store.dispatch('getAddresses')
      },
      selectAddress (address) {
        this.address = address
      },
      editName (addr) {
        this.$db.addresses.update({_id: addr._id}, {$set: {name: addr.name}}, {}, function (err, count) {
          if (err) console.log(err)
          console.log(count)
          this.getAddresses()
          this.isEdited = false
        }.bind(this))
      },
      copyAddress (address) {
        let clipboard = require('electron').clipboard
        clipboard.writeText(address)
      },
      number_format (number, decimals, decPoint, thousandsSep) {
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
        let n = !isFinite(+number) ? 0 : +number
        let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
        let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
        let dec = (typeof decPoint === 'undefined') ? '.' : decPoint
        let s = ''
        let toFixedFix = function (n, prec) {
          let k = Math.pow(10, prec)
          return '' + (Math.round(n * k) / k)
            .toFixed(prec)
        }
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
          .split('.')
        if (s[0].length > 3) {
          s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
        }
        if ((s[1] || '').length < prec) {
          s[1] = s[1] || ''
          s[1] += new Array(prec - s[1].length + 1)
            .join('0')
        }
        return Number(s.join(dec))
      },
      formatAmount () {
        if (this.amount > 999999999.999999) {
          this.inputError = this.$I18n.translate('incorrect_value')
          this.amount = 0
          return false
        }
        this.inputError = false
        this.amount = this.number_format(this.amount, 8, '.', '')
      }
    }
  }
</script>

<style scoped>
    .form-group {
        margin-bottom: 10px;
        overflow: auto;
    }

    .form-group label {
        padding-top: 8px;
    }
    .form-group label.message {
        padding-top: 13px;
    }
    div.qr-container {
        padding-top: 55px;
    }
    div.qrcode {
        width: 210px;
        height: 210px;
        padding: 0;
    }
    div.qrcode canvas {
        width: 100% !important;
        height: 100% !important;
    }
    div.dd {
        overflow: visible;
    }
    div.dd div.dropdown,
    div.dd div.dropdown a {
        text-align: left;
        width: 100%;
    }
    div.dd ul.dropdown-menu {
        overflow-y: scroll;
        width: 100%;
        max-height: 200px;
    }
    .btn .caret {
        margin-top: 7px;
    }
    .address-name {
        min-height: 12px;
        font-size: 14px;
    }
    .address-item {
        height: 12px;
        font-size: 10px;
    }
    .addresses {
        position: relative;
    }
    .addresses i.edit-name {
        position: absolute;
        right: 45px;
        top: 20px;
        color: #337ab7;
    }
    .addresses input {
        width: 50%;
        float: left;
        margin-right: 5px;
    }
    .addresses i.copy-address {
        position: absolute;
        right: 20px;
        top: 20px;
        color: #4fc08d;
    }
    i.confirm {
        color: #4fc08d;
    }
    i.cancel {
        color: #d9534f
    }
    p.address-name, p.address-item {
        margin: 0 0 5px;
    }
</style>
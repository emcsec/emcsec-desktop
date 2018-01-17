<template>
  <div id="app" v-show="show">
      <MainMenu v-if="loginSuccess"></MainMenu>
      <Settings></Settings>
      <router-view v-if="loginSuccess"></router-view>
  </div>
</template>

<script>
  import MainMenu from './components/MainMenu.vue'
  import Settings from './components/Settings.vue'
  import crypto from 'crypto'
  import moment from 'moment'

  export default {
    name: 'emcsec-desktop',
    data () {
      return {
        loginSuccess: true,
        show: false
      }
    },
    components: { MainMenu, Settings },
    mounted () {
      let _this = this
      setTimeout(function () {
        this.show = true
      }.bind(this), 500)
      this.$db.settings.findOne({type: 'password'}, function (err, res) {
        if (err) console.log(err)
        if (res !== null) {
          _this.loginSuccess = false
          let title = _this.$I18n.translate('enter_password_title')
          _this.$swal({
            text: title,
            input: 'password',
            inputPlaceholder: _this.$I18n.translate('enter_password_here'),
            inputClass: 'form-control-xs',
            showCancelButton: false,
            confirmButtonText: _this.$I18n.translate('confirm'),
            confirmButtonClass: 'btn btn-sm btn-primary',
            confirmButtonColor: '#8C5DA3',
            showLoaderOnConfirm: true,
            width: '300px',
            padding: '15px',
            animation: false,
            preConfirm: (password) => {
              let md5Pass = crypto.createHash('md5').update(password).digest('hex')
              return new Promise((resolve) => {
                _this.$db.settings.findOne({_id: res._id, type: 'password'}, function (err, result) {
                  if (err) console.log(err)
                  console.log(res, result)
                  if (result !== null && md5Pass !== result.password) {
                    _this.$swal.showValidationError(
                      _this.$I18n.translate('password_error')
                    )
                  }
                  resolve()
                })
              })
            },
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((result) => {
            if (result.value) {
              _this.loginSuccess = true
            }
          })
        }
      })
      this.$db.utxos.find({change: true}, function (err, result) {
        if (err) console.log(err)
        console.log('DB Changes: ', result)
        for (let res of result) {
          let date = moment().unix()
          let dayCheck = (date - res.timestamp) > 86400000
          if (dayCheck) {
            this.$db.utxos.remove(res, function (err, res) {
              if (err) console.log(err)
              console.log(res)
            })
          }
        }
      }.bind(this))
      this.$db.utxos.find({}, function (err, result) {
        if (err) console.log(err)
        console.log('DB UTXOs: ', result)
        for (let res of result) {
          let date = moment().unix()
          let weekCheck = (date - res.timestamp) > 604800000
          if (weekCheck) {
            this.$db.utxos.remove(res, function (err, res) {
              if (err) console.log(err)
              console.log(res)
            })
          }
        }
      }.bind(this))
    }
  }
</script>

<style>
  /* CSS */
  @import "assets/css/bootstrap.min.css";
  @import "assets/css/helper.css";
  @import "~material-design-icons/iconfont/material-icons.css";
  @import "~font-awesome/css/font-awesome.css";

  .material-icons.md-15 { font-size: 15px; }

  *:disabled {
    cursor: default !important;
  }

  button:focus,
  a:focus {
      outline: 0 !important
  }

  .form-group-xs .form-control {
      height: 20px;
      padding: 5px 10px;
      font-size: 12px;
      line-height: 1;
      border-radius: 3px;
  }

  input.form-control-xs {
      height: 30px !important;
      padding: 5px 10px !important;
      font-size: 13px !important;
      line-height: 1 !important;
      border-radius: 3px !important;
  }

  .form-group-xs {
      margin-bottom: 3px;
      overflow: auto;
  }

  .col-sm-offset-1-5 {
      margin-left: 12%;
  }

  #wrapper, .wrapper {
    padding-top: 15px;
  }

  .panel-primary>.panel-heading {
    color: #fff;
    background-color: #8C5DA3;
    border-color: #8C5DA3;
  }

  .btn.btn-default:active {
      color: #fff;
      background: #8C5DA3;
  }

  .btn.btn-default.btc:active {
      color: #fff;
      background: #E77F2A !important;
  }

  .panel-primary {
    border-color: #8C5DA3;
  }

  .panel-body {
      padding-top: 5px;
  }

  .panel-footer {
      padding-top: 5px;
      padding-bottom: 5px;
  }

  .btn-sm {
      padding: 5px 10px !important;
      font-size: 12px !important;
      line-height: 1.5 !important;
      border-radius: 3px !important;
  }

  .btn-primary {
      color: #fff !important;
      background-color: #8C5DA3 !important;
      border-color: #8C5DA3 !important;
  }

  .btn-primary:hover,
  .btn-primary:focus,
  .btn-primary:active {
      background-color: #653c7a !important;
      color: #ccc !important;
  }

  .btn-primary-btc {
      color: #fff;
      background-color: #ef9e5b;
      border-color: #ef9e5b;
  }

  .btn-primary-btc:hover,
  .btn-primary-btc:focus,
  .btn-primary-btc:active {
      background-color: #E77F2A !important;
  }

  .dropdown-menu>.active>a {
    background-color: #8C5DA3 !important;
  }

  .dropdown-menu>li>a {
      padding-top: 5px;
      padding-bottom: 5px;
  }

  .loader {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow: auto;
    background: #fff;
    z-index: 1;
  }
  .v-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
  }
  div.info {
      font-size: 11px;
  }
  .navbar {
      min-height: 40px;
      margin-bottom: 0;
  }
  .navbar-nav>li>a {
      padding-top: 10px;
      padding-bottom: 10px;
  }
  .navbar-default .navbar-nav>li>a.active.emc,
  .navbar-default .navbar-nav>li>i.active.emc {
      color: #8C5DA3;
      font-weight: bold;
  }
  .navbar-default .navbar-nav>li>a.active.btc {
      color: #ef9e5b;
      font-weight: bold;
  }
  .wallets.open.emc>a {
      color: #8C5DA3 !important;
  }
  .wallets.open.btc>a {
      color: #ef9e5b !important;
  }
  input.is-danger,
  input.is-danger:focus {
      border-color: #ff3860;
  }

  span.is-danger {
      color: #ff3860;
  }

  input[type=radio] {
      margin: 1px 0 0;
  }
  .nav-tabs li a {
      color: #333;
  }
  .nav-tabs>.active>.emc-tab {
      color: #8C5DA3
  }
  .nav-tabs>.active>.emc-tab:hover,
  .nav-tabs>.active>.emc-tab:focus,
  .nav-tabs>.active>.emc-tab:active {
      color: #653c7a;
  }
  .nav-tabs>.active>.btc-tab {
      color: #ef9e5b
  }
  .nav-tabs>.active>.btc-tab:hover,
  .nav-tabs>.active>.btc-tab:focus,
  .nav-tabs>.active>.btc-tab:active {
      color: #E77F2A;
  }
  .emc-bg, li>a.emc-bg:hover {
      background: #8C5DA3;
  }
  .btc-bg, li>a.btc-bg:hover {
      background: #ef9e5b;
  }
  .swal2-popup .swal2-buttonswrapper {
      margin-top: 0 !important;
  }
  .swal2-popup .swal2-styled {
      margin: 0 5px 0 !important;
  }
  .swal2-popup .swal2-validationerror {
      margin-bottom: 10px;
      font-size: 12px;
  }
  .swal2-popup .swal2-input {
      margin: 20px auto 15px auto
  }
  .swal2-content {
      font-size: 14px !important;
  }
</style>

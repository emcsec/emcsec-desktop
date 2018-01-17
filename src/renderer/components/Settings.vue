<template>
<div>
    <div>
        <div class="modal fade" id="server-settings" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h5 class="modal-title">{{ $I18n.translate('servers') }}</h5>
                    </div>
                    <div class="modal-body small">
                        <div>
                            <!-- Nav tabs -->
                            <ul class="nav nav-tabs" role="tablist">
                                <li role="presentation" class="active col-sm-6 text-center"><a href="#emc-server" aria-controls="emc-server" class="emc-tab" role="tab" data-toggle="tab">{{ $I18n.translate('server_for_emercoin') }}</a></li>
                                <li role="presentation" class="col-sm-6 text-center"><a href="#btc-server" aria-controls="btc-server" class="btc-tab" role="tab" data-toggle="tab">{{ $I18n.translate('server_for_bitcoin') }}</a></li>
                            </ul>
                            <!-- Tab panes -->
                            <div class="tab-content" style="padding: 10px; overflow:auto;">
                                <div role="tabpanel" class="tab-pane fade in active" id="emc-server">
                                    <div class="form-group-xs">
                                        <label for="host" class="col-sm-2">{{ $I18n.translate('host') }}: </label>
                                        <div class="col-sm-5">
                                            <input type="text" id="host" v-validate="'required|url'" name="host" :class="{'input': true, 'is-danger': emc.host !== '' && errors.has('host')}" v-model="emc.host" class="form-control">
                                        </div>
                                    </div>
                                    <div class="form-group-xs">
                                        <label for="port" class="col-sm-2">{{ $I18n.translate('port') }}: </label>
                                        <div class="col-sm-5">
                                            <input type="text" id="port" class="form-control" v-validate="'required|numeric|max:5|max_value:65536'" name="port" v-model.number="emc.port" :class="{'input': true, 'is-danger': emc.port !== '' && errors.has('port')}" maxlength="5">
                                        </div>
                                    </div>
                                </div>
                                <div role="tabpanel" class="tab-pane fade" id="btc-server">
                                    <div class="form-group-xs">
                                        <label for="btc-host" class="col-sm-2">{{ $I18n.translate('host') }}: </label>
                                        <div class="col-sm-5">
                                            <input type="text" id="btc-host" v-validate="'required|url'" name="btc_host" :class="{'input': true, 'is-danger': errors.has('btc_host')}" v-model="btc.host" class="form-control">
                                        </div>
                                    </div>
                                    <div class="form-group-xs">
                                        <label for="btc-port" class="col-sm-2">{{ $I18n.translate('port') }}: </label>
                                        <div class="col-sm-5">
                                            <input type="text" id="btc-port" class="form-control" v-validate="'required|numeric|max:5|max_value:65536'" name="btc_port" v-model.number="btc.port" :class="{'input': true, 'is-danger': errors.has('btc_port')}" maxlength="5">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-xs btn-default" data-dismiss="modal">{{ $I18n.translate('close') }}</button>
                        <button type="button" @click="save()" :disabled="errors.has('btc_host') || errors.has('btc_port') || errors.has('host') || errors.has('port')" class="btn btn-xs btn-primary">{{ $I18n.translate('save') }}</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->
        <div class="modal fade" id="change-settings" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h5 class="modal-title">{{ $I18n.translate('addresses_for_change') }}</h5>
                    </div>
                    <div class="modal-body small">
                        <div>
                            <!-- Nav tabs -->
                            <ul class="nav nav-tabs" role="tablist">
                                <li role="presentation" class="active col-sm-6 text-center"><a href="#emc-change" aria-controls="emc-change" class="emc-tab" role="tab" data-toggle="tab">{{ $I18n.translate('address_for_change_emercoin') }}</a></li>
                                <li role="presentation" class="col-sm-6 text-center"><a href="#btc-change" aria-controls="btc-change" class="btc-tab" role="tab" data-toggle="tab">{{ $I18n.translate('address_for_change_bitcoin') }}</a></li>
                            </ul>
                            <!-- Tab panes -->
                            <div class="tab-content" style="padding: 10px; overflow:visible;">
                                <div role="tabpanel" class="tab-pane fade in active" id="emc-change">
                                    <div class="form-group-sm dd">
                                        <label for="address" class="col-sm-4">{{ $I18n.translate('select_address') }}: </label>
                                        <div class="dropdown">
                                            <a role="button" id="address" class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                {{ emc.change }} <span class="pull-right caret"></span>
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <a role="button" class="addresses form-group-xs" :class="addr.address === emc.change ? 'emc-bg' : ''" v-for="(addr, index) in addresses.emc" :ket="index" @click="selectAddress(addr.address, 'emc')">
                                                        <p class="address-name">
                                                            <span>{{ addr.name }}</span>
                                                        </p>
                                                        <p class="address-item">{{ addr.address }}</p>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div role="tabpanel" class="tab-pane fade" id="btc-change">
                                    <div class="form-group-sm dd">
                                        <label for="btc-address" class="col-sm-4">{{ $I18n.translate('select_address') }}: </label>
                                        <div class="dropdown">
                                            <a role="button" id="btc-address" class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                {{ btc.change }} <span class="pull-right caret"></span>
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <a role="button" class="addresses form-group-xs" :class="addr.address === btc.change ? 'btc-bg' : ''" v-for="(addr, index) in addresses.btc" :ket="index" @click="selectAddress(addr.address, 'btc')">
                                                        <p class="address-name">
                                                            <span>{{ addr.name }}</span>
                                                        </p>
                                                        <p class="address-item">{{ addr.address }}</p>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-xs btn-default" data-dismiss="modal">{{ $I18n.translate('close') }}</button>
                        <button type="button" @click="save()" class="btn btn-xs btn-primary">{{ $I18n.translate('save') }}</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->
        <div class="modal fade" id="language-settings" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h5 class="modal-title">{{ $I18n.translate('language') }}</h5>
                    </div>
                    <div class="modal-body small">
                        <div>
                            <form class="form">
                                <div class="form-group">
                                    <label for="lang">{{ $I18n.translate('select_language') }}</label>
                                    <select id="lang" v-model="language" class="form-control">
                                        <option value="en">{{ $I18n.translate('english') }}</option>
                                        <option value="ru">{{ $I18n.translate('russian') }}</option>
                                        <option value="cn">{{ $I18n.translate('chinese') }}</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-xs btn-default" data-dismiss="modal">{{ $I18n.translate('close') }}</button>
                        <button type="button" @click="setLanguage(language)" class="btn btn-xs btn-primary">{{ $I18n.translate('save') }}</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->
        <div class="modal fade" id="set-password" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h5 class="modal-title">{{ $I18n.translate('set_password') }}</h5>
                    </div>
                    <div class="modal-body small">
                        <div>
                            <form class="form" :class="{ 'control': true }">
                                <div class="form-group">
                                    <label for="password">{{ $I18n.translate('password') }}</label>
                                    <input type="password" v-validate="{required: true, confirmed: 'confirm_password'}" name="password" id="password" :class="{'input': true, 'is-danger': errors.has('password') && password !== confirm_password && confirm_password !== '' }" class="form-control" v-model="password">
                                </div>
                                <div class="form-group">
                                    <label for="confirm_password">{{ $I18n.translate('confirm_password') }}</label>
                                    <input type="password" v-validate="{required: true}" name="confirm_password" id="confirm_password" :class="{'input': true, 'is-danger': errors.has('confirm_password') && confirm_password !== '' }" class="form-control" v-model="confirm_password">
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-xs btn-default" data-dismiss="modal">{{ $I18n.translate('close') }}</button>
                        <button type="button" @click="setPassword(password)" :disabled="(errors.has('password')) || (!errors.has('password') && password === '')" class="btn btn-xs btn-primary">{{ $I18n.translate('save') }}</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->
        <div id="connection">
            <div class="processing text-left" v-if="totalProgress > 0">
                {{ $I18n.translate('reloading') }} {{ downloadProgress }}/{{ totalProgress }}
            </div>
            <div class="status text-right" style="margin-right: 5px"
                 :title="$store.state.Keystore.walletType === 'btc' ?
                         $I18n.translate('server_for_bitcoin') + ': ' + (error ? $I18n.translate('offline') : $I18n.translate('online')) :
                         $I18n.translate('server_for_emercoin') + ': ' + (error ? $I18n.translate('offline') : $I18n.translate('online'))">
                <i class="fa fa-circle" :class="error ? 'offline' : 'online'"></i> {{ error ? $I18n.translate('offline') : $I18n.translate('online') }}
            </div>
        </div>
        <div class="connect-error" v-if="showWarningMessage">
            <span>{{ $I18n.translate('incorrect_data') }}</span>
        </div>
    </div>
    <div class="modal fade" id="about-modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h5 class="modal-title">{{ $I18n.translate('about') }} Emercoin Secure {{ $I18n.translate('wallet') }}</h5>
                </div>
                <div class="modal-body small" v-html="$I18n.translate('about_text')">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-xs btn-default" data-dismiss="modal">{{ $I18n.translate('close') }}</button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
    <div class="modal fade" id="change-password-modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h5 class="modal-title">{{ $I18n.translate('change_password') }}</h5>
                </div>
                <div class="modal-body small">
                  <form class="form">
                    <div class="form-group-xs">
                      <label for="old-password" class="col-sm-5">{{ $I18n.translate('old_password') }}</label>
                      <div class="col-sm-6">
                        <input type="password" v-validate="'required'" name="old_password" id="old-password" class="form-control" :class="{'input': true, 'is-danger': errors.has('old_password') && old_password !== '' }" v-model="old_password">
                      </div>
                    </div>
                    <div class="form-group-xs">
                      <label for="new-password" class="col-sm-5">{{ $I18n.translate('new_password') }}</label>
                      <div class="col-sm-6">
                        <input type="password" v-validate="'required|confirmed:confirm_new_password'" name="new_password" id="new-password" class="form-control" :class="{'input': true, 'is-danger': errors.has('new_password') && new_password !== '' && confirm_new_password !== '' }" v-model="new_password">
                      </div>
                    </div>
                    <div class="form-group-xs">
                      <label for="confirm-new-password" class="col-sm-5">{{ $I18n.translate('confirm_new_password') }}</label>
                      <div class="col-sm-6">
                        <input type="password" v-validate="'required'" id="confirm-new-password" name="confirm_new_password" class="form-control" :class="{'input': true, 'is-danger': errors.has('confirm_new_password') && confirm_new_password !== '' }" v-model="confirm_new_password">
                      </div>
                      <div class="col-sm-12 text-center" style="margin-top: 10px">
                        <span class="is-danger" v-show="showChangeError">{{ changeErrorMessage }}</span>
                      </div>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-xs btn-default" data-dismiss="modal">{{ $I18n.translate('close') }}</button>
                    <button type="button" class="btn btn-xs btn-primary" :disabled="errors.has('old_password') || errors.has('new_password') || errors.has('confirm_new_password')" @click="changePassword(old_password, new_password, confirm_new_password)">{{ $I18n.translate('save') }}</button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
</div>
</template>

<script>
    import { remote, shell } from 'electron'
    import $ from 'jquery'
    import os from 'os'
    import crypto from 'crypto'
    import ESRV from '../tools/ElectrumSRV'
    const ElectrumCli = require('electrum-client')

    export default {
      name: 'settings',
      data () {
        return {
          ElectrumSRV: new ESRV(),
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
          emcConnectionError: true,
          btcConnectionError: true,
          error: true,
          showWarningMessage: false,
          addresses: [],
          language: '',
          password: '',
          confirm_password: '',
          old_password: '',
          new_password: '',
          confirm_new_password: '',
          changeErrorMessage: '',
          showChangeError: false,
          totalProgress: 0,
          downloadProgress: 0,
          shell: shell
        }
      },
      mounted () {
        this.getAddresses()
        this.checkConnection()
        this.getLanguage()
        this.initSettings()
        this.$root.$on('totalProgress', (totalProgress) => {
          if (totalProgress > 0) {
            this.totalProgress += totalProgress
          } else {
            this.totalProgress = totalProgress
          }
        })
        this.$root.$on('downloadProgress', (downloadProgress) => {
          if (downloadProgress > 0) {
            this.downloadProgress += downloadProgress
          } else {
            this.downloadProgress = downloadProgress
          }
        })
        setTimeout(function () {
          this.addresses.emc = this.$store.getters.getEmcChanges
          this.addresses.btc = this.$store.getters.getBtcChanges
          console.log(this.addresses)
        }.bind(this), 800)
        setTimeout(function () {
          $('#open-external').on('click', function () {
            console.log('Open External')
            shell.openExternal('https://www.aspanta.com')
          })
        }, 1000)
        this.$watch('error', function () {
          if (this.$store.state.Keystore.walletType === 'btc') {
            this.btcConnectionError = this.error
          } else {
            this.emcConnectionError = this.error
          }
        })
        this.$watch('$store.state.Keystore.addresses', function () {
          setTimeout(function () {
            this.addresses.emc = this.$store.getters.getEmcChanges
            this.addresses.btc = this.$store.getters.getBtcChanges
          }.bind(this), 1000)
        })
        this.$watch('$store.state.Keystore.walletType', function () {
          this.checkConnection()
          setTimeout(function () {
            if (this.$store.state.Keystore.walletType === 'btc') {
              this.btcConnectionError = this.error
            } else {
              this.emcConnectionError = this.error
            }
          }.bind(this), 100)
          this.getAddresses()
          setTimeout(function () {
            this.addresses.emc = this.$store.getters.getEmcChanges
            this.addresses.btc = this.$store.getters.getBtcChanges
          }.bind(this), 800)
        })
        this.$watch('$store.state.Settings.serverError', function () {
          if (this.$store.state.Settings.serverError === true) {
            setTimeout(function () {
              this.showWarningMessage = this.$store.state.Settings.serverError
            }.bind(this), 5000)
          } else {
            this.showWarningMessage = false
          }
          this.error = this.$store.state.Settings.serverError
        })
        this.$watch('$route', function () {
          this.checkConnection()
          setTimeout(function () {
            if (this.$store.state.Keystore.walletType === 'btc') {
              this.btcConnectionError = this.error
            } else {
              this.emcConnectionError = this.error
            }
          }.bind(this), 100)
        })
        this.$watch('addresses', function () {
          this.emc.change = this.addresses.emc[0].address
          this.btc.change = this.addresses.btc[0].address
        }, {deep: true})
        this.$watch('$store.state.Keystore.currentWallet', function () {
          this.getAddresses()
          setTimeout(function () {
            this.getAddresses()
            this.initSettings()
            setTimeout(function () {
              this.addresses.emc = this.$store.getters.getEmcChanges
              this.addresses.btc = this.$store.getters.getBtcChanges
              setTimeout(function () {
                if (typeof this.$store.state.Settings.emc !== 'undefined' || typeof this.$store.state.Settings.btc !== 'undefined') {
                  console.log(this.$store.state.Settings)
                  console.log(this.addresses.btc)
                  this.emc = {
                    host: this.$store.state.Settings.emc.host,
                    port: this.$store.state.Settings.emc.port,
                    change: this.$store.state.Settings.emc.change || this.addresses.emc.length > 0 ? this.addresses.emc[0].address : null
                  }
                  this.btc = {
                    host: this.$store.state.Settings.btc.host,
                    port: this.$store.state.Settings.btc.port,
                    change: this.$store.state.Settings.btc.change || this.addresses.btc.length > 0 ? this.addresses.btc[0].address : null
                  }
                  this.language = this.$store.state.Settings.language
                }
              }.bind(this), 300)
              this.checkConnection()
            }.bind(this), 300)
          }.bind(this), 500)
        }, {deep: true})
        setInterval(function () {
          if (this.$store.state.Settings.serverError === true) {
            this.checkConnection()
          }
        }.bind(this), 10000)
        // Window Menu init
        this.$watch('$store.state.Keystore.wallets', function () {
          let template
          let aboutLabel = this.$I18n.translate('about')
          let helpLabel = this.$I18n.translate('help')
          let settingsLabel = this.$I18n.translate('settings')
          let serversLabel = this.$I18n.translate('servers')
          let changesLabel = this.$I18n.translate('changes')
          let changePasswordLabel = this.$I18n.translate('change_password')
          let languageLabel = this.$I18n.translate('language')
          template = [
            {
              label: helpLabel,
              submenu: [
                {
                  label: aboutLabel,
                  click: function () {
                    $('#server-settings').modal('hide')
                    $('#change-settings').modal('hide')
                    $('#language-settings').modal('hide')
                    $('#change-password-modal').modal('hide')
                    setTimeout(function () {
                      $('#about-modal').modal('show')
                    }, 30)
                  }
                }
              ]
            }
          ]
          let settings = {
            label: settingsLabel,
            submenu: [
              {
                label: serversLabel,
                click: function () {
                  $('#about-modal').modal('hide')
                  $('#change-settings').modal('hide')
                  $('#language-settings').modal('hide')
                  $('#change-password-modal').modal('hide')
                  setTimeout(function () {
                    $('#server-settings').modal('show')
                  }, 30)
                }
              },
              {
                label: changesLabel,
                click: function () {
                  $('#about-modal').modal('hide')
                  $('#server-settings').modal('hide')
                  $('#language-settings').modal('hide')
                  $('#change-password-modal').modal('hide')
                  setTimeout(function () {
                    $('#change-settings').modal('show')
                  }, 30)
                }
              },
              {
                label: languageLabel,
                click: function () {
                  $('#about-modal').modal('hide')
                  $('#server-settings').modal('hide')
                  $('#change-settings').modal('hide')
                  $('#change-password-modal').modal('hide')
                  setTimeout(function () {
                    $('#language-settings').modal('show')
                  }, 30)
                }
              }
            ]
          }
          if (this.$store.state.Keystore.wallets.length > 0) {
            template.unshift(settings)
          }
          if (os.platform() === 'darwin') {
            let edit = {
              label: 'Edit',
              visible: false,
              submenu: [
                {role: 'cut'},
                {role: 'copy'},
                {role: 'paste'}
              ]
            }
            template.unshift(edit)
          }
          this.$db.settings.findOne({type: 'password'}, function (err, res) {
            if (err) console.log(err)
            console.log(res)
            if (res !== null) {
              settings.submenu.push({
                label: changePasswordLabel,
                click: function () {
                  $('#about-modal').modal('hide')
                  $('#server-settings').modal('hide')
                  $('#language-settings').modal('hide')
                  $('#change-settings').modal('hide')
                  setTimeout(function () {
                    $('#change-password-modal').modal('show')
                  }, 30)
                }
              })
            }
            let menu = remote.Menu.buildFromTemplate(template)
            remote.Menu.setApplicationMenu(menu)
          })
        })
        setTimeout(function () {
          this.$forceUpdate()
        }.bind(this), 500)
      },
      methods: {
        initSettings () {
          let walletId = this.$store.state.Keystore.currentWallet !== null
            ? this.$store.state.Keystore.currentWallet._id
            : null
          this.$store.dispatch('getSettings', walletId)
        },
        getLanguage () {
          this.$store.dispatch('getLanguage')
        },
        getAddresses () {
          this.$store.dispatch('getChanges')
        },
        save () {
          let settings = {
            emc: this.emc,
            btc: this.btc,
            walletId: this.$store.state.Keystore.wallets.length > 0 ? this.$store.state.Keystore.currentWallet._id : null
          }
          this.$store.dispatch('setSettings', settings)
          $('#server-settings').modal('hide')
          $('#change-settings').modal('hide')
          this.checkConnection(settings)
        },
        selectAddress (address, type) {
          if (type === 'btc') {
            this.btc.change = address
          } else {
            this.emc.change = address
          }
        },
        async checkConnection (settings, type) {
          settings = settings || this.$store.state.Settings
          type = type || this.$store.state.Keystore.walletType
          let connTimer
          const ecl = new ElectrumCli(settings[type].port, settings[type].host, 'tcp') // tcp or tls
          ecl.conn.on('error', function (e) {
            this.error = true
            this.$store.dispatch('setServerStatus', this.error)
            setTimeout(function () {
              this.checkConnection()
            }.bind(this), 5000)
            console.log(e)
            clearTimeout(connTimer)
          }.bind(this))
          ecl.conn.on('connect', function () {
            console.log('Connected')
            clearTimeout(connTimer)
          })
          ecl.conn.on('data', function (e) {
            console.log('Data received: ', e)
            clearTimeout(connTimer)
          })
          ecl.conn.on('disconnect', function () {
            console.log('[CONNECTION] disconnected!')
            setTimeout(function () {
              this.checkConnection()
            }.bind(this), 5000)
          })
          connTimer = setTimeout(function () {
            console.log('[ERROR] Attempt at connection exceeded timeout value')
            this.error = true
            this.$store.dispatch('setServerStatus', this.error)
            ecl.close()
          }.bind(this), 20000)
          console.log(ecl)
          await ecl.connect() // connect(promise)
          ecl.subscribe.on('blockchain.headers.subscribe', (v) => console.log(v))
          try {
            const res = await ecl.blockchain_relayfee() // json-rpc(promise)
            if (res) {
              this.error = false
              this.$store.dispatch('setServerStatus', this.error)
            }
          } catch (e) {
            this.error = true
            this.$store.dispatch('setServerStatus', this.error)
            console.log(e)
          }
        },
        setLanguage (code) {
          this.$store.dispatch('setLanguage', code)
          $('#language-settings').modal('hide')
          setTimeout(function () {
            this.$I18n.init(code)
            window.location.reload()
          }.bind(this), 200)
        },
        setPassword (password) {
          let md5Pass = crypto.createHash('md5').update(password).digest('hex')
          this.$db.settings.insert({type: 'password', password: md5Pass}, function (err, res) {
            if (err) console.log(err)
            if (res !== null) {
              $('#set-password').modal('hide')
              this.$forceUpdate()
            }
          }.bind(this))
        },
        changePassword (oldPass, newPass, confirmPass) {
          let _this = this
          let md5Old = crypto.createHash('md5').update(oldPass).digest('hex')
          let md5New = crypto.createHash('md5').update(newPass).digest('hex')
          if (newPass === confirmPass) {
            _this.$db.settings.findOne({type: 'password', password: md5Old}, function (err, res) {
              if (err) console.log(err)
              if (res !== null) {
                _this.$db.settings.update(res, {$set: {password: md5New}}, function (err, count) {
                  if (err) console.log(err)
                  console.log('Password changed: ', count)
                  let success = _this.$I18n.translate('password_changed_success')
                  alert(success, 'Emercoin Secure Wallet')
                  _this.showChangeError = false
                  _this.changeErrorMessage = ''
                  _this.old_password = ''
                  _this.new_password = ''
                  _this.confirm_new_password = ''
                  $('#change-password-modal').modal('hide')
                })
              } else {
                _this.showChangeError = true
                _this.changeErrorMessage = _this.$I18n.translate('password_error')
              }
            })
          } else {
            _this.showChangeError = true
            _this.changeErrorMessage = _this.$I18n.translate('passwords_not_match')
          }
        }
      }
    }
</script>

<style>
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
    p.address-name, p.address-item {
        margin: 0 0 2px;
    }
    .tab-content .dropdown {
        width: 70% !important;
    }
    #connection {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 20px;
        background: #f8f8f8;
        z-index: 100;
    }
    .connect-error {
        background: #ac2925;
        color: #fff;
        padding-left: 5px;
    }
    i.online {
        color: #67b168;
    }
    i.offline {
        color: #ac2925;
    }
    .processing {
        float: left;
    }
    div.modal.fade {
      z-index: 9999
    }
</style>
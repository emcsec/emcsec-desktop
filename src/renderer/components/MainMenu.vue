<template>
    <nav class="navbar small navbar-default" v-if="wallets.length > 0">
        <div class="container-fluid">
            <ul class="nav navbar-nav">
                <li class="dropdown wallets" :class="$store.state.Keystore.walletType">
                    <a data-toggle="dropdown" href="#">
                        <i class="material-icons md-15" style="position:absolute;top:12px;left:14px">account_balance_wallet</i>
                        <span style="padding-left: 16px">{{ $I18n.translate('my_wallets') }}</span>
                        <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu" v-if="wallets !== null">
                        <li v-for="wallet in wallets" class="small">
                            <a role="button" class="form-group-xs">
                                <i class="glyphicon glyphicon-ok current-wallet"
                                   v-if="wallet.walletName === currentWallet.walletName"></i>
                                <input type="text"
                                       class="form-control"
                                       v-model.trim="editingWallet"
                                       v-if="walletEditing === true && wallet.walletName === editingName"
                                       style="width: 80%; float: left">
                                <i role="button"
                                   class="glyphicon glyphicon-ok-circle action save"
                                   :class="editingWallet === wallet.walletName || walletExist || editingWallet === '' ? 'inactive' : ''"
                                   v-if="walletEditing === true && wallet.walletName === editingName"
                                   @click="editWallet(wallet._id, editingWallet)"></i>
                                <i role="button"
                                   class="glyphicon glyphicon-remove-circle action cancel"
                                   v-if="walletEditing === true && wallet.walletName === editingName"
                                   @click="walletEditing = false"></i>
                                <span class="wallet-name"
                                      @click="$router.push('/wallet/' + wallet.walletName + '/dashboard')"
                                      v-else>{{
                                        wallet.walletName.length > 40 ? wallet.walletName.substr(0, 40) + '...' : wallet.walletName
                                    }}</span>
                                <i class="glyphicon glyphicon-pencil action edit-wallet"
                                   @click="walletEditing = true; editingName = editingWallet = wallet.walletName"
                                   v-if="!walletEditing"></i>
                                <i class="glyphicon glyphicon-trash action delete-wallet"
                                   @click="logout(wallet._id)"
                                   v-if="!walletEditing"></i>
                            </a>
                        </li>
                        <li class="small" v-if="wallets.length < 10">
                            <a @click="$router.push('/?new=true')">
                                {{ $I18n.translate('new_wallet') }}
                                <i class="fa fa-arrow-right pull-right new-wallet" role="button"></i>
                            </a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a
                        role="button"
                        @click="$route.path !== '/wallet/' + currentWallet.walletName + '/dashboard' ? $router.push('/wallet/' + currentWallet.walletName + '/dashboard') : ''"
                        :class="$route.path === '/wallet/' + currentWallet.walletName + '/dashboard' ? 'active ' + $store.state.Keystore.walletType : ''"
                        :id="'dashboard-' + $store.state.Keystore.walletType + '-link'"
                    >
                            <i class="glyphicon glyphicon glyphicon-home"></i>
                            {{ $I18n.translate('dashboard') }}
                    </a>
                </li>
                <li>
                    <a
                        role="button"
                        @click="$router.push('/wallet/' + currentWallet.walletName + '/send')"
                        :class="$route.path === '/wallet/' + currentWallet.walletName + '/send' ? 'active ' + $store.state.Keystore.walletType : ''"
                        id="send-link"
                    >
                            <i class="glyphicon glyphicon-arrow-right"></i>
                            {{ $I18n.translate('send') }}
                    </a>
                </li>
                <li>
                    <a
                        role="button"
                        @click="'/wallet/' + currentWallet.walletName + '/receive' !== $route.path ? $router.push('/wallet/' + currentWallet.walletName + '/receive') : ''"
                        :class="$route.path === '/wallet/' + currentWallet.walletName + '/receive' ? 'active ' + $store.state.Keystore.walletType : ''"
                        id="receive-link"
                    >
                            <i class="glyphicon glyphicon-arrow-down"></i>
                        {{ $I18n.translate('receive') }}
                    </a>
                </li>
                <li>
                    <a
                        role="button"
                        @click="'/wallet/' + currentWallet.walletName + '/history' !== $route.path ? $router.push('/wallet/' + currentWallet.walletName + '/history') : ''"
                        :class="$route.path === '/wallet/' + currentWallet.walletName + '/history' ? 'active ' + $store.state.Keystore.walletType : ''"
                        :id="'history-' + $store.state.Keystore.walletType + '-link'"
                    >
                            <i class="glyphicon glyphicon-list-alt"></i>
                            {{ $I18n.translate('history') }}
                    </a>
                </li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li>
                    <a role="button" style="padding-right: 0">
                        <span class="btn btn-xs" id="refresh-data"><i class="fa fa-refresh"></i></span>
                    </a>
                </li>
                <li class="dropdown">
                    <a role="button" @click="setWalletType('emc')">
                        <button v-if="$store.state.Keystore.walletType === 'emc'" class="btn btn-xs btn-primary">EMC</button>
                        <span v-else>EMC</span>
                    </a>
                </li>
                <li class="dropdown">
                    <a role="button" @click="setWalletType('btc')">
                        <button v-if="$store.state.Keystore.walletType === 'btc'" class="btn btn-xs btn-primary-btc">BTC</button>
                        <span v-else>BTC</span>
                    </a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
import $ from 'jquery'

$(document).ready(function () {
  $(document).on('click', '.dropdown-menu i.action', function (e) {
    e.preventDefault()
    e.stopPropagation()
  })
  $(document).on('click', 'i.new-wallet', function () {
    $('li.wallets').removeClass('open')
  })
})

export default {
  name: 'menu',
  data () {
    return {
      walletEditing: false,
      editingWallet: '',
      editingName: '',
      walletExist: 0
    }
  },
  computed: {
    wallets () {
      let wallets = this.$store.getters.wallets || []
      return wallets
    },
    currentWallet () {
      let currentWallet = this.$store.getters.currentWallet ? this.$store.getters.currentWallet : {}
      return currentWallet
    }
  },
  watch: {
    editingWallet (name) {
      let count = 0
      this.wallets.forEach(function (val, ind, arr) {
        if (val.walletName === name) {
          count = count + 1
        }
      })
      this.walletExist = count
    },
    '$route': function () {
      this.getCurrentWallet()
      this.updateWallets()
      $(document).off('click', '#dashboard-emc-link')
    }
  },
  mounted () {
    this.getCurrentWallet()
    this.updateWallets()
  },
  methods: {
    setWalletType (type) {
      this.$store.dispatch('setWalletType', type)
    },
    updateWallets () {
      this.$store.dispatch('get')
    },
    getCurrentWallet () {
      this.$store.dispatch('currentWallet', this.$route.params.wallet_name)
    },
    logout (walletId) {
      let _this = this
      let message = this.$I18n.translate('sure_delete_wallet')
      let answer = confirm(message, 'Emercoin Secure ' + this.$I18n.translate('wallet'))
      if (answer === false) return false
      this.$db.remove({_id: walletId}, {multi: true}, function (err, res) {
        if (err) alert(err)
        console.log(res)
      })
      this.$db.addresses.remove({wallet_id: walletId}, {multi: true}, function (err, res) {
        if (err) alert(err)
        console.log(res)
      })
      this.$db.changes.remove({wallet_id: walletId}, {multi: true}, function (err, res) {
        if (err) alert(err)
        console.log(res)
        if (_this.currentWallet._id === walletId) {
          _this.$router.push('/')
        }
        _this.updateWallets()
        _this.getCurrentWallet()
      })
    },
    editWallet (id, name) {
      let _count = 0
      this.$db.count({walletName: name}, function (err, count) {
        if (err) console.log(err)
        _count = count
      })
      setTimeout(function () {
        if (this.editingName !== name && name !== '' && _count === 0) {
          this.$db.update({_id: id}, {$set: {walletName: name}}, {}, function (err, count) {
            if (err) alert(err)
            console.log(count)
            this.updateWallets()
            this.getCurrentWallet()
            this.walletEditing = false
            this.editingWallet = ''
            this.editingName = ''
            setTimeout(function () {
              if (this.currentWallet.walletName === name) {
                this.$router.push('/wallet/' + this.currentWallet.walletName + '/dashboard')
              }
            }.bind(this), 100)
          }.bind(this))
        } else {
          return false
        }
      }.bind(this), 100)
    }
  }
}
</script>

<style scoped>
.navbar {
  border-radius: 0 !important;
}
.delete-wallet,
.edit-wallet {
    position: absolute;
    top: 8px;
    font-size: 11px;
}
i.delete-wallet {
    right: 15px;
    color: #d9534f;
}
i.new-wallet {
    position: absolute;
    top: 8px;
    right: 15px;
    color: #333;
}
i.edit-wallet {
    right: 35px;
    color: #337ab7;
}
.wallet-name {
    padding-right: 35px;
}
i.save {
    color: #4fc08d;
    padding: 3px;
}
i.cancel {
    color: #d9534f
}
.current-wallet {
    position: absolute;
    left: 3px;
    top: 7px;
    font-size: 12px;
    color: #4fc08d;
}
.dropdown-menu li {
    position: relative;
}
.dropdown-menu>li>a {
    overflow: hidden;
}
i.inactive {
    color: #c4c4c4
}
</style>


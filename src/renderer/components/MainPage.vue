<template>
  <div id="wrapper">
    <div class="col-md-8 col-md-offset-2 col-sm-9 col-sm-offset-1-5">
      <div class="panel panel-default small">
        <div>
          <div class="panel-heading">{{ $I18n.translate('wallet_name') }}</div>
          <div class="panel-body">
            <div class="form-group form-group-xs">
              <input type="text" class="form-control" :class="wallet ? 'is-danger' : ''" v-model.trim="walletName" placeholder="Wallet Name">
            </div>
          </div>
          <div class="panel-footer text-right">
            <button class="btn btn-xs btn-default pull-left" @click="openServerSettings">{{ $I18n.translate('advanced_server_settings') }}</button>
            <button class="btn btn-xs btn-default" :disabled="wallet || walletName === '' ? true : false" @click="next(walletName)">{{ $I18n.translate('next') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'main-page',
  data: function () {
    return {
      walletName: 'Default'
    }
  },
  computed: {
    countWallets () {
      return this.$store.getters.wallets.length
    },
    wallet () {
      let currentWallet = this.$store.getters.currentWallet ? this.$store.getters.currentWallet : {}
      if (currentWallet.walletName !== this.walletName) currentWallet = null
      return currentWallet
    }
  },
  mounted: function () {
    this.getCurrentWallet(this.walletName)
    this.count()
    setTimeout(function () {
      this.$forceUpdate()
    }.bind(this), 500)
    this.$db.find({}).sort({walletName: 1}).exec(async function (err, wallets) {
      if (err) console.log(err)
      if (wallets) {
        let i = 1
        let c = 1
        let done = false
        wallets.forEach(function (val, ind, arr) {
          if (typeof this.find(wallets, 'walletName', 'Default (' + i + ')') === 'undefined') {
            c = i
            done = true
          }
          if (done === true) {
            this.walletName = 'Default (' + c + ')'
          } else {
            i++
          }
        }.bind(this))
      }
      this.$db.count({walletName: 'Default'}, function (err, count) {
        if (err) console.log(err)
        if (count === 0) {
          this.walletName = 'Default'
        }
        if (!this.$route.query.new && this.countWallets > 0 && typeof this.$store.getters.currentWallet._id !== 'undefined') {
          this.$router.push('/wallet/' + this.$store.getters.currentWallet.walletName + '/dashboard')
        }
      }.bind(this))
    }.bind(this))
  },
  watch: {
    walletName: function () {
      this.getCurrentWallet(this.walletName)
    }
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    },
    next (walletName) {
      if (this.countWallets >= 10 && this.wallet === null) {
        let message = this.$I18n.translate('more_than_ten_wallets')
        let title = this.$I18n.translate('warning')
        alert(message, title)
      } else if (this.wallet === null) {
        this.$router.push('/save-phrase/' + walletName)
      } else {
        this.$router.push('/wallet/' + walletName + '/emc')
      }
    },
    getCurrentWallet () {
      this.$store.dispatch('currentWallet', this.walletName)
    },
    count () {
      this.$store.dispatch('get')
    },
    find (arr, index, value) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][index] === value) {
          return i
        }
      }
    },
    openServerSettings () {
      $('#server-settings').modal('show')
    }
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
</style>

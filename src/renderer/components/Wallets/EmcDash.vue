<template>
    <div class="col-md-12 col-sm-12 small">
        <div class="col-md-6 col-sm-6">
            <b>{{ $I18n.translate('balances') }}</b>
            <table class="table-balances">
                <tbody>
                <tr>
                    <td style="padding-left: 0">{{ $I18n.translate('available') }}</td>
                    <td class="text-right">
                        <moon-loader style="position: inherit;float: right" v-if="balancesLoader" :color="'#000000'" :size="'15px'"></moon-loader>
                        <b v-else>{{ balance.confirmed }} EMC</b>
                    </td>
                </tr>
                <tr>
                    <td style="padding-left: 0">{{ $I18n.translate('pending') }}</td>
                    <td class="text-right">
                        <moon-loader style="position: inherit;float: right" v-if="balancesLoader" :color="'#000000'" :size="'15px'"></moon-loader>
                        <b v-else>{{ balance.unconfirmed }} EMC</b>
                    </td>
                </tr>
                <tr class="total">
                    <td style="padding-left: 0">{{ $I18n.translate('total') }}</td>
                    <td class="text-right">
                        <moon-loader style="position: inherit;float: right" v-if="balancesLoader" :color="'#000000'" :size="'15px'"></moon-loader>
                        <b v-else>{{ balance.total }} EMC</b>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="col-md-6 col-sm-6">
            <b>{{ $I18n.translate('rec_transacts') }}</b>
            <table class="table-transactions">
                <moon-loader style="position: inherit;float: left" v-if="loader" :color="'#000000'" :size="'30px'"></moon-loader>
                <tbody v-else style="font-size: 10px">
                <tr v-for="(tx, id) in pending" v-if="id <= 4">
                    <td style="width: 25px;padding-left: 0">
                        <i class="glyphicon glyphicon-log-out" v-if="tx.type === 'out'" style="font-size: 25px"></i>
                        <i class="glyphicon glyphicon-log-in" v-else-if="tx.type === 'received'" style="font-size: 25px"></i>
                        <i class="glyphicon glyphicon-transfer" v-else-if="tx.type === 'self'" style="font-size: 25px"></i>
                    </td>
                    <td>
                        {{ tx.date }} <i class="glyphicon glyphicon-hourglass"></i><br><span style="color: rgb(151, 151, 151);">({{ tx.address }})</span>
                    </td>
                    <td style="text-align: right;vertical-align: middle" v-if="tx.type === 'out'">-{{ tx.amount }} EMC</td>
                    <td style="text-align: right;vertical-align: middle" v-else-if="tx.type === 'received'">{{ tx.amount }} EMC</td>
                    <td style="text-align: right;vertical-align: middle" v-else-if="tx.type === 'self'">-{{ tx.fee }} EMC</td>
                </tr>
                <tr v-for="(tx, id) in transactions" v-if="(id + pending.length) <= 4">
                    <td style="width: 25px;padding-left: 0">
                        <i class="glyphicon glyphicon-log-out" v-if="tx.type === 'out'" style="font-size: 25px"></i>
                        <i class="glyphicon glyphicon-log-in" v-else-if="tx.type === 'received'" style="font-size: 25px"></i>
                        <i class="glyphicon glyphicon-transfer" v-else-if="tx.type === 'self'" style="font-size: 25px"></i>
                    </td>
                    <td>
                        {{ tx.date }} <br><span style="color: rgb(151, 151, 151);">({{ tx.address }})</span>
                    </td>
                    <td style="text-align: right;vertical-align: middle" v-if="tx.type === 'out'">-{{ tx.amount }} EMC</td>
                    <td style="text-align: right;vertical-align: middle" v-else-if="tx.type === 'received'">{{ tx.amount }} EMC</td>
                    <td style="text-align: right;vertical-align: middle" v-else-if="tx.type === 'self'">-{{ tx.fee }} EMC</td>
                </tr>
                <tr v-if="!pending.length && !transactions.length">
                    <td colspan="4" class="text-center" style="font-size: 12px">
                        {{ $I18n.translate('no_rec_transact') }}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
  import ESRV from '../../tools/ElectrumSRV'
  import Functions from '../../tools/Functions'
  import MoonLoader from 'vue-spinner/src/MoonLoader.vue'
  import moment from 'moment'
  import $ from 'jquery'

  export default {
    name: 'emc-dashboard',
    components: {
      MoonLoader
    },
    data () {
      return {
        ElectrumSRV: new ESRV(this.$root),
        balances: [],
        balance: {
          confirmed: 0,
          unconfirmed: 0,
          total: 0
        },
        history: [],
        transactions: [],
        pending: [],
        data: {
          balances: [],
          history: []
        },
        loader: true,
        balancesLoader: true
      }
    },
    computed: {
      walletType: function () {
        return this.$store.state.Keystore.walletType
      }
    },
    mounted () {
      let _this = this
      this.balances = this.ElectrumSRV.balances
      this.history = []
      this.transactions = []
      this.pending = []
      this.loader = true
      this.balancesLoader = true
      setTimeout(function () {
        _this.initData()
      }, 200)
      setTimeout(function () {
        if (typeof this.$store.state.Keystore.currentWallet !== 'undefined') {
          if (this.$route.query.new) {
            console.log('QUERY NEW')
            this.setData(false, true)
            this.$route.query.new = false
          } else {
            this.setData()
          }
        }
      }.bind(this), 400)
      this.$watch('$store.state.RemoteData.data', function () {
        this.data = this.getData()
      }, {deep: true})
      this.$watch('$store.state.Settings.serverError', function () {
        console.log('serverError', this.$store.state.Settings.serverError)
        _this.initData()
        setTimeout(function () {
          if (this.$store.state.Settings.serverError === false) {
            this.setData(false, true)
          } else {
            this.setData()
          }
        }.bind(this), 350)
      })
      this.$watch('ElectrumSRV.done', function () {
        if (this.ElectrumSRV.done.type === 'emc' && this.ElectrumSRV.done.walletId === this.$store.state.Keystore.currentWallet._id) {
          this.loader = !this.ElectrumSRV.done.status
          if (this.loader === false) {
            this.history = this.ElectrumSRV.history
            this.balances = this.ElectrumSRV.balances
            this.setHistory(this.history)
            this.setBalance(this.balances)
          }
        }
      }, {deep: true})
      this.$watch('ElectrumSRV.balances.done', function () {
        if (this.ElectrumSRV.balances.type === 'emc' && this.ElectrumSRV.balances.walletId === this.$store.state.Keystore.currentWallet._id) {
          this.balancesLoader = !this.ElectrumSRV.balances.done
          if (this.balancesLoader === false) {
            this.history = this.ElectrumSRV.history
            this.balances = this.ElectrumSRV.balances
            this.setHistory(this.history)
            this.setBalance(this.balances)
          }
        }
      }, {deep: true})
      this.$watch('walletType', function () {
        _this.initData()
        setTimeout(function () {
          this.setData()
        }.bind(this), 100)
      })
      $(document).off('click', '#refresh-data')
      setTimeout(function () {
        $(document).on('click', '#refresh-data', function () {
          console.log('REFRESH DATA')
          this.setData(false, true)
        }.bind(this))
      }.bind(this), 100)
      let unwatch = this.$watch('$route.path', function () {
        this.history = []
        this.balances = []
        this.$watch('$store.state.Keystore.currentWallet._id', function () {
          _this.$store.dispatch('setWalletId', _this.$store.state.Keystore.currentWallet._id)
          this.initData(_this.$store.state.Keystore.currentWallet._id)
          setTimeout(function () {
            _this.setData()
          }, 300)
        })
        unwatch()
      })
      if (this.$store.state.Settings.serverError === true) {
        this.loader = false
        this.balancesLoader = false
      }
      this.$watch('ElectrumSRV.serverTimeout', function () {
        this.$store.dispatch('setServerStatus', this.ElectrumSRV.serverTimeout)
      })
    },
    methods: {
      initData (walletId) {
        walletId = walletId || this.$store.state.Keystore.currentWallet._id
        this.$store.dispatch('getWalletData', {walletId: this.$store.state.Keystore.currentWallet._id, type: 'emc'})
      },
      getData () {
        this.data = this.$store.getters.getData !== null ? this.$store.getters.getData : this.data
        return this.$store.getters.getData
      },
      setBalance (balances) {
        let walletId = this.$store.state.Keystore.currentWallet._id
        balances = balances || []
        this.balance = {
          confirmed: 0,
          unconfirmed: 0,
          total: 0
        }
        for (let currentValue of balances) {
          if ((this.ElectrumSRV.walletId === walletId && typeof currentValue.confirmed !== 'undefined') || (this.data.walletId === walletId && typeof currentValue.confirmed !== 'undefined')) {
            this.balance.confirmed += (currentValue.confirmed / 1000000)
            this.balance.unconfirmed += (currentValue.unconfirmed / 1000000)
            this.balance.total += (currentValue.confirmed / 1000000 + currentValue.unconfirmed / 1000000)
          }
        }
        this.balance.confirmed = Functions.round(this.balance.confirmed, 6)
        this.balance.unconfirmed = Functions.round(this.balance.unconfirmed, 6)
        this.balance.total = Functions.round(this.balance.total, 6)
      },
      setHistory (history) {
        history = history || []
        history.pending = history.pending || []
        this.pending = []
        this.transactions = []
        if (typeof history.pending !== 'undefined') {
          for (let [i, h] of history.pending.entries()) {
            this.$set(this.pending, i, {
              date: Functions.getDate(h.timestamp),
              amount: Functions.round(h.amount / 1000000, 6),
              address: h.address,
              type: h.tx_type,
              fee: Functions.round(h.fee / 1000000, 6)
            })
          }
        }
        for (let [i, h] of history.entries()) {
          this.$set(this.transactions, i, {
            date: Functions.getDate(h.timestamp),
            amount: Functions.round(h.amount / 1000000, 6),
            address: h.address,
            type: h.tx_type,
            fee: Functions.round(h.fee / 1000000, 6)
          })
        }
      },
      setData (local, force) {
        local = local || false
        force = force || false
        let lastUpdate = this.$store.getters.getEmcLastUpdate
        lastUpdate = lastUpdate.sort(function (a, b) {
          return (a.time - b.time)
        }).reverse()
        let updTime = lastUpdate.length ? (moment().unix() - lastUpdate[0].time) : null
        this.balancesLoader = true
        console.log('Last Update: ', lastUpdate)
        console.log('Last Update Check: ', (this.$store.state.Settings.serverError === false && !local && typeof lastUpdate !== 'undefined' && (updTime >= 300 || updTime === null)))
        console.log('Force Update: ', force)
        console.log('Update Time: ', updTime)
        if ((this.$store.state.Settings.serverError === false && !local && typeof lastUpdate !== 'undefined' && (updTime >= 300 || updTime === null)) || (force && !this.$store.state.Settings.serverError)) {
          let walletId = this.$store.state.Keystore.currentWallet._id
          this.ElectrumSRV.main(this.$store.state.Keystore.currentWallet.keys.emc, this.$store.state.Keystore.currentWallet.changes.emc, walletId, 'emc')
          this.ElectrumSRV.getHistory(this.$store.state.Keystore.currentWallet.keys.emc, this.$store.state.Keystore.currentWallet.changes.emc, walletId, 'emc')
          this.$watch('ElectrumSRV.history', function () {
            if (this.ElectrumSRV.history.walletId === this.$store.state.Keystore.currentWallet._id && this.ElectrumSRV.history.type === 'emc') {
              this.balances = this.ElectrumSRV.balances
              this.history = this.ElectrumSRV.history
              this.$store.dispatch('setWalletData', {
                balances: this.balances,
                history: this.history,
                walletId: this.$store.state.Keystore.currentWallet._id,
                type: 'emc'
              })
              this.setHistory(this.history)
              this.setBalance(this.balances)
            }
          }, {deep: true})
          this.$watch('ElectrumSRV.balances', function () {
            if (this.ElectrumSRV.balances.walletId === this.$store.state.Keystore.currentWallet._id && this.ElectrumSRV.history.type === 'emc') {
              this.balances = this.ElectrumSRV.balances
              this.history = this.ElectrumSRV.history
              this.$store.dispatch('setWalletData', {
                balances: this.balances,
                history: this.history,
                walletId: this.$store.state.Keystore.currentWallet._id,
                type: 'emc'
              })
              this.setHistory(this.history)
              this.setBalance(this.balances)
            }
          }, {deep: true})
          if (force || lastUpdate.length === 0) {
            this.$store.dispatch('updateLastUpdate', {
              time: moment().unix(),
              walletId: walletId,
              type: 'emc'
            })
          } else {
            this.$store.dispatch('setLastUpdate', {
              time: moment().unix(),
              walletId: walletId,
              type: 'emc'
            })
          }
        } else if (this.$store.getters.getData !== null && typeof this.$store.getters.getData.balances !== 'undefined' && typeof this.$store.getters.getData.history !== 'undefined') {
          this.setBalance(this.$store.getters.getData.balances)
          this.setHistory(this.$store.getters.getData.history)
          this.loader = false
          this.balancesLoader = false
        }
      }
    }
  }
</script>

<style>
    table {
        width: 100%;
    }
    .table-balances td {
        padding: 5px;
    }
    .table-balances .total {
        border-top: 1px solid #ddd;
    }
    .table-transactions td {
        padding: 5px;
    }
    .table-transactions {
        min-height: 70px;
    }
</style>
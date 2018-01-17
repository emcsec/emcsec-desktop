<template>
    <div>
        <table class="table small">
            <thead>
            <tr>
                <th>{{ $I18n.translate('date') }}</th>
                <th>{{ $I18n.translate('type') }}</th>
                <th>{{ $I18n.translate('address') }}</th>
                <th class="text-right">{{ $I18n.translate('amount') }} (BTC)</th>
            </tr>
            </thead>
            <moon-loader style="position: absolute;top: 50%;left: 47%;" v-if="loader" :color="'#000000'" :size="'40px'"></moon-loader>
            <tbody v-else>
            <tr v-for="tx in pending" @click="showDetails(tx)">
                <td>
                    {{ tx.date }}
                    <i class="glyphicon glyphicon-hourglass"></i>
                </td>
                <td v-if="tx.type === 'out'">{{ $I18n.translate('sent_to') }}</td>
                <td v-else-if="tx.type === 'received'">{{ $I18n.translate('received_with') }}</td>
                <td v-else-if="tx.type === 'self'">{{ $I18n.translate('self') }}</td>
                <td>
                    <i class="glyphicon glyphicon-log-in" v-if="tx.type === 'received'"></i>
                    <i class="glyphicon glyphicon-log-out" v-if="tx.type === 'out'"></i>
                    <i class="glyphicon glyphicon-transfer" v-if="tx.type === 'self'"></i>
                    {{ tx.type === 'self' ? 'n/a' : tx.address }}
                </td>
                <td class="text-right" v-if="tx.type === 'received'">{{ tx.amount }}</td>
                <td class="text-right" v-else-if="tx.type === 'out'">-{{ tx.amount }}</td>
                <td class="text-right" v-else-if="tx.type === 'self'">-{{ tx.fee }}</td>
            </tr>
            <tr v-for="tx in transactions" @click="showDetails(tx)">
                <td>{{ tx.date }}</td>
                <td v-if="tx.type === 'out'">{{ $I18n.translate('sent_to') }}</td>
                <td v-else-if="tx.type === 'received'">{{ $I18n.translate('received_with') }}</td>
                <td v-else-if="tx.type === 'self'">{{ $I18n.translate('self') }}</td>
                <td>
                    <i class="glyphicon glyphicon-log-in" v-if="tx.type === 'received'"></i>
                    <i class="glyphicon glyphicon-log-out" v-else-if="tx.type === 'out'"></i>
                    <i class="glyphicon glyphicon-transfer" v-else-if="tx.type === 'self'"></i>
                    {{ tx.type === 'self' ? 'n/a' : tx.address }}
                </td>
                <td class="text-right" v-if="tx.type === 'received'">{{ tx.amount }}</td>
                <td class="text-right" v-else-if="tx.type === 'out'">-{{ tx.amount }}</td>
                <td class="text-right" v-else-if="tx.type === 'self'">-{{ tx.fee }}</td>
            </tr>
            <tr v-if="pending.length < 1 && transactions.length < 1">
                <td colspan="4" class="text-center">
                    {{ $I18n.translate('no_transact_yet') }}
                </td>
            </tr>
            </tbody>
        </table>
        <div class="modal fade" id="details" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h5 class="modal-title">{{ $I18n.translate('transact_details') }}</h5>
                    </div>
                    <div class="modal-body small">
                        <table class="table">
                            <tr>
                                <td>{{ $I18n.translate('date') }}:</td>
                                <td>{{details.date}}</td>
                            </tr>
                            <tr>
                                <td>{{ $I18n.translate('address') }}:</td>
                                <td v-if="details.type === 'self'">n/a</td>
                                <td v-else>{{details.address}}</td>
                            </tr>
                            <tr>
                                <td>{{ $I18n.translate('category') }}:</td>
                                <td v-if="details.type === 'out'">{{ $I18n.translate('send_details') }}</td>
                                <td v-else-if="details.type === 'received'">{{ $I18n.translate('received') }}</td>
                                <td v-else-if="details.type === 'self'">{{ $I18n.translate('self') }}</td>
                            </tr>
                            <tr>
                                <td>{{ $I18n.translate('amount') }}:</td>
                                <td>
                                    <span v-if="details.type === 'out'">-{{details.amount}} BTC</span>
                                    <span v-else>{{details.amount}} BTC</span>
                                </td>
                            </tr>
                            <tr v-if="details.type !== 'received'">
                                <td>{{ $I18n.translate('fee') }}:</td>
                                <td>-{{ details.fee }} BTC</td>
                            </tr>
                            <tr>
                                <td>{{ $I18n.translate('transaction_id') }}:</td>
                                <td>{{details.tx_hash}}</td>
                            </tr>
                            <tr>
                                <td>{{ $I18n.translate('block') }}:</td>
                                <td>{{details.height}}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-xs btn-default" data-dismiss="modal">{{ $I18n.translate('close') }}</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->
    </div>
</template>

<script>
  import ESRV from '../../tools/ElectrumSRV'
  import Functions from '../../tools/Functions'
  import MoonLoader from 'vue-spinner/src/MoonLoader.vue'
  import moment from 'moment'
  import $ from 'jquery'

  export default {
    name: 'btc-history',
    components: {
      MoonLoader
    },
    data () {
      return {
        ElectrumSRV: new ESRV(this.$root),
        history: [],
        transactions: [],
        pending: [],
        balances: [],
        details: [],
        data: {
          balances: [],
          history: []
        },
        loader: true
      }
    },
    mounted () {
      this.history = []
      this.transactions = []
      this.pending = []
      setTimeout(function () {
        this.initData()
      }.bind(this), 200)
      setTimeout(function () {
        if (typeof this.$store.state.Keystore.currentWallet !== 'undefined') {
          if (this.$route.query.new) {
            this.setData(false, true)
          } else {
            this.setData()
          }
        }
      }.bind(this), 400)
      $(document).off('click', '#refresh-data')
      $(document).on('click', '#refresh-data', function () {
        console.log('event set data')
        this.setData(false, true)
      }.bind(this))
      this.$watch('$store.state.Settings.serverError', function () {
        console.log('serverError', this.$store.state.Settings.serverError)
        this.initData()
        setTimeout(function () {
          if (this.$store.state.Settings.serverError === false) {
            this.setData(false, true)
          } else {
            this.setData()
          }
        }.bind(this), 350)
      })
      this.$watch('$store.state.RemoteData.data', function () {
        if (typeof this.getData().walletId !== 'undefined' && this.getData().walletId !== this.data.walletId && this.getData().type === 'btc') {
          console.log('remote data changed: ', this.getData())
          this.data = this.getData()
          console.log('data changed: ', this.data)
        }
      }, {deep: true})
      this.$watch('data', function () {
        setTimeout(function () {
          console.log('this.data changed: ', this.data)
          this.setHistory(this.data.history)
        }.bind(this), 200)
      }, {deep: true})
      this.$watch('ElectrumSRV.done', function () {
        if (this.ElectrumSRV.done.type === 'btc' && this.ElectrumSRV.done.walletId === this.$store.state.Keystore.currentWallet._id) {
          this.loader = !this.ElectrumSRV.done.status
          if (this.loader === false) {
            this.history = this.ElectrumSRV.history
            this.balances = this.ElectrumSRV.balances
            this.setHistory(this.history)
          }
        }
      }, {deep: true})
      this.$watch('ElectrumSRV.serverTimeout', function () {
        this.$store.dispatch('setServerStatus', this.ElectrumSRV.serverTimeout)
      })
    },
    methods: {
      initData () {
        this.$store.dispatch('getWalletData', {walletId: this.$store.state.Keystore.currentWallet._id, type: 'btc'})
      },
      getData () {
        return this.$store.getters.getData
      },
      setHistory (history) {
        history = history || []
        history.pending = history.pending || []
        let unconfirmed = this.$I18n.translate('unconfirmed')
        for (let [i, h] of history.pending.entries()) {
          this.$set(this.pending, i, {
            date: unconfirmed,
            amount: Functions.round(h.amount / 100000000, 8),
            fee: typeof h.fee === 'string' ? h.fee : h.fee / 100000000,
            address: h.address,
            tx_hash: h.tx_hash,
            type: h.tx_type,
            height: h.height
          })
        }
        for (let [i, h] of history.entries()) {
          this.$set(this.transactions, i, {
            date: Functions.getDate(h.timestamp),
            amount: Functions.round(h.amount / 100000000, 8),
            fee: typeof h.fee === 'string' ? h.fee : h.fee / 100000000,
            address: h.address,
            tx_hash: h.tx_hash,
            type: h.tx_type,
            height: h.height
          })
        }
      },
      setData (local, force) {
        local = local || false
        force = force || false
        let lastUpdate = this.$store.getters.getBtcLastUpdate
        lastUpdate = lastUpdate.sort(function (a, b) {
          return (a.time - b.time)
        }).reverse()
        let updTime = lastUpdate.length ? (moment().unix() - lastUpdate[0].time) : null
        console.log('Last Update: ', lastUpdate)
        console.log('Last Update Check: ', (this.$store.state.Settings.serverError === false && !local && typeof lastUpdate !== 'undefined' && (updTime >= 300 || updTime === null)))
        console.log('Force Update: ', force)
        console.log('Update Time: ', updTime)
        if ((this.$store.state.Settings.serverError === false && !local && typeof lastUpdate !== 'undefined' && (updTime >= 300 || updTime === null)) || (force && !this.$store.state.Settings.serverError)) {
          this.loader = true
          let walletId = this.$store.state.Keystore.currentWallet._id
          this.ElectrumSRV.main(this.$store.state.Keystore.currentWallet.keys.btc, this.$store.state.Keystore.currentWallet.changes.btc, walletId, 'btc')
          this.ElectrumSRV.getHistory(this.$store.state.Keystore.currentWallet.keys.btc, this.$store.state.Keystore.currentWallet.changes.btc, walletId, 'btc')
          this.$watch('ElectrumSRV.history', function () {
            if (this.ElectrumSRV.history.walletId === this.$store.state.Keystore.currentWallet._id && this.ElectrumSRV.history.type === 'btc') {
              this.balances = this.ElectrumSRV.balances
              this.history = this.ElectrumSRV.history
              this.$store.dispatch('setWalletData', {
                balances: this.balances,
                history: this.history,
                walletId: walletId,
                type: 'btc'
              })
              this.setHistory(this.history)
            } else {
              this.loader = true
            }
          }, {deep: true})
          if (force) {
            this.$store.dispatch('updateLastUpdate', {
              time: moment().unix(),
              walletId: walletId,
              type: 'btc'
            })
          } else {
            this.$store.dispatch('setLastUpdate', {
              time: moment().unix(),
              walletId: walletId,
              type: 'btc'
            })
          }
        } else if (typeof this.data.history !== 'undefined') {
          console.log(this.data.history)
          this.setHistory(this.data.history)
          this.loader = false
        }
      },
      showDetails (tx) {
        this.details = tx
        $('#details').modal('show')
      }
    }
  }
</script>
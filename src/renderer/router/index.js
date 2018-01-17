import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-page',
      component: require('@/components/MainPage'),
      props: { new: false }
    },
    {
      path: '/save-phrase/:wallet_name',
      name: 'save-phrase',
      component: require('@/components/SavePhrase')
    },
    {
      path: '/confirm/:wallet_name/:phrase',
      name: 'confirm-phrase',
      component: require('@/components/ConfirmPhrase')
    },
    {
      path: '/wallet/:wallet_name/dashboard',
      name: 'dashboard',
      component: require('@/components/Dashboard.vue')
    },
    {
      path: '/wallet/:wallet_name/history',
      name: 'history',
      component: require('@/components/History.vue')
    },
    {
      path: '/wallet/:wallet_name/send',
      name: 'send-coins',
      component: require('@/components/SendCoins.vue')
    },
    {
      path: '/wallet/:wallet_name/receive',
      name: 'receive-coins',
      component: require('@/components/ReceiveCoins.vue')
    },
    {
      path: '/wallet/:wallet_name/:type',
      name: 'wallet',
      component: require('@/components/Wallet'),
      props: true
    }
  ]
})

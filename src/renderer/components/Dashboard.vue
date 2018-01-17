<template>
    <div class="wrapper">
        <btc-dash v-if="$store.state.Keystore.walletType === 'btc'"></btc-dash>
        <emc-dash v-else></emc-dash>
    </div>
</template>

<script>
  import BtcDash from './Wallets/BtcDash.vue'
  import EmcDash from './Wallets/EmcDash.vue'

  export default {
    name: 'dashboard',
    components: {
      'btc-dash': BtcDash,
      'emc-dash': EmcDash
    }
  }
</script>
<template>
    <div class="wrapper">
        <btc-history v-if="$store.state.Keystore.walletType === 'btc'"></btc-history>
        <emc-history v-else></emc-history>
    </div>
</template>

<script>
  import BtcHistory from './Wallets/BtcHistory.vue'
  import EmcHistory from './Wallets/EmcHistory.vue'

  export default {
    name: 'history',
    components: {
      EmcHistory,
      BtcHistory
    }
  }
</script>
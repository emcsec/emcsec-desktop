<template>
    <div>
        <btc-send v-if="$store.state.Keystore.walletType === 'btc'"></btc-send>
        <emc-send v-else></emc-send>
    </div>
</template>

<script>
    import EmcSend from './Wallets/EmcSend.vue'
    import BtcSend from './Wallets/BtcSend.vue'

    export default {
      name: 'send-coins',
      components: {
        EmcSend,
        BtcSend
      }
    }
</script>
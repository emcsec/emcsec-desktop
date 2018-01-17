<template>
    <div>
        <btc-receive v-if="$store.state.Keystore.walletType === 'btc'"></btc-receive>
        <emc-receive v-else></emc-receive>
    </div>
</template>

<script>
    import EmcReceive from './Wallets/EmcReceive.vue'
    import BtcReceive from './Wallets/BtcReceive.vue'

    export default {
      name: 'receive-coins',
      components: {
        EmcReceive,
        BtcReceive
      }
    }
</script>
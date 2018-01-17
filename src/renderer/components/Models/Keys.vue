<template>
    <div>
    </div>
</template>

<script>
let bitcore = require('bitcore-bip39')

export default {
  data () {
    return {}
  },
  methods: {
    generateMnemonicPhrase: function () {
      let phrase = bitcore.Bip39.generateMnemonic()
      return phrase
    },
    generateEmcKeys: function (phrase) {
      let seed = bitcore.Bip39.mnemonicToSeed(phrase)
      let priv = bitcore.HDPrivateKey.fromSeed(seed)
      let derived = []
      for (let i = 0; i < 20; i++) {
        derived[i] = {
          generalXPriv: priv.xprivkey,
          xpriv: priv.derive('m/0/' + i).xprivkey,
          xpub: priv.derive('m/0/' + i).xpubkey,
          address: new bitcore.Address(priv.derive('m/0/' + i).hdPublicKey.publicKey, 'emcnet').toString(),
          name: '',
          sort: i
        }
      }
      derived.changes = []
      for (let i = 0; i < 5; i++) {
        derived.changes[i] = {
          generalXPriv: priv.xprivkey,
          xpriv: priv.derive('m/1/' + i).xprivkey,
          xpub: priv.derive('m/1/' + i).xpubkey,
          address: new bitcore.Address(priv.derive('m/1/' + i).hdPublicKey.publicKey, 'emcnet').toString(),
          sort: i
        }
      }

      return derived
    },
    generateBtcKeys: function (phrase) {
      let seed = bitcore.Bip39.mnemonicToSeed(phrase)
      let priv = bitcore.HDPrivateKey.fromSeed(seed)
      let derived = []
      for (let i = 0; i < 20; i++) {
        derived[i] = {
          generalXPriv: priv.xprivkey,
          xpriv: priv.derive('m/0/' + i).xprivkey,
          xpub: priv.derive('m/0/' + i).xpubkey,
          address: new bitcore.Address(priv.derive('m/0/' + i).hdPublicKey.publicKey, 'livenet').toString(),
          name: '',
          sort: i
        }
      }
      derived.changes = []
      for (let i = 0; i < 5; i++) {
        derived.changes[i] = {
          generalXPriv: priv.xprivkey,
          xpriv: priv.derive('m/1/' + i).xprivkey,
          xpub: priv.derive('m/1/' + i).xpubkey,
          address: new bitcore.Address(priv.derive('m/1/' + i).hdPublicKey.publicKey, 'livenet').toString(),
          sort: i
        }
      }
      console.log(derived)

      return derived
    },
    validateMnemonic (Phrase) {
      return bitcore.Bip39.validateMnemonic(Phrase)
    }
  }
}
</script>

<style scoped>
</style>

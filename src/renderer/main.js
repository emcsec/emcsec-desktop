import Vue from 'vue'
import axios from 'axios'
import $ from 'jquery'

import App from './App'
import router from './router'
import store from './store'
import db from './store/db'
import I18n from './translations/i18n'
import dialogs from './tools/Dialogs'
import './assets/icon.png'
import './assets/icon.ico'
import './assets/icon.icns'
import VeeValidate from 'vee-validate'
const VueInputMask = require('vue-inputmask').default

let vvconfig = {
  locale: I18n.I18n.currentLanguage
}

Vue.use(VeeValidate, vvconfig)
Vue.use(VueInputMask)
Vue.use(db)
Vue.use(I18n)
Vue.use(dialogs)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

window.jQuery = $
window.$ = $

require('bootstrap')

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

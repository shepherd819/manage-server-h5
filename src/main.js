// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import Utils from './common/utils'
import 'element-ui/lib/theme-chalk/index.css'

import {postHttp,putHttp,getHttp,deleteHttp,postFormHttp} from './common/util/http'
Vue.prototype.postHttp = postHttp
Vue.prototype.putHttp = putHttp
Vue.prototype.getHttp = getHttp
Vue.prototype.deleteHttp = deleteHttp
Vue.prototype.postFormHttp = postFormHttp

Vue.directive('dbClick', {
  inserted(el, binding) {
    el.addEventListener('click', e => {
      if (!el.disabled) {
        el.disabled = true
        el.style.cursor = 'not-allowed'
        setTimeout(() => {
          el.style.cursor = 'pointer'
          el.disabled = false
        }, 1500)
      }
    })
  }
})
Vue.use(ElementUI)
Vue.prototype.Utils = Utils
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})

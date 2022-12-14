import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import toast from 'components/common/toast'

Vue.config.productionTip = false
//安装toast插件
Vue.use(toast)

// 解决移动端300ms延迟
FastClick.attach(document.body)

//使用懒加载的插件
Vue.use(VueLazyLoad, {
  loading:require('./assets/img/common/yue.png')
})

//Vue实例有$on,$emit等方法，所以可以作为$bus的事件总线
Vue.prototype.$bus = new Vue();
// Vue.use(Toast);
// Vue.use(VueLazyLoad, {
//   loading: require("assets/img/common/placeholder.png")
// });

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

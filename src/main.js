import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
Vue.config.productionTip = false
import './pulgin/element'
import './assets/font/iconfont.css'
// import request from './netword/request'
import axios from 'axios'
Vue.prototype.$http = axios
// import ElementUI from 'element-ui'; // 2.1引入结构
// import 'element-ui/lib/theme-chalk/index.css'; // 2.2引入样式
/* eslint-disable no-new */
// Vue.use(ElementUI)
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1'
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

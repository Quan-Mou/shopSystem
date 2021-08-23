import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
Vue.config.productionTip = false
import './pulgin/element'
import './assets/font/iconfont.css'
// import request from './netword/request'
import axios from 'axios'

import TreeTable from 'vue-table-with-tree-grid'
// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1'
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'

axios.defaults.baseURL = 'http://39.99.150.254:8801/api/private/v1/'

// http://39.99.150.254:8801/api/private/v1/

axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config;
})
Vue.prototype.$http = axios
// import ElementUI from 'element-ui'; // 2.1引入结构
// import 'element-ui/lib/theme-chalk/index.css'; // 2.2引入样式
/* eslint-disable no-new */
// Vue.use(ElementUI)
// 全局事件总线
Vue.prototype.$bus = new Vue();

// 表格组件 tree

Vue.component('tree-table', TreeTable)

// import ZkTable from 'vue-table-with-tree-grid'

// Vue.use(ZkTable)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

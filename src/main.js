// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import VueRouter from 'vue-router'
// import routeConfig from './router-config'
import router from './router'
import ElementUI from 'element-ui'
import 'vue-element-extends/lib/index.css'
// import { Editable, EditableColumn } from 'vue-element-extends'
import Bmob from 'hydrogen-js-sdk'
// import './assets/js/key'
import '../node_modules/element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.use(router)
// Vue.use(VueRouter)
// Vue.component('ElxEditable', Editable)
// Vue.component('ElxEditableColumn ', EditableColumn)

Bmob.initialize('c939b6040b615c3a', 'cr1234')

// 挂载到全局使用
Vue.prototype.Bmob = Bmob

Vue.config.productionTip = false

// const router = new router({
//   routes: routeConfig
// })

// const router = new VueRouter({
//   routes: routeConfig
// })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

// 路由钩子
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') {
//     sessionStorage.removeItem('user')
//   }
//   var user = sessionStorage.getItem('user') // 读取user
//   if (!user && to.path !== '/login') {
//     next({
//       path: '/login'
//     })
//   } else {
//     next()
//   }
// })

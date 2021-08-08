import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import login from '@/components/Login/login'
import home from '@/components/Home/home'

Vue.use(Router)
let routes = [{
  path: '',
  redirect: '/login'
},
{
  path: '/login',
  component: login
},
{
  path: '/home',
  component: home
}]
const router = new Router({
  routes,
})
router.beforeEach((to, from, next) => {
  // 路由导航守卫： to 将要访问的路径 ， from 代表从那个路径跳转而来  next() 放行   next('/login')强制跳转这个路径
  if (to.path == '/login') next()
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) next('/login')
  next()
})
export default router

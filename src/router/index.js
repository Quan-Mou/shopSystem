import Vue from "vue";
import Router from "vue-router";
// import HelloWorld from '@/components/HelloWorld'
import login from "@/components/Login/login";
import home from "@/components/Home/home";
const Default = () => import("@/components/default");
const Roles = () => import('@/components/Rights/rolesList')
const User = () => import('@/components/User/users')


const RightList = () => import('@/components/Rights/Rightlist')
Vue.use(Router);
let routes = [
  {
    path: "",
    redirect: "/login"
  },
  {
    path: "/login",
    component: login
  },
  {
    path: "/home",
    component: home,
    redirect: "/welcome",
    children: [
      {
        path: "/welcome",
        component: Default
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/rights',
        component: RightList
      }
    ]
  }

];
const router = new Router({
  routes
});
router.beforeEach((to, from, next) => {
  // 路由导航守卫： to 将要访问的路径 ， from 代表从那个路径跳转而来  next() 放行   next('/login')强制跳转这个路径
  if (to.path == "/login") next();
  const tokenStr = sessionStorage.getItem("token");
  if (!tokenStr) next("/login");
  next();
});
export default router;

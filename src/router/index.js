import Vue from 'vue'
import Router from 'vue-router'
import login from '../view/login.vue'
import home from '../view/home.vue'
import register from '../view/register.vue'
import roomtypelist from '../components/roomtype-list.vue'
import typedetails from '../components/type-details.vue'
import myself from '../components/myself.vue'
import mydata from '../components/mydata.vue'
import myorder from '../components/myorder.vue'
import adminlogin from '../view/admin-login.vue'
import adminhome from '../view/admin-home.vue'
import roomtype from '../components/roomtype.vue'
import room from '../components/room.vue'
import order from '../components/order.vue'
import movein from '../components/movein.vue'


Vue.use(Router)

const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router =  new Router({
  mode: 'history',
  routes: [
    {
      path:'/register',
      component:register
    },
    {
      path:'/adminlogin',
      component:adminlogin
    },
    {
      path:'/login',
      component:login
    },
    {
      path:'/',
      redirect:'/login'
    },
    {
      path: '/home',
      component: home,
      redirect:'/home/roomtypelist',
      children:[
        {path:'roomtypelist',component:roomtypelist},
        {path:'typedetails/:id',name:'typedetails',component:typedetails},
        {
          path:'myself',
          component:myself,
          redirect:'/home/myself/mydata',
          children:[
            {path:'mydata',component:mydata},
            {path:'myorder',component:myorder},
          ]
        },
      ]
    },
    {
      path:'/adminhome',
      component:adminhome,
      redirect:'/adminhome/roomtype',
      children:[
        {path:'roomtype',component:roomtype},
        {path:'room',component:room},
        {path:'order',component:order},
        {path:'movein',component:movein},
      ]
    },
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login'||to.path === '/register'||to.path === '/adminlogin') {
    next();
  } else {
    let token = window.sessionStorage.getItem("token");
 
    if (!token) {
      next('/login');
    } else {
      next();
    }
  }
});
export default router
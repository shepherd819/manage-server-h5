import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '../views/NotFound.vue'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'
import Echarts from '../views/Echarts.vue'
import Goods from '../views/Goods.vue'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        {
          path: '/goods',
          name: 'goods',
          component: Goods
        },
        {
          path: '/echarts',
          name: 'echarts',
          component: Echarts
        }
      ]
    },
    {
      path: '/404',
      name: 'notfound',
      component: NotFound
    },
    {
      path: '*',
      redirect: { path: '/404' }
    }
  ]
})

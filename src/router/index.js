import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import hisPublic from '@/views/hisPublic/index.vue'
import login from '@/views/login/index.vue'
import hisContainer from '@/views/hisContainer/index.vue'
import management from '@/views/management/index.vue'
import dose from '@/views/dose/index.vue'
import register from '@/views/register/index.vue'
import registerQuery from '@/views/registerQuery/index.vue'
import registerData from '@/views/registerData/index.vue'
import registerPay from '@/views/registerPay/index.vue'
import registerWork from '@/views/registerWork/index.vue'
import doctorWork from '@/views/doctorWork/index.vue'
import officeWork from '@/views/officeWork/index.vue'
import officeInfo from '@/views/officeInfo/index.vue'
import doctorInfo from '@/views/doctorInfo/index.vue'
import workPlace from '@/views/workPlace/index.vue'
import queue from '@/views/queue/index.vue'
import dosePlace from '@/views/dosePlace/index.vue'
import pay from '@/views/pay/index.vue'
import index from '@/views/index/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'container',
      redirect: '/index',
      component: hisContainer,
      children: [
        {
          path: 'management',
          name: '药房管理',
          component: management
        },
        {
          path: 'dose',
          name: '门诊发药',
          component: dose
        },
        {
          path: 'register',
          name: '挂号管理',
          component: register
        },
        {
          path: 'registerQuery',
          name: '查询统计',
          component: registerQuery
        },
        {
          path: 'registerWork',
          name: '挂号员工作量',
          component: registerWork
        },
        {
          path: 'doctorWork',
          name: '医生工作量',
          component: doctorWork
        },
        {
          path: 'officeWork',
          name: '科室工作量',
          component: officeWork
        },
        {
          path: 'registerData',
          name: '基础数据',
          component: registerData
        },
        {
          path: 'officeInfo',
          name: '科室信息',
          component: officeInfo
        },
        {
          path: 'doctorInfo',
          name: '医生信息',
          component: doctorInfo
        },
        {
          path: 'registerPay',
          name: '处方缴费',
          component: registerPay
        },
        {
          path: 'workPlace',
          name: '工作台',
          component: workPlace
        },
        {
          path: 'dosePlace',
          name: '给药台',
          component: dosePlace
        },
        {
          path: 'queue',
          name: '病人队列',
          component: queue
        },
        {
          path: 'pay',
          name: '收费台',
          component: pay
        },
        {
          path: 'index',
          name: '首页',
          component: index
        }
      ]
    },
    {
      path: '/hisPublic',
      name: 'hisPublic',
      component: hisPublic
    }
  ]
})

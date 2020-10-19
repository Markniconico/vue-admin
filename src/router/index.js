import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: {
        title: '首页',
        icon: 'dashboard',
        affix: true
      }
    }]
  }
]

export const asyncRoutes = [{
    path: '/productMange',
    component: Layout,
    redirect: '/productMange/list',
    name: 'ProductMange',
    meta: {
      title: '产品管理',
      icon: 'table',
      roles: ['admin', 'editor']
    },
    children: [{
        path: 'list',
        component: () => import('@/views/productMange'),
        name: 'ProductList',
        meta: {
          title: '列表'
        }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/components/productDetail'),
        name: 'editProduct',
        meta: {
          title: '编辑产品'
        },
        hidden: true
      },
      {
        path: 'create',
        component: () => import('@/components/productDetail'),
        name: 'createProduct',
        meta: {
          title: '添加产品'
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: false
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

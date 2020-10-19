import Mock from 'mockjs'

const List = []
const count = 30

const baseContent = 'i am test data for Mockjs'
const image_url = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment', //id
    product_name: '@first', //产品名称
    'product_type|1': ['Food', 'dress', 'amuse'], //产品分类
    'count|1-100000': 2, //产品已售数量
    'price|88-1000': 1, //产品价格
    display_time: '@datetime', //上线日期
    image_url, //产品Logo
    content: baseContent, //产品简要
  }))
}
export default [{
    url: '/vue-element-admin/product/list',
    type: 'get',
    response: config => {
      const {page = 1,limit = 20,sort} = config.query
      if (sort === '-id') {
        List = List.reverse()
      }

      const pageList = List.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: List.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/product/getProductClass',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: ['Food', 'dress', 'amuse']
      }
    }
  },

  {
    url: '/vue-element-admin/product/detail',
    type: 'get',
    response: config => {
      const {
        id
      } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },
  {
    url: '/vue-element-admin/product/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/product/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

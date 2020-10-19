import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/product/list',
    method: 'get',
    params: query
  })
}

export function fetchProductClass() {
  return request({
    url: '/vue-element-admin/product/getProductClass',
    method: 'get'
  })
}

export function fetchProduct(id) {
  return request({
    url: '/vue-element-admin/product/detail',
    method: 'get',
    params: { id }
  })
}

export function createProduct(data) {
  return request({
    url: '/vue-element-admin/product/create',
    method: 'post',
    data
  })
}

export function updateProduct(data) {
  return request({
    url: '/vue-element-admin/product/update',
    method: 'post',
    data
  })
}

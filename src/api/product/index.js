import request from '@/utils/request'

// 查询产品信息列表
export function getList(query) {
  return request({
    url: '/api/product/queryProductList',
    method: 'post',
    data: query,
  })
}
export function getProductAll(query) {
  return request({
    url: '/api/product/queryProductAllList',
    method: 'post',
    data: query,
  })
}

// 查询产品信息详细
export function getInfo(query) {
  return request({
    url: '/api/product/queryProductDetail',
    method: 'get',
    params: query
  })
}

// 新增产品信息
export function add(data) {
  return request({
    url: '/api/product/save',
    method: 'post',
    data: data
  })
}


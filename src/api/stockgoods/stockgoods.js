import request from '@/utils/request'

// 查询权益商品列表
export function listStockgoods(query) {
  return request({
    url: '/stockgoods/stockgoods/list',
    method: 'get',
    params: query
  })
}

// 查询权益商品详细
export function getStockgoods(goodsId) {
  return request({
    url: '/stockgoods/stockgoods/' + goodsId,
    method: 'get'
  })
}

// 新增权益商品
export function addStockgoods(data) {
  return request({
    url: '/stockgoods/stockgoods',
    method: 'post',
    data: data
  })
}

// 修改权益商品
export function updateStockgoods(data) {
  return request({
    url: '/stockgoods/stockgoods',
    method: 'put',
    data: data
  })
}

// 删除权益商品
export function delStockgoods(goodsId) {
  return request({
    url: '/stockgoods/stockgoods/' + goodsId,
    method: 'delete'
  })
}

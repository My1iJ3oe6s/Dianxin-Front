import request from '@/utils/request'

// 查询权益商品列表
export function listStockgoods(query) {
  return request({
    url: '/stockgoods/callGoods/list',
    method: 'get',
    params: query
  })
}

// 根据城市查询权益商品列表
export function listStockgoodsByCity(query) {
  return request({
    url: '/stockgoods/callGoods/listByCity',
    method: 'get',
    params: query
  })
}

// 查询权益商品详细
export function getStockgoods(goodsId) {
  return request({
    url: '/stockgoods/callGoods/' + goodsId,
    method: 'get'
  })
}

// 新增权益商品
export function addStockgoods(data) {
  return request({
    url: '/stockgoods/callGoods',
    method: 'post',
    data: {
      ...data,
      mode: data.mode,
      city: data.city,
      isSplit: data.isSplit,
      splitRatio: data.splitRatio
    }
  })
}

// 修改权益商品
export function updateStockgoods(data) {
  return request({
    url: '/stockgoods/callGoods',
    method: 'put',
    data: {
      ...data,
      mode: data.mode,
      city: data.city,
      isSplit: data.isSplit,
      splitRatio: data.splitRatio
    }
  })
}

// 删除权益商品
export function delStockgoods(goodsId) {
  return request({
    url: '/stockgoods/callGoods/' + goodsId,
    method: 'delete'
  })
}

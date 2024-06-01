import request from '@/utils/request'

// 查询订单表列表
export function listOrder(query,) {
  return request({
    url: '/api/selfOrders/page',
    method: 'post',
    data: query,
  })
}

// 查询订单表详细
export function getOrder(id) {
  return request({
    url: `/api/selfOrders/getById/${id}`,
    method: 'get',
  })
}

// 新增订单表
export function addOrder(data) {
  return request({
    url: '/api/selfOrders/save',
    method: 'post',
    data: data
  })
}


// 撤销订单表
export function cancelOrder(query) {
  return request({
    url: '/api/order/cancelOrder',
    method: 'get',
    params: query
  })
}

// 导出订单表
export function exportOrder(query) {
  return request({
    url: '/order/export',
    method: 'get',
    params: query
  })
}

export function getAreaList(level) {
  return request({
    url: `/api/area/level/${level}`,
    method: 'get',
  })
}

export function getAreaChildren(parentId) {
  return request({
    url: `/api/area/childArea/${parentId}`,
    method: 'get',
  })
}
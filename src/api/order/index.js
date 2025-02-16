import request from '@/utils/request'

// 查询订单表列表
export function listOrder(query,) {
  query.queryParameters.orderType = 1
  return request({
    url: '/selfOrders/page',
    method: 'post',
    data: query,
  })
}

// 查询订单表详细
export function getOrder(id) {
  return request({
    url: `/selfOrders/getById/${id}`,
    method: 'get',
  })
}

// 新增订单表
export function addOrder(data) {
  data.orderType = 1
  return request({
    url: '/selfOrders/save',
    method: 'post',
    data: data
  })
}


// 撤销订单表
export function cancelOrder(query) {
  query.orderType = 1
  return request({
    url: '/order/cancelOrder',
    method: 'get',
    params: query
  })
}

// 导出订单表
export function exportOrder(query) {
  query.orderType = 1
  return request({
    url: '/order/export',
    method: 'get',
    params: query
  })
}

export function getAreaList(level) {
  return request({
    url: `/area/level/${level}`,
    method: 'get',
  })
}

export function getAreaChildren(parentId) {
  return request({
    url: `/area/childArea/${parentId}`,
    method: 'get',
  })
}
export function getSource() {
  return request({
    url: '/selfOrders/queryOrderSource',
    method: 'get'
  })
}

export function exportOrderId(data) {
  data.orderType = 1
  return request({
    url: '/selfOrders/exportOrderId',
    method: 'post',
    data
  })
}

export function batchConvertProduct(data) {
    data.orderType = 1
  return request({
    url: '/selfOrders/batchConvertProduct',
    method: 'post',
    data,
  })
}

export function importOrderId(data) {
  data.orderType = 1
  return request({
    url: '/selfOrders/importOrderId',
    method: 'post',
    data,
    "headers": {
      "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryX"
    }
  })
}

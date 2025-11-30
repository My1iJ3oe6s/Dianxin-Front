import request from '@/utils/request'

// 查询外呼记录列表
export function listSelfCallRecord(query) {
  return request({
    url: '/selfCallRecord/selfCallRecord/list',
    method: 'get',
    params: query
  })
}

// 查询外呼记录详细
export function getSelfCallRecord(id) {
  return request({
    url: '/selfCallRecord/selfCallRecord/' + id,
    method: 'get'
  })
}

// 新增外呼记录
export function addSelfCallRecord(data) {
  return request({
    url: '/selfCallRecord/selfCallRecord',
    method: 'post',
    data: data
  })
}

// 修改外呼记录
export function updateSelfCallRecord(data) {
  return request({
    url: '/selfCallRecord/selfCallRecord',
    method: 'put',
    data: data
  })
}

// 删除外呼记录
export function delSelfCallRecord(id) {
  return request({
    url: '/selfCallRecord/selfCallRecord/' + id,
    method: 'delete'
  })
}

// 设置外呼产品
export function setCallProduct(data) {
  return request({
    url: '/selfCallRecord/selfCallRecord/setCallProduct',
    method: 'post',
    data: data
  })
}

// 分配外呼人员
export function assignCallUser(data) {
  return request({
    url: '/selfCallRecord/selfCallRecord/assignCallUser',
    method: 'post',
    data: data
  })
}

// 拨打电话
export function dialPhone(id) {
  return request({
    url: '/selfCallRecord/selfCallRecord/dialPhone/' + id,
    method: 'get'
  })
}

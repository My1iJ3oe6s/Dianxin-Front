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

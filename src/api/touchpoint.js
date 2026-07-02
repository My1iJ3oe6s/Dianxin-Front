import request from '@/utils/request'

// 查询触点列表
export function listTouchPoint(query) {
  return request({
    url: '/business/touchPoint/list',
    method: 'get',
    params: query
  })
}

// 查询触点详细
export function getTouchPoint(id) {
  return request({
    url: '/business/touchPoint/' + id,
    method: 'get'
  })
}

// 新增触点
export function addTouchPoint(data) {
  return request({
    url: '/business/touchPoint',
    method: 'post',
    data: data
  })
}

// 修改触点
export function updateTouchPoint(data) {
  return request({
    url: '/business/touchPoint',
    method: 'put',
    data: data
  })
}

// 修改触点状态
export function changeTouchPointStatus(id, status) {
  return request({
    url: '/business/touchPoint/changeStatus',
    method: 'put',
    data: {
      id: id,
      status: status
    }
  })
}

// 删除触点
export function delTouchPoint(id) {
  return request({
    url: '/business/touchPoint/' + id,
    method: 'delete'
  })
}

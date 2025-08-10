import request from '@/utils/request'

// 查询手机号黑名单列表
export function listBlacklist(query) {
  return request({
    url: '/blacklist/blacklist/list',
    method: 'get',
    params: query
  })
}

// 查询手机号黑名单详细
export function getBlacklist(id) {
  return request({
    url: '/blacklist/blacklist/' + id,
    method: 'get'
  })
}

// 新增手机号黑名单
export function addBlacklist(data) {
  return request({
    url: '/blacklist/blacklist',
    method: 'post',
    data: data
  })
}

// 修改手机号黑名单
export function updateBlacklist(data) {
  return request({
    url: '/blacklist/blacklist',
    method: 'put',
    data: data
  })
}

// 删除手机号黑名单
export function delBlacklist(id) {
  return request({
    url: '/blacklist/blacklist/' + id,
    method: 'delete'
  })
}

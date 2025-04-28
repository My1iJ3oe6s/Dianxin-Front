import request from '@/utils/request'

// 查询地区列表
export function listArea(query) {
  return request({
    url: '/system/area/list',
    method: 'get',
    params: query
  })
}

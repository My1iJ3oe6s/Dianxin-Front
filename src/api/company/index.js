import request from '@/utils/request'

// 查询列表
export function getList(query) {
  return request({
    url: '/company/page',
    method: 'post',
    data: query,
  })
}

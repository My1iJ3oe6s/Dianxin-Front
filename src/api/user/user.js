import request from '@/utils/request'

// 查询列表
export function getMemberQuery(query) {
  return request({
    url: '/member/base/query',
    method: 'get',
    params: {
      delFlag: 0,//供选择使用的人员信息，剔除已删除数据
      ...query,
    }
  })
}
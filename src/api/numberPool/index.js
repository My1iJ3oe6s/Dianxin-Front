import request from '@/utils/request'

// 查询列表
export function getList() {
  return request({
    url: `/api/numberPools/getPoolNameList?poolName=`,
    method: 'post',
  })
}
export function getPhoneList(data) {
  return request({
    url: `/api/numberPools/page`,
    method: 'post',
    data
  })
}
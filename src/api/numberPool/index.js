import request from '@/utils/request'

// 查询列表
export function getList() {
  return request({
    url: `/numberPools/getPoolNameList?poolName=`,
    method: 'post',
  })
}
export function getPhoneList(data) {
  return request({
    url: `/numberPools/page`,
    method: 'post',
    data
  })
}
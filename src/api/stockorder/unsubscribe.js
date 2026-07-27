import request from '@/utils/request'

export function listUnsubscribeLogs(query) {
  return request({ url: '/stockorder/unsubscribe/logs', method: 'get', params: query })
}

export function getUnsubscribeLog(id) {
  return request({ url: '/stockorder/unsubscribe/logs/' + id, method: 'get' })
}

export function querySupplierUnsubscribe(queryDate, supplierCode) {
  return request({
    url: '/stockorder/unsubscribe/query',
    method: 'post',
    params: { queryDate, supplierCode: supplierCode || 'YUYUYUAN' }
  })
}

export function listUnsubscribeRecords(query) {
  return request({ url: '/stockorder/unsubscribe/records', method: 'get', params: query })
}

export function rematchUnsubscribeRecords(limit) {
  return request({
    url: '/stockorder/unsubscribe/rematch',
    method: 'post',
    params: { limit: limit || 100 }
  })
}

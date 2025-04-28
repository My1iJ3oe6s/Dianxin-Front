import request from '@/utils/request';

export function listSysDeptGoods(query) {
  return request({
    url: '/stockgoods/sysDeptGoods/list',
    method: 'get',
    params: query
  });
}

export function addSysDeptGoods(data) {
  return request({
    url: '/stockgoods/sysDeptGoods',
    method: 'post',
    data: data
  });
}

export function updateSysDeptGoods(data) {
  return request({
    url: '/stockgoods/sysDeptGoods',
    method: 'put',
    data: data
  });
}

export function deleteSysDeptGoods(id) {
  return request({
    url: '/stockgoods/sysDeptGoods/' + id,
    method: 'delete'
  });
}

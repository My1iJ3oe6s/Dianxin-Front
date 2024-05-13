// 字典对象

// 订单 退款张泰
const orderAftersaleStatusMap = [
  {
    value: 1,
    label: '无售后或售后关闭',
    type: 'info',
  },
  {
    value: 2,
    label: '售后处理中',
    type: 'warning',
  },
  {
    value: 3,
    label: '退款中',
    type: 'warning',
  },
  {
    value: 4,
    label: '退款成功',
    type: 'success',
  }
];

const obj = {
  orderAftersaleStatusMap
}


export function getDictObj(label, value) {
  let arr = obj[label] || {};
  let dict = {};
  for (const item of arr) {
    if (item.value === value) {
      dict = item;
      break;
    }
  }
  return dict
}
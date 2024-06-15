<template>
  <div class="order_detail_wrapper">
    <el-main v-loading="loading">
      <el-card class="mt10">
        <el-button style="float: right" size="small" @click="$router.back()">返回</el-button>
        <el-descriptions title="订单信息" :column="2" border label-class-name="my-label" contentClassName="my-content">\
          <el-descriptions-item label="订单编号">{{
            orderDetail.orderId
          }}</el-descriptions-item>
          <el-descriptions-item label="客户名称">{{
            orderDetail.receiver
          }}</el-descriptions-item>
          <el-descriptions-item label="用户手机号">{{
            orderDetail.receiverPhoneNumber
          }}</el-descriptions-item>
          <el-descriptions-item label="预选手机号">{{
            orderDetail.preBookingNumber
          }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">{{
            returnNameData(statusData, orderDetail.status)
          }}</el-descriptions-item>
          <el-descriptions-item label="失败原因">{{
            orderDetail.failureReason
          }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{
            parseTime(orderDetail.createdAt, "")
          }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card class="mt10">
        <el-descriptions title="收货信息" :column="2" border label-class-name="my-label" contentClassName="my-content">
          <el-descriptions-item label="收货人姓名">{{
            orderDetail.receiver
          }}</el-descriptions-item>
          <el-descriptions-item label="收货人手机号">{{
            orderDetail.receiverPhoneNumber
          }}</el-descriptions-item>
          <el-descriptions-item label="收货区域">
            {{ orderDetail.receiverProvinceName }} {{ orderDetail.receiverCityName }}
          </el-descriptions-item>
          <el-descriptions-item label="详细地址">
            {{ orderDetail.receiverAddress }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card class="mt10">
        <el-descriptions title="商品信息" :column="2" border label-class-name="my-label" contentClassName="my-content">
        </el-descriptions>
        <el-table :data="goods" style="width: 100%">
          <el-table-column label="主图" align="center" prop="mainImage">
            <template slot-scope="scope">
              <el-image style="width: 50px; height: 50px" :src="scope.row.mainImage" :preview-src-list="[scope.row.mainImage]">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="商品id" align="center" prop="goodsId" />
          <el-table-column label="商品名称" align="center" prop="goodsName" />
          <el-table-column label="商品编码" align="center" prop="goodsCode" />
          <!-- <el-table-column label="状态" align="center" prop="productStatus">
            <template slot-scope="scope">
              {{ scope.row.productStatus == 1 ? '启用' : '禁用' }}
            </template>
          </el-table-column> -->
        </el-table>
      </el-card>

    </el-main>
  </div>
</template>

<script>
import { getOrder } from "@/api/order/index";
import { prodTypeData } from '@/utils/printData';
import { statusData } from "@/utils/printData";
import { returnName } from "@/utils/index.js";

export default {
  name: "OrderDetail",
  data() {
    return {
      goods: [],
      orderDetail: {},
      loading: false,
      prodTypeData,
      statusData
    };
  },
  created() {
    // this.getExpressData()
    const { id } = this.$route.query;
    this.queryDetail(id)
  },
  computed: {
    orderStatusMap() {
      let obj = this.dict.type.oms_order_status.map((item) => [item.value, item.label]);
      let map = new Map(obj);
      return map;
    },
    payTypeMap() {
      let obj = this.dict.type.oms_pay_type.map((item) => [item.value, item.label]);
      let map = new Map(obj);
      return map;
    },
    // expressMap() {
    //     let obj = this.experssList.map(item => [item.expressCode, item.expressName])
    //     let map = new Map(obj)
    //     return map
    // }
  },
  methods: {
    returnNameData(list, target, value, name) {
      return returnName(list, target, value, name);
    },
    queryDetail(id) {
      this.loading = true;
      getOrder(id).then((res) => {
        const { data } = res
        this.orderDetail = data;
        this.goods = data.goods || [];
        this.loading = false;
      });
    },
    getOrderStatus(row) {
      return this.orderStatusMap.get(row.orderStatus + "");
    },
    getPayType(row) {
      return this.payTypeMap.get(row.payType + "");
    },
    // getExpressName(row) {
    //     return this.expressMap.get(row.expressName + '')
    // },
    // getExpressData() {
    //     getConfigKey(key).then(res => {
    //         if (res.msg) {
    //             this.experssList = JSON.parse(res.msg)
    //         } else {
    //             // this.list = [...defaultList]
    //         }
    //     })
    // }
  },
};
</script>

<style lang="stylus">
  .order_detail_wrapper
    > .el-card + .el-card
      margin-top 1rem

      .el-form-item__content, .el-form-item__label
        line-height 2

  .my-label
    width 100px
  .my-content
    width 400px
.popperOptions[x-placement^=left] .popper__arrow::after{
    border-left-color: #565D6B;
}
.popperOptions[x-placement^=right] .popper__arrow::after{
    border-right-color: #565D6B;
}
.popperOptions[x-placement^=bottom] .popper__arrow::after{
    border-bottom-color: #565D6B;
}
.popperOptions[x-placement^=top] .popper__arrow::after{
    border-top-color: #565D6B;
}
.popperOptions{
    background-color: #565D6B;
    color: #FFFFFF;
    border: #565D6B;
}
.el-timeline-item__content {
    color: #fff;
}
.el-timeline-item__timestamp {
    color: #fff;
}
</style>

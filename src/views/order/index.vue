<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="140px" size="medium"
        class="ry_form">
        <el-form-item label="外部订单编号" prop="externalOrderNo">
          <el-input v-model.trim="queryParams.queryParameters.externalOrderNo" placeholder="请输入外部订单编号" clearable
            size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="来源" prop="orderSource">
          <el-select clearable v-model="queryParams.queryParameters.orderSource" style="width: 100%">
            <el-option v-for="(item, index) in sourceList" :key="index" :label="item.value" :value="item.code">{{
              item.value }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="receiverIdCard">
          <el-input v-model.trim="queryParams.queryParameters.receiverIdCard" placeholder="请输入身份证号" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="手机号" prop="receiverPhoneNumber">
          <el-input v-model.trim="queryParams.queryParameters.receiverPhoneNumber" placeholder="请输入手机号" clearable
            size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker v-model="queryParams.queryParameters.dateRange" style="width: 240px" value-format="yyyy-MM-dd"
            type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item class="flex_one tr">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增订单</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-upload2" size="mini" @click="handleImport">批量导入</el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="orderList" border @selection-change="handleSelectionChange"
        cell-class-name="my-cell">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="订单id" prop="orderId" width="80" />
        <el-table-column label="姓名" prop="receiver" width="100" />
        <el-table-column label="电话" prop="receiverPhoneNumber" width="110" />
        <el-table-column label="身份证号" prop="receiverIdCard" width="180" />
        <el-table-column label="收件信息" prop="receiver" width="300">
          <template v-slot="scope">
            <div>收货姓名：{{ scope.row.receiver }}</div>
            <div>手机号：{{ scope.row.receiverPhoneNumber }}</div>
            <div>地址：{{ scope.row.receiverProvinceName }}{{ scope.row.receiverCityName }}{{ scope.row.receiverAddress }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="来源" prop="orderSource" width="100" />
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">{{ returnNameData(statusData, scope.row.status) }}</template>
        </el-table-column>
        <el-table-column label="电商订单号" prop="marketingOrderId" />
        <el-table-column label="外部供应商" prop="externalSupplierName" />
        <el-table-column label="外部供应商订单号" prop="externalSupplierOrderId" />
        <el-table-column label="订单详细状态" prop="orderStatusDetail"></el-table-column>
        <el-table-column label="办理失败原因" prop="failureReason" width="180"></el-table-column>
        <el-table-column label="创建时间" prop="createdAt">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createdAt) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="goDetail(scope.row)">详情</el-button>
            <el-button size="mini" type="text" @click="edit(scope.row)">修改</el-button>
            <!-- <el-popconfirm title="确定撤销吗？" @confirm="handleRevoke(scope.row)"
              v-if="scope.row.orderStatus === 40706 || scope.row.orderStatus === 40707 || scope.row.orderStatus === 40708 || scope.row.orderStatus === 20100">
              <el-button slot="reference" size="mini" type="text">撤销</el-button>
            </el-popconfirm> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </div>
    <!-- 添加/修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="70px">
        <el-form-item label="商品" prop="goodsId">
          <el-select clearable v-model="form.goodsId" style="width: 100%" multiple>
            <el-option v-for="(item, index) of goodsList" :key="index" :label="item.goodsName" :value="item.goodsId">{{
              item.goodsName }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="receiver">
          <el-input v-model="form.receiver" />
        </el-form-item>
        <el-form-item label="身份证号" prop="receiverIdCard">
          <el-input v-model="form.receiverIdCard" />
        </el-form-item>
        <el-form-item label="电话" prop="receiverPhoneNumber">
          <el-input v-model="form.receiverPhoneNumber" />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="省" prop="receiverProvinceCode">
              <el-select v-model="form.receiverProvinceCode" @change="handleProvCheck($event, 'cityList')">
                <el-option v-for="(item, index) of provList" :key="index" :label="item.areaName" :value="item.id">{{
                  item.areaName }}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="市" prop="receiverCityCode">
              <el-select v-model="form.receiverCityCode" @change="handleProvCheck($event, 'countyList')">
                <el-option v-for="(item, index) of cityList" :key="index" :label="item.areaName" :value="item.id">{{
                  item.areaName }}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="区" prop="receiverCountyCode">
              <el-select v-model="form.receiverCountyCode" @change="handleCountyChange">
                <el-option v-for="(item, index) of countyList" :key="index" :label="item.areaName" :value="item.id">{{
                  item.areaName }}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="详细地址" prop="receiverAddress">
          <el-input v-model="form.receiverAddress" type="textarea" />
        </el-form-item>
        <el-form-item label="来源" prop="orderSource">
          <el-input v-model="form.orderSource" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url"
        :disabled="upload.isUploading" :file-list="fileList" :on-change="handleChange"
        :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false"
        :on-error="handleFileError" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xlsx格式文件。</span>
          <a target="_blank" :href="productTemplate" type="primary" :underline="false"
            style="font-size:12px;vertical-align: baseline;">下载模板</a>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  listOrder,
  exportOrder,
  addOrder,
  cancelOrder,
  getOrder,
  getAreaList,
  getAreaChildren,
  getSource
} from "@/api/order/index";
import * as goodsApi from "@/api/goods/index";
import AddressSelector from "@/views/components/AddressSelector/index.vue";
import productTemplate from './order_template.xlsx'
import { statusData } from "@/utils/printData";
import { returnName } from "@/utils/index.js";

export default {
  name: "order",
  components: {
    AddressSelector,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 订单表表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      title: "",
      // 是否显示弹出层
      open: false,
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        queryParameters: {
          externalOrderNo: '',
          orderSource: 'NEI_BU',
          receiverIdCard: '',
          receiverPhoneNumber: '',
          dateRange: []
        }
      },
      // 表单参数
      form: {},
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "api/order/upload",
        headers: {
          "Content-Type": "multipart/form-data",
        }
      },
      // 表单校验
      rules: {
        goodsId: [{ required: true, message: "产品不能为空", trigger: "blur" }],
        name: [
          { required: true, message: "收货人姓名不能为空", trigger: "blur" },
        ],
        receiverName: [
          { required: true, message: "收货人姓名不能为空", trigger: "blur" },
        ],
        receiverPhoneNumber: [
          { required: true, message: "电话不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        area: [
          { required: true, message: "收货地址不能为空", trigger: "blur" },
        ],
        address: [
          { required: true, message: "详细地址不能为空", trigger: "blur" },
        ],
      },
      showMoreCondition: false,
      goodsList: [],
      productTemplate,
      fileList: [],
      provList: [],
      cityList: [],
      countyList: [],
      sourceList: [],
      statusData
    };
  },
  created() {
    this.getProductList();
    this.getList();
  },
  methods: {
    returnNameData(list, target, value, name) {
      return returnName(list, target, value, name);
    },
    handleCountyChange(e) {
      this.form.receiverCountyName = this.countyList.filter(v => v.id === e)?.[0]?.areaName;
      this.$forceUpdate();
    },
    handleProvCheck(e, target) {
      switch (target) {
        case 'cityList':
          this.form.receiverProvinceName = this.provList.filter(v => v.id === e)?.[0]?.areaName;
          this.form.receiverCityCode = '';
          this.form.receiverCountyCode = '';
          this.cityList = [];
          this.countyList = [];
          break;
        case 'countyList':
          this.form.receiverCityName = this.cityList.filter(v => v.id === e)?.[0]?.areaName;
          this.form.receiverCountyCode = '';
          this.countyList = [];
          break;
      }
      getAreaChildren(e).then(res => this[target] = res)
    },
    getProductList() {
      goodsApi.getList({
        pageNo: 1,
        pageSize: 50,
      }).then((res) => {
        this.goodsList = res.data.records
      })
      getAreaList(1).then((res) => {
        this.provList = res
      })
      getSource().then((res) => {
        this.sourceList = res.data;
      })
    },
    handleAddressChange(data) {
      this.form.provinceName = data[0];
      this.form.cityName = data[1];
      this.form.countyName = data[2];
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "批量导入";
      this.upload.open = true;
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      if (!response.message) {
        this.upload.open = false;
      }
      let msg = response.message || '上传成功'
      if (response.data && Array.isArray(response.data) && response.data.length) {
        msg = response.data.map((v) => {
          return v.message + '<br/>'
        }).join(' ')
      }
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 文件上传失败
    handleFileError() {
      this.upload.isUploading = false;
    },
    // 提交上传文件
    submitFileForm() {
      const t = this;
      var formData = new FormData();
      formData.append('file', this.fileList[0].raw);

      var xhr = new XMLHttpRequest();
      xhr.open('POST', this.upload.url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          const response = JSON.parse(xhr.responseText);
          t.handleFileSuccess(response)
        } else if (xhr.readyState == 4 && xhr.status != 200) {
          t.handleFileError()
        }
      };
      xhr.send(formData);
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    // 验证身份证
    validID(rule, value, callback) {
      let t = this;
      // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("身份证号不正确"));
      }
    },
    /** 新增 */
    handleAdd() {
      this.title = "新增订单";
      this.open = true;
    },
    edit(row) {
      const id = row.orderId;
      getOrder(id).then((res) => {
        const { data } = res;
        data.goodsId = data.goods.map(v => v.goodsId * 1);
        this.handleProvCheck(data.receiverProvinceCode, 'cityList');
        this.handleProvCheck(data.receiverCityCode, 'countyList');
        this.$nextTick(() => {
          this.form = data;
          this.title = "修改订单";
          this.open = true;
        })
      });
    },
    /** 撤销 */
    handleRevoke(row) {
      cancelOrder({ id: row.id }).then(() => {
        this.$modal.msgSuccess("撤销成功");
        this.getList();
      }).catch(() => {
        this.$modal.msgError("撤销失败");
      })
    },
    /** 查询订单表列表 */
    getList() {
      if (this.queryParams.queryParameters.dateRange?.length) {
        this.queryParams.queryParameters.createStartDate = this.queryParams.queryParameters.dateRange[0] + ' 00:00:00';
        this.queryParams.queryParameters.createEndDate = this.queryParams.queryParameters.dateRange[1] + ' 23:59:59';
      } else {
        this.queryParams.queryParameters.createStartDate = null;
        this.queryParams.queryParameters.createEndDate = null;
      }
      this.loading = true;
      const { pageNum, pageSize } = this.queryParams;
      const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined };
      const pageReq = { pageNo: pageNum, pageSize: pageSize };
      listOrder({ ...query, ...pageReq }).then((response) => {
        const { records, total } = response.data;
        this.orderList = records;
        this.total = total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        queryParameters: {
          externalOrderNo: '',
          orderSource: '',
          receiverIdCard: ''
        }
      }
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加订单表";
    },
    /** 修改按钮操作 */
    handleUpdate() {
      this.$modal.msgError("无操作权限");
    },
    handleWatch() {
      this.$modal.msgError("无操作权限");
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.$refs.addressSelector)
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (Array.isArray(this.form.goodsId)) {
            this.form.goods = this.goodsList.filter((v) => this.form.goodsId.includes(v.goodsId))
          }
          addOrder(this.form).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal
        .confirm("是否确认导出所有订单表数据项？")
        .then(() => {
          this.exportLoading = true;
          return exportOrder(queryParams);
        })
        .then((response) => {
          this.$download.download(response);
          this.exportLoading = false;
        })
        .catch(() => { });
    },
    goDetail(row) {
      const id = row.orderId;
      this.$router.push({ path: "/order/detail", query: { id } });
    },
  },
};
</script>
<style lang="scss">
.product-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 340px;

  .product-item {
    margin: auto;
    width: 290px;

    .sp-data {
      font-size: 13px;
    }

    .quantity {
      font-weight: bold;
      font-size: 13px;
    }
  }
}

.note-title {
  font-weight: bold;
}

.el-table .my-cell {
  vertical-align: top;
}

.el-link.el-link--default {
  color: #409eff;
}

.el-select {
  width: 100%;
}
</style>

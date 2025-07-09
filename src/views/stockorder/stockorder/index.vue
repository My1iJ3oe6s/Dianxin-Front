<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form label-width="120px" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="订单号" prop="orderNo">
          <el-input style="width: 240px" v-model="queryParams.orderNo" placeholder="请输入订单号" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="供应商编码" prop="supplierCode">
          <!--          <el-input style="width: 240px" v-model="queryParams.supplierCode" placeholder="请输入供应商编码" clearable-->
          <!--            @keyup.enter.native="handleQuery" />-->
          <el-select style="width: 240px" v-model="queryParams.supplierCode" placeholder="请输入供应商编码" clearable>
            <el-option v-for="dict in dict.type.stock_supplier" :key="dict.value" :label="dict.label"
                       :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="分销商编码" prop="distributorCode">
          <el-select style="width: 240px" v-model="queryParams.distributorCode" placeholder="请选择分销商编码" clearable>
            <el-option v-for="dict in dict.type.channel_customer" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="分销商订单号" prop="externalOrderNo">
          <el-input style="width: 240px" v-model="queryParams.externalOrderNo" placeholder="请输入分销商订单号" clearable
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="客户手机号" prop="phone">
          <el-input style="width: 240px" v-model="queryParams.phone" placeholder="请输入客户手机号" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="归属地" prop="province">
          <el-input style="width: 240px" v-model="queryParams.province" placeholder="请输入省份或地区" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <!--        <el-form-item label="城市名称" prop="cityName">-->
        <!--          <el-input-->
        <!--            v-model="queryParams.cityName"-->
        <!--            placeholder="请输入城市名称"-->
        <!--            clearable-->
        <!--            @keyup.enter.native="handleQuery"-->
        <!--          />-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="短信验证码" prop="smsNum">-->
        <!--          <el-input-->
        <!--            v-model="queryParams.smsNum"-->
        <!--            placeholder="请输入短信验证码"-->
        <!--            clearable-->
        <!--            @keyup.enter.native="handleQuery"-->
        <!--          />-->
        <!--        </el-form-item>-->
        <el-form-item label="商品编码" prop="goodsCode">
          <el-input style="width: 240px" v-model="queryParams.goodsCode" placeholder="请输入商品编码" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>

        <!--        <el-form-item label="下单时间" prop="orderTime">-->
        <!--          <el-date-picker clearable-->
        <!--                          v-model="queryParams.orderTime"-->
        <!--                          type="date"-->
        <!--                          value-format="yyyy-MM-dd"-->
        <!--                          placeholder="请选择下单时间"-->
        <!--          >-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->

        <el-form-item label="下单时间">
          <el-date-picker style="width: 240px" v-model="queryParams.dateRange" value-format="yyyy-MM-dd" type="daterange"
            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>


        <el-form-item label="订单状态" prop="orderStatus">
          <el-select style="width: 240px" v-model="queryParams.orderStatus" placeholder="请选择订单状态" clearable>
            <el-option v-for="dict in dict.type.self_stock_status" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['stockorder:stockorder:add']">新增
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
            v-hasPermi="['stockorder:stockorder:edit']">修改
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
            v-hasPermi="['stockorder:stockorder:remove']">删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
            v-hasPermi="['stockorder:stockorder:export']">导出
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="el-icon-upload2" size="mini" @click="handleImportUnsubscribe">退订导入</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table :key="tableHeight" :height="tableHeight" v-loading="loading" :data="stockorderList"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!--        <el-table-column label="订单ID" align="center" prop="orderId"/>-->
        <el-table-column label="订单号" align="center" prop="orderNo">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.orderNo" placement="top">
              <span>{{ scope.row.orderNo.slice(0, 10) + '..' }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" align="center" prop="orderTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.orderTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分销商编码" align="center" prop="distributorCode">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.channel_customer" :value="scope.row.distributorCode" />
          </template>
        </el-table-column>
        <!--        <el-table-column label="分销商营销地址" align="center" prop="distributorUrl"/>-->
        <el-table-column label="分销商订单号" align="center" prop="externalOrderNo">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.externalOrderNo" placement="top">
              <span>{{ scope.row.externalOrderNo.slice(0, 10) + '..' }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="客户手机号" align="center" prop="phone" />
        <el-table-column label="归属地" align="center" prop="province">
          <template slot-scope="scope">
            <span>{{ scope.row.province }} {{ scope.row.cityName }}</span>
          </template>
        </el-table-column>
        <!--        <el-table-column label="城市名称" align="center" prop="cityName"/>-->
        <el-table-column label="短信验证码" align="center" prop="smsNum" />
        <el-table-column label="商品名称" align="center" prop="goodsName">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.goodsName" placement="top">
              <span>{{ scope.row.goodsName.slice(0, 10) + '..' }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
<!--        <el-table-column label="供应商编码" align="center" prop="supplierCode" />-->
        <el-table-column label="订单状态" align="center" prop="orderStatus">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.self_stock_status" :value="scope.row.orderStatus" />
          </template>
        </el-table-column>
        <el-table-column label="是否退订" align="center" prop="isUnsubscribe">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.kaiguan" :value="scope.row.isUnsubscribe"/>
          </template>
        </el-table-column>
        <!--        <el-table-column label="备注" align="center" prop="remark"/>-->
        <el-table-column label="操作" width="120" align="left" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-link :underline="false" type="primary" @click="handleUpdate(scope.row)"
              v-hasPermi="['stockorder:stockorder:edit']">修改
            </el-link>
            <el-link :underline="false" type="primary" @click="handleDelete(scope.row)"
              v-hasPermi="['stockorder:stockorder:remove']">删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>



      <div>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
          @pagination="getList" />
      </div>
    </div>

    <!-- 添加或修改权益包订单对话框 -->

    <el-drawer custom-class="drawer-container" :visible.sync="open" :size="800" append-to-body>
      <template #title>
        <div style="font-size: 20px; text-align: center; color: #606266">
          {{ title }}
        </div>
      </template>
      <el-form class="form-container" ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="分销商编码" prop="distributorCode">
          <el-radio-group v-model="form.distributorCode">
            <el-radio v-for="dict in dict.type.channel_customer" :key="dict.value" :label="dict.value">{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分销商营销地址" prop="distributorUrl">
          <el-input v-model="form.distributorUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="分销商订单号" prop="externalOrderNo">
          <el-input v-model="form.externalOrderNo" placeholder="请输入分销商订单号" />
        </el-form-item>
        <el-form-item label="客户手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入客户手机号" />
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-input v-model="form.province" placeholder="请输入省份" />
        </el-form-item>
        <el-form-item label="城市名称" prop="cityName">
          <el-input v-model="form.cityName" placeholder="请输入城市名称" />
        </el-form-item>
        <el-form-item label="城市编码" prop="cityCode">
          <el-input v-model="form.cityCode" placeholder="请输入城市编码" />
        </el-form-item>
        <el-form-item label="短信验证码" prop="smsNum">
          <el-input v-model="form.smsNum" placeholder="请输入短信验证码" />
        </el-form-item>
        <el-form-item label="商品编码" prop="goodsCode">
          <el-input v-model="form.goodsCode" placeholder="请输入商品编码" />
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsCode">
          <el-input v-model="form.goodsName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="供应商编码" prop="supplierCode">
          <el-input v-model="form.supplierCode" placeholder="请输入供应商编码" />
        </el-form-item>
        <el-form-item label="供应商商品编码" prop="supplierGoodsCode">
          <el-input v-model="form.supplierGoodsCode" placeholder="请输入供应商商品编码" />
        </el-form-item>
        <el-form-item label="下单时间" prop="orderTime">
          <el-date-picker clearable v-model="form.orderTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择下单时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-radio-group v-model="form.orderStatus">
            <el-radio v-for="dict in dict.type.self_stock_status" :key="dict.value" :label="parseInt(dict.value)">{{
              dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否扣减" prop="isComfired">
          <el-select v-model="form.isDeduct" placeholder="请选择是否扣减">
            <el-option v-for="dict in dict.type.kaiguan" :key="dict.value" :label="dict.label"
                       :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="供应商订单查询消息" prop="syncOrderMessage">
          <el-input v-model="form.syncOrderMessage" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="链接参数" prop="urlParams">
          <el-input v-model="form.urlParams" type="textarea" placeholder="请输入链接参数"/>
        </el-form-item>
        <el-form-item label="供应商订单号" prop="supplierOrderNo">
          <el-input v-model="form.supplierOrderNo" placeholder="请输入供应商订单号"/>
        </el-form-item>
        <el-form-item label="是否退订" prop="isUnsubscribe">
          <el-select v-model="form.isUnsubscribe" placeholder="请选择是否退订">
            <el-option v-for="dict in dict.type.kaiguan" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"/>
          </el-select>
        </el-form-item>
        <el-form-item label="退订时间" prop="unsubscribeTime">
          <el-date-picker clearable v-model="form.unsubscribeTime" type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择退订时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否拉黑" prop="isBlacklist">
          <el-select v-model="form.isBlacklist" placeholder="请选择是否拉黑">
            <el-option v-for="dict in dict.type.kaiguan" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"/>
          </el-select>
        </el-form-item>
        <el-form-item label="触点" prop="platform">
          <el-input v-model="form.platform" type="textarea" placeholder="触点"/>
        </el-form-item>
        <el-form-item label="订单来源相关信息" prop="sourceData">
          <el-input v-model="form.sourceData" type="textarea" placeholder="订单来源相关信息"/>
        </el-form-item>
      </el-form>

      <div class="draw-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-drawer>

    <!-- 添加退订导入对话框 -->
    <el-dialog :title="upload3.title" :visible.sync="upload3.open" width="400px" append-to-body>
      <el-upload ref="upload3" :limit="1" accept=".xlsx, .xls"
        :headers="upload3.headers"
        :action="upload3.url"
        :disabled="upload3.isUploading"
        :file-list="fileList3"
        :on-change="handleChange3"
        :on-progress="handleFileUploadProgress3"
        :auto-upload="false"
        :on-success="handleFileSuccess3"
        :on-error="handleFileError3"
        drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xlsx格式文件。</span>
          <a target="_blank" :href="unsubscribeTemplate" type="primary" :underline="false"
            style="font-size:12px;vertical-align: baseline;">下载模板</a>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm3" :loading="upload3.loading">确 定</el-button>
        <el-button @click="upload3.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listStockorder,
  getStockorder,
  delStockorder,
  addStockorder,
  updateStockorder
} from '@/api/stockorder/stockorder'
import { getToken } from '@/utils/auth'

export default {
  name: 'Stockorder',
  dicts: ['self_stock_status', 'kaiguan', 'channel_customer', 'stock_supplier'],
  data() {
    return {
      // 遮罩层
      loading: true,
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
      // 权益包订单表格数据
      stockorderList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 50,
        orderNo: null,
        distributorCode: null,
        externalOrderNo: null,
        phone: null,
        province: null,
        cityName: null,
        dateRange: [],
        smsNum: null,
        goodsCode: null,
        goodsName: null,
        supplierCode: null,
        orderTime: null,
        orderStatus: null,
        createStartDate: null,
        createEndDate: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderNo: [
          { required: true, message: '订单号不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '客户手机号不能为空', trigger: 'blur' }
        ],
        goodsCode: [
          { required: true, message: '商品编码不能为空', trigger: 'blur' }
        ]
      },
      tableHeight: 400,
      upload3: {
        open: false,
        title: "",
        isUploading: false,
        loading: false,
        url: process.env.VUE_APP_BASE_API + "stockorder/stockorder/importUnsubscribe",
        headers: {
          Authorization: 'Bearer ' + getToken()
        }
      },
      fileList3: [],
      unsubscribeTemplate: '/unsubscribe_template.xlsx'
    }
  },
  created() {
    this.getList()
  },

  mounted() {
    this.calcHeight();
    window.onresize = () => {
      this.calcHeight();
    };
  },
  beforeDestroy() {
    window.onresize = null;
  },
  methods: {
    calcHeight() {
      this.tableHeight = document.documentElement.clientHeight - 440;

      console.log(this.tableHeight)
    },
    /** 查询权益包订单列表 */
    getList() {
      if (this.queryParams.dateRange?.length) {
        this.queryParams.createStartDate = this.queryParams.dateRange[0] + ' 00:00:00';
        this.queryParams.createEndDate = this.queryParams.dateRange[1] + ' 23:59:59';
      } else {
        this.queryParams.createStartDate = null;
        this.queryParams.createEndDate = null;
      }
      this.loading = true
      listStockorder(this.queryParams).then(response => {
        this.stockorderList = response.rows;
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        orderId: null,
        orderNo: null,
        distributorCode: null,
        distributorUrl: null,
        externalOrderNo: null,
        phone: null,
        province: null,
        cityName: null,
        cityCode: null,
        smsNum: null,
        goodsCode: null,
        supplierCode: null,
        supplierGoodsCode: null,
        orderTime: null,
        orderStatus: null,
        remark: null,
        syncOrderMessage: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        urlParams: null,
        supplierOrderNo: null,
        isUnsubscribe: 0,
        unsubscribeTime: null,
        isBlacklist: 0
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.orderId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加权益包订单'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const orderId = row.orderId || this.ids
      getStockorder(orderId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改权益包订单'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.orderId != null) {
            updateStockorder(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addStockorder(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const orderIds = row.orderId || this.ids
      this.$modal.confirm('是否确认删除权益包订单编号为"' + orderIds + '"的数据项？').then(function () {
        return delStockorder(orderIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('stockorder/stockorder/export', {
        ...this.queryParams
      }, `stockorder_${new Date().getTime()}.xlsx`)
    },
    formatGoodsName(cellValue) {
      if (cellValue.length > 6) {
        return '<span title="${cellValue}">${cellValue.slice(0, 6)}...</span>';
      }
      return cellValue;
    },
    // 退订导入按钮操作
    handleImportUnsubscribe() {
      this.upload3.title = "退订导入";
      this.upload3.open = true;
    },

    // 文件上传相关方法
    handleChange3(file, fileList) {
      this.fileList3 = fileList.slice(-1);
    },

    handleFileUploadProgress3(event, file, fileList) {
      this.upload3.isUploading = true;
    },

    handleFileSuccess3(response, file, fileList) {
      this.upload3.loading = false;
      this.upload3.open = false;

      let msg = response.message || '上传成功'
      if (response.data && Array.isArray(response.data) && response.data.length) {
        msg = response.data.map((v) => {
          return v.message + '<br/>'
        }).join(' ')
      }

      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + msg + "</div>",
        "导入结果", { dangerouslyUseHTMLString: true });

      this.getList();
    },

    handleFileError3() {
      this.upload3.isUploading = false;
      this.upload3.loading = false;
    },

    submitFileForm3() {
      if (!this.fileList3.length) {
        this.$message.warning('请选择要上传的文件');
        return;
      }

      this.upload3.loading = true;
      var formData = new FormData();
      formData.append('file', this.fileList3[0].raw);

      var xhr = new XMLHttpRequest();
      xhr.open('POST', this.upload3.url, true);
      xhr.setRequestHeader('Authorization', this.upload3.headers.Authorization);

      const t = this;
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            const response = JSON.parse(xhr.responseText);
            t.handleFileSuccess3(response);
          } else {
            t.handleFileError3();
          }
        }
      };
      xhr.send(formData);
    }
  }
}
</script>

<style lang="scss">
.drawer-container {
  padding: 10px 40px;
  display: flex;
}

// .el-drawer__body {
//   display: flex;
//   flex-direction: column;
//   overflow: hidden;
// }

.form-container {
  margin-bottom: 70px;
}

.draw-footer {
  height: 60px;
  text-align: right;
  position: absolute;
  /* position: fixed; */
  bottom: -8px;
  right: 60px;
  background: #fff;
  width: 100%;
  z-index: 9;
}
</style>

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px" size="small"
        class="ry_form">
        <el-form-item label="产品名称" prop="queryParameters.productName">
          <el-input style="width: 240px" v-model="queryParams.queryParameters.productName" placeholder="请输入产品名称" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="产品编码" prop="queryParameters.productCode">
          <el-input style="width: 240px" v-model="queryParams.queryParameters.productCode" placeholder="请输入产品编码" clearable size="small"
            @keyup.enter.native="handleQuery" />
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
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        </el-col>
      </el-row>

      <el-table :key="tableHeight" :height="tableHeight" v-loading="loading" :data="list">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="产品编码" align="center" prop="productCode" />
        <el-table-column label="产品名称" align="center" prop="productName" />
        <el-table-column label="产品类型" align="center" prop="productionType">
          <template slot-scope="scope">{{ returnNameData(prodTypeData, scope.row.productionType) }}</template>
        </el-table-column>
        <el-table-column label="供应商编码" align="center" prop="supplierCode" />
        <el-table-column label="供应商名称" align="center" prop="supplierName" />
        <el-table-column label="是否校验身份证" align="center" prop="checkIdentity">
          <template slot-scope="scope">{{ returnNameData(isprintData, scope.row.checkIdentity) }}</template>
        </el-table-column>
        <el-table-column label="是否选号" align="center" prop="isNumbered">
          <template slot-scope="scope">{{ returnNameData(isprintData, scope.row.isNumbered) }}</template>
        </el-table-column>
        <!-- <el-table-column label="号池名称" align="center" prop="poolId" /> -->
        <el-table-column label="状态" align="center" prop="des">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.productionStatus" :active-value="1" :inactive-value="0"
              @change="handleStatusChange(scope.row)" :active-color="activeColor" inactive-color="#ccc">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="des" />
        <el-table-column label="操作" align="left" width="200" class-name="small-padding" fixed="right">
          <template slot-scope="scope">
            <el-link :underline="false" type="primary" @click="handleConnectGoods(scope.row)">关联商品</el-link>
            <el-link :underline="false" type="primary" @click="handleCheck(scope.row, 0)">修改</el-link>
            <el-popconfirm title="确定删除？" @confirm="handleDelect(scope.row)">
              <el-link :underline="false" type="primary" slot="reference">删除</el-link>
            </el-popconfirm>
            <el-link :underline="false" type="primary" size="mini" @click="handleCheck(scope.row, 1)">详情</el-link>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />
    </div>
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain size="mini" @click="handleCancelBindMutil">批量解除</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border @selection-change="handleSelectionChange" v-loading="loading1">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="商品ID" align="center" prop="goodsId" />
        <el-table-column label="商品名称" align="center" prop="goodsName" />
        <el-table-column label="商品编码" align="center" prop="goodsCode" />
        <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleCancelBind({
              productCode: scope.row.productCode,
              goodsIds: [scope.row.goodsId]
            })">解除绑定</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-drawer custom-class="drawer-container" size="40%" :visible.sync="open2" append-to-body>
      <template #title>
        <div style="font-size: 20px; text-align: center; color: #606266">
          {{ form.productId ? '修改' : '新增' }}产品
        </div>
      </template>
      <el-form label-width="150px" :model="form" ref="form" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="form.productName" placeholder="请输入产品名称" :disabled="isReadonly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品类型" prop="productionType">
              <el-select clearable v-model="form.productionType" style="width: 100%" :disabled="isReadonly">
                <el-option v-for="(item, index) of prodTypeData" :key="index" :label="item.name" :value="item.value">{{
                  item.name }}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品编码" prop="productCode">
              <el-input v-model="form.productCode" placeholder="请输入产品编码" :readonly="isReadonly"
                :disabled="isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="外部供应商" prop="supplierName">
              <el-select v-model="form.supplierName" placeholder="请选择外部供应商" clearable size="small"
                @change="handleSupplier" style="width: 100%" :disabled="isReadonly">
                <el-option v-for="item in suppliersList" :key="item.supplierName" :label="item.supplierName"
                  :value="item.supplierName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-for="(item, i) in configField" :key="i">
            <el-form-item :label="item.filedValue" :prop="item.filedCode">
              <el-input :disabled="isReadonly" v-model="form.configParam[item.filedCode]"
                :placeholder="'请输入' + item.filedValue" :readonly="isReadonly"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
                        <el-form-item label="外部供应商商品ID" prop="externalProductId">
                            <el-input v-model="form.externalProductId" placeholder="请输入外部供应商商品ID"
                                :readonly="isReadonly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="外部供应商商品名称" prop="externalProductName">
                            <el-input v-model="form.externalProductName" placeholder="请输入外部供应商商品名称"
                                :readonly="isReadonly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="外部供应商商品编码" prop="externalProductCode">
                            <el-input v-model="form.externalProductCode" placeholder="请输入外部供应商商品编码"
                                :readonly="isReadonly"></el-input>
                        </el-form-item>
                    </el-col> -->
          <!-- <el-col :span="24">
                        <el-form-item label="身份证是否校验" prop="checkIdentity">
                            <el-radio-group v-model="form.checkIdentity">
                                <el-radio v-for="dict in isChangePhoneData" :key="dict.value" :label="dict.value">{{
                                    dict.name }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col> -->
          <el-col :span="24">
            <el-form-item label="是否选号" prop="isNumbered">
              <el-radio-group v-model="form.isNumbered" :disabled="isReadonly">
                <el-radio v-for="dict in isChangePhoneData" :key="dict.value" :label="dict.value">{{
                  dict.name }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.isNumbered == 1">
            <el-form-item label="号池" prop="poolName">
              <el-select v-model="form.poolName" placeholder="请选择" clearable :disabled="isReadonly">
                <el-option v-for="dict in poolList" :key="dict" :label="dict" :value="dict" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="productionStatus">
              <el-radio-group v-model="form.productionStatus" :disabled="isReadonly">
                <el-radio v-for="dict in productStatusData" :key="dict.value" :label="dict.value">{{
                  dict.name }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="des">
              <el-input type="textarea" v-model="form.des" placeholder="请输入备注" :disabled="isReadonly"></el-input>
            </el-form-item>
          </el-col>
          <div style="position:absolute;z-index: -99">
            <el-col :span="24">
              <el-form-item label="外部供应商ID" prop="supplierId">
                <el-input v-model="form.supplierId" placeholder="请输入外部供应商ID" :readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="外部供应商编码" prop="supplierCode">
                <el-input v-model="form.supplierCode" placeholder="请输入外部供应商编码" :readonly="true"></el-input>
              </el-form-item>
            </el-col>
          </div>

        </el-row>
      </el-form>
      <div class="draw-footer">
        <el-button :loading="formLoading" type="primary" @click="submitForm" v-if="!isReadonly">确 定</el-button>
        <el-button @click="cancel2">取 消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getList, add, edit, cancelBind, handleDelete, getInfo, getSuppliersList, getConfigField } from "@/api/product/index";
import * as goodsApi from '@/api/goods/index'
import { returnName } from "@/utils/index.js";
import { prodTypeData } from '@/utils/printData';
import * as poolApi from "@/api/numberPool/index";
const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''
export default {
  name: "PmsProduct",
  data() {
    return {
      open2: false,
      activeColor: storageSetting.theme || '#409EFF',
      // 遮罩层
      loading: true,
      loading1: false,
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
      // 产品信息表格数据
      list: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        queryParameters: {
          productName: '',
          productCode: ''
        }
      },
      prodTypeData,
      isprintData: [
        { name: "是", value: '1' },
        { name: "否", value: '0' },
      ],
      goodsList: [],
      title: '',
      open: false,
      open1: false,
      conenctData: {},
      productCode: '',
      tableHeight: 400,
      formLoading: false,
      form: {
        productionStatus: '1',
        isNumbered: '0',
        checkIdentity: '0',
        configParam: {}
      },
      rules: {
        productName: [{ required: true, message: "产品名称必填", trigger: "blur" }],
        productCode: [{ required: true, message: "产品编码必填", trigger: "change" }],
        prodType: [{ required: true, message: "产品类型必填", trigger: "blur" }],
      },
      productStatusData: [
        { name: "开启", value: '1' },
        { name: "关闭", value: '0' },
      ],
      isChangePhoneData: [
        { name: "是", value: '1' },
        { name: "否", value: '0' },
      ],
      isReadonly: false,
      isEdit: false,
      suppliersList: [],
      poolList: [],
      configField: []
    };
  },
  activated() {
    this.getList();
  },
  watch: {
    open2: {
      handler(val) {
        if (!val) {
          this.form = {
            productionStatus: '1',
            isNumbered: '0',
            checkIdentity: '0',
            configParam: {}
          };
          this.isEdit = false;
          this.isReadonly = false;
        }
      }
    }
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
      this.tableHeight = document.documentElement.clientHeight - 380;
    },
    handleDelect(row) {
      handleDelete(row.productId)
        .then((res) => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
    },
    handleStatusChange(row) {
      const { productionStatus } = row;
      const text = productionStatus == '1' ? '开启' : '关闭';
      this.$confirm(`确认${text}该产品?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        row.productionStatus = productionStatus == 1 ? 1 : 0;
        edit(row).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.loading = false;
          this.getList();
        }).catch(() => {
          this.loading = false;
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
        this.getList();
      });
    },
    returnNameData(list, target, value, name) {
      return returnName(list, target, value, name);
    },
    cancel() {
      this.open = false;
    },
    /** 查询产品信息列表 */
    getList() {
      this.loading = true;
      const { pageNum, pageSize } = this.queryParams;
      const pageReq = { pageNo: pageNum, pageSize: pageSize };
      const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined, ...pageReq };
      getList(query).then(response => {
        const { records, total } = response.data
        this.list = records;
        this.total = total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.goodsId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 解除绑定 */
    handleCancelBindMutil() {
      if (this.ids.length) {
        this.handleCancelBind({
          productCode: this.productCode,
          goodsIds: this.ids
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要解除绑定的商品'
        })
      }
    },
    handleCancelBind(data) {
      this.loading1 = true
      cancelBind(data)
        .then((res) => {
          this.loading1 = false;
          this.getConnectGoods(data)
        })
    },
    /** 新增按钮操作 */
    handleAdd() {
      // this.$router.push({ path: "/product/detail" });
      this.open2 = true;
    },
    /** 查看按钮操作 */
    handleCheck(row, target) {
      // getInfo({ id: row.id }).then((res) => {
      //   this.form = res;
      //   this.title = '查看产品信息'
      //   this.open = true;
      // })
      const id = row.productId;

      this.openAddForm(row, target)
    },
    /** 关联商品操作 */
    getConnectGoods(row, fn) {
      goodsApi.getList({
        pageNo: 1,
        pageSize: 10,
        queryParameters: {
          productCode: row.productCode
        }
      }).then((res) => {
        const { records, total } = res.data
        this.goodsList = records;
        fn && fn()
      })

    },
    handleConnectGoods(row) {
      this.getConnectGoods(row, () => {
        this.title = '关联商品查看';
        this.productCode = row.productCode;
        this.open = true;
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除产品信息编号为"' + ids + '"的数据项？').then(function () {
        return delPmsProduct(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    openAddForm(row, target) {
      this.open2 = true;
      const { productId } = row;
      this.isReadonly = target == 1 ? true : false;
      this.getSuppliersList();
      if (productId) {
        this.isEdit = true;
        this.queryDetail(productId)
      }
    },
    cancel2() {
      this.open2 = false;
    },
    getSuppliersList() {
      getSuppliersList({
        pageNo: 1,
        pageSize: 50
      })
        .then((res) => {
          this.suppliersList = res.data.records;
        })
      poolApi.getList().then(response => {
        this.poolList = response.data
      });
    },
    queryDetail(id) {
      this.formLoading = true;
      getInfo(id).then((res) => {
        res.data.checkIdentity = res.data.checkIdentity?.toString() || null;
        res.data.isNumbered = res.data.isNumbered?.toString() || null;
        res.data.productionStatus = res.data.productionStatus?.toString() || null;
        res.data.productionType = res.data.productionType ? res.data.productionType * 1 : null;
        this.getConfigFieldData(res.data.supplierCode);
        if (!res.data.configParam) {
          res.data.configParam = {}
        }
        this.form = res.data;
        this.formLoading = false;
      });
    },
    handleSupplier(e) {
      const target = this.suppliersList.filter(v => v.supplierName == e)?.[0];
      this.form.supplierId = target?.supplierId;
      this.form.supplierCode = target?.supplierCode;
      this.getConfigFieldData(target?.supplierCode);
    },
    getConfigFieldData(supplierCode) {
      if (!supplierCode) return;
      // 获取其他展示项
      getConfigField(supplierCode).then(res => {
        const { data } = res;
        this.configField = data
      })
    },
    submitForm() {
      this.$refs["form"].validate((valid, a) => {
        if (valid) {
          this.formLoading = true;
          if (this.form.productId) {
            edit(this.form).then((response) => {
              this.formLoading = false;
              this.cancel2();
              this.getList();
            })
              .catch(() => {
                this.formLoading = false;
              });
          } else {
            add(this.form).then((response) => {
              this.formLoading = false;
              this.cancel2();
              this.getList();
            })
              .catch(() => {
                this.formLoading = false;
              });

          }
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.cell {

  .el-button+span,
  span+span {
    margin-left: 10px;
  }
}

::v-deep .drawer-container {
  padding: 10px 40px;
  display: flex;

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
}

::v-deep .el-drawer__body {
  overflow: unset;
  overflow-y: auto;
}
</style>

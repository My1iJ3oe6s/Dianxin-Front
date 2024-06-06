<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="80px" size="medium"
        class="ry_form">
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="queryParams.queryParameters.productName" placeholder="请输入产品名称" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="产品编码" prop="productCode">
          <el-input v-model="queryParams.queryParameters.productCode" placeholder="请输入产品编码" clearable size="small"
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

      <el-table v-loading="loading" border :data="list">
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
        <el-table-column label="号池名称" align="center" prop="poolId" />
        <el-table-column label="状态" align="center" prop="des">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.productionStatus" :active-value="1" :inactive-value="0"
              @change="handleStatusChange(scope.row)" :active-color="activeColor" inactive-color="#ccc">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="des" />
        <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleCheck(scope.row, 1)">详情</el-button>
            <el-button size="mini" type="text" @click="handleCheck(scope.row, 0)">修改</el-button>
            <el-button size="mini" type="text" @click="handleConnectGoods(scope.row)">关联商品</el-button>
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
  </div>
</template>

<script>
import { getList, add, edit, cancelBind } from "@/api/product/index";
import * as goodsApi from '@/api/goods/index'
import { returnName } from "@/utils/index.js";
import { prodTypeData } from '@/utils/printData';
const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''
export default {
  name: "PmsProduct",
  data() {
    return {
      activeColor: storageSetting.theme || '#FF8C00',
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
    };
  },
  activated() {
    this.getList();
  },
  methods: {
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
      const pageReq = { pageNo: pageNum , pageSize: pageSize };
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
      this.$router.push({ path: "/product/detail" });
    },
    /** 查看按钮操作 */
    handleCheck(row, target) {
      // getInfo({ id: row.id }).then((res) => {
      //   this.form = res;
      //   this.title = '查看产品信息'
      //   this.open = true;
      // })
      const id = row.productId;
      this.$router.push({ path: "/product/detail", query: { id, target } });
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
  }
};
</script>

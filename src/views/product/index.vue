<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium"
      class="ry_form">
      <el-form-item label="产品名称" prop="prodName">
        <el-input v-model="queryParams.queryParameters.prodName" placeholder="请输入产品名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="产品编码" prop="prodSkuNbr">
        <el-input v-model="queryParams.queryParameters.prodSkuNbr" placeholder="请输入产品编码" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" border :data="list" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="产品id" align="center" prop="id" />
      <el-table-column label="产品编码" align="center" prop="prodSkuNbr" />
      <el-table-column label="产品名称" align="center" prop="prodName" />
      <el-table-column label="外部产品编码" align="center" prop="externalProdSkuNbr" />
      <el-table-column label="外部产品id" align="center" prop="externalProdID" />
      <el-table-column label="外部产品名称" align="center" prop="externalProdName" />
      <el-table-column label="产品类型" align="center" prop="prodType">
        <template slot-scope="scope">{{ returnNameData(prodTypeData, scope.row.prodType) }}</template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="productStatus">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.productStatus" active-value="1" inactive-value="0"
            @change="handleStatusChange(scope.row)" disabled active-color="#13ce66" inactive-color="#ccc">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleCheck(scope.row,1)">详情</el-button>
          <el-button size="mini" type="text" @click="handleCheck(scope.row,0)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
import { getList, add } from "@/api/product/index";
import { returnName } from "@/utils/index.js";
import { prodTypeData } from '@/utils/printData';

export default {
  name: "PmsProduct",
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
      // 产品信息表格数据
      list: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        queryParameters: {
          prodName: '',
          prodSkuNbr:''
        }
      },
      prodTypeData
    };
  },
  activated() {
    this.getList();
  },
  methods: {
    handleStatusChange(row){},
    returnNameData(list, target, value, name) {
      return returnName(list, target, value, name);
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          add(this.form)
            .then((response) => {
              this.open = false;
              this.getList();
            })
        }
      });
    },
    cancel() {
      this.open = false;
    },
    /** 查询产品信息列表 */
    getList() {
      this.loading = true;
      const { pageNum, pageSize } = this.queryParams;
      const pageReq = { pageNo: pageNum - 1, pageSize: pageSize };
      const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined, ...pageReq };
      getList(query).then(response => {
        const { list, total } = response
        this.list = list;
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({ path: "/product/detail" });
    },
    /** 查看按钮操作 */
    handleCheck(row,target) {
      // getInfo({ id: row.id }).then((res) => {
      //   this.form = res;
      //   this.title = '查看产品信息'
      //   this.open = true;
      // })
      const id = row.id;
      this.$router.push({ path: "/product/detail", query: { id ,target} });
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

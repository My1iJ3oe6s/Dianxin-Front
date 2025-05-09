<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="分销商编码" prop="distributorCode">
        <el-input
          v-model="queryParams.distributorCode"
          placeholder="请输入分销商编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分销商名称" prop="distributorName">
        <el-input
          v-model="queryParams.distributorName"
          placeholder="请输入分销商名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['distributor:distributor:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['distributor:distributor:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['distributor:distributor:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['distributor:distributor:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="distributorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="分销商名称" align="center" prop="distributorName" />
      <el-table-column label="分销商编码" align="center" prop="distributorCode" />
      <el-table-column label="订单总数(截止昨日)" align="center" prop="totalOrder" />
      <el-table-column label="退订订单总量(截止昨日)" align="center" prop="tuidingOrder" />
      <el-table-column label="剩余费用(截止昨日)" align="center" prop="remainingAmount" />
      <el-table-column label="充值总金额" align="center" prop="totalAmount" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['distributor:distributor:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['distributor:distributor:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改分销商对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="分销商编码" prop="distributorCode">
          <el-input v-model="form.distributorCode" placeholder="请输入分销商编码" />
        </el-form-item>
        <el-form-item label="分销商名称" prop="distributorName">
          <el-input v-model="form.distributorName" placeholder="请输入分销商名称" />
        </el-form-item>
        <el-form-item label="每单单价" prop="unitPrice">
          <el-input v-model="form.unitPrice" placeholder="请输入每单单价" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>

        <el-form-item label="订单总数" prop="totalOrder">
          <el-input v-model="form.totalOrder" placeholder="请输入订单总数" readonly />
        </el-form-item>
        <el-form-item label="退订订单总量" prop="tuidingOrder">
          <el-input v-model="form.tuidingOrder" placeholder="请输入退订订单总量" readonly />
        </el-form-item>
        <el-form-item label="剩余费用" prop="remainingAmount">
          <el-input v-model="form.remainingAmount" placeholder="请输入剩余费用" readonly />
        </el-form-item>
        <el-form-item label="充值总金额" prop="totalAmount">
          <el-input v-model="form.totalAmount" placeholder="请输入充值总金额" readonly />
        </el-form-item>
        <el-divider content-position="center">分销商充值记录信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddSelfDistributorRecharge">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteSelfDistributorRecharge">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="selfDistributorRechargeList" :row-class-name="rowSelfDistributorRechargeIndex" @selection-change="handleSelfDistributorRechargeSelectionChange" ref="selfDistributorRecharge">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="充值金额" prop="rechargeAmount" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.rechargeAmount" placeholder="请输入充值金额" />
            </template>
          </el-table-column>
          <el-table-column label="充值时间" prop="rechargeTime" width="240">
            <template slot-scope="scope">
              <el-date-picker clearable v-model="scope.row.rechargeTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择充值时间" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDistributor, getDistributor, delDistributor, addDistributor, updateDistributor } from "@/api/distributor/distributor";

export default {
  name: "Distributor",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedSelfDistributorRecharge: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 分销商表格数据
      distributorList: [],
      // 分销商充值记录表格数据
      selfDistributorRechargeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        distributorCode: null,
        distributorName: null,
        totalOrder: null,
        tuidingOrder: null,
        remainingAmount: null,
        totalAmount: null,
        unitPrice: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        distributorCode: [
          { required: true, message: "分销商编码不能为空", trigger: "blur" }
        ],
        distributorName: [
          { required: true, message: "分销商名称不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询分销商列表 */
    getList() {
      this.loading = true;
      listDistributor(this.queryParams).then(response => {
        this.distributorList = response.rows;
        this.total = response.total;
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
        distributorId: null,
        distributorCode: null,
        distributorName: null,
        totalOrder: null,
        tuidingOrder: null,
        remainingAmount: null,
        totalAmount: null,
        unitPrice: null,
        status: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.selfDistributorRechargeList = [];
      this.resetForm("form");
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
      this.ids = selection.map(item => item.distributorId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加分销商";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const distributorId = row.distributorId || this.ids
      getDistributor(distributorId).then(response => {
        this.form = response.data;
        this.selfDistributorRechargeList = response.data.selfDistributorRechargeList;
        this.open = true;
        this.title = "修改分销商";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.selfDistributorRechargeList = this.selfDistributorRechargeList;
          if (this.form.distributorId != null) {
            updateDistributor(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDistributor(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const distributorIds = row.distributorId || this.ids;
      this.$modal.confirm('是否确认删除分销商编号为"' + distributorIds + '"的数据项？').then(function() {
        return delDistributor(distributorIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 分销商充值记录序号 */
    rowSelfDistributorRechargeIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 分销商充值记录添加按钮操作 */
    handleAddSelfDistributorRecharge() {
      let obj = {};
      obj.rechargeAmount = "";
      obj.rechargeTime = "";
      obj.img = "";
      obj.remark = "";
      this.selfDistributorRechargeList.push(obj);
    },
    /** 分销商充值记录删除按钮操作 */
    handleDeleteSelfDistributorRecharge() {
      if (this.checkedSelfDistributorRecharge.length == 0) {
        this.$modal.msgError("请先选择要删除的分销商充值记录数据");
      } else {
        const selfDistributorRechargeList = this.selfDistributorRechargeList;
        const checkedSelfDistributorRecharge = this.checkedSelfDistributorRecharge;
        this.selfDistributorRechargeList = selfDistributorRechargeList.filter(function(item) {
          return checkedSelfDistributorRecharge.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleSelfDistributorRechargeSelectionChange(selection) {
      this.checkedSelfDistributorRecharge = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('distributor/distributor/export', {
        ...this.queryParams
      }, `distributor_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

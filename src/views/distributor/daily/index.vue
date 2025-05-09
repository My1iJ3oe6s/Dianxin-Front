<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="费用日期" prop="consumptionDate">
        <el-date-picker clearable
          v-model="queryParams.consumptionDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择费用日期">
        </el-date-picker>
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
          v-hasPermi="['distributor:daily:add']"
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
          v-hasPermi="['distributor:daily:edit']"
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
          v-hasPermi="['distributor:daily:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['distributor:daily:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dailyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="费用日期" align="center" prop="consumptionDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.consumptionDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分销商名称" align="center" prop="distributorName" />
      <el-table-column label="分销商编码" align="center" prop="distributorCode" />

      <el-table-column label="当日订单" align="center" prop="orderCount" />
      <el-table-column label="消耗金额" align="center" prop="consumptionAmount" />
      <el-table-column label="账户余额" align="center" prop="remainingAmount" />
      <el-table-column label="当前剩余余额" align="center" prop="currentAmount" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['distributor:daily:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['distributor:daily:remove']"
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

    <!-- 添加或修改分销商订单消耗明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分销商ID" prop="distributorId" >
          <el-input v-model="form.distributorId" placeholder="请输入分销商ID" readonly/>
        </el-form-item>
        <el-form-item label="分销商编码" prop="distributorCode">
          <el-input v-model="form.distributorCode" type="textarea" placeholder="请输入内容" readonly/>
        </el-form-item>
        <el-form-item label="分销商名称" prop="distributorName">
          <el-input v-model="form.distributorName" type="textarea" placeholder="请输入内容" readonly/>
        </el-form-item>
        <el-form-item label="费用日期" prop="consumptionDate">
          <el-date-picker clearable
            v-model="form.consumptionDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择费用日期" readonly>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="当日订单" prop="orderCount">
          <el-input v-model="form.orderCount" placeholder="请输入当日订单" readonly/>
        </el-form-item>
        <el-form-item label="消耗金额" prop="consumptionAmount">
          <el-input v-model="form.consumptionAmount" placeholder="请输入消耗金额" readonly/>
        </el-form-item>
        <el-form-item label="账户余额" prop="remainingAmount">
          <el-input v-model="form.remainingAmount" placeholder="请输入账户余额" readonly/>
        </el-form-item>
        <el-form-item label="当前剩余余额" prop="currentAmount">
          <el-input v-model="form.currentAmount" placeholder="请输入当前剩余余额" readonly/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDaily, getDaily, delDaily, addDaily, updateDaily } from "@/api/distributor/daily";

export default {
  name: "Daily",
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
      // 分销商订单消耗明细表格数据
      dailyList: [],
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
        consumptionDate: null,
        orderCount: null,
        consumptionAmount: null,
        remainingAmount: null,
        currentAmount: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        distributorId: [
          { required: true, message: "分销商ID不能为空", trigger: "blur" }
        ],
        consumptionDate: [
          { required: true, message: "费用日期不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询分销商订单消耗明细列表 */
    getList() {
      this.loading = true;
      listDaily(this.queryParams).then(response => {
        this.dailyList = response.rows;
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
        consumptionId: null,
        distributorId: null,
        distributorCode: null,
        distributorName: null,
        consumptionDate: null,
        orderCount: null,
        consumptionAmount: null,
        remainingAmount: null,
        currentAmount: null,
        createTime: null,
        updateTime: null
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.consumptionId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加分销商订单消耗明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const consumptionId = row.consumptionId || this.ids
      getDaily(consumptionId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改分销商订单消耗明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.consumptionId != null) {
            updateDaily(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDaily(this.form).then(response => {
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
      const consumptionIds = row.consumptionId || this.ids;
      this.$modal.confirm('是否确认删除分销商订单消耗明细编号为"' + consumptionIds + '"的数据项？').then(function() {
        return delDaily(consumptionIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('distributor/daily/export', {
        ...this.queryParams
      }, `daily_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

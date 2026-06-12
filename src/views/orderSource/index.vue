<template>
  <div class="app-container">
    <el-form
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="120px"
    >
      <el-form-item label="权益分销商编码" prop="sourceCode">
        <el-input
          v-model="queryParams.sourceCode"
          placeholder="请输入权益分销商编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权益分销商名称" prop="sourceName">
        <el-input
          v-model="queryParams.sourceName"
          placeholder="请输入权益分销商名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="App Key" prop="appKey">
        <el-input
          v-model="queryParams.appKey"
          placeholder="请输入 App Key"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否营销订单" prop="isMarketingOrder">
        <el-select v-model="queryParams.isMarketingOrder" placeholder="请选择" clearable>
          <el-option
            v-for="item in yesNoOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable>
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
          v-hasPermi="['business:orderSource:add']"
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
          v-hasPermi="['business:orderSource:edit']"
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
          v-hasPermi="['business:orderSource:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:orderSource:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderSourceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="权益分销商名称" align="center" prop="sourceName" min-width="160" />
      <el-table-column label="权益分销商编码" align="center" prop="sourceCode" min-width="150" />
      <el-table-column label="App Key" align="center" prop="appKey" min-width="180" show-overflow-tooltip />
      <el-table-column label="是否营销订单" align="center" prop="isMarketingOrder" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isMarketingOrder === '1' ? 'success' : 'info'" size="mini">
            {{ formatYesNo(scope.row.isMarketingOrder) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="扣减比例" align="center" prop="deductionRate" width="120" />
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'" size="mini">
            {{ formatStatus(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" min-width="180" show-overflow-tooltip />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="160">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:orderSource:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:orderSource:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="权益分销商编码" prop="sourceCode">
              <el-input v-model="form.sourceCode" placeholder="请输入权益分销商编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权益分销商名称" prop="sourceName">
              <el-input v-model="form.sourceName" placeholder="请输入权益分销商名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="App Key" prop="appKey">
              <el-input v-model="form.appKey" placeholder="请输入 App Key" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="App Secret" prop="appSecret">
              <el-input v-model="form.appSecret" placeholder="请输入 App Secret" show-password />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="扣减比例(0-1)" prop="deductionRate">
              <el-input-number
                v-model="form.deductionRate"
                :min="0"
                :max="1"
                :step="0.01"
                :precision="4"
                controls-position="right"
                style="width: 100%"
                placeholder="请输入扣减比例"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否营销订单" prop="isMarketingOrder">
              <el-radio-group v-model="form.isMarketingOrder">
                <el-radio v-for="item in yesNoOptions" :key="item.value" :label="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="item in statusOptions" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="4" placeholder="请输入备注" />
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
import {
  listOrderSource,
  getOrderSource,
  delOrderSource,
  addOrderSource,
  updateOrderSource
} from "@/api/orderSource";

export default {
  name: "OrderSource",
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      orderSourceList: [],
      title: "",
      open: false,
      yesNoOptions: [
        { label: "是", value: "1" },
        { label: "否", value: "0" }
      ],
      statusOptions: [
        { label: "正常", value: "0" },
        { label: "停用", value: "1" }
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sourceCode: null,
        sourceName: null,
        appKey: null,
        isMarketingOrder: null,
        status: null
      },
      form: {},
      rules: {
        sourceCode: [
          { required: true, message: "权益分销商编码不能为空", trigger: "blur" }
        ],
        sourceName: [
          { required: true, message: "权益分销商名称不能为空", trigger: "blur" }
        ],
        appKey: [
          { required: true, message: "App Key 不能为空", trigger: "blur" }
        ],
        appSecret: [
          { required: true, message: "App Secret 不能为空", trigger: "blur" }
        ],
        deductionRate: [
          { required: true, message: "扣减比例不能为空", trigger: "change" }
        ],
        isMarketingOrder: [
          { required: true, message: "请选择是否营销订单", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择状态", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询权益分销商列表 */
    getList() {
      this.loading = true;
      listOrderSource(this.queryParams).then(response => {
        this.orderSourceList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(() => {
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
        id: null,
        sourceCode: null,
        sourceName: null,
        appKey: null,
        appSecret: null,
        deductionRate: 0,
        isMarketingOrder: "0",
        status: "0",
        remark: null
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
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加权益分销商";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids[0];
      getOrderSource(id).then(response => {
        this.form = Object.assign({}, this.form, response.data);
        this.open = true;
        this.title = "修改权益分销商";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const request = this.form.id != null ? updateOrderSource(this.form) : addOrderSource(this.form);
          request.then(() => {
            this.$modal.msgSuccess(this.form.id != null ? "修改成功" : "新增成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids.join(",");
      this.$modal.confirm('是否确认删除权益分销商编号为"' + ids + '"的数据项？').then(() => {
        return delOrderSource(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('business/orderSource/export', {
        ...this.queryParams
      }, `order_source_${new Date().getTime()}.xlsx`);
    },
    formatYesNo(value) {
      const matched = this.yesNoOptions.find(item => item.value === value);
      return matched ? matched.label : "-";
    },
    formatStatus(value) {
      const matched = this.statusOptions.find(item => item.value === value);
      return matched ? matched.label : "-";
    }
  }
};
</script>

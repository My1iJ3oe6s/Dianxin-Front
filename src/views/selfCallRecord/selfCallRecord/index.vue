<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input
            v-model="queryParams.phoneNumber"
            placeholder="请输入手机号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-input
            v-model="queryParams.source"
            placeholder="请输入手机号来源"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="外呼订单号" prop="callOrderNo">
          <el-input
            v-model="queryParams.callOrderNo"
            placeholder="请输入外呼订单号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="外呼时间" prop="callTime">
          <el-date-picker clearable
            v-model="queryParams.callTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择外呼时间">
          </el-date-picker>
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
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['selfCallRecord:selfCallRecord:add']"
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
            v-hasPermi="['selfCallRecord:selfCallRecord:edit']"
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
            v-hasPermi="['selfCallRecord:selfCallRecord:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['selfCallRecord:selfCallRecord:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="selfCallRecordList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="手机号" align="center" prop="phoneNumber" />
        <el-table-column label="来源" align="center" prop="source" />
        <el-table-column label="外呼订单号" align="center" prop="callOrderNo" />

        <el-table-column label="外呼人员" align="center" prop="callUser" />
        <el-table-column label="外呼时间" align="center" prop="callTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.callTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" >
          <template slot-scope="scope">
            <dict-tag :options="dict.type.call_record_status" :value="scope.row.status" />
          </template>
        </el-table-column>

        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['selfCallRecord:selfCallRecord:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['selfCallRecord:selfCallRecord:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改外呼记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-input v-model="form.source" placeholder="请输入手机号来源" />
        </el-form-item>
        <el-form-item label="外呼订单号" prop="callOrderNo">
          <el-input v-model="form.callOrderNo" placeholder="请输入外呼订单号" />
        </el-form-item>
        <el-form-item label="外呼人员" prop="callUser">
          <el-input v-model="form.callUser" placeholder="请输入外呼人员" />
        </el-form-item>
        <el-form-item label="外呼时间" prop="callTime">
          <el-date-picker clearable
            v-model="form.callTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择外呼时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { listSelfCallRecord, getSelfCallRecord, delSelfCallRecord, addSelfCallRecord, updateSelfCallRecord } from "@/api/selfCallRecord/selfCallRecord";

export default {
  name: "SelfCallRecord",
  dicts: ['product_type', 'call_record_status', 'kaiguan', 'comfire_img_type', 'stock_supplier', 'stock_goods_mode'],
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
      // 外呼记录表格数据
      selfCallRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        phoneNumber: null,
        source: null,
        callOrderNo: null,
        status: null,
        callUser: null,
        callTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        phoneNumber: [
          { required: true, message: "手机号不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态(NEW:新建,OCCUPY:占用中,CALLED:已外呼)不能为空", trigger: "change" }
        ],
        delFlag: [
          { required: true, message: "删除标志(0:正常,1:已删除)不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询外呼记录列表 */
    getList() {
      this.loading = true;
      listSelfCallRecord(this.queryParams).then(response => {
        this.selfCallRecordList = response.rows;
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
        id: null,
        phoneNumber: null,
        source: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        callOrderNo: null,
        status: null,
        callUser: null,
        callTime: null,
        delFlag: null,
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加外呼记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSelfCallRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改外呼记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSelfCallRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSelfCallRecord(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除外呼记录编号为"' + ids + '"的数据项？').then(function() {
        return delSelfCallRecord(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('selfCallRecord/selfCallRecord/export', {
        ...this.queryParams
      }, `selfCallRecord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

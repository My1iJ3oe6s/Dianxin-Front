<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
      label-width="90px"
    >
      <el-form-item label="触点编码" prop="touchCode">
        <el-input
          v-model="queryParams.touchCode"
          placeholder="请输入触点编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="触点名称" prop="touchName">
        <el-input
          v-model="queryParams.touchName"
          placeholder="请输入触点名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
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
          v-hasPermi="['business:touchPoint:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['business:touchPoint:edit']"
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['business:touchPoint:remove']"
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['business:touchPoint:export']"
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="touchPointList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="触点编码" align="center" prop="touchCode" min-width="160" />
      <el-table-column label="触点名称" align="center" prop="touchName" min-width="160" />
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            v-hasPermi="['business:touchPoint:changeStatus']"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          />
          <el-tag
            v-if="!$auth.hasPermi('business:touchPoint:changeStatus')"
            :type="scope.row.status === '0' ? 'success' : 'danger'"
            size="mini"
          >
            {{ formatStatus(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" min-width="200" show-overflow-tooltip />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="160">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['business:touchPoint:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['business:touchPoint:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
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

    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="触点编码" prop="touchCode">
          <el-input v-model="form.touchCode" placeholder="请输入触点编码" maxlength="64" />
        </el-form-item>
        <el-form-item label="触点名称" prop="touchName">
          <el-input v-model="form.touchName" placeholder="请输入触点名称" maxlength="64" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="item in statusOptions" :key="item.value" :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="4" placeholder="请输入备注" maxlength="255" show-word-limit />
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
  listTouchPoint,
  getTouchPoint,
  delTouchPoint,
  addTouchPoint,
  updateTouchPoint,
  changeTouchPointStatus
} from '@/api/touchpoint'

export default {
  name: 'TouchPoint',
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      touchPointList: [],
      title: '',
      open: false,
      statusOptions: [
        { label: '正常', value: '0' },
        { label: '停用', value: '1' }
      ],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        touchCode: null,
        touchName: null,
        status: null
      },
      form: {},
      rules: {
        touchCode: [
          { required: true, message: '触点编码不能为空', trigger: 'blur' }
        ],
        touchName: [
          { required: true, message: '触点名称不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询触点列表 */
    getList() {
      this.loading = true
      listTouchPoint(this.queryParams).then(response => {
        this.touchPointList = response.rows
        this.total = response.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        touchCode: null,
        touchName: null,
        status: '0',
        remark: null
      }
      this.resetForm('form')
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加触点'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids[0]
      getTouchPoint(id).then(response => {
        this.form = Object.assign({}, this.form, response.data)
        this.open = true
        this.title = '修改触点'
      })
    },
    // 状态修改
    handleStatusChange(row) {
      const text = row.status === '0' ? '启用' : '停用'
      this.$modal.confirm('确认要"' + text + '""' + row.touchName + '"触点吗？').then(() => {
        return changeTouchPointStatus(row.id, row.status)
      }).then(() => {
        this.$modal.msgSuccess(text + '成功')
      }).catch(() => {
        row.status = row.status === '0' ? '1' : '0'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const request = this.form.id != null ? updateTouchPoint(this.form) : addTouchPoint(this.form)
          request.then(() => {
            this.$modal.msgSuccess(this.form.id != null ? '修改成功' : '新增成功')
            this.open = false
            this.getList()
          })
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids.join(',')
      this.$modal.confirm('是否确认删除触点编号为"' + ids + '"的数据项？').then(() => {
        return delTouchPoint(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('business/touchPoint/export', {
        ...this.queryParams
      }, `touch_point_${new Date().getTime()}.xlsx`)
    },
    formatStatus(value) {
      const matched = this.statusOptions.find(item => item.value === value)
      return matched ? matched.label : '-'
    }
  }
}
</script>

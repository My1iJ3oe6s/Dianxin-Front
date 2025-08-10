<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="手机号" prop="phoneNumber">
        <el-input
          v-model="queryParams.phoneNumber"
          placeholder="请输入被拉黑的手机号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="拉黑时长" prop="blockDurationMonths">
        <el-input
          v-model="queryParams.blockDurationMonths"
          placeholder="请输入拉黑多少个月"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="解禁时间">
        <el-date-picker
          v-model="daterangeUnblockTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          v-hasPermi="['blacklist:blacklist:add']"
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
          v-hasPermi="['blacklist:blacklist:edit']"
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
          v-hasPermi="['blacklist:blacklist:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['blacklist:blacklist:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-upload2" size="mini" @click="handleImportUnsubscribe">导入</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="blacklistList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="手机号" align="center" prop="phoneNumber" />
      <el-table-column label="拉黑时长（月）" align="center" prop="blockDurationMonths" />
      <el-table-column label="拉黑时间" align="center" prop="blockTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.blockTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="解禁时间" align="center" prop="unblockTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.unblockTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拉黑原因" align="center" prop="reason" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['blacklist:blacklist:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['blacklist:blacklist:remove']"
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

    <!-- 添加或修改手机号黑名单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入被拉黑的手机号" />
        </el-form-item>
        <el-form-item label="拉黑时长" prop="blockDurationMonths">
          <el-input v-model="form.blockDurationMonths" placeholder="请输入拉黑时长（月）" />
        </el-form-item>
        <el-form-item label="拉黑原因" prop="reason">
          <el-input v-model="form.reason" placeholder="请输入拉黑原因" />
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
import { listBlacklist, getBlacklist, delBlacklist, addBlacklist, updateBlacklist } from "@/api/blacklist/blacklist";
import { getToken } from '@/utils/auth'

export default {
  name: "Blacklist",
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
      // 手机号黑名单表格数据
      blacklistList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态：1-有效 0-无效时间范围
      daterangeBlockTime: [],
      // 状态：1-有效 0-无效时间范围
      daterangeUnblockTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        phoneNumber: null,
        blockDurationMonths: null,
        blockTime: null,
        unblockTime: null,
        reason: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        phoneNumber: [
          { required: true, message: "被拉黑的手机号不能为空", trigger: "blur" }
        ],
        blockDurationMonths: [
          { required: true, message: "拉黑时长不能为空", trigger: "blur" }
        ],
        blockTime: [
          { required: true, message: "拉黑时间不能为空", trigger: "blur" }
        ],
        unblockTime: [
          { required: true, message: "解禁时间不能为空", trigger: "blur" }
        ],
      },
      unsubscribeTemplate: '/black_template.xlsx',
      upload3: {
        open: false,
        title: "",
        isUploading: false,
        loading: false,
        url: process.env.VUE_APP_BASE_API + "blacklist/blacklist/import",
        headers: {
          Authorization: 'Bearer ' + getToken()
        }
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询手机号黑名单列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeBlockTime && '' != this.daterangeBlockTime) {
        this.queryParams.params["beginBlockTime"] = this.daterangeBlockTime[0];
        this.queryParams.params["endBlockTime"] = this.daterangeBlockTime[1];
      }
      if (null != this.daterangeUnblockTime && '' != this.daterangeUnblockTime) {
        this.queryParams.params["beginUnblockTime"] = this.daterangeUnblockTime[0];
        this.queryParams.params["endUnblockTime"] = this.daterangeUnblockTime[1];
      }
      listBlacklist(this.queryParams).then(response => {
        this.blacklistList = response.rows;
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
        blockDurationMonths: null,
        blockTime: null,
        unblockTime: null,
        operator: null,
        reason: null,
        status: null,
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
      this.daterangeBlockTime = [];
      this.daterangeUnblockTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleImportUnsubscribe() {
      this.upload3.title = "退订导入";
      this.upload3.open = true;
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
      this.title = "添加手机号黑名单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBlacklist(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改手机号黑名单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBlacklist(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBlacklist(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除手机号黑名单编号为"' + ids + '"的数据项？').then(function() {
        return delBlacklist(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('blacklist/blacklist/export', {
        ...this.queryParams
      }, `blacklist_${new Date().getTime()}.xlsx`)
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
};

</script>

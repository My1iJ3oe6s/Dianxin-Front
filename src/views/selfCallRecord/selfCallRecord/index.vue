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
        <el-form-item label="来源订单" prop="sourceOrderNo">
          <el-input
            v-model="queryParams.sourceOrderNo"
            placeholder="请输入来源订单号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="外呼产品" prop="callProduct">
          <el-input
            v-model="queryParams.callProduct"
            placeholder="请输入外呼产品"
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
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="queryParams.createTime"
            type="datetime"
            placeholder="请选择创建时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="外呼时间" prop="callTime">
          <el-date-picker
            v-model="queryParams.callTime"
            type="datetime"
            placeholder="请选择外呼时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 200px"
          />
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
        <el-col :span="1.5">
          <el-button
            type="info"
            plain
            icon="el-icon-upload2"
            size="mini"
            @click="handleImport"
            v-hasPermi="['selfCallRecord:selfCallRecord:import']"
          >导入</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-shopping-bag"
            size="mini"
            :disabled="multiple"
            @click="handleSetProduct"
            v-hasPermi="['selfCallRecord:selfCallRecord:setProduct']"
          >设置外呼产品</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-user"
            size="mini"
            :disabled="multiple"
            @click="handleAssignUser"
            v-hasPermi="['selfCallRecord:selfCallRecord:assignUser']"
          >分配外呼人员</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="selfCallRecordList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="手机号" align="center" prop="phoneNumber" />
        <el-table-column label="来源" align="center" prop="source" />
        <el-table-column label="来源订单" align="center" prop="sourceOrderNo" />
        <el-table-column label="来源订单备注" align="center" prop="sourceOrderInfo" />
        <el-table-column label="外呼产品" align="center" prop="callProduct" />
        <el-table-column label="外呼人员" align="center" prop="callUser" />
        <el-table-column label="外呼订单号" align="center" prop="callOrderNo" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="外呼时间" align="center" prop="callTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.callTime) }}</span>
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
            <el-button
              v-if="scope.row.callProduct && scope.row.callUser"
              size="mini"
              type="primary"
              icon="el-icon-phone"
              @click="handleDial(scope.row)"
              v-hasPermi="['selfCallRecord:selfCallRecord:dial']"
            >一键拨号</el-button>
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
        <el-form-item label="来源订单" prop="sourceOrderNo">
          <el-input v-model="form.sourceOrderNo" placeholder="请输入来源订单号" />
        </el-form-item>
        <el-form-item label="来源订单备注" prop="sourceOrderInfo">
          <el-input v-model="form.sourceOrderInfo" placeholder="请输入来源订单备注" />
        </el-form-item>
        <el-form-item label="外呼产品" prop="callProduct">
          <el-input v-model="form.callProduct" placeholder="请输入外呼产品" />
        </el-form-item>
        <el-form-item label="外呼人员" prop="callUser">
          <el-input v-model="form.callUser" placeholder="请输入外呼人员" />
        </el-form-item>
        <el-form-item label="外呼订单号" prop="callOrderNo">
          <el-input v-model="form.callOrderNo" placeholder="请输入外呼订单号" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="form.createTime"
            type="datetime"
            placeholder="请选择创建时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="外呼时间" prop="callTime">
          <el-date-picker
            v-model="form.callTime"
            type="datetime"
            placeholder="请选择外呼时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
          />
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

    <!-- 分配外呼人员对话框 -->
    <el-dialog :title="'选择外呼人员'" :visible.sync="userDialog.open" width="800px" append-to-body max-height="70vh">
      <el-form :model="userDialog.queryParams" ref="userQueryForm" size="small" :inline="true" label-width="90px">
        <el-form-item label="用户姓名" prop="userName">
          <el-input
            v-model="userDialog.queryParams.userName"
            placeholder="请输入用户姓名"
            clearable
            @keyup.enter.native="getUserList"
          />
        </el-form-item>
        <el-form-item label="用户账号" prop="nickName">
          <el-input
            v-model="userDialog.queryParams.nickName"
            placeholder="请输入用户账号"
            clearable
            @keyup.enter.native="getUserList"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getUserList">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetUserQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <div style="margin: 10px 0 15px 0; text-align: right;">
        <el-button type="primary" @click="confirmUserSelection">确 定</el-button>
        <el-button @click="userDialog.open = false">取 消</el-button>
      </div>
      <el-table v-loading="userDialog.loading" :data="userDialog.userList" @selection-change="handleUserSelectionChange" style="margin-bottom: 15px;">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户账号" align="center" prop="userName" />
        <el-table-column label="用户姓名" align="center" prop="nickName" />
        <el-table-column label="部门" align="center" prop="deptName" />
        <el-table-column label="邮箱" align="center" prop="email" />
        <el-table-column label="手机号" align="center" prop="phonenumber" />
      </el-table>
      <pagination
        v-show="userDialog.total>0"
        :total="userDialog.total"
        :page.sync="userDialog.queryParams.pageNum"
        :limit.sync="userDialog.queryParams.pageSize"
        @pagination="getUserList"
      />

    </el-dialog>

    <!-- 设置外呼产品对话框 -->
    <el-dialog :title="'选择外呼产品'" :visible.sync="productDialog.open" width="1000px" append-to-body max-height="70vh">
      <el-form :model="productDialog.queryParams" ref="productQueryForm" size="small" :inline="true" label-width="90px">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input
            v-model="productDialog.queryParams.goodsName"
            placeholder="请输入商品名称"
            clearable
            @keyup.enter.native="getProductList"
          />
        </el-form-item>
        <el-form-item label="商品编码" prop="goodsCode">
          <el-input
            v-model="productDialog.queryParams.goodsCode"
            placeholder="请输入商品编码"
            clearable
            @keyup.enter.native="getProductList"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getProductList">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetProductQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <div style="margin: 10px 0; text-align: right;">
        <el-button type="primary" @click="confirmProductSelection">确 定</el-button>
        <el-button @click="productDialog.open = false">取 消</el-button>
      </div>
      <el-table v-loading="productDialog.loading" :data="productDialog.productList" @selection-change="handleProductSelectionChange" style="margin-bottom: 15px;">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="商品编码" align="center" prop="goodsCode" />
        <el-table-column label="商品名称" align="center" prop="goodsName" />
      </el-table>
      <div style="margin-bottom: 20px;">
        <pagination
          v-show="productDialog.total>0"
          :total="productDialog.total"
          :page.sync="productDialog.queryParams.pageNum"
          :limit.sync="productDialog.queryParams.pageSize"
          @pagination="getProductList"
        />
      </div>

    </el-dialog>

    <!-- 导入外呼记录对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx,.xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-error="handleFileError"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          <el-link type="primary" :underline="false" @click="importTemplate">下载导入模板</el-link>
          <el-link type="info" :underline="false">仅允许上传xlsx/xls文件</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm" :loading="upload.isUploading">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSelfCallRecord, getSelfCallRecord, delSelfCallRecord, addSelfCallRecord, updateSelfCallRecord, setCallProduct, assignCallUser, dialPhone } from "@/api/selfCallRecord/selfCallRecord";
import { listUser } from "@/api/system/user";
import { listGoods } from "@/api/juhe/goods";

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
        sourceOrderNo: null,
        callProduct: null,
        status: null,
        callUser: null,
        callOrderNo: null,
        createTime: null,
        callTime: null,
        orderByColumn: 'create_time',
        isAsc: 'desc'
      },
      // 表单参数
      form: {
        callOrderNo: null,
        createTime: null,
        callTime: null,
      },
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
      },
      // 导入参数
      upload: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: {
          Authorization: ""
        },
        // 上传的地址
        url: ""
      },
      // 上传文件列表
      fileList: [],
      // 导入模板路径
      importTemplate: process.env.VUE_APP_BASE_API + "/common/download/importTemplate?fileName=外呼记录导入模板.xlsx",
      // 产品选择对话框参数
      productDialog: {
        open: false,
        loading: false,
        productList: [],
        selectedProducts: [],
        total: 0,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          goodsName: null,
          goodsCode: null
        }
      },
      // 待设置产品的记录ID
      recordIds: [],
      // 用户选择对话框参数
      userDialog: {
        open: false,
        loading: false,
        userList: [],
        selectedUsers: [],
        total: 0,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          userName: null,
          nickName: null
        }
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
        sourceOrderNo: null,
        sourceOrderInfo: null,
        callProduct: null,
        status: null,
        callUser: null,
        callOrderNo: null,
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
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "导入外呼记录";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(this.importTemplate);
    },
    /** 提交上传文件 */
    submitFileForm() {
      this.$refs.upload.submit();
    },
    /** 文件上传中处理 */
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    /** 文件上传成功处理 */
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$modal.msgSuccess("导入成功");
      this.getList();
    },
    /** 文件上传错误处理 */
    handleFileError() {
      this.upload.isUploading = false;
      this.$modal.msgError("导入失败");
      this.$refs.upload.clearFiles();
    },

    /** 设置外呼产品 */
    handleSetProduct() {
      // 检查选中的记录是否是新增或已确认产品状态
      const selectedRecords = this.selfCallRecordList.filter(record => this.ids.includes(record.id));
      const invalidRecords = selectedRecords.filter(record => record.status !== 'NEW' && record.status !== 'CONFIRM_PRODUCT');

      if (invalidRecords.length > 0) {
        this.$modal.msgWarning('只能为状态为"新增"或"确认外呼产品"的记录设置外呼产品');
        return;
      }

      this.recordIds = this.ids;
      this.productDialog.open = true;
      this.productDialog.selectedProducts = [];
      this.getProductList();
    },

    /** 获取商品列表 */
    getProductList() {
      this.productDialog.loading = true;
      listGoods(this.productDialog.queryParams).then(response => {
        this.productDialog.productList = response.rows;
        this.productDialog.total = response.total;
        this.productDialog.loading = false;
      });
    },

    /** 重置商品查询 */
    resetProductQuery() {
      this.resetForm("productQueryForm");
      this.getProductList();
    },

    /** 商品选择变更 */
    handleProductSelectionChange(selection) {
      this.productDialog.selectedProducts = selection;
    },

    /** 确认商品选择 */
    confirmProductSelection() {
      if (this.productDialog.selectedProducts.length === 0) {
        this.$modal.msgWarning('请选择商品');
        return;
      }

      const product = this.productDialog.selectedProducts[0];
      const params = {
        ids: this.recordIds,
        callProduct: product.goodsName,
        status: 'CONFIRM_PRODUCT' // 确认外呼产品状态
      };

      // 确保使用导入的API函数而不是this.setCallProduct
      try {
        setCallProduct(params).then(response => {
          this.$modal.msgSuccess('设置外呼产品成功');
          this.productDialog.open = false;
          this.getList();
        }).catch(error => {
          console.error('设置外呼产品失败:', error);
          this.$modal.msgError('设置外呼产品失败');
        });
      } catch (e) {
        console.error('调用setCallProduct时发生错误:', e);
        this.$modal.msgError('设置外呼产品失败');
      }
    },

    /** 分配外呼人员 */
    handleAssignUser() {
      // 检查选中的记录是否是确认外呼产品或已分配人员状态
      const selectedRecords = this.selfCallRecordList.filter(record => this.ids.includes(record.id));
      const invalidRecords = selectedRecords.filter(record => record.status !== 'CONFIRM_PRODUCT' && record.status !== 'ALLOCATE_USER');

      if (invalidRecords.length > 0) {
        this.$modal.msgWarning('只能为状态为"确认外呼产品"或"分配外呼人员"的记录分配外呼人员');
        return;
      }

      this.recordIds = this.ids;
      this.userDialog.open = true;
      this.userDialog.selectedUsers = [];
      this.getUserList();
    },

    /** 获取用户列表 */
    getUserList() {
      this.userDialog.loading = true;
      listUser(this.userDialog.queryParams).then(response => {
        this.userDialog.userList = response.rows;
        this.userDialog.total = response.total;
        this.userDialog.loading = false;
      });
    },

    /** 重置用户查询 */
    resetUserQuery() {
      this.resetForm("userQueryForm");
      this.getUserList();
    },

    /** 用户选择变更 */
    handleUserSelectionChange(selection) {
      this.userDialog.selectedUsers = selection;
    },

    /** 确认用户选择 */
    confirmUserSelection() {
      if (this.userDialog.selectedUsers.length === 0) {
        this.$modal.msgWarning('请选择用户');
        return;
      }

      const user = this.userDialog.selectedUsers[0];
      const params = {
        ids: this.recordIds,
        userId: user.userId || user.id,
        callUser: user.nickName
      };

      assignCallUser(params).then(response => {
        this.$modal.msgSuccess('分配外呼人员成功');
        this.userDialog.open = false;
        this.getList();
      }).catch(() => {
        this.$modal.msgError('分配外呼人员失败');
      });
    },

    /** 一键拨号 */
    handleDial(row) {
      this.$modal.confirm(`确定要创建 ${row.phoneNumber}的外呼任务吗？`).then(() => {

        dialPhone(row.id).then(response => {
          this.$modal.msgSuccess('外呼任务创建成功！');
          // 更新外呼时间
          const updateParams = {
            id: row.id,
            callTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            status: 'OCCUPY' // 拨号后状态变为占用中
          };
          updateSelfCallRecord(updateParams).then(() => {
            this.getList();
          });
        }).catch(() => {
          this.$modal.msgError('外呼任务创建失败！');
        });
      }).catch(() => {});
    }
  }
};
</script>

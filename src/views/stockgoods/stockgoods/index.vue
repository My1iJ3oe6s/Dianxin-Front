<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="商品编码" prop="goodsCode">
          <el-input
            v-model="queryParams.goodsCode"
            placeholder="请输入商品编码"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input
            v-model="queryParams.goodsName"
            placeholder="请输入商品名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="产品省份" prop="provinceName">
          <el-input
            v-model="queryParams.provinceName"
            placeholder="请输入产品省份"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="公司id" prop="companyId">
          <el-input
            v-model="queryParams.companyId"
            placeholder="请输入公司id"
            clearable
            @keyup.enter.native="handleQuery"
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
            v-hasPermi="['stockgoods:stockgoods:add']"
          >新增
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['stockgoods:stockgoods:edit']"
          >修改
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['stockgoods:stockgoods:remove']"
          >删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['stockgoods:stockgoods:export']"
          >导出
          </el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="stockgoodsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="商品ID" align="center" prop="goodsId"/>
        <el-table-column label="商品编码" align="center" prop="goodsCode"/>
        <el-table-column label="商品名称" align="center" prop="goodsName"/>
        <el-table-column label="产品产商" align="center" prop="productType"/>
        <el-table-column label="产品省份" align="center" prop="provinceName"/>
        <el-table-column label="限制区域" align="center" prop="restrictedArea"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['stockgoods:stockgoods:edit']"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['stockgoods:stockgoods:remove']"
            >删除
            </el-button>
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

    <!-- 添加或修改存量商品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="商品编码" prop="goodsCode">
          <el-input v-model="form.goodsCode" placeholder="请输入商品编码"/>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="form.goodsName" placeholder="请输入商品名称"/>
        </el-form-item>
        <el-form-item label="商品描述">
          <editor v-model="form.description" :min-height="192"/>
        </el-form-item>
        <el-form-item label="商品链接" prop="goodsUrl">
          <el-input v-model="form.goodsUrl" placeholder="请输入商品链接"/>
        </el-form-item>
        <el-form-item label="产品省份编码" prop="provinceCode">
          <el-input v-model="form.provinceCode" placeholder="请输入产品省份编码"/>
        </el-form-item>
        <el-form-item label="产品省份" prop="provinceName">
          <el-input v-model="form.provinceName" placeholder="请输入产品省份，如'湖北省'"/>
        </el-form-item>
        <el-form-item label="限制区域" prop="restrictedArea">
          <el-input v-model="form.restrictedArea" type="textarea" placeholder="请输入内容，如'武汉市、孝感市'"/>
        </el-form-item>
        <el-form-item label="供应商产品编码" prop="supplierGoodsCode">
          <el-input v-model="form.supplierGoodsCode" placeholder="请输入供应商产品编码"/>
        </el-form-item>
        <el-form-item label="供应商产品配置">
          <editor v-model="form.supplierGoodsConfig" :min-height="192"/>
        </el-form-item>
<!--        <el-form-item label="创建时间" prop="createdAt">-->
<!--          <el-date-picker clearable-->
<!--                          v-model="form.createdAt"-->
<!--                          type="date"-->
<!--                          value-format="yyyy-MM-dd"-->
<!--                          placeholder="请选择创建时间"-->
<!--          >-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="更新时间" prop="updatedAt">-->
<!--          <el-date-picker clearable-->
<!--                          v-model="form.updatedAt"-->
<!--                          type="date"-->
<!--                          value-format="yyyy-MM-dd"-->
<!--                          placeholder="请选择更新时间"-->
<!--          >-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="创建者" prop="createdBy">-->
<!--          <el-input v-model="form.createdBy" placeholder="请输入创建者"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="更新者" prop="updatedBy">-->
<!--          <el-input v-model="form.updatedBy" placeholder="请输入更新者"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="是否删除" prop="isDeleted">-->
<!--          <el-input v-model="form.isDeleted" placeholder="请输入是否删除"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="公司id" prop="companyId">-->
<!--          <el-input v-model="form.companyId" placeholder="请输入公司id"/>-->
<!--        </el-form-item>-->
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
  listStockgoods,
  getStockgoods,
  delStockgoods,
  addStockgoods,
  updateStockgoods
} from '@/api/stockgoods/stockgoods'

export default {
  name: 'Stockgoods',
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
      // 存量商品表格数据
      stockgoodsList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        goodsCode: null,
        goodsName: null,
        productType: null,
        provinceName: null,
        restrictedArea: null,
        companyId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        goodsCode: [
          { required: true, message: '商品编码不能为空', trigger: 'blur' }
        ],
        goodsName: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询存量商品列表 */
    getList() {
      this.loading = true
      listStockgoods(this.queryParams).then(response => {
        this.stockgoodsList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        goodsId: null,
        goodsCode: null,
        goodsName: null,
        description: null,
        goodsUrl: null,
        productType: null,
        provinceCode: null,
        provinceName: null,
        restrictedArea: null,
        supplierCode: null,
        supplierGoodsCode: null,
        supplierGoodsConfig: null,
        createdAt: null,
        updatedAt: null,
        createdBy: null,
        updatedBy: null,
        isDeleted: null,
        companyId: null
      }
      this.resetForm('form')
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
      this.ids = selection.map(item => item.goodsId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加存量商品'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const goodsId = row.goodsId || this.ids
      getStockgoods(goodsId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改存量商品'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.goodsId != null) {
            updateStockgoods(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addStockgoods(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const goodsIds = row.goodsId || this.ids
      this.$modal.confirm('是否确认删除存量商品编号为"' + goodsIds + '"的数据项？').then(function() {
        return delStockgoods(goodsIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('stockgoods/stockgoods/export', {
        ...this.queryParams
      }, `stockgoods_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>

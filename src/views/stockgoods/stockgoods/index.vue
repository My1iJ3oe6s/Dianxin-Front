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
<!--      <el-form-item label="商品链接" prop="goodsUrl">-->
<!--        <el-input-->
<!--          v-model="queryParams.goodsUrl"-->
<!--          placeholder="请输入商品链接"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="二确模板" prop="comfiredType">-->
<!--        <el-select v-model="queryParams.comfiredType" placeholder="请选择二确模板" clearable>-->
<!--          <el-option-->
<!--            v-for="dict in dict.type.comfire_img_type"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="是否开启" prop="staus">
        <el-select v-model="queryParams.staus" placeholder="请选择是否开启" clearable>
          <el-option
            v-for="dict in dict.type.kaiguan"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createdAt">
        <el-date-picker clearable
          v-model="queryParams.createdAt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间">
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
          v-hasPermi="['stockgoods:stockgoods:add']"
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
          v-hasPermi="['stockgoods:stockgoods:edit']"
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
          v-hasPermi="['stockgoods:stockgoods:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['stockgoods:stockgoods:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="stockgoodsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="商品ID" align="center" prop="goodsId" />-->
      <el-table-column label="商品编码" align="center" prop="goodsCode" />
      <el-table-column label="商品名称" align="center" prop="goodsName" />
      <el-table-column label="产商" align="center" prop="productType" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.product_type" :value="scope.row.productType"/>
        </template>
      </el-table-column>
      <el-table-column label="商品链接" align="center" prop="goodsUrl" />
<!--      <el-table-column label="二确模板" align="center" prop="comfiredType">-->
<!--        <template slot-scope="scope">-->
<!--          <dict-tag :options="dict.type.comfire_img_type" :value="scope.row.comfiredType"/>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="二确文字" align="center" prop="comfiredContent" />-->
      <el-table-column label="是否开启" align="center" prop="staus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.kaiguan" :value="scope.row.staus"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['stockgoods:stockgoods:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['stockgoods:stockgoods:remove']"
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

    <!-- 添加或修改权益商品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="商品编码" prop="goodsCode">
          <el-input v-model="form.goodsCode" placeholder="请输入商品编码" />
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="form.goodsName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="产商" prop="productType">
          <el-select v-model="form.productType" placeholder="请选择产品产商;">
            <el-option
              v-for="dict in dict.type.product_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="商品链接" prop="goodsUrl">
          <el-input v-model="form.goodsUrl" placeholder="请输入商品链接" />
        </el-form-item>
        <el-form-item label="页面模板" prop="pageType">
          <el-select v-model="form.pageType" placeholder="请选择页面模板">
            <el-option
              v-for="dict in dict.type.stockgoods_page_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品介绍图片" prop="headUrl" v-show="form.pageType == 'IMG'">
          <image-upload :limit="1" v-model="form.headUrl"/>
        </el-form-item>
        <el-form-item label="订购说明图片" prop="zixunUrl" v-show="form.pageType == 'IMG'">
          <image-upload :limit="1" v-model="form.zixunUrl"/>
        </el-form-item>
        <el-form-item label="业务办理底图" prop="ywqrUrl" v-show="form.pageType">
          <image-upload :limit="1" v-model="form.ywqrUrl"/>
        </el-form-item>
        <el-form-item label="业务办理按钮文字" prop="buttonContent">
          <el-input v-model="form.buttonContent" placeholder="请输入业务办理按钮文字" />
        </el-form-item>
        <el-form-item label="业务受理协议图片" prop="ywslxyUrl" v-show="form.pageType == 'IMG'">
          <image-upload :limit="1" v-model="form.ywslxyUrl"/>
        </el-form-item>
        <el-form-item label="隐私条款图片" prop="ystkUrl"  v-show="form.pageType == 'IMG'">
          <image-upload :limit="1" v-model="form.ystkUrl"/>
        </el-form-item>
        <el-form-item label="产品介绍内容" v-show="form.pageType && form.pageType !== 'IMG'">
          <editor v-model="form.headContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="订购说明内容" v-show="form.pageType && form.pageType !== 'IMG'">
          <editor v-model="form.zixunContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="业务受理协议内容" v-show="form.pageType && form.pageType !== 'IMG'">
          <editor v-model="form.ywslxyContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="隐私条款内容"  v-show="form.pageType && form.pageType !== 'IMG'">
          <editor v-model="form.ystkContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="是否二确" prop="isComfired">
          <el-select v-model="form.isComfired" placeholder="请选择是否二确">
            <el-option
              v-for="dict in dict.type.kaiguan"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二确模板" prop="comfiredType"  v-show="form.isComfired == 1">
          <el-select v-model="form.comfiredType" placeholder="请选择二确模板">
            <el-option
              v-for="dict in dict.type.comfire_img_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二确文字"  v-show="form.isComfired == 1">
          <editor v-model="form.comfiredContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="是否开启" prop="staus">
          <el-select v-model="form.staus" placeholder="请选择是否开启">
            <el-option
              v-for="dict in dict.type.kaiguan"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-divider content-position="center">商品明细</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddSelfStockGoodsDetails">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteSelfStockGoodsDetails">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="selfStockGoodsDetailsList" :row-class-name="rowSelfStockGoodsDetailsIndex" @selection-change="handleSelfStockGoodsDetailsSelectionChange" ref="selfStockGoodsDetails">
          <el-table-column type="selection" width="100" align="center" />
<!--          <el-table-column label="序号" align="center" prop="index" width="50"/>-->
          <el-table-column label="产商" prop="productType" width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.productType" placeholder="请选择产品产商;电信、移动、联通">
                <el-option
                  v-for="dict in dict.type.product_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="归属省份编码" prop="provinceCode" width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row.provinceCode" placeholder="请输入归属省份编码" />
            </template>
          </el-table-column>
          <el-table-column label="归属省份" prop="provinceName" width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row.provinceName" placeholder="请输入归属省份" />
            </template>
          </el-table-column>
          <el-table-column label="供应商编码" prop="supplierCode" width="150">

            <template slot-scope="scope">
              <el-select v-model="scope.row.supplierCode" placeholder="请输入供应商编码">
                <el-option
                  v-for="dict in dict.type.stock_supplier"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </template>

<!--            <template slot-scope="scope">-->
<!--              <el-input v-model="scope.row.supplierCode" placeholder="请输入供应商编码" />-->
<!--            </template>-->
          </el-table-column>
          <el-table-column label="供应商产品编码" prop="supplierGoodsCode" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.supplierGoodsCode" placeholder="请输入供应商产品编码" />
            </template>
          </el-table-column>
          <el-table-column label="供应商产品配置" prop="supplierGoodsConfig" width="250">
<!--            <el-input v-model="scope.row.supplierGoodsConfig" type="textarea" placeholder="请输入供应商产品配置" />-->
            <template slot-scope="scope">
              <el-input v-model="scope.row.supplierGoodsConfig" type="textarea"  placeholder="请输入供应商产品配置" />
            </template>
          </el-table-column>

          <el-form-item label="商品描述" prop="description">
            <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
          </el-form-item>

          <el-table-column label="是否开启" prop="staus" width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.staus" placeholder="请选择是否开启">
                <el-option
                  v-for="dict in dict.type.kaiguan"
                  :key="dict.key"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
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
import { listStockgoods, getStockgoods, delStockgoods, addStockgoods, updateStockgoods } from "@/api/stockgoods/stockgoods";

export default {
  name: "Stockgoods",
  dicts: ['product_type', 'stockgoods_page_type', 'kaiguan', 'comfire_img_type', 'stock_supplier'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedSelfStockGoodsDetails: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 权益商品表格数据
      stockgoodsList: [],
      // 权益商品明细表格数据
      selfStockGoodsDetailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        goodsCode: null,
        goodsName: null,
        productType: null,
        goodsUrl: null,
        comfiredType: null,
        comfiredContent: null,
        staus: null,
        createdAt: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        goodsCode: [
          { required: true, message: "商品编码不能为空", trigger: "blur" }
        ],
        goodsName: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询权益商品列表 */
    getList() {
      this.loading = true;
      listStockgoods(this.queryParams).then(response => {
        this.stockgoodsList = response.rows;
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
        goodsId: null,
        goodsCode: null,
        goodsName: null,
        productType: null,
        description: null,
        goodsUrl: null,
        provinceCode: null,
        provinceName: null,
        restrictedArea: null,
        supplierCode: null,
        supplierGoodsCode: null,
        supplierGoodsConfig: null,
        pageType: null,
        headUrl: null,
        zixunUrl: null,
        ywqrUrl: null,
        ywslxyUrl: null,
        ystkUrl: null,
        buttonContent: null,
        headContent: null,
        zixunContent: null,
        ywslxyContent: null,
        ystkContent: null,
        isComfired: null,
        comfiredType: null,
        comfiredContent: null,
        staus: null,
        createdAt: null,
        updatedAt: null,
        createdBy: null,
        updatedBy: null,
        isDeleted: null,
        companyId: null
      };
      this.selfStockGoodsDetailsList = [];
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
      this.ids = selection.map(item => item.goodsId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加权益商品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const goodsId = row.goodsId || this.ids
      getStockgoods(goodsId).then(response => {
        this.form = response.data;
        this.selfStockGoodsDetailsList = response.data.selfStockGoodsDetailsList;
        this.open = true;
        this.title = "修改权益商品";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.selfStockGoodsDetailsList = this.selfStockGoodsDetailsList;
          if (this.form.goodsId != null) {
            updateStockgoods(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStockgoods(this.form).then(response => {
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
      const goodsIds = row.goodsId || this.ids;
      this.$modal.confirm('是否确认删除权益商品编号为"' + goodsIds + '"的数据项？').then(function() {
        return delStockgoods(goodsIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	/** 权益商品明细序号 */
    rowSelfStockGoodsDetailsIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 权益商品明细添加按钮操作 */
    handleAddSelfStockGoodsDetails() {
      let obj = {};
      obj.productType = "";
      obj.provinceCode = "";
      obj.provinceName = "";
      obj.restrictedArea = "";
      obj.supplierCode = "";
      obj.supplierGoodsCode = "";
      obj.supplierGoodsConfig = "";
      obj.staus = "";
      this.selfStockGoodsDetailsList.push(obj);
    },
    /** 权益商品明细删除按钮操作 */
    handleDeleteSelfStockGoodsDetails() {
      if (this.checkedSelfStockGoodsDetails.length == 0) {
        this.$modal.msgError("请先选择要删除的权益商品明细数据");
      } else {
        const selfStockGoodsDetailsList = this.selfStockGoodsDetailsList;
        const checkedSelfStockGoodsDetails = this.checkedSelfStockGoodsDetails;
        this.selfStockGoodsDetailsList = selfStockGoodsDetailsList.filter(function(item) {
          return checkedSelfStockGoodsDetails.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleSelfStockGoodsDetailsSelectionChange(selection) {
      this.checkedSelfStockGoodsDetails = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('stockgoods/stockgoods/export', {
        ...this.queryParams
      }, `stockgoods_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

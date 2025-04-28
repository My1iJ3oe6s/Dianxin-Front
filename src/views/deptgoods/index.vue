<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="部门">
        <el-select v-model="queryParams.deptId" placeholder="请选择部门" clearable>
          <el-option
            v-for="dept in deptOptions"
            :key="dept.deptId"
            :label="dept.deptName"
            :value="dept.deptId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="deptName" label="部门名称" width="180"></el-table-column>
      <el-table-column label="商品列表" min-width="300">
        <template slot-scope="scope">
          <el-tag
            v-for="goods in scope.row.goodsList"
            :key="goods.goodsId"
            style="margin-right: 5px"
          >
            {{ goods.goodsName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="部门" prop="deptId">
          <el-select v-model="form.deptId" placeholder="请选择部门">
            <el-option
              v-for="dept in deptOptions"
              :key="dept.deptId"
              :label="dept.deptName"
              :value="dept.deptId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品" prop="goodsIds">
          <el-select
            v-model="form.goodsIds"
            multiple
            placeholder="请选择商品"    style="width: 100%"
            collapse-tags
          >
            <el-option
              v-for="goods in goodsOptions"
              :key="goods.goodsId"
              :label="goods.goodsName"
              :value="goods.goodsId"
            />
          </el-select>
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
import { listSysDeptGoods, addSysDeptGoods, updateSysDeptGoods, deleteSysDeptGoods } from "@/api/deptgoods";
import { listDept } from "@/api/system/dept";
import { listStockgoods } from "@/api/stockgoods/stockgoods";

export default {
  name: "SysDeptGoods",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 部门选项
      deptOptions: [],
      // 商品选项
      goodsOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: undefined
      },
      // 表单参数
      form: {
        id: undefined,
        deptId: undefined,
        goodsIds: []
      },
      // 表单校验
      rules: {
        deptId: [
          { required: true, message: "部门不能为空", trigger: "change" }
        ],
        goodsIds: [
          { required: true, message: "商品不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDeptOptions();
    this.getGoodsOptions();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listSysDeptGoods(this.queryParams).then(response => {
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 获取部门选项 */
    getDeptOptions() {
      listDept().then(response => {
        this.deptOptions = response.data;
      });
    },
    /** 获取商品选项 */
    getGoodsOptions() {
      listStockgoods().then(response => {
        this.goodsOptions = response.rows;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加部门商品关系";
    },
    /** 修改按钮操作 */
    handleEdit(row) {
      this.reset();
      const id = row.id;
      this.form = {
        id: id,
        deptId: row.deptId,
        goodsIds: row.goodsList.map(item => item.goodsId)
      };
      this.open = true;
      this.title = "修改部门商品关系";
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除该部门商品关系？').then(() => {
        return deleteSysDeptGoods(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined,
        deptId: undefined,
        goodsIds: []
      };
      this.resetForm("form");
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateSysDeptGoods(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSysDeptGoods(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    }
  }
};
</script>

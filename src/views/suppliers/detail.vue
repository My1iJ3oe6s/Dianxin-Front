<template>
    <div class="order_detail_wrapper">
        <el-form label-width="200px" :model="form" ref="form" :rules="rules">
            <el-card style="margin: 20px 20px; font-size: 14px; min-height: calc(100vh - 200px);">
                <div slot="header">
                    <span>基本信息</span>
                </div>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="外部供应商名称" prop="supplierName">
                            <el-input v-model="form.supplierName" placeholder="请输入外部供应商名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="外部供应商编码" prop="supplierCode">
                            <el-input v-model="form.supplierCode" placeholder="请输入外部供应商编码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人" prop="contactPerson">
                            <el-input v-model="form.contactPerson" placeholder="请输入联系人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话" prop="phone">
                            <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="地址" prop="address">
                            <el-input v-model="form.address" placeholder="请输入地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <el-card class="form_buttons_bottom">
                <div class="tc">
                    <el-button :loading="loading" type="primary" @click="submitForm" v-if="!isReadonly">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </el-card>
        </el-form>
    </div>
</template>
  
<script>
import { getInfo, add, edit, getSuppliersList } from "@/api/suppliers/index";
import { prodTypeData } from '@/utils/printData';

export default {
    name: "SuppliersDetail",
    data() {
        return {
            prodTypeData,
            loading: false,
            form: {

            },
            rules: {
                supplierName: [{ required: true, message: "外部供应商名称必填", trigger: "blur" }],
                supplierCode: [{ required: true, message: "外部供应商编码必填", trigger: "blur" }],
            },
            isEdit: false,
        };
    },
    created() {
        const { id, target } = this.$route.query;
        this.isReadonly = target == 1 ? true : false;
        this.form = {};
        if (id) {
            this.isEdit = true;
            this.queryDetail(id)
        }
    },
    methods: {
        cancel() {
            this.$router.back();
        },
        queryDetail(id) {
            this.loading = true;
            getInfo(id).then((res) => {
                this.form = res.data
                this.loading = false;
            });
        },
        submitForm() {
            this.loading = true;
            this.$refs["form"].validate((valid, a) => {
                if (valid) {
                    if (this.form.supplierId) {
                        edit(this.form).then((response) => {
                            this.loading = false;
                            this.cancel();
                        })
                            .catch(() => {
                                this.loading = false;
                            });
                    } else {
                        add(this.form).then((response) => {
                            this.loading = false;
                            this.cancel();
                        })
                            .catch(() => {
                                this.loading = false;
                            });

                    }
                }
            })
        },
    },
};
</script>
  
<style lang="stylus">
.add-product-wrapper
  padding 12px
  .content
    margin 0 auto
    width 75%
    min-width 800px
  .sku-wrapper
    background-color #f7f8fa
    padding 12px
    .sku_sorts
      .sku_sort
        background-color white
        margin-bottom 12px
        .label
          padding 8px
        .values
          padding 8px 0 0 8px
          border-top 1px solid $border-color
          display flex
          flex-wrap wrap
          .value
            padding 0 32px 8px 0
            width 200px!important
            display flex
            align-items center
  .img-upload-mini .el-upload--picture-card
    width: 48px;
    height: 48px;
    line-height: 57px;
</style>
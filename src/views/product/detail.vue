<template>
    <div class="order_detail_wrapper">
        <el-form label-width="160px" :model="form" ref="form" :rules="rules">
            <el-card style="margin: 20px 20px; font-size: 14px; min-height: calc(100vh - 200px);">
                <div slot="header">
                    <span>基本信息</span>
                </div>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="产品名称" prop="productName">
                            <el-input v-model="form.productName" placeholder="请输入产品名称" :readonly="isReadonly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品类型" prop="productionType">
                            <el-select clearable v-model="form.productionType" style="width: 100%">
                                <el-option v-for="(item, index) of prodTypeData" :key="index" :label="item.name"
                                    :value="item.value">{{
                                        item.name }}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品编码" prop="productCode">
                            <el-input v-model="form.productCode" placeholder="请输入产品编码" :readonly="isReadonly"
                                :disabled="isEdit"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="外部供应商" prop="supplierName">
                            <el-select v-model="form.supplierName" placeholder="请选择外部供应商" clearable size="small"
                                @change="handleSupplier" style="width: 100%">
                                <el-option v-for="item in suppliersList" :key="item.supplierName" :label="item.supplierName"
                                    :value="item.supplierName" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-for="(item, i) in configField" :key="i">
                        <el-form-item :label="item.filedValue" :prop="item.filedCode">
                            <el-input v-model="form.configParam[item.filedCode]" :placeholder="'请输入' + item.filedValue"
                                :readonly="isReadonly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="外部供应商商品ID" prop="externalProductId">
                            <el-input v-model="form.externalProductId" placeholder="请输入外部供应商商品ID"
                                :readonly="isReadonly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="外部供应商商品名称" prop="externalProductName">
                            <el-input v-model="form.externalProductName" placeholder="请输入外部供应商商品名称"
                                :readonly="isReadonly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="外部供应商商品编码" prop="externalProductCode">
                            <el-input v-model="form.externalProductCode" placeholder="请输入外部供应商商品编码"
                                :readonly="isReadonly"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="身份证是否校验" prop="checkIdentity">
                            <el-radio-group v-model="form.checkIdentity">
                                <el-radio v-for="dict in isChangePhoneData" :key="dict.value" :label="dict.value">{{
                                    dict.name }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="是否选号" prop="isNumbered">
                            <el-radio-group v-model="form.isNumbered">
                                <el-radio v-for="dict in isChangePhoneData" :key="dict.value" :label="dict.value">{{
                                    dict.name }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12" v-if="form.isNumbered == 1">
                        <el-form-item label="号池" prop="poolName">
                            <el-select v-model="form.poolName" placeholder="请选择" clearable>
                                <el-option v-for="dict in poolList" :key="dict.poolName" :label="dict.poolName"
                                    :value="dict.poolName" />
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="状态" prop="productionStatus">
                            <el-radio-group v-model="form.productionStatus">
                                <el-radio v-for="dict in productStatusData" :key="dict.value" :label="dict.value">{{
                                    dict.name }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="des">
                            <el-input type="textarea" v-model="form.des" placeholder="请输入备注"
                                :readonly="isReadonly"></el-input>
                        </el-form-item>
                    </el-col>
                    <div style="position:absolute;z-index: -99">
                        <el-col :span="12">
                            <el-form-item label="外部供应商ID" prop="supplierId">
                                <el-input v-model="form.supplierId" placeholder="请输入外部供应商ID" :readonly="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="外部供应商编码" prop="supplierCode">
                                <el-input v-model="form.supplierCode" placeholder="请输入外部供应商编码" :readonly="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </div>
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
import { getInfo, add, edit, getSuppliersList, getConfigField } from "@/api/product/index";
import { prodTypeData } from '@/utils/printData';
import * as poolApi from "@/api/numberPool/index";

export default {
    name: "ProductDetail",
    data() {
        return {
            prodTypeData,
            loading: false,
            form: {
                productionStatus: '1',
                isNumbered: '0',
                checkIdentity: '0',
                configParam:{}
            },
            rules: {
                productName: [{ required: true, message: "产品名称必填", trigger: "blur" }],
                productCode: [{ required: true, message: "产品编码必填", trigger: "change" }],
                prodType: [{ required: true, message: "产品类型必填", trigger: "blur" }],
            },
            productStatusData: [
                { name: "开启", value: '1' },
                { name: "关闭", value: '0' },
            ],
            isChangePhoneData: [
                { name: "是", value: '1' },
                { name: "否", value: '0' },
            ],
            isReadonly: false,
            isEdit: false,
            suppliersList: [],
            poolList: [],
            configField: []
        };
    },
    created() {
        const { id, target } = this.$route.query;
        this.isReadonly = target == 1 ? true : false;
        this.getSuppliersList();
        if (id) {
            this.isEdit = true;
            this.queryDetail(id)
        }
    },
    methods: {
        cancel() {
            this.$router.back();
        },
        getSuppliersList() {
            getSuppliersList({
                pageNo: 1,
                pageSize: 50
            })
                .then((res) => {
                    this.suppliersList = res.data.records;
                })
            poolApi.getList().then(response => {
                this.poolList = response.data
            });
        },
        queryDetail(id) {
            this.loading = true;
            getInfo(id).then((res) => {
                res.data.checkIdentity = res.data.checkIdentity?.toString() || null;
                res.data.isNumbered = res.data.isNumbered?.toString() || null;
                res.data.productionStatus = res.data.productionStatus?.toString() || null;
                res.data.productionType = res.data.productionType ? res.data.productionType * 1 : null;
                this.getConfigFieldData(res.data.supplierCode);
                if(!res.data.configParam){
                    rea.data.configParam = {}
                }
                this.form = res.data;
                this.loading = false;
            });
        },
        handleSupplier(e) {
            const target = this.suppliersList.filter(v => v.supplierName == e)?.[0];
            this.form.supplierId = target?.supplierId;
            this.form.supplierCode = target?.supplierCode;
            this.getConfigFieldData(target?.supplierCode);
        },
        getConfigFieldData(supplierCode){
            if(!supplierCode)return;
            // 获取其他展示项
            getConfigField(supplierCode).then(res => {
                const { data } = res;
                this.configField = data
            })
        },
        submitForm() {
            this.loading = true;
            this.$refs["form"].validate((valid, a) => {
                console.log(this.form)
                if (valid) {
                    if (this.form.productId) {
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
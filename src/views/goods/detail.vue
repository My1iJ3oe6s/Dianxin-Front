<template>
    <div class="order_detail_wrapper">
        <el-form label-width="180px" :model="form" ref="form" :rules="rules">
            <el-card style="margin: 20px 20px; font-size: 14px">
                <div slot="header">
                    <span>基本信息</span>
                </div>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="商品名称" prop="goodsName">
                            <el-input v-model="form.goodsName" placeholder="请输入商品名称" :readonly="isReadonly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品编码" prop="goodsCode">
                            <el-input v-model="form.goodsCode" placeholder="请输入商品编码" :readonly="isReadonly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="isEdit">
                        <el-form-item label="产品" prop="productCode">
                            <el-select clearable v-model="form.productCode" style="width: 100%">
                                <el-option v-for="(item, index) of productList" :key="index" :label="item.productName"
                                    :value="item.productCode">{{
                                        item.productName }}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <div v-else>
                        <el-col :span="12">
                            <el-form-item label="产品名称" prop="productName">
                                <el-input v-model="form.productName" placeholder="请输入产品名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="产品编码" prop="productCode">
                                <el-input v-model="form.productCode" placeholder="请输入产品编码"></el-input>
                            </el-form-item>
                        </el-col>
                    </div>
                    <el-col :span="12">
                        <el-form-item label="生产类型" prop="productionType">
                            <el-select clearable v-model="form.productionType" style="width: 100%">
                                <el-option v-for="(item, index) of productType" :key="index" :label="item.name"
                                    :value="item.value">{{
                                        item.name }}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否身份证验证" prop="checkIdentity">
                            <el-radio-group v-model="form.checkIdentity">
                                <el-radio v-for="dict in dictData" :key="dict.value" :label="dict.value">{{
                                    dict.name }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否选号" prop="numberingSettings">
                            <el-select clearable v-model="form.numberingSettings" style="width: 100%">
                                <el-option v-for="(item, index) of numberingSettingsData" :key="index" :label="item.name"
                                    :value="item.value">{{
                                        item.name }}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.numberingSettings == 2 || form.numberingSettings == 3">
                        <el-form-item label="号池" prop="poolName">
                            <el-select v-model="form.poolName" placeholder="请选择" clearable style="width: 100%">
                                <el-option v-for="dict in poolList" :key="dict.poolName" :label="dict.poolName"
                                    :value="dict.poolName" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="description">
                            <el-input type="textarea" v-model="form.description" placeholder="请输入备注"
                                :readonly="isReadonly"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>

            <el-card style="margin: 20px 20px; font-size: 14px">
                <div slot="header">
                    <span>商品图片</span>
                </div>
                <el-form-item label="主图" prop="mainImage">
                    <ImageUpload v-model="form.mainImage" :limit="1" :file-list="form.mainImage" :showTip="true" />
                </el-form-item>
                <el-form-item label="详情图" prop="detailImages">
                    <ImageUpload v-model="form.detailImages" :file-list="form.detailImages" :showTip="true" />
                </el-form-item>
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
import {
    getList
} from "@/api/numberPool/index";
import * as productApi from "@/api/product/index";
import { getInfo, add, edit } from "@/api/goods/index";
import { productType, productStatusData, dictData, numberingSettingsData } from '@/utils/printData';

export default {
    name: "GoodsDetail",
    data() {
        return {
            productType,
            productStatusData,
            dictData,
            numberingSettingsData,
            loading: false,
            form: {
                numberingSettings: '0',
                checkIdentity: '0'
            },
            rules: {
                goodsName: [{ required: true, message: "产品名称必填", trigger: "blur" }],
                goodsCode: [{ required: true, message: "产品编码必填", trigger: "change" }],
                productionType: [{ required: true, message: "产品类型必填", trigger: "blur" }],
            },
            isReadonly: false,
            isEdit: false,
            poolList: [],
            productList: []
        };
    },
    created() {
        const { id, target } = this.$route.query;
        this.isReadonly = target == 1 ? true : false;
        this.getPoolList();
        if (id) {
            this.isEdit = true;
            this.queryDetail(id)
        }
    },
    methods: {
        getPoolList() {
            productApi.getList({
                pageNo: 1,
                pageSize: 50
            }).then(response => {
                this.productList = response.data.records
            });
            getList().then(response => {
                this.poolList = response.data
            });
        },
        cancel() {
            this.$router.back();
        },
        queryDetail(id) {
            this.loading = true;
            getInfo(id).then((res) => {
                // res.data.mainImage = this.resetImage([res.data.mainImage]);
                res.data.checkIdentity = res.data.checkIdentity.toString();
                res.data.numberingSettings = res.data.numberingSettings.toString();
                console.log(res.data)
                this.form = res.data
                this.loading = false;
            });
        },
        submitForm() {
            this.loading = true;
            this.$refs["form"].validate((valid, a) => {
                if (valid) {
                    // this.form.detailImages = JSON.stringify([this.form.detailImages])
                    if (this.form.goodsId) {
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
.el-card__header
    font-weight 700
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
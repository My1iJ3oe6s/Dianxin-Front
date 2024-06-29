<template>
    <div class="order_detail_wrapper">
        <el-form label-width="200px" :model="form" ref="form" :rules="rules">
            <el-card style="margin: 20px 20px; font-size: 14px; min-height: calc(100vh - 200px);">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="配置ID" prop="configId">
                            <el-input v-model="form.configId" placeholder="请输入配置ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="平台类型" prop="platform">
                            <el-select v-model="form.platform">
                                <el-option v-for="item in platRange" :key="item.value" :label="item.name"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商家ID" prop="shopId">
                            <el-input v-model="form.shopId" placeholder="请输入商家ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商家名称" prop="shopName">
                            <el-input v-model="form.shopName" placeholder="请输入商家名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="API密钥" prop="apiKey">
                            <el-input v-model="form.apiKey" placeholder="请输入API密钥"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="应用密钥" prop="appSecret">
                            <el-input v-model="form.appSecret" placeholder="请输入应用密钥"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="访问令牌" prop="accessToken">
                            <el-input v-model="form.accessToken" placeholder="请输入访问令牌"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="刷新令牌" prop="refreshToken">
                            <el-input v-model="form.refreshToken" placeholder="请输入刷新令牌"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="配置详情" prop="configDetails">
                            <el-input type="textarea" v-model="form.configDetails" placeholder="请输入配置详情"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否激活" prop="isActive">
                            <el-select v-model="form.isActive" placeholder="请选择是否激活">
                                <el-option label="是" :value="true"></el-option>
                                <el-option label="否" :value="false"></el-option>
                            </el-select>
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
import { getInfo, add, edit, getSuppliersList } from "@/api/marketing/index";
import { platRange } from "@/utils/printData";

export default {
    name: "CallDetail",
    data() {
        return {
            platRange,
            loading: false,
            form: {

            },
            rules: {
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
                    if (this.form.configId) {
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
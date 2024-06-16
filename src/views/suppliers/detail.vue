<template>
    <div class="order_detail_wrapper">
        <el-form label-width="120px" :model="form" ref="form" :rules="rules">
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
                    <el-col :span="24">
                        <el-form-item label="公共配置" prop="devConfig">
                            <el-input class="multi-line-placeholder" type="textarea" v-model="form.devConfig" placeholder="请输入公共配置"></el-input>
                        </el-form-item>
                        <div class="example">
                            示例：<br />key:value<br />key:value
                        </div>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="文档" prop="docUrl">
                            <el-upload ref="upload" :action="upload.url + '?updateSupport=' + upload.updateSupport"
                                :limit="1" :file-list="form.docUrlData" v-model="form.docUrl"
                                :on-success="handleFileSuccess">
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
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
import { getToken } from "@/utils/auth";

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
            upload: {
                // 是否显示弹出层（用户导入）
                open: false,
                // 弹出层标题（用户导入）
                title: "",
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的用户数据
                updateSupport: 0,
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "file/upload",
            },
        };
    },
    created() {
        const { id, target } = this.$route.query;
        this.isReadonly = target == 1 ? true : false;
        this.form = {
            docUrlData: []
        };
        if (id) {
            this.isEdit = true;
            this.queryDetail(id)
        }
    },
    methods: {
        handleFileSuccess(res) {
            const { url, name } = res.data;
            this.form.docUrlData = [{ name: name, url: url }];
            this.form.docUrl = url;
        },
        cancel() {
            this.$router.back();
        },
        queryDetail(id) {
            this.loading = true;
            getInfo(id).then((res) => {
                const { data } = res;
                data.docUrlData = data.docUrl && [{name:data.docUrl,url:data.docUrl}]
                this.form = data
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
  
<style lang="scss">
.multi-line-placeholder::-webkit-input-placeholder {
  white-space: pre-wrap; /* 保留空白符和换行符 */
  color: #ccc; /* 可以设置placeholder的文本颜色 */
}

/* 为Firefox设置样式，Firefox不支持多行placeholder */
.multi-line-placeholder:-moz-placeholder {
  white-space: pre-wrap; /* 保留空白符和换行符 */
  color: #ccc;
}

.multi-line-placeholder::-moz-placeholder {
  white-space: pre-wrap;
  color: #ccc;
}

/* 为Internet Explorer设置样式 */
.multi-line-placeholder:-ms-input-placeholder {
  white-space: pre-wrap;
  color: #ccc;
}
.example{
    color: #ccc;
    padding-left: 120px;
    margin-top: -10px;
    margin-bottom: 10px;
}
          
      
</style>
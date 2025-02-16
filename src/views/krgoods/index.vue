<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px"
                size="medium" class="ry_form">
                <el-form-item label="商品名称" prop="queryParameters.goodsName">
                    <el-input style="width: 240px" v-model="queryParams.queryParameters.goodsName" placeholder="请输入商品名称" clearable size="small"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="商品编码" prop="queryParameters.goodsCode">
                    <el-input style="width: 240px" v-model="queryParams.queryParameters.goodsCode" placeholder="请输入商品编码" clearable size="small"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item class="flex_one tr">
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-container">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55" align="center" /> -->
                <el-table-column label="主图" align="center" prop="mainImage" width="100">
                    <template slot-scope="scope">
                        <el-image class="mainImage1" :src="scope.row.mainImage" alt=""
                            :preview-src-list="[scope.row.mainImage]" />
                    </template>
                </el-table-column>
                <el-table-column label="商品编码" align="center" prop="goodsCode" />
                <el-table-column label="商品名称" align="center" prop="goodsName" />
                <el-table-column label="产品编码" align="center" prop="productCode" />
                <el-table-column label="生产类型" align="center" prop="productionType">
                    <template slot-scope="scope">{{ returnNameData(productType, scope.row.productionType) }}</template>
                </el-table-column>
                <el-table-column label="电商商品编码" align="center" prop="marketingOrderCode" />
                <el-table-column label="描述" align="center" prop="description" />
                <!-- <el-table-column label="身份证验证" align="center" prop="checkIdentity">
                    <template slot-scope="scope">{{ returnNameData(dictData, scope.row.checkIdentity) }}</template>
                </el-table-column> -->
                <el-table-column label="操作" align="left" :width="200" class-name="small-padding" fixed="right">
                    <template slot-scope="scope">
                        <el-link :underline="false" size="mini" type="text" @click="handleCheck(scope.row, 1)">详情</el-link>
                        <el-link :underline="false" size="mini" type="text" @click="handleCheck(scope.row, 0)">修改</el-link>
                        <el-link :underline="false" size="mini" type="text" @click="handleProduct(scope.row)">产品配置</el-link>
                        <el-link :underline="false" size="mini" type="text" @click="handleLink(scope.row)">下单链接</el-link>
                        <el-link :underline="false" size="mini" type="text" @click="handleBanner(scope.row)">生成海报</el-link>
                        <el-popconfirm title="确定删除？" @confirm="handleDelect(scope.row)">
                            <el-link :underline="false" size="mini" type="text" slot="reference">删除</el-link>
                        </el-popconfirm>
                        <el-popconfirm :title="'确定更改为' + (scope.row.productionType == 1 ? '手动提交' : '自动提交') + '？'"
                            @confirm="handleCheckType(scope.row)">
                            <el-link :underline="false" size="mini" type="text" slot="reference">
                                {{ scope.row.productionType == 1 ?
                                    '手动提交' : '自动提交' }}
                            </el-link>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="140px">
                <el-form-item label="产品编码" prop="productCode">
                    <el-select clearable v-model="form.productCode" style="width: 100%">
                        <el-option v-for="(item, index) of productList" :key="index" :label="item.productName"
                            :value="item.productCode">{{
                                item.productName }}</el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="海报" :visible.sync="open1" width="500" append-to-body v-if="open1">
            <div class="banner" id="banner">
                <img :src="imageUrl" v-if="imageUrl" class="imageUrl" />
                <img v-if="base64Image" :src="base64Image" alt="Base64 图片" />
                <img class="mainImage" :src="row.mainImage || BannerImg" alt="" @load="onImageLoad">
                <div class="qrcode_box">
                    <div class="qrcode_text">长按扫码立即办理</div>
                    <div ref="qrcode" class="qrcode" id="qrcodeBox"></div>
                </div>
            </div>
            <div class="tips">右键保存图片推广</div>
        </el-dialog>
        <el-dialog title="下单链接" :visible.sync="open2" width="500" append-to-body v-if="open2">
            <div>默认生成的链接</div>
            <div class="bg_box">
                <div>下单链接地址：http://xyy.jxschot.com/mobile-haoka/index.html?id= {{ row.goodsId }}&companyId={{ companyId }}</div>
                <el-button type="primary" v-clipboard:copy="'http://xyy.jxschot.com/mobile-haoka/index.html?id=' + row.goodsId + '&companyId=' + companyId"
                    v-clipboard:success="clipboardSuccess">复制链接</el-button>
                <el-button type="primary" @click="openLink(row)">打开链接</el-button>
                <div ref="qrcode1" class="qrcode1" id="qrcodeBox1"></div>
            </div>
        </el-dialog>
        <ProductModal v-if="modalData.open" @cancel="modalCancel" @submit="modalSubmit" />
    </div>
</template>

<script>
import { getList, add, edit, handleDelete, bindProduct ,companyInfo} from "@/api/goods/kr-index";
import { returnName } from "@/utils/index.js";
import { productType, productStatusData, dictData } from '@/utils/printData';
import * as productApi from "@/api/product/index";
import QRCode from 'qrcodejs2';
import html2canvas from 'html2canvas';
import BannerImg from '@/assets/banner.png';
import ProductModal from './productModal.vue';

export default {
    name: "krGoods",
    components: { ProductModal },
    data() {
        return {
            BannerImg,
            // 遮罩层
            loading: true,
            // 导出遮罩层
            exportLoading: false,
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
            // 商品信息表格数据
            list: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                queryParameters: {
                    // goodsName: '',
                    // goodsCode: ''
                }
            },
            productType,
            productStatusData,
            dictData,
            title: "",
            open: false,
            form: {
                productCode: ''
            },
            rules: {
                productCode: [{ required: true, message: "产品编码不能为空", trigger: "blur" }],
            },
            productList: [],
            row: {
                mainImage: ''
            },
            open1: false,
            open2: false,
            qrcode: null,
            qrcode1: null,
            imageUrl: null,
            base64Image: '',
            modalData: {
                open: false,
            },
            companyId: '',

        };
    },
    activated() {
        this.getProduct();
        this.getList();
    },
    methods: {
        modalCancel() {
            this.modalData.open = false;
        },
        modalSubmit(e) {
            const { productCode, productName } = e;
            this.form.productCode = productCode;
            // this.form.productName = productName;
            bindProduct(this.form);
            this.getList();
            this.modalCancel();
        },
        onImageLoad() {
            console.log('加载完成')
        },
        getProduct() {
            productApi.getList({
                pageNo: 1,
                pageSize: 50
            }).then(response => {
                this.productList = response.data.records
            });
            companyInfo().then(response => {
                this.companyId = response.data.companyId;
            });
        },
        handleProduct(row) {
            this.form = {
                goodsId: row.goodsId
            }
            this.title = '产品配置';
            // this.open = true;
            this.modalData.open = true;
        },
        clipboardSuccess() {
            this.$message({
                message: '地址复制成功!请浏览器打开',
                type: 'success'
            });
        },
        /** 下单链接 */
        handleLink(row) {
            this.row = row;
            this.open2 = true;
            this.$nextTick(() => {
                new QRCode(this.$refs.qrcode1, {
                    width: 120,
                    height: 120,
                    text: 'http://8.155.36.216/dianxin-h5/index.html#/?id=' + row.goodsId + '&companyId=' + this.companyId,
                })
            })
        },
        openLink(row) {
            window.open('http://8.155.36.216/dianxin-h5/index.html#/?id=' + row.goodsId + '&companyId=' + this.companyId)
        },
        /**生成海报 */
        handleBanner(row) {
            this.row = row;
            this.imageUrl = '';
            this.open1 = true;
            this.$nextTick(() => {
                new QRCode(this.$refs.qrcode, {
                    width: 120,
                    height: 120,
                    text: 'http://xyy.jxschot.com/mobile-haoka/index.html?id=' + row.goodsId + '&companyId=' + this.companyId,
                })
                this.$nextTick(() => {
                    const element = document.getElementById('banner'); // 需要生成图片的DOM元素的ID
                    html2canvas(element, { useCORS: true }).then((canvas) => {
                        this.imageUrl = canvas.toDataURL('image/png');
                    });
                },)
            })
        },
        handleStatusChange(row) { },
        returnNameData(list, target, value, name) {
            return returnName(list, target, value, name);
        },
        submitForm() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    bindProduct(this.form)
                    this.cancel();
                }
            });
        },
        cancel() {
            this.open = false;
        },
        /** 查询商品信息列表 */
        getList() {
            this.loading = true;
            const { pageNum, pageSize } = this.queryParams;
            const pageReq = { pageNo: pageNum, pageSize: pageSize };
            const query = { ...this.queryParams, pageNum: undefined, pageSize: undefined, ...pageReq };
            getList(query).then(response => {
                const { records, total } = response.data
                this.list = records;
                this.total = total;
                this.loading = false;
            });
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
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.$router.push({ path: "/krgoods/detail" });
        },
        /** 查看按钮操作 */
        handleCheck(row, target) {
            const id = row.goodsId;
            this.$router.push({ path: "/krgoods/detail", query: { id, target } });
        },
        handleDelect(row) {
            handleDelete(row.goodsId)
                .then((res) => {
                    this.getList();
                    this.$modal.msgSuccess("删除成功");
                })
        },
        // 修改生产类型
        handleCheckType(row) {
            row.productionType = row.productionType == 1 ? 0 : 1;
            edit(row).then((res) => {
                this.getList();
                this.$modal.msgSuccess("修改成功");
            })
        },
    }
};
</script>
<style>
.cell {

    .el-button+span,
    span+span {
        margin-left: 10px;
    }
}

.banner {
    background-color: #fff;
    width: 350px;
    margin: 0 auto;
    position: relative;

    .imageUrl {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 999;
        width: 350px;
    }

    .mainImage {
        width: 350px;
    }

    .qrcode_box {
        margin-top: 20px;
        color: #000;
        text-align: center;
        padding: 0 20px 40px;

        .qrcode_text {
            float: right;
            line-height: 120px;
        }
    }
}

.tips {
    color: red;
    width: 350px;
    margin: 0 auto;
}

.mainImage1 {
    width: 100%;
    height: 80px;
}

.bg_box {
    background-color: #ededed;
    padding: 20px;
    margin-top: 10px;
    text-align: center;

    button {
        margin-top: 20px;
    }

    .qrcode1 {
        width: 120px;
        margin: 20px auto;
    }
}
</style>

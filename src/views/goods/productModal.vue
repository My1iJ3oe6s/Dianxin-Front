<template>
    <el-dialog title="产品选择" visible>
        <el-table :data="list" @selection-change="handleSelectionChange" ref="multipleTable">
            <el-table-column property="productCode" width="55">
                <template slot-scope="scope">
                    <el-radio v-model="radio" :label="scope.row.productCode"> </el-radio>
                </template>
            </el-table-column>
            <el-table-column property="productId" label="id"></el-table-column>
            <el-table-column property="productCode" label="产品编码"></el-table-column>
            <el-table-column property="productName" label="产品名称" width="300"></el-table-column>
            <el-table-column property="isNumbered" label="是否选号">
                <template slot-scope="scope">
                    {{ scope.row.isNumbered == 1 ? '是' : '否' }}
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import * as productApi from "@/api/product/index";
export default {
    data() {
        return {
            open: true,
            list: [],
            radio: ''
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        getList() {
            productApi.getList({
                pageNo: 1,
                pageSize: 50
            }).then(response => {
                this.list = response.data.records
            });
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val;
        },
        submitForm() {
            if (!this.radio) {
                this.$message({
                    message: '请先选择产品！',
                    type: 'error'
                });
                return
            }
            const value = this.list.filter(v => v.productCode == this.radio)?.[0];
            this.$emit('submit',value);
        },
        cancel() {
            this.$emit('cancel');
        },
    }
}

</script>
<style>
.el-radio__label {
    display: none;
}
</style>
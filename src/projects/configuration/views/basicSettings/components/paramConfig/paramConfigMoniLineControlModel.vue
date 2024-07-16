<!-- 基础参数 -->
<template>
    <div class="paramConfigIntake">
        <div>
            <el-form-item label="参数值" prop="paramValueCopy">
            </el-form-item>
            <div class="flex-1" style="padding-left: 100px">
                <el-form :label-position="'right'" label-width="118px" :model="paramValueCopy">
                    <el-form-item label="曲线控制">
                        <el-select filterable v-model="paramValueCopy.lineType" placeholder="请选择" :value-key="'value'" style="width:calc(100% - 20px)" >
                            <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <template v-if="!paramValueCopy.lineType || paramValueCopy.lineType=='1'">
                        <el-form-item label="控制模式">
                            <el-select filterable v-model="paramValueCopy.mode" placeholder="请选择" :value-key="'value'" style="width:calc(100% - 20px)">
                                <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="断开连接事件" style="letter-spacing: -1px;">
                            <v-select-mon filterable v-if="tableData.length>0" clearable multiple v-model="paramValueCopy.dis" :options="tableData"  :settingOption="{optionDisabled:1}"
                                        style="width:calc(100% - 20px)">
                            </v-select-mon>
                        </el-form-item>
                        <el-form-item label="重新连接事件">
                            <v-select-mon filterable v-if="tableData.length>0" clearable multiple v-model="paramValueCopy.con" :options="tableData"  :settingOption="{optionDisabled:1}"
                                        style="width:calc(100% - 20px)">
                            </v-select-mon>
                        </el-form-item>
                    </template>

                </el-form>
            </div>
            <template v-if="paramValueCopy.lineType=='2'">
            <div>
                <el-button class="fr m-b10" type="primary" size="small" @click="addData">新增</el-button>
            </div>
            <el-table :data="newEventData" height="280px" border class="m-b10" ref="table">
                <el-table-column prop="mode" label="控制模式">
                    <template slot-scope="scope">
                        <el-select filterable v-model="scope.row.mode" placeholder="请选择" :value-key="'value'" style="width:calc(100% - 20px)">
                            <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="moniitemCodes" label="控制监护项">
                    <template slot-scope="scope">
                        <el-select
                            filterable
                            clearable
                            multiple
                            v-model="scope.row.moniitemCodes"
                            placeholder="请选择"
                            @focus="()=>selectFocusFc(scope.row.moniitemCodes)"
                            :filter-method="(val)=>filterMethod(scope.row.moniitemCodes,val)"
                            :value-key="'moniitemCode'"
                            style="width:100%"
                            >
                            <el-option
                                v-for="item in moniitemDictList"
                                :key="item.moniitemCode"
                                :label="item.moniitemName"
                                :value="{moniitemCode:item.moniitemCode,moniitemName:item.moniitemName}"
                                :disabled="item.statusDict == '0'"
                            >{{item.moniitemName+'('+item.moniitemCode+')'}}</el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="dis" label="断开连接事件" width="120">
                    <template slot-scope="scope">
                        <v-select-mon filterable v-if="tableData.length>0" clearable  v-model="scope.row.dis" :options="tableData" :settingOption="{optionDisabled:1}"
                            style="width:calc(100% - 20px)">
                        </v-select-mon>
                    </template>

                </el-table-column>
                <el-table-column prop="con" label="重新连接事件" width="120">
                    <template slot-scope="scope">
                        <v-select-mon filterable v-if="tableData.length>0" clearable  v-model="scope.row.con" :options="tableData" :settingOption="{optionDisabled:1}"
                            style="width:calc(100% - 20px)">
                        </v-select-mon>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="50px">
                    <template slot-scope="scope">
                        <el-button class="redCss" type="text" @click="deleteData(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        </div>
    </div>
</template>
<script>
import {
    config_monitoringEvent_listPage,
    moniitem_multipleListPage // 监护数据
} from '@/api/configuration'
export default {
    name: 'ParamConfigIntake',
    components: {},
    data: function () {
        return {
            option: [
                { value: '1', label: '按事件控制断开与重连' },
                { value: '2', label: '按事件控制断开自动重连' }
            ],
            type: [
                { value: '1', label: '所有曲线控制' },
                { value: '2', label: '部分曲线控制' }
            ],
            tableData: [],
            paramValueCopy: {},
            newEventData: [],
            moniitemDictList: []

        }
    },
    props: {
        paramValue: {}
    },
    watch: {
        string: {
            handler: function (n) {
                this.paramValueCopy = JSON.parse(JSON.parse(n))
                if (!this.paramValueCopy.lineType) { // 兼容老数据 新增参数
                    this.$set(this.paramValueCopy, 'lineType', '1')
                } else if (this.paramValueCopy.lineType == '2') {
                    this.newEventData = JSON.parse(JSON.stringify(this.paramValueCopy.eventList))
                }
            },
            immediate: true,
            deep: true
        }
    },
    computed: {
        string() {
            return JSON.stringify(this.paramValue)
        }
    },
    created: async function () {
        const tableData = await config_monitoringEvent_listPage({ 'searchKey': '', 'pageNum': 1, 'pageSize': 1000 })
        this.tableData = tableData.data.result.map(v => {
            v.moniitemCode = v.eventCode
            v.moniitemName = v.eventName
            return v
        })
        if (this.paramValueCopy.lineType == '2') {
            this.newEventData = JSON.parse(JSON.stringify(this.paramValueCopy.eventList))
            this.multipleListPageFc(this.newEventData[0].moniitemCodes.map(item => item.moniitemCode))
        }
        this.$nextTick(() => {
            this.$refs?.table?.doLayout()
        })
    },
    mounted() { },
    methods: {
        change() {
            return new Promise((resolve, reject) => {
                let message = ''
                if (this.paramValueCopy.lineType && this.paramValueCopy.lineType == '2') {
                    this.newEventData.forEach(item => {
                        if (item.mode == '') {
                            message = '请选择控制模式'
                        }
                        if (item.dis == '') {
                            message = '请选择“' + item.moniitemCodes.map(v => v.moniitemName).toString() + '”断开连接的事件'
                        }
                        if (item.mode == '1' && item.con == '') {
                            message = '请选择“' + item.moniitemCodes.map(v => v.moniitemName).toString() + '”重新连接的事件'
                        }
                    })

                    this.paramValueCopy.eventList = this.newEventData
                } else {
                    if (this.paramValueCopy.mode == '') {
                        message = '请选择控制模式'
                    }
                    if (this.paramValueCopy.dis == '') {
                        message = '请选择断开连接的事件'
                    }
                    if (this.paramValueCopy.mode == '1' && this.paramValueCopy.con == '') {
                        message = '请选择重新连接的事件'
                    }
                }
                // 校验数据
                if (message != '') {
                    this.$message.error(message)
                    reject()
                } else {
                    this.$emit('update:paramValue', JSON.stringify(this.paramValueCopy))
                    resolve()
                }
            })
        },
        /**
         * 部分重连数据
         */
        addData() {
            this.newEventData.unshift({
                mode: '',
                moniitemCodes: [],
                dis: '',
                con: ''
            })
            this.$nextTick(() => {
                this.$refs?.table?.doLayout()
            })
        },
        deleteData(index) {
            this.newEventData.splice(index, 1)
            this.$nextTick(() => {
                this.$refs?.table?.doLayout()
            })
        },
        /**
         * 下拉框搜索方法
         */
        filterMethod(list, val) {
            const code = []
            list.map(i => {
                code.push(i.moniitemCode)
            })
            // 获取监护数据
            this.multipleListPageFc(code.length > 0 ? code : [], val)
        },
        /**
         * 下拉框选择的时候
         */
        selectFocusFc(list) {
            const code = []
            list.map(i => {
                code.push(i.moniitemCode)
            })
            // 获取监护数据
            this.multipleListPageFc(code.length > 0 ? code : [])
        },
        /**
         * 获取监护数据
         */
        async multipleListPageFc(code, val) {
            const res = await moniitem_multipleListPage({
                moniitemCodes: code, // 本条数据放第一条查询出来
                statusDict: '1', // 查询启用的
                searchKey: val || '', // 搜索条件
                moniitemTypeDicts: '1001',
                moniitemValueTypeDict: '1'
            })
            // 获取监护项字典数据
            this.moniitemDictList = res.data.result
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-form-item__label {
    padding: 0;
    width: 118px !important;
    margin-right: 12px;
}
</style>

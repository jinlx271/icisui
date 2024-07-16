<!-- 元数据设置 -->
<template>
  <div id="dataMetaConfig">
    <el-container style="height:100%">
      <!-- 头部 -->
      <el-header height="50" class="inputclass">
        <el-form ref="addRoleFrom" :inline="true" :model="queryData" label-width="120px" status-icon>
          <el-form-item>
            <el-input @keyup.enter.native="init" @input="debounceFC" v-model="queryData.searchKey" size="small"
              placeholder="数据编码/名称" clearable suffix-icon="el-icon-search"></el-input>
          </el-form-item>
          <el-form-item class="flex-1 my_white-space_nowrap" label="数据类型">
            <el-select @change="debounceFC" v-model="queryData.dataType" placeholder="请选择" clearable>
              <el-option v-for="(item, index) in assessMetaType" :key="item.dictName + index" :value="item.dictCode"
                :label="item.dictName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="flex-1 my_white-space_nowrap" label="是否关联字典">
            <el-select @change="debounceFC" v-model="queryData.dictLink" placeholder="请选择" clearable>
              <el-option v-for="(item, index) in metaDictLink" :key="item.dictName + index" :value="item.dictCode"
                :label="item.dictName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="queryData.statusDict" true-label="" false-label="1" @input="debounceFC">
              显示禁用
            </el-checkbox>
          </el-form-item>
        </el-form>
        <div>
          <el-button size="mini" @click.native.prevent="init" type="primary">查 询</el-button>
          <el-button size="mini" @click.native.prevent="showAddDialog" type="primary">新 增</el-button>
        </div>
      </el-header>
      <!-- 表格 -->
      <el-main v-if="totolCount != 0" style="height:calc(100% - 112px)">
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          height="100%" element-loading-text="加载中" v-loading="loading" ref="tableData"
          :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''" :data="tableData" highlight-current-row fit
          border row-key="id">
          <v-table-column prop="metaCode" label="数据编码" align="left"></v-table-column>
          <v-table-column prop="metaName" label="数据名称" align="left"></v-table-column>
          <v-table-column prop="metaAbbr" label="数据简称" align="left"></v-table-column>
          <v-table-column prop="dataType" label="数据类型" align="left" width="100px">
            <template slot-scope="scope">
              <span>{{ assessMetaTypeFc(scope.row.dataType) }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="sourceType" label="数据来源" align="left" width="100px">
            <template slot-scope="scope">
              <span>{{ metaSourceFc(scope.row.sourceType) }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="conditionity" label="是否条件性元数据" align="left" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.conditionity=='1'?'是':'否' }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="dictLink" label="是否关联字典" align="left" width="100px">
            <template slot-scope="scope">
              <span>{{ metaDictLinkFc(scope.row.dictLink) }}</span>
            </template>
          </v-table-column>
          <v-table-column prop="dictGroupCode" label="字典编码" align="left"></v-table-column>
          <v-table-column prop="dictGroupName" label="字典分类名称" align="left"></v-table-column>
          <v-table-column prop="dataSourceName" label="关联数据源名称" align="left">
            <template slot-scope="scope">
              <span v-for="item in scope.row.dataSources" :key="item.sourceName">({{ item.sourceName }})</span>
            </template>
          </v-table-column>
          <v-table-column prop="dictLink" label="操作" align="center" width="100px">
            <template slot-scope="scope">
              <el-button @click.native.prevent="enableOrDisable(scope.row, scope.$index)"
                :style="{ color: scope.row.statusDict == 1 ? '#EC0000' : '#00AB44' }" type="text"
                size="mini">{{+scope.row.statusDict ? '禁用' : '启用' }}</el-button>
              <el-button @click.native.prevent="editTable(scope.row, scope.$index)" style="color:#E6A23C" type="text"
                size="mini">修改</el-button>
            </template>
          </v-table-column>
        </el-table>
      </el-main>
      <el-empty v-else description="暂无数据" style="height:calc(100% - 112px)"></el-empty>
      <!-- 分页 -->
      <el-footer>
        <el-pagination v-if="totolCount != 0" @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="queryData.pageNum" :total="totolCount" :page-sizes="[10, 15, 20, 25, 30]"
          :page-size="queryData.pageSize" :hide-on-single-page="false" layout="total, sizes, prev, pager, next"
          class="pagination" background></el-pagination>
      </el-footer>
    </el-container>
    <!-- 新增修改弹框 -->
    <el-dialog :close-on-click-modal="false" :title="addOrEidt ? '新增弹框' : '修改弹框'" :visible.sync="addDialog" width="900px"
      :before-close="addCancel">
      <el-form ref="addData" :rules="rules" :model="addData" label-position="right" label-width="140px">
        <el-form-item label="元数据编码" prop="metaCode">
          <el-input v-model="addData.metaCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="元数据名称" prop="metaName">
          <el-input v-model="addData.metaName" placeholder="请输入" ></el-input>
        </el-form-item>
        <el-form-item label="元数据简称" prop="metaAbbr">
          <el-input v-model="addData.metaAbbr" placeholder="请输入" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="元数据类型" prop="dataType">
          <el-select @change="dataTypeFc" v-model="addData.dataType" placeholder="请选择" style="width:100%">
            <el-option v-for="item in assessMetaType" :key="item.dictCode" :value="item.dictCode"
              :disabled="item.statusDict == '0'" :label="item.dictName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="元数据来源" prop="sourceType">
          <el-select v-model="addData.sourceType" placeholder="请选择" style="width:100%">
            <el-option v-for="item in metaSource" :key="item.dictCode" :value="item.dictCode"
              :disabled="item.statusDict == '0'" :label="item.dictName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否条件性元数据" prop="conditionity">
          <el-select  v-model="addData.conditionity" placeholder="请选择" style="width:100%">
            <el-option v-for="item in flagList" :key="item.dictCode" :value="item.dictCode"
              :disabled="item.statusDict == '0'" :label="item.dictName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dataTypeFlag" label="是否关联字典值" prop="dictLink">
          <el-select @change="dictLinkFc" v-model="addData.dictLink" placeholder="请选择" style="width:100%">
            <el-option v-for="item in metaDictLink" :key="item.dictCode" :value="item.dictCode"
              :disabled="item.statusDict == '0'" :label="item.dictName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dictLinkFlag && dataTypeFlag" label="关联字典组" prop="dictGroupCode">
          <div class="flex">
            <el-select @change="dictGroupCodeFc(addData.dictGroupCode, '')" v-model="addData.dictGroupCode"
              :filter-method="(val) => filterData(val)" @focus="dictGroupCodeList = [...dictGroupCodeListAll]" clearable
              filterable placeholder="请选择" style="flex:1;">
              <el-option v-for="(item) in dictGroupCodeList" :disabled="item.statusDict == '0'" :key="item.groupCode"
                :value="item.groupCode" :label="item.groupName"></el-option>
            </el-select>
            <el-button type="primary" v-hasPermi="['configuration:basicSettings:dictConfig']"
              @click="clickAddDictionary">新增</el-button>
          </div>
        </el-form-item>
        <el-form-item
          v-if="(addData.dictGroupCode !== '' && dictLinkFlag && dataTypeFlag) || addData.dataType == 'wn-input' || addData.dataType == 'wn-score'"
          label="关联数据源" key="dataSourcesList" prop="dataSourcesList">
          <el-select @remove-tag="removeTagDataSourceFc" @clear="clearDataSourceFc" @change="clearDataSourcechangeFc"
            v-model="addData.dataSourcesList" placeholder="请选择" filterable clearable multiple style="width:100%">
            <el-option v-for="item in dataSource" :key="item.sourceCode" :value="item.sourceCode" :label="item.sourceName"
              :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="addData.dataType == 'wn-radio'" label="取分规则" prop="takeValueMode">
          <el-select v-model="addData.takeValueMode" placeholder="请选择" clearable style="width:100%">
            <el-option :value="'1'" label="自动勾选最大值"></el-option>
            <el-option :value="'0'" label="自动勾选最小值"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template v-if="addData.dictGroupCode !== '' && dictLinkFlag && dataTypeFlag">
        <el-table
          @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
          ref="addDataScoreDictItems" :data="addData.scoreDictItems" highlight-current-row fit border height="250px"
          style="width:100%;overflow: auto;margin-bottom:10px;">
          <v-table-column prop="dictCode" label="字典编码" align="left"></v-table-column>
          <v-table-column prop="dictName" label="字典名称" align="left"></v-table-column>
          <v-table-column prop="itemScore" label="附分数" align="left">
            <template slot-scope="scope">
              <el-input type="number" :min="-999" :max="999" v-model="scope.row.itemScore" placeholder="请输入"
                style="width:100%" />
            </template>
          </v-table-column>
          <v-table-column prop="itemText" label="附文字" align="left">
            <template slot-scope="scope">
              <el-input v-model="scope.row.itemText" placeholder="请输入" maxlength="20"></el-input>
            </template>
          </v-table-column>
          <v-table-column prop="itemDesc" label="附说明" align="left">
            <template slot-scope="scope">
              <el-input v-model="scope.row.itemDesc" maxlength="200" placeholder="请输入"></el-input>
            </template>
          </v-table-column>
          <v-table-column prop="imageUrl" label="附图片" align="left" width="70px">
            <template slot-scope="scope">
              <el-upload :action="uploadImageApi" :headers="importHeaders" class="avatar-uploader" :show-file-list="false"
                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" name="imgFile">
                <div class="uploadImgCssDiv" slot="tip" v-if="scope.row.imageUrl">
                  <i class="el-icon-circle-close iconTransform" @click="uploadDelete(scope.$index)"></i>
                  <img class="avatar" @click="handlePictureCardPreview(scope.$index)"
                    :src="uploaApi + scope.row.imageUrl" />
                </div>
                <i v-else slot="trigger" @click="addIndex(scope.$index)" class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </template>
          </v-table-column>
          <v-table-column  label="图片效果" align="center" width="120px">
            <template slot-scope="scope">
                <div v-if="scope.row.positionCode=='1'&&scope.row.imageUrl" >
                  <div class="flex flex-ver r_c_center">
                   <img class="avatar" :src="uploaApi + scope.row.imageUrl" :style="{zoom:scope.row.scale}"/>
                   <span>{{scope.row.dictName}}</span>
                  </div>
                </div>
                <div v-else-if="scope.row.positionCode=='2'&&scope.row.imageUrl">
                  <div class="flex flex-ver r_c_center">
                   <span >{{scope.row.dictName}}</span>
                   <img  :src="uploaApi + scope.row.imageUrl" :style="{zoom:scope.row.scale}"/>
                  </div>
                </div>
                <div v-else-if="scope.row.positionCode=='3'&&scope.row.imageUrl">
                  <div class="flex r_c_center">
                   <img class="avatar" :src="uploaApi + scope.row.imageUrl" :style="{zoom:scope.row.scale}"/>
                   <span>{{scope.row.dictName}}</span>
                  </div>
                </div>
                <div v-else-if="scope.row.positionCode=='4'&&scope.row.imageUrl">
                  <div class="flex r_c_center">
                   <span>{{scope.row.dictName}}</span>
                   <img class="avatar" :src="uploaApi + scope.row.imageUrl" :style="{zoom:scope.row.scale}"/>
                  </div>
                </div>

            </template>
          </v-table-column>
          <v-table-column prop="positionCode" label="图片位置" align="left" width="80px">
            <template slot-scope="scope">
              <el-select v-model="scope.row.positionCode" >
                <el-option v-for="dict in ICIS_DICT_ASSESS_IMAGE_POSITION" :label="dict.dictName" :value="dict.dictCode" :key="dict.dictCode"></el-option>
              </el-select>
            </template>
          </v-table-column>
          <v-table-column prop="scale" label="图片大小" align="left" width="150px">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.scale" :min="0.1" :max="10" :precision="1" :step="0.1"></el-input-number>
            </template>
          </v-table-column>
          <v-table-column v-if="addData.dataSourcesList.length > 0" prop="dictGroup" label="关联数据映射规则" align="left"
            width="250px">
            <template slot-scope="scope">
              <span>{{ scope.row.ruleExpression }}</span>
            </template>
          </v-table-column>
          <v-table-column v-if="addData.dataSourcesList.length > 0" prop="dictGroup" label="规则操作" align="left">
            <template slot-scope="scope">
              <el-button @click.native.prevent="expressionFc(scope.row, scope.$index)" type="text"
                size="mini">配置规则</el-button>
              <el-button @click.native.prevent="expressionDeleteFc(scope.row, scope.$index)" style="color:#F56C6C"
                type="text" size="mini">删除规则</el-button>
            </template>
          </v-table-column>
        </el-table>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel">取消</el-button>
        <el-button type="primary" @click="addSave">保存</el-button>
      </span>
    </el-dialog>
    <!-- 表达式 -->
    <el-dialog :close-on-click-modal="false" title="表达式填写" :visible.sync="expressionVisible" width="700px"
      :before-close="expressionHide">
      <div class="expressionDiv">
        <span>表达式中文</span>：
        <el-input readonly="readonly" v-model="expressionData.expressionName" placeholder="显示的表达式,无法修改!" />
      </div>
      <div class="expressionDiv" v-for="item in ruleDataSource" :key="item.sourceName">
        <span>{{ item.sourceName }}</span>：
        <el-input type="text" v-model="expressionData[item.sourceCode]" placeholder="请输入" />
      </div>
      <el-table
        @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
        ref="expressionDataList" :data="expressionData.list" highlight-current-row fit border height="400px"
        style="width:100%;overflow: auto;">
        <v-table-column prop="index" label="序号" width="40">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </v-table-column>
        <v-table-column prop="bracketsLeft" label="括号" width="50">
          <template slot-scope="scope">
            <el-select v-model="scope.row.bracketsLeft" placeholder="请选择" clearable>
              <el-option value="(" label="("></el-option>
              <el-option value=")" label=")"></el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column prop="dataSources" label="映射数据" width="105">
          <template slot-scope="scope">
            <el-select v-model="scope.row.dataSources" placeholder="请选择" clearable>
              <el-option v-for="item in ruleDataSource" :key="item.sourceCode" :value="item.sourceCode"
                :label="item.sourceName"></el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column prop="expression" label="运算符" width="105">
          <template slot-scope="scope">
            <el-select v-model="scope.row.expression" placeholder="请选择" clearable>
              <el-option v-for="item in expressionList" :key="item.name" :value="item.name"
                :label="item.name"></el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column prop="text" label="内容" align="left">
          <template slot-scope="scope">
            <el-input type="text" v-model="scope.row.text" placeholder="请输入" />
          </template>
        </v-table-column>
        <v-table-column prop="bracketsRight" label="括号" width="50">
          <template slot-scope="scope">
            <el-select v-model="scope.row.bracketsRight" placeholder="请选择" clearable>
              <el-option value="(" label="("></el-option>
              <el-option value=")" label=")"></el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column prop="rule" label="规则" width="105">
          <template slot-scope="scope">
            <el-select v-model="scope.row.rule" placeholder="请选择" clearable>
              <el-option value="&&" label="且"></el-option>
              <el-option value="||" label="或"></el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column label="操作" width="105">
          <template slot-scope="scope">
            <el-button size="mini" @click.native.prevent="expressionAdd(scope.row, scope.$index)"
              icon="el-icon-plus"></el-button>
            <el-button size="mini" @click.native.prevent="expressionDelete(scope.row, scope.$index)"
              icon="el-icon-delete"></el-button>
          </template>
        </v-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="expressionHide">取消</el-button>
        <el-button type="primary" @click="answerFc">校 验</el-button>
        <el-button v-if="ruleShow" type="primary" @click="expressionSave">保存</el-button>
      </span>
    </el-dialog>
    <!-- 图片放大放小 -->
    <el-dialog title="放大图" :visible.sync="dialogVisible">
      <img width="100%" :src="uploaApi + dialogImageUrl" alt />
    </el-dialog>
    <!-- 新增字典分组 -->
    <el-dialog :close-on-click-modal="false" title="新增字典分组" class="addDictionary" :visible.sync="addDictionaryVisible"
      width="800px" :before-close="addDictionaryHide">
      <el-form ref="addDictionary" :model="addDictionaryData" label-width="80px" :rules="addDictionaryRules">
        <el-form-item label="编码" prop="groupCode">
          <el-input v-model="addDictionaryData.groupCode" :readonly="isAddDictionaryTerm" placeholder="请输入"
            maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="groupName">
          <el-input v-model="addDictionaryData.groupName" :readonly="isAddDictionaryTerm" placeholder="请输入"
            maxlength="64"></el-input>
        </el-form-item>
      </el-form>
      <div style="height:40px;text-align: right;">
        <el-button v-if="!isAddDictionaryTerm" @click="addDictionaryHide">取消</el-button>
        <el-button v-if="!isAddDictionaryTerm" type="primary" @click="addDictionarySave">保存</el-button>
        <el-button v-if="isAddDictionaryTerm" type="primary" v-hasPermi="['configuration:basicSettings:dictConfig']"
          @click="addDictionaryTerm">添加字典项</el-button>
      </div>
      <el-table
        @header-dragend="(newWidth, oldWidth, column, event) => $headerdragend(newWidth, oldWidth, column, event, $refs)"
        ref="tableDataTwo" :data="tableDataTwo" highlight-current-row fit border height="400px"
        :row-class-name="({ row }) => row.statusDict == 0 ? 'disabled' : ''" style="width:100%;overflow: auto;">
        <v-table-column prop="dictCode" label="编码">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.dictCode" placeholder="请输入" clearable
              :disabled="!scope.row.isCreate" maxlength="64"> </el-input>
            <span v-else>{{ scope.row.dictCode }}</span>
          </template>
        </v-table-column>
        <v-table-column prop="dictName" label="名称">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.dictName" placeholder="请输入" clearable maxlength="300"
              :disabled="!scope.row.isEdit"> </el-input>
            <span v-else>{{ scope.row.dictName }}</span>
          </template>
        </v-table-column>
        <v-table-column prop="dictAbbr" label="简称">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.dictAbbr" placeholder="请输入" clearable
              :disabled="!scope.row.isEdit"> </el-input>
            <span v-else>{{ scope.row.dictAbbr }}</span>
          </template>
        </v-table-column>
        <v-table-column prop="pinyin" label="拼音"></v-table-column>
        <v-table-column prop="wubi" label="五笔"></v-table-column>
        <v-table-column prop="sortNo" label="排序" width="120px">
          <template slot-scope="scope">
            <el-input-number v-if="scope.row.isEdit" v-model="scope.row.sortNo" placeholder="请输入" clearable
              :disabled="!scope.row.isEdit" size="mini" style="width:90px;"> </el-input-number>
            <span v-else>{{ scope.row.sortNo }}</span>
          </template>
        </v-table-column>
        <v-table-column prop="statusDict" label="状态" min-width="180px" align="center">
          <template slot-scope="scope">
            <el-switch v-if="scope.row.isEdit" v-model="scope.row.statusDict" active-value="1" inactive-value="0"
              active-text="已启用" inactive-text="已禁用"></el-switch>
            <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
          </template>
        </v-table-column>
        <v-table-column label="操作" width="220px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.isEdit" v-hasPermi="['configuration:basicSettings:dictConfig']"
              @click.native.prevent="modifyRow(scope.row, scope.$index)" type="text" size="small">修改</el-button>
            <el-button v-if="scope.row.isEdit" v-hasPermi="['configuration:basicSettings:dictConfig']" type="text"
              @click="cancelItemRow(scope.row, scope.$index)">取消</el-button>
            <el-button v-if="scope.row.isEdit" v-hasPermi="['configuration:basicSettings:dictConfig']" type="text"
              @click="saveItemRow(scope.row)">保存</el-button>
          </template>
        </v-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getCookie } from '@/utils/cookie' // 存储方式
import {
  metadata_listPage, // 列表
  metadata_add, // 新增
  metadata_update, // 修改
  metadata_delete, // 删除
  metadata_getById, // 单个修改的时候查询
  dictItem_findDictWithItemsByGroupCodes, // 字典
  dictGroup_getDictGroupList, // 字典值.可以传参区分
  dict_getItems, // 字典值带分值
  datasources_listVisibleDataSource, // 获取可见数据源列表
  metadata_enable, // 启用
  metadata_disable, // 禁用
  dict_deleteImg, // 图片删除
  dictGroup_insert, // 新增字典
  dictItem_getMaxSort,
  dictItem_insert, // 新增字典项
  dictItem_edit, // 修改字典项
  dictItem_findAllWithPage
} from '@/api/configuration'
import { frontFilter } from '@/utils'
import _ from 'lodash'
export default {
  name: 'DataMetaConig',
  components: {},
  data: function () {
    return {
      loading: false, // 表格的loding
      queryData: {
        statusDict: '',
        pageNum: 1, // 页码必传
        pageSize: 15, // 一页数量，必传
        searchKey: '', // 搜索关键字，非必传
        dataType: '', // 类型查询
        dictLink: '' // 查询是否关联字典
      },
      totolCount: 0, // 分页总量
      tableData: [], // 表格数据

      addOrEidt: true, // 新增还是修改
      editId: '', // 修改的id
      addDialog: false, // 新增弹框
      dictLinkFlag: false, // 是否关联字典值
      dataTypeFlag: false, // 选择类型
      addData: {
        metaCode: '', // 元数据编码（后续当做itemKey使用）
        metaName: '', // 元数据名称
        metaAbbr: '',
        conditionity: '0',
        dataType: '', // 元数据类型
        sourceType: '0', // 元数据来源(0：本地扩展；1：卫宁平台)
        dictLink: '0', // 是否关联字典值(0:不关联;1:关联)
        dictGroupCode: '', // 关联字典组编码，DICTLINK=1必填
        dataSourcesList: [], // 数据源的值
        scoreDictItems: [], // 字典关联分数
        takeValueMode: '' // 单选框 的时候 最大值 最小值的。
      }, // 新增弹框的对象
      rules: {
        metaCode: [
          { required: true, message: '请输入元数据编码', trigger: 'blur' }
        ],
        metaName: [
          { required: true, message: '请输入元数据名称', trigger: 'blur' }
        ],
        dataType: [
          { required: true, message: '请选择元数据类型', trigger: 'change' }
        ],
        sourceType: [
          { required: true, message: '请选择元数据来源', trigger: 'change' }
        ],
        dictLink: [
          { required: true, message: '请选择是否关联字典值', trigger: 'change' }
        ],
        dictGroupCode: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ]
      },
      assessMetaType: [], // 数据类型 ICIS_DICT_ASSESS_META_TYPE
      metaSource: [], // 数据来源 ICIS_DICT_META_SOURCE
      metaDictLink: [], // 是否管理字典 ICIS_DICT_META_DICT_LINK
      dictGroupCodeList: [], // 基础字典所以名字
      dictGroupCodeListAll: [], // 基础字典所以名字 全量
      dataSource: [], // 数据源
      oldDataSource: [], // 数据源
      ruleDataSource: [], // 已选的数据源

      expressionVisible: false, // 表达式 隐藏显示
      ruleShow: false, // 确定隐藏
      expressionData: {
        expressionName: '', // 规则显示
        expressionCode: '', // 规则编码
        list: []
      }, // 表达式 对象
      expressionList: [
        { name: '不包含' },
        { name: '包含' },
        { name: '等于' },
        { name: '不等于' },
        { name: '小于' },
        { name: '小于等于' },
        { name: '大于' },
        { name: '大于等于' }
      ], // 表达式
      oldDataSourcesList: [], // 旧数据源值值
      removeTagDataSource: false, // 单个删除的按钮
      removeTagDataSourceValue: '', // 单个删除的值
      clearDataSource: false, // 整体清除的按钮
      importHeaders: { 'X-Token': getCookie('token').tocken },
      uploaApi:
        process.env.NODE_ENV === 'production'
          ? globalConfig.PRO_BASE_API || './'
          : globalConfig.BASE_API,
      uploadImageApi:
        (process.env.NODE_ENV === 'production'
          ? globalConfig.PRO_BASE_API || './'
          : globalConfig.BASE_API) + 'assess/dict/uploadImg', // 请求接口
      oneIndex: {}, // 记录那个字典上传
      dialogImageUrl: '', // 放大缩小图
      dialogVisible: false, // 放大缩小事件
      addDictionaryVisible: false, // 新增字典分组 弹框
      // 字典分组数据
      addDictionaryData: {
        groupName: '',
        groupCode: '',
        dictGroupType: 3
      },
      isAddDictionaryTerm: false, // 新增字典项
      // 字典分组校验规则
      addDictionaryRules: {
        groupName: [
          { required: true, message: '请输入字典分组名称', trigger: 'blur' }
        ],
        groupCode: [
          { required: true, message: '请输入字典分组编码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value.startsWith('ICIS_DICT') || value.startsWith('HIS_DICT') || value.startsWith('ICIS_DICT_META')) {
                callback()
              } else {
                callback(new Error('请输入ICIS_DICT/HIS_DICT/ICIS_DICT_META为前缀的编码，英文大写'))
              }
            }, trigger: 'blur'
          }
        ]
      },
      tableDataTwo: [], // 右边表格数据
      // 当前行
      curRow: [],
      ICIS_DICT_ASSESS_IMAGE_POSITION: [],
      flagList: []
    }
  },
  props: {},
  filters: {},
  watch: {
    /**
     * 关联数据源：是否能修改
     */
    'addData.scoreDictItems': {
      deep: true,
      handler: function (val) {
        // 没有数据源选择 直接跳出去
        if (this.addData.dataSourcesList.length < 1 || val.length < 1) {
          return
        }
        // 清空数据源不能选的值
        this.dataSource.map(item => {
          item.disabled = false
        })
        // 遍历数据源 和 列表规则
        this.addData.dataSourcesList.map(item => {
          const sourceName = this.dataSource.filter(res => {
            return res.sourceCode == item
          })[0].sourceName
          val.map(item2 => {
            // 找出规则里面选了 数据源的值
            if (item2.ruleExpression.indexOf(sourceName) != -1) {
              // 设置不能选择
              for (let i = 0; i < this.dataSource.length; i++) {
                if (this.dataSource[i].sourceCode == item) {
                  this.$set(
                    this.dataSource,
                    i,
                    Object.assign(this.dataSource[i], {
                      disabled: true
                    })
                  )
                  break
                }
              }
            }
          })
        })
      }
    },
    /**
     * 映射规则表达式
     */
    'expressionData.list': {
      deep: true,
      handler: function (val) {
        this.expressionData.expressionName = ''
        this.expressionData.expressionCode = ''
        val.map(item => {
          // 页面展示的值
          this.expressionData.expressionName = `${this.expressionData.expressionName
            }${item.bracketsLeft}${this.dataSourcesFc(item.dataSources)}${item.expression
            }${item.text != '' ? ' "' + item.text + '" ' : ''}${item.bracketsRight
            }${item.rule != '' ? ' ' + item.rule + ' ' : ''}`
          this.expressionData.expressionCode = `${this.expressionData.expressionCode
            }${item.bracketsLeft}${this.dataSourcesFc(
              item.dataSources,
              'code'
            )}${this.expressionTextFc(item.expression, item.text)}${item.bracketsRight
            }${item.rule != '' ? ' ' + item.rule + ' ' : ''}`
        })
      }
    },
    'addData.dataSourcesList': {
      deep: true,
      handler: function (val) {
        if (this.removeTagDataSource) {
          // 单个删除的按钮
          this.dataSource.map(item => {
            if (
              this.removeTagDataSourceValue == item.sourceCode &&
              item.disabled
            ) {
              this.addData.dataSourcesList = this.oldDataSourcesList
              this.$message.error(
                '【关联数据源】在表格中有配置规则，无法删除！'
              )
            }
          })
          this.removeTagDataSource = false
        } else if (this.clearDataSource) {
          // 整体清除的按钮
          this.dataSource.map(item => {
            if (item.disabled) {
              this.addData.dataSourcesList = this.oldDataSourcesList
              this.$message.error(
                '【关联数据源】在表格中有配置规则，无法删除！'
              )
            }
          })
          this.clearDataSource = false
        } else {
          this.oldDataSourcesList = val
        }
      }
    },
    expressionData: {
      deep: true,
      handler: function (val) {
        this.ruleShow = false // 确定按钮隐藏
      }
    }
  },
  computed: {},
  async created() {
    // 截流
    this.debounceFC = _.debounce(() => {
      this.queryData.pageNum = 1 // 输入的时候需要改为第一页
      this.init() // 输入框截流
    }, 800)
    await this.queryCode(
      [
        'ICIS_DICT_ASSESS_META_TYPE', // 数据类型
        'ICIS_DICT_META_SOURCE', // 数据来源
        'ICIS_DICT_META_DICT_LINK', // 是否管理字典
        'ICIS_DICT_ASSESS_IMAGE_POSITION',
        'ICIS_DICT_FLAG'
      ],
      res => {
        this.assessMetaType = res.ICIS_DICT_ASSESS_META_TYPE // 数据类型
        this.metaSource = res.ICIS_DICT_META_SOURCE // 数据来源
        this.metaDictLink = res.ICIS_DICT_META_DICT_LINK // 是否管理字典
        this.flagList = res.ICIS_DICT_FLAG
        this.ICIS_DICT_ASSESS_IMAGE_POSITION = res.ICIS_DICT_ASSESS_IMAGE_POSITION
      }
    )
    this.findAllIcisDictGroupFc() // 字典值
    this.listVisibleDataSourceFc() // 关联数据源
    this.init() // 初始化
  },
  mounted() { },
  methods: {
    /**
     * 初始化
     */
    init() {
      this.queryDataFc()
    },
    /**
     * 获取对应字典项
     */
    async queryCode(arr, callBack) {
      try {
        const result = await dictItem_findDictWithItemsByGroupCodes(arr)
        callBack && callBack(result.data)
      } catch (error) {
        //
      }
    },
    /**
     * 数据类型 过滤
     */
    assessMetaTypeFc(item) {
      return this.assessMetaType.filter(res => {
        return res.dictCode == item
      })[0]?.dictName
    },
    /**
     * 数据类型 过滤
     */
    metaSourceFc(item) {
      return this.metaSource.filter(res => {
        return res.dictCode == item
      })[0]?.dictName
    },
    /**
     * 数据类型 过滤
     */
    metaDictLinkFc(item) {
      return this.metaDictLink.filter(res => {
        return res.dictCode == item
      })[0]?.dictName
    },
    /**
     * 获取数据
     */
    queryDataFc() {
      this.loading = true
      metadata_listPage(this.queryData).then(res => {
        this.totolCount = res.data.totolCount // 总条数
        if (res.data.totolCount) {
          this.tableData = res.data.result // 数据
        }
        this.loading = false
      })
    },
    /**
     * 翻页 一页总条数
     */
    handleSizeChange(num) {
      this.queryData.pageNum = 1
      this.queryData.pageSize = num
      this.init()
    },
    /**
     * 翻页
     */
    handleCurrentChange(num) {
      this.queryData.pageNum = num
      this.init()
    },
    /**
     * 表格修改
     */
    editTable(item, index) {
      this.editId = item.id // 修改id
      const dataSourcesList = []
      this.dataSource.map(item => {
        item.disabled = false
      })
      metadata_getById({
        id: item.id,
        cascade: true // 是否级联字典数据
      }).then(res => {
        res.data.dataSources.map(req => {
          dataSourcesList.push(req.sourceCode)
        })
        this.addData = {
          metaCode: res.data.metaCode, // 元数据编码（后续当做itemKey使用）
          metaName: res.data.metaName, // 元数据名称
          metaAbbr: res.data.metaAbbr,
          conditionity: res.data.conditionity,
          dataType: res.data.dataType, // 元数据类型
          sourceType: res.data.sourceType, // 元数据来源(0：本地扩展；1：卫宁平台)
          dictLink: res.data.dictLink, // 是否关联字典值(0:不关联;1:关联)
          dictGroupCode: res.data.dictGroupCode, // 关联字典组编码，DICTLINK=1必填
          dataSourcesList: dataSourcesList, // 数据源
          scoreDictItems: res?.data?.dict?.dictItems || [], // 字典的分值
          takeValueMode: res.data.takeValueMode // 区分规则
        }
        res.data.dictGroupCode && this.dictGroupCodeFc(res.data.dictGroupCode) // 需要拉一下之前选的数据

        this.dataTypeFlag =
          'wn-score,wn-input,wn-datePicker'.indexOf(this.addData.dataType) == -1 // 修改的时候看看是否关联字典
        this.dictLinkFlag = res.data.dictLink == '1' // 关联字典组
      })
      this.addOrEidt = false // 代表修改中
      // 新增弹框的对象
      this.addDialog = true
    },
    /**
     * 表格删除
     */
    deleteTable(item, index) {
      this.$confirm('您确定要删除吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(res => {
          metadata_delete({ id: item.id }).then(res => {
            this.$message.success('删除成功！')
            this.init()
          })
        })
        .catch(res => {
          this.$message.success('已取消！')
        })
    },
    /**
     * 清除
     */
    eliminate() {
      this.editId = '' // 修改id 清空
      this.addData = {
        metaCode: '', // 元数据编码（后续当做itemKey使用）
        metaName: '', // 元数据名称
        metaAbbr: '',
        conditionity: '0',
        dataType: '', // 元数据类型
        sourceType: '0', // 元数据来源(0：本地扩展；1：卫宁平台)
        dictLink: '0', // 是否关联字典值(0:不关联;1:关联)
        dictGroupCode: '', // 关联字典组编码，DICTLINK=1必填
        dataSourcesList: [], // 数据源
        scoreDictItems: [] // 字典关联分数
      }
    },

    /**
     * 新增按钮
     */
    showAddDialog() {
      this.eliminate()
      this.addOrEidt = true // 代表新增
      this.addDialog = true
    },
    /**
     * 字典
     */
    findAllIcisDictGroupFc(callback) {
      // 拿所有基础字典
      dictGroup_getDictGroupList({
        dictGroupTypeList: ['3'], // 字典类型：("1","基础字典"), ("2","监护字典"), ("3","元数据字典")
        statusDict: 1, // 启用："1";禁用标志："0"
        searchKey: '' // 模糊搜索关键字
      }).then(res => {
        this.dictGroupCodeList = res.data
        this.dictGroupCodeListAll = JSON.parse(JSON.stringify(res.data))
        callback && callback()
      })
    },
    /**
     * 关联数据源
     */
    listVisibleDataSourceFc() {
      datasources_listVisibleDataSource({
        visible: '1',
        searchKey: ''
      }).then(res => {
        res.data.map(item => {
          item.disabled = false
        })
        this.dataSource = res.data
        this.oldDataSource = JSON.parse(JSON.stringify(res.data))
      })
    },
    /**
     * 过滤数据
     */
    filterData(val) {
      this.dictGroupCodeList = frontFilter(val, this.dictGroupCodeListAll)
    },
    /**
     * 新增弹框-取消
     */
    addCancel() {
      this.$refs.addData.clearValidate()
      this.$refs.addData.resetFields()
      this.addDialog = false
      this.dataTypeFlag = false
      this.dictLinkFlag = false
    },
    /**
     * 选择类型的值
     */
    dataTypeFc(item) {
      // 单选显示最大值，最小值
      if (item != 'wn-radio') {
        this.addData.takeValueMode = ''
      }
      // 是否关联字典值 显示
      this.dataTypeFlag = 'wn-score,wn-input,wn-datePicker'.indexOf(item) == -1
      // 是否关联字典组 显示
      this.dictLinkFlag = this.addData.dictLink == '1'
    },
    /**
     * 是否关联字典值
     */
    dictLinkFc(flag) {
      this.dictLinkFlag = flag == '1'
    },
    /**
     * 选择的字典
     */
    dictGroupCodeFc(val, flag) {
      this.addData.scoreDictItems = []
      if (flag == '') {
        this.addData.dataSourcesList = []
      }
      dict_getItems({
        dictGroupCode: val
      }).then(res => {
        res.data.map((item, index) => {
          this.addData.scoreDictItems.push({
            dictId: item.dictId || '', // id
            itemScore: item.itemScore || '', // 分数
            itemText: item.itemText || '', // 文字
            itemDesc: item.itemDesc || '', // 说明
            imageUrl: item.imageUrl || '', // 图片
            positionCode: item.positionCode || '4',
            scale: item.scale || 1,
            dictCode: item.dictCode || '', // 字典编码
            dictName: item.dictName || '', // 字典名称
            ruleExpression: item.ruleExpression || '', // 规则名称
            ruleJson: item.ruleJson || '' // 规则数据
          })
        })
      })
    },
    /**
     * 新增弹框-保存
     */
    addSave() {
      this.$refs.addData.validate(valid => {
        if (valid) {
          // 处理后台需要的数据 数组对象类型
          this.addData.dataSources = []
          if (!this.dataTypeFlag && !(this.addData.dataType == 'wn-input' || this.addData.dataType == 'wn-score')) {
            this.addData.dictLink = '0'
            this.addData.dictGroupCode = ''
            this.addData.dataSourcesList = []
            this.addData.scoreDictItems = []
          }
          if (!this.dictLinkFlag && !(this.addData.dataType == 'wn-input' || this.addData.dataType == 'wn-score')) {
            this.addData.dictGroupCode = ''
            this.addData.dataSourcesList = []
            this.addData.scoreDictItems = []
          }
          if (this.addData.dataSourcesList.length > 1 && (this.addData.dataType == 'wn-input' || this.addData.dataType == 'wn-score')) {
            this.$message.error('该组件不能选取2个以上关联数据源!')
            return
          }
          this.addData.dataSourcesList.map(item => {
            this.addData.dataSources.push({ sourceCode: item })
          })
          let scaleFlag = false
          this.addData.scoreDictItems.forEach(item => {
            if (!item.scale && item.imageUrl) {
              scaleFlag = true
            }
          })

          if (scaleFlag) {
            this.$message.error('请选择图片大小!')
            return
          }
          // 处理后台需要的数据
          const queryUrl = this.addOrEidt ? metadata_add : metadata_update // 新增 | 修改 接口
          const data = this.addOrEidt
            ? this.addData
            : { ...this.addData, id: this.editId } // 新增数据 | 修改数据
          queryUrl(data).then(res => {
            this.$message({
              message: `${this.addOrEidt ? '新增' : '修改'}元数据 ${this.addData.metaName
                } 成功`,
              type: 'success'
            })
            this.addCancel()
            this.init()
          })
        }
      })
    },
    /**
     * 映射规则 弹框显示
     */
    expressionFc(item, index) {
      this.ruleDataSource = this.dataSource.filter(res => {
        return (
          this.addData.dataSourcesList.some(res2 => {
            return res2 == res.sourceCode
          })
        )
      })
      if (item.ruleExpression !== '') {
        this.expressionData = JSON.parse(item.ruleJson)
        this.expressionData.index = index
      } else {
        this.ruleDataSource.map(res => {
          this.$set(this.expressionData, res.sourceCode, '')
          this.$set(this.expressionData, 'index', index)
        })
      }
      // 如果最后一条就给一条基础值
      if (this.expressionData.list.length < 1) {
        this.expressionAdd()
      }
      // 显示
      this.expressionVisible = true
    },
    /**
     * 映射规则 删除一条
     */
    expressionDeleteFc(item, index) {
      if (item.ruleExpression != '') {
        this.$confirm('您确定要删除吗？', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(res => {
            item.ruleExpression = ''
            item.ruleJson = ''
            this.$message.success('删除成功！')
          })
          .catch(res => {
            this.$message.success('已取消！')
          })
        return
      } else {
        this.$message.success('无规则数据！')
      }
    },
    /**
     * 映射规则 新增一条
     */
    expressionAdd(item, index) {
      // 新增一条
      this.expressionData.list.push({
        brackets: '', // 括号表达
        expression: '', // 表达式
        text: '', // 文本
        rule: '', // 规则
        bracketsLeft: '', // 左括号
        dataSources: '', // 数据源
        bracketsRight: '' // 右括号
      })
    },
    /**
     * 映射规则 删除一条
     */
    expressionDelete(item, index) {
      // 删除
      this.expressionData.list.splice(index, 1)
      // 如果最后一条就给一条基础值
      if (this.expressionData.list.length < 1) {
        this.expressionAdd()
      }
    },
    /**
     * 映射规则 验证表达式
     */
    answerFc() {
      const ruleArr = []
      // 映射数据源 提示填写
      for (let i = 0; i < this.ruleDataSource.length; i++) {
        if (this.expressionData[this.ruleDataSource[i].sourceCode] == '') {
          this.$message.error(
            `请输入＂${this.ruleDataSource[i].sourceName}＂校验值！`
          )
          return
        }
      }
      for (let i = 0; i < this.expressionData.list.length; i++) {
        // 每一条表达式必输输入的内容不能为空
        if (this.expressionData.list[i].dataSources == '') {
          this.$message.error(`第${i + 1}条＂映射数据＂为空，请选择！`)
          return
        }
        if (this.expressionData.list[i].expression == '') {
          this.$message.error(`第${i + 1}条＂运算符＂为空，请选择！`)
          return
        }
        if (this.expressionData.list[i].text == '') {
          this.$message.error(`第${i + 1}条＂内容＂为空，请填写！`)
          return
        }
        // 2条以上.前面一条必须要有 规则 表达式
        if (i > 0 && this.expressionData.list[i - 1].rule == '') {
          this.$message.error(`第${i}条＂规则＂为空，请填写！`)
          return
        }
        // 基础数据选取
        const ruleList = this.ruleDataSource.filter(res => {
          return res.sourceCode == this.expressionData.list[i].dataSources
        })
        if (ruleList.length > 0) {
          // 合并数据
          const data = {
            name: ruleList[0].sourceName, // 数据的名称
            code: ruleList[0].sourceCode, // 数据的编码
            val: this.expressionData[ruleList[0].sourceCode], // 用户输入的数据
            ruleAll: `${this.expressionData.list[i].bracketsLeft
              }${this.dataSourcesFc(
                this.expressionData.list[i].dataSources
              )}${this.expressionTextFc(
                this.expressionData.list[i].expression,
                this.expressionData.list[i].text
              )}${this.expressionData.list[i].bracketsRight}${this.expressionData.list[i].rule
              }`, // 总的校验
            rule: `${this.dataSourcesFc(
              this.expressionData.list[i].dataSources
            )}${this.expressionTextFc(
              this.expressionData.list[i].expression,
              this.expressionData.list[i].text
            )}` // 校验某一条. 不需要括号 和 且或
          }
          // 输入校验对象
          ruleArr.push(data)
          // true 数字的 false 字符串类型
          data.rule = data.rule.replace(
            data.name,
            /^[0-9]*$/.test(data.val) ? data.val : `'${data.val}'`
          )
          // 总值的计算
          data.ruleAll = data.ruleAll.replace(
            data.name,
            /^[0-9]*$/.test(data.val) ? data.val : `'${data.val}'`
          )
          try {
            const expressionFc = new Function(`return ${data.rule}`)
            expressionFc()
          } catch (err) {
            this.$message.error(
              `第${i + 1}条映射数据＂${data.name}＂表达式验证失败！`
            )
            return
          }
        }
      }
      // 所有规则集合是否正确
      if (ruleArr.length < 1) {
        this.$message.warning(`请填写规则表达式！`)
        return
      }
      let allRule = ''
      ruleArr.map(res => {
        allRule = allRule + res.ruleAll
      })
      try {
        const ruleFc = new Function(`return ${allRule}`)
        this.$message.success(
          `所有表达式验证为成功，返回：${ruleFc()}，记得点击保存按钮哦！`
        )
        this.ruleShow = true
      } catch (err) {
        this.$message.error(`表达式验证失败，请查验括号与规则表达式！`)
      }
    },
    /**
     * 映射规则-取消按钮
     */
    expressionHide() {
      this.expressionData = {
        expressionName: '', // 规则显示
        expressionCode: '', // 规则显示
        list: []
      } // 表达式 对象
      this.expressionVisible = false // 隐藏
    },
    /**
     * 映射规则-保存按钮
     */
    expressionSave() {
      // 名称显示
      this.addData.scoreDictItems[
        this.expressionData.index
      ].ruleExpression = this.expressionData.expressionName
      // 所有集合
      this.addData.scoreDictItems[
        this.expressionData.index
      ].ruleJson = JSON.stringify(this.expressionData)
      this.expressionHide() // 映射规则-取消按钮
    },
    /**
     * 映射规则-文本映射
     */
    expressionTextFc(item, val) {
      if (!/^[0-9]*$/.test(val)) {
        val = `'${val}'`
      }
      switch (item) {
        case '包含':
          return `.indexOf(${val})!=-1`
        case '不包含':
          return `.indexOf(${val})==-1`
        case '等于':
          return `==${val}`
        case '不等于':
          return `!=${val}`
        case '小于':
          return `<${val}`
        case '小于等于':
          return `<=${val}`
        case '大于':
          return `>${val}`
        case '大于等于':
          return `>=${val}`
        default:
          return ''
      }
    },
    /**
     * 映射规则 - 文本切换
     */
    dataSourcesFc(val, type = 'name') {
      if (val == '') {
        return ''
      }
      if (type == 'name') {
        return (
          this.ruleDataSource.filter(res => {
            return res.sourceCode === val
          })[0].sourceName + ' '
        )
      } else {
        return (
          this.ruleDataSource.filter(res => {
            return res.sourceCode === val
          })[0].sourceCode + ' '
        )
      }
    },
    /**
     * 启用禁用
     */
    enableOrDisable(row) {
      const queryUrl =
        row.statusDict == '1' ? metadata_disable : metadata_enable // 启用禁用的请求切换
      queryUrl({
        id: row.id
      }).then(res => {
        this.$message({
          type: 'success',
          message: +row.statusDict ? '已禁用' : '已启用'
        })
        this.init()
      })
    },
    /**
     * 数据源删除的时候
     */
    removeTagDataSourceFc(val) {
      this.dataSource.map(item => {
        if (val == item.sourceCode && !item.disabled) {
          this.oldDataSourcesList = this.addData.dataSourcesList
        }
      })
      this.removeTagDataSourceValue = val
      this.removeTagDataSource = true
    },
    /**
     * 数据源清除的时候
     */
    clearDataSourceFc(val) {
      this.clearDataSource = true
    },
    /**
     * 数据源清除的时候
     */
    clearDataSourcechangeFc(val) {
      if (val.length < 1) {
        this.clearDataSource = true
      }
    },
    /**
     * 放大缩小图片
     */
    handlePictureCardPreview(index) {
      this.dialogImageUrl = this.addData.scoreDictItems[index].imageUrl
      this.dialogVisible = true
      return false
    },
    /**
     * 点击的时候记录数据位置
     */
    addIndex(index) {
      this.oneIndex = index
    },
    /**
     * 成功回调
     */
    handleAvatarSuccess(res, file) {
      if (res.code == 0) {
        this.$set(
          this.addData.scoreDictItems[this.oneIndex],
          'imageUrl',
          res.data
        )
      } else {
        this.$message.error(res.msg)
      }
    },
    /**
     * 图片上传限制
     */
    beforeAvatarUpload(file) {
      const fileName = file.name.split('.')
      const isJPG = fileName[fileName.length - 1]
      const isLt2M = file.size / 1024 / 1024 < 5
      const imgType = 'jpeg,jpg,bmp,png'
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB!')
        return false
      }
      if (
        imgType.indexOf(isJPG) == -1
      ) {
        this.$message.error('上传图片只能是 jpeg/jpg/bmp/png 格式!')
        return false
      }
    },
    /**
     * 图片删除
     */
    uploadDelete(index) {
      const imageUrl = this.addData.scoreDictItems[index].imageUrl
      this.$set(this.addData.scoreDictItems[index], 'imageUrl', '')
      dict_deleteImg({
        imageUrl: imageUrl
      }).then(res => {
        this.$message.success(res.msg)
      })
    },
    /**
     * 新增字典 打开
     */
    clickAddDictionary() {
      this.addDictionaryData = {
        groupName: '',
        groupCode: '',
        dictGroupType: 3
      }
      this.tableDataTwo = []
      this.isAddDictionaryTerm = false
      this.addDictionaryVisible = true
    },
    /**
     * 新增字典 关闭
     */
    addDictionaryHide() {
      this.findAllIcisDictGroupFc(() => {
        if (this.addDictionaryData.groupCode && this.tableDataTwo.length > 0) {
          this.addData.dictGroupCode = this.addDictionaryData.groupCode
          this.dictGroupCodeFc(this.addData.dictGroupCode, '')
        }
        this.addDictionaryVisible = false
      })
    },
    /**
     * 新增字典 保存
     */
    addDictionarySave() {
      this.$refs.addDictionary.validate(v => {
        if (v) {
          dictGroup_insert(this.addDictionaryData).then(res => {
            if (res.code == 0) {
              this.$message.success('新增成功')
              this.isAddDictionaryTerm = true
              this.tableDataTwo = []
              this.addDictionaryTerm()
            }
          })
        }
      })
    },
    /**
     * 新增字典 新增字典项目
     */
    async addDictionaryTerm() {
      if (this.tableDataTwo.length > 0 && this.tableDataTwo[0].isCreate == true) return
      const maxSortNo = await this.getMaxSortNo(this.addDictionaryData.groupCode)
      const obj = {
        'isCreate': true,
        'isEdit': true,
        'dictAbbr': '',
        'dictCode': '',
        'dictName': '',
        'sortNo': maxSortNo || 1,
        'statusDict': '1',
        'dictGroupCode': this.addDictionaryData.groupCode,
        'dictGroupName': this.addDictionaryData.groupName
      }
      this.tableDataTwo.unshift(obj)
    },
    /**
     * 获取字典项目分组
     */
    getMaxSortNo(groupCode) {
      return new Promise((resolve, reject) => {
        dictItem_getMaxSort(groupCode).then(res => {
          resolve(res.data)
        })
      })
    },
    // 修改字典项目
    modifyRow(row, index) {
      this.curRow[index] = { ...row }
      row.isEdit = true
      this.tableDataTwo = JSON.parse(JSON.stringify(this.tableDataTwo))
      this.$refs.tableDataTwo.doLayout()
    },
    // 取消当前行编辑
    cancelItemRow(row, index) {
      row.isEdit = false
      if (row.isCreate) {
        this.tableDataTwo.splice(index, 1)
      } else {
        this.tableDataTwo = JSON.parse(JSON.stringify(this.tableDataTwo))
        this.$refs.tableDataTwo.doLayout()
        this.tableDataTwo[index] = this.curRow[index]
      }
    },
    // 保存字典项目
    saveItemRow(row, index) {
      if (row.isCreate) {
        dictItem_insert(row).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            delete row.isCreate
            this.$message.success('新增成功')
            this.getDictItems()
          }
        })
      } else {
        dictItem_edit(row).then(res => {
          if (res.code == 0) {
            row.isEdit = false
            this.$message.success('新增成功')
            this.getDictItems()
          }
        })
      }
    },
    // 获取字典项目
    getDictItems() {
      dictItem_findAllWithPage({
        dictGroupCode: this.addDictionaryData.groupCode,
        pageNum: 1,
        pageSize: 500,
        searchKey: '',
        statusDict: ''
      }).then(req => {
        if (!(req.data && req.data.result)) {
          return
        }
        this.tableDataTwo = req.data.result // 列表数据
        this.$refs.tableDataTwo.doLayout()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#dataMetaConfig {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 20px;
  background: #fff;

  ::v-deep.el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .inputclass {
    ::v-deep .el-input>.el-input__inner {
      border: none;
      background: #f3f5f9;
      border-radius: 2px;
    }

    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }

    ::v-deep .el-button {
      margin-left: 10px;
    }
  }

  .height50 {
    // height: 50px;
  }

  .redCss {
    color: #f52c2c;
  }

  .pagination {
    float: right;
    margin-top: 15px;
    margin-right: -15px;
  }

  .expressionDiv {
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;

    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      font-size: 13px;
      font-weight: 500;
    }

    ::v-deep .el-input {
      flex: 1;
    }
  }

  ::v-deep .avatar-uploader {
    position: relative;
  }

  ::v-deep .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  ::v-deep .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  ::v-deep .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }

  .avatar {
    display: block;
    margin-top: -15px;
  }

  .uploadImgCssDiv {
    position: relative;

    i {
      position: absolute;
      top: -5px;
      right: 8px;
    }
  }

  .addDictionary {
    ::v-deep .el-dialog__body {
      padding: 0px 20px 15px;
    }
  }
}
</style>

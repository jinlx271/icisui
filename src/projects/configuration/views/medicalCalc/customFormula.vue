<!-- 自定义公式配置 -->
<template>
  <el-container id="customFormula" class="customFormula" element-loading-text="加载中" v-loading="loading">
    <!-- 左侧菜单 -->
    <div class="customFormula_left">
      <el-container class="customFormula_left_div">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>公式</span>
          </div>
        </el-header>
        <!-- 表格 -->
        <el-main style="height:calc(100% - 60px)" class="customFormula_left_main">
          <!-- 输入部分 -->
          <div class="customFormula_left_header">
            <el-input
              ref="inputFormula"
              @keyup.enter.native="init"
              @input="debounceFC"
              class="input"
              v-model="queryData.searchKey"
              size="small"
              clearable
              placeholder="公式名称/公式简称"
              suffix-icon="el-icon-search"
            ></el-input>
            <el-button @click.native.prevent="buttonFormula('add')" type="primary" size="small" style="width:90px;">新增</el-button>
          </div>
          <div style="height:calc(100% - 41px)">
            <el-table
              @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"
              height="100%"
              ref="formulaTable"
              :data="formulaData"
              border
              @row-click="rowClickFormula"
              highlight-current-row
            >
              <v-table-column label="排序" prop="sortNo">
                <template slot-scope="scope">
                  <el-input type="number" v-if="scope.row.isEdit||scope.row.isAdd" v-model="scope.row.sortNo" placeholder="请输入" oninput="value=value.replace(/^(0+)|[^\d]+/g,'')" />
                  <span v-else>{{scope.row.sortNo}}</span>
                </template>
              </v-table-column>
              <v-table-column label="公式编码" prop="medicalDefineCode">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isAdd" v-model="scope.row.medicalDefineCode" placeholder="请输入" maxlength="50" />
                  <span v-else>{{scope.row.medicalDefineCode}}</span>
                </template>
              </v-table-column>
              <v-table-column label="公式名称" prop="medicalDefineName">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit||scope.row.isAdd" v-model="scope.row.medicalDefineName" placeholder="请输入" maxlength="50" />
                  <span v-else>{{scope.row.medicalDefineName}}</span>
                </template>
              </v-table-column>
              <v-table-column label="公式简称" prop="medicalDefineAbbr">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.isEdit||scope.row.isAdd" v-model="scope.row.medicalDefineAbbr" placeholder="请输入" maxlength="20" />
                  <span v-else>{{scope.row.medicalDefineAbbr}}</span>
                </template>
              </v-table-column>
              <v-table-column label="备注" prop="medicalDefineNote">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.isEdit||scope.row.isAdd"
                    v-model="scope.row.medicalDefineNote"
                    :rows="3"
                    type="textarea"
                    maxlength="500"
                    size="medium"
                    placeholder="请输入"
                  ></el-input>
                  <span v-else>{{scope.row.medicalDefineNote}}</span>
                </template>
              </v-table-column>
              <!-- <v-table-column label="状态" prop="statusDict" min-width="130px" align="center">
                <template slot-scope="scope">
                  <el-switch v-if="scope.row.isEdit||scope.row.isAdd" v-model="scope.row.statusDict" active-value="1" inactive-value="0" active-text="已启用" inactive-text="已禁用"></el-switch>
                  <span v-else>{{+scope.row.statusDict ? '已启用' : '已禁用' }}</span>
                </template>
              </v-table-column>-->
              <v-table-column label="操作" width="70" align="center">
                <template slot-scope="scope">
                  <el-button
                    v-if="!scope.row.isEdit && !scope.row.isAdd"
                    @click.native.prevent="buttonFormula('update',scope.row,scope.$index)"
                    style="color:#E6A23C"
                    type="text"
                    size="small"
                  >修改</el-button>
                  <el-button
                    v-if="!scope.row.isEdit && !scope.row.isAdd"
                    @click.native.prevent="buttonFormula('delete',scope.row,scope.$index)"
                    style="color:#F56C6C"
                    type="text"
                    size="small"
                  >删除</el-button>
                  <el-button
                    v-if="scope.row.isEdit || scope.row.isAdd"
                    @click.native.prevent="buttonFormula('cancel',scope.row,scope.$index)"
                    style="color:#909399"
                    type="text"
                    size="small"
                  >取消</el-button>
                  <el-button v-if="scope.row.isEdit || scope.row.isAdd" @click.native.prevent="buttonFormula('save',scope.row,scope.$index)" type="text" size="small">保存</el-button>
                </template>
              </v-table-column>
            </el-table>
          </div>
        </el-main>
        <!-- 翻页 -->
        <el-footer class="customFormula_left_footer">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryData.pageNum"
            :total="totolCount"
            :page-size="queryData.pageSize"
            :hide-on-single-page="false"
            :page-sizes="[10, 15, 20, 25, 30]"
            layout="total, sizes, prev, pager, next"
            class="pagination"
            background
          ></el-pagination>
        </el-footer>
      </el-container>
    </div>
    <!-- 右侧内容 -->
    <el-container class="customFormula_right">
      <!-- 输入项 -->
      <div class="half">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>输入项</span>
          </div>
          <el-button @click.native.prevent="buttonInput('add')" type="primary" size="small">新增</el-button>
        </el-header>
        <el-main class="customFormula_right_body">
          <el-table
            ref="inputTable"
            :data="inputTable"
            border
            height="100%"
            @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"
          >
            <v-table-column label="排序" prop>
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit||scope.row.isAdd" v-model="scope.row.sortNo" placeholder="请输入" oninput="value=value.replace(/^(0+)|[^\d]+/g,'')" />
                <span v-else>{{scope.row.sortNo}}</span>
              </template>
            </v-table-column>
            <v-table-column label="输入项编码" prop>
              <template slot-scope="scope">
                <el-input v-if="scope.row.isAdd" v-model="scope.row.medicalParamCode" placeholder="请输入" maxlength="100" />
                <span v-else>{{scope.row.medicalParamCode}}</span>
              </template>
            </v-table-column>
            <v-table-column label="输入项名称" prop>
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit||scope.row.isAdd" v-model="scope.row.medicalParamName" placeholder="请输入" maxlength="100" />
                <span v-else>{{scope.row.medicalParamName}}</span>
              </template>
            </v-table-column>
            <v-table-column label="单位" prop>
              <template slot-scope="scope">
                <el-select
                  v-if="scope.row.isEdit||scope.row.isAdd"
                  v-model="scope.row.medicalParamUnit"
                  placeholder="请选择"
                  style="width:100%"
                  clearable
                  filterable
                  :filter-method="filterUnit"
                  @clear="filterUnit"
                  @focus="(val)=>filterUnit('')"
                >
                  <el-option v-for="item in unitList" :key="item.dictCode" :value="item.dictName" :disabled="item.statusDict == '0'" :label="item.dictName"></el-option>
                </el-select>
                <span v-else>{{scope.row.medicalParamUnit|dictCodeToName(unitList)}}</span>
              </template>
            </v-table-column>
            <v-table-column label="输入项类型" prop>
              <template slot-scope="scope">
                <el-select v-if="scope.row.isEdit||scope.row.isAdd" v-model="scope.row.medicalParamType" placeholder="请选择" style="width:100%">
                  <el-option v-for="item in inputParamType" :key="item.dictCode" :value="item.dictCode" :disabled="item.statusDict == '0'" :label="item.dictName"></el-option>
                </el-select>
                <span v-else>{{scope.row.medicalParamType|dictCodeToName(inputParamType)}}</span>
              </template>
            </v-table-column>
            <v-table-column label="字典来源" prop>
              <template slot-scope="scope">
                <el-select
                  v-if="scope.row.isEdit||scope.row.isAdd"
                  v-model="scope.row.medicalParamDictSource"
                  placeholder="请选择"
                  :filter-method="(val)=>{filterGroupData(val ,scope.row)}"
                  @clear="(val)=>{filterGroupData(val ,scope.row)}"
                  filterable
                  remote
                  clearable
                  style="width:100%"
                >
                  <el-option v-for="item in dictionaries" :key="item.groupCode" :value="item.groupCode" :disabled="item.statusDict == '0'" :label="item.groupName"></el-option>
                </el-select>
                <span v-else>{{scope.row.medicalParamDictSourceName}}</span>
              </template>
            </v-table-column>
            <v-table-column label="数据源连接" prop>
              <template slot-scope="scope">
                <el-select
                  v-if="scope.row.isEdit||scope.row.isAdd"
                  v-model="scope.row.medicalParamDataSource"
                  :filter-method="filterSource"
                  @clear="filterSource"
                  filterable
                  remote
                  clearable
                  placeholder="请选择"
                  style="width:100%"
                >
                  <el-option v-for="item in dataSource" :key="item.sourceCode" :value="item.sourceCode" :disabled="item.statusDict == '0'" :label="item.sourceName"></el-option>
                </el-select>
                <span v-else>{{scope.row.medicalParamDataSourceName}}</span>
              </template>
            </v-table-column>
            <v-table-column label="操作" width="70" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="!scope.row.isEdit && !scope.row.isAdd"
                  @click.native.prevent="buttonInput('update',scope.row,scope.$index)"
                  style="color:#E6A23C"
                  type="text"
                  size="small"
                >修改</el-button>
                <el-button
                  v-if="!scope.row.isEdit && !scope.row.isAdd"
                  @click.native.prevent="buttonInput('delete',scope.row,scope.$index)"
                  style="color:#F56C6C"
                  type="text"
                  size="small"
                >删除</el-button>
                <el-button
                  v-if="scope.row.isEdit || scope.row.isAdd"
                  @click.native.prevent="buttonInput('cancel',scope.row,scope.$index)"
                  style="color:#909399"
                  type="text"
                  size="small"
                >取消</el-button>
                <el-button v-if="scope.row.isEdit || scope.row.isAdd" @click.native.prevent="buttonInput('save',scope.row,scope.$index)" type="text" size="small">保存</el-button>
              </template>
            </v-table-column>
          </el-table>
        </el-main>
      </div>
      <!-- 输出项 -->
      <div class="half">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>输出项</span>
          </div>
          <el-button @click.native.prevent="buttonOutput('add')" type="primary" size="small">新增</el-button>
        </el-header>
        <el-main class="customFormula_right_body">
          <el-table
            ref="outputTable"
            :data="outputTable"
            border
            height="100%"
            @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"
          >
            <v-table-column label="排序" prop="sortNo" width="70">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit||scope.row.isAdd" v-model="scope.row.sortNo" placeholder="请输入" oninput="value=value.replace(/^(0+)|[^\d]+/g,'')" />
                <span v-else>{{scope.row.sortNo}}</span>
              </template>
            </v-table-column>
            <v-table-column label="输出项编码" prop="medicalResultCode" width="88">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isAdd" v-model="scope.row.medicalResultCode" placeholder="请输入" maxlength="100" />
                <span v-else>{{scope.row.medicalResultCode}}</span>
              </template>
            </v-table-column>
            <v-table-column label="输出项名称" prop="medicalResultName" width="88">
              <template slot-scope="scope">
                <el-input v-if="scope.row.isEdit||scope.row.isAdd" v-model="scope.row.medicalResultName" placeholder="请输入" maxlength="100" />
                <span v-else>{{scope.row.medicalResultName}}</span>
              </template>
            </v-table-column>
            <v-table-column label="单位" prop="medicalResultUnit" width="70">
              <template slot-scope="scope">
                <el-select
                  v-if="scope.row.isEdit||scope.row.isAdd"
                  v-model="scope.row.medicalResultUnit"
                  placeholder="请选择"
                  style="width:100%"
                  clearable
                  filterable
                  :filter-method="filterUnit"
                  @clear="filterUnit"
                  @focus="(val)=>filterUnit('')"
                >
                  <el-option v-for="item in unitList" :key="item.dictCode" :value="item.dictName" :disabled="item.statusDict == '0'" :label="item.dictName"></el-option>
                </el-select>
                <span v-else>{{scope.row.medicalResultUnit|dictCodeToName(unitList)}}</span>
              </template>
            </v-table-column>
            <v-table-column label="规则" prop="medicalParamRuleDtosName"></v-table-column>
            <v-table-column label="操作" align="center" width="70">
              <template slot-scope="scope">
                <el-button v-if="!scope.row.isEdit && !scope.row.isAdd" @click.native.prevent="buttonOutput('rule',scope.row,scope.$index)" type="text" size="small">规则配置</el-button>
                <el-button
                  v-if="!scope.row.isEdit && !scope.row.isAdd"
                  @click.native.prevent="buttonOutput('update',scope.row,scope.$index)"
                  style="color:#E6A23C"
                  type="text"
                  size="small"
                >修改</el-button>
                <el-button
                  v-if="!scope.row.isEdit && !scope.row.isAdd"
                  @click.native.prevent="buttonOutput('delete',scope.row,scope.$index)"
                  style="color:#F56C6C"
                  type="text"
                  size="small"
                >删除</el-button>
                <el-button
                  v-if="scope.row.isEdit || scope.row.isAdd"
                  @click.native.prevent="buttonOutput('cancel',scope.row,scope.$index)"
                  style="color:#909399"
                  type="text"
                  size="small"
                >取消</el-button>
                <el-button v-if="scope.row.isEdit || scope.row.isAdd" @click.native.prevent="buttonOutput('save',scope.row,scope.$index)" type="text" size="small">保存</el-button>
              </template>
            </v-table-column>
          </el-table>
        </el-main>
      </div>
      <!-- 公式说明 -->
      <div class="half2">
        <el-header class="elHeader1">
          <div>
            <i class="iconBlue"></i>
            <span>公式说明</span>
          </div>
          <div v-if="formulaData.length>0&&formulaRow.medicalDefineId">
            <el-button v-if="!edit_medicalDefineDesc" @click.native.prevent="edit_medicalDefineDesc=true" type="primary" size="small">修改</el-button>
            <template v-else>
              <el-button @click.native.prevent="formulaRow.medicalDefineDesc=formulaOneData.medicalDefineDesc,edit_medicalDefineDesc=false" type="primary" size="small">取消</el-button>
              <el-button @click.native.prevent="buttonFormula('only_save_medicalDefineDesc')" type="primary" size="small">保存</el-button>
            </template>
          </div>
        </el-header>
        <el-main class="customFormula_right_body">
          <template v-if="!edit_medicalDefineDesc" >
            {{formulaRow.medicalDefineDesc}}
          </template>
          <el-input
          v-else
            :readonly="!edit_medicalDefineDesc"
            v-model="formulaRow.medicalDefineDesc"
            @input="formulaRowFc"
            :rows="4"
            type="textarea"
            maxlength="1000"
            size="medium"
            placeholder="请输入"
          ></el-input>
        </el-main>
      </div>
    </el-container>
    <!-- 规则配置 -->
    <el-dialog :close-on-click-modal="false" title="规则配置" :visible.sync="ruleVisible" width="700px" :before-close="buttonRule">
      <el-table
        @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"
        ref="ruleTable"
        :data="ruleTable"
        border
        highlight-current-row
      >
        <v-table-column label="序号" prop="sortNo" width="70"></v-table-column>
        <v-table-column label="关系" prop="relationStr">
          <template slot-scope="scope">
            <el-input readonly="readonly" v-model="scope.row.relationStr" @click.native.prevent="buttonRule('relationship',scope.row,scope.$index)" placeholder="请输入配置关系表达式" />
          </template>
        </v-table-column>
        <v-table-column label="计算规则" align="medicalParamRule">
          <template slot-scope="scope">
            <el-popover append-to-body placement="bottom" width="200" trigger="manual" v-model="scope.row.rulePopoverVisible">
              <el-select v-model="scope.row.medicalParamCode" placeholder="请选择" clearable @change="ruleSelectFc($event,scope.row,scope.$index)" style="width:100%">
                <el-option v-for="item in ruleSelect" :key="item.name" :value="item.name" :label="item.name"></el-option>
              </el-select>
              <el-input
                slot="reference"
                @input.native="ruleInput($event,scope.row.medicalParamRule,scope.row,scope.$index)"
                @focus="ruleBlur"
                v-model="scope.row.medicalParamRule"
                maxlength="200"
                placeholder="输入#占位符可以插入参数项"
              />
            </el-popover>
          </template>
        </v-table-column>
        <v-table-column label="操作" width="105">
          <template slot-scope="scope">
            <el-button size="mini" @click.native.prevent="buttonRule('add',scope.row,scope.$index)" icon="el-icon-plus"></el-button>
            <el-button size="mini" @click.native.prevent="buttonRule('delete',scope.row,scope.$index)" icon="el-icon-delete"></el-button>
          </template>
        </v-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="buttonRule">取消</el-button>
        <el-button type="primary" @click="buttonRule('save')">保存</el-button>
      </span>
    </el-dialog>
    <!-- 关系表达式 -->
    <el-dialog :close-on-click-modal="false" title="关系表达式" :visible.sync="relationshipVisible" width="900px" :before-close="buttonRelationship">
      <el-table
        @header-dragend="(newWidth, oldWidth, column, event)=>$headerdragend(newWidth, oldWidth, column, event,$refs)"
        ref="relationshipTable"
        :data="relationshipTable"
        border
        highlight-current-row
        style="margin-bottom:10px;"
      >
        <v-table-column label="最小值" prop="minValue">
          <template slot-scope="scope">
            <el-select @change="initInput($event,scope.row,scope.$index)" v-if="!!scope.row.selectList" v-model="scope.row.minValue" placeholder="请选择" clearable style="width:100%">
              <el-option v-for="item in scope.row[scope.row.selectList]" :key="item.dictCode" :value="item.dictCode" :disabled="item.statusDict == '0'" :label="item.dictName"></el-option>
            </el-select>
            <el-input-number
              @change="initInput($event,scope.row,scope.$index)"
              v-else
              type="number"
              :min="-999"
              :max="999"
              v-model="scope.row.minValue"
              placeholder="请输入"
              style="width:100%"
            />
          </template>
        </v-table-column>
        <v-table-column label="表达式" prop="minExpression" width="88">
          <template slot-scope="scope">
            <el-select @change="initInput($event,scope.row,scope.$index)" v-if="!!scope.row.selectList" v-model="scope.row.minExpression" placeholder="请选择" clearable style="width:100%">
              <el-option value="=" label="="></el-option>
              <el-option value="!=" label="!="></el-option>
            </el-select>
            <el-select @change="initInput($event,scope.row,scope.$index)" v-else v-model="scope.row.minExpression" placeholder="请选择" clearable style="width:100%">
              <el-option value="<" label="<"></el-option>
              <el-option value="<=" label="<="></el-option>
              <el-option value="=" label="="></el-option>
              <el-option value="!=" label="!="></el-option>
              <el-option value=">" label=">"></el-option>
              <el-option value=">=" label=">="></el-option>
            </el-select>
          </template>
        </v-table-column>

        <v-table-column label="输入项" prop="medicalList">
          <template slot-scope="scope">
            <el-select v-model="scope.row.medicalParamCode" placeholder="请选择" clearable @change="entryChangeFc($event, scope.row ,scope.$index)" style="width:100%">
              <el-option v-for="item in scope.row.medicalList" :key="item.medicalParamCode" :value="item.medicalParamCode" :label="item.medicalParamName"></el-option>
            </el-select>
          </template>
        </v-table-column>

        <v-table-column label="表达式" prop="maxExpression" width="88">
          <template slot-scope="scope">
            <el-select @change="initInput($event,scope.row,scope.$index)" v-if="!!scope.row.selectList" v-model="scope.row.maxExpression" placeholder="请选择" clearable style="width:100%">
              <el-option value="=" label="="></el-option>
              <el-option value="!=" label="!="></el-option>
            </el-select>
            <el-select @change="initInput($event,scope.row,scope.$index)" v-else v-model="scope.row.maxExpression" placeholder="请选择" clearable style="width:100%">
              <el-option value="<" label="<"></el-option>
              <el-option value="<=" label="<="></el-option>
              <el-option value="=" label="="></el-option>
              <el-option value="!=" label="!="></el-option>
              <el-option value=">" label=">"></el-option>
              <el-option value=">=" label=">="></el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column label="最大值" prop="maxValue">
          <template slot-scope="scope">
            <el-select @change="initInput($event,scope.row,scope.$index)" v-if="!!scope.row.selectList" v-model="scope.row.maxValue" placeholder="请选择" clearable style="width:100%">
              <el-option v-for="item in scope.row[scope.row.selectList]" :key="item.dictCode" :value="item.dictCode" :disabled="item.statusDict == '0'" :label="item.dictName"></el-option>
            </el-select>
            <el-input-number
              @change="initInput($event,scope.row,scope.$index)"
              v-else
              type="number"
              :min="-999"
              :max="999"
              v-model="scope.row.maxValue"
              placeholder="请输入"
              style="width:100%"
            />
          </template>
        </v-table-column>
        <v-table-column prop="logicalExpr" label="规则" width="88">
          <template slot-scope="scope">
            <el-select v-model="scope.row.logicalExpr" placeholder="请选择" clearable>
              <el-option value="且" label="且"></el-option>
              <el-option value="或" label="或"></el-option>
            </el-select>
          </template>
        </v-table-column>
        <v-table-column label="操作" width="105">
          <template slot-scope="scope">
            <el-button size="mini" @click.native.prevent="buttonRelationship('add',scope.row,scope.$index)" icon="el-icon-plus"></el-button>
            <el-button size="mini" @click.native.prevent="buttonRelationship('delete',scope.row,scope.$index)" icon="el-icon-delete"></el-button>
          </template>
        </v-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="buttonRelationship">取消</el-button>
        <el-button type="primary" @click="buttonRelationship('save')">保存</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import _ from 'lodash'
import { frontFilter } from '@/utils/index' // 模糊查询方法
import {
  // 医学计算器配置 - 自定义公式配置 - 公式 查询
  medicalDefine_findList,
  // 医学计算器配置 - 自定义公式配置 - 新增
  medicalDefine_insert,
  // 医学计算器配置 - 自定义公式配置 - 修改
  medicalDefine_edit,
  // 医学计算器配置 - 自定义公式配置 - 删除
  medicalDefine_deleteById,

  // 医学计算器配置 - 自定义公式配置 - 入参表 查询
  medicalParam_findList,
  // 医学计算器配置 - 自定义公式配置 - 新增
  medicalParam_insert,
  // 医学计算器配置 - 自定义公式配置 - 修改
  medicalParam_edit,
  // 医学计算器配置 - 自定义公式配置 - 删除
  medicalParam_deleteById,

  // 医学计算器配置 - 自定义公式配置 - 出参表 查询
  medicalResult_findList,
  // 医学计算器配置 - 自定义公式配置 - 出参表 新增
  medicalResult_insert,
  // 医学计算器配置 - 自定义公式配置 - 出参表 修改
  medicalResult_edit,
  // 医学计算器配置 - 自定义公式配置 - 出参表 修改
  medicalDefine_edit_medicalDefineDesc,
  // 医学计算器配置 - 自定义公式配置 - 出参表 删除
  medicalResult_deleteById,
  // 字典列表
  dictGroup_getDictGroupWithPage,
  // 数据源
  datasources_listVisibleDataSource // 获取可见数据源列表
} from '@/api/configuration'
export default {
  name: 'AreaEvaluationForm',
  components: {},
  data: function() {
    return {
      edit_medicalDefineDesc: false,
      loading: false, // 加载
      unitList: [], // 单位
      oldUnitList: [], // 单位
      dictionaries: [], // 字典集合
      inputParamType: [], // 输入项类型
      dataSource: [], // 数据源
      oldDataSource: [], // 数据源

      queryData: {
        searchKey: '', // input输入项
        pageNum: 1, // 页码，必传
        pageSize: 10 // 页数量，必传
      }, // 公式请求
      totolCount: 0, // 公式总条数
      formulaData: [], // 公式数据
      formulaOneData: {}, // 公式修改存储数据
      formulaRow: {
        isEdit: false,
        isAdd: false,
        medicalDefineDesc: ''
      }, // 当前点击的对象
      medicalDefineDesc: '', // 公式说明

      inputTable: [], // 输入数据
      inputRow: [], // 输入数据一条
      outputTable: [], // 输出数据
      outputRow: [], // 输出数据一条

      outputTableIndex: 0, // 输出表格哪一行
      ruleTableIndex: 0, // 规则配置哪一行
      ruleVisible: false, // 规则弹出框
      ruleTable: [], // 规则配置数据
      oldRuleTable: [], // 规则配置数据 旧数据
      ruleSelectionStart: 0, // 规则配置 输入框下标
      ruleSelect: [], // 规则配置 计算规则能下拉到的值

      relationshipVisible: false, // 关系表达式弹出框
      relationshipTable: [], // 关系表达式数据
      oldRelationshipTable: [] // 关系表达式数据 就数据
    }
  },
  props: {},
  watch: {},
  filters: {
    /**
     * 编码换成 名称
     */
    dictCodeToName(dictCode, dictList, item = 'dictName') {
      const dictObj = dictList.find(item => item.dictCode == dictCode || item.dictName == dictCode)
      return dictObj ? dictObj[item] : ''
    }
  },
  computed: {},
  async created() {
    // 截流 首次请求
    this.debounceFC = _.debounce(() => {
      this.queryData.pageNum = 1 // 输入的时候需要改为第一页
      this.init()
    }, 800)
    // 截流 输入表格请求
    this.clickMedicalParamFc = _.debounce(() => {
      medicalParam_findList({
        medicalDefineId: this.formulaOneData.medicalDefineId
      }).then(res => {
        this.inputTable = res.data.map(i => {
          i.isEdit = false
          return i
        })
      })
    }, 500)
    // 截流 输出表格请求
    this.clickMedicalResultFc = _.debounce(() => {
      medicalResult_findList({
        medicalDefineId: this.formulaOneData.medicalDefineId
      }).then(res => {
        this.outputTable = res.data.map(i => {
          i.isEdit = false
          i.medicalParamRuleDtosName = ''
          i.medicalParamRuleDtos.map((j, jIndex) => {
            i.medicalParamRuleDtosName += jIndex ? ' ；' + j.relationStr + ' ' + j.medicalParamRule : j.relationStr + ' ' + j.medicalParamRule
          })
          i.medicalParamRuleDtosName = i.medicalParamRuleDtosName.replace(/\#/g, '')
          return i
        })
      })
    }, 500)
    await this.filterGroupData() // 字典列表
    // 字典一起请求
    const { ICIS_DICT_UNIT, ICIS_DICT_INPUT_PARAM_TYPE } = await this.$batchGetDictItemList(['ICIS_DICT_UNIT', 'ICIS_DICT_INPUT_PARAM_TYPE'])
    this.unitList = ICIS_DICT_UNIT // 单位
    this.oldUnitList = JSON.parse(JSON.stringify(this.unitList))
    this.inputParamType = ICIS_DICT_INPUT_PARAM_TYPE // 输入项类型
    this.dataSource = await this.dataSourceFc() // 评估表数据源
    this.oldDataSource = this.dataSource?.length > 0 ? JSON.parse(JSON.stringify(this.dataSource)) : []
    this.init()
  },
  mounted() {},
  methods: {
    /**
     * 初始化
     */
    init(index) {
      // 公式列表请求
      medicalDefine_findList(this.queryData).then(res => {
        // 公式给编辑的新增字段
        this.formulaData = res.data.result.map(i => {
          i.isEdit = false
          i.isAdd = false
          return i
        })
        // 总条数
        this.totolCount = res.data.totolCount
        // 默认选择条
        if (index) {
          this.formulaData[index] && this.$refs.formulaTable?.setCurrentRow(this.formulaData[index])
          this.formulaOneData = { ...this.formulaData[index] }
          this.formulaRow = { ...this.formulaData[index] }
        } else {
          this.formulaData[0] && this.$refs.formulaTable?.setCurrentRow(this.formulaData[0])
          this.formulaOneData = { ...this.formulaData[0] }
          this.formulaRow = { ...this.formulaData[0] }
        }
        this.edit_medicalDefineDesc = false
        if (res.data.result.length > 0) {
          // 输入表格请求
          this.clickMedicalParamFc()
          // 输出表格请求
          this.clickMedicalResultFc()
        }
      })
    },
    /**
     * 清除相同数组
     */
    eliminateArray(arr, code, name) {
      const map = new Map()
      return arr.filter(res => {
        return (!map.has(res[code]) && map.set(res[code], 1)) || (!map.has(res[name]) && map.set(res[name], 1))
      })
    },
    /**
     * 字典
     */
    async filterGroupData(val, row) {
      let groupData = []
      if (row && row.medicalParamDictSource && row.medicalParamDictSourceName) {
        groupData.push({
          groupCode: row.medicalParamDictSource,
          groupName: row.medicalParamDictSourceName
        })
      }
      groupData = frontFilter(val, groupData)
      this.dictionaries = await this.getGroupData(val) // 字典列表
      if (groupData?.length > 0) {
        const dictionariesOne = this.dictionaries.filter(res => {
          return groupData[0].groupCode == res.groupCode
        })
        if (dictionariesOne.length === 0) {
          this.dictionaries = this.dictionaries.concat(groupData)
        }
      }
    },
    /**
     * 字典
     * 监护项字典、标化字典、非标化字典
     */
    getGroupData(key) {
      return new Promise((resolve, reject) => {
        dictGroup_getDictGroupWithPage({
          pageNum: 1,
          pageSize: 50,
          searchKey: key || '',
          dictGroupTypeList: ['1', '2', '4', '5']
        })
          .then(res => {
            if (res.code === 0) {
              resolve(res.data.result)
            } else {
              reject([])
            }
          })
          .catch(() => {
            reject([])
          })
      })
    },
    /**
     * 数据输入变化
     */
    filterSource(val) {
      this.dataSource = frontFilter(val, this.oldDataSource) // 评估表数据源
    },
    /**
     * 数据移出变化
     */
    blurSource() {
      this.dataSource = JSON.parse(JSON.stringify(this.oldDataSource))
    },
    /**
     * 单位输入变化
     */
    filterUnit(val) {
      this.unitList = frontFilter(val, this.oldUnitList) // 评估表数据源
    },
    /**
     * 评估表数据源
     */
    dataSourceFc(key) {
      return new Promise((resolve, reject) => {
        datasources_listVisibleDataSource({
          visible: '1',
          searchKey: key || ''
        })
          .then(res => {
            if (res.code === 0) {
              resolve(res.data)
            } else {
              reject([])
            }
          })
          .catch(() => {
            reject([])
          })
      })
    },
    /**
     *  状态判断
     */
    stateJudgement(data) {
      if (
        data.filter(res => {
          return res.isAdd
        })[0]
      ) {
        this.$message({
          type: 'warning',
          message: '已有新增公式没有保存,请先保存!'
        })
        return true
      }
      if (
        data.filter(res => {
          return res.isEdit
        })[0]
      ) {
        this.$message({
          type: 'warning',
          message: '已有修改公式没有保存,请先保存!'
        })
        return true
      }
      return false
    },
    /**
     * 公式 - 按钮集合
     * @type add update delete cancel save
     */
    buttonFormula(type, row, index) {
      let query = '' // 保存请求的变量
      let successName = '' // 保存请求的名称
      const data = {
        sortNo: '', // 排序
        medicalDefineCode: '', // 编码
        medicalDefineName: '', // 名称
        medicalDefineAbbr: '', // 简称
        medicalDefineNote: '', // 备注
        statusDict: '1', // 状态
        medicalDefineDesc: '', // 公式说明
        isEdit: false, // 修改状态
        isAdd: true // 新增状态
      }
      switch (type) {
        case 'add':
          // 校验有没有其他新增和修改情况
          if (this.stateJudgement(this.formulaData)) {
            break
          }
          this.rowClickFormula(data)
          this.formulaData.unshift(data)
          this.formulaData[0] && this.$refs.formulaTable?.setCurrentRow(this.formulaData[0])
          this.inputTable = []
          this.outputTable = []
          break
        case 'update':
          // 校验有没有其他新增和修改情况
          if (this.stateJudgement(this.formulaData)) {
            break
          }
          this.formulaData.map(i => {
            i.isEdit = false
          })
          row.isEdit = true
          this.formulaRow = { ...row }
          this.formulaOneData = { ...row }
          this.$message({
            type: 'warning',
            message: '修改状态已开启'
          })
          break
        case 'delete':
          // 校验有没有其他新增和修改情况
          if (this.stateJudgement(this.formulaData)) {
            break
          }
          this.$confirm('您确定要删除吗？', '确认信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.loading = true
              medicalDefine_deleteById({
                medicalDefineId: row.medicalDefineId
              })
                .then(res => {
                  this.loading = false
                  this.debounceFC()
                  this.$message.success('删除成功！')
                  this.formulaRow = {
                    isEdit: false,
                    isAdd: false,
                    medicalDefineDesc: ''
                  } // 当前点击的对象
                })
                .catch(() => {
                  this.loading = false
                })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })

          break
        case 'cancel':
          if (row.isEdit) {
            this.$set(this.formulaData, index, Object.assign(this.formulaOneData, { isEdit: false }))
          } else {
            this.formulaData.shift()
          }
          this.$message({
            type: 'info',
            message: '已取消'
          })
          break
        case 'save':
          if (!row.sortNo) {
            this.$message.error('请填写排序!')
            break
          }
          if (!row.medicalDefineCode) {
            this.$message.error('请填写编码!')
            break
          }
          if (!row.medicalDefineName) {
            this.$message.error('请填写名称!')
            break
          }
          if (row.isEdit) {
            query = medicalDefine_edit
            successName = '修改成功'
          } else if (row.isAdd) {
            query = medicalDefine_insert
            successName = '保存成功'
          }
          this.loading = true
          delete row.medicalDefineDesc
          query(row)
            .then(res => {
              this.$message.success(successName)
              this.init(index)
              // const compareItem = this.formulaData.filter(v => v.medicalDefineId == row.medicalDefineId)
              // this.formulaRow = compareItem.length == 1 ? compareItem[0] : {
              //   isEdit: false,
              //   isAdd: false,
              //   medicalDefineDesc: ''
              // }
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
          break
        case 'only_save_medicalDefineDesc':
          query = medicalDefine_edit_medicalDefineDesc
          successName = '修改成功'
          this.loading = true
          query({ medicalDefineDesc: this.formulaRow.medicalDefineDesc, medicalDefineId: this.formulaOneData.medicalDefineId })
            .then(res => {
              this.edit_medicalDefineDesc = false
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        break
      }
    },
    /**
     * 公式 - 说明
     */
    formulaRowFc() {
      for (let i = 0; i < this.formulaData.length; i++) {
        const item = this.formulaData[i]
        if (item.medicalDefineId == this.formulaRow.medicalDefineId) {
          this.$set(this.formulaData, i, { ...item, medicalDefineDesc: this.formulaRow.medicalDefineDesc })
          break
        }
      }
    },
    /**
     * 公式 - 翻页一页总条数
     */
    handleSizeChange(num) {
      this.queryData.pageNum = 1
      this.queryData.pageSize = num
      this.init()
    },
    /**
     * 公式 - 前往几页
     */
    handleCurrentChange(num) {
      this.queryData.pageNum = num
      this.init()
    },
    /**
     * 公式 - 表格条数选择
     */
    rowClickFormula(row) {
      if (
        this.formulaData.filter(res => {
          return res.isAdd || res.isEdit
        })[0]
      ) {
        return
      }
      this.formulaRow = { ...row }
      this.formulaOneData = { ...row }
      this.edit_medicalDefineDesc = false
      this.clickMedicalParamFc()
      this.clickMedicalResultFc()
    },
    /**
     * 输入表格 - 按钮集合
     * @type add update delete cancel save
     */
    buttonInput(type, row, index) {
      let query = '' // 保存请求的变量
      let successName = '' // 保存请求的名称
      const data = {
        sortNo: '', // 排序
        medicalParamCode: '', // 编码
        medicalParamName: '', // 名称
        medicalParamDataSource: '', // 数据源连接
        medicalParamDictSource: '', // 字典来源
        medicalParamType: '', // 输入项类型
        medicalParamUnit: '', // 单位
        isEdit: false, // 修改状态
        isAdd: true // 修改状态
      }
      switch (type) {
        case 'add':
          // 校验有没有其他新增和修改情况
          if (this.stateJudgement(this.inputTable)) {
            break
          }
          if (this.checkFc()) {
            return
          }
          this.filterUnit('')
          this.dataSource = JSON.parse(JSON.stringify(this.oldDataSource))
          this.filterGroupData()
          this.inputTable.unshift(data)
          break
        case 'update':
          // 校验有没有其他新增和修改情况
          if (this.stateJudgement(this.inputTable)) {
            break
          }
          if (this.checkFc()) {
            return
          }
          this.filterUnit('')
          this.dataSource = JSON.parse(JSON.stringify(this.oldDataSource))
          this.filterGroupData('', row)
          this.inputTable.map(i => {
            i.isEdit = false
          })
          row.isEdit = true
          this.inputRow = { ...row }
          this.$message({
            type: 'warning',
            message: '修改状态已开启'
          })
          break
        case 'delete':
          // 校验有没有其他新增和修改情况
          if (this.stateJudgement(this.inputTable)) {
            break
          }
          this.$confirm('您确定要删除吗？', '确认信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.loading = true
              medicalParam_deleteById({
                medicalParamId: row.medicalParamId
              })
                .then(res => {
                  this.loading = false
                  this.clickMedicalParamFc()
                  this.$message.success('删除成功！')
                })
                .catch(() => {
                  this.loading = false
                })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })

          break
        case 'cancel':
          if (row.isEdit) {
            this.$set(this.inputTable, index, Object.assign(this.inputRow, { isEdit: false }))
          } else {
            this.inputTable.shift()
          }
          this.$message({
            type: 'info',
            message: '已取消'
          })
          break
        case 'save':
          if (!row.sortNo) {
            this.$message.error('请填写排序!')
            break
          }
          if (!row.medicalParamCode) {
            this.$message.error('请填写编码!')
            break
          }
          if (!row.medicalParamName) {
            this.$message.error('请填写名称!')
            break
          }
          if (!row.medicalParamType) {
            this.$message.error('请填写输入项类型!')
            break
          }
          if (row.isEdit) {
            query = medicalParam_edit
            successName = '修改成功'
          } else if (row.isAdd) {
            query = medicalParam_insert
            successName = '保存成功'
          }
          this.loading = true
          query({ ...row, medicalDefineId: this.formulaOneData.medicalDefineId })
            .then(res => {
              this.$message.success(successName)
              this.clickMedicalParamFc()
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
          break
      }
    },
    /**
     * 校验
     */
    checkFc() {
      let flag = false
      this.inputTable.map(i => {
        if (i.isAdd || i.isEdit) {
          flag = true
        }
      })
      this.outputTable.map(i => {
        if (i.isAdd || i.isEdit) {
          flag = true
        }
      })
      if (flag) {
        this.$message({
          type: 'warning',
          message: '输入输出表格有新增修改没录入完成'
        })
        return true
      }
      return false
    },
    /**
     * 输出表格 - 按钮集合
     * @type rule add update delete cancel save
     */
    buttonOutput(type, row, index) {
      let query = '' // 保存请求的变量
      let successName = '' // 保存请求的名称
      let flag = false
      const data = {
        sortNo: '', // 排序
        medicalResultCode: '', // 编码
        medicalResultName: '', // 名称
        medicalParamRuleDtos: [], // 数据源连接
        medicalResultUnit: '', // 单位
        isEdit: false, // 修改状态
        isAdd: true // 修改状态
      }
      switch (type) {
        case 'rule':
          this.ruleSelect = []
          this.outputTableIndex = index
          this.oldRuleTable =
            this.outputTable[index].medicalParamRuleDtos?.length > 0
              ? this.outputTable[index].medicalParamRuleDtos
              : [
                  {
                    sortNo: 1,
                    relationList: [],
                    medicalParamRule: '',
                    relationStr: ''
                  }
                ]
          this.oldRuleTable.map(i => {
            i.rulePopoverVisible = false
          })
          this.ruleTable = JSON.parse(JSON.stringify(this.oldRuleTable))
          this.inputTable.map(i => {
            this.ruleSelect.push({ name: i.medicalParamName, code: i.medicalParamCode })
            if (i.isAdd || i.isEdit) {
              flag = true
            }
          })
          this.outputTable.map(i => {
            // 当前输出项不能选择
            if (row.medicalResultCode != i.medicalResultCode) {
              this.ruleSelect.push({ name: i.medicalResultName, code: i.medicalResultCode })
            }
            if (i.isAdd || i.isEdit) {
              flag = true
            }
          })
          if (flag) {
            this.$message({
              type: 'warning',
              message: '输入输出表格有新增没录入完成'
            })
            return
          }
          this.ruleVisible = true
          break
        case 'add':
          // 校验有没有其他新增和修改情况
          if (this.stateJudgement(this.outputTable)) {
            break
          }
          if (this.checkFc()) {
            return
          }
          this.filterUnit('')
          this.outputTable.unshift(data)
          break
        case 'update':
          // 校验有没有其他新增和修改情况
          if (this.stateJudgement(this.outputTable)) {
            break
          }
          if (this.checkFc()) {
            return
          }
          this.filterUnit('')
          this.outputTable.map(i => {
            i.isEdit = false
          })
          row.isEdit = true
          this.outputRow = { ...row }
          this.$message({
            type: 'warning',
            message: '修改状态已开启'
          })
          break
        case 'delete':
          // 校验有没有其他新增和修改情况
          if (this.stateJudgement(this.outputTable)) {
            break
          }
          this.$confirm('您确定要删除吗？', '确认信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.loading = true
              medicalResult_deleteById({
                medicalResultId: row.medicalResultId
              })
                .then(res => {
                  this.loading = false
                  this.clickMedicalResultFc()
                  this.$message.success('删除成功！')
                })
                .catch(() => {
                  this.loading = false
                })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })

          break
        case 'cancel':
          if (row.isEdit) {
            this.$set(this.outputTable, index, Object.assign(this.outputRow, { isEdit: false }))
          } else {
            this.outputTable.shift()
          }
          this.$message({
            type: 'info',
            message: '已取消'
          })
          break
        case 'save':
          if (!row.sortNo) {
            this.$message.error('请填写排序!')
            break
          }
          if (!row.medicalResultCode) {
            this.$message.error('请填写编码!')
            break
          }
          if (!row.medicalResultName) {
            this.$message.error('请填写名称!')
            break
          }
          if (row.isEdit) {
            query = medicalResult_edit
            successName = '修改成功'
          } else if (row.isAdd) {
            query = medicalResult_insert
            successName = '保存成功'
          }
          this.loading = true
          query({ ...row, medicalDefineId: this.formulaOneData.medicalDefineId })
            .then(res => {
              this.$message.success(successName)
              this.clickMedicalResultFc()
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
          break
      }
    },
    /**
     * 规则 - 按钮集合
     * @type add delete save relationship
     */
    async buttonRule(type, row, index) {
      let isReturn = false
      let queryData = {}
      const data = {
        sortNo: 1,
        relationList: [],
        medicalParamRule: '',
        relationStr: ''
      }
      switch (type) {
        case 'relationship':
          this.ruleTableIndex = index
          this.oldRelationshipTable =
            row.relationList?.length > 0
              ? row.relationList
              : [
                  {
                    minValue: '', // 最小值
                    minExpression: '', // 最小值 表达式
                    medicalParamCode: '', // 输入项 编码
                    medicalParamName: '', // 输入项 名称
                    maxExpression: '', //  最大值 表达式
                    maxValue: '', // 最大值
                    logicalExpr: '且' // 规则
                  }
                ]
          queryData = await this.queryRelationshipFc()
          this.oldRelationshipTable.map(i => {
            i.medicalList = this.inputTable
            Object.assign(i, queryData)
            if (i.medicalParamCode != '') {
              i.selectList = i.medicalList.filter(res => {
                return res.medicalParamCode == i.medicalParamCode
              })[0].medicalParamDictSource
            } else {
              i.selectList = ''
            }
            i.medicalParamType = i.selectList != '' ? '2' : '1'
          })
          this.relationshipTable = JSON.parse(JSON.stringify(this.oldRelationshipTable))
          this.relationshipVisible = true
          break
        case 'add':
          data.sortNo = this.ruleTable[this.ruleTable.length - 1].sortNo + 1
          this.ruleTable.push(data)
          break
        case 'delete':
          this.$confirm('您确定要删除吗？', '确认信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.ruleTable.splice(index, 1)
              if (this.ruleTable.length < 1) {
                this.ruleTable = [
                  {
                    sortNo: 1,
                    relationList: [],
                    medicalParamRule: '',
                    relationStr: ''
                  }
                ]
              }
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })

          break
        case 'save':
          if (this.ruleTable.length > 1) {
            for (let i = 0; i < this.ruleTable.length; i++) {
              const item = this.ruleTable[i]
              if (!item.medicalParamRule) {
                this.$message.error('请填写计算规则,保存不成功!')
                isReturn = true
                break
              }
            }
          }
          if (isReturn) {
            return
          }
          // 特殊处理 给后台编码的规则
          if (this.ruleTable?.length > 0) {
            this.ruleTable.map(i => {
              let str = i.medicalParamRule
              this.ruleSelect.map(j => {
                if (j.name && j.code) {
                  str = str.replace(new RegExp(j.name, 'g'), j.code)
                }
              })
              i.medicalParamCodeRule = str
            })
          }
          this.outputTable[this.outputTableIndex].medicalParamRuleDtos = this.ruleTable
          medicalResult_edit({ ...this.outputTable[this.outputTableIndex], medicalDefineId: this.formulaOneData.medicalDefineId })
            .then(res => {
              this.clickMedicalResultFc()
              this.ruleVisible = false
            })
            .catch(() => {
              this.ruleVisible = false
            })
          break
        default:
          // 取消按钮
          this.ruleVisible = false
          this.ruleTable = JSON.parse(JSON.stringify(this.oldRuleTable))
      }
    },
    /**
     * 规则 - 计算规则 - 输入
     */
    ruleInput(event, val, row, index) {
      if (val.charAt(event.target.selectionStart - 1) == '#') {
        this.ruleSelectionStart = event.target.selectionStart
        row.rulePopoverVisible = true
      } else {
        row.rulePopoverVisible = false
      }
    },
    /**
     * 规则 - 计算规则 点击
     */
    ruleBlur() {
      this.ruleTable.map((i, iIndex) => {
        i.rulePopoverVisible = false
      })
    },
    /**
     * 规则 - 计算规则 # 选择
     */
    ruleSelectFc(val, row, index) {
      row.medicalParamRule = row.medicalParamRule.substring(0, this.ruleSelectionStart) + val + row.medicalParamRule.substring(this.ruleSelectionStart)
      row.rulePopoverVisible = false
      row.medicalParamCode = ''
    },
    /**
     * 关系表里面输入项的 字典
     */
    async queryRelationshipFc() {
      const array = []
      for (let i = 0; i < this.inputTable.length; i++) {
        const item = this.inputTable[i]
        if (item.medicalParamType == 2) {
          array.push(item.medicalParamDictSource)
        }
      }
      const arrayList = await this.$batchGetDictItemList(array)
      return arrayList
    },

    /**
     * 关系表达式 - 按钮集合
     * @type add update delete save
     */
    async buttonRelationship(type, row, index) {
      let isReturn = false
      let queryData = {}
      const data = {
        minValue: '', // 最小值
        minExpression: '', // 最小值 表达式
        medicalParamCode: '', // 输入项 编码
        medicalParamName: '', // 输入项 名称
        maxExpression: '', //  最大值 表达式
        maxValue: '', // 最大值
        logicalExpr: '且' // 规则
      }
      queryData = await this.queryRelationshipFc()
      data.medicalList = this.inputTable
      Object.assign(data, queryData)
      switch (type) {
        case 'add':
          this.relationshipTable.push(data)
          break
        case 'delete':
          this.$confirm('您确定要删除吗？', '确认信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.relationshipTable.splice(index, 1)
              if (this.relationshipTable.length < 1) {
                this.relationshipTable.push(data)
              }
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })

          break
        case 'save':
          if (this.relationshipTable.length == 1) {
            const item = this.relationshipTable[0]
            if (!(item.minValue == 0 && item.minExpression == '' && item.medicalParamCode == '' && item.maxExpression == '' && item.maxValue == 0 && item.logicalExpr == '且')) {
              if (!item.medicalParamCode) {
                this.$message.error(`请填写第1条"输入项",保存不成功!`)
                return
              }
              if (!item.logicalExpr && this.relationshipTable.length > 1 && index == 0) {
                this.$message.error(`请填写第1条"规则",保存不成功!`)
                return
              }
              if (item.selectList) {
                // 单选
                // 全部不存在
                if (!item.minValue && !item.minExpression && !item.maxExpression && !item.maxValue) {
                  this.$message.error(`第1条表达式有误,保存不成功!`)
                  return
                }
                // 左边存在或者不存在
                if (!((item.minValue && item.minExpression) || (!item.minValue && !item.minExpression))) {
                  this.$message.error(`第1条左侧表达式有误,保存不成功!`)
                  return
                }
                // 右边存或者不存在
                if (!((item.maxValue && item.maxExpression) || (!item.maxValue && !item.maxExpression))) {
                  this.$message.error(`第1条右侧表达式有误,保存不成功!`)
                  return
                }
              } else {
                // 输入框
                if (!item.minExpression && !item.maxExpression) {
                  this.$message.error(`第1条表达式有误,保存不成功!`)
                  return
                }
                if (!!item.minExpression && !item.maxExpression && item.maxValue > 0) {
                  this.$message.error(`第1条表达式有误,保存不成功!`)
                  return
                }
                if (item.minValue > 0 && !item.minExpression && !!item.maxExpression) {
                  this.$message.error(`第1条表达式有误,保存不成功!`)
                  return
                }
              }
            }
          } else {
            for (let i = 0; i < this.relationshipTable.length; i++) {
              const item = this.relationshipTable[i]
              if (!item.medicalParamCode) {
                this.$message.error(`请填写第${i + 1}条"输入项",保存不成功!`)
                isReturn = true
                break
              }
              if (!item.logicalExpr && this.relationshipTable.length - 1 != i) {
                this.$message.error(`请填写第${i + 1}条"规则",保存不成功!`)
                isReturn = true
                break
              }
              if (item.selectList) {
                // 单选
                // 全部不存在
                if (!item.minValue && !item.minExpression && !item.maxExpression && !item.maxValue) {
                  this.$message.error(`第${i + 1}条表达式有误,保存不成功!`)
                  isReturn = true
                  break
                }
                // 左边存在或者不存在
                if (!((item.minValue && item.minExpression) || (!item.minValue && !item.minExpression))) {
                  this.$message.error(`第${i + 1}条左侧表达式有误,保存不成功!`)
                  isReturn = true
                  break
                }
                // 右边存或者不存在
                if (!((item.maxValue && item.maxExpression) || (!item.maxValue && !item.maxExpression))) {
                  this.$message.error(`第${i + 1}条右侧表达式有误,保存不成功!`)
                  isReturn = true
                  break
                }
              } else {
                // 输入框
                if (!item.minExpression && !item.maxExpression) {
                  this.$message.error(`第${i + 1}条表达式有误,保存不成功!`)
                  isReturn = true
                  break
                }
                if (item.minExpression && !item.maxExpression && item.maxValue > 0) {
                  this.$message.error(`第${i + 1}条表达式有误,保存不成功!`)
                  isReturn = true
                  break
                }
                if (item.minValue > 0 && !item.minExpression && item.maxExpression) {
                  this.$message.error(`第${i + 1}条表达式有误,保存不成功!`)
                  isReturn = true
                  break
                }
              }
            }
          }

          if (isReturn) {
            return
          }
          // 最后一条规则不需要清除
          this.relationshipTable[this.relationshipTable.length - 1].logicalExpr = ''
          // 这里还有很多东西要写
          this.ruleTable[this.ruleTableIndex].relationStr = ''
          for (let i = 0; i < this.relationshipTable.length; i++) {
            const item = this.relationshipTable[i]
            // 清理 0的数据
            if (!item.minExpression && item.minValue == 0) {
              item.minValue = ''
            }
            // 清理 0的数据
            if (!item.maxExpression && item.maxValue == 0) {
              item.maxValue = ''
            }
            if (item.selectList) {
              this.ruleTable[this.ruleTableIndex].relationStr = this.ruleTable[this.ruleTableIndex].relationStr + this.codetoName(item.minValue, item[item.selectList]) + item.minExpression + item.medicalParamName + item.maxExpression + this.codetoName(item.maxValue, item[item.selectList]) + ' ' + item.logicalExpr + ' '
            } else {
              item.minValue = typeof item.minValue == 'number' ? item.minValue : ''
              item.maxValue = typeof item.maxValue == 'number' ? item.maxValue : ''
              this.ruleTable[this.ruleTableIndex].relationStr = this.ruleTable[this.ruleTableIndex].relationStr + item.minValue + item.minExpression + item.medicalParamName + item.maxExpression + item.maxValue + ' ' + item.logicalExpr + ' '
            }
          }
          this.ruleTable[this.ruleTableIndex].relationList = this.relationshipTable
          this.relationshipVisible = false
          break
        default:
          // 取消按钮
          this.relationshipTable = JSON.parse(JSON.stringify(this.oldRelationshipTable))
          this.relationshipVisible = false
      }
    },
    /**
     * 关系表达式 - 编码换成名称
     */
    codetoName(dictCode, dictList, item = 'dictName') {
      if (!dictCode) {
        return ''
      }
      if (!(dictList && dictList.length > 0)) {
        return dictCode
      }
      const dictObj = dictList.find(item => item.dictCode == dictCode)
      return dictObj ? dictObj[item] : ''
    },
    /**
     * 关系表达式 - 输入项的选择
     */
    entryChangeFc(val, row, index) {
      if (row.medicalParamCode != '') {
        const list = row.medicalList.filter(res => {
          return res.medicalParamCode == row.medicalParamCode
        })[0]
        row.selectList = list.medicalParamDictSource
        row.medicalParamName = list.medicalParamName
      } else {
        row.selectList = ''
      }
      if (row.selectList && row.selectList.length > 0) {
        row.minValue = ''
        row.maxValue = ''
        row.minExpression = ''
        row.maxExpression = ''
      }
      row.medicalParamType = row.selectList != '' ? '2' : '1'
    },
    /**
     * 关系表达式 - 判断输入项是否有
     */
    initInput(val, row, index) {
      if (row.medicalParamCode == '') {
        val = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.customFormula {
  background: #ffffff;
  height: 100%;
  padding: 0.5% 1%;
  .elHeader1 {
    height: 34px !important;
    margin-top: 18px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    padding-left: 0px;
    justify-content: space-between;
    .iconBlue {
      display: inline-block;
      width: 3px;
      height: 16px;
      background: var(--maincolor);
    }
    div {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    }
    span {
      flex: 1;
      margin-left: 8px;
      height: 22px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #000000;
      line-height: 22px;
    }
    .el-button {
      width: 90px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      span {
        margin: 0;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }
  }
  &_left {
    width: 50%;
    &_div {
      height: 100%;
    }
    &_header {
      display: flex;
      align-items: center;
      padding: 0;
      height: 31px !important;
      background: #ffffff;
      border-radius: 2px;
      margin-bottom: 10px;
      .input {
        max-width:200px;
        margin-right: 10px;
      }
      ::v-deep input {
        background: #f3f5f9;
        border: none;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000622;
      }
    }
    &_main {
      padding: 0;
      &_table {
        border: none;
        background: none;
        padding-top: 8px;
        &::before {
          background: transparent;
        }
        &::after {
          background: transparent;
        }
        ::v-deep tr {
          background: none;
          &.current-row {
            color: var(--maincolor);
            td {
              font-size: 14px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: var(--maincolor);
              background: none;
              .cell {
                background: #d9e3ff;
                border-radius: 3px;
              }
            }
          }
          &:hover {
            color: var(--maincolor);
            td {
              background: none;
            }
          }
        }
        ::v-deep td {
          border: none;
          padding: 0 8px;
          color: #000622;
          font-size: 13px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          .cell {
            padding: 8px;
          }
        }
      }
    }
    &_footer {
      .pagination {
        float: right;
        margin-top: 15px;
        margin-right: -30px;
      }
    }
    ::v-deep .el-dialog__body {
      padding: 20px 20px 0 20px;
    }
  }
  &_right {
    width: 50%;
    margin-left: 10px;
    padding-left: 10px;
    border-left: 2px solid #eee;
    display: flex;
    flex-direction: column;
    .half {
      height: 40%;
    }
    .half2 {
      height: 20%;
    }
    .el-header {
      height: 32px !important;
      padding: 0;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // customFormula_right_head 右侧搜索栏的input
      .el-input {
        width: 300px;
        .el-input__inner {
          border: none;
          background: #f3f5f9;
          border-radius: 2px;
        }
      }
    }
    .el-main {
      padding: 0;
    }
    &_body {
      height: calc(100% - 66px);
      overflow: auto;
      .config {
        border: 1px solid #d9e3ff;
        border-radius: 5px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>

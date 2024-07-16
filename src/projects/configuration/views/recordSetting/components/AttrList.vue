<template>
  <div class="attr-list">
    <el-tabs v-model="activeName">
      <el-tab-pane label="组件属性" name="first">
        <el-form v-if="curComponent" size="mini" inline label-width="80" label-position="left" class="wn-form" >
          <el-form-item v-for="(key) in styleKeys" :key="key" :label="map[key]" :style="{width:map[key].length>5?'100%':'47%'}">
            <el-switch v-model="curComponent.style[key]" v-if="['borderLeft', 'borderRight', 'borderTop', 'borderBottom'].indexOf(key) >= 0">
            </el-switch>
            <el-select v-else-if="key == 'textAlign'" v-model="curComponent.style[key]" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select v-else-if="key == 'direction'" v-model="curComponent.style[key]" placeholder="请选择">
              <el-option v-for="item in directions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-input v-else-if="key == 'format'" v-model="curComponent.style[key]" placeholder="请输入" >
            </el-input>
            <el-color-picker v-else-if="key === 'color'" v-model="curComponent.style.color" ></el-color-picker>
            <el-color-picker v-else-if="key=='borderColor'"  v-model="curComponent.style[key]"></el-color-picker>
            <el-input-number v-else type="number" v-model="curComponent.style[key]" placeholder="请输入" :min="0" :controls="false" class='align-left' size="mini"></el-input-number>

          </el-form-item>
          <hr v-if="attrKeys.length > 0" />
          <template v-for="(key, index) in attrKeys">
            <el-form-item :key="index + 'attr'" :label="map[key]" v-if="map[key]" :style="{width:map[key].length>5||key=='formProSqlId'||key=='isShowMaxCols'||key=='gridStyle'?'100%':'47%'}">
              <el-input v-if="inputAttrs.indexOf(key) >= 0" v-model="curComponent.attr[key]" placeholder="请输入" ></el-input>
              <el-color-picker v-else-if="key=='outLimitColor'"  v-model="curComponent.attr[key]"></el-color-picker>
              <el-input-number v-else-if="key=='maxLength'" :step="1" :min="0" step-strictly :precision="0" size="mini"
                               v-model="curComponent.attr[key]" placeholder="请输入" ></el-input-number>
              <el-input-number v-else-if="inputNumberAttrs.indexOf(key) >= 0" :step="1" :min="1" step-strictly :precision="0" size="mini"
                               v-model="curComponent.attr[key]" placeholder="请输入" ></el-input-number>
              <el-switch v-model="curComponent.attr[key]" v-else-if="key === 'infusionAndBloodSplit'" active-value="1" inactive-value="0">
              </el-switch>
              <el-select v-else-if="key == 'gridStyle'" v-model="curComponent.attr[key]" placeholder="请选择" @change="changeGridStyle"  class="input-width">
                <el-option v-for="item in gridStyleOption" :key="item.value" :label="item.label" :value="item.value" :forceHide="item.value=='3'&&curComponent.component!='vCharts'" ></el-option>
              </el-select>
              <el-select v-else-if="key=='limitPageNum'" v-model="curComponent.attr[key]" clearable placeholder="请选择">
                <el-option :label="item.label" :value="item.value" v-for="item in limitPageNumOptions " :key="item.value"></el-option>
              </el-select>
              <el-select v-else-if="key=='displayRules'" v-model="curComponent.attr[key]" clearable placeholder="请选择">
                <el-option :label="item.label" :value="item.value" v-for="item in displayRulesOptions " :key="item.value" :disabled="item.statusDict!='1'"></el-option>
              </el-select>
              <el-input-number v-else-if="key === 'limit'" :step="1" step-strictly :precision="0" v-model="curComponent.attr[key]" placeholder="请输入" size="mini"
                               >
              </el-input-number>
              <el-switch v-model="curComponent.attr[key]" v-else-if="switchAttrs.indexOf(key) >= 0" :active-value="1" :inactive-value="0"
                         active-text="是" inactive-text="否" :class="key=='isShowMaxCols'?'input-width':''">
              </el-switch>
              <el-switch v-model="curComponent.attr[key]" v-else-if="numSwitch.indexOf(key) >= 0" active-value="1" inactive-value="0" active-text="是"
                         inactive-text="否">
              </el-switch>

              <!-- 表格模板绑定数据源 数据源需要通过请求显示 -->

              <template v-else-if="key==='userType'">
                <el-select v-model="curComponent.attr[key]" placeholder="请选择">
                  <el-option v-for="item in userTypes" :key="item.value+item.label" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </template>
              <template v-else-if="key==='required'">
                <el-select v-model="curComponent.attr[key]" clearable placeholder="请选择">
                  <el-option v-for="item in rules" :key="item.value+item.label" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </template>
              <el-select v-else-if="key == 'direction'" v-model="curComponent.attr[key]" placeholder="请选择">
                <el-option v-for="item in directions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-select v-else-if="key==='labelDirection'||key=='xAxisLabelAlign'" v-model="curComponent.attr[key]" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <template v-else-if="key==='remarkStyleNum'">
                <el-radio v-model="curComponent.attr[key]" label="0">默认样式分类</el-radio>
                <el-radio v-model="curComponent.attr[key]" label="1">按序号展示</el-radio>
              </template>
              <!-- <template v-else-if="key === 'option'">
                <el-select v-model="curComponent.attr.option.from"  @change="optionSrouceChange">
                  <el-option label="手动添加" value="local"></el-option>
                  <el-option label="字典" value="sysCode"></el-option>
                  <el-option label="其他接口" value="special"></el-option>
                </el-select>
              </template> -->
              <template v-else-if="key==='sysCode'">
                <el-select v-model="curComponent.attr.sysCode" placeholder="请选择" filterable>
                  <el-option v-for="item in dict" :label="item.groupName+'('+item.groupId+')'" :value="item.groupId" :key="item.id">
                    {{item.groupName+'('+item.groupId+')'}}
                  </el-option>
                </el-select>
              </template>
              <template v-else-if="key === 'barCodeFormat'">
                <el-select v-model="curComponent.attr[key]" placeholder="请选择">
                  <el-option value="CODE39"></el-option>
                  <el-option value="CODE128"></el-option>
                </el-select>
              </template>

              <!--图片上传-->
              <template v-else-if="key === 'imageSrc'">
                <div class="flex">
                  <el-upload class="upload-demo" :headers="importHeaders" :on-preview="changeImage" :action="uploadImageApi" :show-file-list="false"
                             :before-remove="deleteImage" :before-upload="beforeUpload" :on-success="successUpload" multiple :limit="50"
                             name="uploadDocPicture" list-type="picture" :file-list="imageList">
                    <el-button size="mini" type="primary" >浏览</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
                  </el-upload>
                </div>
                <!-- 显示列表 -->
                <ul class="el-upload-list el-upload-list--picture">
                  <li v-for="(item,index) in imageList" :key="index" class="el-upload-list__item is-success" @click="changeImage(item)">
                    <img :src="item.url" alt="" class="el-upload-list__item-thumbnail">
                    <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{item.name}}</a>
                    <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-check"></i></label>
                  </li>

                </ul>
              </template>
              <template v-else-if="key === 'labelLineFeed'">
                <el-checkbox v-model="curComponent.attr[key]"></el-checkbox>
              </template>
              <template v-else-if="key === 'optionLineFeed'">
                <div >
                  <el-checkbox v-model="curComponent.attr[key]"></el-checkbox>
                </div>
              </template>
              <template v-else-if="key === 'metaData'">
                <div class="flex">
                  <el-input v-model="curComponent.attr[key]" placeholder="请输入" class="input-width flex-1 m-r10"></el-input>
                  <el-button size="mini" type="primary" @click="showMetaDialog('metaData')">选择</el-button>
                </div>
              </template>
              <template v-else-if="key==='field'">
                <el-cascader  v-model="curComponent_attr_field" :options="fields[fieldsList]" clearable filterable
                             @change="handleChange($event,key)"></el-cascader>
              </template>
              <template v-else-if="(key === 'formProSqlId')">
                <el-select v-model="curComponent.attr.formProSqlId" placeholder="请选择" clearable filterable @change="selectProSalId" class="input-width">
                  <el-option v-for="item in filterDataSourseList" :value="item.id" :key="item.id" :label="item.formName"></el-option>
                </el-select>
                <el-input v-model="curComponent.attr.custom_field" placeholder="请输入"
                          v-if="curComponent.attr.field&&curComponent.attr.field.includes('custom')" @change="changeFiled($event)"></el-input>
              </template>
              <template v-else-if="key === 'option'">
                <el-select v-model="curComponent.attr.option.from" placeholder="请选择" @change="optionSrouceChange">
                  <el-option label="手动添加" value="local"></el-option>
                  <el-option label="字典" value="sysCode"></el-option>
                  <el-option label="其他接口" value="special"></el-option>
                </el-select>
                <!-- 手动添加optionlist -->
                <!-- <template v-if="curComponent.attr.option.from !== 'local'">
                <el-form-item label="选中后显示的文字" v-if="curComponent.component === 'MySelect'" :key="'attrLabel' + index">
                  <el-input type="text" v-model="curComponent.attr.option.label" placeholder="字段名" />
                </el-form-item>
                <el-form-item label="选项key" :key="'attrKey' + index">
                  <el-input type="text" v-model="curComponent.attr.option.key" placeholder="字段名" />
                </el-form-item>
                <el-form-item label="选项显示的文字" :key="'attrText' + index">
                  <el-input type="text" v-model="curComponent.attr.option.optionText" placeholder="支持多字段拼接 用空格分隔" />
                </el-form-item>
              </template> -->
              </template>
              <!--处方内容-->
              <template v-else-if="key === 'rpList'">
                <div :key="'key' + index" class="rp-list">
                  <el-button icon="el-icon-circle-plus-outline" type="text"
                             @click="curComponent.attr.rpList.keys.splice(0, 0, { type: 1, value: '' })">
                    新增项
                  </el-button>
                  <div v-for="(rpItem, rpIndex) in curComponent.attr.rpList.keys" :key="rpIndex" class="flex rp-item">
                    <el-select v-model="rpItem.type" placeholder="请选择">
                      <el-option :value="1" label="字段"></el-option>
                      <el-option :value="2" label="文字"></el-option>
                      <el-option :value="3" label="换行"></el-option>
                      <el-option :value="4" label="空格"></el-option>
                    </el-select>
                    <el-input-number v-if="rpItem.type === 4" v-model="rpItem.value" placeholder="请输入" style="flex:1" size="mini"></el-input-number>
                    <el-input v-else-if="rpItem.type !== 3" v-model="rpItem.value" placeholder="请输入" style="flex:1"></el-input>
                    <i class="el-icon-remove-outline" @click="curComponent.attr.rpList.keys.splice(rpIndex, 1)" />
                    <i class="el-icon-circle-plus-outline" @click="curComponent.attr.rpList.keys.splice(rpIndex + 1, 0, { type: 1, value: '' })" />
                  </div>
                  <el-form-item label="字体大小">
                    <el-input type="number" v-model="curComponent.attr.rpList.fontSize"  />
                  </el-form-item>
                  <div class="rp-blank">
                    <div class="title">空白区域：</div>
                    <el-form-item label="宽度">
                      <el-input-number v-model="curComponent.attr.rpList.blankWidth" placeholder="请输入" size="mini"></el-input-number>
                    </el-form-item>
                    <el-form-item label="文字">
                      <el-input v-model="curComponent.attr.rpList.blankText" placeholder="请输入" ></el-input>
                    </el-form-item>
                    <el-form-item label="对齐">
                      <el-select v-model="curComponent.attr.rpList.blankTextAlign" placeholder="请选择">
                        <el-option value="left" label="左"></el-option>
                        <el-option value="center" label="中"></el-option>
                        <el-option value="right" label="右"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="样式">
                      <el-select v-model="curComponent.attr.rpList.blankBorderStyle" placeholder="请选择">
                        <el-option value="solid" label="实线"></el-option>
                        <el-option value="dashed" label="虚线"></el-option>
                        <el-option value="dotted" label="点线"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <!-- <el-input v-model="curComponent.attr.rpList.blankBorderColor"> -->
                </div>
              </template>
              <template v-else-if="key === 'quota'">
                <el-divider :key="key + 'divider'">苏醒指标</el-divider>
                <template v-for="(item, index) in curComponent.attr.quota">
                  <div style="border:1px solid #ccc; margin-bottom:10px" :key="index + 'quota'">
                    <el-form-item label="指标名称" label-width="100" label-position="left">
                      <el-input v-model="item.name" placeholder="请输入"> </el-input>
                    </el-form-item>
                    <div :key="'key' + index">
                      <el-divider>评分项
                        <i @click="curComponent.attr.quota.splice(index,1)" class="el-icon-remove-outline " />
                      </el-divider>
                      <div v-for="(it, i) in item.options" :key="i + 'quotaOption'" class="select-item">
                        <el-input class="flex-1" v-model="it.label" placeholder="请输入" size="small" />
                        <el-input style="width:40px" placeholder="请输入" size="small" v-model="it.grade" />
                        <div class="close-btn select-line-icon" @click="item.options.splice(i, 1)">
                          <i class="el-icon-remove-outline" />
                        </div>
                      </div>
                      <div style="margin-left: 20px">
                        <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text" @click="addQuotaOptionItem(index)">
                          添加评分项
                        </el-button>
                      </div>
                    </div>
                  </div>
                </template>
                <div :key="'quota' + key" style="margin-left: 20px">
                  <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text" @click="addQuotaItem">
                    添加指标
                  </el-button>
                </div>
              </template>
              <template v-else-if="key == 'numbering'">
                <el-radio :key="key+'1'" v-model="curComponent.attr.numbering" :label="'1'">取手术登记序号不允许编辑</el-radio>
                <el-radio :key="key+'2'" v-model="curComponent.attr.numbering" :label="'2'">自动编号（yyyy+6位数字序列）</el-radio>
                <el-radio :key="key+'3'" v-model="curComponent.attr.numbering" :label="'3'">默认为空，自由录入</el-radio>
              </template>
              <!-- 生命体征曲线设置 -->
              <template v-else-if="key == 'vitalSigns_coolingData'">
                <el-button type="primary" size="mini" @click="dialogVisible=!dialogVisible" :key="index+'vitalSigns_coolingData'" icon="el-icon-edit">
                  设置
                </el-button>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              </template>
              <template v-else-if="key == 'moniEventConfig'">
                <el-button type="primary" size="mini" @click="moniEventConfig_dialogVisible=!moniEventConfig_dialogVisible"
                           :key="index+'moniEventConfig'" icon="el-icon-edit">
                  设置
                </el-button>
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              </template>
              <!-- 图标大小 -->
              <template v-else-if="key == 'svgSize'">
                <el-input-number :key="index+'svgSize'" type="number" v-model="curComponent.attr.svgSize" placeholder="请输入" :min="0" :controls="false"
                                 class='align-left'>
                </el-input-number>
              </template>
              <!-- 图标颜色 -->
              <template v-else-if="key == 'svgColor'">
                <el-color-picker :key="index+'svgColor'" v-model="curComponent.attr.svgColor"></el-color-picker>
              </template>
              <!-- 以入区天数为页码 -->
              <template v-else-if="key=='isRelativeIcuAreaDays'">
                 <el-switch v-model="curComponent.attr[key]"  :active-value="1" :inactive-value="0" @change="changeIsRelativeIcuAreaDays"
                         active-text="是" inactive-text="否">
                 </el-switch>
              </template>
              <!-- 正反面共享页码 -->
              <template v-else-if="key=='sharePageNum'">
                <el-switch v-model="curComponent.attr[key]"  :active-value="1" :inactive-value="0" @change="ChangeSharePageNum" :disabled="multiPageMode=='1'"
                         active-text="是" inactive-text="否">
                 </el-switch>
              </template>
              <!-- 人体类型 -->
              <template v-else-if="key=='bodyType'">
                <el-select v-model="curComponent.attr.bodyType" filterable placeholder="请选择">
                  <el-option label="成人" :value="0"></el-option>
                  <el-option label="婴儿" :value="1"></el-option>
                </el-select>
              </template>
              <!-- 人体图类型 -->
              <template v-else-if="key=='bodyImageType'">
                <el-select v-model="curComponent.attr.bodyImageType" filterable placeholder="请选择">
                  <el-option label="皮肤人体图" value="skin"></el-option>
                  <el-option label="导管人体图" value="catheter"></el-option>
                </el-select>
              </template>
              <!-- 输液量 输入量错开-->
              <template v-else-if="key=='staggeredInput'">
                <el-switch v-model="curComponent.attr.staggeredInput" :active-value="1" :inactive-value="0"
                         active-text="是" inactive-text="否"></el-switch>
              </template>
              <!-- 泵入量 流速错位展示 -->
              <template v-else-if="key=='dislocation'">
                <el-switch v-model="curComponent.attr.dislocation" :active-value="1" :inactive-value="0"
                         active-text="是" inactive-text="否"></el-switch>
              </template>
              <!-- 输液量 泵入量 居中显示-->
              <template v-else-if="key=='lineCenter'">
                <el-switch v-model="curComponent.attr.lineCenter" :active-value="1" :inactive-value="0"
                         active-text="是" inactive-text="否"></el-switch>
              </template>
              <!-- 输液量 泵入量 医嘱开始时间的展示样式-->
              <template v-else-if="key=='startTimeSelect'||key=='timeFormat'">
                <el-input style="width: 180px;" class="flex-1" v-model="curComponent.attr[key]" placeholder="YYYY-MM-DD HH:mm:ss" size="small" />
              </template>
              <!-- 泵入药展示样式 续药 -->
              <template v-else-if="key=='continueStyle'">
                <el-select v-model="curComponent.attr.continueStyle" filterable placeholder="请选择">
                  <el-option label="续" value="1"></el-option>
                  <el-option label="续+换" value="2"></el-option>
                </el-select>
              </template>
              <!-- 人体正反面 -->
              <template v-else-if="key == 'bodyFront'">
                <el-select v-model="curComponent.attr.bodyFront" filterable placeholder="请选择">
                  <el-option label="正面" :value="0"></el-option>
                  <el-option label="反面" :value="1"></el-option>
                </el-select>
              </template>
              <template v-else-if="key == 'xAxisLabelAlign'">
                <el-select v-model="curComponent.attr.xAxisLabelAlign" filterable placeholder="请选择">
                  <el-option label="正面" :value="0"></el-option>
                  <el-option label="反面" :value="1"></el-option>
                </el-select>
              </template>
            </el-form-item>
          </template>
          <!-- 多选组件中 option相关子项设置 -->
          <template v-if="curComponent.attr.option">
            <template v-if="curComponent.attr.option.from === 'local'">

              <el-divider>选项</el-divider>
              <div v-for="(item, i) in curComponent.attr.option.list" :key="i + 'option'" class="select-item">
                <el-input style="min-width:65px" v-model="item.label" placeholder="请输入选项名" size="small" />
                <el-input v-if="!item.showLeftRight" placeholder="请输入选项值" size="small" v-model="item.value" />
                <template v-else-if="curComponent.attr.option.from === 'local'">
                  <el-input placeholder="请输入选项左值" size="small" v-model="item.leftValue" />
                  <el-input placeholder="请输入选项右值" size="small" v-model="item.rightValue" />
                </template>

                <!-- <el-switch v-if="curComponent.component === 'MyCheckbox'" size="mini" v-model="item.showLeftRight" title="是否区分左右"></el-switch> -->
                <div class="close-btn select-line-icon" @click="curComponent.attr.option.list.splice(i, 1)">
                  <i class="el-icon-remove-outline" />
                </div>
              </div>
              <div style="margin-left: 20px">
                <el-button style="padding-bottom: 0" icon="el-icon-circle-plus-outline" type="text" @click="addSelectItem">
                  添加选项
                </el-button>
              </div>
              <el-divider />

            </template>
            <!-- 字典值，或者是元数据相关联数据 -->
            <template v-else-if="curComponent.attr.option.from === 'sysCode'">
              <el-form-item label="字典值">
                <!-- <el-input type="text"  /> -->
                <el-select v-model="curComponent.attr.option.code" filterable placeholder="请选择">
                  <el-option v-for="item in dict" :label="item.groupName+'('+item.groupId+')'" :value="item.groupId" :key="item.id">
                    {{item.groupName+'('+item.groupId+')'}}
                  </el-option>
                </el-select>
              </el-form-item>
              <div v-if="curComponent.attr.custom_field&&curComponent.attr.custom_field!=''">
                <el-divider>选项</el-divider>
                <div v-for="(item, i) in curComponent.attr.option.list" :key="i + 'option'" class="select-item">
                  <el-input style="min-width:65px" v-model="item.label" placeholder="请输入选项名" size="small" disabled />
                  <el-input v-if="!item.showLeftRight" placeholder="请输入选项值" size="small" v-model="item.value" disabled />
                  <!-- <div class="close-btn select-line-icon" @click="curComponent.attr.option.list.splice(i, 1)">
                      <i class="el-icon-remove-outline" />
                    </div> -->
                </div>

                <el-divider />
              </div>
            </template>
            <template v-else-if="curComponent.attr.option.from === 'special'">
              <el-form-item label="接口地址">
                <el-input type="text" v-model="curComponent.attr.option.url" placeholder="请输入" />
              </el-form-item>
            </template>
          </template>
          <!-- 横向循环数 -->
          <template v-if="curComponent.attr.isShowMaxCols==1&&curComponent.attr.maxCols">
            <el-form-item label="数据最大列数">
              <el-input-number type="textarea" v-model="curComponent.attr.maxCols" placeholder="请输入" :min="1" size="mini" />
            </el-form-item>
            <el-form-item label="显示优先级">
              <el-select v-model="curComponent.attr.priority" filterable placeholder="请选择">
                <el-option label="优先显示行数据" value="row"></el-option>
                <el-option label="优先显示列数据" value="col"></el-option>
              </el-select>
            </el-form-item>
          </template>
           <template v-if="curComponent.attr.formProSqlId=='202201050926190005'|| curComponent.attr.proApi=='pro_assess_form_common_data'">
            <el-form-item label="评估单" style="width:100%;">
              <!-- <el-input  v-model="curComponent.attr.formId"  /> -->
              <el-input  v-model="curComponent.attr.formName" placeholder="请输入" />
              <el-button size="mini" type="primary" @click="showMetaDialog('assess')">选择</el-button>
            </el-form-item>
          </template>
          <template v-if="curComponent.attr.clospanFlag">
            <hr/>
            <el-form-item label="自定义横向合并单元格（小结）" class="input-width" style="width:100%;">
              <el-switch v-model="curComponent.attr.clospanFlag"  active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
            <template v-if="curComponent.attr.clospanFlag=='1'">
              <el-form-item label="样式" style="width:100%;">
                <div class="flex ">
                  <el-select v-model="curComponent.attr.colspanStyle.align" class="m-r10">
                    <el-option value="left" label="左对齐"></el-option>
                    <el-option value="center" label="居中"></el-option>
                    <el-option value="right" label="右对齐"></el-option>
                  </el-select>
                  <div class="colspan-btn" :class="curComponent.attr.colspanStyle.strong==1?'colspan-selected':''" @click="curComponent.attr.colspanStyle.strong=curComponent.attr.colspanStyle.strong^1">
                    <svg width="24" height="24" focusable="false"><path d="M7.8 19c-.3 0-.5 0-.6-.2l-.2-.5V5.7c0-.2 0-.4.2-.5l.6-.2h5c1.5 0 2.7.3 3.5 1 .7.6 1.1 1.4 1.1 2.5a3 3 0 01-.6 1.9c-.4.6-1 1-1.6 1.2.4.1.9.3 1.3.6s.8.7 1 1.2c.4.4.5 1 .5 1.6 0 1.3-.4 2.3-1.3 3-.8.7-2.1 1-3.8 1H7.8zm5-8.3c.6 0 1.2-.1 1.6-.5.4-.3.6-.7.6-1.3 0-1.1-.8-1.7-2.3-1.7H9.3v3.5h3.4zm.5 6c.7 0 1.3-.1 1.7-.4.4-.4.6-.9.6-1.5s-.2-1-.7-1.4c-.4-.3-1-.4-2-.4H9.4v3.8h4z" fill-rule="evenodd"></path></svg>
                  </div>
                  <div class="colspan-btn" :class="curComponent.attr.colspanStyle.em==1?'colspan-selected':''" @click="curComponent.attr.colspanStyle.em=curComponent.attr.colspanStyle.em^1">
                    <svg width="24" height="24" focusable="false"><path d="M16.7 4.7l-.1.9h-.3c-.6 0-1 0-1.4.3-.3.3-.4.6-.5 1.1l-2.1 9.8v.6c0 .5.4.8 1.4.8h.2l-.2.8H8l.2-.8h.2c1.1 0 1.8-.5 2-1.5l2-9.8.1-.5c0-.6-.4-.8-1.4-.8h-.3l.2-.9h5.8z" fill-rule="evenodd"></path></svg>
                  </div>
                  <el-select v-model="curComponent.attr.colspanStyle.fontSize">
                    <el-option :value="item" :label="item" v-for="(item,index) in fontSizeList" :key="index"></el-option>
                  </el-select>
                </div>

              </el-form-item>
              <el-form-item label="单元格内换行" style="width:100%;">
                <el-switch v-model="curComponent.attr.wordBreak"  active-value="1" inactive-value="0"></el-switch>
              </el-form-item>
              <el-form-item label="数据条件" style="width:100%;">
                <div class="flex">
                  <div style="width:60px;margin-left:43px;" class="m-r10">(</div>
                  <div style="width:80px;" class="m-r10">占位符</div>
                  <div style="width:60px;" class="m-r10">运算符</div>
                  <div class="m-r10" style="width:60px;" >值</div>
                  <div style="width:60px;" class="m-r10">)</div>
                  <div style="width:60px;" class="m-r10">与/或</div>
                </div>
                <div class="flex spanCondition m-b10" v-for="(item,index) in curComponent.attr.clospanCondition" :key="index">
                  <!-- 操作 -->
                  <div class="flex m-r10">
                    <el-button type="text" @click="addCondition(index)" class="el-icon-plus"></el-button>
                    <el-button type="text"  @click="deleteCondition(index)" class="el-icon-close"> </el-button>
                  </div>
                  <!-- 前括号 -->
                  <el-select v-model="item.preChar" style="width:60px;" class="m-r10" clearable>
                    <el-option value="(" label="("></el-option>
                  </el-select>
                  <!-- 占位符 -->
                  <el-input v-model="item.paramName" style="width:80px;" class="m-r10"></el-input>
                  <!-- 运算符 -->
                  <el-select v-model="item.operator" style="width:60px;" class="m-r10" clearable>
                    <el-option value="<=" label="<="></el-option>
                    <el-option value="<" label="<"></el-option>
                    <el-option value="==" label="=="></el-option>
                    <el-option value=">" label=">"></el-option>
                    <el-option value=">=" label=">="></el-option>
                  </el-select>
                  <!-- 值 -->
                  <el-input v-model="item.paramValue" style="width:60px;" class="m-r10"></el-input>
                  <el-select v-model="item.afterChar" style="width:60px;" class="m-r10" clearable>
                    <el-option value=")" label=")"></el-option>
                  </el-select>
                  <!-- 与/或 -->
                  <div style="width:60px;" class="m-r10">
                    <el-select v-model="item.concatChar" v-if="index!=curComponent.attr.clospanCondition.length-1" clearable>
                      <el-option value="&&" label="与"></el-option>
                      <el-option value="||" label="或"></el-option>
                    </el-select>
                  </div>
                </div>
              </el-form-item>

            </template>
          </template>
          <!-- <template v-if="curComponent.attr.rowspanFlag">
            <hr/>
            <el-form-item label="自定义纵向合并单元格（流式表内容）" class="input-width" style="width:100%;">
              <el-switch v-model="curComponent.attr.rowspanFlag"  active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
            <template v-if="curComponent.attr.rowspanFlag=='1'">
              <el-form-item label="数据条件" style="width:100%;">
                <div class="flex">
                  <div style="width:60px;margin-left:43px;" class="m-r10">(</div>
                  <div style="width:80px;" class="m-r10">占位符</div>
                  <div style="width:60px;" class="m-r10">运算符</div>
                  <div class="m-r10" style="width:60px;" >值</div>
                  <div style="width:60px;" class="m-r10">)</div>
                  <div style="width:60px;" class="m-r10">与/或</div>
                </div>
                <div class="flex spanCondition m-b10" v-for="(item,index) in curComponent.attr.rowspanCondition" :key="index">
                  操作
                  <div class="flex m-r10">
                    <el-button type="text" @click="addRowSpanCondition(index)" class="el-icon-plus"></el-button>
                    <el-button type="text"  @click="deleteRowSpanCondition(index)" class="el-icon-close"> </el-button>
                  </div>
                  前括号
                  <el-select v-model="item.preChar" style="width:60px;" class="m-r10" clearable>
                    <el-option value="(" label="("></el-option>
                  </el-select>
                  占位符
                  <el-input v-model="item.paramName" style="width:80px;" class="m-r10"></el-input>
                  运算符
                  <el-select v-model="item.operator" style="width:60px;" class="m-r10" clearable>
                    <el-option value="<=" label="<="></el-option>
                    <el-option value="<" label="<"></el-option>
                    <el-option value="==" label="=="></el-option>
                    <el-option value=">" label=">"></el-option>
                    <el-option value=">=" label=">="></el-option>
                  </el-select>
                  值
                  <el-input v-model="item.paramValue" style="width:60px;" class="m-r10"></el-input>
                  <el-select v-model="item.afterChar" style="width:60px;" class="m-r10" clearable>
                    <el-option value=")" label=")"></el-option>
                  </el-select>
                  与/或
                  <div style="width:60px;" class="m-r10">
                    <el-select v-model="item.concatChar" v-if="index!=curComponent.attr.rowspanCondition.length-1" clearable>
                      <el-option value="&&" label="与"></el-option>
                      <el-option value="||" label="或"></el-option>
                    </el-select>
                  </div>
                </div>
              </el-form-item>

            </template>
          </template> -->
          <hr v-if="curComponent && includes.includes(curComponent.component)" />
          <el-form-item label="内容" v-if="curComponent && includes.includes(curComponent.component)">
            <el-input type="textarea" v-model="curComponent.propValue" placeholder="请输入" />
          </el-form-item>
          <hr/>

        </el-form>
        <p v-else class="placeholder">请选择组件</p>
      </el-tab-pane>
      <!-- <el-tab-pane label="表单属性" name="form">
        <el-form v-model="formConf">
          <el-form-item label="标签文字颜色">
            <el-color-picker @change="setColor" v-model="formConf.labelColor"></el-color-picker>
          </el-form-item>
          <el-form-item label="值文字颜色">
            <el-color-picker @change="setColor" v-model="formConf.valueColor"></el-color-picker>
          </el-form-item>
        </el-form>
      </el-tab-pane> -->
    </el-tabs>
    <el-dialog title="选择元数据" top="10vh" :visible.sync="metaDialogFlag" width="680px" append-to-body>
      <meta-data-dialog v-if="metaDialogFlag" :tabNames.sync="metaDataTab" :showTitle="curComponent.attr.showTitle"
                        :labelLine.sync="curComponent.attr.labelLine" :optionLine.sync="curComponent.attr.optionLine" @close="metaDialogFlag=false"
                        @confirm="insertMetaData" :currCell="selectTdDom"></meta-data-dialog>
    </el-dialog>
    <!-- 监护图标设置 -->
    <el-dialog v-el-drag-dialog :title="'监护图标设置'" append-to-body :before-close="getvitalSignsItemConfigBody" :visible.sync="dialogVisible" :close-on-click-modal="false"
               width="1000px">
      <vitalSignsItemConfigBody  ref="vitalSignsItemConfigBody" :curComponent="curComponent"></vitalSignsItemConfigBody>
    </el-dialog>
    <!-- 监护事件设置 -->
    <el-dialog v-el-drag-dialog append-to-body :title="'监护事件设置'" :before-close="getmoniEventConfig" :visible.sync="moniEventConfig_dialogVisible"
               :close-on-click-modal="false" width="600px">
      <moniEventConfig  ref="moniEventConfig" :curComponent="curComponent"></moniEventConfig>
    </el-dialog>
  </div>
</template>

<script>
import {
  metadata_linkDictItems
} from '@/api/configuration'
import { getCookie } from '@/utils/cookie' // 存储方式
import { getKey } from '@/utils/utils'
import {
  getDictItemGroups
} from '@/api/dict'
import {
  patientRecord_getPatientPropertyList
} from '@/api/patient'
import {
  basedata_getDocPictureList,
  // basedata_deleteDocPicture,
  formProSql_getFormProList // 主界面list
} from '@/api/configuration'
import metaDataDialog from '../tinymacEditor/components/metaDataDialog.vue'
import {
  commonList
} from '../custom-component/component-list' // 共用组件
export default {
  components: {
    metaDataDialog,
    vitalSignsItemConfigBody: () => import('./vitalSignsItemConfigBody.vue'),
    moniEventConfig: () => import('./moniEventConfig.vue')
  },
  props: {
    fieldsList: {
      type: String,
      default: ''
    },
    multiPageMode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      importHeaders: { 'X-Token': getCookie('token').tocken },
      dialogVisible: false,
      curComponent_attr_field: [],
      moniEventConfig_dialogVisible: false,
      dataSourceList: [], // 数据源列表
      formConf: {
        labelColor: '#000000',
        valueColor: '#000000'
      },
      metaDialogFlag: false,
      metaDataTab: '', // 元数据弹框页面 formid
      activeName: 'first',
      // 这些属性是输入框
      inputAttrs: [
        'drugName',
        'syName',
        'sxName',
        'clName',
        'placeholder',
        'format',
        'monName',
        'labelName',
        'label',
        'cols',
        'unit',
        'noDataText',
        'formatStr',
        'connectorChar',
        'prefix'
      ],
      inputNumberAttrs: [
        'hGridNum',
        'vGridNum',
        'maxRows',
        'maxCols',
        'drugNum',
        'syNum',
        'sxNum',
        'clNum',
        'monSum',
        'digit',
        'barCodeValueSize',
        'minGrade',
        'totalColumnWidth',
        'outLimitFontSize',
        'xAxisInterval'
      ], // 这些属性是数字输入
      switchAttrs: [
        'readonly',
        'fixTop',
        'isShowTotal',
        'isScale',
        'multi',
        'clearable',
        'onlyNum',
        'allowCreate',
        'tdBreakLine',
        'canEditName',
        // 'getCurPageAllEvent',
        'remarkStyleNumShowTime',
        'showAnalgesicPlan',
        'barCodeValue',
        'isSplit',
        'canEdit',
        'showBorder',
        'showTotalPage',
        'customValue',
        // 'isRelativeIcuAreaDays',
        // 'sharePageNum',
        'isShowMaxCols',
        'nbpABP',
        'showWarnningSynbol',
        'outLimitFlag',
        'inAreaDay',
        'centerDisplay',
        'showDaySpan',
        'xAxisShowFlag'
        // 'clospanFlag'
      ], // 这些属性是el-switch
      numSwitch: ['xuhaoSignSpecialEventShowIcon'], // 这些属性值是0/1
      includes: ['v-label'], // 这些组件显示内容
      gridStyleOption: [
        {
          label: '虚线',
          value: 0
        },
        {
          label: '实线',
          value: 1
        },
        {
          label: '虚实相间',
          value: 2
        },
        {
          label: '整点实线非整点虚线',
          value: 3
        }
      ],
      options: [
        {
          label: '左对齐',
          value: 'left'
        },
        {
          label: '居中',
          value: 'center'
        },
        {
          label: '右对齐',
          value: 'right'
        }
      ],
      userTypes: [{
        label: '麻醉医生',
        value: 'ANAES_DOCTOR'
      }, {
        label: '护士',
        value: 'NURSE'
      }, {
        label: '手术医生',
        value: 'operaDoctor'
      }],
      rules: [{
        value: '',
        label: '不校验'
      }, {
        value: 1,
        label: '仅提示'
      }, {
        value: 2,
        label: '校验'
      }],
      directions: [
        {
          label: '水平排列',
          value: 'column'
        },
        {
          label: '垂直排列',
          value: 'row'
        }
      ],
      map: {
        outLimitFlag: '显示超限数值',
        outLimitFontSize: '文字大小',
        outLimitColor: '字体颜色',
        cols: '备注列数',
        isShowMaxCols: '显示列数',
        maxRows: '数据最大行数',
        formProSqlId: '数据源',
        tdBreakLine: '单元格内容是否折行',
        left: 'x 坐标',
        top: 'y 坐标',
        height: '高',
        width: '宽',
        color: '字体颜色',
        backgroundColor: '背景色',
        borderWidth: '边框宽度',
        borderColor: '边框颜色',
        borderRadius: '边框圆角半径',
        borderLeft: '左边框',
        borderRight: '右边框',
        borderTop: '上边框',
        borderBottom: '下边框',
        fontSize: '字体大小',
        fontWeight: '字体粗细',
        lineHeight: '行高',
        letterSpacing: '字间距',
        textAlign: '对齐方式',
        opacity: '透明度',
        format: '格式',
        placeholder: '提示文字',
        readonly: '只读',
        field: '绑定字段',
        formatStr: '日期格式',
        connectorChar: '连接符',
        showTotalPage: '是否显示总页数',
        customValue: '是否手动编辑',
        imageSrc: '图片',
        fixTop: '滚动时是否固定在顶部',
        isShowTotal: '是否显示总量',
        drugName: '用药及输液名称',
        syName: '输液行名称',
        sxName: '输血行名称',
        clName: '出量行名称',
        infusionAndBloodSplit: '输血输液是否分开展示',
        drugNum: '用药行数',
        syNum: '输液行数',
        sxNum: '输血行数',
        clNum: '出量行数',
        isScale: '用药名称是否自动缩放',
        monSum: '监测项行数',
        monName: '检测项名称',
        labelName: '名字',
        multi: '是否多选',
        limit: '最多选择几项(0表示不限制)',
        clearable: '能否清除',
        label: '标签文字',
        unit: '单位',
        direction: '展示方向',
        onlyNum: '只能输入数字',
        maxLength: '输入长度（0表示不限制）',
        digit: '小数位数(大于等于9表示不限制)',
        option: '选项来源',
        allowCreate: '是否允许手动创建',
        canEditName: '诊断/手术名能否任意编辑',
        sysCode: '字典值',
        // getCurPageAllEvent: '是否展示特殊事件',
        remarkStyleNum: '备注标记样式',
        remarkStyleNumShowTime: '按序号展示时是否需要显示时间',
        showAnalgesicPlan: '无镇痛方案时是否展示镇痛方案',
        xuhaoSignSpecialEventShowIcon: '备注按序号显示时特殊事件显示图标',
        barCodeValue: '是否显示条码文字',
        barCodeValueSize: '条码文字大小',
        barCodeFormat: '条码格式',
        rpList: '处方内容配置',
        userType: '角色类型',
        required: '是否必填',
        minGrade: '最小分数(小于该分数不能出室,0表示不限制)',
        isSplit: '是否拆分成多个选择器(仅多选时有效)',
        noDataText: '空值打印显示文字',
        labelLineFeed: '标题换行',
        optionLineFeed: '选项换行',
        metaData: '字典编码',
        canEdit: '能否修改时间',
        labelDirection: '名称对齐方式',
        showBorder: '是否显示边框',
        totalColumnWidth: '总量列显示宽度',
        rotate: '旋转',
        vitalSigns_coolingData: '体征曲线设置',
        moniEventConfig: '监护事件设置',
        svgSize: '图标大小',
        svgColor: '图标颜色',
        hGridNum: '横轴格数', // 纵轴格数
        vGridNum: '纵轴格数', // 纵轴格数
        gridStyle: '虚线/实线', // 虚线/实线
        nbpABP: '是否区分有创/无创血压',
        showWarnningSynbol: '是否显示异常值图标',
        isRelativeIcuAreaDays: '以入区天数为页码',
        sharePageNum: '正反面共用页码',
        prefix: '前缀',
        inAreaDay: '入区当天按自然日期记录',
        showDaySpan: '显示查询日期和跨天日期',
        limitPageNum: '限制最大换页页数',
        displayRules: '数据展示规则',
        bodyType: '人体类型',
        bodyFront: '正面/反面',
        bodyImageType: '人体图类型',
        staggeredInput: '入量错开显示',
        dislocation: '流速错位展示',
        lineCenter: '执行进度条是否居中显示',
        startTimeSelect: '医嘱开始时间的展示样式',
        continueStyle: '医嘱继续执行/续药样式',
        centerDisplay: '是否描点居中',
        xAxisShowFlag: '显示时间轴', // 是否显示时间轴
        // xAxisLabelAlign: '时间轴对齐方式', // 对齐格式
        timeFormat: '时间刻度格式', // 时间轴的格式
        xAxisInterval: '刻度间隔'
        // clospanFlag: '自定义合并单元格'
      },
      fields: {
        recipel: [

        ]
      },
      dict: [],
      imageList: [],
      uploadImageApi: (process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API) + '/basedata/uploadDocPicture',
      limitPageNumOptions: [
        { label: '不限制', value: '0' },
        { label: '限制1页', value: '1' },
        { label: '限制2页', value: '2' }
      ],
      displayRulesOptions: [
        { label: '仅展示一次', value: '1', statusDict: '1' },
        { label: '换页重复展示', value: '2', statusDict: '1' }
      ],
      selectTdDom: {},
      fontSizeList: ['6px', '7px', '8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '30px', '32px', '34px', '36px', '38px', '40px', '42px', '44px', '46px', '48px'],
      paramName: '',
      paramValue: '',
      operator: ''

    }
  },
  computed: {
    styleKeys() {
      return this.$store.state.formCreator.curComponent
        ? Object.keys(this.$store.state.formCreator.curComponent.style)
        : []
    },
    attrKeys() {
      return this.$store.state.formCreator.curComponent
        ? this.$store.state.formCreator.curComponent.attr
          ? Object.keys(this.$store.state.formCreator.curComponent.attr)
          : []
        : []
    },
    curComponent() {
      return this.$store.state.formCreator.curComponent
    },
    sum() {
      if (this.curComponent?.attr?.drugNum !== undefined) {
        let sum =
          this.curComponent.attr.drugNum +
          this.curComponent.attr.syNum +
          this.curComponent.attr.clNum
        if (this.curComponent.attr.infusionAndBloodSplit == 1) {
          sum += this.curComponent.attr.sxNum
        }
        return sum
      }
      return undefined
    },
    canvasStyle() {
      return this.$store.state.formCreator.canvasStyleData
    },
    filterDataSourseList() {
      if (this.curComponent.component == 'PumpAdministration' || this.curComponent.component == 'InfusionAdministration') { // 泵入药 交叉表类型
        return this.dataSourceList.filter(item => ((item.fitComponent && item.fitComponent.indexOf(this.curComponent?.attr?.recordTypeDict) > -1) || item.fitComponent == '' || !item.fitComponent))
      } else if (commonList.filter(item => item.component == this.curComponent.component).length > 0) {
        return this.dataSourceList.filter(item => ((item.fitComponent && item.fitComponent.indexOf('3') > -1) || item.fitComponent == '' || !item.fitComponent))
      } else if (this.curComponent?.attr?.recordTypeDict) { // 表格组件根据自身的类型来过滤
        return this.dataSourceList.filter(item => ((item.fitComponent && item.fitComponent.indexOf(this.curComponent?.attr?.recordTypeDict) > -1) || item.fitComponent == '' || !item.fitComponent))
      } else return this.dataSourceList
    }
  },
  watch: {
    'curComponent.attr.maxRows': function() { // 切换流式表最大行数时 高度按照表格组件的表格来重新计算
      if (this.curComponent?.attr?.recordTypeDict == '2') {
        this.curComponent.style.height = 10
      }
    },
    'curComponent.attr.field': {
      handler() {
        this.curComponent_attr_field = this.curComponent && this.curComponent.attr.field ? this.curComponent.attr.field.split('>') : []
      },
      immediate: true
    },
    'curComponent.attr.custom_field': {
      handler() {

      },
      immediate: true
    },
    'curComponent.attr.limitPageNum': {
      handler() {
        if (!this.curComponent.attr.limitPageNum || (this.curComponent.attr.limitPageNum && this.curComponent.attr.limitPageNum == '1')) {
          this.displayRulesOptions = [
            { label: '仅展示一次', value: '1', statusDict: '1' },
            { label: '换页重复展示', value: '2', statusDict: '1' }
          ]
        } else {
          this.displayRulesOptions = [
            { label: '仅展示一次', value: '1', statusDict: '1' },
            { label: '换页重复展示', value: '2', statusDict: '0' }
          ]
          if (this.curComponent.attr.displayRules && this.curComponent.attr.displayRules != '1') { this.curComponent.attr.displayRules = '1' }
        }
      },
      immediate: true
    },
    canvasStyle() {
      this.initVar()
    },
    sum() {
      if (this.sum != undefined) {
        this.curComponent.style.height = this.sum * 14
      }
    },
    'curComponent.attr.monSum'() {
      if (this.curComponent?.attr?.monSum) {
        this.curComponent.style.height = this.curComponent.attr.monSum * 14
      }
    },
    // 多页模式
    multiPageMode: function(newValue, oldValue) {
      if (newValue == '1') {
        this.curComponent.attr.sharePageNum = '0'
      }
    },
    // 生命体征曲线居中处理信息 和 整点实线的处理
    'curComponent.attr.centerDisplay': function(newValue, oldValue) {
      if (newValue == '1') {
        this.$message.warning('“描点居中”与“整点实线非整点虚线”不可同时选择！！')
        this.curComponent.attr.gridStyle = 2
      }
    },
    'curComponent.attr.clospanCondition': {
      handler() {
        this.curComponent.attr.clospanExpression = ''
        let expressionFn = ''
        let errorFlag = false
        this.curComponent.attr.clospanCondition.forEach((item, index) => {
          if (!item.operator) {
             errorFlag = true
             this.$message.error('请选择运算符')
          }
          if (item.paramName && item.paramValue) {
            if (index != this.curComponent.attr.clospanCondition.length - 1) {
              if (item.concatChar) {
                this.curComponent.attr.clospanExpression += (item.preChar || '') + item.paramName + item.operator + item.paramValue + (item.afterChar || '') + item.concatChar
                expressionFn += (item.preChar || '') + '1==1' + (item.afterChar || '') + item.concatChar
              } else {
                errorFlag = true
                this.$message.warning('多种数据条件请选择“与/或”关系')
              }
            } else {
              this.curComponent.attr.clospanExpression += (item.preChar || '') + item.paramName + item.operator + item.paramValue + (item.afterChar || '')
              expressionFn += (item.preChar || '') + '1==1' + (item.afterChar || '')
           }
          } else {
            this.curComponent.attr.clospanExpression = ''
            // this.$message.warning('数据条件不成立! 表达式配置错误')
          }
        })
        console.log('this.curComponent.attr.clospanExpression', expressionFn, this.curComponent.attr.clospanExpression)
        if (!errorFlag) {
          try {
            const expression = new Function(`return ${expressionFn}`)
            if (!expression()) {
              this.$message({
                message: '数据条件不成立! 表达式配置错误',
                type: 'error'
              })
            }
          } catch {
            this.$message({
                message: '数据条件不成立! 表达式配置错误',
                type: 'error'
              })
          }
        }
      },
      deep: true
    },
    'curComponent.attr.rowspanCondition': {
      handler() {
        this.curComponent.attr.rowspanExpression = ''
        let expressionFn = ''
        let errorFlag = false
        this.curComponent.attr.rowspanCondition.forEach((item, index) => {
          if (!item.operator) {
             errorFlag = true
             this.$message.error('请选择运算符')
          }
          if (item.paramName && item.paramValue) {
            if (index != this.curComponent.attr.rowspanCondition.length - 1) {
              if (item.concatChar) {
                this.curComponent.attr.rowspanExpression += (item.preChar || '') + item.paramName + item.operator + item.paramValue + (item.afterChar || '') + item.concatChar
                expressionFn += (item.preChar || '') + '1==1' + (item.afterChar || '') + item.concatChar
              } else {
                errorFlag = true
                this.$message.warning('多种数据条件请选择“与/或”关系')
              }
            } else {
              this.curComponent.attr.rowspanExpression += (item.preChar || '') + item.paramName + item.operator + item.paramValue + (item.afterChar || '')
              expressionFn += (item.preChar || '') + '1==1' + (item.afterChar || '')
           }
          } else {
            this.curComponent.attr.rowspanExpression = ''
            // this.$message.warning('数据条件不成立! 表达式配置错误')
          }
        })
        if (!errorFlag) {
          try {
            const expression = new Function(`return ${expressionFn}`)
            if (!expression()) {
              this.$message({
                message: '数据条件不成立! 表达式配置错误',
                type: 'error'
              })
            }
          } catch {
            this.$message({
                message: '数据条件不成立! 表达式配置错误',
                type: 'error'
              })
          }
        }
      },
      deep: true
    }
  },
  created() {
    this.initVar()
    this.getFormNameDetailsList()
    this.getBasicData()
    this.getImageList()
    // this.getDictItemGroups()
  },
  methods: {
    addCondition(index) {
      this.curComponent.attr.clospanCondition.splice(index + 1, 0, {
         preChar: '', paramName: '', operator: '', paramValue: '', afterChar: '', concatChar: ''
      })
    },
    addRowSpanCondition(index) {
      this.curComponent.attr.rowspanCondition.splice(index + 1, 0, {
         preChar: '', paramName: '', operator: '', paramValue: '', afterChar: '', concatChar: ''
      })
    },
    deleteCondition(index) {
      if (this.curComponent.attr.clospanCondition.length > 1) {
        this.curComponent.attr.clospanCondition.splice(index, 1)
      }
    },
    deleteRowSpanCondition(index) {
      if (this.curComponent.attr.rowspanCondition.length > 1) {
        this.curComponent.attr.rowspanCondition.splice(index, 1)
      }
    },
    /**
     * 切换生命曲线图的线样式
     * @param {*} e
     */
    changeGridStyle(e) {
      if (e == 3 && this.curComponent.attr.centerDisplay == 1) { // 曲线样式为整点实线时 居中处理不生效
        this.curComponent.attr.centerDisplay = 0
        this.$message.warning('“描点居中”与“整点实线非整点虚线”不可同时选择！！')
      }
    },
    getKey,
    getvitalSignsItemConfigBody(done) {
      this.curComponent.attr.vitalSigns = this.$refs.vitalSignsItemConfigBody.tableData
      this.curComponent.attr.coolingData = this.$refs.vitalSignsItemConfigBody.tableDataItemPhysics
      done()
    },
    getmoniEventConfig(done) {
      this.curComponent.attr.moniEventConfig = this.$refs.moniEventConfig.tableData
      done()
    },
    initVar() {
      document.querySelector('#app').style.setProperty('--label-color', this.canvasStyle?.labelColor || '#000000')
      document.querySelector('#app').style.setProperty('--value-color', this.canvasStyle?.valueColor || '#000000')
      this.formConf = {
        labelColor: this.canvasStyle?.labelColor || '#000000',
        valueColor: this.canvasStyle?.valueColor || '#000000'
      }
    },
    // 获取数据源列表
    getFormNameDetailsList() {
      formProSql_getFormProList({}).then(res => {
        this.dataSourceList = res.data
      })
    },
    getDictItemGroups() {
      getDictItemGroups().then(res => {
        this.dict = res.resultList?.filter(item => item.enable)
      })
    },
    setColor() {
      this.$store.commit('setCanvasStyle', Object.assign({}, this.canvasStyle, this.formConf))
    },
    addQuotaOptionItem(index) {
      this.curComponent.attr.quota[index].options.push({
        label: '',
        grade: 0
      })
    },
    addQuotaItem() {
      this.curComponent.attr.quota.push({
        name: '',
        options: []
      })
    },
    addSelectItem() {
      this.curComponent.attr.option.list.push({
        label: '',
        value: ''
      })
    },

    delRow(arr, index) {
      arr.splice(index, 1)
    },
    addRow(arr, index, obj) {
      arr.splice(index, 0, obj)
    },
    async getBasicData() {
      const result = await patientRecord_getPatientPropertyList()
      this.fields.recipel = result.data
      this.fields.recipel.push({ // 添加自定义 字段
        label: '自定义',
        value: 'custom'
      })
    },
    handleChange(e, key) {
      if (e) {
        if (key == 'field' && e.length > 0) { this.curComponent.attr[key] = e.join('>') } else this.curComponent.attr[key] = ''
      } else {
        this.curComponent.attr[key] = ''
      }
      // this.$forceUpdate()
    },
    /**
     * 自定义绑定字段
     */
    changeFiled(e) {
      this.curComponent.attr.custom_field = e
      if (this.curComponent.component == 'MyCheckbox') {
        this.optionSrouceChange(this.curComponent.attr.option.from)
      }
    },
    /**
     * 获取文件列表
     */
    getImageList() {
      basedata_getDocPictureList().then(res => {
        const list = res.data
        if (list.length > 0) {
          this.imageList = list.map(item => {
            const url = (process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API) + item.fileName.replace(/\\/g, '/')
            return {
              url: url,
              height: item.height,
              width: item.width,
              name: url.split('/')[url.split('/').length - 1]
            }
          })
        }
      })
    },
    /**
     * 选择图片
     */
    changeImage(e) {
      this.curComponent.attr.imageSrc = e.url
      this.curComponent.propValue = e.url
      this.curComponent.style.width = e.width
      this.curComponent.style.height = e.height
    },
    /** 上传成功 */
    successUpload(res) {
      this.imageList = res.data.map(item => {
        const url = (process.env.NODE_ENV === 'production' ? globalConfig.PRO_BASE_API || './' : globalConfig.BASE_API) + item.fileName.replace(/\\/g, '/')
        return {
          url: url,
          height: item.height,
          width: item.width,
          name: url.split('/')[url.split('/').length - 1]
        }
      })
      this.changeImage(this.imageList[this.imageList.length - 1])
    },
    /**
     * 查询图片大小
     */
    beforeUpload(file) {
      const isJPG = file.type
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG.startsWith('image/')) {
        this.$message.error('请上传图片类型文件!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      return isJPG && isLt2M
    },
    /**
     * 删除图片
     */
    deleteImage(e) {
      return false // 屏蔽删除功能

      // if (e && e.raw) {
      //   return true
      // }
      // return this.$confirm('确认是否删除该图片', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   const query = {
      //     'docPictureName': e.name
      //   }
      //   basedata_deleteDocPicture(query).then(res => {
      //     if (res.code) {
      //       this.getImageList()
      //     }
      //   })
      // })
    },
    /**
    切换选项来源
     */
    async optionSrouceChange(e) {
      if (e == 'sysCode' && this.curComponent.attr.custom_field != '') { // 选项来源
        const metaCode = this.getKey(this.curComponent.attr.custom_field)[0]
        this.curComponent.attr.option.list = []
        const children = await this.getMetaDataChidren(metaCode)
        if (children.length > 0) {
          this.curComponent.attr.option.list = children.map(item => {
            item.label = item.dictName
            item.value = item.dictCode
            return item
          })
          this.curComponent.attr.option.list = [...this.curComponent.attr.option.list]
        }
      }
    },
    /**
     * 获取元数据对应子项
     * */
    getMetaDataChidren(code) {
      return new Promise((resolve, reject) => {
        metadata_linkDictItems({
          metaCode: code
        }).then(res => {
          if (res.data) {
            resolve(res.data)
          } else {
            resolve([])
          }
        })
      })
    },

    /** 评估单 */
    insertMetaData(e) {
      if (this.metaDataTab == 'metaData') {
        this.curComponent.attr.metaData = e.metaName
        this.curComponent.attr.tdContent = e.tdContent
      } else if (this.metaDataTab == 'assess') {
         this.curComponent.attr.formId = e.metaCode
         this.curComponent.attr.formName = e.metaName
      }
    },
    /**
     * 显示问题
     */
    showMetaDialog(str) {
      this.metaDialogFlag = true
      this.metaDataTab = str

      if (str == 'metaData' && this.curComponent.attr.tdContent) {
        const doc = new DOMParser().parseFromString('<div>' + this.curComponent.attr.tdContent + '</div>', 'text/html')
        this.selectTdDom = doc.documentElement
      } else {
        this.selectTdDom = null
      }
    },
    /**
     * 更新数据源绑定参数 以及dataType
     */
    updateFormProSqlInfo(e) {
      if (e) {
        this.curComponent.attr.dataType = this.dataSourceList.filter(item => item.id == e)[0].dataType
      }
    },
    /**
     * 选择数据源
     */
    selectProSalId(e) {
      if (e) {
        const filterRe = this.dataSourceList.filter(item => item.id == e)
        if (filterRe.length > 0) {
          this.curComponent.attr.proApi = filterRe[0].execSql
        }
      }
    },
    /** */
    changeIsRelativeIcuAreaDays(e) {
      if (e == 1) {
        if (this.curComponent.attr.sharePageNum == 1) {
          this.curComponent.attr.sharePageNum = 0
          this.$message({
            type: 'info',
            message: '入区天数为页数，正反面共享页码不能同时选择'
          })
        }
      }
    },
    ChangeSharePageNum(e) {
      if (e == 1) {
          if (this.curComponent.attr.isRelativeIcuAreaDays == 1) {
            this.curComponent.attr.isRelativeIcuAreaDays = 0
            this.$message({
              type: 'info',
              message: '入区天数为页数，正反面共享页码不能同时选择'
            })
         }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.attr-list {
  --el-form-item-width: 110px;
  overflow: auto;
  padding: 10px;
  padding-top: 0;
  height: 100%;
  ::v-deep .el-form--inline .el-form-item{
    width:47%;
  }
  .input-width {
    --el-form-item-width: 180px;
  }
  ::v-deep .el-input-number--mini  {
    width: 110px;
  }
}
.spanCondition{
  --el-form-item-width: 60px;
}
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  align-items: center;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .el-input + .el-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
.option-drag {
  cursor: move;
}
::v-deep .el-form-item--mini.el-form-item {
  margin-bottom: 6px;
}
::v-deep .el-form-item__label {
  min-width: 5em;
}
.rp-item {
  margin-bottom: 10px;
  align-items: center;
  .el-select {
    width: 75px;
    margin-right: 5px;
  }
  i {
    margin-left: 5px;
    font-size: 18px;
    cursor: pointer;
  }
}
.rp-list {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 5px;
}
.rp-blank {
  .title {
    font-size: 14px;
    margin: 10px 0;
  }
  .flex {
    align-items: center;
    margin-bottom: 10px;
  }
}
.align-left {
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
::v-deep .el-upload-list {
  max-height: 300px;
  overflow-y: auto;
}
::v-deep .el-upload-list__item {
  margin-top: 0px;
  padding: 10px 10px 10px 90px;
  height: 50px;
  line-height: 50px;
  padding-top: 0px;
  margin-top: 5px;
}
::v-deep .el-upload-list__item-thumbnail {
  position: absolute;
  top: 4px;
  width: 40px;
  height: 40px;
}
::v-deep
  .el-upload-list--picture
  .el-upload-list__item.is-success
  .el-upload-list__item-name {
  line-height: 50px;
}

::v-deep .el-icon-check:before {
  position: absolute;
  content: '\e6da';
  left: 0px;
  top: -14px;
}
.colspan-btn{
  width:28px;
  height:28px;
  background:#fff;
  border:1px solid #c0c4cc;
  margin-right:10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

}
.colspan-selected{
  background:#dbdbdb;
}
</style>

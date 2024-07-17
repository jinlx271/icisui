
import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../views/layout'
Vue.use(Router)
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch((err) => err)
// }
// const originalReplace = Router.prototype.replace
// Router.prototype.replace = function replace(location) {
//   return originalReplace.call(this, location).catch((err) => err)
// }
const routerList = [
  {
    path: '/',
    name: 'root',
    meta: {
      title: '配置管理'
    },
    component: Layout
  },
  {
    path: '/configuration',
    name: 'configuration',
    meta: {
      title: '配置管理'
    },
    component: Layout
  }
]

const configuration = [
  {
    path: '/configuration',
    meta: {
      title: '配置管理'
    },
    name: 'configuration',
    hidden: true,
    // redirect: { name: 'configuration_authorManagement' },
    component: Layout,
    children: [
      {
        path: '/authorManagement',
        name: 'configuration_authorManagement',
        meta: {
          title: '权限管理'
        },
        redirect: { name: 'configuration_authorManagement_userManagement' },
        children: [
          {
            path: '/authorManagement/userManagement',
            name: 'configuration_authorManagement_userManagement',
            component: () => import('../views/authorityManagement/userManagement.vue'),
            meta: {
              title: '用户管理'
            }
          },
          {
            path: '/authorManagement/roleManagement',
            name: 'configuration_authorManagement_roleManagement',
            component: () => import('../views/authorityManagement/roleManagement.vue'),
            meta: {
              title: '角色管理'
            }
          },
          {
            path: '/authorManagement/userRoleManagement',
            name: 'configuration_authorManagement_userRoleManagement',
            component: () => import('../views/authorityManagement/userRoleManagement.vue'),
            meta: {
              title: '用户角色管理'
            }
          },
          {
            path: '/authorManagement/menuManage',
            name: 'configuration_authorManagement_menuManage',
            component: () => import('../views/authorityManagement/menuManage'),
            meta: {
              title: '菜单管理'
            }
          }
        ]
      },
      {
        path: '/basicSettings',
        name: 'configuration_basicSettings',
        meta: {
          title: '基础配置'
        },
        redirect: { name: 'configuration_basicSettings_basicDictionary' },
        children: [
          {
            path: '/basicSettings/basicData',
            name: 'configuration_basicSettings_basicData',
            component: () => import('../views/basicSettings/basicData.vue'),
            meta: {
              title: '基础数据'
            }
          },
          {
            path: '/basicSettings/basicDictionary',
            name: 'configuration_basicSettings_basicDictionary',
            component: () => import('../views/basicSettings/basicDictionary.vue'),
            meta: {
              title: '基础字典'
            }
          },
          {
            path: '/basicSettings/paramConfig',
            name: 'configuration_basicSettings_paramConfig',
            component: () => import('../views/basicSettings/paramConfig.vue'),
            meta: {
              title: '参数设置'
            }
          },
          {
            path: '/basicSettings/bedConfig',
            name: 'configuration_basicSettings_bedConfig',
            component: () => import('../views/basicSettings/bedConfig.vue'),
            meta: {
              title: '床位管理'
            }
          },
          {
            path: '/basicSettings/shiftDictionary',
            name: 'configuration_basicSettings_shiftDictionary',
            component: () => import('../views/basicSettings/shiftDictionary.vue'),
            meta: {
              title: '班次字典'
            }
          },
          {
            path: '/basicSettings/guardianshipConfig',
            name: 'configuration_basicSettings_guardianshipConfig',
            component: () => import('../views/basicSettings/guardianshipConfig.vue'),
            meta: {
              title: '监护配置'
            }
          },
          {
            path: '/basicSettings/concentrateEntry',
            name: 'configuration_basicSettings_concentrateEntry',
            component: () => import('../views/basicSettings/concentrateEntry.vue'),
            meta: {
              title: '集中录入配置'
            }
          },
          {
            path: '/basicSettings/catheterMatch',
            name: 'configuration_basicSettings_catheterMatch',
            component: () => import('../views/basicSettings/catheterMatch.vue'),
            meta: {
              title: '导管部位匹配'
            }
          },
          {
            path: '/basicSettings/dermaMatch',
            name: 'configuration_basicSettings_dermaMatch',
            component: () => import('../views/basicSettings/dermaMatch.vue'),
            meta: {
              title: '皮肤部位匹配'
            }
          },
          {
            path: '/basicSettings/nursingRecordTemplate',
            name: 'configuration_basicSettings_nursingRecordTemplate',
            component: () => import('../views/basicSettings/nursingRecordTemplate.vue'),
            meta: {
              title: '护理记录模板'
            }
          },
          {
            path: '/basicSettings/salvageItem',
            name: 'configuration_basicSettings_salvageItem',
            component: () => import('../views/basicSettings/salvageItem.vue'),
            meta: {
              title: '抢救记录项'
            }
          },

          {
            path: '/basicSettings/ICUArea',
            name: 'configuration_basicSettings_ICUArea',
            component: () => import('../views/basicSettings/ICUArea.vue'),
            meta: {
              title: 'ICU病区设置'
            }
          },
          {
            path: '/basicSettings/iCUQualitySign',
            name: 'configuration_basicSettings_iCUQualitySign',
            component: () => import('../views/basicSettings/iCUQualitySign.vue'),
            meta: {
              title: 'ICU质控标识配置'
            }
          },
          {
            path: '/basicSettings/ICUQualityControl',
            name: 'configuration_basicSettings_ICUQualityControl',
            component: () => import('../views/basicSettings/ICUQualityControl.vue'),
            meta: {
              title: 'ICU质控报表配置'
            }
          },
          {
            path: '/basicSettings/keyPatientsConfig',
            name: 'configuration_basicSettings_keyPatientsConfig',
            component: () => import('../views/basicSettings/keyPatientsConfig.vue'),
            meta: {
              title: '重点患者情况设置'
            }
          },
          {
            path: '/basicSettings/vitalSignsItemConfig',
            name: 'configuration_basicSettings_vitalSignsItemConfig',
            component: () => import('../views/basicSettings/vitalSignsItemConfig.vue'),
            meta: {
              title: '生命体征曲线设置'
            }
          },
          {
            path: '/basicSettings/concernsConfig',
            name: 'configuration_basicSettings_concernsConfig',
            component: () => import('../views/basicSettings/concernsConfig.vue'),
            meta: {
              title: '关注项配置'
            }
          },
          {
            path: '/basicSettings/drugDosageConfig',
            name: 'configuration_basicSettings_drugDosageConfig',
            component: () => import('../views/basicSettings/drugDosageConfig.vue'),
            meta: {
              title: '药品剂量换算设置'
            }
          },
          {
            path: '/basicSettings/flowRateUnitConfig',
            name: 'configuration_basicSettings_flowRateUnitConfig',
            component: () => import('../views/basicSettings/flowRateUnitConfig.vue'),
            meta: {
              title: '流速单位换算配置'
            }
          },
          {
            path: '/basicSettings/flowRateCalcConfig',
            name: 'configuration_basicSettings_flowRateCalcConfig',
            component: () => import('../views/basicSettings/flowRateCalcConfig.vue'),
            meta: {
              title: '流速计算配置'
            }
          },
          {
            path: '/basicSettings/pipeMonitorMatch',
            name: 'configuration_basicSettings_pipeMonitorMatch',
            component: () => import('../views/basicSettings/pipeMonitorMatch.vue'),
            meta: {
              title: '导管监护项匹配'
            }
          },

          {
            path: '/basicSettings/drugUsageConfig',
            name: 'configuration_basicSettings_drugUsageConfig',
            component: () => import('../views/basicSettings/drugUsageConfig.vue'),
            meta: {
              title: '药品用法设置'
            }
          },
          {
            path: '/basicSettings/orderExcuteFreq',
            name: 'configuration_basicSettings_orderExcuteFreq',
            component: () => import('../views/basicSettings/orderExcuteFreq.vue'),
            meta: {
              title: '医嘱执行频次设置'
            }
          },
          {
            path: '/basicSettings/moniEventConfig',
            name: 'configuration_basicSettings_moniEventConfig',
            component: () => import('../views/basicSettings/moniEventConfig.vue'),
            meta: {
              title: '监护事件设置'
            }
          },
          {
            path: '/basicSettings/diagnoseClassify',
            name: 'configuration_basicSettings_diagnoseClassify',
            component: () => import('../views/basicSettings/diagnoseClassify.vue'),
            meta: {
              title: '诊断分类系数配置'
            }
          },
          {
            path: '/basicSettings/diseaseConfig',
            name: 'configuration_basicSettings_diseaseConfig',
            component: () => import('../views/basicSettings/diseaseConfig.vue'),
            meta: {
              title: '病种配置'
            }
          },
          {
            path: '/basicSettings/moniitemInspection',
            name: 'configuration_basicSettings_moniitemInspection',
            component: () => import('../views/basicSettings/moniitemInspection.vue'),
            meta: {
              title: '检验指标对照'
            }
          },
          {
            path: '/basicSettings/templateConfig',
            name: 'configuration_basicSettings_templateConfig',
            component: () => import('../views/basicSettings/templateConfig.vue'),
            meta: {
              title: '模板配置'
            }
          },
          {
            path: '/basicSettings/helpConfig',
            name: 'configuration_basicSettings_helpConfig',
            component: () => import('../views/basicSettings/helpConfig.vue'),
            meta: {
              title: '操作手册配置'
            }
          },
          {
            path: '/basicSettings/backgroundLogoMana',
            name: 'configuration_basicSettings_backgroundLogoMana',
            component: () => import('../views/basicSettings/backgroundLogoMana.vue'),
            meta: {
              title: '背景LOGO管理'
            }
          },
          {
            path: '/basicSettings/anasDrugSetting',
            name: 'configuration_basicSettings_anasDrugSetting',
            component: () => import('../views/basicSettings/anasDrugSetting.vue'),
            meta: {
              title: '镇痛镇静药品设置'
            }
          },
          {
            path: '/basicSettings/dialysisDrugSetting',
            name: 'configuration_basicSettings_dialysisDrugSetting',
            component: () => import('../views/basicSettings/dialysisDrugSetting.vue'),
            meta: {
              title: '透析配液药品设置'
            }
          },
          {
            path: '/basicSettings/patientIconSetting',
            name: 'configuration_basicSettings_patientIconSetting',
            component: () => import('../views/basicSettings/patientIconSetting.vue'),
            meta: {
              title: '患者标识配置'
            }
          },
          {
            path: '/basicSettings/outzoneRuleConfig',
            name: 'configuration_basicSettings_outzoneRuleConfig',
            component: () => import('../views/basicSettings/outzoneRuleConfig.vue'),
            meta: {
              title: '出区标准配置'
            }
          },
          {
            path: '/basicSettings/automaticOrder',
            name: 'configuration_basicSettings_automaticOrder',
            component: () => import('../views/basicSettings/automaticOrder.vue'),
            meta: {
              title: '自动提取医嘱配置'
            }
          },
          {
            path: '/basicSettings/consuting',
            name: 'configuration_basicSettings_consuting',
            component: () => import('../views/basicSettings/consuting.vue'),
            meta: {
              title: '病情分析配置'
            }
          },
          {
            path: '/basicSettings/verificationRules',
            name: 'configuration_basicSettings_verificationRules',
            component: () => import('../views/basicSettings/verificationRules.vue'),
            meta: {
              title: '数据校验规则配置'
            }
          },
          {
            path: '/basicSettings/dictionaryConversion',
            name: 'configuration_basicSettings_dictionaryConversion',
            component: () => import('../views/basicSettings/dictionaryConversion.vue'),
            meta: {
              title: '字典转换对照'
            }
          },
          {
            path: '/basicSettings/dataAcquisition',
            name: 'configuration_basicSettings_dataAcquisition',
            component: () => import('../views/basicSettings/dataAcquisition.vue'),
            meta: {
              title: '数据采集对照'
            }
          },
          {
            path: '/basicSettings/qcConfig',
            name: 'configuration_basicSettings_qcConfig',
            component: () => import('../views/basicSettings/qcConfig.vue'),
            meta: {
              title: '质控查询界面配置'
            }
          },
          {
            path: '/basicSettings/aidConfig',
            name: 'configuration_basicSettings_aidConfig',
            component: () => import('../views/basicSettings/aidConfig.vue'),
            meta: {
              title: '护理书写助手配置'
            }
          },
          {
            path: '/basicSettings/patientMonitorConfig',
            name: 'configuration_basicSettings_patientMonitorConfig',
            component: () => import('../views/basicSettings/patientMonitorConfig.vue'),
            meta: {
              title: '患者监控配置'
            }
          },
          {
            path: '/basicSettings/KPISet',
            name: 'configuration_basicSettings_KPISet',
            component: () => import('../views/basicSettings/KPISet.vue'),
            meta: {
              title: '绩效加分项配置'
            }
          },
          {
            path: '/basicSettings/nursePlanConfig',
            name: 'configuration_basicSettings_nursePlanConfig',
            component: () => import('../views/basicSettings/nursePlanConfig.vue'),
            meta: {
              title: '护理计划模板配置'
            }
          },
          {
            path: '/basicSettings/orderMatchBusinessConfig',
            name: 'configuration_basicSettings_orderMatchBusinessConfig',
            component: () => import('../views/basicSettings/orderMatchBusinessConfig.vue'),
            meta: {
              title: '医嘱匹配业务配置'
            }
          }
        ]
      },
      {
        path: '/medicalCalc',
        name: 'configuration_medicalCalc',
        meta: {
          title: '医学计算器配置'
        },
        redirect: { name: 'configuration_medicalCalc_formulaGrouping' },
        children: [
          {
            path: '/medicalCalc/formulaGrouping',
            name: 'configuration_medicalCalc_formulaGrouping',
            component: () => import('../views/medicalCalc/formulaGrouping.vue'),
            meta: {
              title: '公式分组配置'
            }
          },
          {
            path: '/medicalCalc/customFormula',
            name: 'configuration_medicalCalc_customFormula',
            component: () => import('../views/medicalCalc/customFormula.vue'),
            meta: {
              title: '自定义公式配置'
            }
          }
        ]
      },
      {
        path: '/recordSetting',
        name: 'configuration_recordSetting',
        meta: {
          title: '文书模板配置'
        },
        redirect: { name: 'configuration_recordSetting_recordList' },
        children: [
          {
            path: '/recordSetting/recordList',
            name: 'configuration_recordSetting_recordList',
            component: () => import('../views/recordSetting/recordList.vue'),
            meta: {
              title: '表格组件'
            }
          },
          {
            path: '/recordSetting/index',
            name: 'configuration_recordSetting_index',
            component: () => import('../views/recordSetting/index.vue'),
            meta: {
              title: '文书模板配置'
            },
            hidden: true
          },
          {
            path: '/recordSetting/recordTempList',
            name: 'configuration_recordSetting_recordTempList',
            component: () => import('../views/recordSetting/recordTempList.vue'),
            meta: {
              title: '文书模板列表'
            }
          },
          {
            path: '/recordSetting/dataSourceList',
            name: 'configuration_recordSetting_dataSourceList',
            component: () => import('../views/recordSetting/dataSourceList.vue'),
            meta: {
              title: '文书数据源'
            }
          },
          {
            path: '/recordSetting/tinymacEditor',
            name: 'configuration_recordSetting_tinymacEditor',
            component: () => import('../views/recordSetting/tinymacEditor'),
            meta: {
              title: '特护单配置'
            },
            hidden: true
          },
          {
            path: '/recordSetting/indexD',
            name: 'configuration_recordSetting_indexD',
            component: () => import('../views/recordSetting/indexD.vue'),
            meta: {
              title: '特护单数据配置'
            }
          },
          {
            path: '/recordSetting/wardTempList',
            name: 'configuration_recordSetting_wardTempList',
            component: () => import('../views/recordSetting/wardTempList.vue'),
            meta: {
              title: '病区文书列表配置'
            }
          }
        ]
      },
      {
        path: '/evaluationForms',
        name: 'configuration_evaluationForms',
        meta: {
          title: '评估单管理'
        },
        redirect: { name: 'configuration_evaluationForms_dataMetaConfig' },
        children: [
          {
            path: '/evaluationForms/dataMetaConfig',
            name: 'configuration_evaluationForms_dataMetaConfig',
            component: () => import('../views/evaluationForms/dataMetaConfig.vue'),
            meta: {
              title: '元数据配置'
            }
          },
          {
            path: '/evaluationForms/componentdesign',
            name: 'configuration_evaluationForms_componentdesign',
            component: () => import('../views/evaluationForms/componentdesign/index.vue'),
            meta: {
              title: '组件块配置'
            }
          },
          {
            path: '/evaluationForms/componentdesign/add',
            name: 'configuration_evaluationForms_componentdesign_add',
            component: () => import('../views/evaluationForms/componentdesign/add.vue'),
            hidden: true,
            meta: {
              title: '组件块配置新增'
            }
          },
          {
            path: '/evaluationForms/areaEvaluationForm',
            name: 'configuration_evaluationForms_areaEvaluationForm',
            component: () => import('../views/evaluationForms/areaEvaluationForm.vue'),
            meta: {
              title: '评估表配置'
            }
          },
          {
            path: '/evaluationForms/evaluationFormConfig',
            name: 'configuration_evaluationForms_evaluationFormConfig',
            component: () => import('../views/evaluationForms/evaluationFormConfig.vue'),
            meta: {
              title: '病区评估表配置'
            }
          },
          {
            path: '/evaluationForms/NISEvaluationForm',
            name: 'configuration_evaluationForms_NISEvaluationForm',
            component: () => import('../views/evaluationForms/NISEvaluationForm.vue'),
            meta: {
              title: 'NIS评估表对照'
            }
          }
        ]
      },
      {
        path: '/intelligence',
        name: 'configuration_intelligence',
        meta: {
          title: '数据源配置'
        },
        children: [
          {
            path: '/evaluationForms/dataSourceConfig',
            name: 'configuration_evaluationForms_dataSourceConfig',
            component: () => import('../views/evaluationForms/dataSourceConfig.vue'),
            meta: {
              title: '数据源配置'
            }
          }
        ]
      },
      {
        path: '/operationManage',
        name: 'configuration_operationManage',
        meta: {
          title: '运维管理'
        },
        redirect: { name: 'configuration_operationManage_interfaceLog' },
        children: [
          {
            path: '/operationManage/interfaceLog',
            name: 'configuration_operationManage_interfaceLog',
            component: () => import('../views/operationManage/interfaceLog.vue'),
            meta: {
              title: '接口日志查询'
            }
          },
          {
            path: '/operationManage/sysErrorLog',
            name: 'configuration_operationManage_sysErrorLog',
            component: () => import('../views/operationManage/sysErrorLog.vue'),
            meta: {
              title: '系统异常日志查询'
            }
          },
          {
            path: '/operationManage/orderQuery',
            name: 'configuration_operationManage_orderQuery',
            component: () => import('../views/operationManage/orderQuery.vue'),
            meta: {
              title: '医嘱查询'
            }
          },
          {
            path: '/operationManage/deviceMonitor',
            name: 'configuration_operationManage_deviceMonitor',
            component: () => import('../views/operationManage/deviceMonitor.vue'),
            meta: {
              title: '设备采集监测'
            }
          }
        ]
      },
      {
        path: '/productAuthorization',
        name: 'configuration_productAuthorization',
        meta: {
          title: '授权管理'
        },
        redirect: { name: 'configuration_productAuthorization' },
        children: [
          {
            path: '/productAuthorization',
            name: 'configuration_productAuthorization',
            component: () => import('../views/productAuthorization/index.vue'),
            meta: {
              title: '授权管理'
            }
          }
        ]
      },
      {
        path: '/knowledgeSystem',
        name: 'configuration_knowledgeSystem',
        meta: {
          title: '知识体系'
        },
        redirect: { name: 'configuration_basicSettings_warningConfig' },
        children: [
          {
            path: '/basicSettings/warningConfig',
            name: 'configuration_basicSettings_warningConfig',
            component: () => import('../views/basicSettings/warningConfig.vue'),
            meta: {
              title: '预警管理'
            }
          },
          {
            path: '/basicSettings/pipeInfectRisk',
            name: 'configuration_basicSettings_pipeInfectRisk',
            component: () => import('../views/basicSettings/pipeInfectRisk.vue'),
            meta: {
              title: '导管感染风险配置'
            }
          },
          {
            path: '/knowledgeBase/medicine',
            name: 'configuration_knowledgeBase_medicine',
            component: () => import('../views/knowledgeBase/medicine'),
            meta: {
              title: '医学知识库配置'
            }
          }
        ]
      },
      {
        path: '/nutrition',
        name: 'configuration_nutrition',
        meta: {
          title: '营养管理配置'
        },
        redirect: { name: 'configuration_nutrition_stressList' },
        children: [
          {
            path: '/nutrition/stressList',
            name: 'configuration_nutrition_stressList',
            component: () => import('../views/nutrition/stressList.vue'),
            meta: {
              title: '应激因素配置'
            }
          },
          {
            path: '/nutrition/conversionList',
            name: 'configuration_nutrition_conversionList',
            component: () => import('../views/nutrition/conversionList.vue'),
            meta: {
              title: '营养换算配置'
            }
          }
        ]
      }
    ]
  }
]
// configuration.forEach(item => {
//   if (item.children.length > 0) {
//     const info = { ...item }
//     if (info.children) {
//       delete info.children
//     }
//     routerList.push(info)
//     item.children?.forEach(c1 => {
//       const obj = { ...c1 }
//       if (c1.children) {
//         delete obj.children
//       }
//       routerList.push(obj)
//       c1.children?.forEach(c2 => {
//         routerList.push(c2)
//       })
//     })
//   } else {
//     routerList.push(item)
//   }
// })
console.log('routerList', routerList)
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    settingRoutes: configuration,
    routes: routerList
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router


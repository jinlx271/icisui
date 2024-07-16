const configuration = [
  {
    path: '/',
    name: 'root',
    meta: {
      title: '配置管理'
    },
    redirect: { name: 'configuration_authorManagement' },
    children: [
      {
        path: '/configuration/authorManagement',
        name: 'configuration_authorManagement',
        meta: {
          title: '权限管理'
        },
        redirect: { name: 'configuration_authorManagement_userManagement' },
        children: [
          {
            path: '/configuration/authorManagement/userManagement',
            name: 'configuration_authorManagement_userManagement',
            component: () => import('@/views/configuration/authorityManagement/userManagement.vue'),
            meta: {
              title: '用户管理'
            }
          },
          {
            path: '/configuration/authorManagement/roleManagement',
            name: 'configuration_authorManagement_roleManagement',
            component: () => import('@/views/configuration/authorityManagement/roleManagement.vue'),
            meta: {
              title: '角色管理'
            }
          },
          {
            path: '/configuration/authorManagement/userRoleManagement',
            name: 'configuration_authorManagement_userRoleManagement',
            component: () => import('@/views/configuration/authorityManagement/userRoleManagement.vue'),
            meta: {
              title: '用户角色管理'
            }
          },
          {
            path: '/configuration/authorManagement/menuManage',
            name: 'configuration_authorManagement_menuManage',
            component: () => import('@/views/configuration/authorityManagement/menuManage'),
            meta: {
              title: '菜单管理'
            }
          }
        ]
      },
      {
        path: '/configuration/basicSettings',
        name: 'configuration_basicSettings',
        meta: {
          title: '基础配置'
        },
        redirect: { name: 'configuration_basicSettings_basicDictionary' },
        children: [
          {
            path: '/configuration/basicSettings/basicData',
            name: 'configuration_basicSettings_basicData',
            component: () => import('@/views/configuration/basicSettings/basicData.vue'),
            meta: {
              title: '基础数据'
            }
          },
          {
            path: '/configuration/basicSettings/basicDictionary',
            name: 'configuration_basicSettings_basicDictionary',
            component: () => import('@/views/configuration/basicSettings/basicDictionary.vue'),
            meta: {
              title: '基础字典'
            }
          },
          {
            path: '/configuration/basicSettings/paramConfig',
            name: 'configuration_basicSettings_paramConfig',
            component: () => import('@/views/configuration/basicSettings/paramConfig.vue'),
            meta: {
              title: '参数设置'
            }
          },
          {
            path: '/configuration/basicSettings/bedConfig',
            name: 'configuration_basicSettings_bedConfig',
            component: () => import('@/views/configuration/basicSettings/bedConfig.vue'),
            meta: {
              title: '床位管理'
            }
          },
          {
            path: '/configuration/basicSettings/shiftDictionary',
            name: 'configuration_basicSettings_shiftDictionary',
            component: () => import('@/views/configuration/basicSettings/shiftDictionary.vue'),
            meta: {
              title: '班次字典'
            }
          },
          {
            path: '/configuration/basicSettings/guardianshipConfig',
            name: 'configuration_basicSettings_guardianshipConfig',
            component: () => import('@/views/configuration/basicSettings/guardianshipConfig.vue'),
            meta: {
              title: '监护配置'
            }
          },
          {
            path: '/configuration/basicSettings/concentrateEntry',
            name: 'configuration_basicSettings_concentrateEntry',
            component: () => import('@/views/configuration/basicSettings/concentrateEntry.vue'),
            meta: {
              title: '集中录入配置'
            }
          },
          {
            path: '/configuration/basicSettings/catheterMatch',
            name: 'configuration_basicSettings_catheterMatch',
            component: () => import('@/views/configuration/basicSettings/catheterMatch.vue'),
            meta: {
              title: '导管部位匹配'
            }
          },
          {
            path: '/configuration/basicSettings/dermaMatch',
            name: 'configuration_basicSettings_dermaMatch',
            component: () => import('@/views/configuration/basicSettings/dermaMatch.vue'),
            meta: {
              title: '皮肤部位匹配'
            }
          },
          {
            path: '/configuration/basicSettings/nursingRecordTemplate',
            name: 'configuration_basicSettings_nursingRecordTemplate',
            component: () => import('@/views/configuration/basicSettings/nursingRecordTemplate.vue'),
            meta: {
              title: '护理记录模板'
            }
          },
          {
            path: '/configuration/basicSettings/salvageItem',
            name: 'configuration_basicSettings_salvageItem',
            component: () => import('@/views/configuration/basicSettings/salvageItem.vue'),
            meta: {
              title: '抢救记录项'
            }
          },

          {
            path: '/configuration/basicSettings/ICUArea',
            name: 'configuration_basicSettings_ICUArea',
            component: () => import('@/views/configuration/basicSettings/ICUArea.vue'),
            meta: {
              title: 'ICU病区设置'
            }
          },
          {
            path: '/configuration/basicSettings/iCUQualitySign',
            name: 'configuration_basicSettings_iCUQualitySign',
            component: () => import('@/views/configuration/basicSettings/iCUQualitySign.vue'),
            meta: {
              title: 'ICU质控标识配置'
            }
          },
          {
            path: '/configuration/basicSettings/ICUQualityControl',
            name: 'configuration_basicSettings_ICUQualityControl',
            component: () => import('@/views/configuration/basicSettings/ICUQualityControl.vue'),
            meta: {
              title: 'ICU质控报表配置'
            }
          },
          {
            path: '/configuration/basicSettings/keyPatientsConfig',
            name: 'configuration_basicSettings_keyPatientsConfig',
            component: () => import('@/views/configuration/basicSettings/keyPatientsConfig.vue'),
            meta: {
              title: '重点患者情况设置'
            }
          },
          {
            path: '/configuration/basicSettings/vitalSignsItemConfig',
            name: 'configuration_basicSettings_vitalSignsItemConfig',
            component: () => import('@/views/configuration/basicSettings/vitalSignsItemConfig.vue'),
            meta: {
              title: '生命体征曲线设置'
            }
          },
          {
            path: '/configuration/basicSettings/concernsConfig',
            name: 'configuration_basicSettings_concernsConfig',
            component: () => import('@/views/configuration/basicSettings/concernsConfig.vue'),
            meta: {
              title: '关注项配置'
            }
          },
          {
            path: '/configuration/basicSettings/drugDosageConfig',
            name: 'configuration_basicSettings_drugDosageConfig',
            component: () => import('@/views/configuration/basicSettings/drugDosageConfig.vue'),
            meta: {
              title: '药品剂量换算设置'
            }
          },
          {
            path: '/configuration/basicSettings/flowRateUnitConfig',
            name: 'configuration_basicSettings_flowRateUnitConfig',
            component: () => import('@/views/configuration/basicSettings/flowRateUnitConfig.vue'),
            meta: {
              title: '流速单位换算配置'
            }
          },
          {
            path: '/configuration/basicSettings/flowRateCalcConfig',
            name: 'configuration_basicSettings_flowRateCalcConfig',
            component: () => import('@/views/configuration/basicSettings/flowRateCalcConfig.vue'),
            meta: {
              title: '流速计算配置'
            }
          },
          {
            path: '/configuration/basicSettings/pipeMonitorMatch',
            name: 'configuration_basicSettings_pipeMonitorMatch',
            component: () => import('@/views/configuration/basicSettings/pipeMonitorMatch.vue'),
            meta: {
              title: '导管监护项匹配'
            }
          },

          {
            path: '/configuration/basicSettings/drugUsageConfig',
            name: 'configuration_basicSettings_drugUsageConfig',
            component: () => import('@/views/configuration/basicSettings/drugUsageConfig.vue'),
            meta: {
              title: '药品用法设置'
            }
          },
          {
            path: '/configuration/basicSettings/orderExcuteFreq',
            name: 'configuration_basicSettings_orderExcuteFreq',
            component: () => import('@/views/configuration/basicSettings/orderExcuteFreq.vue'),
            meta: {
              title: '医嘱执行频次设置'
            }
          },
          {
            path: '/configuration/basicSettings/moniEventConfig',
            name: 'configuration_basicSettings_moniEventConfig',
            component: () => import('@/views/configuration/basicSettings/moniEventConfig.vue'),
            meta: {
              title: '监护事件设置'
            }
          },
          {
            path: '/configuration/basicSettings/diagnoseClassify',
            name: 'configuration_basicSettings_diagnoseClassify',
            component: () => import('@/views/configuration/basicSettings/diagnoseClassify.vue'),
            meta: {
              title: '诊断分类系数配置'
            }
          },
          {
            path: '/configuration/basicSettings/diseaseConfig',
            name: 'configuration_basicSettings_diseaseConfig',
            component: () => import('@/views/configuration/basicSettings/diseaseConfig.vue'),
            meta: {
              title: '病种配置'
            }
          },
          {
            path: '/configuration/basicSettings/moniitemInspection',
            name: 'configuration_basicSettings_moniitemInspection',
            component: () => import('@/views/configuration/basicSettings/moniitemInspection.vue'),
            meta: {
              title: '检验指标对照'
            }
          },
          {
            path: '/configuration/basicSettings/templateConfig',
            name: 'configuration_basicSettings_templateConfig',
            component: () => import('@/views/configuration/basicSettings/templateConfig.vue'),
            meta: {
              title: '模板配置'
            }
          },
          {
            path: '/configuration/basicSettings/helpConfig',
            name: 'configuration_basicSettings_helpConfig',
            component: () => import('@/views/configuration/basicSettings/helpConfig.vue'),
            meta: {
              title: '操作手册配置'
            }
          },
          {
            path: '/configuration/basicSettings/backgroundLogoMana',
            name: 'configuration_basicSettings_backgroundLogoMana',
            component: () => import('@/views/configuration/basicSettings/backgroundLogoMana.vue'),
            meta: {
              title: '背景LOGO管理'
            }
          },
          {
            path: '/configuration/basicSettings/anasDrugSetting',
            name: 'configuration_basicSettings_anasDrugSetting',
            component: () => import('@/views/configuration/basicSettings/anasDrugSetting.vue'),
            meta: {
              title: '镇痛镇静药品设置'
            }
          },
          {
            path: '/configuration/basicSettings/dialysisDrugSetting',
            name: 'configuration_basicSettings_dialysisDrugSetting',
            component: () => import('@/views/configuration/basicSettings/dialysisDrugSetting.vue'),
            meta: {
              title: '透析配液药品设置'
            }
          },
          {
            path: '/configuration/basicSettings/patientIconSetting',
            name: 'configuration_basicSettings_patientIconSetting',
            component: () => import('@/views/configuration/basicSettings/patientIconSetting.vue'),
            meta: {
              title: '患者标识配置'
            }
          },
          {
            path: '/configuration/basicSettings/outzoneRuleConfig',
            name: 'configuration_basicSettings_outzoneRuleConfig',
            component: () => import('@/views/configuration/basicSettings/outzoneRuleConfig.vue'),
            meta: {
              title: '出区标准配置'
            }
          },
          {
            path: '/configuration/basicSettings/automaticOrder',
            name: 'configuration_basicSettings_automaticOrder',
            component: () => import('@/views/configuration/basicSettings/automaticOrder.vue'),
            meta: {
              title: '自动提取医嘱配置'
            }
          },
          {
            path: '/configuration/basicSettings/consuting',
            name: 'configuration_basicSettings_consuting',
            component: () => import('@/views/configuration/basicSettings/consuting.vue'),
            meta: {
              title: '病情分析配置'
            }
          },
          {
            path: '/configuration/basicSettings/verificationRules',
            name: 'configuration_basicSettings_verificationRules',
            component: () => import('@/views/configuration/basicSettings/verificationRules.vue'),
            meta: {
              title: '数据校验规则配置'
            }
          },
          {
            path: '/configuration/basicSettings/dictionaryConversion',
            name: 'configuration_basicSettings_dictionaryConversion',
            component: () => import('@/views/configuration/basicSettings/dictionaryConversion.vue'),
            meta: {
              title: '字典转换对照'
            }
          },
          {
            path: '/configuration/basicSettings/dataAcquisition',
            name: 'configuration_basicSettings_dataAcquisition',
            component: () => import('@/views/configuration/basicSettings/dataAcquisition.vue'),
            meta: {
              title: '数据采集对照'
            }
          },
          {
            path: '/configuration/basicSettings/qcConfig',
            name: 'configuration_basicSettings_qcConfig',
            component: () => import('@/views/configuration/basicSettings/qcConfig.vue'),
            meta: {
              title: '质控查询界面配置'
            }
          },
          {
            path: '/configuration/basicSettings/aidConfig',
            name: 'configuration_basicSettings_aidConfig',
            component: () => import('@/views/configuration/basicSettings/aidConfig.vue'),
            meta: {
              title: '护理书写助手配置'
            }
          },
          {
            path: '/configuration/basicSettings/patientMonitorConfig',
            name: 'configuration_basicSettings_patientMonitorConfig',
            component: () => import('@/views/configuration/basicSettings/patientMonitorConfig.vue'),
            meta: {
              title: '患者监控配置'
            }
          },
          {
            path: '/configuration/basicSettings/KPISet',
            name: 'configuration_basicSettings_KPISet',
            component: () => import('@/views/configuration/basicSettings/KPISet.vue'),
            meta: {
              title: '绩效加分项配置'
            }
          },
          {
            path: '/configuration/basicSettings/nursePlanConfig',
            name: 'configuration_basicSettings_nursePlanConfig',
            component: () => import('@/views/configuration/basicSettings/nursePlanConfig.vue'),
            meta: {
              title: '护理计划模板配置'
            }
          },
          {
            path: '/configuration/basicSettings/orderMatchBusinessConfig',
            name: 'configuration_basicSettings_orderMatchBusinessConfig',
            component: () => import('@/views/configuration/basicSettings/orderMatchBusinessConfig.vue'),
            meta: {
              title: '医嘱匹配业务配置'
            }
          }
        ]
      },
      {
        path: '/configuration/medicalCalc',
        name: 'configuration_medicalCalc',
        meta: {
          title: '医学计算器配置'
        },
        redirect: { name: 'configuration_medicalCalc_formulaGrouping' },
        children: [
          {
            path: '/configuration/medicalCalc/formulaGrouping',
            name: 'configuration_medicalCalc_formulaGrouping',
            component: () => import('@/views/configuration/medicalCalc/formulaGrouping.vue'),
            meta: {
              title: '公式分组配置'
            }
          },
          {
            path: '/configuration/medicalCalc/customFormula',
            name: 'configuration_medicalCalc_customFormula',
            component: () => import('@/views/configuration/medicalCalc/customFormula.vue'),
            meta: {
              title: '自定义公式配置'
            }
          }
        ]
      },
      {
        path: '/configuration/recordSetting',
        name: 'configuration_recordSetting',
        meta: {
          title: '文书模板配置'
        },
        redirect: { name: 'configuration_recordSetting_recordList' },
        children: [
          {
            path: '/configuration/recordSetting/recordList',
            name: 'configuration_recordSetting_recordList',
            component: () => import('@/views/configuration/recordSetting/recordList.vue'),
            meta: {
              title: '表格组件'
            }
          },
          {
            path: '/configuration/recordSetting/index',
            name: 'configuration_recordSetting_index',
            component: () => import('@/views/configuration/recordSetting/index.vue'),
            meta: {
              title: '文书模板配置'
            },
            hidden: true
          },
          {
            path: '/configuration/recordSetting/recordTempList',
            name: 'configuration_recordSetting_recordTempList',
            component: () => import('@/views/configuration/recordSetting/recordTempList.vue'),
            meta: {
              title: '文书模板列表'
            }
          },
          {
            path: '/configuration/recordSetting/dataSourceList',
            name: 'configuration_recordSetting_dataSourceList',
            component: () => import('@/views/configuration/recordSetting/dataSourceList.vue'),
            meta: {
              title: '文书数据源'
            }
          },
          {
            path: '/configuration/recordSetting/tinymacEditor',
            name: 'configuration_recordSetting_tinymacEditor',
            component: () => import('@/views/configuration/recordSetting/tinymacEditor'),
            meta: {
              title: '特护单配置'
            },
            hidden: true
          },
          {
            path: '/configuration/recordSetting/indexD',
            name: 'configuration_recordSetting_indexD',
            component: () => import('@/views/configuration/recordSetting/indexD.vue'),
            meta: {
              title: '特护单数据配置'
            }
          },
          {
            path: '/configuration/recordSetting/wardTempList',
            name: 'configuration_recordSetting_wardTempList',
            component: () => import('@/views/configuration/recordSetting/wardTempList.vue'),
            meta: {
              title: '病区文书列表配置'
            }
          }
        ]
      },
      {
        path: '/configuration/evaluationForms',
        name: 'configuration_evaluationForms',
        meta: {
          title: '评估单管理'
        },
        redirect: { name: 'configuration_evaluationForms_dataMetaConfig' },
        children: [
          {
            path: '/configuration/evaluationForms/dataMetaConfig',
            name: 'configuration_evaluationForms_dataMetaConfig',
            component: () => import('@/views/configuration/evaluationForms/dataMetaConfig.vue'),
            meta: {
              title: '元数据配置'
            }
          },
          {
            path: '/configuration/evaluationForms/componentdesign',
            name: 'configuration_evaluationForms_componentdesign',
            component: () => import('@/views/configuration/evaluationForms/componentdesign/index.vue'),
            meta: {
              title: '组件块配置'
            }
          },
          {
            path: '/configuration/evaluationForms/componentdesign/add',
            name: 'configuration_evaluationForms_componentdesign_add',
            component: () => import('@/views/configuration/evaluationForms/componentdesign/add.vue'),
            hidden: true,
            meta: {
              title: '组件块配置新增'
            }
          },
          {
            path: '/configuration/evaluationForms/areaEvaluationForm',
            name: 'configuration_evaluationForms_areaEvaluationForm',
            component: () => import('@/views/configuration/evaluationForms/areaEvaluationForm.vue'),
            meta: {
              title: '评估表配置'
            }
          },
          {
            path: '/configuration/evaluationForms/evaluationFormConfig',
            name: 'configuration_evaluationForms_evaluationFormConfig',
            component: () => import('@/views/configuration/evaluationForms/evaluationFormConfig.vue'),
            meta: {
              title: '病区评估表配置'
            }
          },
          {
            path: '/configuration/evaluationForms/NISEvaluationForm',
            name: 'configuration_evaluationForms_NISEvaluationForm',
            component: () => import('@/views/configuration/evaluationForms/NISEvaluationForm.vue'),
            meta: {
              title: 'NIS评估表对照'
            }
          }
        ]
      },
      {
        path: '/configuration/intelligence',
        name: 'configuration_intelligence',
        meta: {
          title: '数据源配置'
        },
        children: [
          {
            path: '/configuration/evaluationForms/dataSourceConfig',
            name: 'configuration_evaluationForms_dataSourceConfig',
            component: () => import('@/views/configuration/evaluationForms/dataSourceConfig.vue'),
            meta: {
              title: '数据源配置'
            }
          }
        ]
      },
      {
        path: '/configuration/operationManage',
        name: 'configuration_operationManage',
        meta: {
          title: '运维管理'
        },
        redirect: { name: 'configuration_operationManage_interfaceLog' },
        children: [
          {
            path: '/configuration/operationManage/interfaceLog',
            name: 'configuration_operationManage_interfaceLog',
            component: () => import('@/views/configuration/operationManage/interfaceLog.vue'),
            meta: {
              title: '接口日志查询'
            }
          },
          {
            path: '/configuration/operationManage/sysErrorLog',
            name: 'configuration_operationManage_sysErrorLog',
            component: () => import('@/views/configuration/operationManage/sysErrorLog.vue'),
            meta: {
              title: '系统异常日志查询'
            }
          },
          {
            path: '/configuration/operationManage/orderQuery',
            name: 'configuration_operationManage_orderQuery',
            component: () => import('@/views/configuration/operationManage/orderQuery.vue'),
            meta: {
              title: '医嘱查询'
            }
          },
          {
            path: '/configuration/operationManage/deviceMonitor',
            name: 'configuration_operationManage_deviceMonitor',
            component: () => import('@/views/configuration/operationManage/deviceMonitor.vue'),
            meta: {
              title: '设备采集监测'
            }
          }
        ]
      },
      {
        path: '/configuration/productAuthorization',
        name: 'configuration_productAuthorization',
        meta: {
          title: '授权管理'
        },
        redirect: { name: 'configuration_productAuthorization' },
        children: [
          {
            path: '/configuration/productAuthorization',
            name: 'configuration_productAuthorization',
            component: () => import('@/views/configuration/productAuthorization/index.vue'),
            meta: {
              title: '授权管理'
            }
          }
        ]
      },
      {
        path: '/configuration/knowledgeSystem',
        name: 'configuration_knowledgeSystem',
        meta: {
          title: '知识体系'
        },
        redirect: { name: 'configuration_basicSettings_warningConfig' },
        children: [
          {
            path: '/configuration/basicSettings/warningConfig',
            name: 'configuration_basicSettings_warningConfig',
            component: () => import('@/views/configuration/basicSettings/warningConfig.vue'),
            meta: {
              title: '预警管理'
            }
          },
          {
            path: '/configuration/basicSettings/pipeInfectRisk',
            name: 'configuration_basicSettings_pipeInfectRisk',
            component: () => import('@/views/configuration/basicSettings/pipeInfectRisk.vue'),
            meta: {
              title: '导管感染风险配置'
            }
          },
          {
            path: '/configuration/knowledgeBase/medicine',
            name: 'configuration_knowledgeBase_medicine',
            component: () => import('@/views/configuration/knowledgeBase/medicine'),
            meta: {
              title: '医学知识库配置'
            }
          }
        ]
      },
      {
        path: '/configuration/nutrition',
        name: 'configuration_nutrition',
        meta: {
          title: '营养管理配置'
        },
        redirect: { name: 'configuration_nutrition_stressList' },
        children: [
          {
            path: '/configuration/nutrition/stressList',
            name: 'configuration_nutrition_stressList',
            component: () => import('@/views/configuration/nutrition/stressList.vue'),
            meta: {
              title: '应激因素配置'
            }
          },
          {
            path: '/configuration/nutrition/conversionList',
            name: 'configuration_nutrition_conversionList',
            component: () => import('@/views/configuration/nutrition/conversionList.vue'),
            meta: {
              title: '营养换算配置'
            }
          }
        ]
      }
    ]
  }
]

export default configuration

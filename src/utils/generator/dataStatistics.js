import {
  qcReport_patAdmis,
  qcReport_correspondingPeriod,
  qcReport_patAdmisDaily,
  qcReport_correspondingPeriodDaily,
  qcReport_apacheIIScores,
  qcReport_icuPeriodPatients,
  qcReport_unplanIntuba,
  qcReport_vap,
  qcReport_dvt,
  qcReport_unplanTransfer,
  qcReport_expectedFatality,
  qcReport_unplanIntubaExt48h,
  qcReport_crbsi,
  qcReport_bundle,
  qcReport_reentry48h,
  qcReport_fataIndex,
  qcReport_pdbat,
  qcReport_cauti,
  qcReport_airwayProlapse,
  qcReport_prolapseGroup,
  qcReport_prolapseIntubateGroup,
  //   分子分母
  qcReport_patAdmisData,
  qcReport_patAdmisDailyData,
  qcReport_apacheIIScoresData,
  qcReport_unplanIntubaData,
  qcReport_vapData,
  qcReport_dvtData,
  qcReport_unplanTransferData,
  qcReport_expectedFatalityData,
  qcReport_unplanIntubaExt48hData,
  qcReport_crbsiData,
  qcReport_bundleData,
  qcReport_reentry48hData,
  qcReport_fataIndexData,
  qcReport_pdbatData,
  qcReport_cautiData,
  qcReport_airwayProlapseData,
  qcReport_prolapseGroupData,
  qcReport_prolapseIntubateGroupData,

  qcReport_stressInjury_listPage,
  qcReport_stressInjury_data,
  qcReport_nursingQuality_listPage,
  qcReport_nursingQuality_data,
  qcReport_physicalRestraint_listPage,
  qcReport_physicalRestraint_data,
  qcReport_physicalRestraintRate_data,
  qcReport_unplanDownBloodPurification_listPage,
  qcReport_unplanDownBloodPurification_data,
  qcReport_reentry24hData,
  qcReport_reentry24h,
  qcReport_catherUseRate_listPage,
  qcReport_catherUseRate_data,
  qcReport_rescure_listPage,
  qcReport_rescure_data,
  qcReport_catherTypeEndcather_listPage,
  qcReport_catherTypeEndcather_data,
  qcReport_unplanIntuba_listPage,
  qcReport_unplanIntuba_data
} from '@/api/qcReport'

export const dataStatistics_leftData = [
  {
    label: 'ICU患者收治率', // 左侧列表显示文字
    value: '0', // 值
    definition: 'ICU收治患者总数占同期医院收治患者总数的比例',
    expression: 'ICU患者收治率=ICU收治患者总数/同期医院收治患者*100%', // 计算公式
    dataApi: qcReport_patAdmisData,
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl: 'qcReport/patAdmis',
    proApi: qcReport_patAdmis,
    exportUrl2: 'qcReport/correspondingPeriod',
    proApi2: qcReport_correspondingPeriod,
    valueKey: 'patAdmisRate',
    doubleTable: {
      label_one: 'ICU收治患者',
      label_two: '同期医院收治患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院科室', code: 'inpatientDeptName' },
        { label: '入院时间', code: 'inpatientDate' },
        { label: '出院时间', code: 'outpatientDate' }
      ]
    },
    calculation: [
      // 公式模块显示计算数值相关数据
      {
        label: 'ICU收治患者总数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期医院收治患者总数',
        code: 'denominator'
      }
    ]
  },
  {
    label: 'ICU患者收治床日率',
    value: '0',
    definition: 'ICU收治患者的时间段内的床日数合计占同期医院收治患者的时间段内的床日数合计的比例',
    expression: 'ICU患者收治床日率=ICU收治患者总床日数/同期医院收治患者总床日数*100%', // 计算公式
    dataApi: qcReport_patAdmisDailyData,
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl: 'qcReport/patAdmisDaily',
    proApi: qcReport_patAdmisDaily,
    exportUrl2: 'qcReport/correspondingPeriodDaily',
    proApi2: qcReport_correspondingPeriodDaily,
    valueKey: 'patAdmisDailyRate',
    calculation: [
      {
        label: 'ICU收治患者总床日数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期医院收治患者总床日数',
        code: 'denominator'
      }
    ],
    doubleTable: {
      label_one: 'ICU收治患者总床日数',
      label_two: '同期医院收治患者总床日数',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' },
        { label: '床日数', code: 'dailyDays' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院科室', code: 'inpatientDeptName' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' },
        { label: '床日数', code: 'dailyDays' }
      ]
    }
  },
  {
    label: 'ApacheⅡ评分患者收治率',
    value: '0%',
    definition: 'APCHEII评分>=15分患者总数占同期医院收治患者总数的比例',
    expression: 'APCHEII评分>=15分患者收治率(入ICU24小时内)=APCHEII评分>=15分患者总数/同期医院收治患者*100%', // 计算公式
    dataApi: qcReport_apacheIIScoresData,
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl: 'qcReport/apacheIIScores',
    proApi: qcReport_apacheIIScores,
    exportUrl2: 'qcReport/icuPeriodPatients',
    proApi2: qcReport_icuPeriodPatients,
    valueKey: 'apacheIIScoresRate',
    calculation: [
      {
        label: 'APCHEII评分>=15分患者总数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU收治患者总数',
        code: 'denominator'
      }
    ],
    doubleTable: {
      label_one: 'APCHEII评分>=15分患者',
      label_two: '同期ICU收治患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' },
        { label: '首次APCHEII评分结果', code: 'apacheIIScore' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' },
        { label: '首次APCHEII评分结果', code: 'apacheIIScore' }
      ]
    }
  },
  {
    label: 'ICU非计划气管插管拔管率',
    value: '',
    definition: '非计划气管插管拔管例数占同期ICU患者气管插管拔管总数的比例',
    expression: 'ICU非计划气管插管拔管率=非计划气管插管拔管例数/ICU患者气管插管拔管总数*100%', // 计算公式
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl: 'qcReport/unplanIntuba',
    dataApi: qcReport_unplanIntubaData,
    proApi: qcReport_unplanIntuba,
    exportUrl2: 'qcReport/unplanIntuba',
    proApi2: qcReport_unplanIntuba,
    valueKey: 'unplanIntubaRate',
    doubleTable: {
      label_one: '非计划气管插管拔管患者',
      label_two: '同期ICU气管插管拔管患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '导管名称', code: 'catheterName' },
        { label: '插管时间', code: 'startTime', width: '140' },
        { label: '拔管时间(非计划)', code: 'catheterEndTime', width: '140' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '导管名称', code: 'catheterName' },
        { label: '插管时间', code: 'startTime', width: '140' },
        { label: '拔管时间', code: 'catheterEndTime', width: '140' }
      ]
    },
    calculation: [
      {
        label: '非计划气管插管拔管例数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: 'ICU患者气管插管拔管总数',
        code: 'denominator'
      }
    ]
  },
  {
    label: 'ICU呼吸机相关性肺炎（VAP）发病率',
    value: '',
    definition: 'VAP发生例数占同期ICU患者有创机械通气总天数的比例',
    expression: 'ICU呼吸机相关性肺炎（VAP）发病率（例/千机械通气日）=VAP发生例数/同期ICU患者有创机械通气总天数*100%', // 计算公式
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl: 'qcReport/vap',
    dataApi: qcReport_vapData,
    proApi: qcReport_vap,
    valueKey: 'vapRate',
    exportUrl2: 'qcReport/vap',
    proApi2: qcReport_vap,
    doubleTable: {
      label_one: '发生VAP患者',
      label_two: '同期有创机械通气患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '导管名称', code: 'catheterName' },
        { label: '插管时间', code: 'startTime', width: '140' },
        { label: '感染时间', code: 'infectTime', width: '140' },
        { label: '感染原因', code: 'infectReason' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '导管名称', code: 'catheterName' },
        { label: '插管时间', code: 'startTime', width: '140' },
        { label: '置管天数', code: 'intubeDays' }
      ]
    },
    calculation: [
      {
        label: 'VAP发生例数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU患者有创机械通气总天数',
        code: 'denominator'
      }
    ]
  },
  {
    label: 'ICU深静脉血栓（DVT）预防率',
    value: '',
    definition: '进行深静脉血栓（DVT）预防的ICU患者数占同期ICU收治患者总数的比例',
    expression: 'ICU深静脉血栓（DVT）预防率=进行深静脉血栓（DVT）预防的ICU患者数/同期ICU收治患者总数*100%', // 计算公式
    exportUrl: 'qcReport/dvt',
    dataApi: qcReport_dvtData,
    proApi: qcReport_dvt,
    valueKey: 'dvtRate',
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl2: 'qcReport/icuPeriodPatients',
    proApi2: qcReport_icuPeriodPatients,
    calculation: [
      {
        label: '进行深静脉血栓（DVT）预防的ICU患者数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU收治患者总数',
        code: 'denominator'
      }
    ],
    moreTabs: true, // 右侧更多的tabs
    tabList: {
      'H004': '腔静脉滤器患者',
      'H006': '诊断为DVT患者',
      'H007': '诊断为PE患者',
      'H008': '诊断为肺栓塞患者'
    },
    tabShowItems: 'label_one_showItems',
    doubleTable: {
      label_one: '进行深静脉血栓（DVT）预防患者',
      label_two: '同期ICU收治患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '预防护理项', code: 'moniitemNames' },
        { label: '预防药物', code: 'itemNames' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ]
    }
  },
  {
    label: 'ICU深静脉血栓-药物（DVT）预防率',
    value: '',
    definition: '进行深静脉血栓-药物（DVT）预防的ICU患者数占同期ICU收治患者总数的比例',
    expression: 'ICU深静脉血栓-药物（DVT）预防率=进行深静脉血栓-药物（DVT）预防的ICU患者数/同期ICU收治患者总数*100%', // 计算公式
    exportUrl: 'qcReport/dvt',
    dataApi: qcReport_dvtData,
    proApi: qcReport_dvt,
    valueKey: 'dvtDrugRate',
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl2: 'qcReport/icuPeriodPatients',
    proApi2: qcReport_icuPeriodPatients,
    calculation: [
      {
        label: '进行深静脉血栓-药物（DVT）预防的ICU患者数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU收治患者总数',
        code: 'denominator'
      }
    ],
    doubleTable: {
      label_one: '进行深静脉血栓-药物（DVT）预防患者',
      label_two: '同期ICU收治患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '预防药物', code: 'itemNames' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ]
    }
  },
  {
    label: 'ICU深静脉血栓-物理（DVT）预防率',
    value: '',
    definition: '进行深静脉血栓-物理（DVT）预防的ICU患者数占同期ICU收治患者总数的比例',
    expression: 'ICU深静脉血栓-物理（DVT）预防率=进行深静脉血栓-物理（DVT）预防的ICU患者数/同期ICU收治患者总数*100%', // 计算公式
    exportUrl: 'qcReport/dvt',
    dataApi: qcReport_dvtData,
    proApi: qcReport_dvt,
    valueKey: 'dvtPhysicalRate',
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl2: 'qcReport/icuPeriodPatients',
    proApi2: qcReport_icuPeriodPatients,
    calculation: [
      {
        label: '进行深静脉血栓-物理（DVT）预防的ICU患者数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU收治患者总数',
        code: 'denominator'
      }
    ],
    doubleTable: {
      label_one: '进行深静脉血栓-药物（DVT）预防患者',
      label_two: '同期ICU收治患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '预防护理项', code: 'moniitemNames' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ]
    }
  },
  {
    label: '非计划转入ICU率',
    value: '',
    definition: '非计划转入ICU患者数占同期ICU收治患者总数的比例',
    expression: '非计划转入ICU率=非计划转入ICU患者数/同期ICU收治患者总数*100%', // 计算公式
    exportUrl: 'qcReport/unplanTransfer',
    dataApi: qcReport_unplanTransferData,
    proApi: qcReport_unplanTransfer,
    valueKey: 'unplanTransferRate',
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl2: 'qcReport/icuPeriodPatients',
    proApi2: qcReport_icuPeriodPatients,
    calculation: [
      {
        label: '非计划转入ICU患者数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU收治患者总数',
        code: 'denominator'
      }
    ],
    doubleTable: {
      label_one: '非计划转入ICU患者',
      label_two: '同期ICU收治患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ]
    }
  },
  {
    label: 'ICU患者预计病死率',
    value: '',
    definition: 'ICU收治患者预计病死率的总和占ICU收治患者总数的比例',
    expression: 'ICU患者预计病死率=ICU收治患者预计病死率的总和/ICU收治患者总数*100%', // 计算公式
    exportUrl: 'qcReport/expectedFatality',
    dataApi: qcReport_expectedFatalityData,
    proApi: qcReport_expectedFatality,
    valueKey: 'expectedFatalityRate',
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl2: 'qcReport/icuPeriodPatients',
    proApi2: qcReport_icuPeriodPatients,
    calculation: [
      {
        label: 'ICU收治患者预计病死率的总和',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU收治患者总数',
        code: 'denominator'
      }
    ],
    doubleTable: {
      label_one: 'ICU收治患者预计病死率',
      label_two: '同期ICU收治患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '病种得分(分值)', code: 'score' },
        { label: 'ApacheII评分', code: 'apacheIIScore' },
        { label: '是否手术', code: 'surgicalPatients' },
        { label: '预计病死率', code: 'fatalityRate' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ]
    }
  },
  {
    label: 'ICU气管插管拔管后48小时再插管率',
    value: '',
    definition: '气管插管计划拔管后48h内再插管例数占同期ICU患者气管插管拔管总数的比例',
    expression: 'ICU气管插管拔管后48小时再插管率=气管插管计划拔管后48h内再插管例数/同期ICU患者气管插管拔管总数*100%', // 计算公式
    exportUrl: 'qcReport/unplanIntubaExt48h',
    dataApi: qcReport_unplanIntubaExt48hData,
    proApi: qcReport_unplanIntubaExt48h,
    valueKey: 'unplanIntubaExt48hRate',
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl2: 'qcReport/unplanIntubaExt48h',
    proApi2: qcReport_unplanIntubaExt48h,
    calculation: [
      {
        label: '气管插管计划拔管后48h内再插管例数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU患者气管插管拔管总数',
        code: 'denominator'
      }
    ],
    doubleTable: {
      label_one: '气管插管计划拔管后48h内再插管患者',
      label_two: '同期ICU患者气管插管拔管患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '导管名称', code: 'catheterName' },
        { label: '插管时间', code: 'startTime', width: '140' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '导管名称', code: 'catheterName' },
        { label: '插管时间', code: 'startTime', width: '140' },
        { label: '拔管时间', code: 'catheterEndTime', width: '140' }
      ]
    }
  },
  {
    label: 'ICU血管内导管相关血流感染（CRBSI）发病率',
    value: '',
    definition: 'CRBSI发生例数占同期ICU患者血管内导管留置总天数的比例',
    expression: 'ICU血管内导管相关血流感染（CRBSI）发病率(例/千导管日)=CRBSI发生例数/同期ICU患者血管内导管留置总天数*100%', // 计算公式
    exportUrl: 'qcReport/crbsi',
    dataApi: qcReport_crbsiData,
    proApi: qcReport_crbsi,
    valueKey: 'crbsiRate',
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl2: 'qcReport/crbsi',
    proApi2: qcReport_crbsi,
    calculation: [
      {
        label: 'CRBSI发生例数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU患者血管内导管留置总天数',
        code: 'denominator'
      }
    ],
    doubleTable: {
      label_one: '发生CRBSI患者',
      label_two: '同期ICU血管内导管留置患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '导管名称', code: 'catheterName' },
        { label: '插管时间', code: 'startTime', width: '140' },
        { label: '感染时间', code: 'infectTime', width: '140' },
        { label: '感染原因', code: 'infectReason' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '导管名称', code: 'catheterName' },
        { label: '插管时间', code: 'startTime', width: '140' },
        { label: '置管天数', code: 'intubeDays' }
      ]
    }
  },
  {
    label: '感染性休克1h集束化治疗（bundle）完成率',
    value: '',
    definition: '入ICU诊断为感染性休克并全部完成1h bundle的患者数占同期入ICU诊断为感染性休克患者总数的比例',
    expression: '感染性休克1h集束化治疗（bundle）完成率=入ICU诊断为感染性休克并全部完成1h bundle的患者数/同期入ICU诊断为感染性休克患者总数*100%', // 计算公式
    exportUrl: 'qcReport/bundle',
    dataApi: qcReport_bundleData,
    proApi: qcReport_bundle,
    valueKey: 'bundle1hRate',
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl2: 'qcReport/bundle',
    proApi2: qcReport_bundle,
    calculation: [
      {
        label: '入ICU诊断为感染性休克并全部完成1h bundle的患者数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期入ICU诊断为感染性休克患者总数',
        code: 'denominator'
      }
    ],
    doubleTable: {
      label_one: '完成B1H患者',
      label_two: '同期诊断为感染性休克患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ]
    }
  },
  {
    label: '感染性休克3h集束化治疗（bundle）完成率',
    value: '',
    definition: '入ICU诊断为感染性休克并全部完成3h bundle的患者数占同期入ICU诊断为感染性休克患者总数的比例',
    expression: '感染性休克3h集束化治疗（bundle）完成率=入ICU诊断为感染性休克并全部完成3h bundle的患者数/同期入ICU诊断为感染性休克患者总数*100%', // 计算公式
    exportUrl: 'qcReport/bundle',
    dataApi: qcReport_bundleData,
    proApi: qcReport_bundle,
    valueKey: 'bundle3hRate',
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl2: 'qcReport/bundle',
    proApi2: qcReport_bundle,
    calculation: [
      {
        label: '入ICU诊断为感染性休克并全部完成3h bundle的患者数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期入ICU诊断为感染性休克患者总数',
        code: 'denominator'
      }
    ],
    doubleTable: {
      label_one: '完成B3H患者',
      label_two: '同期诊断为感染性休克患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ]
    }
  },
  {
    label: '感染性休克6h集束化治疗（bundle）完成率',
    value: '',
    definition: '入ICU诊断为感染性休克并全部完成6h bundle的患者数占同期入ICU诊断为感染性休克患者总数的比例',
    expression: '感染性休克6h集束化治疗（bundle）完成率=入ICU诊断为感染性休克并全部完成6h bundle的患者数/同期入ICU诊断为感染性休克患者总数*100%', // 计算公式
    exportUrl: 'qcReport/bundle',
    dataApi: qcReport_bundleData,
    proApi: qcReport_bundle,
    valueKey: 'bundle6hRate',
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl2: 'qcReport/bundle',
    proApi2: qcReport_bundle,
    calculation: [
      {
        label: '入ICU诊断为感染性休克并全部完成6h bundle的患者数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期入ICU诊断为感染性休克患者总数',
        code: 'denominator'
      }
    ],
    doubleTable: {
      label_one: '完成B6H患者',
      label_two: '同期诊断为感染性休克患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ]
    }
  },
  {
    label: '转出ICU后48小时内重返率',
    value: '',
    definition: '转出ICU后48h内重返ICU的患者数占同期转出ICU患者总数的比例',
    expression: '转出ICU后48小时内重返率=转出ICU后48h内重返ICU的患者数/同期转出ICU患者总数*100%', // 计算公式
    exportUrl: 'qcReport/reentry48h',
    dataApi: qcReport_reentry48hData,
    proApi: qcReport_reentry48h,
    valueKey: 'reentry48hRate',
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl2: 'qcReport/reentry48h',
    proApi2: qcReport_reentry48h,
    calculation: [
      {
        label: '转出ICU后48h内重返ICU的患者数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期转出ICU患者总数',
        code: 'denominator'
      }
    ],
    doubleTable: {
      label_one: '48小时内重返ICU患者',
      label_two: '同期转出ICU患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ]
    }
  },
  {
    label: '转出ICU后24小时内重返率',
    value: '',
    definition: '转出ICU后24h内重返ICU的患者数占同期转出ICU患者总数的比例',
    expression: '转出ICU后24小时内重返率=转出ICU后24h内重返ICU的患者数/同期转出ICU患者总数*100%', // 计算公式
    exportUrl: 'qcReport/reentry24h',
    dataApi: qcReport_reentry24hData,
    proApi: qcReport_reentry24h,
    valueKey: 'reentry24hRate',
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl2: 'qcReport/reentry24h',
    proApi2: qcReport_reentry24h,
    calculation: [
      {
        label: '转出ICU后24h内重返ICU的患者数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期转出ICU患者总数',
        code: 'denominator'
      }
    ],
    doubleTable: {
      label_one: '24小时内重返ICU患者',
      label_two: '同期转出ICU患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ]
    }
  },
  {
    label: '转出ICU后24小时内重返率',
    value: '',
    definition: '转出ICU后24h内重返ICU的患者数占同期转出ICU患者总数的比例',
    expression: '转出ICU后24小时内重返率=转出ICU后24h内重返ICU的患者数/同期转出ICU患者总数*100%', // 计算公式
    exportUrl: 'qcReport/reentry48h',
    dataApi: qcReport_reentry48hData,
    proApi: qcReport_reentry48h,
    valueKey: 'reentry48hRate',
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl2: 'qcReport/reentry48h',
    proApi2: qcReport_reentry48h,
    calculation: [
      {
        label: '转出ICU后24h内重返ICU的患者数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期转出ICU患者总数',
        code: 'denominator'
      }
    ],
    doubleTable: {
      label_one: '24小时内重返ICU患者',
      label_two: '同期转出ICU患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ]
    }
  },
  {
    label: 'ICU患者标化病死指数',
    value: '',
    definition: 'ICU实际病死率占ICU患者预计病死率的比例',
    expression: 'ICU患者标化病死指数=ICU实际病死率/ICU患者预计病死率*100%', // 计算公式
    exportUrl: 'qcReport/fataIndex',
    dataApi: qcReport_fataIndexData,
    proApi: qcReport_fataIndex,
    valueKey: 'fataIndexRate',
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl2: 'qcReport/icuPeriodPatients',
    proApi2: qcReport_icuPeriodPatients,
    calculation: [
      {
        label: 'ICU收治患者实际病死率',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: 'ICU患者预计病死率',
        code: 'denominator'
      }
    ],
    doubleTable: {
      label_one: 'ICU实际病死患者',
      label_two: '同期ICU收治患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '死亡时间', code: 'icuDeathTime', width: '140' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ]
    }
  },
  {
    label: 'ICU抗菌药物治疗前病原学送检率',
    value: '',
    definition: '使用抗菌药物前病原学检验标本送检病例数占同期使用抗菌药物治疗病例数的比例',
    expression: 'ICU抗菌药物治疗前病原学送检率=使用抗菌药物前病原学检验标本送检病例数/同期使用抗菌药物治疗病例数*100%', // 计算公式
    exportUrl: 'qcReport/pdbat',
    dataApi: qcReport_pdbatData,
    proApi: qcReport_pdbat,
    valueKey: 'pdbatRate',
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl2: 'qcReport/pdbat',
    proApi2: qcReport_pdbat,
    calculation: [
      {
        label: '使用抗菌药物前病原学检验标本送检病例数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期使用抗菌药物治疗病例数',
        code: 'denominator'
      }
    ],
    moreTabs: true, // 右侧更多的tabs
    tabList: {
      'E003': '血常规等一般感染指标送检患者',
      'E004': 'PCT指标送检患者',
      'E005': '细胞因子如IL-6送检患者',
      'E006': 'G实验或GM实验送检患者'
    },
    tabShowItems: 'label_one_showItems',
    doubleTable: {
      label_one: '病原学送检患者',
      label_two: '同期使用抗菌药物治疗患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate', width: '140' },
        { label: '抗菌药物', code: 'drugNames' }
      ]
    }
  },
  {
    label: 'ICU导尿管相关泌尿系感染（CAUTI）发病率',
    value: '',
    definition: 'CAUTI发生例数占同期ICU患者导尿管留置总天数的比例',
    expression: 'ICU导尿管相关泌尿系感染（CAUTI）发病率（例/千导尿管日）=CAUTI发生例数/同期ICU患者导尿管留置总天数*100%', // 计算公式
    exportUrl: 'qcReport/cauti',
    dataApi: qcReport_cautiData,
    proApi: qcReport_cauti,
    valueKey: 'cautiRate',
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl2: 'qcReport/cauti',
    proApi2: qcReport_cauti,
    calculation: [
      {
        label: 'CAUTI发生例数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU患者导尿管留置总天数',
        code: 'denominator'
      }
    ],
    doubleTable: {
      label_one: '发生CAUTI患者',
      label_two: '同期ICU导尿管留置患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '导管名称', code: 'catheterName' },
        { label: '插管时间', code: 'startTime', width: '140' },
        { label: '感染时间', code: 'infectTime', width: '140' },
        { label: '感染原因', code: 'infectReason' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '导管名称', code: 'catheterName' },
        { label: '插管时间', code: 'startTime', width: '140' },
        { label: '置管天数', code: 'intubeDays' }
      ]
    }
  },
  {
    label: '人工气道脱出例数',
    value: '',
    newHtml: true, // 新样式模块开启
    doubleTable: {
      label_one: '人工气道脱出例数'
    },
    definition: '人工气道脱出例数', // 定义
    expression: '统计患者的人工气道类导管发生滑脱的总例数', // 公式
    countText: '统计总例数，不去重', // 计算
    exportUrl: 'qcReport/airwayProlapse',
    dataApi: qcReport_airwayProlapseData,
    proApi: qcReport_airwayProlapse,
    valueKey: 'airwayProlapseCount',
    showItems: [
      { label: '序号', code: 'rowNum', width: '50' },
      { label: '住院号', code: 'mrn' },
      { label: '姓名', code: 'patientName' },
      { label: '性别', code: 'sex', width: '50' },
      { label: '年龄', code: 'age' },
      { label: '诊断', code: 'diagNames' },
      { label: '入区时间', code: 'icuAreaTime', width: '140' },
      { label: '出区时间', code: 'icuLeaveTime', width: '140' },
      { label: '滑脱管路名称', code: 'catheterName' },
      { label: '滑脱管路插管时间', code: 'startTime', width: '140' },
      { label: '滑脱时间', code: 'recordTime', width: '140' }
    ]
  },
  {
    label: '各类管路滑出例数',
    doubleTable: {
      label_one: '各类管路滑出例数'
    },
    value: '',
    newHtml: true, // 新样式模块开启
    definition: '各类导管管路滑脱例数', // 定义
    expression: '统计患者各类导管发生滑脱的总例数', // 公式
    countText: '统计总例数，不去重', // 计算
    exportUrl: 'qcReport/prolapseGroup',
    dataApi: qcReport_prolapseGroupData,
    proApi: qcReport_prolapseGroup,
    valueKey: 'prolapseGroupCount',
    showItems: [
      { label: '序号', code: 'rowNum', width: '50' },
      { label: '住院号', code: 'mrn' },
      { label: '姓名', code: 'patientName' },
      { label: '性别', code: 'sex', width: '50' },
      { label: '年龄', code: 'age' },
      { label: '诊断', code: 'diagNames' },
      { label: '入区时间', code: 'icuAreaTime', width: '140' },
      { label: '出区时间', code: 'icuLeaveTime', width: '140' },
      { label: '滑脱管路名称', code: 'catheterName' },
      { label: '滑脱管路插管时间', code: 'startTime', width: '140' },
      { label: '滑脱时间', code: 'recordTime', width: '140' }
    ]
  },

  {
    label: '各类导管管路滑脱后再插数',
    doubleTable: {
      label_one: '各类导管管路滑脱后再插患者'
    },
    value: '',
    newHtml: true, // 新样式模块开启
    definition: '各类导管管路滑脱后再插总例数', // 定义
    expression: '各类导管管路滑脱后再插总例数', // 公式
    exportUrl: 'qcReport/prolapseIntubateGroup', // 导出
    dataApi: qcReport_prolapseIntubateGroupData,
    proApi: qcReport_prolapseIntubateGroup,
    valueKey: 'prolapseIntubateGroupCount',
    showItems: [
      { label: '序号', code: 'rowNum', width: '50' },
      { label: '住院号', code: 'mrn' },
      { label: '姓名', code: 'patientName' },
      { label: '性别', code: 'sex', width: '50' },
      { label: '年龄', code: 'age' },
      { label: '诊断', code: 'diagNames' },
      { label: '入区时间', code: 'icuAreaTime' },
      { label: '出区时间', code: 'icuLeaveTime' },
      { label: '滑脱管路名称', code: 'catheterName' },
      { label: '滑脱管路插管时间', code: 'startTime' },
      { label: '滑脱时间', code: 'prolapseTime' },
      { label: '再插时间', code: 'recordTime' }
    ]
  },
  {
    label: 'ICU患者身体约束日数',
    doubleTable: {
      label_one: 'ICU患者身体约束日数'
    },
    value: '',
    newHtml: true, // 新样式模块开启
    definition: 'ICU患者身体约束日数', // 定义
    expression: '统计周期内ICU患者进行身体约束的总日数', // 公式
    countText: '取【监护数据】身体约束的记录时间在查询时间范围内的总日数，如果一天内有多次身体约束的执行仍算1天', // 计算
    exportUrl: 'qcReport/physicalRestraint',
    dataApi: qcReport_physicalRestraint_data,
    proApi: qcReport_physicalRestraint_listPage,
    valueKey: 'physicalRestraintCount',
    showItems: [
      { label: '序号', code: 'rowNum', width: '50' },
      { label: '住院号', code: 'mrn' },
      { label: '姓名', code: 'patientName' },
      { label: '性别', code: 'sex', width: '50' },
      { label: '年龄', code: 'age' },
      { label: '诊断', code: 'diagNames' },
      { label: '入区时间', code: 'icuAreaTime' },
      { label: '出区时间', code: 'icuLeaveTime' },
      { label: '身体约束时间', code: 'recordTimes' }
    ]
  },
  {
    label: 'ICU患者身体约束率', // 左侧列表显示文字
    value: '0', // 值
    definition: '统计周期内ICU患者进行身体约束的总日数占同期ICU收治患者在区日数的比例',
    expression: 'ICU患者的身体约束率=ICU患者身体约束日数/同期ICU收治患者在区日数*100%', // 计算公式
    dataApi: qcReport_physicalRestraintRate_data,
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl: 'qcReport/physicalRestraint',
    proApi: qcReport_physicalRestraint_listPage,
    exportUrl2: 'qcReport/physicalRestraint',
    proApi2: qcReport_physicalRestraint_listPage,
    valueKey: 'physicalRestraintRate',
    multipleTable: [
      {
        label: 'ICU患者身体约束日数',
        queryType: '0',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入区时间', code: 'icuAreaTime' },
          { label: '出区时间', code: 'icuLeaveTime' },
          { label: '身体约束时间', code: 'recordTimes' }
        ]
      },
      {
        label: '同期ICU收治患者在区日数',
        queryType: '1',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入区时间', code: 'icuAreaTime' },
          { label: '出区时间', code: 'icuLeaveTime' },
          { label: '在区日数', code: 'inAreadays' }
        ]
      }
    ],
    calculation: [
      // 公式模块显示计算数值相关数据
      {
        label: 'ICU患者身体约束日数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU收治患者在区日数',
        code: 'denominator'
      }
    ]
  },
  {
    label: 'ICU患者院内压力性损伤发生率', // 左侧列表显示文字
    value: '0', // 值
    definition: '统计周期内ICU患者压力性损伤新发病患者数占同期ICU收治患者总数的比例',
    expression: 'ICU患者院内压力性损伤发生率=入区24小时后新发压力性损伤患者数/同期ICU收治患者总数*100%', // 计算公式
    dataApi: qcReport_stressInjury_data,
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl: 'qcReport/stressInjury',
    proApi: qcReport_stressInjury_listPage,
    exportUrl2: 'qcReport/icuPeriodPatients',
    proApi2: qcReport_icuPeriodPatients,
    valueKey: 'stressInjuryRate',
    doubleTable: {
      label_one: '入区24h后新发压力性损伤患者',
      label_two: '同期ICU收治患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate', width: '140' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '压疮发现时间', code: 'recordTimes', width: '140' },
        { label: '压疮部位', code: 'skines', width: '140' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入院时间', code: 'inpatientDate' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '出院时间', code: 'outpatientDate' }
      ]
    },
    calculation: [
      // 公式模块显示计算数值相关数据
      {
        label: '入区24小时后新发压力性损伤患者数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU收治患者总数',
        code: 'denominator'
      }
    ]
  },
  {
    label: '危重患者护理质量完全达标率', // 左侧列表显示文字
    value: '0', // 值
    definition: '统计周期内危重患者护理质量督查条目完全达标总人次数占同期ICU危重患者护理质量督查条目总人次数的比例',
    expression: '危重患者护理质量完全达标率=危重患者护理质量督查条目完全达标总人次数/同期ICU危重患者护理质量督查条目总人次数*100%', // 计算公式
    dataApi: qcReport_nursingQuality_data,
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl: 'qcReport/nursingQuality',
    proApi: qcReport_nursingQuality_listPage,
    exportUrl2: 'qcReport/nursingQuality',
    proApi2: qcReport_nursingQuality_listPage,
    valueKey: 'nursingQualityRate',
    multipleTable: [
      {
        label: '护理质量督查条目完全达标患者',
        queryType: '0',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入院时间', code: 'inpatientDate', width: '140' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '督查评估时间', code: 'recordTime', width: '140' },
          { label: '完全达标条目数', code: 'coincidences', width: '140' }
        ]
      },
      {
        label: '护理质量督查条目部分达标患者',
        queryType: '2',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入院时间', code: 'inpatientDate', width: '140' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '督查评估时间', code: 'recordTime', width: '140' },
          { label: '部分达标条目数', code: 'coincidences', width: '140' }
        ]
      },
      {
        label: '护理质量督查条目不达标患者',
        queryType: '3',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入院时间', code: 'inpatientDate', width: '140' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '督查评估时间', code: 'recordTime', width: '140' },
          { label: '不达标条目数', code: 'coincidences', width: '140' }
        ]
      },
      {
        label: '护理质量督查条目不适用患者',
        queryType: '4',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入院时间', code: 'inpatientDate', width: '140' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '督查评估时间', code: 'recordTime', width: '140' },
          { label: '不适用条目数', code: 'coincidences', width: '140' }
        ]
      },
      {
        label: '同期ICU护理质量督查条目总患者',
        queryType: '1',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入院时间', code: 'inpatientDate' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '督查评估时间', code: 'recordTime' },
          { label: '督查评估条目数', code: 'coincidences' }
        ]
      }
    ],
    calculation: [
      // 公式模块显示计算数值相关数据
      {
        label: '危重患者护理质量督查条目完全达标总人次数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU危重患者护理质量督查条目总人次数',
        code: 'denominator'
      }
    ]
  },
  {
    label: 'ICU非计划所有导管插管拔管率',
    value: '',
    definition: '非计划所有导管插管拔管例数占同期ICU患者所有导管插管拔管总数的比例',
    expression: 'ICU非计划所有导管插管拔管率=非计划所有导管插管拔管例数/ICU患者所有导管插管拔管总数*100%', // 计算公式
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl: 'qcReport/unplanIntuba',
    dataApi: qcReport_unplanIntubaData,
    proApi: qcReport_unplanIntuba,
    exportUrl2: 'qcReport/unplanIntuba',
    proApi2: qcReport_unplanIntuba,
    valueKey: 'unplanIntubaAllRate',
    doubleTable: {
      label_one: '非计划所有导管插管拔管患者',
      label_two: '同期ICU所有导管插管拔管患者',
      label_one_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '导管名称', code: 'catheterName' },
        { label: '插管时间', code: 'startTime', width: '140' },
        { label: '拔管时间(非计划)', code: 'catheterEndTime', width: '140' }
      ],
      label_two_showItems: [
        { label: '序号', code: 'rowNum', width: '50' },
        { label: '住院号', code: 'mrn' },
        { label: '姓名', code: 'patientName' },
        { label: '性别', code: 'sex', width: '50' },
        { label: '年龄', code: 'age' },
        { label: '诊断', code: 'diagNames' },
        { label: '入区时间', code: 'icuAreaTime', width: '140' },
        { label: '出区时间', code: 'icuLeaveTime', width: '140' },
        { label: '导管名称', code: 'catheterName' },
        { label: '插管时间', code: 'startTime', width: '140' },
        { label: '拔管时间', code: 'catheterEndTime', width: '140' }
      ]
    },
    calculation: [
      {
        label: '非计划所有导管插管拔管例数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: 'ICU患者所有导管插管拔管总数',
        code: 'denominator'
      }
    ]
  },
  {
    label: '血液净化非计划下机发生率', // 左侧列表显示文字
    value: '0', // 值
    definition: '统计周期内血液净化患者非计划下机次数占同期血液净化患者上机次数的比例',
    expression: '血液净化非计划下机发生率=血液净化患者非计划下机次数/同期血液净化患者上机次数*100%', // 计算公式
    dataApi: qcReport_unplanDownBloodPurification_data,
    newHtml: true, // 新样式模块开启
    newApi: true, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl: 'qcReport/unplanDownBloodPurification',
    proApi: qcReport_unplanDownBloodPurification_listPage,
    exportUrl2: 'qcReport/unplanDownBloodPurification',
    proApi2: qcReport_unplanDownBloodPurification_listPage,
    valueKey: 'unplanDownBloodPurificationRate',
    multipleTable: [
      {
        label: '血液净化非计划下机患者',
        queryType: '0',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入院时间', code: 'inpatientDate', width: '140' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '透析设定时间(h)', code: 'dialysisSetTime', width: '140' },
          { label: '上机时间', code: 'upperMachineTime', width: '140' },
          { label: '下机时间', code: 'downMachineTime', width: '140' },
          { label: '实际透析时间', code: 'actualDialysisTime', width: '140' }
        ]
      },
      {
        label: '同期血液净化上机患者',
        queryType: '1',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入院时间', code: 'inpatientDate', width: '140' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '透析设定时间(h)', code: 'dialysisSetTime', width: '140' },
          { label: '上机时间', code: 'upperMachineTime', width: '140' },
          { label: '下机时间', code: 'downMachineTime', width: '140' },
          { label: '实际透析时间', code: 'actualDialysisTime', width: '140' }
        ]
      }
    ],
    calculation: [
      // 公式模块显示计算数值相关数据
      {
        label: '血液净化患者非计划下机次数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期血液净化患者上机次数',
        code: 'denominator'
      }
    ]
  },
  {
    label: 'CVC导管使用率', // 左侧列表显示文字
    value: '0', // 值
    definition: '统计周期内CVC导管留置天数占同期ICU患者在区天数的比例',
    expression: 'CVC导管使用率=CVC导管留置天数/同期ICU患者在区天数*100%', // 计算公式
    dataApi: qcReport_catherUseRate_data,
    newHtml: true, // 新样式模块开启
    newApi: false, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl: 'qcReport/catherUseRate',
    proApi: qcReport_catherUseRate_listPage,
    valueKey: 'cVCCatheterRate',
    params: {
      catherGroupCode: 'CRBSI'
    },
    multipleTable: [
      {
        label: 'CVC导管留置患者',
        queryType: '0',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '导管名称', code: 'catheterName', width: '140' },
          { label: '插管时间', code: 'startTime', width: '140' },
          { label: '拔管时间', code: 'catheterEndTime', width: '140' },
          { label: '留置天数', code: 'intubeDays', width: '140' }
        ]
      },
      {
        label: '同期ICU在区患者',
        queryType: '1',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '在区天数', code: 'inAreadays', width: '140' }
        ]
      }
    ],
    calculation: [
      // 公式模块显示计算数值相关数据
      {
        label: 'CVC导管留置天数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU患者在区天数',
        code: 'denominator'
      }
    ]
  },
  {
    label: '导尿管使用率', // 左侧列表显示文字
    value: '0', // 值
    definition: '统计周期内导尿管留置天数占同期ICU患者在区天数的比例',
    expression: '导尿管使用率=导尿管留置天数/同期ICU患者在区天数*100%', // 计算公式
    dataApi: qcReport_catherUseRate_data,
    newHtml: true, // 新样式模块开启
    newApi: false, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl: 'qcReport/catherUseRate',
    proApi: qcReport_catherUseRate_listPage,
    valueKey: 'cAUTICatheterRate',
    params: {
      catherGroupCode: 'CAUTI'
    },
    multipleTable: [
      {
        label: '导尿管留置患者',
        queryType: '0',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '导管名称', code: 'catheterName', width: '140' },
          { label: '插管时间', code: 'startTime', width: '140' },
          { label: '拔管时间', code: 'catheterEndTime', width: '140' },
          { label: '留置天数', code: 'intubeDays', width: '140' }
        ]
      },
      {
        label: '同期ICU在区患者',
        queryType: '1',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '在区天数', code: 'inAreadays', width: '140' }
        ]
      }
    ],
    calculation: [
      // 公式模块显示计算数值相关数据
      {
        label: '导尿管留置天数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU患者在区天数',
        code: 'denominator'
      }
    ]
  },
  {
    label: '有创呼吸机使用率', // 左侧列表显示文字
    value: '0', // 值
    definition: '统计周期内有创呼吸机留置天数占同期ICU患者在区天数的比例',
    expression: '有创呼吸机使用率=有创呼吸机留置天数/同期ICU患者在区天数*100%', // 计算公式
    dataApi: qcReport_catherUseRate_data,
    newHtml: true, // 新样式模块开启
    newApi: false, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl: 'qcReport/catherUseRate',
    proApi: qcReport_catherUseRate_listPage,
    valueKey: 'vAPCatheterRate',
    params: {
      catherGroupCode: 'VAP'
    },
    multipleTable: [
      {
        label: '有创呼吸机留置患者',
        queryType: '0',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '导管名称', code: 'catheterName', width: '140' },
          { label: '插管时间', code: 'startTime', width: '140' },
          { label: '拔管时间', code: 'catheterEndTime', width: '140' },
          { label: '留置天数', code: 'intubeDays', width: '140' }
        ]
      },
      {
        label: '同期ICU在区患者',
        queryType: '1',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '在区天数', code: 'inAreadays', width: '140' }
        ]
      }
    ],
    calculation: [
      // 公式模块显示计算数值相关数据
      {
        label: '有创呼吸机留置天数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU患者在区天数',
        code: 'denominator'
      }
    ]
  },
  {
    label: 'ICU患者抢救成功率', // 左侧列表显示文字
    value: '0', // 值
    definition: '统计周期内ICU患者抢救成功次数占同期ICU患者抢救次数的比例',
    expression: 'ICU患者抢救成功率=ICU患者抢救成功次数/同期ICU患者抢救次数*100%', // 计算公式
    dataApi: qcReport_rescure_data,
    newHtml: true, // 新样式模块开启
    newApi: false, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl: 'qcReport/rescure',
    proApi: qcReport_rescure_listPage,
    valueKey: 'rescureSuccessRate',
    multipleTable: [
      {
        label: 'ICU抢救成功患者',
        queryType: '0',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '抢救用时', code: 'duration', width: '140' },
          { label: '抢救开始时间', code: 'startTime', width: '140' },
          { label: '抢救结束时间', code: 'endTime', width: '140' },
          { label: '抢救结果', code: 'status', width: '140' }
        ]
      },
      {
        label: '同期ICU抢救患者',
        queryType: '1',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '抢救用时', code: 'duration', width: '140' },
          { label: '抢救开始时间', code: 'startTime', width: '140' },
          { label: '抢救结束时间', code: 'endTime', width: '140' },
          { label: '抢救结果', code: 'status', width: '140' }
        ]
      }
    ],
    calculation: [
      // 公式模块显示计算数值相关数据
      {
        label: 'ICU患者抢救成功次数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU患者抢救次数',
        code: 'denominator'
      }
    ]
  },
  {
    label: 'ICU非计划胃管插管拔管率', // 左侧列表显示文字
    value: '0', // 值
    definition: '非计划胃管插管拔管例数占同期ICU患者胃管插管拔管总数的比例',
    expression: 'ICU非计划胃管插管拔管率=非计划胃管插管拔管例数/ICU患者胃管插管拔管总数*100%', // 计算公式
    dataApi: qcReport_catherTypeEndcather_data,
    newHtml: true, // 新样式模块开启
    newApi: false, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl: 'qcReport/catherTypeEndcather',
    proApi: qcReport_catherTypeEndcather_listPage,
    valueKey: 'unStomachRate',
    params: {
      catherTypeDict: 'WN_ICIS_DIC_DGFL_10401'
    },
    multipleTable: [
      {
        label: '非计划胃管插管拔管患者',
        queryType: '0',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '导管名称', code: 'catheterName', width: '140' },
          { label: '插管时间', code: 'startTime', width: '140' },
          { label: '拔管时间（非计划）', code: 'catheterEndTime', width: '140' }
        ]
      },
      {
        label: '同期ICU胃管插管拔管患者',
        queryType: '1',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '导管名称', code: 'catheterName', width: '140' },
          { label: '插管时间', code: 'startTime', width: '140' },
          { label: '拔管时间', code: 'catheterEndTime', width: '140' }
        ]
      }
    ],
    calculation: [
      // 公式模块显示计算数值相关数据
      {
        label: '非计划胃管插管拔管例数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU胃管插管拔管总数',
        code: 'denominator'
      }
    ]
  },
  {
    label: 'ICU非计划尿管插管拔管率', // 左侧列表显示文字
    value: '0', // 值
    definition: '非计划尿管插管拔管例数占同期ICU患者尿管插管拔管总数的比例',
    expression: 'ICU非计划尿管插管拔管率=非计划尿管插管拔管例数/ICU患者尿管插管拔管总数*100%', // 计算公式
    dataApi: qcReport_unplanIntuba_data,
    newHtml: true, // 新样式模块开启
    newApi: false, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl: 'qcReport/unplanIntuba',
    proApi: qcReport_unplanIntuba_listPage,
    valueKey: 'unUrineRate',
    params: {
      catherGroupCode: 'CAUTI'
    },
    multipleTable: [
      {
        label: '非计划尿管插管拔管患者',
        queryType: '0',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '导管名称', code: 'catheterName', width: '140' },
          { label: '插管时间', code: 'startTime', width: '140' },
          { label: '拔管时间（非计划）', code: 'catheterEndTime', width: '140' }
        ]
      },
      {
        label: '同期ICU尿管插管拔管患者',
        queryType: '1',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '导管名称', code: 'catheterName', width: '140' },
          { label: '插管时间', code: 'startTime', width: '140' },
          { label: '拔管时间', code: 'catheterEndTime', width: '140' }
        ]
      }
    ],
    calculation: [
      // 公式模块显示计算数值相关数据
      {
        label: '非计划尿管插管拔管例数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU尿管插管拔管总数',
        code: 'denominator'
      }
    ]
  },
  {
    label: 'ICU非计划中心静脉插管拔管率', // 左侧列表显示文字
    value: '0', // 值
    definition: '非计划中心静脉插管拔管例数占同期ICU患者中心静脉插管拔管总数的比例',
    expression: 'ICU非计划中心静脉插管拔管率=非计划中心静脉插管拔管例数/ICU患者中心静脉插管拔管总数*100%', // 计算公式
    dataApi: qcReport_catherTypeEndcather_data,
    newHtml: true, // 新样式模块开启
    newApi: false, // 2个api的情况
    newLineEcharts: true, // 线
    newEcharts: true, // 新样式模块开启的饼图
    exportUrl: 'qcReport/catherTypeEndcather',
    proApi: qcReport_catherTypeEndcather_listPage,
    valueKey: 'unCvcRate',
    params: {
      catherTypeDict: 'WN_ICIS_DIC_DGFL_30101'
    },
    multipleTable: [
      {
        label: '非计划中心静脉插管拔管患者',
        queryType: '0',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '导管名称', code: 'catheterName', width: '140' },
          { label: '插管时间', code: 'startTime', width: '140' },
          { label: '拔管时间（非计划）', code: 'catheterEndTime', width: '140' }
        ]
      },
      {
        label: '同期ICU中心静脉插管拔管患者',
        queryType: '1',
        showItems: [
          { label: '序号', code: 'rowNum', width: '50' },
          { label: '住院号', code: 'mrn' },
          { label: '姓名', code: 'patientName' },
          { label: '性别', code: 'sex', width: '50' },
          { label: '年龄', code: 'age' },
          { label: '诊断', code: 'diagNames' },
          { label: '入区时间', code: 'icuAreaTime', width: '140' },
          { label: '出区时间', code: 'icuLeaveTime', width: '140' },
          { label: '导管名称', code: 'catheterName', width: '140' },
          { label: '插管时间', code: 'startTime', width: '140' },
          { label: '拔管时间', code: 'catheterEndTime', width: '140' }
        ]
      }
    ],
    calculation: [
      // 公式模块显示计算数值相关数据
      {
        label: '非计划中心静脉插管拔管例数',
        code: 'molecule' // 实际数据库使用字段名
      },
      {
        label: '同期ICU中心静脉插管拔管总数',
        code: 'denominator'
      }
    ]
  }
]

export const iCUQualityControlIndex_leftData = dataStatistics_leftData.map((v) => {
  return {
    name: v.label,
    key: v.valueKey,
    value: ''
  }
})

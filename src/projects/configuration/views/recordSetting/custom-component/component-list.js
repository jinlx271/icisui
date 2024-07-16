
// 公共样式
const commonStyle = {
    rotate: '',
    opacity: 1
}

// 编辑器左侧组件列表
const commonList = [{
    component: 'MyLogo',
    name: '图片',
    propValue: '',
    animations: [],
    events: {},
    attr: {
        imageSrc: ''

    },
    style: {
        width: 100,
        height: 14
    }
}, {
    component: 'v-label',
    model: 'design',
    name: '文本标签',
    icon: 'el-icon-edit',
    animations: [],
    events: {},
    propValue: '文字',
    attr: {
        // label: '文本',

        field: '',
        formProSqlId: '',
        displayRules: '',
        custom_field: '', // 自定义绑定值
        formatStr: '',
        maxLength: 0
    },
    style: {
        width: 60,
        height: 14,
        textAlign: '',
        fontSize: 12,
        color: '#000000',
        borderWidth: 1,
        borderLeft: false,
        borderRight: false,
        borderBottom: true,
        borderTop: false,
        lineHeight: 1
        // borderColor: '#777777'
    }
},
{
    component: 'MyCheckbox',
    name: '多选',
    animations: [],
    events: {},
    attr: {
        label: '多选',
        field: '',
        formProSqlId: '',
        custom_field: '', // 自定义绑定值
        displayRules: '',
        maxLength: '',
        required: '',
        option: {
            list: [{
                label: '选项1',
                value: '1'
            }],
            from: 'local', // 选项来源 local:本地写死  sysCode：字典值   special：其他接口
            code: '', // 字典值
            url: '' // 接口地址
        },
        labelLineFeed: false,
        noDataText: '/'
    },
    bindValue: '',
    style: {
        width: 120,
        height: 14,
        fontSize: 12
    }
}, {
    component: 'border',
    name: '边框',
    animations: [],
    events: {},
    attr: {
    },
    style: {
        width: 880,
        height: 250,
        borderLeft: true,
        borderRight: true,
        borderBottom: true,
        borderTop: true,
        borderWidth: 1,
        borderRadius: 0
    }
}, {
    component: 'vline',
    attr: {
    },
    name: '直线',
    animations: [],
    events: {},
    style: {
        width: 880,
        height: 0,
        rotate: 0
        // borderLeft: true,
        // borderRight: true,
        // borderBottom: true,
        // borderTop: true,
        // borderRadius: 0
    }
}, {
    component: 'vCharts',
    attr: {
        startTime: '2022-02-25 07:00:00',
        endTime: '2022-02-26 07:00:00',
        formType: 1, // 结果匹配
        recordTypeDict: 1, // 传参匹配
        hGridNum: 48, // 横轴格数
        vGridNum: 10, // 纵轴格数
        gridStyle: 0, // 1实现 0虚线 2虚实相间
        centerDisplay: 0, // 居中显示
        nbpABP: 0, // 是否区分有创/无创血压
        showWarnningSynbol: false,
        formProSqlId: '',
        displayRules: '', // 数据展示规则
        xAxisShowFlag: '0', // 是否显示时间轴
        // xAxisLabelAlign: 'left', // 对齐格式
        timeFormat: '', // 时间轴的格式
        xAxisInterval: 0, // 刻度间隔
        moniitemCode: 'WN_ICIS_MONI_10010101', // 物理降温
        MON_ITEM_CONFIG_symbolSize: '12', // 图表图标大小
        vitalSigns_coolingData: '',
        moniEventConfig: [
            {
                'id': '202203021118570081',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0101',
                'eventName': '入院',
                'eventAbbr': '入院',
                'eventType': '1',
                'selfConfig': '0',
                'statusDict': '1',
                'pinyin': 'ry',
                'wubi': 'tb',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021118570082',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0102',
                'eventName': '入区',
                'eventAbbr': '入区',
                'eventType': '1',
                'selfConfig': '0',
                'statusDict': '1',
                'pinyin': 'rq',
                'wubi': 'ta',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021119580083',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0103',
                'eventName': '床位安排',
                'eventAbbr': '床',
                'eventType': '1',
                'selfConfig': '0',
                'statusDict': '1',
                'pinyin': 'cwap',
                'wubi': 'ywpr',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021122090088',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0104',
                'eventName': '换床',
                'eventAbbr': '换',
                'eventType': '1',
                'selfConfig': '0',
                'statusDict': '1',
                'pinyin': 'hc',
                'wubi': 'ry',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021128480100',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0105',
                'eventName': '出区',
                'eventAbbr': '出区',
                'eventType': '1',
                'selfConfig': '0',
                'statusDict': '1',
                'pinyin': 'cq',
                'wubi': 'ba',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021129040101',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0106',
                'eventName': '出院',
                'eventAbbr': '出院',
                'eventType': '1',
                'selfConfig': '0',
                'statusDict': '1',
                'pinyin': 'cy',
                'wubi': 'bb',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202211231000350000',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0107',
                'eventName': '取消入区',
                'eventAbbr': null,
                'eventType': '1',
                'selfConfig': '0',
                'statusDict': '1',
                'pinyin': 'qxrq',
                'wubi': 'bita',
                'remark': '',
                'position': 'none',
                'size': 9
            },
            {
                'id': '202211231004390000',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0108',
                'eventName': '出区召回',
                'eventAbbr': null,
                'eventType': '1',
                'selfConfig': '0',
                'statusDict': '1',
                'pinyin': 'cqzh',
                'wubi': 'bavl',
                'remark': '',
                'position': 'none',
                'size': 9
            },
            {
                'id': '202305161056453765',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0109',
                'eventName': '患者外出',
                'eventAbbr': '患者外出',
                'eventType': '1',
                'selfConfig': '1',
                'statusDict': '1',
                'pinyin': 'hzwc',
                'wubi': 'kfqb',
                'remark': '',
                'position': 'none',
                'size': 9
            },
            {
                'id': '202305161057133766',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0110',
                'eventName': '外出返回',
                'eventAbbr': '外出返回',
                'eventType': '1',
                'selfConfig': '1',
                'statusDict': '1',
                'pinyin': 'wcfh',
                'wubi': 'qbrl',
                'remark': '',
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021120380084',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0201',
                'eventName': '连接监护仪',
                'eventAbbr': '监√',
                'eventType': '2',
                'selfConfig': '0',
                'statusDict': '1',
                'pinyin': 'ljjhy',
                'wubi': 'lrjrw',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021121020085',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0202',
                'eventName': '连接呼吸机',
                'eventAbbr': '呼√',
                'eventType': '2',
                'selfConfig': '0',
                'statusDict': '1',
                'pinyin': 'ljhxj',
                'wubi': 'lrkks',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021121210086',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0203',
                'eventName': '断开监护仪',
                'eventAbbr': '监X',
                'eventType': '2',
                'selfConfig': '0',
                'statusDict': '1',
                'pinyin': 'dkjhy',
                'wubi': 'ogjrw',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021121430087',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0204',
                'eventName': '断开呼吸机',
                'eventAbbr': '呼X',
                'eventType': '2',
                'selfConfig': '0',
                'statusDict': '1',
                'pinyin': 'dkhxj',
                'wubi': 'ogkks',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021122360089',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0301',
                'eventName': '开始抢救',
                'eventAbbr': '救→',
                'eventType': '3',
                'selfConfig': '0',
                'statusDict': '1',
                'pinyin': 'ksqj',
                'wubi': 'gvrf',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021123070090',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0302',
                'eventName': '结束抢救',
                'eventAbbr': '救←',
                'eventType': '3',
                'selfConfig': '0',
                'statusDict': '1',
                'pinyin': 'jsqj',
                'wubi': 'xgrf',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021123310091',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0401',
                'eventName': '气管插管',
                'eventAbbr': '管↓',
                'eventType': '4',
                'selfConfig': '0',
                'statusDict': '1',
                'pinyin': 'qgcg',
                'wubi': 'rtrt',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021124000092',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0402',
                'eventName': '气管拔管',
                'eventAbbr': '管↑',
                'eventType': '4',
                'selfConfig': '0',
                'statusDict': '1',
                'pinyin': 'qgbg',
                'wubi': 'rtrt',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021124250093',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0501',
                'eventName': '手术',
                'eventAbbr': '术→',
                'eventType': '5',
                'selfConfig': '1',
                'statusDict': '1',
                'pinyin': 'ss',
                'wubi': 'rs',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021124530094',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0502',
                'eventName': '手术返室',
                'eventAbbr': '术←',
                'eventType': '5',
                'selfConfig': '1',
                'statusDict': '1',
                'pinyin': 'ssfs',
                'wubi': 'rsrp',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021125320095',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0601',
                'eventName': '死亡',
                'eventAbbr': '亡',
                'eventType': '6',
                'selfConfig': '1',
                'statusDict': '1',
                'pinyin': 'sw',
                'wubi': 'gy',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021126100096',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0602',
                'eventName': '心跳骤停',
                'eventAbbr': '心停',
                'eventType': '6',
                'selfConfig': '1',
                'statusDict': '1',
                'pinyin': 'xtzt',
                'wubi': 'nkcw',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203181342380738',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0603',
                'eventName': '心跳复苏',
                'eventAbbr': '',
                'eventType': '3',
                'selfConfig': '1',
                'statusDict': '1',
                'pinyin': 'xtfs',
                'wubi': 'nkta',
                'remark': '',
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021126370097',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0701',
                'eventName': '物理降温',
                'eventAbbr': '降温',
                'eventType': '7',
                'selfConfig': '0',
                'statusDict': '1',
                'pinyin': 'wljw',
                'wubi': 'tgbi',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021127330098',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0702',
                'eventName': '心电',
                'eventAbbr': '心图',
                'eventType': '7',
                'selfConfig': '1',
                'statusDict': '1',
                'pinyin': 'xd',
                'wubi': 'nj',
                'remark': null,
                'position': 'none',
                'size': 9
            },
            {
                'id': '202203021128050099',
                'eventCode': 'WN_ICIS_PATIENTEVENT_0703',
                'eventName': '摄片',
                'eventAbbr': '摄片',
                'eventType': '7',
                'selfConfig': '1',
                'statusDict': '1',
                'pinyin': 'sp',
                'wubi': 'rt',
                'remark': null,
                'position': 'none',
                'size': 9
            }
        ],
        outLimitFlag: false,
        outLimitFontSize: 9,
        outLimitColor: '#000000',
        pageSize: 100, // 默认请求的监护项个数
        vitalSigns: [{ 'wardCode': '1876391', 'wardName': '重症医学科护理站', 'moniitemCode': 'WN_ICIS_MONI_10010101', 'moniitemName': '体温', 'moniitemDesc': 'T', 'lineTypeDict': 'line', 'symbolDict': 'M10.4,1.5c-4.8,0-8.7,3.9-8.7,8.7s3.9,8.7,8.7,8.7c4.8,0,8.7-4,8.7-8.7C19.1,5.4,15.2,1.5,10.4,1.5z M10.5,2.5 c1.9,0,3.7,0.7,5,1.8l-5.1,5.1l-5-5C6.7,3.2,8.5,2.5,10.5,2.5z M2.8,10.2c0-1.9,0.7-3.7,1.9-5.1l5,5l-5,5 C3.5,13.8,2.8,12.1,2.8,10.2z M5.4,15.9l5-5l5.1,5.1c-1.4,1.1-3.1,1.8-5,1.8C8.6,17.8,6.8,17.1,5.4,15.9z M16.2,15.3l-5.1-5.1 L16.2,5c1.2,1.4,2,3.2,2,5.2C18.2,12.2,17.4,14,16.2,15.3z', 'colorDict': '#E7086E', 'statusDict': '1', 'minValue': 35, 'maxValue': 40, 'yaxis': '1' }, { 'wardCode': '1876391', 'wardName': '重症医学科护理站', 'moniitemCode': 'WN_ICIS_MONI_10010201', 'moniitemName': '脉搏', 'moniitemDesc': 'PR', 'lineTypeDict': 'line', 'symbolDict': 'M10.3,1.5c-4.7,0-8.5,3.8-8.5,8.5c0,4.7,3.8,8.5,8.5,8.5s8.5-3.8,8.5-8.5C18.8,5.3,14.9,1.5,10.3,1.5z M10.3,17.4 c-4.1,0-7.5-3.3-7.5-7.5s3.3-7.5,7.5-7.5c4.2,0,7.4,3.4,7.4,7.5S14.4,17.4,10.3,17.4z M12.1,6.1H8.4c-1.1,0-2,0.9-2,2v3.7 c0,1.1,0.9,2,2,2h3.7c1.1,0,2-0.9,2-2V8C14.1,7,13.2,6.1,12.1,6.1z', 'colorDict': '#0363FF', 'statusDict': '1', 'minValue': 40, 'maxValue': 140, 'yaxis': '1' }, { 'wardCode': '1876391', 'wardName': '重症医学科护理站', 'moniitemCode': 'WN_ICIS_MONI_10010203', 'moniitemName': '收缩压', 'moniitemDesc': '无创收缩压', 'lineTypeDict': 'line', 'symbolDict': 'M16.8,9.27v1.05L3.24,17.43V16.1L15.39,9.85V9.77L3.24,3.49V2.16Z', 'colorDict': '#FF8C00', 'statusDict': '1', 'minValue': 70, 'maxValue': 200, 'yaxis': '1' }, { 'wardCode': '1876391', 'wardName': '重症医学科护理站', 'moniitemCode': 'WN_ICIS_MONI_10010204', 'moniitemName': '舒张压', 'moniitemDesc': '无创舒张压', 'lineTypeDict': 'line', 'symbolDict': 'M16.8,2.16V3.49L4.65,9.77v.08L16.8,16.1v1.33L3.24,10.32V9.27Z', 'colorDict': '#EB7405', 'statusDict': '1', 'minValue': 40, 'maxValue': 120, 'yaxis': '1' }, { 'wardCode': '1876391', 'wardName': '重症医学科护理站', 'moniitemCode': 'WN_ICIS_MONI_10010207', 'moniitemName': '呼吸', 'moniitemDesc': '呼吸频率', 'lineTypeDict': 'line', 'symbolDict': 'M10.7,10.3l6.6,6.6c0.2,0.2,0.2,0.5,0,0.7c-0.2,0.2-0.5,0.2-0.7,0L10,11l-6.6,6.6c-0.2,0.2-0.5,0.2-0.7,0 c-0.2-0.2-0.2-0.5,0-0.7l6.6-6.6L2.7,3.7C2.5,3.5,2.5,3.2,2.7,3c0.2-0.2,0.5-0.2,0.7,0L10,9.6L16.6,3c0.2-0.2,0.5-0.2,0.7,0 c0.2,0.2,0.2,0.5,0,0.7L10.7,10.3z', 'colorDict': '#7700B2', 'statusDict': '1', 'minValue': 10, 'maxValue': 25, 'yaxis': '1' }, { 'wardCode': '1876391', 'wardName': '重症医学科护理站', 'moniitemCode': 'WN_ICIS_MONI_10040110', 'moniitemName': '血氧饱和度', 'moniitemDesc': 'SO2', 'lineTypeDict': 'line', 'symbolDict': 'M10.4,1.5c-4.8,0-8.7,3.9-8.7,8.7s3.9,8.7,8.7,8.7c4.8,0,8.7-4,8.7-8.7C19.1,5.4,15.2,1.5,10.4,1.5z M10.5,2.5 c1.9,0,3.7,0.7,5,1.8l-5.1,5.1l-5-5C6.7,3.2,8.5,2.5,10.5,2.5z M2.8,10.2c0-1.9,0.7-3.7,1.9-5.1l5,5l-5,5 C3.5,13.8,2.8,12.1,2.8,10.2z M5.4,15.9l5-5l5.1,5.1c-1.4,1.1-3.1,1.8-5,1.8C8.6,17.8,6.8,17.1,5.4,15.9z M16.2,15.3l-5.1-5.1 L16.2,5c1.2,1.4,2,3.2,2,5.2C18.2,12.2,17.4,14,16.2,15.3z', 'colorDict': '#E7086E', 'statusDict': '1', 'minValue': 0, 'maxValue': 1, 'yaxis': '1' }],
        coolingData: [{ 'isEdit': false, 'successCode_failCode': '001', 'successName_failName': '物理降温(成功)', 'successAbbr_failAbbr': null, 'successSymbolDict_failSymbolDict': 'M10.7,10.3l6.6,6.6c0.2,0.2,0.2,0.5,0,0.7c-0.2,0.2-0.5,0.2-0.7,0L10,11l-6.6,6.6c-0.2,0.2-0.5,0.2-0.7,0 c-0.2-0.2-0.2-0.5,0-0.7l6.6-6.6L2.7,3.7C2.5,3.5,2.5,3.2,2.7,3c0.2-0.2,0.5-0.2,0.7,0L10,9.6L16.6,3c0.2-0.2,0.5-0.2,0.7,0 c0.2,0.2,0.2,0.5,0,0.7L10.7,10.3z', 'successColorDict_failColorDict': '#00FFB3' }, { 'isEdit': false, 'successCode_failCode': '002', 'successName_failName': '物理降温(失败)', 'successAbbr_failAbbr': null, 'successSymbolDict_failSymbolDict': 'M10.7,10l6.6,6.7c0.2,0.2,0.2,0.5,0,0.7c-0.2,0.2-0.5,0.2-0.7,0l-6.1-6.2v7.7c0,0.3-0.2,0.6-0.5,0.6 s-0.5-0.3-0.5-0.6v-7.7l-6.1,6.2c-0.2,0.2-0.5,0.2-0.7,0c-0.2-0.2-0.2-0.5,0-0.7L9.3,10L2.7,3.3c-0.2-0.2-0.2-0.5,0-0.7 c0.2-0.2,0.5-0.2,0.7,0l6.1,6.2V1.1c0-0.3,0.2-0.6,0.5-0.6s0.5,0.3,0.5,0.6v7.7l6.1-6.2c0.2-0.2,0.5-0.2,0.7,0 c0.2,0.2,0.2,0.5,0,0.7L10.7,10z', 'successColorDict_failColorDict': '#F80606' }]
    },
    name: '监护图表',
    animations: [],
    events: {},
    style: {
        width: 880,
        height: 250,
        borderLeft: true,
        borderRight: true,
        borderBottom: true,
        borderTop: true,
        borderWidth: 0,
        borderRadius: 0
    }
}, {
    component: 'metaData',
    attr: {
        formProSqlId: '',
        displayRules: '',
        tdContent: '元数据编码',
        showTitle: false,
        labelLine: false,
        optionLine: false,
        metaData: '',
        formId: '',
        formName: ''
    },
    name: '元数据',
    animations: [],
    events: {},
    bindValue: '',
    style: {
        width: 120,
        height: 14,
        fontSize: 12
    }
}, {
    component: 'VPageNum',
    model: 'design',
    name: '页码',
    icon: 'el-icon-edit',
    animations: [],
    events: {},
    propValue: '页码',
    attr: {
        showBindValue: false,
        customValue: 0,
        showTotalPage: 0,
        curPageNum: '1',
        totalPageNums: '1',
        connectorChar: '-',
        isRelativeIcuAreaDays: 0, // 以入区天数作为页码
        sharePageNum: 0 // 正反面共用页码
    },
    style: {
        width: 60,
        height: 14,
        textAlign: '',
        fontSize: 12,
        color: '#000000',
        borderWidth: 1,
        borderLeft: true,
        borderRight: true,
        borderBottom: true,
        borderTop: true

    },
    bindValue: ''
}, {
    component: 'VContinuePage',
    model: 'design',
    name: '续页标识',
    icon: 'el-icon-edit',
    animations: [],
    events: {},
    propValue: '续页标识',
    attr: {
        showBindValue: false,
        customValue: 0,
        prefix: '' // 前缀
    },
    style: {
        width: 60,
        height: 14,
        textAlign: '',
        fontSize: 12,
        color: '#000000',
        borderWidth: 1,
        borderLeft: true,
        borderRight: true,
        borderBottom: true,
        borderTop: true

    },
    bindValue: ''
}, {
    component: 'VRecordDate',
    model: 'design',
    name: '记录日期',
    icon: 'el-icon-edit',
    animations: [],
    events: {},
    propValue: '记录日期',
    attr: {
        showBindValue: false,
        inAreaDay: 0,
        showDaySpan: 0,
        formatStr: 'YYYY-MM-DD'
    },
    style: {
        width: 60,
        height: 14,
        textAlign: '',
        fontSize: 12,
        color: '#000000',
        borderWidth: 1,
        borderLeft: true,
        borderRight: true,
        borderBottom: true,
        borderTop: true

    },
    bindValue: ''
    }, {
    // 泵入药
    component: 'PumpAdministration',
    attr: {
        recordTypeDict: 3, // 传参匹配
        formProSqlId: '', // 数据源
        limitPageNum: '', //
        displayRules: '', // 数据展示规则
        hGridNum: 15, // 横轴格数
        vGridNum: 5, // 纵轴格数
        gridStyle: 0, // 1实现 0虚线 2虚实相间
        dislocation: 0, // 流速错开 0 保持原样 1 错开
        lineCenter: 0, // 进度条居中 0 保持原样 1 错开
        startTimeSelect: '', // 医嘱开始时间的展示样式
        continueStyle: '2' // 续药的样式
    },
    name: '泵入给药图',
    animations: [],
    events: {},
    style: {
        width: 880,
        height: 250,
        borderLeft: true,
        borderRight: true,
        borderBottom: true,
        borderTop: true,
        borderWidth: 0,
        borderRadius: 0,
        borderColor: '#333'
    }
}, {
    component: 'InfusionAdministration',
    attr: {
        recordTypeDict: 3, // 传参匹配
        formProSqlId: '', // 数据源
        limitPageNum: '', //
        displayRules: '', // 数据展示规则
        hGridNum: 15, // 横轴格数
        vGridNum: 5, // 纵轴格数
        gridStyle: 0, // 1实现 0虚线 2虚实相间
        staggeredInput: 0, // 入量错开 0 保持原样 1 错开
        lineCenter: 0, // 进度条居中 0 保持原样 1 错开
        startTimeSelect: '' // 医嘱开始时间的展示样式
    },
    name: '输液给药图',
    animations: [],
    events: {},
    style: {
        width: 880,
        height: 250,
        borderLeft: true,
        borderRight: true,
        borderBottom: true,
        borderTop: true,
        borderWidth: 0,
        borderRadius: 0
    }
}, {
    component: 'VBodyImage',
    attr: {
        bodyType: 0, // 婴儿或者成人人体图
        bodyImageType: 'skin', // 人体图类型
        bodyFront: 0, // 人体正反面
        formProSqlId: '' // 数据源
    },
    name: '人体图',
    animations: [],
    events: {},
    style: {
        width: 356,
        height: 768,
        fontSize: 12,
        color: '#000000'
    }
}
]
commonList.forEach(item => {
    item.style = { ...item.style, ...commonStyle }
})
export {
    commonList
}

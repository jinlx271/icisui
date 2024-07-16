export default {
  // 不同局点定制需求 再这里设置，登录合并在全局globalConfig对象，有定制需求就设置key值为true，每行做什么的都要备注好，新医院初始复制那个医院也要备注
  '51050001': {
    apacheⅡ: true, // true为隐藏
    // hiddenPatientApply:true,//隐藏无手术申请
    // anesShowFee:true,//医生显示患者信息计费
    hiddenAnesTwoLine: true // 插管 穿刺部位
  },
  '451098457': { //
    apacheⅡ: true, // true为隐藏
    // 古蔺定制
    // hiddenPatientApply:true,//隐藏无手术申请
    // anesShowFee:true,//医生显示患者信息计费
    hiddenAnesTwoLine: true // 插管 穿刺部位
  },
  '209': {
    // 通江定制
    apacheⅡ: true, // true为隐藏
    // hiddenPatientApply: true, // 隐藏无手术申请
    showLeftRightN: true, // 麻醉单插管展示左右，经鼻
    anesShowFee: true, // 医生显示患者信息计费
    must_selectedNurse: true // 出麻醉必填洗手护士
    // getDrugPrint: false// 领药时是否打印处方单，默认为true
  },
  '12510521451164362Y': {
    showLeftRightN: true // 麻醉单插管展示左右，经鼻
  }
}

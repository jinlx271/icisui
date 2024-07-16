//更新下拉选项
function _updateSelectList(_this){
  const obj = _this.formData
  for (const group in obj) {
    let currGroup = obj[group];
    for(const key in currGroup){
      if(currGroup[key].outerList){ //外部列表
        currGroup[key].items = _this.outerList[currGroup[key].outerList]
      }
    } 
  }
}
//获取表单数据
function _getData(_this, request, listKey, callback) {

  const obj = _this.formData

  for (const group in obj) {
    let currGroup = obj[group];
    for(const key in currGroup){
      if(currGroup[key].outerList){ //外部列表
        currGroup[key].items = _this.outerList[currGroup[key].outerList]
      }
    } 
  }

  let regOptId = _this.$route.query.regOptId
  request({ regOptId:regOptId }).then(res=>{
    for (const group in obj) {
      let currGroup = obj[group];

      if(group=='baseInfo'){
        for(const key in currGroup){
          currGroup[key].element_value = res.regOptItem[key]
        }
      }else{      
        for(const key in currGroup){
          
          if(currGroup[key].relateGroup){
            let currList = currGroup[key].relateGroup
            if(res[listKey][currList] && res[listKey][currList][key]){
              if(Array.isArray(currGroup[key].element_value)){
                currGroup[key].element_value = res[listKey][currList][key].split(',')
              }else{
                currGroup[key].element_value = res[listKey][currList][key]
              }
            }
          }else{
            if(res[listKey] && res[listKey][key]){
              if(Array.isArray(currGroup[key].element_value)){
                currGroup[key].element_value = res[listKey][key].split(',')
              }else{
                currGroup[key].element_value = res[listKey][key]
              }
            }
          }
        }
      }
    }
    if(callback){
      callback(res); //回调函数，处理特殊需求
    }
  })
}

//保存表单数据
function _saveData(_this, saveType, request,mainGroup,saveDataObj) {
  let regOptId = _this.$route.query.regOptId

  if (!regOptId) {
    _this.$message.error('保存失败');
    return false;
  }

  let formDataObj = _this.formData;
  if(!saveDataObj){
    saveDataObj = {}
  }
  
  let params={
    regOptId: regOptId,
    processState: saveType
  }
  if(mainGroup){
    saveDataObj[mainGroup]={}
    saveDataObj[mainGroup]=params
  }else{
    saveDataObj = params;
  }
  for (let group in formDataObj) {
    if(group!='baseInfo'){
      let currGroup = formDataObj[group]
      
      for(let key in currGroup){
        let currValue = currGroup[key].element_value;
        let item = currGroup[key];
        if(item.relateGroup){
          if(!saveDataObj[item.relateGroup]){
            saveDataObj[item.relateGroup]={} // 如果不存在，创建一个对象
          }
          if(Array.isArray(currValue)){
            saveDataObj[item.relateGroup][key] = currValue.join(',')
          }else{
            saveDataObj[item.relateGroup][key] = currValue
          }
        }else{
          if(Array.isArray(currValue)){
            saveDataObj[key] = currValue.join(',')
          }else{
            saveDataObj[key] = currValue
          }
        }      
      }
    }    
  }

  
  request(saveDataObj).then(response=>{
    _this.$message.success('保存成功');
  });
}



export {
  _saveData,
  _getData,
  _updateSelectList
};

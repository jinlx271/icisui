import { mergeWith, isString, isArray, cloneDeep, keyBy } from 'lodash'
import { getKey } from '@/utils/utils'
import dayjs from 'dayjs' // 时间的处理模块
export function renderData(isNeedGetData, element, propStyle) {
  let tableInnerHtml = ''
  if (isNeedGetData) { // 患者管理的文书模式
    // 判断是否需要获取数据 如果是代表是在护理文书页面 是需要获取对应的数据的
    if (element.attr.curPageData != undefined) {
      if (element.attr.recordTypeDict == '2') {
        tableInnerHtml = showFlowData(element.attr.curPageData, element, isNeedGetData)
      } else if (element.attr.recordTypeDict == '3') {
        tableInnerHtml = showHorizontalData(element.attr.curPageData, element, isNeedGetData)
      } else if (element.attr.recordTypeDict == '1') {
        tableInnerHtml = showCrossTable(element.attr.curPageData, element, isNeedGetData)
      }
    } else {
      tableInnerHtml = showEmptyData(element.data) // 显示空页
    }
  } else { // 模板设置问题 需要 预览行数
    element.attr['isShowNurseSign'] = 1
    // const maxRows = element.attr.isShowNurseSign ? element.attr.maxRows + 1 : element.attr.maxRows
    const tempData = new Array(element.attr.maxRows)// 生成一个假数据
    if (element.attr.recordTypeDict == '2') { // 纵向流式表
      const tempData = new Array(element.attr.maxRows * (element.attr.maxCols || 1))// 生成一个假数据
      tableInnerHtml = showFlowData(tempData, element)
    } else if (element.attr.recordTypeDict == '3') { // 横向流式表
      tableInnerHtml = showHorizontalData(tempData, element)
    } else if (element.attr.recordTypeDict == '1') {
      tableInnerHtml = showCrossTable(element.attr.curPageData, element, isNeedGetData)
    }
  }
  let tableDom
  if (element.data) {
    tableDom = createDocumentFragment(tableInnerHtml || element.data).children[0]
  } else {
    return ''
  }
  const newWidth = Number(propStyle.width?.split('px')[0]) || tableDom.offsetWidth || tableDom.style.width.split('px')[0]
  const newHeight = Number(propStyle.height?.split('px')[0]) || tableDom.offsetHeight || tableDom.style.height.split('px')[0]
  adjustTableWidth(tableDom, newWidth)
  adjustTableHeight(tableDom, newHeight)
  tableDom.style.borderColor = element.style.borderColor
  tableDom.setAttribute('data-criticlalRecordId', element.criticlalRecordId) // 每个表格组件 记录下所用组件id  但是无法兼容2022年之前的组件数据
  return tableDom.outerHTML
}
/**
     * 调整表格宽度
     */
 export function adjustTableWidth(table, newWidth, type) {
  // 参考tinymce 调整大小
  const columns = getTableColumns(table) // colgroup 横向表格渲染完成后  colgroup没有及时添加数据
  var tableWidth = table.offsetWidth || Number(table.style.width.split('px')[0])
  var step = newWidth - tableWidth // 表格变化前后的大小变化
  var widths = []
  widths = columns.map(col => { // 所有列的宽度数组
    return col.style.width ? Number(col.style.width.split('px')[0]) : col.offsetWidth
  })
  const deltas = widths.map(w => {
    return step * w / tableWidth
  })
  const newWidths = deltas.map((d, index) => {
    return widths[index] + d
  })
  columns.map((col, index) => {
    col.style.width = newWidths[index] + 'px'
  })
  table.style.width = newWidth + 'px'
}
/**
 * 调整表格高度
 */
 export function adjustTableHeight(table, newHight, type) {
  // jlx  tinymce 调整大小方案
    var rows = getTableRows(table)
    var tableHeight = Number(table.style.height.split('px')[0])
    var step = newHight - tableHeight // 表格变化前后的大小变化
    var heights = []
    heights = rows.map(r => { // 所有行的高度数组
      return r.style.height ? Number(r.style.height.split('px')[0]) : r.offsetHeight
    })
    const deltas = heights.map(h => {
      return step * h / tableHeight
    })
    const newHeights = deltas.map((d, index) => {
      return heights[index] + d
    })
    rows.map((row, index) => {
      if (type == 'template') {
        row.style.height = newHeights[index] + 'px'
      } else {
        const rowHeight = row.style.height ? Number(row.style.height.split('px')[0]) : row.offsetHeight
        row.style.height = rowHeight / tableHeight * 100 + '%'
      }
    })
    table.style.height = newHight + 'px'
}
// 显示暂无数据
export function showEmptyData(data) {
  const tableModeStr = data
  const tableDom = createDocumentFragment(tableModeStr).children[0]
  let tableHTML = tableDom.innerHTML
  const keyList = getKey(tableHTML)
  keyList.forEach(key => {
    tableHTML = tableHTML.replace('${' + key + '}', '&nbsp;&nbsp;')
  })
  tableDom.innerHTML = tableHTML
  return tableDom.outerHTML
}
 /**
     * 获取行数
     */
export function getTableRows(dom) {
  const list = Array.from(dom?.querySelectorAll('tr'))
  return list
}
  /**
   * 获取表格行数
   */
export function getTableColumns(dom) {
  const list = Array.from(dom?.querySelectorAll('colgroup'))
  let column = []
  if (list.length > 0) {
    list.forEach(colgroup => {
      column = column.concat(Array.from(colgroup.querySelectorAll('col')))
    })
  }
  return column
}
/**
 * 流式布局数据显示
 * tempData 为显示的数据
 * domId是组件的id
 * isShowTrueData 是否显示真实的数据
 */
 export function showFlowData(tempList, element, isShowTureData) {
  let tempData = []
  if (tempList[0] instanceof Array) { // 为了兼容  deileryData
    const customizer = function(objValue, srcValue) {
      if (isString(srcValue) && objValue != undefined && !objValue.includes(srcValue)) {
        return objValue + '+' + srcValue
      } else {
        return objValue
      }
    }
    tempData = tempList.map(item => {
      let obj = {}
      if (isArray(item)) {
        obj = cloneDeep(item[0])
        item.forEach(child => {
          obj = mergeWith(obj, child, customizer)
        })
      }
      return obj
    })
  } else {
    tempData = tempList
  }

  // 模板数据字符串
  const tableModeStr = element.data
  // 页码dom
  const tableDom = createDocumentFragment(tableModeStr)?.children[0]
  if (!tableDom) return ''
  // tableDom.style.height = 'auto'
  const bodyDom = tableDom?.getElementsByTagName('tbody')[0]
  if (!bodyDom) return ''
  const width = Number(tableDom.style.width.split('px')[0])
  let height = 0
  const newTrList = []
  const theadDom = tableDom.getElementsByTagName('thead')[0]
  if (theadDom && isShowTureData) {
    let trInnerHTML = theadDom.innerHTML
    const keyList = getKey(trInnerHTML)

    keyList.forEach(item => {
      if ((item == 'SURGERY_AFTER' || item == 'SURGERY') && element.attr.proApi == 'pro_flow_bj_child') { // 解放军 术后天数的显示 取第一天数据
        trInnerHTML = replceKeyToValue(item, trInnerHTML, tempData[0], isShowTureData) // 流式表灵活项N1的取值
      } else {
        trInnerHTML = replceKeyToValue(item, trInnerHTML, tempData, isShowTureData) // 流式表灵活项N1的取值
      }
    })
    theadDom.innerHTML = trInnerHTML
  }
  if (bodyDom) {
    if (element.attr.isShowMaxCols == 1 && element.attr.maxCols > 1) { // 主要为了设置列的宽度 以及表头信息适应横向循环
      // 查看tHead 标签用来查看表头信息是否需要循环查看
      const thead = tableDom.getElementsByTagName('thead')
      const theadTrDom = thead[0]?.getElementsByTagName('tr')
      // colgroup 标签用来计算列宽
      const colgroups = Array.from(tableDom.getElementsByTagName('colgroup'))
      let colContentList = Array.from(colgroups[0].querySelectorAll('[data-col-type=colContent]')) // col标签组合
      if (colContentList.length == 0) {
         colContentList = Array.from(colgroups[0].querySelectorAll('col'))
      }
      let colOutHTML = ''
      for (var index = 0; index < element.attr.maxCols - 1; index++) {
        colContentList.forEach(colDom => {
          const colCloneDom = colDom.cloneNode(true)
          colOutHTML += colCloneDom.outerHTML // 减少dom操作
        })
      }
      colgroups[0].innerHTML += colOutHTML
      if (theadTrDom && element.attr.maxCols > 1) { // 表头的循环
        Array.from(theadTrDom).forEach(tr => {
          const tdOutHTML = tr.innerHTML
          const arr = new Array(element.attr.maxCols)
          const theadTrDomInnerText = arr.fill(tdOutHTML, 0, element.attr.maxCols).join('')
          tr.innerHTML = theadTrDomInnerText
        })
      }
    }
    const trList = bodyDom.getElementsByTagName('tr') // 行数据
    // 获取一下rowspan  最大的rowpsan
    // 字符串替换
    // const signStr = tempData.map(item => item.RECORDOPERATORNAME).filter(item => !!item).toString('、')
    const tdLength = tableDom.querySelectorAll('col').length
    for (let index = 0; index < element.attr.maxRows; index++) { // 纵向循环
      for (let rowIndex = 0; rowIndex < trList.length; rowIndex++) { //
        const tr = trList[rowIndex]
        const trCloneNode = tr.cloneNode(true)// 克隆原生的节点node 内容包含属性等信息
        if (expressionCheck(element, tempData[index], 'clospanFlag', 'clospanExpression', 'clospanCondition')) { // 是否有合并单元格 小结
            let summarize = ''
            let tdDom = ''
            trCloneNode.querySelectorAll('td').forEach((item, index) => {
              if (index == 0) {
                tdDom = item
              }
              summarize += item.innerText
            })
            tdDom.setAttribute('colspan', tdLength)
            const height = tr.style.height
            if (element.attr.colspanStyle.strong == 1) {
              summarize = '<strong>' + summarize + '</strong>'
            }
            if (element.attr.colspanStyle.em == 1) {
              summarize = '<em>' + summarize + '</em>'
            }
            summarize = '<span style="font-size:' + element.attr.colspanStyle.fontSize + '">' + summarize + '</span>'
            if (element.attr.wordBreak == '1') {
              summarize = '<div style="height:inherit;width:100%;overflow:hidden;white-space: normal; word-break: break-all;">' + summarize + '</div>'
            }
            trCloneNode.innerHTML = '<td colspan="' + tdLength + '" align="' + (element.attr.colspanStyle.align || 'center') + '" height="' + height + '" > ' + summarize + '</td>'
        }
        if (tempData[index] && tempData[index]?.GROUPID != undefined && tempData[index]?.GROUPID) {
          const groupid = tempData[index]?.GROUPID
          const TITLEROWRECORDTIME = tempData[index]?.TITLEROWRECORDTIME
          if (groupid == 777) { // 小结上边线加粗
            trCloneNode.querySelectorAll('td').forEach(item => {
              item.style.borderTopWidth = '4px'
              item.style.borderTopColor = 'inherit'
            })
            if (TITLEROWRECORDTIME && (TITLEROWRECORDTIME.indexOf('24小时') > -1 || TITLEROWRECORDTIME.indexOf('07:00:00') > -1)) {
              trCloneNode.querySelectorAll('td').forEach(item => {
                item.style.borderBottomWidth = '4px'
                item.style.borderBottomColor = 'inherit'
              })
            }
          }

          if (groupid && (groupid == 888 || groupid == 666) && element.attr.clospanFlag != '1') { // 小结合并单元格 整行合并
            let summarize = ''
            let tdDom = ''
            trCloneNode.querySelectorAll('td').forEach((item, index) => {
              if (index == 0) {
                tdDom = item
              }
              summarize += item.innerText
            })
            tdDom.setAttribute('colspan', tdLength)
            const height = tr.style.height
            // const tdList = trCloneNode.querySelectorAll('[data-row-span]')
            trCloneNode.innerHTML = '<td colspan="' + tdLength + '" align="center" height="' + height + '"> ' + summarize + '</td>'
          }
          if (groupid == 555) { // 明光 上线加粗
            trCloneNode.querySelectorAll('td').forEach(item => {
              item.style.borderTopWidth = '4px'
              item.style.borderTopColor = 'inherit'
              item.style.borderBottomWidth = '4px'
              item.style.borderBottomColor = 'inherit'
            })
          }
          if (groupid == 444) { // 北京7点数据下边框加粗
            trCloneNode.querySelectorAll('td').forEach(item => {
              item.style.borderBottomWidth = '4px'
              item.style.borderBottomColor = 'inherit'
            })
          }
        }
        if (element.attr.mergeCell == '1') {
          if (tempData[index]) { // 隐藏折行数据中的border
            let rowSpanFlag = '0'
            let tdList = trCloneNode.querySelectorAll('[data-row-span]')
            if (tdList.length == 0) {
              tdList = trCloneNode.querySelectorAll('td')
            } else {
              rowSpanFlag = '1'
            }
            if ((rowSpanFlag == '0' && ((tempData[index]?.FOLD_NUM != undefined && tempData[index]?.FOLD_NUM) ||
              (tempData[index]?.ROWFEEDID != undefined && tempData[index]?.ROWFEEDID)))) {
              if ((tempData[index]?.FOLD_NUM == 1 || tempData[index]?.ROWFEEDID == 1)) {
                tdList.forEach(item => {
                  item.style.borderBottom = 'none'
                })
              } else if (index != 0) {
                tdList.forEach(item => {
                  item.style.borderTop = 'none'
                  item.style.borderBottom = 'none'
                })
              }
              if (index != element.attr.maxRows - 1) {
                tdList.forEach(item => {
                  item.style.borderBottom = 'none'
                })
              }
            } else if (rowSpanFlag == '1') {
              tdList.forEach(item => {
                const expression = item.getAttribute('data-rowspan-expression')
                const rowspan = item.getAttribute('data-row-span')
                console.log('expression', expression)
                if (expression && expression != '' && rowspanExpressionCheck(tempData[index], expression, rowspan)) {
                  item.style.borderBottom = 'none'
                } else if (index != 0) {
                  item.style.borderTop = 'none'
                  item.style.borderBottom = 'none'
                }
                if (index != element.attr.maxRows - 1) {
                  item.style.borderBottom = 'none'
                }
              })
            }
          }
        }

        height += trCloneNode.style.height ? Number(trCloneNode.style.height.split('px')[0]) : trCloneNode.scrollHeight
        const colContentList = Array.from(trCloneNode.querySelectorAll('[data-col-type=colContent]'))
        const colheaderList = Array.from(trCloneNode.querySelectorAll('[data-col-type=colHeader]'))
        let trInnerHTML = ''
        let headerInnerHTML = trCloneNode.innerHTML
        if (colheaderList.length > 0 && colContentList.length > 0) { // 有设置列内容且设置列头的 只对列内容进行循环
          colContentList.forEach(td => {
            trInnerHTML += td.outerHTML
          })
        } else { // 没有设置列内容 获取整行数据 进行查询
          if (colheaderList.length == 0) {
            trInnerHTML = trCloneNode.innerHTML
          } else {
            colContentList.forEach(td => {
              trInnerHTML += td.outerHTML
            })
          }
        }

        const maxCols = element.attr.isShowMaxCols == 1 ? (element?.attr?.maxCols) : 1 // 判断是否需要横向循环
        for (let colIndex = 0; colIndex < maxCols; colIndex++) { // 需求703431  纵向循环 横向循环
          let trContent = trInnerHTML
          const keyList = getKey(trInnerHTML)
          const priority = element?.attr?.priority || 'row' // 此处兼容老的文书 没有优先级字段
          let data
          if (priority == 'row') {
            data = tempData[index + colIndex * element.attr.maxRows] ? tempData[index + colIndex * element.attr.maxRows] : {}
          } else {
            data = tempData[colIndex + index * element.attr.maxCols] ? tempData[colIndex + index * element.attr.maxCols] : {}
          }
          if (element.attr.proApi == 'pro_flow_drug_common_nn' && data?.SHORTRECORDTIME) {
            data['SHORTTIMERECORDTIME'] = data?.SHORTRECORDTIME.split(' ')[1]
          }
          if (index == 0 && (data?.ROWRECORDTIME || data?.RECORDTIME) && (element.attr.proApi == 'pro_flow_nurse_wd' || element.attr.proApi == 'pro_flow_common' || element.attr.proApi == 'pro_flow_bj_child')) { // 翻页第一条数据显示时间
            data['SHORTRECORDTIME'] = data.SHORTRECORDTIME || dayjs(data.ROWRECORDTIME).format('MM-DD HH:mm')
            data['SHORTTIMERECORDTIME'] = data.SHORTTIMERECORDTIME || dayjs(data.ROWRECORDTIME).format('HH:mm')
            data['DATE'] = data.DATE || dayjs(data.ROWRECORDTIME).format('YYYY-MM-DD')
            if (element.attr.proApi == 'pro_flow_bj_child') { // 解放军
              data['TIME'] = data.TIME || dayjs(data.ROWRECORDTIME || data.RECORDTIME).format('YYYY-MM-DD HH:mm')
            } else {
              data['TIME'] = data.TIME || dayjs(data.ROWRECORDTIME).format('HH:mm:ss')
            }
            data['RECORDTIME'] = data.RECORDTIME || data.ROWRECORDTIME
          }
          if (index == 0 && (data?.ROWRECORDOPERATORCODE || data?.ROWRECORDOPERATORNAME) && element.attr.proApi == 'pro_flow_bj_child') { // 解放军
              data['RECORDOPERATORCODE'] = data.RECORDOPERATORCODE || data.ROWRECORDOPERATORCODE
              data['RECORDOPERATORNAME'] = data.RECORDOPERATORNAME || data.ROWRECORDOPERATORNAME
          }
          if (index == element.attr.maxRows - 1 && (data?.ROWRECORDOPERATORCODE || data?.ROWRECORDOPERATORNAME) && (element.attr.proApi == 'pro_flow_nurse_wd' || element.attr.proApi == 'pro_flow_common')) {
            data['RECORDOPERATORCODE'] = data.RECORDOPERATORCODE || data.ROWRECORDOPERATORCODE
            data['RECORDOPERATORNAME'] = data.RECORDOPERATORNAME || data.ROWRECORDOPERATORNAME
          }

          if (colIndex == 0) { // 第一个元素进行替换 包含头部信息
            keyList.forEach(key => {
              // 特殊值处理
              headerInnerHTML = replceKeyToValue(key, headerInnerHTML, data, isShowTureData)
            })
            trCloneNode.innerHTML = headerInnerHTML
          } else { // 多余的元素进行追加
            keyList.forEach(key => {
              trContent = replceKeyToValue(key, trContent, data, isShowTureData)
            })
            trCloneNode.innerHTML += trContent
          }
        }
        newTrList.push(trCloneNode.outerHTML)
      }
    }
  }

  bodyDom.innerHTML = newTrList.join('')
  if (isShowTureData) {
    showCheckbox(tableDom)
  }

  tableDom.style.width = width * (element.attr.maxCols || 1) + 'px'// 横向循环时需要计算宽度
  tableDom.style.height = height + 'px'// 纵向表格计算
  return tableDom.outerHTML
}
// 表达式的校验 横向合并
export function expressionCheck(element, data, spanFlag, expressionStr, condition) {
  let flag = false
  let expression = element.attr[expressionStr]
  if (element.attr[spanFlag] == '1' && data && expression) {
      for (let i = 0; i < element.attr[condition].length; i++) {
        const item = element.attr[condition][i]
        expression = expression.replaceAll(item.paramName, data[item.paramName])
    }
    const expressionFc = new Function(`return ${expression}`)
    if (expressionFc()) {
      flag = true
    }
  } else flag = false
  return flag
}
// 纵向合并单元格 条件关系的校验
export function rowspanExpressionCheck(data, expressionStr, rowspan) {
  let flag = false
  let expression = ''
  const paramList = rowspan.split(',')
  if (data) {
    for (let i = 0; i < paramList.length; i++) {
      expression = expressionStr.replaceAll(paramList[i], data[paramList[i]])
    }
    console.log('expression', expression)
    const expressionFc = new Function(`return ${expression}`)
    if (expressionFc()) {
      flag = true
    }
  } else flag = false
  return flag
}
/**
 * 用来渲染评估单的多选框
 */
 export function showCheckbox(tableDom) {
  const domlist = tableDom.querySelectorAll('[data-expression]', '[data-col-type=colContent]')
  domlist.forEach(dom => {
    if (dom && dom.parentNode) {
      const expression = dom.getAttribute('data-expression')
      const valueList = expression.split('==')
      if (valueList[0].indexOf(',') > -1) valueList[0] = valueList[0].split(',') // 多选情况
      if (valueList[0].includes(valueList[1]) && Array.isArray(valueList[0])) {
        dom.setAttribute('checked', 'checked')
        const isShowCheckbox = dom.getAttribute('data-show-checkbox')
        const type = dom.getAttribute('type')
        if (!isShowCheckbox && type && type == 'checkbox') {
          dom.parentNode.innerHTML = '√'
        }
      } else if (valueList[0] === valueList[1]) {
        dom.setAttribute('checked', 'checked')
        const isShowCheckbox = dom.getAttribute('data-show-checkbox')
        const type = dom.getAttribute('type')
        if (!isShowCheckbox && type && type == 'checkbox') {
          dom.parentNode.innerHTML = '√'
        }
      } else {
        dom.removeAttribute('checked')
        const type = dom.getAttribute('type')
        const isShowCheckbox = dom.getAttribute('data-show-checkbox')
        if (!isShowCheckbox && type && type == 'checkbox') {
          dom.parentNode.innerHTML = ''
        }
      }
    }
  })
}
/**
* 横向局数据显示
* tempData 为显示的数据
* domId是组件的id
* isShowTrueData 是否显示真实的数据
*/
export function showHorizontalData(tempData, element, isShowTureData) {
  const tableModeStr = element.data
  const data = tempData
  const tableDom = createDocumentFragment(tableModeStr).children[0]
  tableDom.style.width = 'auto'
  const colgroups = Array.from(tableDom.getElementsByTagName('colgroup'))
  colgroups.forEach(colgroup => { // 复制colgroups
    const tdList = Array.from(colgroup.querySelectorAll('[data-col-type=colContent]'))
     for (let index = 0; index < data.length - 1; index++) {
       tdList.forEach(td => {
         var col = document.createElement('col')
         col = td.cloneNode(true)
         colgroup.appendChild(col)
       })
     }
  })

  const trTempList = tableDom.getElementsByTagName('tr')
  const trList = Array.from(trTempList)// JSON.parse(JSON.stringify(trTempList))
  // 行数据
  if (trList.length > 0) {
    trList.forEach(item => {
      const tdList = Array.from(item.querySelectorAll('[data-col-type]')) // 列体数据
      let trInnerHTML = ''
      let tdOutHTML = ''
      let keyList = []

      tdList.forEach(td => {
        const outerHTML = td.outerHTML
        const tdType = td.getAttribute('data-col-type')
        const textValue = outerHTML || ''
        if (tdType == 'colContent' && textValue.indexOf('${') > -1) {
          tdOutHTML = outerHTML
          keyList = getKey(textValue)
        } else {
          tdOutHTML = outerHTML
          trInnerHTML += outerHTML // 表头
        }
      })
      for (let index = 0; index < data.length; index++) {
        const child = data[index]
        if (isShowTureData) {
          keyList.forEach(key => {
            tdOutHTML = replceKeyToValue(key, tdOutHTML, child, isShowTureData)
            trInnerHTML += tdOutHTML
          })
        } else {
          trInnerHTML += tdOutHTML
        }
      }
      item.innerHTML = trInnerHTML
    })
  }
  if (isShowTureData) {
    showCheckbox(tableDom)
  }
  return tableDom.outerHTML
}
/**
 * 交叉表格数据渲染方法
 * tempdata患者数据
 * domId 交叉表domid
 * isShosTrueData 文书模板 真实数据标志
 */
export function showCrossTable(tempData, element, isShowTureData) {
  if (!tempData) return
  const data = transformData(tempData)
  if (!data) return
  const tableModeStr = element.data
  if (!tableModeStr || tableModeStr == undefined) return
  const tableDom = createDocumentFragment(tableModeStr).children[0]
  const trList = Array.from(tableDom.getElementsByTagName('tr'))
  trList.forEach(row => {
    let rowInnerHTML = row?.innerHTML
    const keyList = getKey(rowInnerHTML)
    // const valueObj = {}
    // const testObjStr = ''
    keyList?.forEach(key => {
      let value = ''
      // 这里需要考虑是否有多个值
      if (key.indexOf('/') > -1) { // 多个备用数据显示问题  当 辅助呼吸-频率（WN_ICIS_MONI_10030104）有值时，取该值，当 辅助呼吸-频率（WN_ICIS_MONI_10030104）无值时，取 呼吸（WN_ICIS_MONI_10010207）的值
        const spareKeyList = key.split('/')
        for (var i = 0; i < spareKeyList.length; i++) {
          const item = spareKeyList[i]
          const rowKey = item.split('.')[0] // 每一个行的监护项不同 纵向坐标显示
          const colKey = item.split('.')[1] // 每一列时间点不懂 横向坐标
          const addtchItem = key.split('.')[2] || ''
          var result = findMapValue(data, rowKey, colKey, addtchItem)
          if (result) {
            // 查找数据源给的数据
            value = result
            break
          } else continue
        }
      } else {
        const rowKey = key.split('.')[0]
        const colKey = key.split('.')[1]
        const addtchItem = key.split('.')[2] || ''
        value = findMapValue(data, rowKey, colKey, addtchItem)
      }
      rowInnerHTML = rowInnerHTML.replace('${' + key + '}', value) //  68页数据 4618毫秒结束
      // valueObj[`\${${key}\}`] = value
      //     testObjStr += `\\\${${key}\\\}|`
    })
    // testObjStr = testObjStr.substring(0, testObjStr.lastIndexOf('|'))
    // rowInnerHTML = rowInnerHTML.replace(new RegExp(testObjStr, 'g'), function(matchStr) {
    //     return valueObj[matchStr]
    //     }) // 68页数据 4406毫秒
    row.innerHTML = rowInnerHTML
  })

  if (tableDom) {
    // tableDom.innerHTML = tableInnerHTML
    if (isShowTureData) { // 多选框类型数据显示
      showCheckbox(tableDom)
    }
  }
  return tableDom.outerHTML || ''
}
/**
 * 针对交叉表数据转换 数字转为moniitemCode为key的对象
 * @param {*} tempData
 * @returns
 */
export function transformData(tempData) {
  const data = JSON.parse(JSON.stringify(tempData))
  const tempObj = keyBy(data, 'moniitemCode')
  return tempObj
}
/**
 * 查找数据中对应占位符的值
 * @param {数据集合} dataArr
 * @param {纵向的关键字} rowKey
 * @param {列的关键字} colKey
 * @param {附加项目} addtchItem   附加项目,例如moniitemValue_L
 * @returns
 */
export function findMapValue(dataArr, rowKey, colKey, addtchItem) {
  if (!dataArr || !dataArr[rowKey] || dataArr[rowKey] == undefined) return '&nbsp;&nbsp;'
  if (!dataArr[rowKey].valueList || dataArr[rowKey].valueList.length == 0) return '&nbsp;&nbsp;'
  if (colKey == 'moniitemName') {
    return dataArr[rowKey]?.moniitemName
  } else {
    const result = dataArr[rowKey].valueList.filter(item => item.columnKey == colKey)
    if (result.length > 0) {
      if (addtchItem != '') {
        return zeroToString(result[0][addtchItem])
      } else {
        return result[0]?.moniitemValue
      }
    } else {
      return ''
    }
  }
}
export function zeroToString(number) {
  return number !== null && number != undefined ? number + '' : '&nbsp;&nbsp;'
}
/**
 * 替换组件中的占位符
 * @param {*} key  占位符
 * @param {*} htmlStr  要替换的td html
 * @param {*} data 对应行的数据
 * @param {*} type 是否替换数据
 * @returns 返回替换后的字符串
 */
export function replceKeyToValue(key, htmlStr, data, type) {
  let value = ''
  if (Array.isArray(data)) { // 数组
      for (var j = 0; j < data.length; j++) {
        if (data[j][key] && data[j][key] != '') {
          value = data[j][key]
          break
        }
      }
  } else {
    if (key.indexOf('/') > -1) { // if (key.indexOf('/') > -1) { // 多个备用数据显示问题  当 辅助呼吸-频率（WN_ICIS_MONI_10030104）有值时，取该值，当 辅助呼吸-频率（WN_ICIS_MONI_10030104）无值时，取 呼吸（WN_ICIS_MONI_10010207）的值
      const spareKeyList = key.split('/')
      for (var i = 0; i < spareKeyList.length; i++) {
        const item = spareKeyList[i]
        if (item.indexOf('.') > -1) {
            if (data[item.split('.')[0]] && data[item.split('.')[0]][item.split('.')[1]]) {
              value = data[item.split('.')[0]][item.split('.')[1]]
              if (typeof value == 'string') {
                value = value.replaceAll('  ', '&nbsp;')
              }
              break
            } else continue
        } else if (data[item]) {
          value = data[item]
          if (item.indexOf('.') > -1) {
            value = data[item.split('.')[0]][item.split('.')[1]]
          }
          if (typeof value == 'string') {
            value = value.replaceAll('  ', '&nbsp;')
          }
          break
        } else continue
      }
    } else {
      if (key.indexOf('.') > -1) {
        value = data[key.split('.')[0]] ? data[key.split('.')[0]][key.split('.')[1]] : '&nbsp;&nbsp;&nbsp;&nbsp;'
      } else {
        if (data[key] && typeof data[key] == 'string' && data[key].indexOf('[') > -1 && data[key].indexOf(']') > -1) {
          try {
            data[key] = JSON.parse(data[key]).toString()
          } catch (e) { console.log('not json string') }
        }
        value = data[key] ?? ''
      }
    }
  }
  if (typeof value == 'string') {
    value = value.replaceAll('  ', '&nbsp;')
  }
  if (type) {
    htmlStr = htmlStr.replace(new RegExp('\\$\\{' + key + '\\}', 'g'), zeroToString(value))
  }
  return htmlStr
}
// 创建Fragment
export function createDocumentFragment(txt) {
  const frag = document.createRange().createContextualFragment(txt)
  return frag
}

/* eslint-disable */
require('script-loader!file-saver');
// import XLSX from 'xlsx'
import XLSX from 'xlsx-style'
import { fileSave } from 'browser-fs-access'
function generateArray(table) {
  var out = [];
  var rows = table.querySelectorAll('tr');
  var ranges = [];
  for (var R = 0; R < rows.length; ++R) {
    var outRow = [];
    var row = rows[R];
    var columns = row.querySelectorAll('td');
    for (var C = 0; C < columns.length; ++C) {
      var cell = columns[C];
      var colspan = cell.getAttribute('colspan');
      var rowspan = cell.getAttribute('rowspan');
      var cellValue = cell.innerText;
      if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

      //Skip ranges
      ranges.forEach(function (range) {
        if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
          for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
        }
      });

      //Handle Row Span
      if (rowspan || colspan) {
        rowspan = rowspan || 1;
        colspan = colspan || 1;
        ranges.push({
          s: {
            r: R,
            c: outRow.length
          },
          e: {
            r: R + rowspan - 1,
            c: outRow.length + colspan - 1
          }
        });
      };

      //Handle Value
      outRow.push(cellValue !== "" ? cellValue : null);

      //Handle Colspan
      if (colspan)
        for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
    }
    out.push(outRow);
  }
  return [out, ranges];
};

function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, filename, secondfilename) {
  var ws = {};
  var range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  };
  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      var cell = {
        v: data[R][C]
      };
      if (cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: secondfilename ? R + 2 : filename ? R + 1 : R //第一行留给标题
      });

      if (typeof cell.v === 'number') cell.t = 'n';
      else if (typeof cell.v === 'boolean') cell.t = 'b';
      else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else cell.t = 's';

      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

export function export_table_to_excel(id) {
  var theTable = document.getElementById(id);
  var oo = generateArray(theTable);
  var ranges = oo[1];

  /* original data */
  var data = oo[0];
  var ws_name = "SheetJS";

  var wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data);

  /* add ranges to worksheet */
  // ws['!cols'] = ['apple', 'banan'];
  ws['!merges'] = ranges;

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  var wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  });

  saveAs(new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }), "test.xlsx")
}

export function export_json_to_excel({
  header,
  data,
  multiHeader,
  filename = '',
  autoWidth = true,
  bookType = 'xlsx',
  secondfilename,
  merges,
  exportfilename
} = {}) {
  /* original data */
  data = [...data]
  if (multiHeader?.length) {
    multiHeader.reverse().forEach(item => {
      data.unshift(item);
    })
  } else {
    data.unshift(header);
  }
  if (filename) {
    data.push([{}])
  }
  if (secondfilename) {
    data.push([{}])
  }

  var ws_name = "SheetJS";
  var wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data,filename, secondfilename);
  Object.keys(ws).forEach((key) => {//这里遍历单元格给单元格对象设置属性,s为控制样式的属性
    if (key.indexOf('!') < 0) {
      ws[key].s = {
        alignment: {//对齐方式
          horizontal: 'center',//水平居中
          vertical: 'center',//竖直居中
          wrapText: true,//自动换行
        },
      }
    }
  })
  if (autoWidth) {
    /*设置worksheet每列的最大宽度*/
    const colWidth = data.map(row => row.map(val => {
      /*先判断是否为null/undefined*/
      if (val == null) {
        return {
          'wch': 10
        };
      }
      /*再判断是否为中文*/
      else if (val.toString().charCodeAt(0) > 255) {
        return {
          'wch': val.toString().length * 2
        };
      } else {
        return {
          'wch': val.toString().length + 2
        };
      }
    }))
    if (secondfilename) {
      ws["A1"] = { t: "s", v: filename };				//添加表格头信息
      ws["A1"].s = {									//为某个单元格设置单独样式
        font: {
          // name: '宋体',
          sz: 24,
          bold: true,
          // color: { rgb: "FFFFAA00" }
        },
        alignment: { horizontal: "center", vertical: "center", wrap_text: true },
        // fill: { bgcolor: { rgb: 'ffff00' } }
      }
      ws["A2"] = { t: "s", v: secondfilename };				//添加表格头信息
      ws["A2"].s = {									//为某个单元格设置单独样式
        font: {
          // name: '宋体',
          sz: 16,
          bold: true,
          // color: { rgb: "FFFFAA00" }
        },
        alignment: { horizontal: "right", vertical: "right", wrap_text: true },
        // fill: { bgcolor: { rgb: 'ffff00' } }
      }
      ws['!merges'] = [
        { // 合并标题行单元格
          s: { // s开始
            c: 0, // 开始列
            r: 0  // 开始取值范围
          },
          e: { // e结束
            c: header.length - 1, // 结束列
            r: 0   // 结束范围
          }
        },
        { // 合并标题行单元格
          s: { // s开始
            c: 0, // 开始列
            r: 1  // 开始取值范围
          },
          e: { // e结束
            c: header.length - 1, // 结束列
            r: 1   // 结束范围
          }
        }
      ]
    } else {
      if (filename) {
        ws["A1"] = { t: "s", v: filename };				//添加表格头信息
        ws["A1"].s = {									//为某个单元格设置单独样式
          font: {
            // name: '宋体',
            sz: 18,
            bold: true,
            // color: { rgb: "FFFFAA00" }
          },
          alignment: { horizontal: "center", vertical: "center", wrap_text: true },
          // fill: { bgcolor: { rgb: 'ffff00' } }
        }
        ws['!merges'] = [{ // 合并标题行单元格
          s: { // s开始
            c: 0, // 开始列
            r: 0  // 开始取值范围
          },
          e: { // e结束
            c: header.length - 1, // 结束列
            r: 0   // 结束范围
          }
        }]
      }
    }
    // 以第一行的每列宽度作为初始值，计算每列的最大宽度
    let result = colWidth[0];
    for (let i = 0; i < colWidth.length; i++) {
      for (let j = 1; j < colWidth[i].length; j++) {
        if (result[j] && colWidth[i][j] && result[j]['wch'] < colWidth[i][j]['wch']) {
          result[j]['wch'] = colWidth[i][j]['wch'];
        }
      }
    }
    ws['!cols'] = result;
  }
  if (merges?.length) {
    merges.forEach(item => {
      ws['!merges'].push(XLSX.utils.decode_range(item))
    })
  }
  exportfilename = exportfilename || filename || 'excel-list'
  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  var wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: 'binary'
  });

  saveAs(new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }), `${exportfilename}.${bookType}`);
}

export function export_json_to_blob({
  header,
  data,
  multiHeader,
  filename = '',
  autoWidth = true,
  bookType = 'xlsx',
  secondfilename,
  merges,
  exportfilename
} = {},ws_name) {
  /* original data */
  data = [...data]
  if (multiHeader?.length) {
    multiHeader.reverse().forEach(item => {
      data.unshift(item);
    })
  } else {
    data.unshift(header);
  }
  if (filename) {
    data.push([{}])
  }
  if (secondfilename) {
    data.push([{}])
  }

  var ws_name = ws_name || "SheetJS";
  var wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data,filename, secondfilename);
  Object.keys(ws).forEach((key) => {//这里遍历单元格给单元格对象设置属性,s为控制样式的属性
    if (key.indexOf('!') < 0) {
      ws[key].s = {
        alignment: {//对齐方式
          horizontal: 'center',//水平居中
          vertical: 'center',//竖直居中
          wrapText: true,//自动换行
        },
      }
    }
  })
  if (autoWidth) {
    /*设置worksheet每列的最大宽度*/
    const colWidth = data.map(row => row.map(val => {
      /*先判断是否为null/undefined*/
      if (val == null) {
        return {
          'wch': 10
        };
      }
      /*再判断是否为中文*/
      else if (val.toString().charCodeAt(0) > 255) {
        return {
          'wch': val.toString().length * 2
        };
      } else {
        return {
          'wch': val.toString().length + 2
        };
      }
    }))
    if (secondfilename) {
      ws["A1"] = { t: "s", v: filename };				//添加表格头信息
      ws["A1"].s = {									//为某个单元格设置单独样式
        font: {
          // name: '宋体',
          sz: 24,
          bold: true,
          // color: { rgb: "FFFFAA00" }
        },
        alignment: { horizontal: "center", vertical: "center", wrap_text: true },
        // fill: { bgcolor: { rgb: 'ffff00' } }
      }
      ws["A2"] = { t: "s", v: secondfilename };				//添加表格头信息
      ws["A2"].s = {									//为某个单元格设置单独样式
        font: {
          // name: '宋体',
          sz: 16,
          bold: true,
          // color: { rgb: "FFFFAA00" }
        },
        alignment: { horizontal: "right", vertical: "right", wrap_text: true },
        // fill: { bgcolor: { rgb: 'ffff00' } }
      }
      ws['!merges'] = [
        { // 合并标题行单元格
          s: { // s开始
            c: 0, // 开始列
            r: 0  // 开始取值范围
          },
          e: { // e结束
            c: header.length - 1, // 结束列
            r: 0   // 结束范围
          }
        },
        { // 合并标题行单元格
          s: { // s开始
            c: 0, // 开始列
            r: 1  // 开始取值范围
          },
          e: { // e结束
            c: header.length - 1, // 结束列
            r: 1   // 结束范围
          }
        }
      ]
    } else {
      if (filename) {
        ws["A1"] = { t: "s", v: filename };				//添加表格头信息
        ws["A1"].s = {									//为某个单元格设置单独样式
          font: {
            // name: '宋体',
            sz: 18,
            bold: true,
            // color: { rgb: "FFFFAA00" }
          },
          alignment: { horizontal: "center", vertical: "center", wrap_text: true },
          // fill: { bgcolor: { rgb: 'ffff00' } }
        }
        ws['!merges'] = [{ // 合并标题行单元格
          s: { // s开始
            c: 0, // 开始列
            r: 0  // 开始取值范围
          },
          e: { // e结束
            c: header.length - 1, // 结束列
            r: 0   // 结束范围
          }
        }]
      }
    }
    // 以第一行的每列宽度作为初始值，计算每列的最大宽度
    let result = colWidth[0];
    for (let i = 0; i < colWidth.length; i++) {
      for (let j = 1; j < colWidth[i].length; j++) {
        if (result[j] && colWidth[i][j] && result[j]['wch'] < colWidth[i][j]['wch']) {
          result[j]['wch'] = colWidth[i][j]['wch'];
        }
      }
    }
    ws['!cols'] = result;
  }
  if (merges?.length) {
    merges.forEach(item => {
      ws['!merges'].push(XLSX.utils.decode_range(item))
    })
  }
  exportfilename = exportfilename || filename || 'excel-list'
  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  var wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: 'binary'
  });
  fileSave(new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }), {
    fileName:  filename+'.xlsx',
    extensions: ['.xlsx']
  })
}

export function export_jsonArr_to_excel(arr,filename) {
  /* original data */
  var wb = new Workbook()
  arr.forEach(item => {
    const data = [...item.data]
    if (item.multiHeader?.length) {
      multiHeader.reverse().forEach(item => {
        data.unshift(item);
      })
    } else {
      data.unshift(item.header);
    }
    if (item.filename) {
      data.push([{}])
    }
    if (item.secondfilename) {
      data.push([{}])
    }

    var ws_name = item.filename;
    
    var ws = sheet_from_array_of_arrays(data,item.filename, item.secondfilename);
    Object.keys(ws).forEach((key) => {//这里遍历单元格给单元格对象设置属性,s为控制样式的属性
      if (key.indexOf('!') < 0) {
        ws[key].s = {
          alignment: {//对齐方式
            horizontal: 'center',//水平居中
            vertical: 'center',//竖直居中
            wrapText: true,//自动换行
          },
        }
      }
    })
    if (item.autoWidth) {
      /*设置worksheet每列的最大宽度*/
      const colWidth = data.map(row => row.map(val => {
        /*先判断是否为null/undefined*/
        if (val == null) {
          return {
            'wch': 10
          };
        }
        /*再判断是否为中文*/
        else if (val.toString().charCodeAt(0) > 255) {
          return {
            'wch': val.toString().length * 2
          };
        } else {
          return {
            'wch': val.toString().length + 2
          };
        }
      }))
      if (item.secondfilename) {
        ws["A1"] = { t: "s", v: filename };				//添加表格头信息
        ws["A1"].s = {									//为某个单元格设置单独样式
          font: {
            // name: '宋体',
            sz: 24,
            bold: true,
            // color: { rgb: "FFFFAA00" }
          },
          alignment: { horizontal: "center", vertical: "center", wrap_text: true },
          // fill: { bgcolor: { rgb: 'ffff00' } }
        }
        ws["A2"] = { t: "s", v: secondfilename };				//添加表格头信息
        ws["A2"].s = {									//为某个单元格设置单独样式
          font: {
            // name: '宋体',
            sz: 16,
            bold: true,
            // color: { rgb: "FFFFAA00" }
          },
          alignment: { horizontal: "right", vertical: "right", wrap_text: true },
          // fill: { bgcolor: { rgb: 'ffff00' } }
        }
        ws['!merges'] = [
          { // 合并标题行单元格
            s: { // s开始
              c: 0, // 开始列
              r: 0  // 开始取值范围
            },
            e: { // e结束
              c: item.header.length - 1, // 结束列
              r: 0   // 结束范围
            }
          },
          { // 合并标题行单元格
            s: { // s开始
              c: 0, // 开始列
              r: 1  // 开始取值范围
            },
            e: { // e结束
              c: item.header.length - 1, // 结束列
              r: 1   // 结束范围
            }
          }
        ]
      } else {
        if (item.filename) {
          ws["A1"] = { t: "s", v: item.filename };				//添加表格头信息
          ws["A1"].s = {									//为某个单元格设置单独样式
            font: {
              // name: '宋体',
              sz: 18,
              bold: true,
              // color: { rgb: "FFFFAA00" }
            },
            alignment: { horizontal: "center", vertical: "center", wrap_text: true },
            // fill: { bgcolor: { rgb: 'ffff00' } }
          }
          ws['!merges'] = [{ // 合并标题行单元格
            s: { // s开始
              c: 0, // 开始列
              r: 0  // 开始取值范围
            },
            e: { // e结束
              c: item.header.length - 1, // 结束列
              r: 0   // 结束范围
            }
          }]
        }
      }
      // 以第一行的每列宽度作为初始值，计算每列的最大宽度
      let result = [];
      colWidth[0].forEach((col, colIndex) => {  //取出每列的最大宽度
        var maxValue = Math.max(...colWidth.map(item => item[colIndex]?.wch||0))
        result.push({wch:maxValue})
      })
      ws['!cols'] = result;
    }
    if (item.merges?.length) {
      item.merges.forEach(item => {
        ws['!merges'].push(XLSX.utils.decode_range(item))
      })
    } 
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
  })
  
  /* add worksheet to workbook */
  var wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  });
  // exportfilename = exportfilename || filename || 'excel-list'
  saveAs(new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }), `${filename}.xlsx`);
}
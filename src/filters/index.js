
import dayjs from 'dayjs'
import tempTypes from '@/utils/tempType'
import store from '@/store'
function pluralize(time, label) {
    if (time === 1) {
        return time + label
    }
    return time + label + 's'
}

export function timeAgo(time) {
    const between = Date.now() / 1000 - Number(time)
    if (between < 3600) {
        return pluralize(~~(between / 60), ' minute')
    } else if (between < 86400) {
        return pluralize(~~(between / 3600), ' hour')
    } else {
        return pluralize(~~(between / 86400), ' day')
    }
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
    const si = [
        {
            value: 1e18,
            symbol: 'E'
        },
        {
            value: 1e15,
            symbol: 'P'
        },
        {
            value: 1e12,
            symbol: 'T'
        },
        {
            value: 1e9,
            symbol: 'G'
        },
        {
            value: 1e6,
            symbol: 'M'
        },
        {
            value: 1e3,
            symbol: 'k'
        }
    ]
    for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (
                (num / si[i].value + 0.1)
                    .toFixed(digits)
                    .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
            )
        }
    }
    return num.toString()
}

export function toThousandslsFilter(num) {
    return (+num || 0)
        .toString()
        .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function feeDisplay(val, fixedNum = 2) {
    if (!val) {
        return '0.00'
    }
    return Math.round(val * (10 ** fixedNum)) / (10 ** fixedNum)
}

/*
全局过滤器日期格式化
使用示例： date|dateFormat('YYYY-MM-DD HH:mm:ss')
*/
export function dateFormat(time, format) {
    if (time) {
        return dayjs(time).format(format)
    }
    return ''
}
/*
患者标签，急、择、日等-----样式
*/
export function patientTagType(val) {
    if (typeof val === 'undefined') {
        return ''
    }
    val = val.toString()
    switch (val) {
        case '0':
            return ''
        case '1':
            return 'danger'
        case '3':
            return 'success'
        case '-1':
            return 'info'
        default:
            return ''
    }
}
/*
患者标签，急、择、日等-----文字
*/
export function patientTag(val, list, defaultVal = '') {
    if (typeof val === 'undefined') {
        return defaultVal
    }
    if (list && list.length > 0) {
        return list.filter(v => v.codeValue == val).length === 1 ? list.filter(v => v.codeValue == val)[0].codeName : defaultVal
    } else {
        // val = val.toString()
        // switch (val) {
        //   case '0':
        //     return '择'
        //   case '1':
        //     return '急'
        //   case '3':
        //     return '日'
        //   default:
        //     return val
        // }
    }
}
/*
性别图标
*/
export function sexIcon(val) {
    const currentUserWard = store.getters.currentUserWard
    if (currentUserWard?.wardIdentification != '2') {
        switch (val) {
            case '男':
                return 'portraitMale'
            case '女':
                return 'portraitGirl'
            default:
                return 'portraitNo'
        }
    } else {
        switch (val) {
            case '男':
                return 'boy'
            case '女':
                return 'girl'
            default:
                return 'portraitNo'
        }
    }
}
/*
返回字典值 codeName 或指定类型 返回name 或者别的
*/
export function showDictNameFilter(val, list, type, defaultVal = '', code = 'dictCode', name = 'dictName') {
    // space 给一串空格
    if ((!val && val !== 0) || !list) {
        return defaultVal
    }
    let result = ''
    let item = ''
    switch (type) {
        case 'dictCodeList_to_dictName': // 单字典
            if (!Array.isArray(val)) {
                if (val === '' || val === null || val === undefined) {
                    result = ''
                    break
                } else {
                    val = val.split(',')
                }
            }
            val = val.map(v => {
                const item = list.filter(vv => vv.dictCode == v)
                return item.length ? item[0].dictName : defaultVal
            })
            result = val.join(',')
            break
        case 'dictCode_to_dictName': // 单字典
            item = list.filter(v => {
                return v.dictCode == val
            })
            result = item.length > 0 ? item[0].dictName : defaultVal
            break
        case 'deptCode_to_deptName': // 科室
            item = list.filter(v => {
                return v.deptCode == val
            })
            result = item.length > 0 ? item[0].deptName : defaultVal
            break
        case 'moniitemCode_to_moniitemName': // 单个监护项
            item = list.filter(v => {
                return v.moniitemCode == val
            })
            result = item.length > 0 ? item[0].moniitemName : defaultVal
            break
        case 'pipeline': // 管路请情况
            val = val.split(',')
            val = val.map(v => {
                const item = list.filter(vv => vv.codeValue == v)
                return item.length ? item[0].codeName : ''
            })
            result = val.join(',')
            break
        case 'list_to_codename': // 穿刺部位
            try {
                val = JSON.parse(val)
                val = val.map(v => {
                    const item = list.filter(vv => vv.codeValue == v)
                    return item.length ? item[0].codeName : defaultVal
                })
                result = val.join(',')
            } catch (error) {
                item = list.filter(v => {
                    return v.codeValue == val
                })
                result = item.length > 0 ? item[0].codeName : defaultVal
            }
            break
        case 'id_to_name': // 镇痛方式
            item = list.filter(v => {
                return v.id == val
            })
            result = item.length > 0 ? item[0].name : defaultVal
            break
        case 'eventid_to_name': // 出量
            item = list.filter(v => {
                return v.eventId == val
            })
            result = item.length > 0 ? item[0].name : defaultVal
            break
        case 'medTakeWayId_to_name': // 途径
            item = list.filter(v => {
                return v.medTakeWayId == val
            })
            result = item.length > 0 ? item[0].name : defaultVal
            break
        case 'drugFrequencyId_to_drugFrequencyName': // 频次
            item = list.filter(v => {
                return v.drugFrequencyId == val
            })
            result = item.length > 0 ? item[0].drugFrequencyName : defaultVal
            break
        case 'userName_to_name': // 护士转护士名字
            item = list.filter(v => {
                return v.userName == val
            })
            result = item.length > 0 ? item[0].name : defaultVal
            break
        case 'dept': // 科室
            item = list.filter(v => {
                return v.deptId == val
            })
            result = item.length > 0 ? item[0].name : defaultVal
            break
        case 'list_code_to_name':
            val = val.map(v => {
                const item = list.filter(vv => vv[code] == v)
                return item.length ? item[0][name] : defaultVal
            })
            result = val.join(',')
            break
        case 'code_to_name':
            item = list.filter(vv => vv[code] == val)
            result = item.length ? item[0][name] : defaultVal
            break
        default:
            item = list.filter(v => {
                return v.codeValue == val
            })
            result = item.length > 0 ? item[0].codeName : defaultVal
            break
    }
    return result || defaultVal
}

export function showTempName(type, key = 'simple') {
    return tempTypes[type] ? tempTypes[type][key] || '整' : '整'
}

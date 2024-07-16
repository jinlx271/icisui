import { deepCopy, swap } from '@/utils/utils'
import toast from '@/utils/toast'
import generateID from '@/utils/generateID'
import dayjs from 'dayjs'
// import componentsList from './componentsList'
const store = {
    state: {
        editMode: 'edit', // 编辑器模式 edit read
        selectShape: false,
        canvasStyleData: { // 页面全局数据
            width: 932,
            model: 'design',
            height: 1363,
            scale: 1,
            labelColor: '#000000',
            valueColor: '#000000'
        },
        componentData: [],
        curComponent: null,
        multiple: false,
        curComponentList: [],
        curComponentIndex: null,
        snapshotData: [], // 编辑器快照数据
        snapshotIndex: -1, // 快照索引
        menuTop: 0, // 右击菜单数据
        menuLeft: 0,
        menuShow: false,
        tempType: 1,
        tempName: '', // 摸板名称
        copyData: null, // 复制粘贴剪切
        selectData: null // 显示右键时选中的数据
    },
    mutations: {
        setMultiple(state, multiple) {
            state.multiple = multiple
        },
        setTempType(state, type) {
            state.tempType = type
        },
        setTempName(state, name) {
            state.tempName = name
        },
        async copy(state) {
            state.copyData = {
                data: deepCopy(state.curComponent),
                index: state.curComponentIndex
            }
            if (state.curComponentList.length > 0) { // 多选了几个组件
                state.copyData = { // 无法解决跨窗口复制黏贴
                    data: deepCopy(state.curComponent),
                    index: state.curComponentIndex,
                    dataList: deepCopy(state.curComponentList)
                }
            }
            if (window.isSecureContext) {
                await navigator.clipboard.writeText(JSON.stringify(state.copyData)) // 该方式只适合安全域名https   编译后http网址不适用
            } /* else {
                // sessionStorage.setItem('clipboardyTemp', JSON.stringify(state.copyData)) // 无法解决跨窗口复制黏贴
                const textArea = document.createElement('textarea')
                textArea.value = JSON.stringify(state.copyData)
                document.body.appendChild(textArea)
                textArea.focus()
                textArea.select()
                return new Promise((res, rej) => {
                    // 执行复制命令并移除文本框
                    document.execCommand('copy') ? res() : rej()
                    textArea.remove()
                })
            }*/
        },
        async paste(state, isMouse) {
            if (window.isSecureContext) {
                const clipboardTxt = await navigator.clipboard.readText() // 该方式只适合安全域名 https
                pasteInfo(state, clipboardTxt)
            } else {
                pasteInfo(state, '')
            }
            function pasteInfo(state, clipboardTxt) {
                if (clipboardTxt != '' && clipboardTxt.indexOf('{') > -1 && window.isSecureContext) {
                    const copyData = JSON.parse(clipboardTxt)
                    state.copyData = copyData
                }

                if (!state.copyData) {
                    toast('请选择组件')
                    return
                }
                if (state.copyData.dataList && state.copyData.dataList.length > 0) {
                    const minLeft = Math.min(...state.copyData.dataList.map(item => item.style.left || 0))
                    const minTop = Math.min(...state.copyData.dataList.map(item => item.style.top || 0))
                    var dataList = JSON.parse(JSON.stringify(state.copyData.dataList))
                    dataList.forEach(item => {
                        const data = Object.assign({}, item)
                        if (isMouse) {
                            data.style.top = state.menuTop + data.style.top - minTop
                            data.style.left = data.style.left - minLeft + state.menuLeft
                        } else {
                            data.style.top += 10
                            data.style.left += 10
                        }
                        data.id = generateID() + '_' + dayjs().valueOf()
                        state.componentData.push(data)
                    })
                } else {
                    const data = state.copyData.data
                    if (isMouse) {
                        data.style.top = state.menuTop
                        data.style.left = state.menuLeft
                    } else {
                        data.style.top += 10
                        data.style.left += 10
                    }

                    data.id = generateID() + '_' + dayjs().valueOf()
                    state.componentData.push(data)
                }

                // 添加新的快照
                state.snapshotData[++state.snapshotIndex] = deepCopy(state.componentData)
                // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
                if (state.snapshotIndex < state.snapshotData.length - 1) {
                    state.snapshotData = state.snapshotData.slice(0, state.snapshotIndex + 1)
                }
                // state.copyData = null
            }
        },
        async cut(state) {
            if (!state.curComponent) {
                toast('请选择组件')
                return
            }

            if (state.copyData) {
                state.componentData.splice(state.copyData.index, 0, state.copyData.data)
                if (state.curComponentIndex >= state.copyData.index) {
                    // 如果当前组件索引大于等于插入索引，需要加一，因为当前组件往后移了一位
                    state.curComponentIndex++
                }
            }

            state.copyData = {
                data: deepCopy(state.curComponent),
                index: state.curComponentIndex
            }

            if (state.curComponentList.length > 0) { // 多选了几个组件
                state.copyData.dataList = deepCopy(state.curComponentList)

                state.curComponentList.forEach(item => {
                    state.componentData.forEach((v, vIndex) => {
                        if (v == item) {
                            state.componentData.splice(vIndex, 1)
                        }
                    })
                })
                if (window.isSecureContext) {
                    await navigator.clipboard.writeText(JSON.stringify(state.copyData)) // 该方式只适合安全域名https   编译后http网址不适用
                }
            } else {
                state.componentData.splice(state.curComponentIndex, 1)
                if (window.isSecureContext) {
                    await navigator.clipboard.writeText(JSON.stringify(state.copyData)) // 该方式只适合安全域名https   编译后http网址不适用
                }
            }
        },

        setEditMode(state, mode) {
 ''
            state.editMode = mode
        },
        setSelectShape(state, mode) {
            state.selectShape = mode
        },
        setCanvasStyle(state, style) {
            state.canvasStyleData = Object.assign({}, state.canvasStyleData, style)
            document.querySelector('#app').style.setProperty('--label-color', state.canvasStyleData?.labelColor || '#000000')
            document.querySelector('#app').style.setProperty('--value-color', state.canvasStyleData?.valueColor || '#000000')
            document.querySelector('#printContent')?.style.setProperty('--label-color', state.canvasStyleData?.labelColor || '#000000')
            document.querySelector('#printContent')?.style.setProperty('--value-color', state.canvasStyleData?.valueColor || '#000000')
        },
        changeModel(state, model) {
            state.componentData = state.componentData.map(v => {
                v.model = model
                return v
            })
        },
        addComponent(state, { component, index }) {
            if (index !== undefined) {
                state.componentData.splice(index, 0, component)
            } else {
                state.componentData.push(component)
            }
        },
        setAllComponet(state) {
            console.log('state.componentData', state.componentData.length)
            state.curComponentList = state.componentData
        },
        setCurComponent(state, { component, index }) {
            if (state.multiple) {
                if (state.curComponentList.indexOf(state.curComponent) < 0 && state.curComponent) {
                    state.curComponentList.push(state.curComponent)
                }

                if (component && state.curComponentList.indexOf(component) < 0) {
                    state.curComponentList.push(component)
                    state.curComponent = component
                } else {
                    state.curComponentList = state.curComponentList.filter(function (v) {
                        return v != component
                    })
                    state.curComponent = state.curComponentList.length >= 1 ? state.curComponentList[state.curComponentList.length - 1] : null
                }
            } else {
                if (state.curComponentList.indexOf(component) < 0) {
                    state.curComponentList = []
                    state.curComponent = component
                }
            }
            state.curComponentIndex = index
        },
        setShapeStyle({ curComponent }, { top, left, width, height, rotate }) {
            if (top) curComponent.style.top = top
            if (left) curComponent.style.left = left
            if (width) curComponent.style.width = width
            if (height) curComponent.style.height = height
            if (rotate) curComponent.style.rotate = rotate
        },
        setShapePosStyle({ curComponent }, { key, value }) {
            curComponent.style[key] = value
        },

        undo(state) { // 撤消
            if (state.snapshotIndex > 0) {
                state.snapshotIndex--
                state.componentData = deepCopy(state.snapshotData[state.snapshotIndex])
            }
        },

        redo(state) {
            if (state.snapshotIndex < state.snapshotData.length - 1) {
                state.snapshotIndex++
                state.componentData = deepCopy(state.snapshotData[state.snapshotIndex])
            }
        },

        setComponentData(state, componentData = []) {
            state.componentData = componentData
        },

        recordSnapshot(state) {
            // 添加新的快照
            state.snapshotData[++state.snapshotIndex] = deepCopy(state.componentData)
            // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
            if (state.snapshotIndex < state.snapshotData.length - 1) {
                state.snapshotData = state.snapshotData.slice(0, state.snapshotIndex + 1)
            }
        },
        /**
         * 清空快照
         */
        clearSnapshot(state) {
            state.snapshotIndex = -1
            state.snapshotData = []
        },
        showContexeMenu(state, { top, left }) {
            state.selectData = deepCopy(state.curComponentList)
            state.menuShow = true
            state.menuTop = top
            state.menuLeft = left
        },

        hideContexeMenu(state) {
            state.menuShow = false
        },

        deleteComponent(state, index = state.curComponentIndex) {
            if (state.curComponentList.length > 0) { // 多选情况下删掉对应的数据
                const ids = state.curComponentList.map(item => item.id)
                state.componentData = state.componentData.filter(item => !ids.includes(item.id))
            } else {
                state.componentData.splice(index, 1)
            }
        },

        upComponent(state) {
            // 上移图层 index，表示元素在数组中越往后
            if (state.curComponentList.length > 0) {
                const indexList = []
                state.curComponentList.forEach(item => {
                    state.componentData.forEach((v, vIndex) => {
                        if (v == item) {
                            indexList.push(vIndex)
                        }
                    })
                })
                indexList.sort(function(a, b) {
                    if (a > b) {
                        return 1// 同时修改为-1修改后为大到小排序
                    } else if (a == b) {
                        return 0
                    } else {
                        return -1// 同时改为1修改后为大到小排序
                    }
                })

                for (let i = indexList.length - 1; i > 0; i--) {
                    if (indexList[i] < state.componentData.length - 1) {
                        swap(state.componentData, indexList[i], indexList[i] + 1)
                    } else {
                        toast('组件“' + state.componentData[indexList[i]].component + '”已经到顶了')
                    }
                }
            } else {
                if (state.curComponentIndex < state.componentData.length - 1) {
                    swap(state.componentData, state.curComponentIndex, state.curComponentIndex + 1)
                } else {
                    toast('组件“' + state.curComponentData.component + '”已经到顶了')
                }
            }
        },

        downComponent(state) {
            if (state.curComponentList.length > 0) {
                const indexList = []
                state.curComponentList.forEach(item => {
                    state.componentData.forEach((v, vIndex) => {
                        if (v == item) {
                            indexList.push(vIndex)
                        }
                    })
                })
               indexList.sort(function(a, b) {
                    if (a > b) {
                        return 1// 同时修改为-1修改后为大到小排序
                    } else if (a == b) {
                        return 0
                    } else {
                        return -1// 同时改为1修改后为大到小排序
                    }
                })
                for (let i = 0; i < indexList.length - 1; i++) {
                    if (indexList[i] > 0) {
                        swap(state.componentData, indexList[i], indexList[i] - 1)
                    } else {
                        toast('组件“' + state.componentData[indexList[i]].label + '”已经到底了')
                    }
                }
            } else {
                // 下移图层 index，表示元素在数组中越往前
                if (state.curComponentIndex > 0) {
                    swap(state.componentData, state.curComponentIndex, state.curComponentIndex - 1)
                } else {
                    toast('组件“' + state.curComponent.label + '”已经到底了')
                }
            }
        },

        topComponent(state) {
            // 置顶
            if (state.curComponentList.length > 0) {
                state.curComponentList.forEach(item => {
                    state.componentData.forEach((v, vIndex) => {
                        if (v == item) {
                            if (vIndex > 0) {
                                state.componentData.splice(vIndex, 1)
                                state.componentData.push(v)
                            } else {
                                toast('组件“' + v.label + '”已经到顶了')
                            }
                        }
                    })
                })
            } else {
                if (state.curComponentIndex < state.componentData.length - 1) {
                    swap(state.componentData, state.curComponentIndex, state.componentData.length - 1)
                } else {
                    toast('组件“' + state.curComponent.label + '”已经到顶了')
                }
            }
        },

        bottomComponent(state) {
            if (state.curComponentList.length > 0) {
                state.curComponentList.forEach(item => {
                    state.componentData.forEach((v, vIndex) => {
                        if (v == item) {
                            if (vIndex > 0) {
                                state.componentData.splice(vIndex, 1)
                                state.componentData.unshift(v)
                            } else {
                                toast('组件“' + v.label + '”已经到底了')
                            }
                        }
                    })
                })
            } else {
                // 置底
                if (state.curComponentIndex > 0) {
                    swap(state.componentData, state.curComponentIndex, 0)
                } else {
                    toast('组件“' + state.curComponent.label + '”已经到底了')
                }
            }
        },

        addAnimation({ curComponent }, animation) {
            curComponent.animations.push(animation)
        },

        removeAnimation({ curComponent }, index) {
            curComponent.animations.splice(index, 1)
        },

        addEvent({ curComponent }, { event, param }) {
            curComponent.events[event] = param
        },

        removeEvent({ curComponent }, event) {
            delete curComponent.events[event]
        }
    }
}

export default store

/* eslint-disable */
/**
 * 工具栏返回按钮
 */
(function () {
    'use strict'
    var global = tinymce.util.Tools.resolve('tinymce.PluginManager')
    var back = function (editor) {
        editor.execCallback('back_callback', editor)
        return
    }
    var register = function (editor) {
        editor.addCommand('mceBack', function () {
            back(editor)
        })
    }
    var register$1 = function (editor) {
        editor.ui.registry.addButton('back', {
            icon: 'back',
            tooltip: '返回列表',
            disabled: false,
            onAction: function () {
                return editor.execCommand('mceBack')
            }
        })
    }
    function Plugin() {
        global.add('back', function (editor) {
            register$1(editor)
            register(editor)
        })
    }
    Plugin()
}())

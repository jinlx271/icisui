/* eslint-disable */
/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.8.2 (2021-06-23)
 */
(function () {
    'use strict'
    var global = tinymce.util.Tools.resolve('tinymce.PluginManager')
    var saveas = function (editor) {
        editor.execCallback('saveas_callback', editor)
        return
    }
    var register = function (editor) {
        editor.addCommand('saveAs', function () {
            saveas(editor)
        })
    }
    var register$1 = function (editor) {
        editor.ui.registry.addButton('saveas', {
            icon: 'saveas',
            tooltip: '另存为',
            disabled: false,
            onAction: function () {
                return editor.execCommand('saveAs')
            }
        })
    }
    function Plugin() {
        global.add('saveas', function (editor) {
            register$1(editor)
            register(editor)
        })
    }
    Plugin()
}())

/* eslint-disable */
/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.8.2 (2021-06-23)
 */
;(function () {
  'use strict'
  var global = tinymce.util.Tools.resolve('tinymce.PluginManager')
  var sup = function (editor) {
    editor.execCallback('sup_callback', editor)
    return
  }
  var register = function (editor) {
    editor.addCommand('supData', function () {
      sup(editor)
    })
  }
  var register$1 = function (editor) {
    editor.ui.registry.addButton('sup', {
      text: '²',
      tooltip: '²',
      disabled: false,
      onAction: function () {
        return editor.execCommand('supData')
      }
    })
  }
  function Plugin() {
    global.add('sup', function (editor) {
      register$1(editor)
      register(editor)
    })
  }
  Plugin()
})()

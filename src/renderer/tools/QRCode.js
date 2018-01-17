import domtoimage from 'dom-to-image'
import I18n from '../translations/i18n'
let _I18n = I18n.I18n
const ctxMenu = require('electron-context-menu')
const fs = require('fs')

let copy = _I18n.translate('copy')
let save_as = _I18n.translate('save_as')
let save_qr = _I18n.translate('save_qr')

ctxMenu({
  prepend: function (params, browserWindow) {
    return [{
      label: copy,
      click: function () {
        let clipboard = require('electron').remote.clipboard
        let nativeImage = require('electron').remote.nativeImage
        let node = document.getElementById('qr-holder')

        domtoimage.toPng(node).then(function (dataUrl) {
          let fromDataUrl = nativeImage.createFromDataURL(dataUrl)
          let buffer = fromDataUrl.toPNG()
          let outImage = nativeImage.createFromBuffer(buffer)
          
          clipboard.writeImage(outImage, 'image/png')
        }).catch(function (err) {
          console.error(err)
        })
      },
      // Only show it when right-clicking images
      visible: params.mediaType === 'canvas'
    }, {
      label: save_as,
      click: function () {
        let dialog = require('electron').remote.dialog
        dialog.showSaveDialog({
          title: save_qr,
          defaultPath: 'qrcode.png',
          filters: [
            {name: 'Image', extensions: ['png']}
          ]
        }, callbackSaveFile)
      },
      // Only show it when right-clicking images
      visible: params.mediaType === 'canvas'
    }]
  }
})

function callbackSaveFile (filePath) {
  let nativeImage = require('electron').nativeImage

  let node = document.getElementById('qr-holder')

  domtoimage.toPng(node).then(function (dataUrl) {
    let fromDataUrl = nativeImage.createFromDataURL(dataUrl)
    let buffer = fromDataUrl.toPNG()

    fs.writeFile(filePath, buffer, function (err) {
      if (err) throw err
    })
  }).catch(function (err) {
    console.log(err)
  })
}

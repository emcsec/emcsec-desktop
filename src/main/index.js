'use strict'

import { app, BrowserWindow, nativeImage } from 'electron'
const os = require('os')
const path = require('path')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  let title = 'Emercoin Secure Wallet'

  mainWindow = new BrowserWindow({
    height: 411,
    minHeight: 400,
    useContentSize: true,
    title: title,
    icon: path.join(__dirname, '/imgs/icon--assets.png'),
    width: 850,
    minWidth: 850
  })

  mainWindow.loadURL(winURL)

  if (process.env.NODE_ENV !== 'development' && os.platform() !== 'darwin' && os.platform() !== 'win32') {
    mainWindow.setIcon(path.join(__dirname, '/imgs/icon--assets.png'))
    console.log(os.platform())
  } else if (process.env.NODE_ENV !== 'development' && os.platform() === 'darwin') {
    console.log(os.platform())
    let icon = nativeImage.createFromPath(path.join(__dirname, '/imgs/icon--assets.icns'))
    app.dock.setIcon(icon)
  } else if (process.env.NODE_ENV !== 'development' && os.platform() === 'win32') {
    mainWindow.setIcon(path.join(__dirname, '/imgs/icon--assets.ico'))
    console.log(os.platform())
  }

  const isSecondInstance = app.makeSingleInstance(() => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  if (isSecondInstance) {
    app.quit()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

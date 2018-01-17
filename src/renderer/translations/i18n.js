import db from '../store/db'
const DB = db.db
const electron = require('electron')
let app = electron.remote.app

let I18n = {
  loadedLanguage: '',
  currentLanguage: 'en',
  init: function (code) {
    if (typeof code !== 'undefined') {
      try {
        this.loadedLanguage = require('./' + code + '.json')
        this.currentLanguage = code
      } catch (e) {
        console.log(e)
        this.loadedLanguage = require('./en.json')
      }
    } else {
      DB.settings.findOne({type: 'lang'}, function (err, result) {
        if (err) console.log(err)
        if (result === null) {
          try {
            this.loadedLanguage = require('./' + app.getLocale() + '.json')
          } catch (e) {
            console.log(e)
            this.loadedLanguage = require('./en.json')
          }
          this.currentLanguage = app.getLocale()
        } else {
          try {
            this.loadedLanguage = require('./' + result.code + '.json')
          } catch (e) {
            console.log(e)
            this.loadedLanguage = require('./en.json')
          }
          this.currentLanguage = result.code
        }
      }.bind(this))
    }
  },
  translate: function (word) {
    let translation = this.loadedLanguage[word]
    if (translation === undefined) {
      translation = word
    }
    return translation
  }
}

try {
  I18n.init()
} catch (e) {
  console.log(e)
}

export default {
  I18n: I18n,
  install: function (vue) {
    vue.prototype.$I18n = I18n
  }
}

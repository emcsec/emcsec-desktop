module.exports = {
  inArray (needle, haystack, strict) {
    let found = false
    let key
    strict = !!strict
    for (key in haystack) {
      if ((strict && haystack[key] === needle) || (!strict && haystack[key] === needle)) {
        found = true
        break
      }
    }
    return found
  },
  getDate (timestamp) {
    let offset = -new Date().getTimezoneOffset() / 60
    offset = offset * 3600
    timestamp = timestamp + offset
    let date = new Date(timestamp * 1e3).toISOString()
    let result = date.match(/\d{4}-\d{2}-\d{2}.\d{2}:\d{2}:\d{2}/)
    return result[0].replace(/T/g, ' ')
  },
  arrayUnique (arr) {
    let tmpArr = []
    for (let i = 0; i < arr.length; i++) {
      if (tmpArr.indexOf(arr[i]) === '-1') {
        tmpArr.push(arr[i])
      }
    }
    return tmpArr
  },
  arSort (array) {
    return array.sort(function (a, b) {
      return a - b
    })
  },
  round (value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
  },
  resizeImage (img) {
    let settings = {
      max_width: 200,
      max_height: 200
    }
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    let canvasCopy = document.createElement('canvas')
    let copyContext = canvasCopy.getContext('2d')
    let ratio = 1

    if (img.width > settings.max_width) {
      ratio = settings.max_width / img.width
    } else if (img.height > settings.max_height) {
      ratio = settings.max_height / img.height
    }

    canvasCopy.width = img.width
    canvasCopy.height = img.height
    copyContext.drawImage(img, 0, 0)

    canvas.width = img.width * ratio
    canvas.height = img.height * ratio
    ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height)
  }
}

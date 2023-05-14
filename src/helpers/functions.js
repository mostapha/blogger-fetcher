
const StringTruncate = (string, length) => {
  return string.substring(0, length)
}

const isString = variable => {
  return typeof variable === 'string'
}

const isFunction = fx => {
  return typeof fx === 'function'
}
const ObjectToURLParams = obj => {
  let str = ''
  for (var key in obj) {
    if (str !== '') {
      str += '&'
    }
    str += key + '=' + encodeURIComponent(obj[key])
  }
  return str
}

export const internal = {
  StringTruncate,
  isString,
  ObjectToURLParams,
  isFunction
}
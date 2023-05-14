
import { internal } from './functions'
import { log, warn } from './utils'

export { prepareParamsFromConfig }

const DEFAULT_PARAMS = {
  alt: 'json',
  redirect: 'false',
  'max-results': 8
}

const isNumber = value => {
  return !isNaN(value)
}

const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:[+-]\d{2}:\d{2}|Z)?$/
const isISODate = str => {
  if (isoDatePattern.test(str)) {
    return true
  } else {
    warn('invalid iso8601: "' + str + '"')
    return false
  }
}

// helper functions
const filter_empty_strings = s => s.trim() !== ''
const create_label_query = label => 'label:"' + label + '"'
const create_negative_label_query = label => '-label:"' + label + '"'

const prepareParamsFromConfig = ({ label, labels, superCates, maxResults, startIndex, updatedMin, updatedMax, publishedMin, publishedMax }) => {
  let userConfig = {}

  // superCates eliminates both $label and $labels
  // it's used as advanced way to filter labels
  if (superCates) {
    // superCates should be an array that contains at least one item
    if (Array.isArray(superCates) && superCates.length > 0) {
      const [cates, selectiveCates, excludedCates] = superCates

      // 1/3) extract cates:
      // label (string) / labels (array)
      let extractedCates = []
      if (cates) {
        if (cates && Array.isArray(cates) && cates.length > 0) {
          // get the the cates
          extractedCates = cates.filter(filter_empty_strings)
        } else if (internal.isString(cates)) {
          // get the cate
          extractedCates.push(cates)
        }
      }

      // 2/3) extract the selectiveCates
      let extractedSeletiveCates = []
      if (selectiveCates && Array.isArray(selectiveCates)) {
        if (selectiveCates.length > 1) {
          // extract them
          extractedSeletiveCates = selectiveCates.filter(filter_empty_strings)
        } else {
          warn('selectiveCates takes at least 2 cates')
        }
      }

      // 3/3) extract the excludedCates
      let extractedExcludedCates = []
      if (excludedCates) {
        if (Array.isArray(excludedCates)) {
          extractedExcludedCates = excludedCates.filter(filter_empty_strings)
        } else if (internal.isString(excludedCates)) {
          extractedExcludedCates.push(excludedCates)
        }
      }

      // use
      let useCates = extractedCates.map(create_label_query).join(' ')
      let useSelectiveCates = extractedSeletiveCates.map(create_label_query).join('|')
      let useExcludedCates = extractedExcludedCates.map(create_negative_label_query).join(' ')

      log('useCates', useCates !== '' ? useCates : '(none)')
      log('useSelectiveCates', useSelectiveCates !== '' ? useSelectiveCates : '(none)')
      log('useExcludedCates', useExcludedCates !== '' ? useExcludedCates : '(none)')

      let combine = ''
      if (useCates !== '') {
        combine += useCates
      }

      if (useSelectiveCates !== '') {
        combine += ' (' + useSelectiveCates + ')'
      }

      if (useExcludedCates !== '') {
        combine += ' ' + useExcludedCates
      }

      if (combine !== '') {
        userConfig.q = combine.trim()
      }
    }
  } else if (label) {
    if (internal.isString(label)) {
      userConfig.category = label + ''
    } else {
      throw 'label value must be a string'
    }
  } else if (labels) {
    if (Array.isArray(labels)) {
      let labelsQuery = labels.filter(filter_empty_strings).map(create_label_query).join(' ')
      if (labelsQuery !== '') {
        userConfig.q = labelsQuery
      }
    } else {
      throw 'labels value must be an array'
    }
  }

  if (maxResults && isNumber(maxResults) && maxResults >= 0) {
    userConfig['max-results'] = maxResults
  }

  if (startIndex && isNumber(startIndex) && startIndex >= 1) {
    userConfig['start-index'] = startIndex
  }

  if (updatedMin && isISODate(updatedMin)) {
    userConfig['updated-min'] = updatedMin
  }

  if (updatedMax && isISODate(updatedMax)) {
    userConfig['updated-max'] = updatedMax
  }

  if (publishedMin && isISODate(publishedMin)) {
    userConfig['published-min'] = publishedMin
  }

  if (publishedMax && isISODate(publishedMax)) {
    userConfig['published-max'] = publishedMax
  }

  return Object.assign(
    {},
    DEFAULT_PARAMS,
    userConfig
  )
}
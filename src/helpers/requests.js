
import { internal } from './functions'
import { log, requestLog, responseLog } from './utils'

const DEFAULT_FEED_TYPE = 'summary'
const ACCEPTED_FEED_TYPES = ['summary', 'full']

const getFeedType = passed_feed_type => {
  if (passed_feed_type) {
    return ACCEPTED_FEED_TYPES.includes(passed_feed_type) ? passed_feed_type : DEFAULT_FEED_TYPE
  } else return DEFAULT_FEED_TYPE
}

// this should return json response or report errors
export const makeCall = (params, callback, config) => {
  // if feed is passed, validate it
  const feed_type = getFeedType(config.feed)

  jQueryRequest('/feeds/posts/' + feed_type + '/?' + internal.ObjectToURLParams(params), callback)
}

const jQueryRequest = (url, callback) => {
  requestLog(url)
  jQuery.ajax({
    cache: true,
    url: url,
  }).done(json_response => {
    responseLog(json_response)
    callback(true, json_response) // callback(success, data)
  }).fail(function (jqXHR, textStatus) {
    let errCode = 'unknown'
    if (jqXHR.readyState === 4) {
      if (isFeedDisabled(jqXHR)) {
        errCode = 'disabled-blog-feed'
      } else {
        errCode = 'http-error'
      }
    } else if (jqXHR.readyState === 0) {
      errCode = 'network-error'
    }
    log('jqXHR', jqXHR)
    log('textStatus', textStatus)
    log(errCode)
    callback(false, errCode) // callback(success, data)
  })
}

// check if blog disabled feeds
const isFeedDisabled = jqXHR => {
  return jqXHR.responseText && jqXHR.responseText.includes('is not enabled')
}
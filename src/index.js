import { makeCall } from './helpers/requests'
import { prepareParamsFromConfig } from './helpers/params'
import { log, emptyFunction } from './helpers/utils'
import { extractor as ExtractPostsDataFromResponse } from './helpers/extractor/base'
import { internal } from './helpers/functions'


(function () {
  const BloggerFetcher = function () {
    return {
      VERSION: '1.1',
      getPosts(config, callback) {
        if (!config) {
          config = {}
        }
        if (!callback || !internal.isFunction(callback)) {
          callback = emptyFunction
        }
        const params = prepareParamsFromConfig(config)
        log('getPosts params', params)
        makeCall(params, (success, data) => {
          if (!success) {
            console.error(data)
          }
          callback({
            success,
            data: success ? (
              config.dev ? data : ExtractPostsDataFromResponse(data)
            ) : data
          })
        }, {
          feed: config.feed
        })
      },
      from(text_feed, callback) {
        if (callback && internal.isFunction(callback)) {
          callback({
            success: true,
            data: ExtractPostsDataFromResponse(text_feed)
          })
        }
      }
    }
  }()
  window.BloggerFetcher = BloggerFetcher
})()
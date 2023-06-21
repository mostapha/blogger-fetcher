# BloggerFetcher

A library that simplifies working with Blogger feeds (jQuery is required)

## add it to you blog
copy and paste the script tag into your HTML file
``` html
<script src="https://cdn.jsdelivr.net/gh/mostapha/blogger-fetcher@1.1.0/dist/bundle.min.js" crossorigin="anonymous"></script>
```
and to support old browsers use this script instead (just this one and not both)
``` html
<script src="https://cdn.jsdelivr.net/gh/mostapha/blogger-fetcher@1.1.0/dist/bundle-legacy.min.js" crossorigin="anonymous"></script>
```

## How to use
### Syntax
``` js
BloggerFetcher.getPosts(options?, callback)
```
#### Parameters
| Parameters |  |
|---|---|
| `options` : `Object` (optional) | API Options |
| `callback` : `Function(response)` | A function to be called when the result is ready<br/>`function (response) { }` |

#### Options
| name | type | description | example |
|---|---|---|---|
| `label` | `string` | filter the posts based on a specific label. | `label: "soccer"` |
| `labels` | `string[]` | filter the posts based on multiple labels, it gets posts that have all the labels (cannot be used with `label`) | `labels: ["soccer", "football"]` |
| `maxResults` | `number` | specifies the maximum number of posts returned by the API. (8 by default) | `maxResults: 20` |
| `startIndex` | `number` | the index of the first item to be retrieved (1 by default), using 2 for example makes the API skips the first post | `startIndex: 3` |
| `updatedMin` | `string` (ISO date) | filter the results to include only posts that have been updated on or after the specified date and time | `updatedMin: "2023-05-13T21:38:01.120Z"` |
| `updatedMax` | `string` (ISO date) | filter the results to include only posts that have been updated on or before the specified date and time | `updatedMax: "2023-05-13T15:13:10+0100"` |
| `publishedMin` | `string` (ISO date) | filter the results to include only posts that have been published on or after the specified date and time | `publishedMin: "2023-05-13T15:13:10-0800"` |
| `publishedMax` | `string` (ISO date) | filter the results to include only posts that have been published on or before the specified date and time | `publishedMax: "2023-01-01T00:00:00+0000"` |
### callback
when the result of a call is ready the callback function will be called, the function gets an `Object` argument, it has two properties **success** and **data**:
| name | description |
|---|---|
| `success` (boolean) | `true` if the call is succeed, `false` if some error occurred likenetwork error. |
| `data` (`Array` \| `String`) | value changes based on `success` value, if call is succeed the `data` property holds `Array` of `items`/post data, if it failed it holds a `string` the contains the kind of problem occurred |
## items properties
Each post item contains these properties
|  name | description | example |
|---|---|---|
| id `string` | post id | `"8871653134320550654"` |
| published `string` | date of publication (iso8601 format) | `"2023-05-10T14:13:00.004+01:00"` |
| updated `string` | last update date (iso8601 format) | `"2023-05-10T14:13:00.004+01:00"`  |
| labels `string[]` | list of the post labels | `['basketball', 'sport']` |
| summary `string` | snippet from the post body | `"Basketball has seen some incredible players over the years, each with their own unique talents and skills. From Michael Jordan and Kobe Bryant, to LeBron James and Kareem Abdul-Jabbar, the sport has produced some of the most iconic athletes in history. In this post, we'll take a closer look at the careers of some of the greatest basketball players of all time, and explore what made them so"` |
| url `string` | post url | `"https://github.blog/2023/05/a-look-at-greatest-players-of-all-time.html"` |
| author `Object?` | post author info | `{   name: String,   profileUrl: String,   imageUrl: String }` |
| image `Object?` | post featured image | `{   original: String,   small: String,   medium: String,   large: String }` |
| commentsCount `number?` | number of Blogger comments | `36` |

## use example
> get last 15 posts that have both `sport` and `soccer` labels and published on or after Jan 01 2023
``` js
BloggerFetcher.getPosts({
  labels: ['sport', 'soccer'],
  maxResults: 15,
  publishedMin: '2023-01-01T00:01:00+00:00'
}, function (response) {
  // if the call is succeeded
  if (response.success) {
    // if there is at least one item
    if (response.data.length !== 0) {
      console.log(response.data) // [{…}, {…}, …]
      console.log(response.data[0]) // {…}
      console.log(response.data[0].title) // "first post title"
    }
  } else {
    // error while making the call
    console.log(data) // error info
  }
})
```
> if no posts are found, you will get an empty array, make sure to check first before accessing array items
### ES6 version
``` js
BloggerFetcher.getPosts({
  labels: ['sport', 'soccer'],
  maxResults: 15,
  publishedMin: '2023-01-01T00:01:00+00:00'
}, ({ success, data }) => {
  // if the call is succeeded
  if (success) {
    // if there is at least one item
    if (data.length !== 0) {
      console.log(data) // [{…}, {…}, …]
      console.log(data[0]) // {…}
      console.log(data[0].title) // "first post title"
    }
  } else {
    // error while making the call
    console.log(data) // error info
  }
})
```

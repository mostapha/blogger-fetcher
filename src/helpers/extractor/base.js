import { utils as ExtractingUtils } from './utils'

const extractPostsData = response => {
  const posts = getPostsFromResponse(response)
  return posts.map(PostDataExtractor)
}

// extract posts data from response
export const extractor = response => {
  return extractPostsData(response)
}

const getPostsFromResponse = response => {
  const feed = response.feed
  if (feed.entry) {
    return response.feed.entry
  } else {
    return []
  }
}

const findSummary = post => {
  // when using summary feed, we can access post.summary
  if(post.summary){
    return ExtractingUtils.extractSummary(post.summary)
  } else if (post.content){
    return ExtractingUtils.extractSummaryFromContent(post.content)
  } else {
    return ''
  }
}

const findImage = post => {
  if(post.media$thumbnail){
    return ExtractingUtils.extractPostImage(post.media$thumbnail)
  } else if (post.content){
    return ExtractingUtils.extractPostImageFromContent(post.content)
  } else {
    return null
  }
}

const PostDataExtractor = post => {
  return {
    id: ExtractingUtils.extractEntryId(post.id.$t),
    published: post.published.$t,
    updated: post.updated.$t,
    labels: ExtractingUtils.extractCategories(post.category),
    title: post.title.$t,
    summary: findSummary(post),
    url: ExtractingUtils.extractPostUrl(post.link),
    author: ExtractingUtils.extractAuthors(post.author),
    image: findImage(post),
    commentsCount: ExtractingUtils.extractCommentsCount(post.thr$total)
  }
}
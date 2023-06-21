import { internal } from '../functions'


// extract comments count
const extractCommentsCount = (thr$total) => {
  if (thr$total) {
    return Number(thr$total.$t)
  } else return null
}

// extract post id
const extractEntryId = $t => {
  return $t.match(/\d+$/)[0]
}

// extract labels
const extractCategories = categories => {
  // Handle no labels
  if (!categories) {
    return []
  }

  return categories.map(e => e.term)
}

// extract postUrl
const extractPostUrl = (links) => {
  // Blogger domain uses related instead of alternate
  return (links.filter(e => e.rel === 'alternate')[0] || links.filter(e => e.rel === 'related')[0]).href
}

// extract authors
const checkIfProfileIsHidden = (author) => {
  return typeof author.uri === 'undefined'
}

const extractAuthors = (authors) => {
  // Blogger does not support multiple authors
  const author = authors[0]
  const isHiddenProfile = checkIfProfileIsHidden(author)

  if (isHiddenProfile) {
    return null
  }

  return {
    name: author.name.$t,
    profileUrl: author.uri.$t,
    imageUrl: author.gd$image.src
  }
}


// extract post summary
const extractSummary = (summary) => {
  return summary.$t.trim()
}

const extractContent = content => {
  var span = document.createElement('span')
  span.innerHTML = content
  return span.textContent || span.innerText
}

const CONTENT_SUMMARY_LENGTH = 400
const extractSummaryFromContent = content => {
  return internal.StringTruncate(extractContent(content.$t), CONTENT_SUMMARY_LENGTH).trim()
}

// handles images containing /s72/ and images ending with =s72-w?-h?-c
const IMAGE_SIZE_REGEX = /\/(s72-c)\/|=(s72-w\d+-h\d+-c)$/

const REPLACEMENT_SIZES = {
  small: 'w300',
  medium: 'w600',
  large: 'w1200',
}

const IMAGE_REGEX = /<img[^>]+src="([^">]+)"/


const sizeChangerHelper = size => {
  return function (match, first_group) {
    // if first_group is undefined it means the second group is the one we matched
    return first_group ? '/' + size + '/' : '=' + size
  }
}

const resizePostImage = (media) => {
  const originalUrl = media.url
  return {
    original: originalUrl,
    small: originalUrl.replace(IMAGE_SIZE_REGEX, sizeChangerHelper(REPLACEMENT_SIZES.small)),
    medium: originalUrl.replace(IMAGE_SIZE_REGEX, sizeChangerHelper(REPLACEMENT_SIZES.medium)),
    large: originalUrl.replace(IMAGE_SIZE_REGEX, sizeChangerHelper(REPLACEMENT_SIZES.large)),
  }
}

const extractPostImage = media_thumbnail => {
  return resizePostImage(media_thumbnail)
}

const extractPostImageFromContent = content => {
  const image = content.$t.match(IMAGE_REGEX)
  if (image) {
    const image_source = image[1]
    return {
      original: image_source,
      small: image_source,
      medium: image_source,
      large: image_source,
    }
  } else return null
}

export const utils = {
  extractCommentsCount,
  extractEntryId,
  extractCategories,
  extractPostUrl,
  extractAuthors,
  extractSummary,
  extractSummaryFromContent,
  extractPostImage,
  extractPostImageFromContent
}
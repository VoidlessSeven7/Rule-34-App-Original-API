// Definitions
import { PostResponse, PostRequest } from './types'

// Classes
import { CustomError } from '@/util/classes'

// Init
import Debug from 'debug'
const debug = Debug(`Server:util Post Cleaner`)

export function createPostFromData(
  booru: string,
  fetchedPostData: PostRequest
): PostResponse {
  const tmpJSON: PostResponse = {
    id: undefined,
    score: undefined,
    high_res_file: {
      url: undefined,
      height: undefined,
      width: undefined,
    },
    low_res_file: {
      url: undefined,
      height: undefined,
      width: undefined,
    },
    preview_file: {
      url: undefined,
      height: undefined,
      width: undefined,
    },
    tags: undefined,
    source: undefined,
    rating: undefined,
    type: undefined,
  }

  /*
   * ID
   */
  tmpJSON.id = fetchedPostData.id

  /*
   * Score
   */
  tmpJSON.score = Number(fetchedPostData.score ?? fetchedPostData.score.total)

  /*
   * File URLs
   */
  tmpJSON.high_res_file = {
    url:
      // rule34.xxx | rule34.paheal.net | gelbooru | safebooru - XML transformed boorus
      fetchedPostData.high_res_file.url ??
      // lolibooru | danbooru
      fetchedPostData.file_url ??
      // E621 - Modern boorus
      fetchedPostData.file.url,

    height:
      // rule34.xxx | rule34.paheal.net | gelbooru | safebooru - XML transformed boorus
      fetchedPostData.high_res_file.height ??
      // lolibooru
      fetchedPostData.height ??
      // E621 - Modern boorus
      fetchedPostData.file.height ??
      // danbooru.donmai.us
      fetchedPostData.image_height,

    width:
      // rule34.xxx | rule34.paheal.net | gelbooru | safebooru - XML transformed boorus
      fetchedPostData.high_res_file.width ??
      // lolibooru
      fetchedPostData.width ??
      // E621 - Modern boorus
      fetchedPostData.file.width ??
      // danbooru.donmai.us
      fetchedPostData.image_width,
  }

  tmpJSON.low_res_file = {
    url:
      // rule34.xxx | rule34.paheal.net | gelbooru | safebooru - XML transformed boorus
      fetchedPostData.low_res_file.url ??
      // lolibooru
      fetchedPostData.sample_url ??
      // E621 - Modern boorus
      fetchedPostData.sample.url ??
      // danbooru.donmai.us
      fetchedPostData.large_file_url,

    height:
      // rule34.xxx | rule34.paheal.net | gelbooru | safebooru - XML transformed boorus
      fetchedPostData.low_res_file.height ??
      // lolibooru
      fetchedPostData.sample_height ??
      // E621 - Modern boorus
      fetchedPostData.sample.height,

    width:
      // rule34.xxx | rule34.paheal.net | gelbooru | safebooru - XML transformed boorus
      fetchedPostData.low_res_file.width ??
      // lolibooru
      fetchedPostData.sample_width ??
      // E621 - Modern boorus
      fetchedPostData.sample.width,
  }

  tmpJSON.preview_file = {
    url:
      // rule34.xxx | rule34.paheal.net | gelbooru | safebooru - XML transformed boorus
      fetchedPostData.preview_file.url ??
      // E621
      fetchedPostData.preview.url ??
      // danbooru.donmai.us
      fetchedPostData.preview_file_url,

    height:
      // rule34.xxx | rule34.paheal.net | gelbooru | safebooru - XML transformed boorus
      fetchedPostData.preview_file.height ??
      // lolibooru
      fetchedPostData.preview_height ??
      // E621
      fetchedPostData.preview.height,

    width:
      // rule34.xxx | rule34.paheal.net | gelbooru | safebooru - XML transformed boorus
      fetchedPostData.preview_file.width ??
      // lolibooru
      fetchedPostData.preview_width ??
      // E621
      fetchedPostData.preview.width,
  }

  /*
   * Tags
   */

  tmpJSON.tags =
    // rule34.xxx | rule34.paheal.net | gelbooru | safebooru - XML transformed boorus
    (fetchedPostData.tags as string)?.trim().split(' ') ??
    // danbooru.donmai.us
    fetchedPostData.tag_string?.trim().split(' ')

  if (!tmpJSON.tags.length) {
    const tempTags: string[] = []

    // E621 - TODO: will probably break something
    ;(fetchedPostData.tags as [string[]]).forEach((tagContainer) => {
      tempTags.concat(tagContainer)
    })
  }

  /*
   * Source
   */
  tmpJSON.source =
    // Usual
    [fetchedPostData.source] ?? [fetchedPostData.source_url] ?? // E621
    //  Unknown
    fetchedPostData.sources

  /*
   * Rating
   */
  switch (fetchedPostData.rating) {
    case 'e':
      tmpJSON.rating = 'explicit'
      break

    case 'q':
    case 'suggestive': // Derpibooru
      tmpJSON.rating = 'questionable'
      break

    case 's':
      tmpJSON.rating = 'safe'
      break

    case 'u':
      tmpJSON.rating = 'unrated'
      break

    default:
      tmpJSON.rating = 'unknown'
      break
  }

  /*
   * Media type
   */
  tmpJSON.type = /\.(webm|mp4|ogg)$/.test(tmpJSON.high_res_file.url)
    ? 'video'
    : 'image'

  return tmpJSON
}

}
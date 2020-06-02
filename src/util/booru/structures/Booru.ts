// Types
import { Booru } from '@/types/types'

// Utilities
import httpFetch from '@/util/httpFetch'
import XMLToJson from '@/util/XMLToJson'
import processData from '@/util/booru/processing'

// Init
import Debug from 'debug'
import { GenericAPIError } from '@/util/classes'
const debug = Debug(`Server:util Booru Class`)

export abstract class GenericBooru {
  public booruType: string = undefined

  public queryIdentifiers: Booru.Classes.GenericBooru.QueryIdentifiers = {
    posts: {
      limit: undefined,
      pageID: undefined,
      tags: undefined,
      rating: undefined,
      score: undefined,
      order: undefined,
    },

    singlePost: {
      id: undefined,
    },

    tags: {
      tag: undefined,
      tagEnding: undefined,
      limit: undefined,
      pageID: undefined,
      order: undefined,
      raw: undefined,
    },
  }

  public endpoints: Booru.Classes.GenericBooru.Endpoints = {
    base: undefined,
    posts: undefined,
    tags: undefined,
    singlePost: undefined,
    randomPost: undefined,
  }

  constructor(
    booruType: string,
    endpoints: Booru.Classes.GenericBooru.Endpoints,
    queryIdentifiers: Booru.Classes.GenericBooru.QueryIdentifiers
  ) {
    this.booruType = booruType

    this.endpoints = endpoints
    this.endpoints.base = `https://${this.endpoints.base}`

    this.queryIdentifiers = queryIdentifiers
  }

  public async getPosts(
    queryObj: Booru.Structures.Requests.Queries.Posts
  ): Promise<Booru.Structures.Data.Processed.Response[]> {
    let URLToFetch = this.endpoints.base + this.endpoints.posts

    URLToFetch = this.addQueriesToURL(URLToFetch, 'posts', queryObj)

    let response = await httpFetch(URLToFetch)

    try {
      response = JSON.parse(response)
    } catch (error) {
      debug('Response was not JSON')

      response = await XMLToJson(response, 'posts')
    }

    return processData({
      data: response,
      mode: 'posts',
      booruType: this.booruType,
    })
  }

  public async getSinglePost(
    queryObj: Booru.Structures.Requests.Queries.SinglePost
  ): Promise<Booru.Structures.Data.Processed.Response[]> {
    let URLToFetch = this.endpoints.base + this.endpoints.singlePost

    URLToFetch = this.addQueriesToURL(URLToFetch, 'single-post', queryObj)

    let response = await httpFetch(URLToFetch)

    try {
      response = JSON.parse(response)
    } catch (error) {
      debug('Response was not JSON')

      response = await XMLToJson(response, 'posts')
    }

    return processData({
      data: response,
      mode: 'single-post',
      booruType: this.booruType,
    })
  }

  public async getRandomPost(
    queryObj: Booru.Structures.Requests.Queries.RandomPost
  ): Promise<Booru.Structures.Data.Processed.Response[]> {
    let URLToFetch = this.endpoints.base + this.endpoints.randomPost

    URLToFetch = this.addQueriesToURL(URLToFetch, 'random-post', queryObj)

    let response = await httpFetch(URLToFetch)

    try {
      response = JSON.parse(response)
    } catch (error) {
      debug('Response was not JSON')

      response = await XMLToJson(response, 'posts')
    }

    return processData({
      data: response,
      mode: 'posts',
      booruType: this.booruType,
    })
  }

  public async getTags(
    queryObj: Booru.Structures.Requests.Queries.Tags
  ): Promise<Booru.Structures.Data.Processed.Response[]> {
    let URLToFetch = this.endpoints.base + this.endpoints.tags

    URLToFetch = this.addQueriesToURL(URLToFetch, 'tags', queryObj)

    let response = await httpFetch(URLToFetch)

    // Parse JSON
    try {
      response = JSON.parse(response)

      // Parse XML
    } catch {
      debug('Response was not JSON')

      response = await XMLToJson(response, 'tags')
    }

    return processData({
      data: response,
      mode: 'tags',
      booruType: this.booruType,
      limit: queryObj.limit,
    })
  }

  private addQueriesToURL(
    URL: string,
    mode: string,
    queryObj:
      | Booru.Structures.Requests.Queries.Posts
      | Booru.Structures.Requests.Queries.Tags
      | Booru.Structures.Requests.Queries.SinglePost
  ): string {
    const {
      limit,
      pageID,
      tags,
      rating,
      score,
      order,
    } = queryObj as Booru.Structures.Requests.Queries.Posts

    const { tag } = queryObj as Booru.Structures.Requests.Queries.Tags

    const { id } = queryObj as Booru.Structures.Requests.Queries.SinglePost

    switch (mode) {
      case 'posts':
        // Add & if ? is present
        URL += URL.includes('?') ? '&' : '?'

        // Limit
        if (limit && this.queryIdentifiers.posts.limit)
          URL += this.queryIdentifiers.posts.limit + '=' + limit

        // Page ID
        if (pageID && this.queryIdentifiers.posts.pageID) {
          URL += '&' + this.queryIdentifiers.posts.pageID + '=' + pageID
        }

        // Tags
        URL += '&' + this.queryIdentifiers.posts.tags + '=' + tags

        // Rating
        if (rating && this.queryIdentifiers.posts.rating) {
          let tmpRating: string
          let prefix: string

          switch (rating.charAt(0)) {
            case '-':
              // debug('Sign detected')
              prefix = '-'
              tmpRating = rating.substring(1)
              break

            // No '+' case because + gets encoded to space
            default:
              prefix = '+'
              tmpRating = rating
              break
          }

          URL += prefix + this.queryIdentifiers.posts.rating + ':' + tmpRating
        }

        // Order
        if (order && this.queryIdentifiers.posts.order) {
          URL += '+' + this.queryIdentifiers.posts.order + ':' + order
        }

        // Score
        if (score && this.queryIdentifiers.posts.score) {
          URL += '+' + this.queryIdentifiers.posts.score + ':' + score
        }

        break

      case 'single-post':
        switch (this.booruType) {
          case 'danbooru':
            throw new GenericAPIError(
              'This type of booru doesnt support single-post',
              null,
              404
            )

          case 'danbooru2':
            URL = URL.replace('%', (id as unknown) as string)
            break

          default:
            // Add & if ? is present
            URL += URL.includes('?') ? '&' : '?'

            URL += this.queryIdentifiers.singlePost.id + '=' + id

            break
        }
        break

      case 'random-post':
        switch (this.booruType) {
          case 'gelbooru':
          case 'shimmie2':
            throw new GenericAPIError(
              'This type of booru doesnt support random-post',
              null,
              404
            )

          default:
            // Add & if ? is present
            URL += URL.includes('?') ? '&' : '?'

            // Limit
            if (limit && this.queryIdentifiers.posts.limit)
              URL += this.queryIdentifiers.posts.limit + '=' + limit

            // Tags
            URL += '&' + this.queryIdentifiers.posts.tags + '=' + tags

            // Rating
            if (rating && this.queryIdentifiers.posts.rating) {
              let tmpRating: string
              let prefix: string

              switch (rating.charAt(0)) {
                case '-':
                  // debug('Sign detected')
                  prefix = '-'
                  tmpRating = rating.substring(1)
                  break

                // No '+' case because + gets encoded to space
                default:
                  prefix = '+'
                  tmpRating = rating
                  break
              }

              URL +=
                prefix + this.queryIdentifiers.posts.rating + ':' + tmpRating
            }

            // Order random
            URL += '+' + this.queryIdentifiers.posts.order + ':' + 'random'

            // Score
            if (score && this.queryIdentifiers.posts.score) {
              URL += '+' + this.queryIdentifiers.posts.score + ':' + score
            }

            break
        }
        break

      case 'tags':
        // Add & if ? is present
        URL += URL.includes('?') ? '&' : '?'

        // Tag
        URL += this.queryIdentifiers.tags.tag + '=' + tag

        // Tag Ending
        if (this.queryIdentifiers.tags.tagEnding) {
          URL += this.queryIdentifiers.tags.tagEnding
        }

        // Limit
        if (limit && this.queryIdentifiers.tags.limit) {
          URL += '&' + this.queryIdentifiers.tags.limit + '=' + limit
        }

        // Page ID
        if (pageID && this.queryIdentifiers.tags.pageID) {
          URL += '&' + this.queryIdentifiers.tags.pageID + '=' + pageID
        }

        // Order
        if (order && this.queryIdentifiers.tags.order) {
          URL += '&' + this.queryIdentifiers.tags.order + '=' + order
        }

        // Raw methods to add
        if (this.queryIdentifiers.tags.raw) {
          URL += '&' + this.queryIdentifiers.tags.raw
        }
        break
    }

    return URL
  }
}

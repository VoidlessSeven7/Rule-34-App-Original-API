// Types
import { Request } from 'express'
import { Booru, Miscellaneous } from '@/types/types'

// Classes
import { Danbooru2, Danbooru, Gelbooru, Shimmie2 } from './structures'
import { GenericAPIError } from '@/util/classes'

export async function BooruHandler(
  { booruType, endpoint }: Miscellaneous.DataBetweenFunctions,
  queryObj: Request['query']
): Promise<Booru.Structures.Data.Processed.Response[]> {
  // General
  const { domain, config } = queryObj

  // Extract values from JSON
  let tmpJSON
  let requestedEndpoints
  let requestedQueryIdentifiers

  if (config) {
    tmpJSON = JSON.parse(config as string)
    requestedEndpoints = tmpJSON.endpoints
    requestedQueryIdentifiers = tmpJSON.queryIdentifiers

    // console.log({ requestedEndpoints, requestedQueryIdentifiers })
  }

  // BOORU
  let API
  switch (booruType) {
    // Moebooru and MyImouto are danbooru
    case 'danbooru':
      API = new Danbooru(
        booruType,
        domain as string,
        requestedEndpoints,
        requestedQueryIdentifiers
      )
      break

    case 'danbooru2':
      API = new Danbooru2(
        booruType,
        domain as string,
        requestedEndpoints,
        requestedQueryIdentifiers
      )
      break

    case 'shimmie2':
      API = new Shimmie2(
        booruType,
        domain as string,
        requestedEndpoints,
        requestedQueryIdentifiers
      )
      break

    case 'gelbooru':
      API = new Gelbooru(
        booruType,
        domain as string,
        requestedEndpoints,
        requestedQueryIdentifiers
      )
      break

    default:
      throw new GenericAPIError('No known booru type', null, 422)
  }

  // ENDPOINT
  switch (endpoint) {
    case 'posts':
      // Default values if not set
      const inputPostQueries = {
        limit: Number(queryObj.limit ?? 20),
        pageID: Number(queryObj.pid),
        tags: (queryObj.tags as string) ?? '',
        rating: queryObj.rating as string,
        score: queryObj.score as string,
        order: queryObj.order as string,
      }

      return await API.getPosts(inputPostQueries)

    case 'tags':
      // Default values if not set
      const inputTagQueries = {
        tag: queryObj.tag as string,
        limit: Number(queryObj.limit ?? 20),
        pageID: Number(queryObj.pid),
        order: (queryObj.order as string) ?? 'count',
      }

      return await API.getTags(inputTagQueries)

    case 'single-post':
      const processedSinglePostQueries = {
        id: Number(queryObj.id),
      }

      return await API.getSinglePost(processedSinglePostQueries)

    case 'random-post':
      const processedRandomPostQueries = {
        limit: Number(queryObj.limit ?? 1),
        tags: (queryObj.tags as string) ?? '',
        rating: queryObj.rating as string,
        score: queryObj.score as string,
      }

      return await API.getRandomPost(processedRandomPostQueries)

    default:
      throw new GenericAPIError('No endpoint specified', null, 422)
  }
}

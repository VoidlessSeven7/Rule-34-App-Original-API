/* eslint-disable @typescript-eslint/camelcase */
import { Request, Response } from 'express'

/**
 * GET /
 * Home page.
 */
module.exports = (req: Request, res: Response): void => {
  res.json({
    message:
      'This is an API wrapper made for https://r34.app, it gathers content from the next sites',
    rule34_xxx: {
      domain: 'https://rule34.xxx/',
      api: '//xxx/',
    },

    rule34_paheal: {
      domain: 'https://rule34.paheal.net/',
      api: '//paheal/',
    },

    danbooru: {
      domain: 'https://danbooru.donmai.us/',
      api: '//danbooru/',
    },

    gelbooru: {
      domain: 'https://gelbooru.com/',
      api: '//gelbooru/',
    },

    e621: {
      domain: 'https://e621.net/',
      api: '//e621/',
    },

    lolibooru: {
      domain: 'https://lolibooru.moe/',
      api: '//loli/',
    },
  })
}

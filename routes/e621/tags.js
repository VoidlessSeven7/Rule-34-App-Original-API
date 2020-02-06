const express = require('express'),
  xmlToJsonFromUrl = require('../../utils/xmlToJsonFromUrl.js'),
  domainConfig = require('./domainConfig'),
  router = express.Router(),
  { check, validationResult } = require('express-validator'),
  debug = require('debug')(`e621 tags`)

/* GET tags. */
router.get(
  '/',
  [
    check('tag')
      .isString()
      .notEmpty(),
    check('limit')
      .isInt()
      .optional(),
    check('order')
      .isString()
      .optional(),
    check('pid')
      .isInt()
      .optional(),
  ],
  async function(req, res) {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    // Get the requested parameters and create a url to request data with it
    const requestUrl = applyUrlParameters(req)
    debug(requestUrl)

    // Define limit of posts to return to client

    // Process through wich the json gets transformed to optimized json
    let jsonResult = await xmlToJsonFromUrl(requestUrl, 'tags', 'e621', true)

    // Reply to the client
    res.json(jsonResult)
  }
)

// Separated applying of query parameters
function applyUrlParameters(req) {
  // Default query parameters
  const tag = encodeURIComponent(req.query.tag) || '',
    limit = req.query.limit || 25,
    pageId = req.query.pid || 1, // Needs to be one for some reason
    order = req.query.order || 'count'

  // Return full url
  return (
    domainConfig.tagApiUrl +
    '?' +
    domainConfig.userAgent + // Necessary for this site's API
    '&name=' +
    tag +
    '*' +
    '&limit=' +
    limit +
    '&page=' +
    pageId +
    '&order=' +
    order
  )
}

module.exports = router
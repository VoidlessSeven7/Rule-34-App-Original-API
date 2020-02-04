const express = require('express'),
  xmlToJsonFromUrl = require('../../utils/xmlToJsonFromUrl.js'),
  domainConfig = require('./domainConfig'),
  router = express.Router(),
  { check, validationResult } = require('express-validator'),
  debug = require('debug')(`xxx tags`)

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
    const limit = req.query.limit || 100

    // Process through wich the json gets transformed to optimized json
    let jsonResult = await xmlToJsonFromUrl(
      requestUrl,
      'autocomplete',
      'xxx',
      true,
      limit
    )

    // Reply to the client
    res.json(jsonResult)
  }
)

// Separated applying of query parameters
function applyUrlParameters(req) {
  // Default query parameters
  const tag = encodeURIComponent(req.query.tag) || ''

  // Return full url
  return domainConfig.tagApiUrl + 'q=' + tag
}

module.exports = router

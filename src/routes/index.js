const express = require('express');
const {hostname} = require('os')
const { version, author } = require('../../package.json');

const response = require('../response.js')

// Create a router that we can use to mount our API
const router = express.Router();

const { authenticate } = require('../auth');

/**
 * Expose all of our API routes on /v1/* to include an API version.
 */
router.use(`/v1`, authenticate(), require('./api'));


router.get('/', (req, res) => {
  // Clients shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');

  res.status(200).json(
    response.createSuccessResponse(    {
      author,
      githubUrl: 'https://github.com/gschiralli/fragments',
      version,
      hostname: hostname()
    })
);
});

module.exports = router;

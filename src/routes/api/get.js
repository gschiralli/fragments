const response = require('../../response.js')
module.exports = (req, res) => {
  // TODO: this is just a placeholder to get something working...
  res.status(200).json(response.createSuccessResponse({fragments:[]}));
};

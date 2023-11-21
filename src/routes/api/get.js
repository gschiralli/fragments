const response = require('../../response.js')
module.exports = (req, res) => {
  
  res.status(200).json(response.createSuccessResponse({fragments:[]}));
};

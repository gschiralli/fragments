const logger = require('../../logger.js');
const { Fragment } = require('../../model/fragment.js');
const response = require('../../response.js')




module.exports = async (req, res) => {
  const ownerId = req.user;
  const expand = req.query.expand == 1 ? true : false;

  logger.info({ownerId, expand}, 'Calling GET')

  try {
    const fragments = await Fragment.byUser(ownerId,expand)
    if (fragments.length === 0){
      logger.debug({fragments}, 'User has no fragments')
    }else{
      logger.debug({fragments}, 'User fragments')
    }
    res.status(200).json(response.createSuccessResponse({fragments:fragments}));
  } catch (err) {
    logger.warn({err}, 'Failed to retrieve users fragments')
    res.status(404).json(response.createErrorResponse(err,'Error'))
  }
  
};



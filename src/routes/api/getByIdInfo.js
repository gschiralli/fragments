const logger = require('../../logger.js');
const { Fragment } = require('../../model/fragment.js');
const response = require('../../response.js')


module.exports = async (req,res) => {
  const id = req.params.id;
  const ownerId = req.user;

  logger.info({ id, ownerId }, `Calling GET ${req.originalUrl}`);

  try {
    const fragment = await Fragment.byId(ownerId, id);
    logger.info({ fragment }, 'Fragment was found');

    const successResponse = response.createSuccessResponse({ fragment: fragment });
    res.status(200).json(successResponse);
  } catch (err) {
    const errorResponse = response.createErrorResponse(404, err.message);

    logger.error({ errorResponse }, 'Failed to retrieve requested fragment');
    res.status(404).json(errorResponse);
  }
}

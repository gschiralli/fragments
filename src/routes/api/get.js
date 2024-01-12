const logger = require('../../logger.js');
const { Fragment } = require('../../model/fragment.js');
const response = require('../../response.js')




module.exports.listUserFragments = async (req, res) => {
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
  } catch (error) {
    logger.warn({err}, 'Failed to retrieve users fragments')
    res.status(404).json(response.createErrorResponse(err,'Error'))
  }
  
};

module.exports.getFragmentById = async (req,res) =>{
  const ownerId = req.user;
  const[id,extension] =  req.params.id.split('.');

  logger.info({id,ownerId,extension}, 'Calling GET by Id')
  
  try {
    const fragment = await Fragment.getFragmentById(ownerId)  
    logger.debug({fragment}, "Fragment was retrieved")

    const data = fragment.getData() 
    logger.debug('fragment data has been retrieved')

    if(extension){
      const extensionType = getExtensionType(extension)
      logger.info()
    }

  } catch (error) {
    
  }
}

function getExtensionType(extension){
  switch(extension){
    case 'txt':
      return 'text/plain'
    case 'md':
      return 'text/markdown'
    case 'html':
      return 'text/html'
    case 'json':
      return 'application/json'
    case 'png':
      return 'image/png'
    case 'jpg':
      return 'image/jpeg'
    case 'webp':
      return 'image/webp'
    case 'gif':
      return 'image/gif';
      default:
        return null
  }
}

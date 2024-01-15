const logger = require('../../logger.js');
const { Fragment } = require('../../model/fragment.js');
const response = require('../../response.js')

module.exports = async (req,res) =>{
  const ownerId = req.user;
  const[id,extension] =  req.params.id.split('.');

  logger.info({id,ownerId,extension}, 'Calling GET by Id')
  
  try {
    const fragment = await Fragment.getFragmentById(ownerId)  
    logger.debug({fragment}, "Fragment was retrieved")

    const data = fragment.getData() 
    logger.debug('fragment data has been retrieved')
      res.setHeader('Content-Type', fragment.type);
      res.status(200).json(response.createSuccessResponse({data}));
    }
    
   catch (err) {
    const errorResponse = response.createErrorResponse(404, err.message);
    logger.warn({ id, errorResponse }, 'Failed to retrieve fragment');
    res.status(404).json(err.message);
  }
}

// function getExtensionType(extension){
//   switch(extension){
//     case 'txt':
//       return 'text/plain'
//     case 'md':
//       return 'text/markdown'
//     case 'html':
//       return 'text/html'
//     case 'json':
//       return 'application/json'
//     case 'png':
//       return 'image/png'
//     case 'jpg':
//       return 'image/jpeg'
//     case 'webp':
//       return 'image/webp'
//     case 'gif':
//       return 'image/gif';
//       default:
//         return null
//   }
// }

const {createErrorResponse,createSuccessResponse} = require('../../response.js')
const {Fragment} = require('../../model/fragment.js')
const logger = require('../../logger.js');


module.exports = async (req, res) => {
  logger.debug('Post', + req.body);
  
  if(Fragment.isSupportedType(req.get('Content-Type'))){
    try {
      const fragment = new Fragment({ownerId:req.user,type:req.get('Content-Type')})
      await fragment.save()
      await fragment.setData(req.body)
  
      logger.debug('New fragment created: ' + JSON.stringify(fragment));

      res.setHeader('Location', `${process.env.API_URL}/v1/fragments/${fragment.id}`);
      res.status(201).json(
        createSuccessResponse({
          fragment: fragment,
        })
      );
  
    } catch (err) {
      res.status(500).json(createErrorResponse(500, err));
    }
  }else{
    res.status(415).json(createErrorResponse(415,'Type not supported'))
  }

  

};

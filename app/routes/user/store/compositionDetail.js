const router = require('express').Router();
const verify = require('../../verifyToken');

const db = require("../../../models");
const User = db.users;

// const compositionDetailController = require('../../../controllers/compositionDetail.controller')

//Get Composition Details from Product
router.get('/:idProduct/compositions', verify, (request,response) => { 
    response.send(`Get Composition Details`);
});

//Get Composition Details specific
router.get('/:idProduct/compositions/:id', verify, (request,response) => { 
    const ID_PRODUCT = request.params.idProduct
    const ID         = request.params.id
    response.send(`Get Composition Details ${ID} from Product ${ID_PRODUCT}`);
});

//Create Composition Details
/**
 * @request : {"compositionId", "productId", "amount"}
 */
router.post('/:idProduct/compositions', verify, (request,response) => { 
    response.send(`Create Composition Details`);
});

//Update Composition Details
router.put('/:idProduct/compositions/:id', verify, (request,response) => { 
    const ID_PRODUCT = request.params.idProduct
    const ID         = request.params.id
    response.send(`Update Composition Details ${ID} from Product ${ID_PRODUCT}`);
});

//Delete Composition Details
router.delete('/:idProduct/compositions/:id', verify, (request,response) => { 
    const ID_PRODUCT = request.params.idProduct
    const ID         = request.params.id
    response.send(`Delete Composition Details ${ID} from Product ${ID_PRODUCT}`);
});

module.exports = router;
const router = require('express').Router();
const verify = require('../../verifyToken');

const db = require("../../../models");
const User = db.users;
const Product = db.products;

const compositionDetailController = require('../../../controllers/compositionDetail.controller')

//Middleware
const validateOwnership = async function(request,response,next) {
    const ID_PRODUCT = request.params.idProduct
    const ID         = request.params.id ? request.params.id: null
    response.locals.productID = ID_PRODUCT
    let user = request.user;
    user = await User.findByPk(user.id, { include: ["store"] })
      .then((userStore) => {
        response.locals.storeID = userStore.store.id
      }).catch((err) => {
        response.status(500)
          .send({message: 'Gagal memperoleh data toko', error: err.message });
      });
    
    Product.findByPk(ID_PRODUCT)
        .then((dataProduct) =>{
            if( response.locals.storeID == dataProduct.storeId ){
                next();
            }else{
                response.status(403).send({
                        message: 'Tidak memiliki akses pada layanan ini',
                        error: "Don't have access to do this action"
                    });
            }
        }).catch((err) => {
            response.status(500)
              .send({message: 'Gagal memperoleh data produk', error: err.message });
        });
}

//Get Composition Details from Product
router.get('/:idProduct/compositions', verify, 
    validateOwnership, compositionDetailController.all);

//Get Composition Details specific
router.get('/:idProduct/compositions/:id', verify, 
    validateOwnership, compositionDetailController.findOne);

//Create Composition Details
/**
 * @request : {"compositionId", "productId", "amount"}
 */
router.post('/:idProduct/compositions', verify, 
    validateOwnership, compositionDetailController.create);

//Update Composition Details
router.put('/:idProduct/compositions/:id', verify, 
    validateOwnership,compositionDetailController.update);

//Delete Composition Details
router.delete('/:idProduct/compositions/:id', verify, 
    validateOwnership, compositionDetailController.delete);

module.exports = router;
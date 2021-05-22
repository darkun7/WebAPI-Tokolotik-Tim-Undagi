const router = require('express').Router();
const verify = require('../../verifyToken');

const db = require("../../../models");
const User = db.users;
const Product = db.products;

const transactionController = require('../../../controllers/transaction.controller')

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
              .send({message: 'Gagal memperoleh data transaction', error: err.message });
        });
}

//Get Transaction from Product
router.get('/:idProduct/transactions', verify, 
    validateOwnership, transactionController.all);

//Get Transaction specific
router.get('/:idProduct/transactions/:id', verify, 
    validateOwnership, transactionController.findOne);

//Create Transaction
/**
 * @request : {"compositionId", "productId", "amount"}
 */
router.post('/:idProduct/transactions', verify, 
    validateOwnership, transactionController.create);

//Update Transaction
router.put('/:idProduct/transactions/:id', verify, 
    validateOwnership,transactionController.update);

//Delete Transaction
router.delete('/:idProduct/transactions/:id', verify, 
    validateOwnership, transactionController.delete);

module.exports = router;
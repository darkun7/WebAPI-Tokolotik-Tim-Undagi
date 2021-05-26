const router = require('express').Router();
const verify = require('../../verifyToken');

const db = require("../../../models");
const User = db.users;
const Product = db.products;
const Store = db.stores;


const transactionController = require('../../../controllers/transaction.controller')

//Middleware
const validateOwnership = async function(request,response,next) {
    const ID_PRODUCT = request.params.idProduct ? request.params.idProduct:null
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
    if(request.params.idProduct != null){
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
    }else{
        next();
    }
}

//Get Transaction from Product
router.get('/products/:idProduct/transactions', verify, 
    validateOwnership, transactionController.all);

//Get Transaction specific
router.get('/products/:idProduct/transactions/:id', verify, 
    validateOwnership, transactionController.findOne);

//Create Transaction
/**
 * @request : {"compositionId", "productId", "amount"}
 */
router.post('/products/:idProduct/transactions', verify, 
    validateOwnership, transactionController.create);

//Update Transaction
router.put('/products/:idProduct/transactions/:id', verify, 
    validateOwnership,transactionController.update);

//Delete Transaction
router.delete('/products/:idProduct/transactions/:id', verify, 
    validateOwnership, transactionController.delete);

//Read All Transaction (user)
router.get('/transactions', verify, 
    validateOwnership, transactionController.allByUser);

//Read Specific Transaction (user)
router.get('/transactions/:id', verify, 
    validateOwnership, transactionController.findOne);

//Update Transaction (user)
router.put('/transactions/:id', verify, 
    validateOwnership,transactionController.update);

//Delete Transaction (user)
router.delete('/transactions/:id', verify, 
    validateOwnership, transactionController.delete);


module.exports = router;
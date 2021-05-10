const router = require('express').Router();
const verify = require('../../verifyToken');

const db = require("../../../models");
const User = db.users;

const productController = require('../../../controllers/product.controller')

//Get Product All
router.get('/', verify, (request,response, next) =>{ 
    let user = request.user;
    user = User.findByPk(user.id, { include: ["store"] })
      .then((userStore) => {
        response.locals.ID = userStore.id
        next()
      }).catch((err) => {
        console.log('Fail get user-product, Error: ', err)
      });
    },
    productController.all
);

//Get Product
router.get('/:id', verify, productController.findOne);

//Create Product
/**
 * @request : {storeId, tokopediaProductId, tokopediaProductUrl, productName, price, image}
 */
router.post('/', verify, productController.create);

//Update Product
router.put('/:id', verify, productController.update);

//Delete Product
router.delete('/:id', verify, productController.delete);

module.exports = router;
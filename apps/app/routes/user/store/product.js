const router = require('express').Router();
const verify = require('../../verifyToken');

const db = require("../../../models");
const User = db.users;
const Stote = db.stores;

const productController = require('../../../controllers/product.controller')

//Middleware
const validateOwnership = async function(request,response,next) {
    let user = request.user;
    user = await User.findByPk(user.id, { include: ["store"] })
      .then((userStore) => {
        response.locals.ID = userStore.id
        next()
      }).catch((err) => {
        response.status(500)
          .send({message: 'Gagal memperoleh data toko', error: err.message });
      });
}

//Get Product All
router.get('/', verify, validateOwnership, productController.all);

//Get Product
router.get('/:id', verify, productController.findOne);

//Create Product
/**
 * @request : {"storeId", "tokopediaProductId", "tokopediaProductUrl", "productName", "price", "image"}
 */
router.post('/', verify, validateOwnership, productController.create);

//Update Product
router.put('/:id', verify, validateOwnership, productController.update);

//Delete Product
router.delete('/:id', verify, validateOwnership, productController.delete);

//Crawl Review
router.get('/:id/reviews', verify, validateOwnership, productController.crawlReview);

module.exports = router;
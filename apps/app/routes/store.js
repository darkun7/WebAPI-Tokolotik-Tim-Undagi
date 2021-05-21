const router = require('express').Router();
const verify = require('./verifyToken');
const storesController = require('../controllers/store.controller')
const productController = require('../controllers/product.controller')

const db = require("../models");
const User = db.users;

//Get Global Store
router.get('/', storesController.global);

//Get Store Specific
router.get('/:id', storesController.findOne);

router.get('/:id/products', async (request, response, next) => {
    response.locals.storeID = request.params.id
    next();
    },
    productController.all
);

router.get('/:id/products/:idProduct', async (request, response, next) => {
    response.locals.storeID   = request.params.id
    response.locals.productID = request.params.idProduct
    next();
    },
    productController.findOneProductOfStore
);

module.exports = router;
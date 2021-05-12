const router = require('express').Router();
const verify = require('./verifyToken');

const db = require("../models");
const User = db.users;

const productController = require('../controllers/product.controller')

//Get Product All
router.get('/', productController.global);

//Get Product
router.get('/:id', productController.findOne);

module.exports = router;
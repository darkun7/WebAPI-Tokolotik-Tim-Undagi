const router = require('express').Router();
const verify = require('../../verifyToken');

const db = require("../../../models");
const User = db.users;
const Composition = db.compositions;

const compositionController = require('../../../controllers/composition.controller')

//Middleware
const validateOwnership = async function(request,response,next) {
  let user = request.user;
  user = await User.findByPk(user.id, { include: ["store"] })
    .then((userStore) => {
      response.locals.storeID = userStore.store.id
      next()
    }).catch((err) => {
      response.status(500)
        .send({message: 'Gagal memperoleh data toko', error: err.message });
    });
}

//Get Composition All
router.get('/', verify, validateOwnership, compositionController.all);

//Get Composition
router.get('/:id', verify, validateOwnership, compositionController.findOneCompositionOfStore);

//Create Composition
/**
 * @request : {"storeId", "compositionName", "unit"}
 */
//  compositionController.create
router.post('/', verify, validateOwnership, compositionController.create);

//Update Composition
router.put('/:id', verify, validateOwnership, compositionController.update);

//Delete Composition
router.delete('/:id', verify, validateOwnership, compositionController.delete);

module.exports = router;
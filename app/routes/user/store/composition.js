const router = require('express').Router();
const verify = require('../../verifyToken');

const db = require("../../../models");
const User = db.users;

const compositionController = require('../../../controllers/composition.controller')

//Get Composition All
router.get('/', verify, (request,response,next) => { 
    let user = request.user;
    user = User.findByPk(user.id, { include: ["store"] })
      .then((userStore) => {
        response.locals.ID = userStore.id
        next()
      }).catch((err) => {
        response.status(500)
          .send({message: 'Gagal memperoleh data toko', error: err.message });
      });
    },
    compositionController.all
);

//Get Composition
router.get('/:id', compositionController.findOne);

//Create Composition
/**
 * @request : {"storeId", "compositionName", "unit"}
 */
//  compositionController.create
router.post('/', verify, compositionController.create);

//Update Composition
router.put('/:id', verify, compositionController.update);

//Delete Composition
router.delete('/:id', verify, compositionController.delete);

module.exports = router;
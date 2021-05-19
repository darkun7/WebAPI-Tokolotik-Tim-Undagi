const router = require('express').Router();
const verify = require('../verifyToken');

const db = require("../../models");
const User = db.users;

const storeController = require('../../controllers/store.controller')

//Get User Store
router.get('/', verify, async (request,response, next) =>{
    let user = request.user;
    user = await User.findByPk(user.id, { include: ["store"] })
      .then((userStore) => {
        response.status(200).send(userStore)
        response.locals.ID = userStore.store.id
      }).catch((err) => {
        console.log('Fail get user-product, Error: ', err)
      });
    },
    storeController.findOne
);

//Create Store
// router.post('/', verify, (request,response) => {
//     response.send(`Create Store`);
// });

//Update Store
 router.put('/', verify, async (request,response, next) =>{
  let user = request.user;
  user = await User.findByPk(user.id, { include: ["store"] })
    .then((userStore) => {
      response.locals.ID = userStore.store.id
      next()
    }).catch((err) => {
      console.log('Fail get user-product, Error: ', err)
    });
  },
  storeController.update
);

//Delete Store
// router.delete('/:id', verify, (request,response) => {
//     const ID  = request.params.id
//     response.send(`Delete Store ${ID}`);
// });

module.exports = router;

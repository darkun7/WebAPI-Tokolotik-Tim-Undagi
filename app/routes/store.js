const router = require('express').Router();
const verify = require('./verifyToken');
const storesController = require('../controllers/store.controller')

const db = require("../models");
const User = db.users;

router.get('/', verify, (request, response) => {
    response.send(request.params.storeId)
});

router.get('/self', verify, async (request, response) => {
    let user = request.user;
    user = User.findByPk(user.id, { include: ["store"] })
      .then((userStore) => {
        console.log(userStore.toJSON())
        response.send(userStore.toJSON())
      }).catch((err) => {
        console.log('Fail get user-product, Error: ', err)
      });
});

router.post('/create', (request,response) => {
  response.send('Forgot Password');
});

module.exports = router;
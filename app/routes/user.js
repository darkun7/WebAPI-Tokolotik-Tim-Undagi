const router = require('express').Router();
const users = require('../controllers/user.controller')

router.get('/store', verify, async (request, response) => {
    let user = request.user;
    user = User.findByPk(user.id, { include: ["store"] })
      .then((userStore) => {
        console.log(userStore.toJSON())
        response.send(userStore.toJSON())
      }).catch((err) => {
        console.log('Fail get user-store, Error: ', err)
      });
});

router.put('/store', verify, async (request, response) => {
    let user = request.user;
});

module.exports = router;
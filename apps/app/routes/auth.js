const router = require('express').Router();
const users = require('../controllers/user.controller')

router.post('/register', users.register);

router.post('/login', users.login);

router.post('/session', users.session);

router.post('/logout', users.logout);

router.post('/recover', (request,response) => {
    response.send('Forgot Password');
})


module.exports = router;
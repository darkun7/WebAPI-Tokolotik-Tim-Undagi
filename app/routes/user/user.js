const router = require('express').Router();
const verify = require('../verifyToken');

const db = require("../../models");
const User = db.users;

const userController = require('../../controllers/user.controller')
const upload = require('../../config/multer');


router.get('/profile', verify, async (request, response) => {
    response.send(request.user)
});

router.put('/profile', verify, userController.update);

router.post('/profileImage',verify,  upload.uploadFile, async (request, response) => {
});



module.exports = router;
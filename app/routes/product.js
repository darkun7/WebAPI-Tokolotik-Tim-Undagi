const router = require('express').Router();
const verify = require('./verifyToken');

const db = require("../models");
const User = db.users;

router.get('/', verify, (request, response) => {
    
    let user = request.user;
    console.log(user);
    // let uid = user['uid'];
    // user = User.findByPk(uid)
    //             .then((data) => {
    //                 response.send(data);
    //             }).catch((err) => {
    //                 response.status(500).send({
    //                     message: "Error retrieving post with id=" + uid
    //                 });
    //             });
    // response.send('Show All Product');
});

module.exports = router;
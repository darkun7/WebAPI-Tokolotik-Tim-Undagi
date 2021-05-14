const jwt = require('jsonwebtoken');
const db = require("../models");
const User = db.users;

module.exports = function (request, response, next) {
    const token = request.header('auth-token');
    if(!token) return response.status(401).send({ auth: false, message: 'Akses dicekal' });
    try {
        jwt.verify(token, process.env.SECRET_KEY, function(error, decoded) {
            if (error) return response.status(500).send({ auth: false, message: 'Token tidak valid' });
                const uid = decoded.uid;
                user = User.findByPk(uid)
                            .then((data) => {
                                request.user = data['dataValues'];
                                next();
                            }).catch((error) => {
                                response.status(500).send({ auth: false ,message: "Gagal mendapat data user" });
                            });
        });
        
    }catch(error){
        response.status(400).send(error || 'Token tidak valid');
    }
}
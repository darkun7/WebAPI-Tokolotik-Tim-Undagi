const jwt = require('jsonwebtoken');

module.exports = function (request, response, next) {
    const token = request.header('auth-token');
    if(!token) return response.status(401).send('Akses dicekal');
    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        request.user = verified;
        next();
    }catch(err){
        response.status(400).send('Token tidak valid');
    }
}
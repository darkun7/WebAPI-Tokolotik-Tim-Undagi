const db = require("../models");
const User = db.users;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Op = db.Sequelize.Op;

// Auth Register
exports.register = async (request, response) => {
    //hash
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(request.body.password, salt);
    const user = {
        username: request.body.username,
        email: request.body.email,
        password: hashPassword,
    }

    User.create(user)
        .then((result) => {
            return response.status(200).send(result);
        }).catch((err) => {
            return response.status(500).send({message: err.message || "Gagal Membuat Akun"})
        })
};

// Auth Login
exports.login = async (request, response) => {
    const username = request.body.username;
    const email = request.body.email;
    const password = request.body.password;
    if ( (!username && !email) || !password ) {
        return response.status(400).send(
          'Nama pengguna dan Kata sandi tidak boleh kosong'
        );
    }
    // Email & Username auth method
    let user;
    if( email ){
        user = await User.findOne({ where: { email:email } });
    }else{
        user = await User.findOne({ where: { username:username } });
    }
    //Password check
    if (!user) return response.status(400).send('Akun belum terdaftar')
    const pswd = await bcrypt.compare(password, user.password);
    if (!pswd) return response.status(400).send('Kredensial salah')
    // Assign Token
    let payload = {
        uid: user.id,
    }
    const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '120m'});
    response.cookie('jwt', token, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 });
    response.status(200).header('auth-token', token).send(token);
};

exports.logout = async (request, response) => {
    response.cookie('jwt', '', { maxAge: 1 });
    response.status(200).send({ auth: false, token: null });
}

// Select All
exports.all = async (request, response) => {

};

// Find One
exports.findOne = (request, response) => {

};

// Update
exports.update = (request, response) => {

};

// Delete
exports.delete = (request, response) => {

};

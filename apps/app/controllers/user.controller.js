const db = require("../models");
const User = db.users;
const Store = db.stores;
const bcrypt = require("bcryptjs");
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
        role: request.body.role,
    }

    User.create(user)
        .then((createdUser) => {
            let role = createdUser.get('role');
            if(  role == "seller" ){
                const seller = {
                    userId : createdUser.get('id'),
                    storeName : 'Toko '+createdUser.get('username')
                }
                Store.create(seller);
            }
            let payload = {
                uid: createdUser.get('id'),
            }
            // Assign Token
            const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '1d'});
            response.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            response.status(201).header('auth-token', token)
                    .send({
                        token: token,
                        auth: true,
                    });
        }).catch((err) => {
            response.status(500).send({
                message: 'Gagal Membuat Akun',
                error: err.message
            });
        });
};

// Auth Login
exports.login = async (request, response) => {
    const username = request.body.username;
    const email = request.body.email;
    const password = request.body.password;
    if ( (!username && !email) || !password ) {
        return response.status(400).send({
            message: 'Nama pengguna dan Kata sandi tidak boleh kosong'
        });
    }
    // Email & Username auth method
    let user;
    if( email ){
        user = await User.findOne({ where: { email:email } });
    }else{
        user = await User.findOne({ where: { username:username } });
    }
    //Password check
    if (!user) return response.status(400).send({
        message: 'Akun belum terdaftar'
    });
    const pswd = await bcrypt.compare(password, user.password);
    if (!pswd) return response.status(400).send({
        message: 'Kredensial salah'
    });
    // Assign Token
    let payload = {
        uid: user.id,
    }
    const token = jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '1d'});
    response.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    response.status(200).header('auth-token', token)
            .send({
                token: token,
                auth: true,
            });
};

exports.session = async (request, response) => {
    let token = request.body.token;
    console.log(token)
    if(!token) return response.status(401).send({ auth: false, message: 'Akses dicekal' });
    try {
        jwt.verify(token, process.env.SECRET_KEY, async function (error, decoded) {
            if (error) return response.status(500).send({ auth: false, message: 'Token tidak valid' });
                const uid = decoded.uid;
                console.log('authenticate')
                response.status(200).header('auth-token', token)
                        .send({
                            token: token,
                            auth: true,
                        });
        });
    }catch(error){
        response.status(400).send(error || 'Token tidak valid');
    }
}

exports.logout = async (request, response) => {
    response.cookie('jwt', '', { maxAge: 1 });
    response.status(200).send({ 
        message: 'Logout berhasil',
        auth: false, token: null 
    });
}

// Select All
exports.all = async (request, response) => {

};

// Find One
exports.findOne = (request, response) => {

};

// Update
exports.update = async (request, response) => {
    const ID = request.params.id ? 
               request.params.id : request.user.id;
    //hash
    const salt = await bcrypt.genSalt(10);
    let hashPassword  = ''
    if (typeof request.body.password == 'undefined') {
        hashPassword = request.user.password
    } else {
        hashPassword = await bcrypt.hash(request.body.password, salt);
    }
    // const password = request.body.password ? request.body.password : request.user.password
    const user = {
        username: request.body.username,
        email: request.body.email,
        password: hashPassword
    }
    User.update(user, { where: { id: ID }})
        .then((result) => {
            if ( result == 1 ) {
                response.status(200).send({
                    message: "Informasi pengguna berhasil diperbarui"
                });
            } else {
                response.status(403).send({
                    message: `Gagal memperbarui data pengguna`,
                    error: "Don't have access to do this action"
                })
            }
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperbarui data pengguna`,
                error: err.message
            })
        });
}

// Delete
exports.delete = (request, response) => {

};

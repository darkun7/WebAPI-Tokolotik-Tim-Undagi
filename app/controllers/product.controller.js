const db = require("../models");
const Product = db.products;
const Op = db.Sequelize.Op;

// Create
exports.create = async (request, response) => {
    const product = {
        user_id = request.body.user_id,
        product_ext_id: request.body.product_ext_id,
        product_name: request.body.product_name,
    }

    Product.create(product)
        .then((result) => {
            response.status(200).send(result);
        }).catch((err) => {
            response.status(500).send({message: err.message || "Gagal Membuat Akun"})
        })
};

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

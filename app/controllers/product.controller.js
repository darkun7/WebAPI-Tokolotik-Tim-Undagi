const db = require("../models");
const Product = db.products;
const Op = db.Sequelize.Op;

// Create
exports.create = async (request, response) => {
    const product = {
        storeId = request.body.storeId,
        tokopediaProductId: request.body.tokopediaProductId ? request.body.tokopediaProductId : '',
        tokopediaProductUrl: request.body.tokopediaProductUrl ? request.body.tokopediaProductUrl : '',
        productName: request.body.productName,
        price: request.body.price,
        image: request.body.image,
    }

    Product.create(product)
        .then((data) => {
            response.status(201).send(data);
        }).catch((err) => {
            response.status(500).send({
                message: err.message || 'Gagal membuat produk'
            });
        });
};

// Select All
exports.global = async (request, response) => {
    Product.findAll()
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message:
                    err.message || "Gagal memperoleh produk"
            });
        });
};

// Select All From User
exports.all = async (request, response) => {
    const storeId = request.body.storeId;
    Product.findAll({ where: { storeId: storeId } })
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message:
                    err.message || "Gagal memperoleh produk"
            });
        });
};


// Find One
exports.findOne = (request, response) => {
    const id = request.params.id;

    Product.findByPk(id)
        .then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send({
                message: "Error retrieving product with id=" + id
            });
        });
};

// Update
exports.update = (request, response) => {

};

// Delete
exports.delete = (request, response) => {

};

const db = require("../models");
const Product = db.products;
const Op = db.Sequelize.Op;

// Create
exports.create = async (request, response) => {
    const product = {
        storeId : request.body.storeId ? request.body.storeId : response.locals.storeID,
        tokopediaProductId: request.body.tokopediaProductId,
        tokopediaProductUrl: request.body.tokopediaProductUrl ? request.body.tokopediaProductUrl : '',
        productName: request.body.productName,
        price: request.body.price,
        image: request.body.image ? request.body.image: '',
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

// Select All record from Store
exports.all = async (request, response) => {
    const storeId = request.body.storeId ? 
                    request.body.storeId : response.locals.ID;
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
    const ID = request.params.id ? 
               request.params.id : response.locals.ID;
    Product.findByPk(ID)
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperoleh data dengan ID: ${ID}` || err.message
            });
        });
};

// Update
exports.update = (request, response) => {
    const ID = request.params.id ? 
               request.params.id : response.locals.ID;
    Product.update(request.body, { where: { id: ID }})
        .then((result) => {
            if ( result == 1 ) {
                response.status(200).send({
                    message: "Informasi produk berhasil diperbarui"
                });
            } else {
                response.status(500).send({
                    message: `Gagal memperbarui data dengan ID: ${ID}`
                })
            }
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperbarui data dengan ID: ${ID}` || err.message
            })
        });
};

// Delete
exports.delete = (request, response) => {
    const ID = request.params.id ? 
               request.params.id : response.locals.ID;
    Product.destroy({ where: { id: ID } })
        .then((result) => {
            if (result == 1) {
                response.status(200).send({
                    message: "Produk berhasil dihapus"
                })
            } else {
                response.status(500).send({
                    message: `Gagal menghapus data dengan ID: ${ID}`
                })
            }})
        .catch((err) => {
            response.status(500).send({
                message: `Gagal menghapus data dengan ID: ${ID}` || err.message
            })
        });
};
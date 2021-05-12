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
                message: "Gagal membuat produk",
                error: err.message
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
                message: "Gagal memperoleh produk",
                error: err.message
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
                message: "Gagal memperoleh produk",
                error: err.message
            });
        });
};


// Find One
exports.findOne = (request, response) => {
    const ID = request.params.id ? 
               request.params.id : response.locals.productID;
    Product.findByPk(ID)
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperoleh data dengan ID: ${ID}`,
                error: err.message
            });
        });
};

// Find One, Product of
exports.findOneProductOfStore = (request, response) => {
    const ID_STORE = response.locals.storeID
    const ID_PRODUCT = response.locals.productID ? 
               response.locals.productID : request.params.id;
    Product.findAll({ where: { id: ID_PRODUCT, storeId: ID_STORE } })
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperoleh data dengan ID: ${ID_PRODUCT}`,
                error: err.message
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
                response.status(403).send({
                    message: `Gagal memperbarui data dengan ID: ${ID}`,
                    error: "Don't have access to do this action"
                })
            }
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperbarui data dengan ID: ${ID}`,
                error: err.message
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
                response.status(403).send({
                    message: `Gagal menghapus data dengan ID: ${ID}`,
                    error: "Don't have access to do this action"
                    
                })
            }})
        .catch((err) => {
            response.status(500).send({
                message: `Gagal menghapus data dengan ID: ${ID}`,
                error: err.message
            })
        });
};
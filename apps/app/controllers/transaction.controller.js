const db = require("../models");
const Transaction = db.transactions;
const Product = db.products;
const CompositionDetail = db.compositionDetails;
const Op = db.Sequelize.Op;

// Create
exports.create = async (request, response) => {
    const transaction = {
        storeId: response.locals.storeID,
        productId : request.body.productId ? request.body.productId : response.locals.productID,
        time: request.body.time,
        amount: request.body.amount
    }
    
    Transaction.create(transaction)
        .then((data) => {
            response.status(201).send(data);
        }).catch((err) => {
            response.status(500).send({
                message: "Gagal menambah data transaksi produk",
                error: err.message
            });
        });
};

// Select All
exports.global = async (request, response) => {
    Transaction.findAll()
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: "Gagal memperoleh data transaksi produk",
                error: err.message
            });
        });
};

// Select All record from Product
exports.all = async (request, response) => {
    const productId = request.body.productId ? 
                      request.body.productId : response.locals.productID;
    Transaction.findAll({ where: { productId: productId } })
        .then((data) => {
            Product.findByPk(productId, { include: {model: CompositionDetail, include: ["composition"] ,
                                                    attributes:['compositionId', 'amount']} })
            .then((dataProduct) => {
                response.send({ transaction: data, product: dataProduct});
            })
        }).catch((err) => {
            response.status(500).send({
                message: "Gagal memperoleh transaksi produk",
                error: err.message
            });
        });
};


// Find One
exports.findOne = (request, response) => {
    const ID = request.params.id ? 
               request.params.id : response.locals.ID;
    Transaction.findByPk(ID, { include: [{model: Product, include: [CompositionDetail] }] })
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperoleh data transaksi produk`,
                error: err.message
            });
        });
};

// Find OneperMonth
// exports.findOnePerMonth = (request, response) => {
//     const ID = request.params.id ? 
//                request.params.id : response.locals.ID;
//     Transaction.findByPk(ID, { include: [{model: Product, include: [CompositionDetail] }] })
//         .then((data) => {
//             response.send(data);
//         }).catch((err) => {
//             response.status(500).send({
//                 message: `Gagal memperoleh data transaksi produk`,
//                 error: err.message
//             });
//         });
// };


// Update
exports.update = (request, response) => {
    const ID = request.params.id ? 
               request.params.id : response.locals.ID;
    Transaction.update(request.body, { where: { id: ID }})
        .then((result) => {
            if ( result == 1 ) {
                response.status(200).send({
                    message: "Informasi transaksi produk berhasil diperbarui"
                });
            } else {
                response.status(403).send({
                    message: `Gagal memperbarui data transaksi produk`,
                    error: "Don't have access to do this action"
                })
            }
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperbarui data transaksi produk`,
                error: err.message
            })
        });
};

// Delete
exports.delete = (request, response) => {
    const ID = request.params.id ? 
               request.params.id : response.locals.ID;
    Transaction.destroy({ where: { id: ID } })
        .then((result) => {
            if (result == 1) {
                response.status(200).send({
                    message: "Transaksi produk berhasil dihapus"
                })
            } else {
                response.status(403).send({
                    message: `Gagal menghapus data transaksi produk`,
                    error: "Don't have access to do this action"
                })
            }})
        .catch((err) => {
            response.status(500).send({
                message: `Gagal menghapus data transaksi produk`,
                error: err.message
            })
        });
};

// Select All by User
exports.allByUser = async (request, response) => {
    const storeId = request.body.storeId ? 
                    request.body.storeId : response.locals.storeID;
    Transaction.findAll({ where: { storeId: storeId }, include: ["product"],limit: 50 })
        .then((data) => {
                response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: "Gagal memperoleh transaksi produk",
                error: err.message
            });
        });
};
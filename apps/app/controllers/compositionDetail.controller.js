const db = require("../models");
const CompositionDetail = db.compositionDetails;
const Product = db.products;
const Op = db.Sequelize.Op;

// Create
exports.create = async (request, response) => {
    const compositionDetail = {
        productId : request.body.productId ? request.body.productId : response.locals.productID,
        compositionId: request.body.compositionId,
        amount: request.body.amount ? request.body.amount : 1,
    }
    Product.findOne({ where: { id: compositionDetail.productId}, include: [{model:CompositionDetail,attributes:["id"]}]})
        .then((comp) => {
            let idProdComp = comp.composition_details
            let idComp = []
            idProdComp.forEach(function(item) {
                idComp.push(item.id)
            });
            let input= compositionDetail.compositionId
            if (idComp.includes(input)){
                response.status(500).send({
                    message: "Gagal menambah data bahan baku produk",
                    error: "composition already exist"
                });
            }
            CompositionDetail.create(compositionDetail)
                .then((data) => {
                    response.status(201).send(data);
                }).catch((err) => {
                    response.status(500).send({
                        message: "Gagal menambah data bahan baku produk",
                        error: err.message
                    });
                });
        });
};

// Select All
exports.global = async (request, response) => {
    CompositionDetail.findAll()
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: "Gagal memperoleh data bahan baku produk",
                error: err.message
            });
        });
};

// Select All record from Store
exports.all = async (request, response) => {
    const productId = request.body.productId ? 
                    request.body.productId : response.locals.productID;
    CompositionDetail.findAll({ where: { productId: productId }, include: ["composition", "product"] })
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: "Gagal memperoleh bahan baku produk",
                error: err.message
            });
        });
};


// Find One
exports.findOne = (request, response) => {
    const ID = request.params.id ? 
               request.params.id : response.locals.ID;
    CompositionDetail.findByPk(ID, { include: ["composition", "product"] })
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperoleh data bahan baku produk`,
                error: err.message
            });
        });
};

// Update
exports.update = (request, response) => {
    const ID = request.params.id ? 
               request.params.id : response.locals.ID;
    CompositionDetail.update(request.body, { where: { id: ID }})
        .then((result) => {
            if ( result == 1 ) {
                response.status(200).send({
                    message: "Informasi bahan baku produk berhasil diperbarui"
                });
            } else {
                response.status(403).send({
                    message: `Gagal memperbarui data bahan baku produk`,
                    error: "Don't have access to do this action"
                })
            }
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperbarui data bahan baku produk`,
                error: err.message
            })
        });
};

// Delete
exports.delete = (request, response) => {
    const ID = request.params.id ? 
               request.params.id : response.locals.ID;
    CompositionDetail.destroy({ where: { id: ID } })
        .then((result) => {
            if (result == 1) {
                response.status(200).send({
                    message: "Bahan baku berhasil dihapus"
                })
            } else {
                response.status(403).send({
                    message: `Gagal menghapus data bahan baku produk`,
                    error: "Don't have access to do this action"
                })
            }})
        .catch((err) => {
            response.status(500).send({
                message: `Gagal menghapus data bahan baku produk`,
                error: err.message
            })
        });
};
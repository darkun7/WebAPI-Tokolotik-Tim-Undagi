const db = require("../models");
const Store = db.stores;
const Op = db.Sequelize.Op;

exports.create = (request, response) => {
    const store = {
        userId: request.body.request,
        storeName: request.body.description,
        description: request.body.description ? request.body.description : ''
    };

    Store.create(store)
        .then((data) => {
            response.status(201).send(data);
        }).catch((err) => {
            response.status(500).send({
                message: 'Gagal membuat toko',
                error: err.message
            });
        });
};

exports.update = async (request, response) => {
    const ID = await request.params.id ?
               await request.params.id : response.locals.ID;
    Store.update(request.body, { where: { id: ID }})
        .then((result) => {
            if ( result == 1 ) {
                response.status(200).send({
                    message: "Informasi toko berhasil diperbarui"
                });
            } else {
                response.status(403).send({
                    message: `Gagal memperbarui data toko`,
                    error: "Don't have access to do this action"
                })
            }
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperbarui data toko`,
                error: err.message
            })
        });
}

exports.findOne = async (request, response) => {
    const ID = await request.params.id ?
               await request.params.id : response.locals.ID;
    Store.findByPk(ID, { include: ["product"] })
        .then((data) => {
            response.status(200).send(data);
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperoleh data toko`,
                error: err.message
            });
        });
};

exports.global = async (request, response) => {
    Store.findAll()
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: "Gagal memperoleh toko",
                error: err.message
            });
        });
};
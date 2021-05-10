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
                message: err.message || 'Gagal membuat toko'
            });
        });
};

exports.update = (request, response) => {
    const ID = request.params.id ? 
               request.params.id : response.locals.ID;
    Store.update(request.body, { where: { id: ID }})
        .then((result) => {
            if ( result == 1 ) {
                response.status(200).send({
                    message: "Informasi toko berhasil diperbarui"
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
}

exports.findOne = (request, response) => {
    const ID = request.params.id ? 
               request.params.id : response.locals.ID;
    Store.findByPk(ID)
        .then((data) => {
            response.status(200).send(data);
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperoleh data dengan ID: ${ID}` || err.message
            });
        });
};
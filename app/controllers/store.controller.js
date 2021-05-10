const db = require("../models");
const Stores = db.stores;
const Op = db.Sequelize.Op;

exports.create = (request, response) => {
    const store = {
        userId: request.body.request,
        storeName: request.body.description,
        description: request.body.description ? request.body.description : ''
    };

    Store.create(store)
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: err.message || 'Gagal membuat toko'
            });
        });
};
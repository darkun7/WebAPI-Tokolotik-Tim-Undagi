const db = require("../models");
const Composition = db.compositions;
const Op = db.Sequelize.Op;

// Create
exports.create = async (request, response) => {
    const composition = {
        storeId : request.body.storeId ? request.body.storeId : response.locals.storeID,
        compositionName: request.body.compositionName,
        unit: request.body.unit ? request.body.unit : '',
    }

    Composition.create(composition)
        .then((data) => {
            response.status(201).send(data);
        }).catch((err) => {
            response.status(500).send({
                message: "Gagal membuat bahan baku",
                error: err.message
            });
        });
};

// Select All
exports.global = async (request, response) => {
    Composition.findAll()
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: "Gagal memperoleh bahan baku",
                error: err.message
            });
        });
};

// Select All record from Store
exports.all = async (request, response) => {
    const storeId = request.body.storeId ? 
                    request.body.storeId : response.locals.storeID;
    Composition.findAll({ where: { storeId: storeId } })
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: "Gagal memperoleh bahan baku",
                error: err.message
            });
        });
};


// Find One
exports.findOne = (request, response) => {
    const ID = request.params.id ? 
               request.params.id : response.locals.ID;
    Composition.findByPk(ID)
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperoleh data dengan ID: ${ID}`,
                error: err.message
            });
        });
};

// Find One, Composition of
exports.findOneCompositionOfStore = (request, response) => {
    const ID_STORE = request.body.storeId ? 
                     request.body.storeId : response.locals.storeID;
    const ID       = request.params.id ?
                     request.params.id : response.locals.ID;
    Composition.findAll({ where: { id: ID, storeId: ID_STORE } })
        .then((data) => {
            response.send(data);
        }).catch((err) => {
            response.status(500).send({
                message: `Gagal memperoleh data dengan ID: ${ID}`,
                error: err.message
            });
        });
};

// Update
exports.update = (request, response) => {
    const ID = request.params.id ? 
               request.params.id : response.locals.ID;
    Composition.update(request.body, { where: { id: ID }})
        .then((result) => {
            if ( result == 1 ) {
                response.status(200).send({
                    message: "Informasi bahan baku berhasil diperbarui"
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
    Composition.destroy({ where: { id: ID } })
        .then((result) => {
            if (result == 1) {
                response.status(200).send({
                    message: "Bahan baku berhasil dihapus"
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
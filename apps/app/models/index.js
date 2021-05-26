const env = require('dotenv');
env.config();

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host         : process.env.DB_HOST,
    dialect      : 'mysql',
    operatorAlias: false,
    pool         : {
        max    : parseInt(process.env.DB_POOL_MAX),
        min    : parseInt(process.env.DB_POOL_MIN),
        acquire: parseInt(process.env.DB_ACQUIRE),
        idle   : parseInt(process.env.DB_POOL_IDLE),
    }
});

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// DB Table
db.users = require("./user.model.js")(sequelize, Sequelize);
db.stores = require("./store.model.js")(sequelize, Sequelize);
db.products = require("./product.model.js")(sequelize, Sequelize);
db.compositions = require("./composition.model.js")(sequelize, Sequelize);
db.compositionDetails = require("./compositionDetail.model.js")(sequelize, Sequelize);
db.transactions = require("./transaction.model.js")(sequelize, Sequelize);

//DB Relation
db.users.hasOne(db.stores, {
    onDelete: "cascade", foreignKey: 'userId', as: 'store',
});

db.stores.hasMany(db.products, {
    onDelete: "cascade", as: 'product',
});

db.products.belongsTo(db.stores, {
    foreignKey: 'storeId', as: 'store',
});
db.products.hasMany(db.compositionDetails, {
    onDelete: "cascade",
});

db.compositions.belongsTo(db.stores, {
    foreignKey: 'storeId', as: 'store',
});
db.compositions.hasMany(db.compositionDetails, {
    onDelete: "cascade",
});


db.compositionDetails.belongsTo(db.products, {
    foreignKey: 'productId', as: 'product',
});

db.compositionDetails.belongsTo(db.compositions, {
    foreignKey: 'compositionId', as: 'composition',
});

db.products.hasMany(db.transactions, {
    onDelete: "cascade", as: 'transaction',
});


db.stores.hasMany(db.transactions, {
    onDelete: "cascade", as: 'transaction',
});
db.transactions.belongsTo(db.products, {
    foreignKey: 'productId'
});

module.exports = db;



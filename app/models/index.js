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



module.exports = db;



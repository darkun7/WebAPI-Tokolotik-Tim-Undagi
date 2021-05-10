module.exports = (sequelize, DataTypes) => {
    const Store = sequelize.define("store", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        storeName: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.TEXT,
        },
    });

    return Store;
}
module.exports = (sequelize, DataTypes) => {
    const Store = sequelize.define("store", {
        storeName: {
            type: DataTypes.STRING,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
    });

    return Store;
}
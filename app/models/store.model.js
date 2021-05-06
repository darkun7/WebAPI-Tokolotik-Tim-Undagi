module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("store", {
        ownerId: {
            type: DataTypes.INTEGER,
        },
        storeName: {
            type: DataTypes.STRING,
        },
        StoreDescription: {
            type: DataTypes.TEXT,
        },
    });

    return User;
}
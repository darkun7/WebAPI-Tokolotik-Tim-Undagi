module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("composition", {
        storeId: {
            type: DataTypes.INTEGER,
        },
        compositionName: {
            type: DataTypes.INTEGER,
        },
        unit: {
            type: DataTypes.STRING,
        },
    });

    return User;
}
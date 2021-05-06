module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("composition_detail", {
        compositionId: {
            type: DataTypes.INTEGER,
        },
        productId: {
            type: DataTypes.INTEGER,
        },
        amount: {
            type: DataTypes.INTEGER,
        },
    });

    return User;
}
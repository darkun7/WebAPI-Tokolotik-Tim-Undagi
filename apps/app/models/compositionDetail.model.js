module.exports = (sequelize, DataTypes) => {
    const compositionDetail = sequelize.define("composition_detail", {
        compositionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    });

    return compositionDetail;
}
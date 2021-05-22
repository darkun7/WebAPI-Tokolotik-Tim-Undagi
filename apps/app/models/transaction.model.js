module.exports = (sequelize, DataTypes) => {
    const transaction = sequelize.define("transaction", {
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        time: {
            type: DataTypes.DATE(6),
            allowNull: false,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    });

    return transaction;
}
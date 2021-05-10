module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("product", {
        tokopediaProductId: {
            type: DataTypes.INTEGER,
        },
        tokopediaProductUrl: {
            type: DataTypes.INTEGER,
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
        },
    });

    return Product;
}
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("product", {
        productName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
        },
        tokopediaProductId: {
            type: DataTypes.INTEGER,
        },
        tokopediaProductUrl: {
            type: DataTypes.STRING,
        },
    });

    return Product;
}
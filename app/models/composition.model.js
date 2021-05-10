module.exports = (sequelize, DataTypes) => {
    const composition = sequelize.define("composition", {
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        compositionName: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        unit: {
            type: DataTypes.STRING,
        },
    });

    return composition;
}
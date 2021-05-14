module.exports = (sequelize, DataTypes) => {
    const composition = sequelize.define("composition", {
        compositionName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        unit: {
            type: DataTypes.STRING,
        },
    });

    return composition;
}
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("users", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: "Oops.. Nama pengguna sudah terdaftar"
            },
            len: [6,12] //validation length still not working
        },
        email: {
            type: DataTypes.STRING,
            validate: { isEmail:true },
            allowNull: false,
            unique: {
                args: true,
                msg: "Oops.. Alamat email sudah terdaftar"
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        verifiedEmail: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        profileImage: {
            type: DataTypes.STRING
        },
        tokenTokopedia: {
            type: DataTypes.STRING
        }
    });

    return User;
}
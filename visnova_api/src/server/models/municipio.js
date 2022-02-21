module.exports = (sequelize, DataTypes) => {
    return sequelize.define('municipio', {
        idmuni: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		nombre: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		provId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		precioEnvio:{
			type: DataTypes.DOUBLE,
			allowNull: false,
		}
    }, {
        tableName: 'municipio'
    });
};

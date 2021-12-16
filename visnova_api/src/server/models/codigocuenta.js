module.exports = (sequelize, DataTypes) => {
    return sequelize.define('codigocuenta', {
        id_codigo: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		id_usuario: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		codigo: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		fecha: {
			type: DataTypes.DATE,
			allowNull: false
		},
    }, {
        tableName: 'codigocuenta'
    });
};

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('compra', {
        idCompra: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		nombre: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		descripcion: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		precio: {
			type: DataTypes.DOUBLE,
			allowNull: false
		},
        disponible:{
            type: DataTypes.BOOLEAN,
			allowNull: false
        },
    }, {
        tableName: 'compra'
    });
};

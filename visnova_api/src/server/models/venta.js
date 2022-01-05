module.exports = (sequelize, DataTypes) => {
    return sequelize.define('venta', {
        idventa: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		iduser: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		fecha: {
			type: DataTypes.DATE,
			allowNull: false
		},
		idProd: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		precio: {
            type: DataTypes.DOUBLE,
			allowNull: true
        },
		idestado:{
			type: DataTypes.INTEGER,
			allowNull: false,
		},
    }, {
        tableName: 'venta'
    });
};

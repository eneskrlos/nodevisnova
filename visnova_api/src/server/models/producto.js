module.exports = (sequelize, DataTypes) => {
    return sequelize.define('producto', {
        idProd: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		descripcion: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		tipoProd: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		material: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
        tipoMaterial:{
            type: DataTypes.INTEGER,
			allowNull: true
        },
        precio: {
            type: DataTypes.DOUBLE,
			allowNull: true
        },
        activo: {
            type: DataTypes.BOOLEAN,
			allowNull: false
        },
        fotoprod1:{
            type: DataTypes.STRING(255),
			allowNull: true
        },
        fotoprod2:{
            type: DataTypes.STRING(255),
			allowNull: true
        },
        fotoprod3:{
            type: DataTypes.STRING(255),
			allowNull: true
        },
        cantDisponible: {
            type: DataTypes.INTEGER,
			allowNull: false
        },
    }, {
        tableName: 'producto'
    });
};

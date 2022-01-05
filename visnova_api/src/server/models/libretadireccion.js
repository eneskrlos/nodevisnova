module.exports = (sequelize, DataTypes) => {
    return sequelize.define('libretadireccion', {
        idLD: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		numero: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		direccion: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		municipio: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		provincia: {
            type: DataTypes.STRING(255),
			allowNull: true
        },
		userId:{
			type: DataTypes.INTEGER,
			allowNull: true,
		},
    }, {
        tableName: 'libretadireccion'
    });
};

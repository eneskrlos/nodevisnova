module.exports = (sequelize, DataTypes) => {
    return sequelize.define('servicio', {
        idServicio: {
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
        disponibilidad:{
            type: DataTypes.BOOLEAN,
			allowNull: false
        },
		en_promosion:{
            type: DataTypes.BOOLEAN,
		 	allowNull: false
        },
    }, {
        tableName: 'servicio'
    });
};

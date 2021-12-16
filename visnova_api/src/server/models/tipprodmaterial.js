module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tipprodmaterial', {
        idPk: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		idFk: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		nombre: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
    }, {
        tableName: 'tipprodmaterial'
    });
};

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('estado', {
        idestado: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		nombre: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
    }, {
        tableName: 'estado'
    });
};

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('token', {
        id_token: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		confirmado: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		token: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		fecha: {
			type: DataTypes.DATE,
			allowNull: false
		},
    }, {
        tableName: 'token'
    });
};

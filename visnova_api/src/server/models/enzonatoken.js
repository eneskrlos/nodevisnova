module.exports = (sequelize, DataTypes) => {
    return sequelize.define('enzonatoken', {
        identoken: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		access_token: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		scope: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		token_type: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		expires_in: {
            type: DataTypes.INTEGER,
			allowNull: false
        },
		fecha: {
			type: DataTypes.DATE,
			allowNull: false
		},
    }, {
        tableName: 'enzonatoken'
    });
};

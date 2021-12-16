module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		user: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		pass: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		correo: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		pconfirmado:{
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		roleId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		show: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		activate: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	}, {
		tableName: 'user'
	});
};

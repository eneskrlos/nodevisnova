module.exports = (sequelize, DataTypes) => {
	return sequelize.define('role_permission', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		roleId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		permissionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		}
	}, {
		tableName: 'role_permission'
	});
};

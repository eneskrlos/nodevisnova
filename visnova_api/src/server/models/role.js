module.exports = (sequelize, DataTypes) => {
	return sequelize.define('role', {
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
		show: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		deleted: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	}, {
		tableName: 'role'
	});
};

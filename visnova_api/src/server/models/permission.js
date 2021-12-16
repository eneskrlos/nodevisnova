module.exports = (sequelize, DataTypes) => {
	return sequelize.define('permission', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		show: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
	}, {
		tableName: 'permission'
	});
};

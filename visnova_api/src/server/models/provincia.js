module.exports = (sequelize, DataTypes) => {
    return sequelize.define('provincia', {
        idprov: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		nombre: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
    }, {
        tableName: 'provincia'
    });
};

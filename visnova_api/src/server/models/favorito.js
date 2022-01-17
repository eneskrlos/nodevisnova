module.exports = (sequelize,DataTypes) => {
    return sequelize.define('favorito',{
        idFavor: {
            type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
			allowNull: false
        },
        prodId: {
            type: DataTypes.INTEGER,
			allowNull: false
        }
    }, {
        tableName: 'favorito'
    });
};
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('logs', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user: {
            type: DataTypes.STRING,
            allowNull: false
        },
        action: {
            type: DataTypes.STRING,
            allowNull: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date()
        },
        response: {
            type: DataTypes.STRING,
            allowNull: true
        },
        
    }, {
        tableName: 'logs'
    });
};

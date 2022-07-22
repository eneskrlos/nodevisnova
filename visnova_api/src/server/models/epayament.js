module.exports = (sequelize, DataTypes) => {
    return sequelize.define('epayament', {
        idpayament: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		transaction_uuid:{
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		currency: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false
		},
		status_code: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		status_denom: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		invoice_number:{
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		merchant_op_id:{
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		terminal_id:{
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		amount: {
            type: DataTypes.STRING,
			allowNull: false
        },
		items:{
			type: DataTypes.STRING,
			allowNull: false,
		},
		links:{
			type: DataTypes.STRING,
			allowNull: false,
		},
		commission: {
			type: DataTypes.STRING,
			allowNull: false,
		},
    }, {
        tableName: 'epayament'
    });
};

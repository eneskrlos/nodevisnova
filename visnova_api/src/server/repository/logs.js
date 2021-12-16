const Op = require('sequelize').Op;
module.exports = {
    create (logs) {
        return _database.zunpc.model.logs.create(logs);
    },

    list () {
        return _database.zunpc.model.logs.findAll();
    },

    getByDate (startDate, endDate, entityId) {
        return _database.zunpc.model.logs.findAll({
            where: {
                date:{
                    [Op.between]: [startDate, endDate]
                },
                entityId: entityId,
            }
        })
    },

    getByDateAndUser (startDate, endDate, entityId, user) {
        return _database.zunpc.model.logs.findAll({
            where: {
                date:{
                    [Op.between]: [startDate, endDate]
                },
                entityId: entityId,
                user: {
                    [Op.like]: '%' + user + '%'
                }
            }
        })
    },
};

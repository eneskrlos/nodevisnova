exports.Logs = {
    listAll (req, res) {
        _database.zunpc.repository.logs.list().then(data => {
            _useful.log('logs.js').info('Listó los logs de auth',req.user.nick,JSON.stringify(data));
            return res.send(data);
        }).catch(error => {
            _useful.log('logs.js').error('No se pudo listar los logs de auth',req.user.nick,error);
            return res.sendStatus(500);
        })
    },

    getByDate (req, res) {
        const date = req.body[0];
        const entityId = req.body[1];
        const entity = req.body[2];
        const user = req.body[3];
        const startDate = new Date(date);
        const endDate = new Date(date);
        startDate.setUTCHours (0, 0, 0, 0);
        endDate.setUTCHours (23, 59, 59, 999);
        if (user === undefined || user === "" || user === null) {
            _database.zunpc.repository.logs.getByDate(startDate.toISOString(), endDate.toISOString(), entity.id).then(data => {
                _useful.log('logs.js').info('Listó los logs de auth por date',req.user.nick,JSON.stringify(data));
                return res.send(data);
            }).catch(error => {
                _useful.log('logs.js').error('No se pudo listar los logs de auth por date',req.user.nick,error);
                return res.sendStatus(500);
            })
        } else {
            _database.zunpc.repository.logs.getByDateAndUser(startDate.toISOString(), endDate.toISOString(), entity.id, user).then(data => {
                _useful.log('logs.js').info('Listó los logs de auth por date y filtro de user',req.user.nick,JSON.stringify(data));
                return res.send(data);
            }).catch(error => {
                _useful.log('logs.js').error('No se pudo listar los logs de auth por date y filtro de user',req.user.nick,error);
                return res.sendStatus(500);
            })
        }
    },

    new (req, res) {
        let logs = req.body;
        if (!logs) return res.sendStatus(400);
        _database.zunpc.repository.logs.create(logs).then(response => {
            _useful.log('logs.js').info('Creó un log',req.user.nick,JSON.stringify(response));
            return res.send(response);
        }).catch(error => {
            _useful.log('logs.js').error('No se creó el log',req.user.nick,error);
            return res.sendStatus(500);
        })
    },
};

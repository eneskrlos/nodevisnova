const Config = require('./lib/config');
const Log = require('./lib/log');
const Terminal = require('./lib/terminal');
const Database = require('./lib/database');
const initDbConfig = require('./src/server/models');

_config = new Config(__dirname);
_logs = new Log(_config.Log,_config.Mode);
_terminal = new Terminal(_config.Mode);
_database = new Database(__dirname,_config.Database);

initDbConfig.initConfigurations();
console.log("Sync all tables");
_database.zunpc.sync({force: true}).then(() => {
	console.log("Initial load data");
	initDbConfig.seed().then(() => {
		console.log("Done");
		process.exit();
	});
});



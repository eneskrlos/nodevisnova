let startTimeInit = new Date();

const Config = require('./lib/config');
const Log = require('./lib/log');
const Terminal = require('./lib/terminal');
const Database = require('./lib/database');
const Express = require('./lib/express');
const ViewEngine = require('./lib/viewengine');
const Useful = require('./lib/useful');
const App = require('./lib/app');

_config = new Config(__dirname);
_terminal = new Terminal(_config.Mode);
_logs = new Log(_config.Log,_config.Mode);
_viewengine = new ViewEngine(__dirname);
_database = new Database(__dirname,_config.Database);
_express = new Express(__dirname);
_useful = new Useful();
let app = new App(__dirname,startTimeInit);




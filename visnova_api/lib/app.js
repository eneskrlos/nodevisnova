const https = require('https');
const http = require('http');

module.exports = class ZunMk{

    constructor(rootpath,startTime){

        let initDbConfig = require(`${rootpath}/src/server/models/index`);
        initDbConfig.initConfigurations();

        this.initServer().then( () => {
            console.log('\x1b[37m%s\x1b[0m', '---APP('+ (new Date() - startTime) / 1000 +'s)---');
            console.log('\x1b[32m%s\x1b[0m', ' - Server listen https port: ' + _config.Server.port + '\n');
            console.log('\x1b[32m%s\x1b[0m', ' - Server listen http port: ' + 3001 + '\n');
            _logs.logger('zunpc.js').info('Server listen https port: ' + _config.Server.port);
            _logs.logger('zunpc.js').info('Server listen http port: ' + 3001);
        }).catch((error,port) => {
            if(port){
                console.log('\x1b[31m[ERROR]\x1b[0m - %s', 'Don\'t start server properly by port: '+ port + '. ' + error.stack);
                _logs.logger('zunpc.js').error('Don\'t start server  by port: '+ port + '. ' + error.stack)
            }
            else{
                console.log('\x1b[31m[ERROR]\x1b[0m - %s', 'Don\'t start server properly. ' + error.stack);
                _logs.logger('zunpc.js').error('Don\'t start server properly. ' + error.stack);
            }
        });

    }

    initServer(){
        return new Promise(function (resolve,reject) {
            let credentials = { key: _config.Key, cert: _config.Cert };
            https.createServer(credentials, _express.getExpress).listen(_config.Server.port, error => {
                if(error){
                    reject(error);
                }
                else{
                    resolve();
                }
            });
            http.createServer(_express.getExpress).listen(3021, error => {
                if(error){
                    reject(error);
                }
                else{
                    resolve();
                }
            });
            http.createServer(_express.getExpress).listen(3001, error => {
                if(error){
                    reject(error);
                }
                else{
                    resolve();
                }
            });
        });
    }
};
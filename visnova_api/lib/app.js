const https = require('https');
const http = require('http');
var os = require('os');
var ifaces = os.networkInterfaces();

module.exports = class ZunMk{

    constructor(rootpath,startTime){

        let initDbConfig = require(`${rootpath}/src/server/models/index`);
        initDbConfig.initConfigurations();

        this.initServer().then( () => {
            var adr;
            Object.keys(ifaces).forEach(function (ifname) {
                var alias = 0;
                var address = '';
                
                ifaces[ifname].forEach(function (iface) {
                  if ('IPv4' === iface.family || iface.internal === false) {
                    address = iface.address;
                  }
                
                });
                adr = address;
              });
            console.log('\x1b[37m%s\x1b[0m', '---APP('+ (new Date() - startTime) / 1000 +'s)---');
            //console.log('\x1b[32m%s\x1b[0m', ' - Server listen https IP: '+ adr +' port: ' + _config.Server.httpsport + '\n');
            console.log('\x1b[32m%s\x1b[0m', ' - Server listen http IP: '+ adr +' port: ' + _config.Server.httpport + '\n');
            //_logs.logger('zunpc.js').info('Server listen https IP: '+ adr +' port: ' + _config.Server.httpsport);
            _logs.logger('zunpc.js').info('Server listen http IP: '+ adr +' port: ' + _config.Server.httpport);
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
            /* let credentials = { key: _config.Key, cert: _config.Cert };
            https.createServer(credentials, _express.getExpress).listen(_config.Server.httpsport, error => {
                if(error){
                    reject(error);
                }
                else{
                    resolve();
                }
            }); */
            /* http.createServer(_express.getExpress).listen(3021, error => {
                if(error){
                    reject(error);
                }
                else{
                    resolve();
                }
            }); */
            http.createServer(_express.getExpress).listen(_config.Server.httpport, error => {
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
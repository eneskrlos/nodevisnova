const fs = require('fs');

module.exports = class Config{

    constructor(path){
        try {
            this.config = JSON.parse(fs.readFileSync(path + '/config.json', "utf-8"));
            this.key = fs.readFileSync(path+'/'+this.Server.key, 'utf8');
            this.cert = fs.readFileSync(path+'/'+this.Server.cert, 'utf8');
        }
        catch (error) {
            console.log('\x1b[31m[ERROR]\x1b[0m - %s', 'Can\'t read configurations. ' + error.stack);
        }
    }

    get Server(){
        return this.config.server;
    }

    get Database(){
        return this.config.database;
    }

    /* get FTP(){
        return this.config.FTPMININT;
    }
     */

    get mailerconfig(){
        return this.config.mailerconfig;
    }

    get Log(){
        return this.config.log;
    }

    get Key(){
        return this.key;
    }

    get Cert(){
        return this.cert
    }

    get Mode(){
        return this.config.mode;
    }

    get AC(){
        return this.config.accessControl;
    }

    get Vinculos(){
        return this.config.vinculos;
    }
};

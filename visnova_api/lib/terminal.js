module.exports = class Terminal {

    constructor(mode){
        this.mode = mode;
    }

    log(value,user,category) {
        user = (user) ? user : 'system';
        console.log('\x1b[37m[DEFAULT] [\x1b[0m'+ category +'\x1b[37m] [\x1b[0m'+ user +'\x1b[37m]\x1b[0m - %s', value);
    }

    info(value,user,category) {
        user = (user) ? user : 'system';
        console.log('\x1b[36m[INFO] [\x1b[0m'+ category +'\x1b[36m] [\x1b[0m'+ user +'\x1b[36m]\x1b[0m - %s', value);
    }

    success(value,user,category) {
        user = (user) ? user : 'system';
        console.log('\x1b[32m[SUCCESS] [\x1b[0m'+ category +'\x1b[32m] [\x1b[0m'+ user +'\x1b[32m]\x1b[0m - %s', value);
    }

    error(value,error,user,category) {
        user = (user) ? user : 'system';
        error = (this.mode === 'dev') ? error.stack : error;
        console.log('\x1b[31m[ERROR] [\x1b[0m'+ category +'\x1b[31m] [\x1b[0m'+ user +'\x1b[31m]\x1b[0m - %s', value + ' ' + error);
    }

    warning(value,user,category) {
        user = (user) ? user : 'system';
        console.log('\x1b[33m[WARNING] [\x1b[0m'+ category +'\x1b[33m] [\x1b[0m'+ user +'\x1b[33m]\x1b[0m - %s', value);
    }

};
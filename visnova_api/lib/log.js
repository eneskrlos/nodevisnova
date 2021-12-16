const log4js = require('log4js');

module.exports = class Log {

    constructor(config,mode){
        this.mode = mode;
        this.config = config;
        log4js.configure({
            appenders: {
                config: {
                    type: 'dateFile',
                    alwaysIncludePattern: true,
                    filename: config.path,
                    pattern: '.yyyy-MM-dd',
                    daysToKeep: config.daysToKeep,
                    keepFileExt: true,
                    layout: {
                        type: 'pattern',
                        pattern: config.pattern
                    }}
            },
            categories: { default: { appenders: ['config'], level: config.level } }
        });
    }

    logger(category='', user='system', metadata=''){
        let logger = log4js.getLogger(category);
        logger.addContext('user', user);
        if(!this.config.verbose){
            metadata = '';
        }
        logger.addContext('metadata',metadata);
        return logger;
    }

};
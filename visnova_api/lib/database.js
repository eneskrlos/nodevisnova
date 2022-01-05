const Sequelize = require('sequelize');
const fs = require('fs');

module.exports = class DataBase{

    constructor(rootpath,config){
        if(_config.Mode === 'dev'){
            console.log('\x1b[36m%s\x1b[0m','Sequelize ZUNpc INFO:', new Date().toISOString() + '\n\tAdding connection to ' + config.zunpc.host + ':' + config.zunpc.port + '\n');
        }

        let dbs = {
            zunpc: this.initConfigmysql(config.zunpc),
            // zunpms: this.initConfig(config.zunpms),
            // zunpos: this.initConfig(config.zunpos),
        };

        this.loadModels(rootpath,dbs);
        this.loadRepositories(rootpath,dbs);

        return dbs;
    }

    initConfig(config){
        return new Sequelize({
            host: config.host,
            port: config.port,
            database: config.database,
            username: config.user,
            password: config.pass,
            dialect: 'mssql',
            dialectOptions: { //Only for mssql
                options: {
                    useUTC: false,
                    dateFirst: 1,
                }
            },
            logging: (_config.Mode === 'dev') ? console.log : false,
            define: {
                timestamps: false
            }
        });
    }

    initConfigmysql(config){
        return new Sequelize({
            host: config.host,
            port: config.port,
            database: config.database,
            username: config.user,
            password: config.pass,
            dialect: 'mysql',
            logging: (_config.Mode === 'dev') ? console.log : false,
            define: {
                timestamps: false
            }
        });
    }

    loadModels(rootpath,dbs) {
        let models = {};
        let files = fs.readdirSync(`${rootpath}/src/server/models`);
        if(files.length){
            try{
                files.forEach(file => {
                    file = file.replace(/\.js$/,'');
                    if(file !== 'index'){
                        models[file] = require(`${rootpath}/src/server/models/${file}`)(dbs.zunpc, Sequelize);
                    }
                });
            }
            catch (error) {
                _logs.logger('database.js', 'system','Error load model. ').error('Error load model. ' + error.stack);
            }
            dbs.zunpc.model = models;
        }
    }

    loadRepositories(rootpath, dbs) {
        let repositories = {};
        let files = fs.readdirSync(`${rootpath}/src/server/repository`);
        if(files.length){
            try {
                files.forEach(file => {
                    file = file.replace(/\.js$/,'');
                    repositories[file] = require(`${rootpath}/src/server/repository/${file}`);
                });
            }catch (error) {
                _logs.logger('database.js', 'system','Error load repository. ').error('Error load repository. ' + error.stack);
            }
            dbs.zunpc.repository = repositories;
        }
    }


    
};
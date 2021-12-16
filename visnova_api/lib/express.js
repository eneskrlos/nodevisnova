const express = require('express');
const cors = require('cors'); //Desabilitar cross-origin
const compression = require('compression');
const serveStatic = require('serve-static');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');

module.exports = class Express {

    constructor(rootpath) {
        this.app = express();
        this.configExpress(rootpath);
        this.loadRouting(rootpath);
    }

    configExpress(rootpath) {
        this.app.use(cors());
        this.app.use(compression());
        this.app.use('/', serveStatic(rootpath+"/src/www"));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(multer().single('file'));
    }

    loadRouting(rootpath) {
        let _this = this;
        fs.readdir(rootpath + "/src/server/routings", (err, items) => {
            if (!err) {
                try {
                    for (let file = 0; file < items.length; file++) {
                        let routing = JSON.parse(fs.readFileSync(rootpath + "/src/server/routings/" + items[file], "utf-8"));
                        for (let rout = 0; rout<routing.length; rout++) {
                            let values = {
                                permission: (routing[rout].permission) ? routing[rout].permission : null,
                                url: routing[rout].url,
                                method: routing[rout].method.toLowerCase(),
                                fn: require(rootpath + "/src/server/controllers/" + routing[rout].path.split(':')[0])[routing[rout].path.split(':')[1].split('.')[0]][routing[rout].path.split(':')[1].split('.')[1]]
                            };
                            this.app[values.method](values.url, _this.middleWare(values.permission), values.fn);
                        }
                    }
                    this.app.use((err,req,res,next) => {
                        console.log('\x1b[31m[ERROR] [\x1b[0mexpress.js\x1b[31m] [\x1b[0m%s\x1b[31m]\x1b[0m - %s',req.user?req.user.nick:'system',err.stack);
                        _logs.logger('express.js', req.user?req.user.nick:'system','Upss algo salio mal ').error(err.stack);
                        return res.sendStatus(500);
                    });
                    this.app.use((req,res,next) => {
                        return res.sendStatus(404);
                    });
                }
                catch (error) {
                    console.log('\x1b[31m[ERROR]\x1b[0m - %s', 'Error load routing. ' + error.stack);
                    _logs.logger('express.js', 'system','Error load routing. ').error('Error load routing. ' + error.stack);
                }
            }
            else {
                console.log('\x1b[31m[ERROR]\x1b[0m - %s', 'Error when tried to read dir \'routing\'. ' + error.stack);
                _logs.logger('express.js', 'system','Error load routing. ').error('Error when tried to read dir \'routing\'. ' + error.stack);
            }
        });
    }

    middleWare(permission){

        return (req, res, next) => {

            let user = {};
            let header = req.headers['authorization'];
            if(typeof header !== 'undefined') {
                let token = header.split(' ')[1];
                this.verifyToken(token).then(response => {
                    req.user = user = response.user;

                    if(permission && permission.length){
                        if (user.permission) {
                            for (let i = 0; i < permission.length; i++) {
                                if(user.permission.includes(permission[i])){
                                    return next();
                                }
                            }
                        }
                        return res.sendStatus(403);
                    }
                    else{
                        return next();
                    }

                }).catch(error => {
                    return res.sendStatus(403);
                });
            }
            else{
                let ip = req.connection.remoteAddress || req.headers['x-forwarded-for'];
                ip = ip.split(':')[ip.split(':').length - 1];
                if(ip === '1') ip = 'localhost';

                if(!permission || !permission.length) {
                    req.user = {
                        nick: `client[${ip}]`
                    };
                    return next();
                }
               else return res.sendStatus(403);
            }

        };
    };

    verifyToken (token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, _config.Server.jwt.secret, (error, token) => {
                if (error) reject(error);
                else resolve(token);
            })
        });
    }

    //metodo que verifica si el token que pasa por parametro es correcto.
    verifyTokenUser(token){
        return new Promise((resolve, reject) => {
            jwt.verify(token, _config.Server.jwt_user.secret, (error, token) => {
                if (error) resolve({code:500,message: 'Error al validadar token:' + error, data: null});
                else resolve({code:200,message: 'Token valido', data: token});
            })
        });
    }

    verifyhuespedToken (token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, _config.Server.jwt.secret, (error, token) => {
                if (error) resolve(500);
                else resolve(token);
            })
        });
    }

    get getExpress() {
        return this.app;
    }

};
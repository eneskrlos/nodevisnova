const moment = require('moment');
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');

module.exports = class Useful{

    constructor () {

    }

    get moment(){
        return moment;
    };

    get crypto(){
        return crypto;
    };

    encrypt (text) {
        let secret = '7TVEAMBK8ZK1EVELCOA3M2H51M3F0DCHB4EXIGCFINEP6O7N6FZB8F3LNMDL0HUU';
        return crypto.createHmac('sha256', secret).update(text,'ascii').digest('hex');
    };

    log(category) {
        return {
            info: (text,user,details) => {
                _terminal.info(text,user,category);
                _logs.logger(category,user,details).info(text);
            },
            error: (text,user,error) => {
                _terminal.error(text + ' ->',error,user,category);
                _logs.logger(category,user,error).error(text + ' ->');
            }
        }
    };

    initMulter (path, name, options) {
        options = (options) ? options : {};
        options.storage = multer.diskStorage({
            destination: function (req, file, cb) {
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path);
                }
                cb(null, path);
            },
            filename: function (req, file, cb) {
                let ext = file.originalname.split('.');
                let filename = name;
                let extension = ext[ext.length - 1].toLowerCase();
                filename = filename + '.' + extension;
                cb(null, filename);
            }
        });
        return multer(options).single('file');
    }

    uploadFile (req, res) {
        let current_time = new Date();
        let uploadFilename = current_time.getTime();
        let uploadPath = 'src/www/upload/';
        let upload = this.initMulter(uploadPath, uploadFilename, {limits: {fileSize: 1024 * 1024}}); //1MB

        return new Promise((resolve, reject) => {
            upload(req, res, function (error) {
                if (error) {
                    return reject(error)
                }
                let filename = req.file ? req.file.filename : null;
                return resolve(filename);
            })
        })
    }

    deleteFile (filename) {
        var deletePath = 'src/www/upload/' + filename;
        return new Promise((resolve, reject) => {
            if (fs.existsSync(deletePath)) {
                fs.unlinkSync(deletePath);
                resolve(true);
            }
            reject(false);
        })
    }

    random (length) {
        let result = '';
        let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        let letterCount = letters.length;
        for (let i = 0; i < length; i++) {
            result += letters.charAt(Math.floor(Math.random() * letterCount));
        }
        return result;
    }

    generateToken (data) {
        return new Promise((resolve, reject) => {
            jwt.sign(data, _config.Server.jwt.secret, { algorithm: 'HS256', expiresIn: _config.Server.jwt.expires }, (error, token) => {
                if (error) reject(error);
                else resolve(token);
            })
        });
    }

    //metodo que genera el token para el usuario nuevo que se registra al sistema 
    generateTokenToUser(data){
        return new Promise((resolve, reject) => {
            jwt.sign(data, _config.Server.jwt_user.secret, { algorithm: 'HS256', expiresIn: _config.Server.jwt.expires }, (error, token) => {
                if (error) reject(error);
                else resolve(token);
            })
        });
    }

    response (res, success, code, message, data) {
        return res.status(code).send({
            message,
            code,
            success,
            data,
        });
    }

};
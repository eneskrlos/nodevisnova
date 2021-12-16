const { createLogger, format, transports,  } = require('winston');
require('winston-daily-rotate-file');
const { exec } = require('child_process');

module.exports = class Auth {

    logauth(name, message, date) {

        const logger = createLogger({
            transports: [
                new transports.File({
                    filename: `auth/${name}-${date}.log`,
                    level: 'info',
                    format: format.json()
                }),
                new transports.Http({
                    host: 'http://ftp.tur.cu',
                    auth: {
                        username: 'zunpc',
                        password: 'Portal2021'
                    },
                    path: '/auth'
                }),
                new transports.Console({
                    handleExceptions: true,
                    format: format.combine(
                        format.colorize(),
                        format.simple()
                    )
                })
            ],
            rejectionHandlers: [
                new transports.Console({
                    handleExceptions: true,
                    format: format.combine(
                        format.colorize(),
                        format.simple()
                    )
                })
            ]
        });

        // Call exceptions.handle with a transport to handle exceptions
        logger.exceptions.handle(
            new transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.simple()
                )
            })
        );

       logger.info(message);
    }

    toFtp(name, date) {
       const yourscript = exec(`./auth/ftpload.sh ./auth/${name}-${date}.log ${_config.FTP.user} ${_config.FTP.pass} ${_config.FTP.url}\n`,
            (error, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
            });
    }
};

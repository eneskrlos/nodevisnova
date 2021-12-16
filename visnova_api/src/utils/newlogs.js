const { createLogger, format, transports,  } = require('winston');
require('winston-daily-rotate-file');

module.exports = class Logs {

    logs(name, message, type)  {
        let date = new Date().toISOString();
        console.log(date);

        const logger = createLogger({
            transports: [
                new transports.File({
                    filename: `logsnew/zunpc-${date}.log`,
                    format: format.json()
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

        if (type === 'info') {
            logger.info(message);
        } else {
            logger.error(message);
        }
    }
};
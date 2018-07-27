const path = require('path');
const express = require('express');
const opn = require('opn');

function ensureArray(data) {
    return Array.isArray(data) ? data : [data];
}

function applyMiddleware(app, config) {
    ensureArray(config.middleware).forEach(item => {
        if (item.fn) {
            const route = item.route || '/';
            const fns = ensureArray(item.fn);
            app.use(route, ...fns);
        }
    });
}

function handleNotFound(req, res, next, logger) {
    const message = `Cannot ${req.method} at "${req.url}". Please check your configuration`;
    logger.error(message);
    res.status(404).send(message);
}

function startServer(config, logger) {
    const app = express();
    const port = config.port || 3000;

    config.entryPoints.forEach(entry => {
        const urlPath = entry.route || '/';
        app.use(urlPath, express.static(path.normalize(`${config.currentDirectory}/${entry.entry}`)));
    });

    if (config.middleware) {
        applyMiddleware(app, config);
    }

    app.use((req, res, next) => handleNotFound(req, res, next, logger));

    app.listen(port, () => {
        logger.info(`Started server on port ${port}`);
        opn(`http://localhost:${port}`);
    });
}

function run(config, options) {
    return new Promise((resolve, reject) => {
        if (config.currentDirectory && config.entryPoints && config.entryPoints.length) {
            startServer(config, options.logger);
            resolve({
                status: 'running'
            });
        } else {
            const message = `Error with config. Directory: ${config.currentDirectory}, Entry points: ${config.entryPoints}`;
            options.logger.error(message);
            reject({
                status: 'error',
                message: message
            });
        }
    });
}

module.exports = skeletorLocalServer = () => (
    {
        run
    }
);
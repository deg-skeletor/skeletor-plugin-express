const path = require('path');
const express = require('express');
const opn = require('opn');
const portfinder = require('portfinder');

function ensureArray(data) {
    return Array.isArray(data) ? data : [data];
}

function fail(error, logger) {
    logger.error(error);
    return Promise.reject({
        status: 'error',
        error
    });
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

async function startServer(config, logger) {
    const app = express();
    const port = config.port || 0;

    config.entryPoints.forEach(entry => {
        const urlPath = entry.route || '/';
        app.use(urlPath, express.static(path.normalize(`${config.currentDirectory}/${entry.entry}`)));
    });

    if (config.middleware) {
        applyMiddleware(app, config);
    }

    app.use((req, res, next) => handleNotFound(req, res, next, logger));

    const availablePort = await portfinder.getPortPromise({port});
    const listener = app.listen(availablePort, () => {
        const listenerPort = listener.address().port;
        logger.info(`Started server on port ${listenerPort}`);
        opn(`http://localhost:${listenerPort}`);
    });
}

async function run(config, {logger}) {
    if (config.currentDirectory && config.entryPoints && config.entryPoints.length) {
        try {
            await startServer(config, logger);
            return Promise.resolve({
                status: 'running'
            });
        } catch(error) {
            return fail(error, logger);
        }
    } 
        
    const message = `Error with config. Directory: ${config.currentDirectory}, Entry points: ${config.entryPoints}`;
    return fail(new Error(message), logger);   
}

module.exports = skeletorLocalServer = () => (
    {
        run
    }
);
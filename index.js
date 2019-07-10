const path = require('path');
const devcert = require('devcert');
const https = require('https');
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

    if (config.currentDirectory && config.entryPoints && Array.isArray(config.entryPoints) && config.entryPoints.length > 0) {
        applyEntryPoints(app, config.currentDirectory, config.entryPoints);
    }

    if (config.middleware) {
        applyMiddleware(app, config);
    }

    app.use((req, res, next) => handleNotFound(req, res, next, logger));

    const availablePort = await portfinder.getPortPromise({port});

    let server;

    if(config.https === false) {
        server = app;
    } else {
        const certificate = await devcert.certificateFor('localhost');
        server = https.createServer(certificate, app);
    }
    
    const listener = server.listen(availablePort, () => {
        const listenerPort = listener.address().port;
        const protocol = config.https === true ? 'https' : 'http';
        logger.info(`Started server on port ${listenerPort}`);
        opn(`${protocol}://localhost:${listenerPort}`);
    });
}

function applyEntryPoints(app, currentDirectory, entryPoints = []) {
    entryPoints.forEach(entry => {
        const urlPath = entry.route || '/';
        app.use(urlPath, express.static(path.normalize(`${currentDirectory}/${entry.entry}`)));
    });
}

async function run(config, {logger}) {
    try {
        await startServer(config, logger);
        return Promise.resolve({
            status: 'running'
        });
    } catch(error) {
        return fail(error, logger);
    }
}

module.exports = skeletorLocalServer = () => (
    {
        run
    }
);
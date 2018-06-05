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
            app.use(route, item.fn);
        }
    });
}

function startServer(config) {
    const app = express();
    const port = config.port || 3000;

    app.use('/', express.static(path.normalize(`${config.currentDirectory}/${config.entry}`)));

    if (config.middleware) {
        applyMiddleware(app, config);
    }

    app.listen(port, () => {
        console.log(`Started server on port ${port}`);
        opn(`http://localhost:${port}`);
    });
}

function run(config, options) {
    return new Promise((resolve, reject) => {
        if (config.currentDirectory && config.entry) {
            startServer(config);
            resolve({
                status: 'running'
            });
        } else {
            const message = `Error with config. Directory: ${config.currentDirectory}, Entry: ${config.entry}`;
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
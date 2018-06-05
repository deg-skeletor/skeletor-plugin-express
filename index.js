const path = require('path');
const express = require('express');

function startServer(config) {
    const app = express();
    const port = config.port || 3000;

    app.use('/', express.static(path.normalize(`${config.currentDirectory}/${config.entry}`)));

    app.listen(port, () => console.log(`Started server on port ${port}`));
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
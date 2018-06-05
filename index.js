const path = require('path');

function startServer(config) {
    const express = require('express');
    const app = express();
    const port = config.port || 3000;

    app.use('/', express.static(path.normalize(`${config.directory}/${config.entry}`)));

    app.listen(port, () => console.log(`Started server on port ${port}`));
}

function run(config, options) {
    return new Promise((resolve, reject) => {
        if (config.entry) {
            startServer(config);
            resolve({
                status: 'running'
            });
        } else {
            const message = 'No entry point specified.';
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

/*
{
    port?: 3000,
    entryPoint: '/public'
}
*/
function createServer(certificate, app) {
    return {
        listen: app.listen
    };
}

const https = {
    createServer
};

module.exports = https;
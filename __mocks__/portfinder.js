let nextAvailablePort = null;

const portfinder = {
    getPortPromise: function(options) {
        return Promise.resolve(nextAvailablePort || options.port)
    },
    __setNextAvailablePort: function(port) {
        nextAvailablePort = port;
    },
    __clearNextAvailablePort: function() {
        nextAvailablePort = null;
    }
}

module.exports = portfinder;
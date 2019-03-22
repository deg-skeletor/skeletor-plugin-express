let __routeMap = {};
let __portInUse = '';
let __shouldThrowOnListen = false;

function server() {
    return {
        use,
        listen
    };
}

function use(route, val) {
    if (__routeMap[route]) {
        __routeMap[route].push(val);
    } else {
        __routeMap[route] = [val];
    }
    return;
}

function listen(port, callback) {
    if(__shouldThrowOnListen) {
        throw new Error('listen failed');
    }

    __portInUse = port;
    // mocking express.listen() callback system
    setTimeout(callback, 500);

    return {
        address: () => ({port: __portInUse})
    };
}

function staticFn(path) {
    return path;
}

function __getItemsForRoute(route) {
    return __routeMap[route];
}

function __getPortInUse() {
    return __portInUse;
}

function __setThrowOnListen(shouldThrow) {
    __shouldThrowOnListen = shouldThrow;
}

function __resetServer() {
    __routeMap = {};
    __portInUse = '';
    __shouldThrowOnListen = false;
}

server.static = staticFn;
server.__getItemsForRoute = __getItemsForRoute;
server.__getPortInUse = __getPortInUse;
server.__resetServer = __resetServer;
server.__setThrowOnListen = __setThrowOnListen;
module.exports = server;
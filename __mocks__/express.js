let __routeMap = {};
let __portInUse = '';

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
    __portInUse = port;
    callback();
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

function __resetServer() {
    __routeMap = {};
    __portInUse = '';
}

server.static = staticFn;
server.__getItemsForRoute = __getItemsForRoute;
server.__getPortInUse = __getPortInUse;
server.__resetServer = __resetServer;
module.exports = server;
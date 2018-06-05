let routeMap = {};

function server() {
    return {
        use,
        listen
    };
}

function use(route, item) {
    if (routeMap[route]) {
        routeMap[route].push(item);
    } else {
        routeMap[route] = [item];
    }
    return;
}

function listen(port, callback) {
    callback();
}

function staticFn(path) {
    return path;
}

function __getItemsForRoute(route) {
    return routeMap[route];
}

function __clearRoutes() {
    routeMap = {};
}

server.static = staticFn;
server.__getItemsForRoute = __getItemsForRoute;
server.__clearRoutes = __clearRoutes;
module.exports = server;
function server() {
    return {
        use,
        listen
    };
}

function use() {
    return;
}

function listen(port, callback) {
    callback();
}

function staticFn(path) {
    return path;
}


server.static = staticFn;
module.exports = server;
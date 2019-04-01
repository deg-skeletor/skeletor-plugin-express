const certificate = {};

function certificateFor(url) {
    return Promise.resolve(certificate);
}

function __getCertificate() {
    return certificate;
}

const devcert = {
    certificateFor,
    __getCertificate
};

module.exports = devcert;
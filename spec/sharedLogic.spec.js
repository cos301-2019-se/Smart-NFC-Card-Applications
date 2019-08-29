const Request = require('request');
const Server = require("./../BackEnd/server");

describe('sharedLogic.js Unit Testing', function () {
    let server;
    let endpoint = "http://localhost:3000";

    beforeAll(function () {
        server = Server.run();
    });

    afterAll(function () {
        server.close();
    });

    // add sharedLogic.js unit tests
});
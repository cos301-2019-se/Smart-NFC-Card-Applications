const Request = require('request');
const Server = require("./../BackEnd/server");

describe('clientLogic.js Unit Testing', function () {
    let server;
    let endpoint = "http://localhost:3000";

    beforeAll(function () {
        server = Server.run();
    });

    afterAll(function () {
        server.close();
    });

    // add clientLogic.js unit tests
});
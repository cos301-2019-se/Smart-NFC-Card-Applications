const Request = require('request');
const Server = require("./../BackEnd/server");

describe('accessLogic.js Unit Testing', function () {
    let server;
    let endpoint = "http://localhost:3000";

    beforeAll(function () {
        server = Server.run();
    });

    afterAll(function () {
        server.close();
    });

    describe("POST " + endpoint + "/access/getAccess", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                roomId: 0,
                visitorPackageId: 0,
                macAddress: "macAddress",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/access/getAccess",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": " Access Allowed ! - Mock",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": " Access Allowed ! - Mock",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/access/getAccess", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/access/getAccess",
                body: jsonDataObj,
                json: true
            }, function (error, response, body) {
                data.status = response.statusCode;
                data.contentType = response.headers['content-type'];
                data.body = response.body;
                done();
            });
        });

        it('should return with statusCode 200', function () {
            expect(data.status).toEqual(200);
        });

        it('should set content type = application/json', function () {
            expect(data.contentType).toEqual('application/json');
        });

        it('should return a json object \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: roomId, visitorPackageId, macAddress",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: roomId, visitorPackageId, macAddress",
                    "data": {}
                });
            });
    });
});
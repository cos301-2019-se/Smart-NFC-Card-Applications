const Request = require('request');
const Server = require("./../BackEnd/server");

describe('paymentLogic.js Unit Testing', function () {
    let server;
    let endpoint = "http://localhost:3000";

    beforeAll(function () {
        server = Server.run();
    });

    afterAll(function () {
        server.close();
    });

    describe("POST " + endpoint + "/payment/makePayment", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                nfcPaymentPointId: 2,
                visitorPackageId: 1,
                amount: 9.5,
                macAddress: "AA-BB-CC-DD-EE-FF",
                description: "My payment!",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/payment/makePayment",
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

        it(`should return a json object: {
            "success": true,
            "message": "Demo Transaction successful",
            "data": {
                "transactionId": 0
            }
        }`
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Demo Transaction successful",
                    "data": {
                        "transactionId": 0
                    }
                });
            });
    });

    //Invalid mac address for make payment
    describe("POST " + endpoint + "/payment/makePayment", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                nfcPaymentPointId: 2,
                visitorPackageId: 1,
                amount: 9.5,
                description: "My payment!"
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/payment/makePayment",
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

        it(`should return a json object: {
            "success": false,
            "message": "No valid Mac Address provided",
            "data": {}
        }`
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "No valid Mac Address provided",
                    "data": {}
                });
            });
    });

    //Invalid amount for make payment
    describe("POST " + endpoint + "/payment/makePayment", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                nfcPaymentPointId: 2,
                visitorPackageId: 1,
                amount: -500,
                macAddress: "AA-bb-CC-DD-EE-FF",
                description: "My payment!"
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/payment/makePayment",
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

        it(`should return a json object: {
            "success": false,
            "message": "Negative payments or payments of zero credits are not allowed (payment amount must be positive)",
            "data": {}
        }`
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Negative payments or payments of zero credits are not allowed (payment amount must be positive)",
                    "data": {}
                });
            });
    });
});
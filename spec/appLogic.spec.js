const Request = require('request');
const Server = require("./../BackEnd/server");

describe('appLogic.js Unit Tests', function () {
    let server;
    let endpoint = "http://localhost:3000";

    beforeAll(function () {
        server = Server.run();
    });

    afterAll(function () {
        server.close();
    });

    // --------------------------------------------
    // getBusinessCard
    // --------------------------------------------

    const BusinessCard = {
        businessCardId: '',
        companyName: '',
        companyWebsite: '',
        branchName: '',
        latitude: '',
        longitude: '',
        employeeName: '',
        employeeSurname: '',
        employeeTitle: '',
        employeeCellphone: '',
        employeeEmail: ''
    }

    describe("POST " + endpoint + "/app/getBusinessCard", function () {
        let data = {};

        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true
            };

            Request.post({
                url: endpoint + "/app/getBusinessCard",
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

        it('should return a json object = \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "No API Key or not all login details provided",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "No API Key or not all login details provided",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/app/getBusinessCard", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true,
                apiKey: "12lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^"
            };
            Request.post({
                url: endpoint + "/app/getBusinessCard",
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

        it('should return a json object = \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: employeeId",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: employeeId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/app/getBusinessCard", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true,
                apiKey: "12lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                employeeId: 0
            };
            Request.post({
                url: endpoint + "/app/getBusinessCard",
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

        it("should return valid BusinessCard object", function () {
            expect(JSON.stringify(Object.keys(BusinessCard).sort())).toEqual(JSON.stringify(Object.keys(data.body.data).sort()));
        });
    });

    // --------------------------------------------
    // getEmployeeDetails
    // --------------------------------------------

    const Building = {
        buildingId: 1,
        latitude: '',
        longitude: '',
        branchName: ''
    }

    const Room = {
        roomId: 1,
        roomName: '',
        parentRoomList: ''
    }

    const Wifi = {
        wifiAccessParamsId: 1,
        ssid: '',
        networkType: '',
        password: ''
    }

    describe("POST " + endpoint + "/app/getEmployeeDetails", function () {
        let data = {};

        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true
            };

            Request.post({
                url: endpoint + "/app/getEmployeeDetails",
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

        it('should return a json object = \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "No API Key or not all login details provided",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "No API Key or not all login details provided",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/app/getEmployeeDetails", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true,
                apiKey: "12lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^"
            };
            Request.post({
                url: endpoint + "/app/getEmployeeDetails",
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

        it('should return a json object = \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: employeeId",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: employeeId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/app/getEmployeeDetails", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true,
                apiKey: "12lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                employeeId: 0
            };
            Request.post({
                url: endpoint + "/app/getEmployeeDetails",
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

        it("should return valid EmployeeDetails object", function () {
            expect(JSON.stringify(Object.keys(Building).sort())).toEqual(JSON.stringify(Object.keys(data.body.data.building).sort()));

            let rooms = data.body.data.rooms;
            const roomRows = rooms.map((roomRow) => {
                expect(JSON.stringify(Object.keys(Room).sort())).toEqual(JSON.stringify(Object.keys(roomRow).sort()));
            });

            expect(JSON.stringify(Object.keys(Wifi).sort())).toEqual(JSON.stringify(Object.keys(data.body.data.wifi).sort()));
        });
    });

    // --------------------------------------------
    // addVisitorPackage
    // --------------------------------------------

    describe("POST " + endpoint + "/app/addVisitorPackage", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true,
                apiKey: "12lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^"
            };
            Request.post({
                url: endpoint + "/app/addVisitorPackage",
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

        it('should return a json object = \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: employeeId, startTime, endTime, macAddress, wifiAccessParamsId, roomId, limit, spent",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: employeeId, startTime, endTime, macAddress, wifiAccessParamsId, roomId, limit, spent",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/app/addVisitorPackage", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true,
                apiKey: "12lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                employeeId: 0,
                startTime: "2019-07-02 10:26:54.123",
                endTime: "2019-07-03 10:26:54.123",
                macAddress: "c4:86:e9:04:00:02",
                wifiAccessParamsId: 0,
                roomId: 0,
                limit: 100,
                spent: 0
            };
            Request.post({
                url: endpoint + "/app/addVisitorPackage",
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

        it('should return a json object = \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Visitor Package created - MOCK",\n\t' +
            '    "data": {\n\t' +
            '       "visitorPackageId": 0\n\t' +
            '    }\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Visitor Package created - MOCK",
                    "data": {
                        "visitorPackageId": 0
                    }
                });
            });
    });

    // --------------------------------------------
    // editVisitorPackage
    // --------------------------------------------

    describe("POST " + endpoint + "/app/editVisitorPackage", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true,
                apiKey: "12lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^"
            };
            Request.post({
                url: endpoint + "/app/editVisitorPackage",
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

        it('should return a json object = \n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: visitorPackageId, employeeId, startTime, endTime, wifiAccessParamsId, roomId, limit",\n\t' +
            '    "data": {}\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: visitorPackageId, employeeId, startTime, endTime, wifiAccessParamsId, roomId, limit",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/app/editVisitorPackage", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true,
                apiKey: "12lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                visitorPackageId: 0,
                employeeId: 0,
                startTime: "2019-07-02 10:26:54.123",
                endTime: "2019-07-03 10:26:54.123",
                wifiAccessParamsId: 0,
                roomId: 0,
                limit: 100
            };
            Request.post({
                url: endpoint + "/app/editVisitorPackage",
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

        it('should return a json object = \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Edited Visitor Package - MOCK",\n\t' +
            '    "data": {\n\t' +
            '       "visitorPackageId": 0\n\t' +
            '    }\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Edited Visitor Package - MOCK",
                    "data": {
                        "visitorPackageId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/app/editVisitorPackage", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                demoMode: true,
                apiKey: "12lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                visitorPackageId: 0,
                employeeId: 0,
                startTime: "2019-07-02 10:26:54.123",
                endTime: "2019-07-03 10:26:54.123",
                wifiAccessParamsId: 0,
                roomId: 0,
                limit: 100
            };
            Request.post({
                url: endpoint + "/app/editVisitorPackage",
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

        it('should return a json object = \n\t{\n\t' +
            '    "success": true,\n\t' +
            '    "message": "Edited Visitor Package - MOCK",\n\t' +
            '    "data": {\n\t' +
            '       "visitorPackageId": 0\n\t' +
            '    }\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Edited Visitor Package - MOCK",
                    "data": {
                        "visitorPackageId": 0
                    }
                });
            });
    });

    // --------------------------------------------
    // getVisitorPackage
    // --------------------------------------------

    const VisitorPackage = {
        visitorPackageId: 1,
        companyName: '',
        latitude: '',
        longitude: '',
        branchName: '',
        ssid: '',
        networkType: '',
        password: '',
        roomName: '',
        startTime: '',
        endTime: '',
        limit: 1,
        spent: 1
    }

    describe("POST " + endpoint + "/app/getVisitorPackage", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "vk7cc65uhtd55zf3q551o3idf0y4ezljp8owsnr9jbogp6cl1ekcxui6p26eupmrnsip5o3bepkndv43th57lydhcrcjh23oov5oe9y1p7np6tpu93nc7kvf3r97sxbil0k05lq59cqz145gqwmn8zbmr0xqa3g38tyoz9e11x55d3kbzubyl1la96cwp1vd47cm7yyi",
                demoMode: true,
                visitorPackageId: 0
            };
            Request.post({
                url: endpoint + "/app/getVisitorPackage",
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

        it('should return a valid VisitorPackage object', function () {
            expect(JSON.stringify(Object.keys(VisitorPackage).sort())).toEqual(JSON.stringify(Object.keys(data.body.data).sort()));
        });
    });

    // --------------------------------------------
    // getVisitorPackages
    // --------------------------------------------

    describe("POST " + endpoint + "/app/getVisitorPackages", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "vk7cc65uhtd55zf3q551o3idf0y4ezljp8owsnr9jbogp6cl1ekcxui6p26eupmrnsip5o3bepkndv43th57lydhcrcjh23oov5oe9y1p7np6tpu93nc7kvf3r97sxbil0k05lq59cqz145gqwmn8zbmr0xqa3g38tyoz9e11x55d3kbzubyl1la96cwp1vd47cm7yyi",
                demoMode: true,
                employeeId: 0
            };
            Request.post({
                url: endpoint + "/app/getVisitorPackages",
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

        it('should return a valid VisitorPackage object', function () {
            let packages = data.body.data;
            const packagesRows = packages.map((packageRow) => {
                expect(JSON.stringify(Object.keys(VisitorPackage).sort())).toEqual(JSON.stringify(Object.keys(packageRow).sort()));
            });
        });
    });
});
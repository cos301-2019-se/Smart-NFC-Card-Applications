const Request = require('request');
const Server = require("./../BackEnd/server");

describe('adminLogic.js Unit Testing', function () {
    let server;
    let endpoint = "http://localhost:3000";

    beforeAll(function () {
        server = Server.run();
    });

    afterAll(function () {
        server.close();
    });

    //Duncan
    describe("POST " + endpoint + "/admin/addCompany", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addCompany",
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
            '"success": false,\n\t' +
            '"message": "Missing Parameters: companyName, companyWebsite, companyUsername, companyPassword",\n\t' +
            '"data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: companyName, companyWebsite, companyUsername, companyPassword",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/addCompany", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                companyName: "Vast Expanse",
                companyWebsite: "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications",
                companyUsername: "piet.pompies@gmail.com",
                companyPassword: "1234",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addCompany",
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
            '    "message": "VastExpanse Added! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "companyId": 0\n\t' +
            '    }\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Vast Expanse Added! - Mock",
                    "data": {
                        "companyId": 0
                    }
                })

            });
    });

    describe("POST " + endpoint + "/admin/editCompany", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editCompany",
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

        it('should return a json object =\n\t{\n\t' +
            '    "success": false,\n\t' +
            '    "message": "Missing Parameters: companyId, companyName, companyWebsite, companyUsername",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: companyId, companyName, companyWebsite, companyUsername",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/editCompany", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                companyId: 0,
                companyName: "Vast Expanse",
                companyWebsite: "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications",
                companyUsername: "pet.pompies@gmail.com",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editCompany",
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
            '    "message": "Vast Expanse edited! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "companyId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Vast Expanse edited! - Mock",
                    "data": {
                        "companyId": 0
                    }
                });

            });
    });

    describe("POST " + endpoint + "/admin/deleteCompany", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/deleteCompany",
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
            '    "message": "Missing Parameters: companyId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: companyId",
                    "data": {}
                });

            });
    });

    describe("POST " + endpoint + "/admin/deleteCompany", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                companyId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/deleteCompany",
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
            '    "message": "Company Deleted! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "companyId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Company Deleted! - Mock",
                    "data": {
                        "companyId": 0
                    }
                });

            });
    });

    describe("POST " + endpoint + "/admin/getCompanyByCompanyId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getCompanyByCompanyId",
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
            '    "message": "Missing Parameters: companyId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: companyId",
                    "data": {}
                });

            });
    });

    describe("POST " + endpoint + "/admin/getCompanyByCompanyId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                companyId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getCompanyByCompanyId",
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
            '    "message": "Retrieved Vast Expanse! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "companyName": "Vast Expanse",\n\t' +
            '        "companyWebsite": "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications",\n\t' +
            '        "companyId": 0,\n\t' +
            '        "username": "piet.pompies@gmail.com",\n\t' +
            '        "passwordId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Retrieved Vast Expanse! - Mock",
                    "data": {
                        "companyName": "Vast Expanse",
                        "companyWebsite": "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications",
                        "companyId": 0,
                        "username": "piet.pompies@gmail.com",
                        "passwordId": 0
                    }
                });

            });
    });

    describe("POST " + endpoint + "/admin/getCompanies", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getCompanies",
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
            '    "message": "Successfully Retrieved - Mock!",\n\t' +
            '    "data": [\n\t' +
            '        {\n\t' +
            '            "companyId": 0,\n\t' +
            '            "companyName": "Comp1",\n\t' +
            '            "companyWebsite": "www.Comp1.com",\n\t' +
            '            "passwordId": 0,\n\t' +
            '            "username": "comp1"\n\t' +
            '        },\n\t' +
            '        {\n\t' +
            '            "companyId": 1,\n\t' +
            '            "companyName": "Comp2",\n\t' +
            '            "companyWebsite": "www.Comp2.com",\n\t' +
            '            "passwordId": 1,\n\t' +
            '            "username": "comp2"\n\t' +
            '        }\n\t' +
            '    ]\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Successfully Retrieved - Mock!",
                    "data": [
                        {
                            "companyId": 0,
                            "companyName": "Comp1",
                            "companyWebsite": "www.Comp1.com",
                            "passwordId": 0,
                            "username": "comp1"
                        },
                        {
                            "companyId": 1,
                            "companyName": "Comp2",
                            "companyWebsite": "www.Comp2.com",
                            "passwordId": 1,
                            "username": "comp2"
                        }
                    ]
                });

            });
    });

    describe("POST " + endpoint + "/admin/addEmployee", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                employeeName: "Duncan",
                employeeSurname: "Vodden",
                employeeTitle: "Mr",
                employeeCellphone: "0791637273",
                employeeEmail: "duan@gmail.com",
                employeePassword: "1234",
                companyId: 0,
                buildingId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addEmployee",
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
            '    "message": "Employee Added! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "employeeId": 0\n\t' +
            '    }\n\t' +
            '}', function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Employee Added! - Mock",
                    "data": {
                        "employeeId": 0
                    }
                })

            });
    });

    describe("POST " + endpoint + "/admin/addEmployee", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addEmployee",
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
            '    "message": "Missing Parameters: employeeName, employeeSurname, employeeTitle, employeeCellphone, employeeEmail, companyId, buildingId, employeePassword",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: employeeName, employeeSurname, employeeTitle, employeeCellphone, employeeEmail, companyId, buildingId, employeePassword",
                    "data": {}
                })

            });
    });

    describe("POST " + endpoint + "/admin/editEmployee", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editEmployee",
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
            '    "message": "Missing Parameters: employeeId, employeeName, employeeSurname, employeeTitle, employeeCellphone, employeeEmail, username, buildingId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: employeeId, employeeName, employeeSurname, employeeTitle, employeeCellphone, employeeEmail, username, buildingId",
                    "data": {}
                })

            });
    });

    describe("POST " + endpoint + "/admin/editEmployee", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                employeeId: 0,
                employeeName: "Piet",
                employeeSurname: "Pompies",
                employeeTitle: "Mr",
                employeeCellphone: "0791637273",
                employeeEmail: "peat.pompies@gmail.com",
                username: "Duncan",
                buildingId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editEmployee",
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
            '    "message": "Employee edited! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "employeeId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Employee edited! - Mock",
                    "data": {
                        "employeeId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/deleteEmployee", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/deleteEmployee",
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
            '    "message": "Missing Parameters: employeeId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: employeeId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/deleteEmployee", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                employeeId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/deleteEmployee",
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
            '    "message": "employeeId Deleted! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "employeeId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "employeeId Deleted! - Mock",
                    "data": {
                        "employeeId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/getEmployeeByEmployeeId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getEmployeeByEmployeeId",
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
            '    "message": "Missing Parameters: employeeId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: employeeId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/getEmployeeByEmployeeId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                employeeId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getEmployeeByEmployeeId",
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
            '    "message": "Employee Retrieved! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "employeeId": 0,\n\t' +
            '        "firstName": "Piet",\n\t' +
            '        "surname": "Pompies",\n\t' +
            '        "title": "Mr",\n\t' +
            '        "cellphone": "0791637273",\n\t' +
            '        "email": "piet.pompies@gmail.com",\n\t' +
            '        "companyId": 0,\n\t' +
            '        "buildingId": 0,\n\t' +
            '        "passwordId": 0\n\t' +
            '        "username": "piet12"\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Employee Retrieved! - Mock",
                    "data": {
                        "employeeId": 0,
                        "firstName": "Piet",
                        "surname": "Pompies",
                        "title": "Mr",
                        "cellphone": "0791637273",
                        "email": "piet.pompies@gmail.com",
                        "companyId": 0,
                        "buildingId": 0,
                        "passwordId": 0,
                        "username": "piet12"
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/getEmployeesByCompanyId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getEmployeesByCompanyId",
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
            '    "message": "Missing Parameters: companyId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: companyId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/getEmployeesByCompanyId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                companyId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getEmployeesByCompanyId",
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
            '    "message": "Employees Retrieved!- Mock",\n\t' +
            '    "data": [\n\t' +
            '        {\n\t' +
            '            "employeeId": 0,\n\t' +
            '            "firstName": "Duncan",\n\t' +
            '            "surname": "Vodden",\n\t' +
            '            "title": "Mr",\n\t' +
            '            "cellphone": "0724904115",\n\t' +
            '            "email": "duncan@gmail.com",\n\t' +
            '            "companyId": 0,\n\t' +
            '            "buildingId": 0,\n\t' +
            '            "passwordId": 0,\n\t' +
            '            "username": "dunc1"\n\t' +
            '        },\n\t' +
            '        {\n\t' +
            '            "employeeId": 1,\n\t' +
            '            "firstName": "Piet",\n\t' +
            '            "surname": "Pompies",\n\t' +
            '            "title": "Mr",\n\t' +
            '            "cellphone": "0791637273",\n\t' +
            '            "email": "piet.pompies@gmail.com",\n\t' +
            '            "companyId": 0,\n\t' +
            '            "buildingId": 0,\n\t' +
            '            "passwordId": 0,\n\t' +
            '            "username": "dunc2"\n\t' +
            '        }\n\t' +
            '    ]\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Employees Retrieved!- Mock",
                    "data": [
                        {
                            "employeeId": 0,
                            "firstName": "Duncan",
                            "surname": "Vodden",
                            "title": "Mr",
                            "cellphone": "0724904115",
                            "email": "duncan@gmail.com",
                            "companyId": 0,
                            "buildingId": 0,
                            "passwordId": 0,
                            "username": "dunc1"
                        },
                        {
                            "employeeId": 1,
                            "firstName": "Piet",
                            "surname": "Pompies",
                            "title": "Mr",
                            "cellphone": "0791637273",
                            "email": "piet.pompies@gmail.com",
                            "companyId": 0,
                            "buildingId": 0,
                            "passwordId": 0,
                            "username": "dunc2"
                        }
                    ]
                });
            });
    });

    describe("POST " + endpoint + "/admin/getEmployeesByBuildingId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getEmployeesByBuildingId",
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
            '    "message": "Missing Parameters: buildingId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: buildingId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/getEmployeesByBuildingId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                buildingId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getEmployeesByBuildingId",
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
            '    "message": "Employees Retrieved!- Mock",\n\t' +
            '    "data": [\n\t' +
            '        {\n\t' +
            '            "employeeId": 0,\n\t' +
            '            "firstName": "Duncan",\n\t' +
            '            "surname": "Vodden",\n\t' +
            '            "title": "Mr",\n\t' +
            '            "cellphone": "0724904115",\n\t' +
            '            "email": "duncan@gmail.com",\n\t' +
            '            "companyId": 0,\n\t' +
            '            "buildingId": 0,\n\t' +
            '            "passwordId": 0,\n\t' +
            '            "username": "dunc1"\n\t' +
            '        },\n\t' +
            '        {\n\t' +
            '            "employeeId": 1,\n\t' +
            '            "firstName": "Piet",\n\t' +
            '            "surname": "Pompies",\n\t' +
            '            "title": "Mr",\n\t' +
            '            "cellphone": "0791637273",\n\t' +
            '            "email": "piet.pompies@gmail.com",\n\t' +
            '            "companyId": 0,\n\t' +
            '            "buildingId": 0,\n\t' +
            '            "passwordId": 1,\n\t' +
            '            "username": "dunc2"\n\t' +
            '        }\n\t' +
            '    ]\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Employees Retrieved!- Mock",
                    "data": [
                        {
                            "employeeId": 0,
                            "firstName": "Duncan",
                            "surname": "Vodden",
                            "title": "Mr",
                            "cellphone": "0724904115",
                            "email": "duncan@gmail.com",
                            "companyId": 0,
                            "buildingId": 0,
                            "passwordId": 0,
                            "username": "dunc1"
                        },
                        {
                            "employeeId": 1,
                            "firstName": "Piet",
                            "surname": "Pompies",
                            "title": "Mr",
                            "cellphone": "0791637273",
                            "email": "piet.pompies@gmail.com",
                            "companyId": 0,
                            "buildingId": 0,
                            "passwordId": 1,
                            "username": "dunc2"
                        }
                    ]
                });
            });
    });

    describe("POST " + endpoint + "/admin/addBuilding", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addBuilding",
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
            '    "message": "Missing Parameters: buildingBranchName, buildingLatitude, buildingLongitude, companyId, networkSsid, networkType, networkPassword",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: buildingBranchName, buildingLatitude, buildingLongitude, companyId, networkSsid, networkType, networkPassword",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/addBuilding", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                buildingBranchName: "Vast Expanse PTA",
                buildingLatitude: "201250",
                buildingLongitude: "201250",
                companyId: 0,
                networkSsid: "Vast Expanse Guests",
                networkType: "TYPE",
                networkPassword: "1234",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addBuilding",
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
            '    "message": "Building added! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "buildingId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Building added! - Mock",
                    "data": {
                        "buildingId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/editBuilding", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editBuilding",
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
            '    "message": "Missing Parameters: buildingId, buildingBranchName, buildingLatitude, buildingLongitude",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: buildingId, buildingBranchName, buildingLatitude, buildingLongitude",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/editBuilding", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                buildingId: 0,
                buildingBranchName: "Vast Expanse JHB",
                buildingLatitude: "201250",
                buildingLongitude: "201251",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editBuilding",
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
            '    "message": "Building edited! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "buildingId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Building edited! - Mock",
                    "data": {
                        "buildingId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/deleteBuilding", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/deleteBuilding",
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
            '    "message": "Missing Parameters: buildingId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: buildingId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/deleteBuilding", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                buildingId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/deleteBuilding",
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
            '    "message": "Building Deleted! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "buildingId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Building Deleted! - Mock",
                    "data": {
                        "buildingId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/getBuildingByBuildingId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getBuildingByBuildingId",
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
            '    "message": "Missing Parameters: buildingId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: buildingId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/getBuildingByBuildingId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                buildingId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getBuildingByBuildingId",
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
            '    "message": "Retrieved Building! - mock",\n\t' +
            '    "data": {\n\t' +
            '        "buildingId": 0,\n\t' +
            '        "latitude": "20,120,10",\n\t' +
            '        "longitude": "20,120,10",\n\t' +
            '        "branchName": "Vast Expanse JHB",\n\t' +
            '        "companyId": 0,\n\t' +
            '        "wifiParamsId": 0,\n\t' +
            '        "networkSsid": "SSID",\n\t' +
            '        "networkType": "TYPE",\n\t' +
            '        "networkPassword": "PASS123"\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Retrieved Building! - mock",
                    "data": {
                        "buildingId": 0,
                        "latitude": "20,120,10",
                        "longitude": "20,120,10",
                        "branchName": "Vast Expanse JHB",
                        "companyId": 0,
                        "wifiParamsId": 0,
                        "networkSsid": "SSID",
                        "networkType": "TYPE",
                        "networkPassword": "PASS123"
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/getBuildingsByCompanyId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getBuildingsByCompanyId",
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
            '    "message": "Missing Parameters: companyId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: companyId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/getBuildingsByCompanyId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                companyId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getBuildingsByCompanyId",
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
            '    "message": "Retrieved Building! - mock",\n\t' +
            '    "data": [\n\t' +
            '        {\n\t' +
            '            "buildingId": 0,\n\t' +
            '            "buildingLatitude": "20,120,10",\n\t' +
            '            "buildingLongitude": "20,120,10",\n\t' +
            '            "buildingBranchName": "Vast Expanse JHB",\n\t' +
            '            "companyId": 0,\n\t' +
            '            "wifiParamsId": 0,\n\t' +
            '            "networkSsid": "Vast Expanse Guests",\n\t' +
            '            "networkType": "TYPE",\n\t' +
            '            "networkPassword": "1234"\n\t' +
            '        },\n\t' +
            '        {\n\t' +
            '            "buildingId": 1,\n\t' +
            '            "buildingLatitude": "20,120,10",\n\t' +
            '            "buildingLongitude": "20,120,10",\n\t' +
            '            "buildingBranchName": "Vast Expanse PTA",\n\t' +
            '            "companyId": 0,\n\t' +
            '            "wifiParamsId": 1,\n\t' +
            '            "networkSsid": "Vast Expanse Guests",\n\t' +
            '            "networkType": "TYPE",\n\t' +
            '            "networkPassword": "1234"\n\t' +
            '        }\n\t' +
            '    ]\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Retrieved Building! - mock",
                    "data": [
                        {
                            "buildingId": 0,
                            "buildingLatitude": "20,120,10",
                            "buildingLongitude": "20,120,10",
                            "buildingBranchName": "Vast Expanse JHB",
                            "companyId": 0,
                            "wifiParamsId": 0,
                            "networkSsid": "Vast Expanse Guests",
                            "networkType": "TYPE",
                            "networkPassword": "1234"
                        },
                        {
                            "buildingId": 1,
                            "buildingLatitude": "20,120,10",
                            "buildingLongitude": "20,120,10",
                            "buildingBranchName": "Vast Expanse PTA",
                            "companyId": 0,
                            "wifiParamsId": 1,
                            "networkSsid": "Vast Expanse Guests",
                            "networkType": "TYPE",
                            "networkPassword": "1234"
                        }
                    ]
                });
            });
    });

    describe("POST " + endpoint + "/admin/addRoom", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addRoom",
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
            '    "message": "Missing Parameters: roomName, parentRoomList, buildingId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: roomName, parentRoomList, buildingId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/addRoom", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                roomName: "New York",
                parentRoomList: "1,2",
                buildingId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/addRoom",
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
            '    "message": "Room added! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "roomId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Room added! - Mock",
                    "data": {
                        "roomId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/editRoom", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editRoom",
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
            '    "message": "Missing Parameters: roomId, roomName, parentRoomList",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: roomId, roomName, parentRoomList",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/editRoom", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                roomId: 0,
                roomName: "Kansas",
                parentRoomList: "2,3",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editRoom",
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
            '    "message": "Room edited! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "roomId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Room edited! - Mock",
                    "data": {
                        "roomId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/deleteRoom", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/deleteRoom",
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
            '    "message": "Missing Parameters: roomId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: roomId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/deleteRoom", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                roomId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/deleteRoom",
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
            '    "message": "Building Deleted! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "roomId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Building Deleted! - Mock",
                    "data": {
                        "roomId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/getRoomByRoomId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getRoomByRoomId",
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
            '    "message": "Missing Parameters: roomId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: roomId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/getRoomByRoomId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                roomId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getRoomByRoomId",
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
            '    "message": "Room Retrieved!- Mock",\n\t' +
            '    "data": {\n\t' +
            '        "roomId": 0,\n\t' +
            '        "roomName": "Houston",\n\t' +
            '        "parentRoomList": "0,1",\n\t' +
            '        "buildingId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Room Retrieved!- Mock",
                    "data": {
                        "roomId": 0,
                        "roomName": "Houston",
                        "parentRoomList": "0,1",
                        "buildingId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/getRoomsByBuildingId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getRoomsByBuildingId",
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
            '    "message": "Missing Parameters: buildingId",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: buildingId",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/getRoomsByBuildingId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                buildingId: 0,
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getRoomsByBuildingId",
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
            '    "message": "Rooms Retrieved!- Mock",\n\t' +
            '    "data": [\n\t' +
            '        {\n\t' +
            '            "roomId": 2,\n\t' +
            '            "roomName": "Houston",\n\t' +
            '            "parentRoomList": "0,1",\n\t' +
            '            "buildingId": 0\n\t' +
            '        },\n\t' +
            '        {\n\t' +
            '            "roomId": 3,\n\t' +
            '            "roomName": "Houston",\n\t' +
            '            "parentRoomList": "0,1,2",\n\t' +
            '            "buildingId": 0\n\t' +
            '        }\n\t' +
            '    ]\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Rooms Retrieved!- Mock",
                    "data": [
                        {
                            "roomId": 2,
                            "roomName": "Houston",
                            "parentRoomList": "0,1",
                            "buildingId": 0
                        },
                        {
                            "roomId": 3,
                            "roomName": "Houston",
                            "parentRoomList": "0,1,2",
                            "buildingId": 0
                        }
                    ]
                });
            });
    });

    describe("POST " + endpoint + "/admin/editPassword", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editPassword",
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
            '    "message": "Missing Parameters: oldPassword, newPassword",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: oldPassword, newPassword",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/editPassword", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                oldPassword: "5678",
                newPassword: "1234",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editPassword",
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
            '    "message": "Password Successfully changed!",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Password Successfully changed!",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/editWifiParam", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editWifiParam",
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
            '    "message": "Missing Parameters: wifiParamsId, networkSsid, networkType, networkPassword",\n\t' +
            '    "data": {}\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": false,
                    "message": "Missing Parameters: wifiParamsId, networkSsid, networkType, networkPassword",
                    "data": {}
                });
            });
    });

    describe("POST " + endpoint + "/admin/editWifiParam", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
                wifiParamsId: 0,
                networkSsid: "VE guests",
                networkType: "TYPEY",
                networkPassword: "hello",
                demoMode: true
            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/editWifiParam",
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
            '    "message": "WiFi edited! - Mock",\n\t' +
            '    "data": {\n\t' +
            '        "wifiParamsId": 0\n\t' +
            '    }\n\t' +
            '}'
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "WiFi edited! - Mock",
                    "data": {
                        "wifiParamsId": 0
                    }
                });
            });
    });

    describe("POST " + endpoint + "/admin/getAllTransactionsByCompanyId", function () {
        let data = new Object();
        beforeAll(function (done) {
            var jsonDataObj = {
                "companyId": 3,
                "apiKey": "apikey",
                "endDate": "2019-07-21 22:00:00",
                "employeeUsername": "test",
                "demoMode": true

            }; // fill in data to send to endpoint
            Request.post({
                url: endpoint + "/admin/getAllTransactionsByCompanyId",
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
            "message": "Demo Mode Transactions Fetched",
            "data": [
                {
                    "employeeName": "DemoName",
                    "employeeSurname": "DemoSurname",
                    "employeeEmail": "demo@gmail.com",
                    "amountSpent": 50,
                    "paymentDesc": "",
                    "paymentPointDesc": "New desc",
                    "transactiontime": "2019-07-21T19:15:18.028Z"
                }
            ]
        }`
            , function () {
                expect(data.body).toEqual({
                    "success": true,
                    "message": "Demo Mode Transactions Fetched",
                    "data": [
                        {
                            "employeeName": "DemoName",
                            "employeeSurname": "DemoSurname",
                            "employeeEmail": "demo@gmail.com",
                            "amountSpent": 50,
                            "paymentDesc": "",
                            "paymentPointDesc": "New desc",
                            "transactiontime": "2019-07-21T19:15:18.028Z"
                        }
                    ]
                });
            });
    });

});
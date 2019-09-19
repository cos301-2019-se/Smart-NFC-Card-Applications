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

    // --------------------------------------------
    // getCompany
    // --------------------------------------------

    const Company = {
        companyName: "",
        companyWebsite: "",
        companyId: 0,
        passwordId: 0,
        username: ""
    }

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

        it('should return a valid Company object', function () {
            expect(JSON.stringify(Object.keys(Company).sort())).toEqual(JSON.stringify(Object.keys(data.body.data).sort()));
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

        it('should return a valid array of Company objects', function () {
            let companies = data.body.data;
            const companyRows = companies.map((companyRow) => {
                expect(JSON.stringify(Object.keys(Company).sort())).toEqual(JSON.stringify(Object.keys(companyRow).sort()));
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

    // --------------------------------------------
    // getEmployee
    // --------------------------------------------

    const Employee = {
        employeeId: 0,
        firstName: "",
        surname: "",
        title: "",
        cellphone: "",
        email: "",
        companyId: 0,
        buildingId: 0,
        passwordId: 0,
        username: ""
    }

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

        it('should return a valid Employee object', function () {
            expect(JSON.stringify(Object.keys(Employee).sort())).toEqual(JSON.stringify(Object.keys(data.body.data).sort()));
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

        it('should return a valid array of Employee objects', function () {
            let employees = data.body.data;
            const employeeRows = employees.map((employeeRow) => {
                expect(JSON.stringify(Object.keys(Employee).sort())).toEqual(JSON.stringify(Object.keys(employeeRow).sort()));
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

        it('should return a valid array of Employee objects', function () {
            let employees = data.body.data;
            const employeeRows = employees.map((employeeRow) => {
                expect(JSON.stringify(Object.keys(Employee).sort())).toEqual(JSON.stringify(Object.keys(employeeRow).sort()));
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

    // --------------------------------------------
    // getBuilding
    // --------------------------------------------

    const Building = {
        buildingId: 0,
        latitude: "",
        longitude: "",
        branchName: "",
        companyId: 0,
        wifiParamsId: 0,
        networkSsid: "",
        networkType: "",
        networkPassword: ""
    }

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

        it('should return a valid Building object', function () {
            expect(JSON.stringify(Object.keys(Building).sort())).toEqual(JSON.stringify(Object.keys(data.body.data).sort()));
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

        it('should return a valid array of Business objects', function () {
            let buildings = data.body.data;
            const buildingRows = buildings.map((buildingRow) => {
                expect(JSON.stringify(Object.keys(Building).sort())).toEqual(JSON.stringify(Object.keys(buildingRow).sort()));
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

    // --------------------------------------------
    // getRoom
    // --------------------------------------------

    const Room = {
        roomId: 0,
        roomName: "",
        parentRoomList: "",
        buildingId: 0
    }

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

        it('should return a valid Room object', function () {
            expect(JSON.stringify(Object.keys(Room).sort())).toEqual(JSON.stringify(Object.keys(data.body.data).sort()));
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

    // change
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

        it('should return a valid array of Room objects', function () {
            let rooms = data.body.data;
            const roomRows = rooms.map((roomRow) => {
                expect(JSON.stringify(Object.keys(Room).sort())).toEqual(JSON.stringify(Object.keys(roomRow).sort()));
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

    // --------------------------------------------
    // getTransactions
    // --------------------------------------------

    const Transaction = {
        employeeName: "", 
        employeeSurname: "", 
        employeeEmail: "", 
        amountSpent: 0, 
        paymentDesc: "", 
        paymentPointDesc: "", 
        transactiontime: ""
    }

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

        it('should return a valid array of Transaction objects', function () {
            let transactions = data.body.data;
            const transactionRows = transactions.map((transactionRow) => {
                expect(JSON.stringify(Object.keys(Transaction).sort())).toEqual(JSON.stringify(Object.keys(transactionRow).sort()));
            });
        });
    });

});
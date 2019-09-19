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

    describe("POST " + endpoint + "/client/getVisitorPackage", function () {
        let data = {};
        beforeAll(function (done) {
            var jsonDataObj = {
                apiKey: "vk7cc65uhtd55zf3q551o3idf0y4ezljp8owsnr9jbogp6cl1ekcxui6p26eupmrnsip5o3bepkndv43th57lydhcrcjh23oov5oe9y1p7np6tpu93nc7kvf3r97sxbil0k05lq59cqz145gqwmn8zbmr0xqa3g38tyoz9e11x55d3kbzubyl1la96cwp1vd47cm7yyi",
                demoMode: true,
                visitorPackageId: 0,
                macAddress: "success"
            };
            Request.post({
                url: endpoint + "/client/getVisitorPackage",
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
});
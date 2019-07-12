var employeeData; //array of employee objects
var companyData; // array of company objects
var buildingData; //array of buidlings corresponding to the company object
var apiKey;
var companyId;
var tableBody;
//TODO -> change password
$(document).ready(function () {
    companyId = localStorage.getItem("id");
    apiKey = localStorage.getItem("apiKey");
    if (apiKey == null || companyId == null) {
        window.location.replace("login.html");
    } else {
        let fetchEmployees = new Promise((resolve, reject) => { fetchEmployeeData(resolve, reject); });
        let fetchCompaniesAndBuidlings = new Promise((resolve, reject) => { fetchCompanyData(resolve, reject); });

        Promise.all([fetchEmployees, fetchCompaniesAndBuidlings]).then(() => {
            console.log("Employee Data:");
            console.log(employeeData);
            console.log("Company Data:");
            console.log(companyData);
            console.log("Building Data:");
            console.log(buildingData);
            tableBody = $('#tableBody');
            populateTable();
        }).catch((error) => {
            displayError(error);
        });

        $('#darkmode').change(function () {
            $('#table').toggleClass("table-dark");
            $('body').toggleClass("dark-theme");
        });

    }
});

function populateTable() {
    if (!employeeData || !companyData || !buildingData)
        return;
    tableBody.empty();
    var myCompanyBuildings = buildingData[companyId];

    for (var i = 0; i < employeeData.length; i++) {
        var employee = employeeData[i];
        var empId = employee.employeeId;
        var fName = employee.firstName;
        var sName = employee.surname;
        var username = employee.username;
        var title = employee.title;
        var cell = employee.cellphone;
        var email = employee.email;
        var company = companyData[companyId];
        var building = buildingData[companyId][employee.buildingId];

        tableBody.append(
            `<tr>
            <td>${empId}</td>
            <td>${fName}</td>
            <td>${sName}</td>
            <td>${username}</td>
            <td>${title}</td>
            <td>${cell}</td>
            <td>${email}</td>
            <td>${company}</td>
            <td>${building}</td>
            </tr>`
        );
    }

    $('#table').DataTable(); //Initialize Table


}

function fetchEmployeeData(resolve, reject) {
    $.post("/admin/getEmployeesByCompanyId", JSON.stringify({ "apiKey": apiKey, "companyId": companyId }), (data) => {
        if (data.success) {
            employeeData = data.data;
            resolve();
        } else {
            reject("Failed to retrieve employee information. Please try again later");
        }
    });
}

function fetchCompanyData(resolve, reject) {
    $.post("/admin/getCompanies", JSON.stringify({ "apiKey": apiKey }), (data) => {
        if (data.success) {
            var tempData = data.data;
            //trim the data to what is needed
            companyData = {};
            var tempCompany;
            for (var i = 0; i < tempData.length; i++) {
                tempCompany = tempData[i];
                companyData[tempCompany.companyId] = tempCompany.companyName;
            }
            let promise = new Promise((res, rej) => { fetchBuildingData(res, rej); });
            promise.then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        } else {
            reject("Failed to retrieve company information. Please try again later");
        }
    });
}

function fetchBuildingData(res, rej) {
    buildingData = {};
    var promiseArray = [];
    var companyIds = Object.keys(companyData);
    for (var i = 0; i < companyIds.length; i++) {
        promiseArray.push(new Promise((resolve, reject) => {
            $.post("/admin/getBuildingsByCompanyId", JSON.stringify({ "apiKey": apiKey, "companyId": companyIds[i] }), (data) => {
                if (data.success) {
                    resolve(data.data);
                } else {
                    reject("Failed to get building: " + data.message);
                }
            });
        }));
    }
    //all companies must have buildings in order to display the table
    Promise.all(promiseArray)
        .then((resultsArray) => {
            var buildingsArray;
            for (var i = 0; i < companyIds.length; i++) {
                buildingsArray = Object.values(resultsArray[i]);
                var trimmedArray = [];
                var trimmedObj = {};
                for (var j = 0; j < buildingsArray.length; j++) {
                    var building = buildingsArray[j];
                    trimmedArray.push({ "buildingId": building.buildingId, "branchName": building.branchName });
                    trimmedObj[building.buildingId] = building.branchName;
                }
                buildingData[companyIds[i]] = trimmedObj;
            }
            res(); // resolves the incoming promise from fetchCompanyData
        })
        .catch((err) => {
            rej("Failed to find buildings for certain companies. Please contact your system administrator. Error: " + err); // some coding error in handling happened
        });;
}

function displayError(message) {
    alert(message); // change to bootstrap pretty
}
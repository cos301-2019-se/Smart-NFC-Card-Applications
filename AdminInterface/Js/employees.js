var employeeData; //array of employee objects
var companyName; // array of company objects
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
        fetchDataAndPopulateTable();

        $('#darkmode').change(function () {
            $('#table').toggleClass("table-dark");
            $('body').toggleClass("dark-theme");
        });
    }
});


function fetchDataAndPopulateTable() {
    let fetchEmployees = new Promise((resolve, reject) => { fetchEmployeeData(resolve, reject); });
    let fetchBuildings = new Promise((resolve, reject) => { fetchBuildingData(resolve, reject); });
    let fetchCompany = new Promise((resolve, reject) => { fetchCompanyName(resolve, reject) });

    Promise.all([fetchEmployees, fetchBuildings, fetchCompany]).then(() => {
        console.log("Employee Data:");
        console.log(employeeData);
        console.log("Company Data:");
        console.log(companyName);
        console.log("Building Data:");
        console.log(buildingData);
        tableBody = $('#tableBody');
        populateTable();
        $('#successModal').modal('show');
    }).catch((error) => {
        displayError(error);
    });
}

var submissionObject;
function populateTable() {
    if (!employeeData || !companyName || !buildingData)
        return;
    tableBody.empty();
    for (var i = 0; i < employeeData.length; i++) {
        var employee = employeeData[i];
        var empId = employee.employeeId;
        var fName = employee.firstName;
        var sName = employee.surname;
        var username = employee.username;
        var title = employee.title;
        var cell = employee.cellphone;
        var email = employee.email;
        var company = companyName;
        var building = buildingData[employee.buildingId];

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
            <td><button type="button" class="btn btn-primary editButton">Edit</button></td>
            </tr>`
        );
    }

    $('#table').DataTable(); //Initialize Table
    //listener for edit clicks
    $('.editButton').on("click", function () {
        var row = $(this).closest('tr').first();
        var fields = [];
        row.children().each(function () {
            fields.push($(this).html());
        });
        submissionObject = { employeeId: fields[0] };
        $("#successContainer").empty();
        $("#btnSubmit").attr("disabled", false);
        addValuesToModal(fields);
        $('#editEmployeeModal').modal('show');
    });
}

function submitEditEmployee() {
    $("#editEmployeeWarning").hide();
    retrieveValuesFromModal();
    if (submissionObject.employeeName.length === 0 || submissionObject.employeeSurname.length === 0 || submissionObject.username.length === 0 || submissionObject.employeeTitle.length === 0 || submissionObject.employeeCellphone === 0 || submissionObject.employeeEmail.length === 0) {
        $("#editEmployeeWarning").show();
    } else {
        console.log(submissionObject);
        submissionObject.apiKey = apiKey;
        $.post("/admin/editEmployee", JSON.stringify(submissionObject), (data) => {
            if (data.success) {
                console.log("successfully modified employee");
                $("#successContainer").empty().append(`
            <div class="alert alert-success hide" role="alert">
            <h4 class="alert-heading">Operation Successful!</h4>
            Employee modified successfully. Please <a href="./employees.html" class="alert-link">refresh</a> the page in
            order to view the updated information in the table.
            </div>
            `);
                $("#btnSubmit").attr("disabled", true);
            } else {
                console.log(data.message);
                console.log("failed to modify employee");
            }
        });
    }

}

function retrieveValuesFromModal() {
    //prepare a potential submission object
    submissionObject.employeeName = $('#editFirstName').val().trim();
    submissionObject.employeeSurname = $('#editSurname').val().trim();
    submissionObject.username = $('#editUsername').val().trim();
    submissionObject.employeeTitle = $('#editTitle').val().trim();
    submissionObject.employeeCellphone = $('#editCellphone').val().trim();
    submissionObject.employeeEmail = $('#editEmail').val().trim();
    submissionObject.buildingId = $('#buildingSelect').val().trim();

}

function addValuesToModal(fields) {

    //populate modal
    $('#editFirstName').val(fields[1]);
    $('#editSurname').val(fields[2]);
    $('#editUsername').val(fields[3]);
    $('#editTitle').val(fields[4]);
    $('#editCellphone').val(fields[5]);
    $('#editEmail').val(fields[6]);
    var currentBuildingId = findBuildingIdFromBuildingName(fields[8]);
    var selector = $('#buildingSelect');
    selector.empty();
    for (var id in buildingData) {
        if (buildingData.hasOwnProperty(id)) {
            if (id == currentBuildingId) {
                selector.append(`<option value="${id}" selected>${buildingData[id]}</option>`);
            } else {
                selector.append(`<option value="${id}">${buildingData[id]}</option>`);
            }
        }
    }
    $('#editBuilding').val(fields[8]);
}

function findBuildingIdFromBuildingName(name) {
    for (var id in buildingData) {
        if (buildingData[id] === name) {
            return id;
        }
    }
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



function fetchBuildingData(resolve, reject) {
    buildingData = {};

    $.post("/admin/getBuildingsByCompanyId", JSON.stringify({ "apiKey": apiKey, "companyId": companyId }), (data) => {
        if (data.success) {
            var buildingsArray;
            buildingsArray = Object.values(data.data);
            var trimmedObj = {};
            for (var j = 0; j < buildingsArray.length; j++) {
                var building = buildingsArray[j];
                trimmedObj[building.buildingId] = building.branchName;
            }
            buildingData = trimmedObj;

            resolve();
        } else {
            reject("Failed to get buildings: " + data.message);
        }
    });
}

function fetchCompanyName(resolve, reject) {
    $.post("/admin/getCompanyByCompanyId", JSON.stringify({ "apiKey": apiKey, "companyId": companyId }), (data) => {
        if (data.success) {
            companyName = data.data.companyName;
            resolve();
        } else {
            reject("Failed to get company: " + data.message);
        }
    });
}

function displayError(message) {
    alert(message); // change to bootstrap pretty
}



function logout(){
    localStorage.clear();
    window.location.replace("login.html");
}

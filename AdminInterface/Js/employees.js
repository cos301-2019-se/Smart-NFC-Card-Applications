var employeeData; //array of employee objects
var companyName; // array of company objects
var buildingData; //array of buidlings corresponding to the company object
var apiKey;
var companyId;
var tableBody;
var checkEditPassFields = false;

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
        tableBody = $('#tableBody');
        populateTable();
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
    $('#table').on("click", ".editButton", function () {
        var row = $(this).closest('tr').first();
        var fields = [];
        row.children().each(function () {
            fields.push($(this).html());
        });
        submissionObject = { employeeId: fields[0] };
        setupEditModal();
        addValuesToModal(fields);
        $('#editEmployeeModal').modal('show');
    });
}

function setupEditModal() {
    $("#successContainer").empty();
    $('#editPasswordContainer').empty();
    $("#btnSubmit").attr("disabled", false);
    $('#btnExpandEditPassword').show();
    $('#editEmployeePasswordWarning').hide();
    checkEditPassFields = false;
}

function submitEditEmployee() {
    $("#editEmployeeWarning").hide();
    $("#editEmployeePasswordWarning").hide();
    retrieveValuesFromModal();
    if (submissionObject.employeeName.length === 0 || submissionObject.employeeSurname.length === 0 || submissionObject.username.length === 0 || submissionObject.employeeTitle.length === 0 || submissionObject.employeeCellphone === 0 || submissionObject.employeeEmail.length === 0) {
        $("#editEmployeeWarning").show();
    } else {
        var passwordPromise = null;
        if (checkEditPassFields) {
            var password = $('#editModalPass').val().trim();
            var confirmPassword = $('#editModalPassConfirm').val().trim();
            if (password === confirmPassword) {
                var passwordObject = {
                    "employeeId": submissionObject.employeeId,
                    "apiKey": apiKey,
                    "password": password
                }

                passwordPromise = new Promise((resolve, reject) => {
                    $.post("/admin/editEmployeePassword", JSON.stringify(passwordObject), (data) => {
                        if (data.success) {
                            console.log("successfully modified employee's password");
                            resolve();
                        } else {
                            console.log("failed to modify employee" + data.message);
                            reject();
                        }
                    });
                })
            } else {
                $("#editEmployeePasswordWarning").html(`<strong>Error!</strong> Passwords do not match.`).show();
                return; // do not continue with the posts
            }

        }
        if (passwordPromise) {
            passwordPromise.then(() => {
                postEmployeeSubmission();
            }).catch(() => {
                $("#editEmployeePasswordWarning").html(`<strong>Error!</strong> Failed to update password.`).show();
            })
        } else {
            postEmployeeSubmission();
        }
    }

}

function postEmployeeSubmission() {
    console.log(submissionObject);
    submissionObject.apiKey = apiKey;
    $.post("/admin/editEmployee", JSON.stringify(submissionObject), (data) => {
        if (data.success) {
            console.log("successfully modified employee");
            $("#successContainer").empty().append(`
            <div class="alert alert-success hide" role="alert">
            <h4 class="alert-heading">Operation Successful!</h4>
            Employee modified successfully.`);

            /*Please <a href="./employees.html" class="alert-link">refresh</a> the page in
            order to view the updated information in the table.
            </div>
            `);*/
            $("#btnSubmit").attr("disabled", true);
            //$('#editEmployeeModal').modal('hide');
            fetchDataAndPopulateTable();
        } else {
            console.log("failed to modify employee" + data.message);
        }
    });
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

function initializeAddEmployee() {
    clearAddEmployeeModal();
    $("#btnAddEmployee").attr("disabled", false);
    $("#successContainerAddedEmployee").empty();
    $('#addEmployeeModal').modal('show');
    //add buildings
    var selector = $('#buildingSelectAddEmployee');
    selector.empty();
    selector.append(`<option value="default" selected>Select a building...</option>`);
    for (var id in buildingData) {
        if (buildingData.hasOwnProperty(id)) {
            selector.append(`<option value="${id}">${buildingData[id]}</option>`);
        }
    }
}

function clearAddEmployeeModal() {
    $("#addFirstName").val("");
    $("#addSurname").val("");
    $("#addTitle").val("");
    $("#addEmail").val("");
    $("#addCellphone").val("");
    $("#addPassword").val("");
    $("#addPasswordConfirm").val("");
}

function addEmployee() {
    var newEmployeeObj = {};
    if (retrieveValuesFromAddEmployee(newEmployeeObj)) {
        console.log(newEmployeeObj);
        newEmployeeObj.apiKey = apiKey;
        $.post("/admin/addEmployee", JSON.stringify(newEmployeeObj), (data) => {
            if (data.success) {
                console.log("successfully added employee");
                $("#successContainerAddedEmployee").empty().append(`
            <div class="alert alert-success hide" role="alert">
            <h4 class="alert-heading">Operation Successful!</h4>
            Employee added successfully.`);

                /*Please <a href="./employees.html" class="alert-link">refresh</a> the page in
                order to view the updated information in the table.
                </div>
                `);*/
                $("#btnAddEmployee").attr("disabled", true);
                //$('#addEmployeeModal').modal('hide');
                fetchDataAndPopulateTable();
            } else {
                console.log("failed to add employee");
                console.log(data.message);
            }
        });
    } else {
        console.log("Fix your inputs!")
    }
}

function retrieveValuesFromAddEmployee(newEmployeeObj) {
    newEmployeeObj.employeeName = $("#addFirstName").val().trim();
    if (isEmpty(newEmployeeObj.employeeName)) return false;

    newEmployeeObj.employeeSurname = $('#addSurname').val().trim();
    if (isEmpty(newEmployeeObj.employeeSurname)) return false;

    newEmployeeObj.employeeTitle = $('#addTitle').val().trim();
    if (isEmpty(newEmployeeObj.employeeTitle)) return false;

    newEmployeeObj.employeeEmail = $('#addEmail').val().trim();
    if (isEmpty(newEmployeeObj.employeeEmail)) return false; //for now just an empty check, but later can extend validation

    newEmployeeObj.employeeCellphone = $('#addCellphone').val().trim();
    if (isEmpty(newEmployeeObj.employeeCellphone)) return false;

    newEmployeeObj.buildingId = $('#buildingSelectAddEmployee').val().trim();
    if ((newEmployeeObj.buildingId) == "default") return false;
    newEmployeeObj.buildingId = parseInt(newEmployeeObj.buildingId);

    newEmployeeObj.employeePassword = $('#addPassword').val().trim();
    if (newEmployeeObj.employeePassword !== $("#addPasswordConfirm").val().trim()) return false;

    newEmployeeObj.companyId = parseInt(companyId);

    return true;
}

function isEmpty(field) {
    if (field.length === 0) {
        return true;
    } else {
        return false;
    }
}

function expandEditPassword() {
    $('#editPasswordContainer').empty().append(`
     <div class="input-group mb-3">
           <div class="input-group-prepend">
               <span class="input-group-text font-weight-bold">New Password</span>
          </div>
           <input type="password" class="form-control" id="editModalPass" placeholder="e.g Pass" required>
     </div>
     <div class="input-group mb-3">
            <div class="input-group-prepend">
                 <span class="input-group-text font-weight-bold">Confirm Password</span>
             </div>
             <input type="password" class="form-control" id="editModalPassConfirm" placeholder="e.g Pass" required>
     </div>
    `);
    $('#btnExpandEditPassword').hide();
    checkEditPassFields = true;
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
    console.log("AWE")
    $('#mainErrorAlert').html(` 
    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
    <strong>Error!</strong> ${message}`).show();
}

function logout() {
    localStorage.clear();
    window.location.replace("login.html");
}

function checkCompanies(){
    if(localStorage.getItem("id")==1) {
        $("#navBar").append('<li class="nav-item"><a class="nav-link" href="Companies.html">Companies</a></li>');
    }
}

/*
$.post("/admin/editEmployee
$.post("/admin/editPaymentPoint

$.post("/admin/addEmployee
$.post("/admin/addPaymentPoint

$.post("/admin/getEmployeesByCompanyId
$.post("/admin/getPaymentPointsByCompanyId


$.post("/admin/getBuildingsByCompanyId


$.post("/admin/getCompanyByCompanyId


*/
var paymentPointData; //array of employee objects
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
    let fetchPaymentPoints = new Promise((resolve, reject) => { fetchPaymentPointData(resolve, reject); });
    let fetchBuildings = new Promise((resolve, reject) => { fetchBuildingData(resolve, reject); });
    let fetchCompany = new Promise((resolve, reject) => { fetchCompanyName(resolve, reject) });

    Promise.all([fetchPaymentPoints, fetchBuildings, fetchCompany]).then(() => {
        tableBody = $('#tableBody');
        populateTable();
    }).catch((error) => {
        displayError(error);
    });
}

var submissionObject;
function populateTable() {
    if (!paymentPointData || !companyName || !buildingData)
        return;
    tableBody.empty();
    for (var i = 0; i < paymentPointData.length; i++) {
        var paymentPoint = paymentPointData[i];
        var ppId = paymentPoint.employeeId;
        var building = buildingData[paymentPoint.buildingId];
        var desc = paymentPoint.firstName;

        tableBody.append(
            `<tr>
            <td>${ppId}</td>
            <td>${building}</td>
            <td>${desc}</td>
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
        $('#editPaymentPointModal').modal('show');
    });
}

function setupEditModal() {
    $("#successContainer").empty();
    $("#btnSubmit").attr("disabled", false);
    checkEditPassFields = false;
}

function submitEditPaymentPoint() {
    $("#editPaymentPointWarning").hide();
    $("#editEmployeePasswordWarning").hide();
    retrieveValuesFromModal();
    if (submissionObject.employeeName.length === 0 || submissionObject.employeeSurname.length === 0 || submissionObject.username.length === 0 || submissionObject.employeeTitle.length === 0 || submissionObject.employeeCellphone === 0 || submissionObject.employeeEmail.length === 0) {
        $("#editPaymentPointWarning").show();
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
            //$('#editPaymentPointModal').modal('hide');
            fetchDataAndPopulateTable();
        } else {
            console.log("failed to modify employee" + data.message);
        }
    });
}

function retrieveValuesFromModal() {
    //prepare a potential submission object
    submissionObject.employeeName = $('#editDescription').val().trim();
    submissionObject.buildingId = $('#buildingSelect').val().trim();
}

function addValuesToModal(fields) {
    //populate modal
    $('#editDescription').val(fields[2]);
    var currentBuildingId = findBuildingIdFromBuildingName(fields[1]);
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
    $('#editBuilding').val(fields[1]);
}

function findBuildingIdFromBuildingName(name) {
    for (var id in buildingData) {
        if (buildingData[id] === name) {
            return id;
        }
    }
}

function initializeAddPaymentPoint() {
    clearAddPaymentPointModal();
    $("#btnAddPaymentPoint").attr("disabled", false);
    $("#successContainerAddedPaymentPoint").empty();
    $('#addPaymentPointModal').modal('show');
    //add buildings
    var selector = $('#buildingSelectAddPaymentPoint');
    selector.empty();
    selector.append(`<option value="default" selected>Select a building...</option>`);
    for (var id in buildingData) {
        if (buildingData.hasOwnProperty(id)) {
            selector.append(`<option value="${id}">${buildingData[id]}</option>`);
        }
    }
}

function clearAddPaymentPointModal() {
    $("#addDescription").val("");
}

function addPaymentPoint() {
    var newPaymentPointObj = {};
    if (retrieveValuesFromAddPaymentPoint(newPaymentPointObj)) {
        console.log(newPaymentPointObj);
        newPaymentPointObj.apiKey = apiKey;
        $.post("/admin/addEmployee", JSON.stringify(newPaymentPointObj), (data) => {
            if (data.success) {
                console.log("successfully added employee");
                $("#successContainerAddedPaymentPoint").empty().append(`
            <div class="alert alert-success hide" role="alert">
            <h4 class="alert-heading">Operation Successful!</h4>
            Employee added successfully.`);

                /*Please <a href="./employees.html" class="alert-link">refresh</a> the page in
                order to view the updated information in the table.
                </div>
                `);*/
                $("#btnAddPaymentPoint").attr("disabled", true);
                //$('#addPaymentPointModal').modal('hide');
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

function retrieveValuesFromAddPaymentPoint(newPaymentPointObj) {
    newPaymentPointObj.employeeName = $("#addDescription").val().trim();
    if (isEmpty(newPaymentPointObj.employeeName)) return false;

    newPaymentPointObj.buildingId = $('#buildingSelectAddPaymentPoint').val().trim();
    if ((newPaymentPointObj.buildingId) == "default") return false;
    newPaymentPointObj.buildingId = parseInt(newPaymentPointObj.buildingId);

    newPaymentPointObj.companyId = parseInt(companyId);

    return true;
}

function isEmpty(field) {
    if (field.length === 0) {
        return true;
    } else {
        return false;
    }
}


function fetchPaymentPointData(resolve, reject) {
    $.post("/admin/getEmployeesByCompanyId", JSON.stringify({ "apiKey": apiKey, "companyId": companyId }), (data) => {
        if (data.success) {
            paymentPointData = data.data;
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

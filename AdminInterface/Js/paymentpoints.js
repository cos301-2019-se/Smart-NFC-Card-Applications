var paymentPointData; //array of payment point objects
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
    $('#table').DataTable().clear().destroy();
    for (var i = 0; i < paymentPointData.length; i++) {
        var paymentPoint = paymentPointData[i];
        var ppId = paymentPoint.nfcPaymentPointId;
        var building = buildingData[paymentPoint.buildingId];
        var desc = paymentPoint.description;

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
        submissionObject = { nfcPaymentPointId: fields[0] };
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
    retrieveValuesFromModal();
    if (submissionObject.description.length === 0) {
        $("#editPaymentPointWarning").show();
    } else {
		postPaymentPointSubmission();
    }

}

function postPaymentPointSubmission() {
    console.log(submissionObject);
    submissionObject.apiKey = apiKey;
    $.post("/admin/editPaymentPoint", JSON.stringify(submissionObject), (data) => {
        if (data.success) {
            console.log("successfully modified payment point");
            $("#successContainer").empty().append(`
            <div class="alert alert-success hide" role="alert">
            <h4 class="alert-heading">Operation Successful!</h4>
            Payment Point modified successfully.`);

            /*Please <a href="./paymentpoints.html" class="alert-link">refresh</a> the page in
            order to view the updated information in the table.
            </div>
            `);*/
            $("#btnSubmit").attr("disabled", true);
            //$('#editPaymentPointModal').modal('hide');
            fetchDataAndPopulateTable();
        } else {
            console.log("failed to modify payment point" + data.message);
        }
    });
}

function retrieveValuesFromModal() {
    //prepare a potential submission object
    submissionObject.description = $('#editDescription').val().trim();
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
        $.post("/admin/addPaymentPoint", JSON.stringify(newPaymentPointObj), (data) => {
            if (data.success) {
                console.log("successfully added payment point");
                $("#successContainerAddedPaymentPoint").empty().append(`
            <div class="alert alert-success hide" role="alert">
            <h4 class="alert-heading">Operation Successful!</h4>
            Payment Point added successfully.`);

                /*Please <a href="./paymentpoints.html" class="alert-link">refresh</a> the page in
                order to view the updated information in the table.
                </div>
                `);*/
                $("#btnAddPaymentPoint").attr("disabled", true);
                //$('#addPaymentPointModal').modal('hide');
                fetchDataAndPopulateTable();
            } else {
                console.log("failed to add payment point");
                console.log(data.message);
            }
        });
    } else {
        console.log("Fix your inputs!")
    }
}

function retrieveValuesFromAddPaymentPoint(newPaymentPointObj) {
    newPaymentPointObj.description = $("#addDescription").val().trim();
    if (isEmpty(newPaymentPointObj.description)) return false;

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
    $.post("/admin/getPaymentPointsByCompanyId", JSON.stringify({ "apiKey": apiKey, "companyId": companyId }), (data) => {
        if (data.success) {
            paymentPointData = data.data;
            resolve();
        } else {
            reject("Failed to retrieve payment point information. Please try again later");
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
        $("#navBar").append('<li class="nav-item"><a class="nav-link" href="companies.html">Companies</a></li>');
    }
}

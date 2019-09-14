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

        $("#hiddenInputFile").change(function (event) {
            var input = event.target;
            Papa.parse(input.files[0], {
                complete: function (results) {
                    lines = results.data;
                    if (lines.length === 0)
                        return;

                    if (lines[0].length !== 7 || lines[0][0] !== "first_name" || lines[0][1] !== "surname" || lines[0][2] !== "title" || lines[0][3] !== "cellphone" || lines[0][4] !== "email" || lines[0][5] !== "create_password" || lines[0][6] !== "building_name") {
                        displayError("alertContainer", "Invalid header for csv file. Header should be: first_name,surname,title,cellphone,email,create_password,building_name");
                        return;
                    }
                    postArr = [];
                    let parsedCompanyId = parseInt(companyId);
                    for (var i = 1; i < lines.length; i++) {
                        let line = lines[i];
                        if (line.length <= 1)
                            continue; //this skips empty lines

                        if (line.length !== 7) {
                            displayError("alertContainer", "Invalid number of columns on row " + (i + 1));
                            return;
                        }


                        let firstName = line[0].trim();
                        if (!isAlphabetic(firstName)) {
                            displayError("alertContainer", "Invalid first name on row " + (i + 1));
                            return;
                        }

                        let surname = line[1].trim();
                        if (!isAlphabetic(surname)) {
                            displayError("alertContainer", "Invalid surname on row " + (i + 1));
                            return;
                        }

                        let title = line[2].trim();
                        if (!isAlphabetic(title) && title.length <= 10) {
                            displayError("alertContainer", "Invalid title on row " + (i + 1));
                            return;
                        }

                        let cellphone = line[3].trim();
                        if (!isCellphoneNumber(cellphone)) {
                            displayError("alertContainer", "Invalid cellphone on row " + (i + 1));
                            return;
                        }

                        let email = line[4].trim();
                        if (!isEmail(email)) {
                            displayError("alertContainer", "Invalid email on row " + (i + 1));
                            return;
                        }

                        let password = line[5].trim();
                        if (password.length === 0) {
                            displayError("alertContainer", "Invalid password on row " + (i + 1));
                            return;
                        }

                        let buildingName = line[6].trim();
                        let buildingId = findBuildingIdFromBuildingName(buildingName.trim());
                        if (buildingId === false) {
                            displayError("alertContainer", "Invalid building name on row " + (i + 1));
                            return;
                        }

                        postArr.push({
                            'employeeName': firstName,
                            'employeeSurname': surname,
                            'employeeTitle': title,
                            'employeeEmail': email,
                            'employeeCellphone': cellphone,
                            'buildingId': parseInt(buildingId),
                            'employeePassword': password,
                            'companyId': parsedCompanyId
                        });

                    }
                    if (postArr.length === 0)
                        return;
                    let postObject = {};
                    postObject.apiKey = apiKey;
                    postObject.companyId = parseInt(companyId);
                    postObject.data = postArr;
                    console.log(postObject);


                    $.post("/admin/addEmployees", JSON.stringify(postObject), (data) => {
                        if (data.success) {
                            $("#alertContainer").empty().append(`
                            <div class="alert alert-success hide" role="alert">
                            <h4 class="alert-heading">Operation Successful!</h4>
                            Added Employees Successfully`);                        } else {
                            displayError("alertContainer", "Failed to modify employee, please try again later");
                        }
                
                    }).fail(() => {
                        displayError("alertContainer", "Failed to modify employee. Please check your connection");
                    });

                }
            });
        });

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
        displayError("alertContainer", error);
    });
}

var submissionObject;
function populateTable() {
    if (!employeeData || !companyName || !buildingData)
        return;
    tableBody.empty();
    $('#table').DataTable().clear().destroy();
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
    $("#editEmployeeWarning").hide();
    $("#alertContainerEditModal").html('');
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
                if (password.length === 0) {
                    $("#editEmployeePasswordWarning").html('<strong>Error!</strong> Please enter a new password').show();
                    return; // do not continue with the posts
                }
                var passwordObject = {
                    "employeeId": submissionObject.employeeId,
                    "apiKey": apiKey,
                    "password": password
                }

                passwordPromise = new Promise((resolve, reject) => {
                    $.post("/admin/editEmployeePassword", JSON.stringify(passwordObject), (data) => {
                        if (data.success) {
                            resolve();
                        } else {
                            reject();
                        }
                    }).fail(() => {
                        reject();
                    });
                })
            } else {
                $("#editEmployeePasswordWarning").html('<strong>Error!</strong> Passwords do not match').show();
                return; // do not continue with the posts
            }

        }
        if (passwordPromise) {
            passwordPromise.then(() => {
                postEmployeeSubmission();
            }).catch(() => {
                displayError("alertContainerEditModal", "Failed to modify employee. Please try again later");
            })
        } else {
            postEmployeeSubmission();
        }
    }

}

function postEmployeeSubmission() {
    submissionObject.apiKey = apiKey;
    $.post("/admin/editEmployee", JSON.stringify(submissionObject), (data) => {
        if (data.success) {
            $("#successContainer").empty().append(`
            <div class="alert alert-success hide" role="alert">
            <h4 class="alert-heading">Operation Successful!</h4>
            Employee modified successfully.`);

            $("#btnSubmit").attr("disabled", true);
            //$('#editEmployeeModal').modal('hide');
            fetchDataAndPopulateTable();
        } else {
            displayError("alertContainerEditModal", "Failed to modify employee, please try again later");
        }

    }).fail(() => {
        displayError("alertContainerEditModal", "Failed to modify employee. Please check your connection");
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
    var currentBuildingId = findBuildingIdFromBuildingName(fields[7]);
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
    return false;
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
    $("#alertContainerAddModal").html('');
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
        newEmployeeObj.apiKey = apiKey;
        $.post("/admin/addEmployee", JSON.stringify(newEmployeeObj), (data) => {
            if (data.success) {
                $("#successContainerAddedEmployee").empty().append(`
            <div class="alert alert-success hide" role="alert">
            <h4 class="alert-heading">Operation Successful!</h4>
            Employee added successfully.`);

                $("#btnAddEmployee").attr("disabled", true);
                //$('#addEmployeeModal').modal('hide');
                fetchDataAndPopulateTable();
            } else {
                displayError("alertContainerAddModal", "Failed to add employee: " + data.message);
            }
        }).fail(() => {
            displayError("alertContainerAddModal", "Failed to add employee please check your connection");
        });
    } else {
        displayError("alertContainerAddModal", "Please ensure all fields are filled in correctly");
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

function displayError(containerId, message) {
    let name = "#" + containerId;
    $(name).html(`<div class="alert alert-danger alert-dismissible" id="mainErrorAlert" style="margin-top : 0.5rem" >
    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
    <strong>Error!</strong> ${message} </div>`).show();
}

function logout() {
    localStorage.clear();
    window.location.replace("login.html");
}

function checkCompanies() {
    if (localStorage.getItem("id") == 1) {
        var a = document.createElement('a');
        var linkText = document.createTextNode("Companies");
        a.appendChild(linkText);
        a.title = "Companies";
        a.href = "companies.html";
        var nav = document.getElementById("myTopnav");
        nav.insertBefore(a, nav.children[6]);
    }
}
function checkNav() {
    var x = document.getElementById("myTopnav");
    var comp = document.getElementById("companyTab");
    var log = document.getElementById("logoutTab");
    if (x.className === "topnav") {
        comp.style = "";
        log.style = "";
        x.className += " responsive";
    } else {
        x.className = "topnav";
        comp.style = "float: right";
        log.style = "float: right";
    }
}

function isAlphabetic(letters) {
    //allows for A-Z or a-z as first char, then followed by A-Z/a-z/ (space)/-
    if (/^([A-Za-z])([\-A-Za-z ])+$/.test(letters)) {
        return true;
    }
    return false;
}

function isCellphoneNumber(cellphone) {
    var regex = [
        /^"?[0-9]{10}"?$/,
        /^"?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})"?$/,
        /^"?\(\+([0-9]{2})\)?[-. ]?([0-9]{2})[-. ]?([0-9]{3})[-. ]?([0-9]{4})"?$/
    ];
    for (var countRegex = 0; countRegex < regex.length; ++countRegex) {
        if (regex[countRegex].test(cellphone)) {
            return true;
        }
    }
    return false;
}

function isEmail(email) {
    if (/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(email)) {
        return true;
    }
    else {
        return false
    }
}

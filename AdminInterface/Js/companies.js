var companies; // array of company objects
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
    let fetchCompaniesdata  = new Promise((resolve, reject) => { fetchCompanies(resolve, reject); });

    Promise.all([fetchCompaniesdata]).then(() => {
        tableBody = $('#tableBody');
        populateTable();
    }).catch((error) => {
        displayError(error);
    });
}

var submissionObject;
function populateTable() {
    if (!companies)
        return;
    tableBody.empty();
    for (var i = 0; i < companies.length; i++) {
        var company = companies[i];
        var cmpId = company.companyId;
        var name = company.companyName;
        var website = company.companyWebsite;
        var username = company.username;

        tableBody.append(
            `<tr>
            <td>${cmpId}</td>
            <td>${name}</td>
            <td>${website}</td>
            <td>${username}</td>
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
        submissionObject = { companyId: fields[0] };
        setupEditModal();
        addValuesToModal(fields);
        $('#editCompanyModal').modal('show');
    });
}

function setupEditModal() {
    $("#successContainer").empty();
    $('#editPasswordContainer').empty();
    $("#btnSubmit").attr("disabled", false);
    $('#btnExpandEditPassword').show();
    $('#editCompanyPasswordWarning').hide();
    checkEditPassFields = false;
}

function submitEditCompany() {
    $("#editCompanyWarning").hide();
    $("#editCompanyPasswordWarning").hide();
    retrieveValuesFromModal();
    if (submissionObject.companyName.length === 0 || submissionObject.companyWebsite.length === 0 || submissionObject.companyUsername.length === 0) {
        $("#editCompanyWarning").show();
    } else {
        var passwordPromise = null;
        if (checkEditPassFields) {
            var password = $('#editModalPass').val().trim();
            var confirmPassword = $('#editModalPassConfirm').val().trim();
            if (password === confirmPassword) {
                var passwordObject = {
                    "companyId": submissionObject.companyId,
                    "apiKey": apiKey,
                    "password": password
                };

                passwordPromise = new Promise((resolve, reject) => {
                    $.post("/admin/editCompanyPassword", JSON.stringify(passwordObject), (data) => {
                        if (data.success) {
                            console.log("successfully modified Company's password");
                            resolve();
                        } else {
                            console.log("failed to modify Company" + data.message);
                            reject();
                        }
                    });
                })
            } else {
                $("#editCompanyPasswordWarning").html(`<strong>Error!</strong> Passwords do not match.`).show();
                return; // do not continue with the posts
            }

        }
        if (passwordPromise) {
            passwordPromise.then(() => {
                postCompanySubmission();
            }).catch(() => {
                $("#editCompanyPasswordWarning").html(`<strong>Error!</strong> Failed to update password.`).show();
            })
        } else {
            postCompanySubmission();
        }
    }

}

function postCompanySubmission() {
    console.log(submissionObject);
    submissionObject.apiKey = apiKey;
    $.post("/admin/editCompany", JSON.stringify(submissionObject), (data) => {
        if (data.success) {
            console.log("successfully modified company");
            $("#successContainer").empty().append(`
            <div class="alert alert-success hide" role="alert">
            <h4 class="alert-heading">Operation Successful!</h4>
            Company modified successfully.`);

            /*Please <a href="./employees.html" class="alert-link">refresh</a> the page in
            order to view the updated information in the table.
            </div>
            `);*/
            $("#btnSubmit").attr("disabled", true);
            //$('#editCompanyModal').modal('hide');
            fetchDataAndPopulateTable();
        } else {
            console.log("failed to modify company" + data.message);
        }
    });
}

function retrieveValuesFromModal() {
    //prepare a potential submission object
    submissionObject.companyName = $('#editName').val().trim();
    submissionObject.companyWebsite = $('#editWebsite').val().trim();
    submissionObject.companyUsername = $('#editUsername').val().trim();
}

function addValuesToModal(fields) {
    //populate modal
    $('#editName').val(fields[1]);
    $('#editWebsite').val(fields[2]);
    $('#editUsername').val(fields[3]);
}

function initializeAddCompany() {
    $("#addCompanyWarning").hide();
    clearAddCompanyModal();
    $("#btnAddCompany").attr("disabled", false);
    $("#successContainerCompany").empty();
    $('#addCompanyModal').modal('show');
}

function clearAddCompanyModal() {
    $("#addName").val("");
    $("#addWebsite").val("");
    $("#addUsername").val("");
    $("#addPassword").val("");
    $("#addPasswordConfirm").val("");
}

function addCompany() {
    var newCompanyObj = {};
    $("#addCompanyWarning").html(`<strong>Error!</strong> Please fill in all the fields.`);
    if (retrieveValuesFromAddCompany(newCompanyObj)) {
        console.log(newCompanyObj);
        newCompanyObj.apiKey = apiKey;
        $.post("/admin/addCompany", JSON.stringify(newCompanyObj), (data) => {
            if (data.success) {
                console.log("successfully added companny");
                $("#addCompanyWarning").hide();
                $("#successContainerCompany").empty().append(`
            <div class="alert alert-success hide" role="alert">
            <h4 class="alert-heading">Operation Successful!</h4>
            Company added successfully.`);

                /*Please <a href="./employees.html" class="alert-link">refresh</a> the page in
                order to view the updated information in the table.
                </div>
                `);*/
                $("#btnAddCompany").attr("disabled", true);
                //$('#addEmployeeModal').modal('hide');
                fetchDataAndPopulateTable();
            } else {
                console.log("failed to add company");
                console.log(data.message);
                $("#addCompanyWarning").show();
                $("#addCompanyWarning").html(`<strong>Error!</strong>`+data.message);
            }
        });
    } else {
        $("#addCompanyWarning").show();
        return; // do not continue with the posts
    }
}

function retrieveValuesFromAddCompany(newCompanyObj) {
    newCompanyObj.companyName = $("#addName").val().trim();
    if (isEmpty(newCompanyObj.companyName)) return false;

    newCompanyObj.companyWebsite = $('#addWebsite').val().trim();
    if (isEmpty(newCompanyObj.companyWebsite)) return false;

    newCompanyObj.companyUsername = $('#addUsername').val().trim();
    if (isEmpty(newCompanyObj.companyUsername)) return false;

    newCompanyObj.companyPassword = $('#addPassword').val().trim();
    if(isEmpty(newCompanyObj.companyPassword)) return false;

    if (newCompanyObj.companyPassword !== $("#addPasswordConfirm").val().trim()){
        $("#addCompanyWarning").html(`<strong>Error!</strong> Passwords Dont Match.`);
        return false;
    }

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

function fetchCompanies(resolve, reject) {
    $.post("/admin/getCompanies", JSON.stringify({ "apiKey": apiKey,}), (data) => {
        if (data.success) {
            companies = data.data;
            resolve();
        } else {
            reject("Failed to get company: " + data.message);
        }
    });
}

function displayError(message) {
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
        $("#navBar").append('<li class="nav-item active"><a class="nav-link" href="companies.html">Companies</a></li>');
    }
}

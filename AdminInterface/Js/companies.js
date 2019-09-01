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
    let fetchCompaniesdata = new Promise((resolve, reject) => { fetchCompanies(resolve, reject); });

    Promise.all([fetchCompaniesdata]).then(() => {
        tableBody = $('#tableBody');
        populateTable();
    }).catch((error) => {
        displayError("alertContainer", error);
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
                if (password.length === 0) {
                    $("#editCompanyPasswordWarning").html('<strong>Error!</strong> Please enter a new password').show();
                    return; // do not continue with the posts
                }


                var passwordObject = {
                    "companyId": submissionObject.companyId,
                    "apiKey": apiKey,
                    "password": password
                };

                passwordPromise = new Promise((resolve, reject) => {
                    $.post("/admin/editCompanyPassword", JSON.stringify(passwordObject), (data) => {
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
                $("#editCompanyPasswordWarning").html('<strong>Error!</strong> Passwords do not match').show();
                return; // do not continue with the posts
            }

        }
        if (passwordPromise) {
            passwordPromise.then(() => {
                postCompanySubmission();
            }).catch(() => {
                $("#editCompanyPasswordWarning").html('<strong>Error!</strong> Failed to update company').show();
            })
        } else {
            postCompanySubmission();
        }
    }

}

function postCompanySubmission() {
    submissionObject.apiKey = apiKey;
    $.post("/admin/editCompany", JSON.stringify(submissionObject), (data) => {
        if (data.success) {
            $("#successContainer").empty().append(`
            <div class="alert alert-success hide" role="alert">
            <h4 class="alert-heading">Operation Successful!</h4>
            Company modified successfully.`);

            $("#btnSubmit").attr("disabled", true);
            fetchDataAndPopulateTable();
        } else {
            $("#editCompanyWarning").html('<strong>Error!</strong> Failed to update company.').show();
        }
    }).fail(() => {
        $("#editCompanyWarning").html('<strong>Error!</strong> Failed to update company. Please check your connection').show();
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
    $("#addCompanyWarning").html('').hide();
    $("#addName").val("");
    $("#addWebsite").val("");
    $("#addUsername").val("");
    $("#addPassword").val("");
    $("#addPasswordConfirm").val("");
}

function addCompany() {
    var newCompanyObj = {};
    if (retrieveValuesFromAddCompany(newCompanyObj)) {
        newCompanyObj.apiKey = apiKey;
        $.post("/admin/addCompany", JSON.stringify(newCompanyObj), (data) => {
            if (data.success) {
                $("#addCompanyWarning").hide();
                $("#successContainerCompany").empty().append(`
            <div class="alert alert-success hide" role="alert">
            <h4 class="alert-heading">Operation Successful!</h4>
            Company added successfully.`);
                $("#btnAddCompany").attr("disabled", true);
                fetchDataAndPopulateTable();
            } else {
                $("#addCompanyWarning").html(`<strong>Error!</strong>` + data.message);
                $("#addCompanyWarning").show();
            }
        }).fail(() => {
            $("#addCompanyWarning").html("<strong>Error!</strong> Failed to add company. Please check your connection");
            $("#addCompanyWarning").show();
        });
    } else {
        $("#addCompanyWarning").html("<strong>Error!</strong> Please check your input fields");
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
    if (isEmpty(newCompanyObj.companyPassword)) return false;

    if (newCompanyObj.companyPassword !== $("#addPasswordConfirm").val().trim()) {
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
    $.post("/admin/getCompanies", JSON.stringify({ "apiKey": apiKey, }), (data) => {
        if (data.success) {
            companies = data.data;
            resolve();
        } else {
            reject("Failed to get company: " + data.message);
        }
    });
}

function displayError(containerId, message) {
    let name = "#" + containerId;
    $(name).html(`<div class="alert alert-warning alert-dismissible" id="mainErrorAlert" style="margin-top : 0.5rem" >
    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
    <strong>Error!</strong> ${message}
    </div>`).show();
}

function logout() {
    localStorage.clear();
    window.location.replace("login.html");
}

function checkCompanies() {
    if (localStorage.getItem("id") == 1) {
        $("#navBar").append('<li class="nav-item active"><a class="nav-link" href="companies.html">Companies</a></li>');
    }
}

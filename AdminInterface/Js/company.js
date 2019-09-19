function loadCompany(callback){

    let api = localStorage.getItem("apiKey");
    let id = localStorage.getItem("id");

    //retrieves company details
    $.post("/admin/getCompanyByCompanyId", JSON.stringify({ "apiKey": api , "companyId" : id}), (data) => {
        if (data.success === true) {
            data = data.data;

            $("#companyNameHead").text(data.companyName);
            $("#aboutCompanyName").val(data.companyName);
            $("#aboutCompanyWebsite").val(data.companyWebsite);
            $("#aboutCompanyUsername").val(data.username);
        }
        else {
            console.log("Error in GetCompanyByCompanyId "+data.message);
			
			if(data.message === "Invalid API Key")
			{
				window.location.replace("login.html");
			}
			
        }
    });
    // retrives number of buildings
     $.post("/admin/getBuildingsByCompanyId", JSON.stringify({ "apiKey": api , "companyId" : id}), (data) => {
         if (data.success === true) {
             data = data.data;

             $("#aboutCompanyBuildings").val(data.length);
         }
         else {
             if(data.message ==="Database query failed: no rows in Building with that matching companyId"){
                 $("#aboutCompanyBuildings").val(0);
             }else{
                 console.log("Error in getBuildingsByCompanyId "+data.message);
             }
         }
     });

    //retrieves number of employees
    $.post("/admin/getEmployeesByCompanyId", JSON.stringify({ "apiKey": api , "companyId" : id}), (data) => {
        if (data.success === true) {
            data = data.data;
            $("#aboutCompanyEmployees").val(data.length);

        }
        else {
            if(data.message ==="Database query failed: no rows in Employee with that matching companyId"){
                $("#aboutCompanyEmployees").val(0);
            }else{
                console.log("Error in getEmployeesByCompanyId "+data.message);
            }
        }
    });
    callback();
}

function fillEditCompany(){
    $("#editCompanyWarning").hide();
    let api = localStorage.getItem("apiKey");
    let id = localStorage.getItem("id");

    $.post("/admin/getCompanyByCompanyId", JSON.stringify({ "apiKey": api , "companyId" : id}), (data) => {
        if (data.success === true) {
            data = data.data;

            $("#editCompanyName").val(data.companyName);
            $("#editCompanyWebsite").val(data.companyWebsite);
            $("#editCompanyUsername").val(data.username);

        }
        else {
            console.log("Error in GetCompanyByCompanyId "+data.message);
        }
    });
}

function editCompany(){
    let companyName = $("#editCompanyName").val().trim();
    let companyWebsite =  $("#editCompanyWebsite").val().trim();
    let companyUsername = $("#editCompanyUsername").val().trim();

    $("#editCompanyName").val(companyName);
    $("#editCompanyWebsite").val(companyWebsite);
    $("#editCompanyUsername").val(companyUsername);

    if(companyName.length ===0 || companyWebsite.length ===0 || companyUsername.length ===0){

        $("#editCompanyWarning").show();
    }else{

        let confirmation = confirm("Are you sure you want to update the company details?");
        if(confirmation === true){

            let api = localStorage.getItem("apiKey");
            let id = localStorage.getItem("id");

            let postObj = {
                apiKey:api,
                companyId:id,
                companyName:companyName,
                companyWebsite:companyWebsite,
                companyUsername:companyUsername

            };
            $.post("/admin/editCompany", JSON.stringify(postObj), (data) => {
                if (data.success === true) {

                    $('#editCompanyModal').modal('hide');
                    loadCompany(function(){});
                    $("#returnMessage").removeClass("alert-danger alert-success");
                    $("#returnMessage").addClass("alert-success");
                    $("#returnMessage").html("<strong>Success!</strong> Company Details Successfully Changed.");
                    $("#returnMessage").show();
                }
                else {
                    // alert("Something went wrong in editing company, "+data.message+".");
                    console.log("Error in editCompany "+data.message);
                    $("#returnMessage").removeClass("alert-danger alert-success");
                    $("#returnMessage").addClass("alert-danger");
                    $("#returnMessage").html("<strong>Error!</strong> Something went wrong in the editing of your company, Please try again. If the problem persists please contact Link");
                    $("#returnMessage").show();
                }
            });
        }
    }
}

function preparePassword(){
    $("#editOldPassword").val('');
    $("#editNewPassword").val('');
    $("#editRepeatNewPassword").val('');
    $("#editPasswordWarning").hide();
}

function editPassword(){
    let oldPassword = $("#editOldPassword").val().trim();
    let newPassword =  $("#editNewPassword").val().trim();
    let repeatNewPassword = $("#editRepeatNewPassword").val().trim();

    $("#editOldPassword").val(oldPassword);
    $("#editNewPassword").val(newPassword);
    $("#editRepeatNewPassword").val(repeatNewPassword);

    if(oldPassword.length ===0 || newPassword.length ===0 || repeatNewPassword.length ===0) {
        $("#editPasswordWarning").html("<strong>Error!</strong> Please fill in all the fields.");
        $("#editPasswordWarning").show();
    }
    else if(newPassword!==repeatNewPassword){
        $("#editPasswordWarning").html("<strong>Error!</strong> New Passwords dont match.");
        $("#editPasswordWarning").show();
    }else{

        let confirmation = confirm("Are you sure you want to change the company password?");
        if(confirmation === true){

            let api = localStorage.getItem("apiKey");
            let id = localStorage.getItem("id");

            let postObj = {
                apiKey:api,
                oldPassword:oldPassword,
                newPassword:newPassword
            };
            $.post("/admin/editPassword", JSON.stringify(postObj), (data) => {
                if (data.success === true) {

                    $('#editPasswordModal').modal('hide');

                    $("#returnMessage").removeClass("alert-danger alert-success");
                    $("#returnMessage").addClass("alert-success");
                    $("#returnMessage").html("<strong>Success!</strong> Password Successfully Changed.");
                    $("#returnMessage").show();
                }
                else {
                    // alert("Something went wrong in editing password, "+data.message+".");
                    console.log("Error in editPassword "+data.message);
                    $('#editPasswordModal').modal('hide');
                    $("#returnMessage").removeClass("alert-danger alert-success");
                    $("#returnMessage").addClass("alert-danger");
                    $("#returnMessage").html("<strong>Error!</strong> Something went wrong in the editing of your Password. "+data.message);
                    $("#returnMessage").show();
                }
            });
        }
    }
}

function logout(){
    localStorage.clear();
    window.location.replace("login.html");
}

function checkCompanies(){
    if(localStorage.getItem("id")==1) {
        var a = document.createElement('a');
        var linkText = document.createTextNode("Companies");
        a.appendChild(linkText);
        a.title = "Companies";
        a.href = "companies.html";
        var nav = document.getElementById("myTopnav");
        nav.insertBefore(a,nav.children[6]);
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

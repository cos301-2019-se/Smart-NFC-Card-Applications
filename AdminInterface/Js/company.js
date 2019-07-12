function loadCompany(callback) {

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

            //retrives number of buildings -- comment out when adminLogic fixed
            $.post("/admin/getBuildingsByCompanyId", JSON.stringify({ "apiKey": api , "companyId" : id}), (data) => {
                if (data.success === true) {
                    data = data.data;

                    $("#aboutCompanyBuildings").val(data.length);

                    //retrieves number of employees -- comment out when adminLogic fixed
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
                }
                else {
                    if(data.message ==="Database query failed: no rows in Building with that matching companyId"){
                        $("#aboutCompanyBuildings").val(0);
                    }else{
                        console.log("Error in getBuildingsByCompanyId "+data.message);
                    }
                }
            });
        }
        else {
            console.log("Error in GetCompanyByCompanyId "+data.message);
        }
    });
    //retrives number of buildings
    //  $.post("/admin/getBuildingsByCompanyId", JSON.stringify({ "apiKey": api , "companyId" : id}), (data) => {
    //                 if (data.success === true) {
    //                     data = data.data;
    //
    //                     $("#aboutCompanyBuildings").val(data.length);
    //                 }
    //                 else {
    //                     if(data.message ==="Database query failed: no rows in Building with that matching companyId"){
    //                         $("#aboutCompanyBuildings").val(0);
    //                     }else{
    //                         console.log("Error in getBuildingsByCompanyId "+data.message);
    //                     }
    //                 }
    //             });
    //
    // //retrieves number of employees
    // $.post("/admin/getEmployeesByCompanyId", JSON.stringify({ "apiKey": api , "companyId" : id}), (data) => {
    //                         if (data.success === true) {
    //                             data = data.data;
    //
    //                             $("#aboutCompanyEmployees").val(data.length);
    //
    //                         }
    //                         else {
    //                             if(data.message ==="Database query failed: no rows in Employee with that matching companyId"){
    //                                 $("#aboutCompanyEmployees").val(0);
    //                             }else{
    //                                 console.log("Error in getEmployeesByCompanyId "+data.message);
    //                             }
    //                         }
    //                     });

    callback();
}

function fillEditCompany(){
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
    console.log( $("#editCompanyName").val());
    console.log( $("#editCompanyWebsite").val());
    console.log( $("#editCompanyUsername").val());

}

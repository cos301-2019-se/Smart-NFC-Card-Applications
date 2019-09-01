var apiKey;
var companyId;
var start;
var end;
var tableIsCustom;
var customFields;
var globalTransactionsObject;
$(document).ready(function () {
    companyId = localStorage.getItem("id");
    apiKey = localStorage.getItem("apiKey");
    if (apiKey == null || companyId == null) {
        window.location.replace("login.html");
    } else {
        var employeeSearchField = $('#employeeSearchField').hide();
        $('#fullTableContainer').hide();
        start = moment().subtract(29, 'days');
        end = moment();

        function cb(s, e) {
            $('#datePicker span').html(s.format('MMMM D, YYYY') + ' - ' + e.format('MMMM D, YYYY'));
            start = s;
            end = e;
        }

        $('#datePicker').daterangepicker({
            startDate: start,
            endDate: end,
            opens: 'center',
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);

        cb(start, end);

        $('#btnSubmitCustomSearch').click(function () {
            let startDate = new Date(start);
            let endDate = new Date(end);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);

            let postObj = { "apiKey": apiKey, "companyId": companyId, "startDate": startDate.toISOString(), "endDate": endDate.toISOString() }

            let searchSpecificEmployee = $('#employeeSwitch').is(':checked');
            let employeeUsername;
            if (searchSpecificEmployee) {
                employeeUsername = $('#employeeSearchField').val().trim();
                if (employeeUsername.length === 0) {
                    $('#employeeSearchField').addClass("is-invalid");
                    return;
                }
                $('#employeeSearchField').removeClass("is-invalid");
                postObj.employeeUsername = employeeUsername;
            }

            $.post("/admin/getAllTransactionsByCompanyId", JSON.stringify(postObj), (data) => {
                if (data.success) {
                    tableIsCustom = true;
                    populateTable(data.data);
                    customFields = {
                        'startDate': moment(startDate).format('YYYY-MM-DD'),
                        'endDate': moment(endDate).format('YYYY-MM-DD')
                    }

                    let employeeString = "";
                    if (employeeUsername) {
                        employeeString = `<li class="list-group-item">Employee Username: ${employeeUsername}</li>`;
                        customFields.employeeUsername = employeeUsername;
                    }
                    let results = `<li class="list-group-item list-group-item-primary">Showing Results for:</li>
                                    <li class="list-group-item">From date: ${customFields.startDate}</li>
                                    <li class="list-group-item">To date: ${customFields.endDate}</li>
                                    ${employeeString}`;
                    $('#searchQueryList').show().html(results);
                } else {
                    displayError("alertContainer", "Failed to find results for that query!");
                }
            }).fail(()=>{
                displayError("alertContainerTop", "Failed to find results for that query. Please check your connection");
            });

        });

        $('#employeeSwitch').on('change', function (event, state) {
            employeeSearchField.toggle();
        });
    }
});

function populateTable(transactionArr) {
    var tableBody = $('#tableBody');
    tableBody.empty();
    $('#table').DataTable().clear().destroy();
    globalTransactionsObject = [];
    for (var i = 0; i < transactionArr.length; i++) {
        var transaction = transactionArr[i];
        var empName = transaction.employeeName;
        var empSurname = transaction.employeeSurname;
        var empEmail = transaction.employeeEmail;
        var amount = transaction.amountSpent;
        var dateTime = moment(new Date(transaction.transactiontime)).format('YYYY-MM-DD HH:mm');
        if (!transaction.paymentDesc)
            var paymentDesc = "None";
        else
            var paymentDesc = transaction.paymentDesc;
        var paymentPointDesc = transaction.paymentPointDesc;

        globalTransactionsObject.push({
            'empName': empName,
            'empSurname': empSurname,
            'empEmail': empEmail,
            'amount': amount,
            'dateTime': dateTime,
            'paymentDesc': paymentDesc,
            'paymentPointDesc': paymentPointDesc
        });

        tableBody.append(
            `<tr>
            <td>${empName}</td>
            <td>${empSurname}</td>
            <td>${empEmail}</td>
            <td>${amount}</td>
            <td>${dateTime}</td>
            <td>${paymentDesc}</td>
            <td>${paymentPointDesc}</td>
            </tr>`
        );
    }
    $('#fullTableContainer').show();
    $('#table').DataTable(); //Initialize Table
    $('#searchContainer').hide();
}

function clickedAdvancedSearch() {
    $('#alertContainer').html('');
    $('#alertContainerTop').html('');
    $('#searchAllBtn').toggleClass('disabled');
}

function clickedSearchAllTransactions() {
    let postObj = { "apiKey": apiKey, "companyId": companyId }

    $.post("/admin/getAllTransactionsByCompanyId", JSON.stringify(postObj), (data) => {
        if (data.success) {
            $('#searchQueryList').hide();
            tableIsCustom = false;
            customFields = undefined;
            populateTable(data.data);
            let results = `<li class="list-group-item list-group-item-primary">Showing Results for:</li>
                                    <li class="list-group-item">All transactions</li>`;
            $('#searchQueryList').show().html(results);

        } else {
            displayError("alertContainerTop", "Failed to find results for that query!");
        }
    }).fail(() => {
        displayError("alertContainerTop", "Failed to find results for that query. Please check your connnection");
    });
}

function researchClicked() {
    tableIsCustom = undefined;
    globalTransactionsObject = undefined;
    customFields = undefined;
    $('#searchContainer').show();
    $('#searchQueryList').hide().html('');
    $('#fullTableContainer').hide();
    $('#collapseAdvancedSearch').removeClass('collapse show').addClass('collapse');
    $('#searchAllBtn').removeClass('disabled');
    $('#employeeSwitch').prop('checked', false);
    $('#employeeSearchField').val('').hide();
    $('#alertContainer').html('');
    $('#alertContainerTop').html('');
    $('#employeeSearchField').removeClass("is-invalid");
    $('#tableBody').empty();
}

function downloadCsv() {
    const headers = ['Employee Name', 'Employee Surname', 'Employee Email', 'Amount Spent', 'Date Time', 'Payment Description', 'Payment Point Description'];
    const rows = [];

    rows.push(headers);
    for (let i = 0; i < globalTransactionsObject.length; i++) {
        rows.push(Object.values(globalTransactionsObject[i]));
    }

    let dataURI = "data:text/csv;charset=utf-8,";

    rows.forEach(function (rowArray) {
        let row = rowArray.join(",");
        dataURI += row + "\r\n";
    });

    let date = new Date();
    let link = document.createElement('a');
    link.download = `Report_${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}.csv`;
    link.href = dataURI;
    link.textContent = 'Download CSV';
    link.click();
}

function downloadPdf() {
    // Add data that will be sent to generate the report
    let postObj = {
        "apiKey": apiKey,
        "companyId": companyId,
    };

    if (tableIsCustom) {
        postObj.type = 'custom';
        postObj.fields = customFields;
    } else {
        postObj.type = 'all';
    }
    postObj.transactions = globalTransactionsObject;

    $.post("/admin/generatePdf", JSON.stringify(postObj), (data) => {
        if (data.success) {
            let dataURI = "data:application/pdf;base64," + data.data.base64;
            let date = new Date();
            let link = document.createElement('a');
            link.download = `Report_${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}.pdf`;
            link.href = dataURI;
            link.textContent = 'Download PDF';
            link.click();
        }
        else {
            displayError("alertContainerTop", "Failed to find results for that query");
        }
    }).fail(() => {
        displayError("alertContainerTop", "Failed to download PDF. Please check your connection");
    });
}

function displayError(containerId, message) {
    let name = "#" + containerId;
    $(name).html(`<div class="alert alert-danger alert-dismissible" id="mainErrorAlert" style="margin-top : 0.5rem" >
    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
    <strong>Error!</strong> ${message}
    </div>`).show();
}

function logout() {
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

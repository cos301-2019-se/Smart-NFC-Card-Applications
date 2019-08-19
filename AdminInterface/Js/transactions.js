var apiKey;
var companyId;
var start;
var end;
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
            startDate.setHours(0,0,0,0);
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
                    populateTable(data.data);
                    let localEndDate = endDate;
                    localEndDate.setUTCHours(0, 0, 0, 0);
                    let employeeString = "";
                    if (employeeUsername)
                        employeeString = `<li class="list-group-item">Employee Username: ${employeeUsername}</li>`;
                    let results = `<li class="list-group-item list-group-item-primary">Showing Results for:</li>
                                    <li class="list-group-item">From date: ${startDate.toLocaleDateString()}</li>
                                    <li class="list-group-item">To date: ${localEndDate.toLocaleDateString()}</li>
                                    ${employeeString}`;
                    $('#searchQueryList').show().html(results);
                } else {
                    displayError("alertContainer", "Failed to find results for that query!");
                }
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
    for (var i = 0; i < transactionArr.length; i++) {
        var transaction = transactionArr[i];
        var empName = transaction.employeeName;
        var empSurname = transaction.employeeSurname;
        var empEmail = transaction.employeeEmail;
        var amount = transaction.amountSpent;
        var dateTime = new Date(transaction.transactiontime);
        if (!transaction.paymentDesc)
            var paymentDesc = "None";
        else
            var paymentDesc = transaction.paymentDesc;
        var paymentPointDesc = transaction.paymentPointDesc;

        tableBody.append(
            `<tr>
            <td>${empName}</td>
            <td>${empSurname}</td>
            <td>${empEmail}</td>
            <td>${amount}</td>
            <td>${moment(dateTime).format('YYYY-MM-DD HH:mm')}</td>
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
            populateTable(data.data);
            let results = `<li class="list-group-item list-group-item-primary">Showing Results for:</li>
                                    <li class="list-group-item">All transactions</li>`;
            $('#searchQueryList').show().html(results);

        } else {
            displayError("alertContainerTop", "Failed to find results for that query!");

        }
    });
}

function researchClicked() {
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
    console.log("download csv clicked!");
}

function downloadPdf() {
    console.log("download pdf clicked!");

    // Add data that will be sent to generate the report
    let postObj = {
        "apiKey": apiKey,
        "companyId": companyId,
    };

    $.post("/admin/generateReport", JSON.stringify(postObj), (data) => {
        if (data.success) {
            let pdfWindow = window.open("")
            pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data.data.base64)+"'></iframe>")
        } else {
            displayError("alertContainerTop", "Failed to find results for that query!");
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



function checkCompanies() {
    if (localStorage.getItem("id") == 1) {
        $("#navBar").append('<li class="nav-item"><a class="nav-link" href="companies.html">Companies</a></li>');
    }
}


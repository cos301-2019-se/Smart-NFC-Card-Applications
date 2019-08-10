$(document).ready(function () {
    companyId = localStorage.getItem("id");
    apiKey = localStorage.getItem("apiKey");
    if (apiKey == null || companyId == null) {
        window.location.replace("login.html");
    } else {
        console.log("awe");
        var start = moment().subtract(29, 'days');
        var end = moment();
    
        function cb(s, e) {
            $('#datePicker span').html(s.format('MMMM D, YYYY') + ' - ' + e.format('MMMM D, YYYY'));
            console.log('awe');
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

        
        $('#btnSubmitCustomSearch').click(function(){
            console.log(new Date(start.format('YYYY-MM-DD')) + ' - ' + end.format('YYYY-MM-DD'));
        });
    }
});


function checkCompanies(){
    if(localStorage.getItem("id")==1) {
        $("#navBar").append('<li class="nav-item"><a class="nav-link" href="companies.html">Companies</a></li>');
    }
}

function submitCustomSearch(){

}

////////////////TODO -> before the page loads check if the api key exists and use that to login, otherwise load this page

function login() {
    var username = $("#username").val();
    var password = $("#password").val();
    if (isValidUsername(username) && isValidPassword(password)) {
        $.post("/admin/login", JSON.stringify({ "username": username, "password": password }), (data) => {
            if (data.success === true) {
                data = data.data;
                localStorage.setItem("apiKey", data.apiKey);
                localStorage.setItem("id", data.id);
                window.location.replace("home.html");
            } else {
                console.log(data);
                var container = $("#alertContainer");
                container.empty();
                container.html(`<div id="loginFailedAlert" class="alert alert-danger alert-dismissible fade show" style="display: none;">
				<strong>Error!</strong> Incorrect login details provided, please check your credentials.
				<button type="button" class="close" data-dismiss="alert">&times;</button>
			    </div>`);
                $("#loginFailedAlert").show();
                // console.log($("#loginFailedAlert"));
            }
        });

    } else {
        // show invalid fields
    }

}

//perform local checks
function isValidUsername(username) {
    return true;
}

function isValidPassword(password) {
    return true;
}
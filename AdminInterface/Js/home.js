function loadHomeContents(callback)
{
	
	var api = localStorage.getItem("apiKey");
	var id = localStorage.getItem("id");
	
	console.log(api);
	console.log(id);
	
	
	$.post("/admin/getCompanyByCompanyId", JSON.stringify({ "apiKey": api , "companyId" : id}), (data) => {
        if (data.success === true) 
		{
			data = data.data;
			console.log(data);
            $("#companyName").html('Representing<p class="font-weight-bold">' + data.companyName + '</p>');
            $("#companyWebsite").text(data.companyWebsite);
            $("#username").html('Hello<p class="font-weight-bold">' + data.username + '</p>');
        } 
		else 
		{
			console.log("error: " + data);
					
		}
    });
	
	callback();
}

function details()
{
	window.location.replace("company.html");
}

function buildings()
{
	window.location.replace("buildings.html");
}

function employees()
{
	window.location.replace("employees.html");
}

function logout(){
	localStorage.clear();
	window.location.replace("login.html");
}

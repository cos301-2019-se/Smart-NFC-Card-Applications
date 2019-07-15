function loadHomeContents(callback)
{
	
	var api = localStorage.getItem("apiKey");
	var id = localStorage.getItem("id");
	
	
	$.post("/admin/getCompanyByCompanyId", JSON.stringify({ "apiKey": api , "companyId" : id}), (data) => {
        if (data.success === true) 
		{
			data = data.data;
			console.log(data);
            $("#companyName").html('Representing<p class="font-weight-bold">' + data.companyName + '</p>');
            $("#companyWebsite").text(data.companyWebsite);
            $("#username").html('Welcome back<p class="font-weight-bold">' + data.username + '</p>');
			
			var currentTime = new Date();
			var m = (currentTime.getMonth() + 1);
			m = m < 10? "0" + m : m;
			var day = currentTime.getFullYear() + "-" + m + "-" + currentTime.getDate();
			
			var twelve = new Date(day + "T10:00:00Z");
			var six = new Date(day + "T16:00:00Z");
			
			var msg = "";
			
			if(currentTime < twelve)
			{
				msg = "Good morning!";
			}
			else if(currentTime < six)
			{
				msg = "Good afternoon!";
			}
			else
			{
				msg = "Good evening!";
			}
				
			
			$("#welcome").html(msg);
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
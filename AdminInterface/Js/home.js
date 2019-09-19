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
			var d = currentTime.getDate();
			d = d < 10? "0" + d : d;
			var day = currentTime.getFullYear() + "-" + m + "-" + d;
			
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

			callback();
        } 
		else 
		{
			console.log("error: " + data);
					
		}
    });
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

function paymentpoints()
{
	window.location.replace("paymentpoints.html");
}

function transactions(){
	window.location.replace("transactions.html");
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

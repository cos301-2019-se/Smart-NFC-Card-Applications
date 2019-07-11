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
            $("#companyName").text("Welcome, " + data.companyName);
            $("#companyWebsite").text(data.companyWebsite);
            $("#companyUsername").text(data.username);
        } 
		else 
		{
			console.log("error: " + data);
					
		}
    });
	
	callback();
}


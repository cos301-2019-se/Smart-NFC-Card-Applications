function loadBuildings(callback)
{
	var api = localStorage.getItem("apiKey");
	var id = localStorage.getItem("id");
	
	//console.log(api);
	//console.log(id);
	
	
	$.post("/admin/getBuildingsByCompanyId", JSON.stringify({ "apiKey": api , "companyId" : id}), (data) => {
        if (data.success === true) 
		{
			data = data.data;
			console.log(data);
			
			
			for(var i = 0; i < data.length; i++)
			{
				var cur = data[i];
				//console.log("looking at building " + cur.buildingId);
				
				var text = '<div class="panel panel-default">'+
				'<div class="panel-heading">'+
				  '<div class="btn-toolbar justify-content-between" role="toolbar">'+
					'<div class="input-group">'+
						'<a data-toggle="collapse" href="#building' + cur.buildingId + '" class="pull-left" style="font-size:25px; margin-top:10px">' + cur.branchName + '</a>'+
					  '</div>'+
					  '<div class="btn-group" role="group">'+
						'<button type="button" class="btn btn-primary" style="margin-bottom:10px; margin-top:10px" onclick="editBuilding(' + cur.buildingId +')">Edit Building</button>'+
						'<button type="button" class="btn btn-warning" style="margin-bottom:10px; margin-top:10px" onclick="openRoomModal(' + cur.buildingId +')">Add Room</button>'+
					  '</div>'+
					'</div>'+
				'</div>'+
				'<div id="building' + cur.buildingId + '" class="panel-collapse collapse">'+
				  '<ul class="list-group" id="roomListNumber' + cur.buildingId + '">';
				
				text += '</ul>'+
					'</div>'+
				  '</div>';
				  
				$("#buildingList").append(text);
				
				
			}
			
			  
			for(var i = 0; i < data.length; i++)
			{
				var cur = data[i];
				//console.log("making post request for " + cur.buildingId);
				$.post("/admin/getRoomsByBuildingId", JSON.stringify({ 
	
				"apiKey": api, 
				"buildingId" : data[i].buildingId
				
				}), function(data2) {
					//console.log("back!");
					if (data2.success === true) 
					{
						data2 = data2.data;
						console.log(data2);
						
						
						var text = "";
						
						for(var j = 0; j < data2.length; j++)
						{
							text += '<li id="room' + data2[j].buildingId + '_' + data2[j].roomId + '" class="list-group-item" data-parents="' + data2[j].parentRoomList + '" data-origName="' + data2[j].roomName + '">' + data2[j].roomName + '</li>'
							
						}
						
						$("#roomListNumber" + data2[0].buildingId).append(text);
						
						for(var j = 0; j < data2.length; j++)
						{
							console.log("doing room " + data2[j].roomName);
							var parList = data2[j].parentRoomList.split(",");
							for(var k = 0; k < parList.length; k++)
							{
								console.log("#room" + data2[j].buildingId + "_" + parList[k]);
								var matching = $("#room" + data2[j].buildingId + "_" + parList[k]);
								console.log(matching);
								if(matching.length === 0)
								{
									parList[k] = "Outside";
									console.log(parList[k]);
								}
								else
								{
									parList[k] = matching[0].getAttribute("data-origName");
									console.log(parList[k]);
								}
							}
							parList = parList.join(", ");
							
							$('#room' + data2[j].buildingId + '_' + data2[j].roomId).html(data2[j].roomName + " <- " + parList);
						}
				  
						
						
						
						//window.location.replace("buildings.html");
					} 
					else 
					{
						
						
						if(data2.message === "Database query failed: no rows in Room with that matching buildingId")
						{
							//$("#addBuildingModal").modal('show');
							console.log("error: no rooms!");
						}
						else
						{
							console.log("error: " + data2.message);
						}
								
					}
				});
			  
			  
			  
				//'<li id="room' + cur.buildingId + '_2" class="list-group-item">Canteen</li>'+
				//'<li id="room' + cur.buildingId + '_3" class="list-group-item">Offices</li>'+
				
				
				
			  
				
		  
		  
				
			}
			
            
        } 
		else 
		{
			
			
			if(data.message === "Database query failed: no rows in Building with that matching companyId")
			{
				//$("#addBuildingModal").modal('show');
			}
			else
			{
				console.log("error: " + data.message);
			}
					
		}
    });
	
	callback();
}

function addBuilding()
{
	var buildingName = $("#buildingName").val();
	var lat = $("#lat").val();
	var longi = $("#longi").val();
	var wifiSSID = $("#wifiSSID").val();
	var wifiType = $("#wifiType").val();
	var wifiPassword = $("#wifiPassword").val();
	var id = parseInt(localStorage.getItem("id"));
	var api = localStorage.getItem("apiKey");
	
	
	
	$.post("/admin/addBuilding", JSON.stringify({ 
	
	"apiKey": api, 
	"buildingBranchName" : buildingName,
	"buildingLatitude" : lat,
	"buildingLongitude" : longi,
	"companyId" : id,
	"networkSsid" : wifiSSID,
	"networkType" : wifiType,
	"networkPassword" : wifiPassword
	
	}), (data) => {
        if (data.success === true) 
		{
			data = data.data;
			console.log(data);
			
			window.location.replace("buildings.html");
        } 
		else 
		{
			
			console.log("error: " + data.message);
					
		}
    });
	
	
	
}



function editBuilding(buildingId)
{
	console.log(buildingId);
	
	var api = localStorage.getItem("apiKey");
	var id = parseInt(localStorage.getItem("id"));
	
	
	$.post("/admin/getBuildingByBuildingId", JSON.stringify({ 
	
	"apiKey": api, 
	"buildingId" : buildingId
	
	}), (data) => {
        if (data.success === true) 
		{
			data = data.data;
			console.log(data);
			
			$("#buildingNameE").val(data.branchName);
			$("#latE").val(data.latitude);
			$("#longiE").val(data.longitude);
			$("#wifiSSIDE").val(data.networkSsid);
			$("#wifiTypeE").val(data.networkType);
			$("#wifiPasswordE").val(data.networkPassword);
	
			localStorage.setItem("currentBuildingEdit", data.buildingId);
			localStorage.setItem("currentWifiParamsEdit", data.wifiParamsId);
			
			$("#editBuildingModal").modal('show');
			
			//window.location.replace("buildings.html");
        } 
		else 
		{
			
			console.log("error: " + data.message);
					
		}
    });
	
	
}

function saveBuildingChanges()
{
	var buildingId = localStorage.getItem("currentBuildingEdit");
	var wifiParamsId = localStorage.getItem("currentWifiParamsEdit");
	
	var api = localStorage.getItem("apiKey");
	var buildingName = $("#buildingNameE").val();
	var lat = $("#latE").val();
	var longi = $("#longiE").val();
	var wifiSSID = $("#wifiSSIDE").val();
	var wifiType = $("#wifiTypeE").val();
	var wifiPassword = $("#wifiPasswordE").val();
	
	
	
	$.post("/admin/editBuilding", JSON.stringify({ 
	
	"apiKey": api, 
	"buildingId" : buildingId,
	"buildingBranchName" : buildingName,
	"buildingLatitude" : lat,
	"buildingLongitude" : longi
	
	}), (data) => {
        if (data.success === true) 
		{
			data = data.data;
			console.log(data);
			
			$.post("/admin/editWifiParam", JSON.stringify({ 
	
			"apiKey": api, 
			"wifiParamsId" : wifiParamsId,
			"networkSsid" : wifiSSID,
			"networkType" : wifiType,
			"networkPassword" : wifiPassword
			
			}), (data) => {
				if (data.success === true) 
				{
					data = data.data;
					console.log(data);
					
					
					
					
					window.location.replace("buildings.html");
				} 
				else 
				{
					
					console.log("error: " + data.message);
							
				}
			});
			
			
        } 
		else 
		{
			
			console.log("error: " + data.message);
					
		}
    });
	
	
	
}

function openRoomModal(buildingId)
{
	localStorage.setItem("currentBuildingAddingRoomTo", buildingId);
	var api = localStorage.getItem("apiKey");
	
	$.post("/admin/getRoomsByBuildingId", JSON.stringify({ 
	
				"apiKey": api, 
				"buildingId" : buildingId
				
				}), (data2) => {
					if (data2.success === true) 
					{
						data2 = data2.data;
						console.log(data2);
						
						$("#roomParentList").empty();
						for(var j = 0; j < data2.length; j++)
						{
							var cur2 = data2[j];
							$("#roomParentList").append('<div class="checkbox">'+
					  '<label><input type="checkbox" value="' + cur2.roomId + '" class="roomSelectParent">' + cur2.roomName + '</label></div>');
						}
						
						//window.location.replace("buildings.html");
					} 
					else 
					{
						
						
						if(data2.message === "Database query failed: no rows in Room with that matching buildingId")
						{
							//$("#addBuildingModal").modal('show');
						}
						else
						{
							console.log("error: " + data2.message);
						}
								
					}
				});
	
	
	
	$("#addRoomModal").modal('show');
}

function addRoom()
{
	var buildingId = parseInt(localStorage.getItem("currentBuildingAddingRoomTo"));
	var roomName = $("#roomName").val();
	var parentArr = $(".roomSelectParent:checked").toArray();
	var parentRoomList = "";
	for(var i = 0; i < parentArr.length; i++)
	{
		parentArr[i] = parentArr[i].value;
		
		parentRoomList += parentArr[i] + ",";
		
		//find parent list using this id
		
		var listItem = $("[id='room" + buildingId + "_" + parentArr[i] + "']").toArray()[0];
		
		var parents = listItem.getAttribute("data-parents");
		
		if(parents === "NULL")
		{
			//parents = "";
		}
		else
		{
			parentRoomList += parents + ",";
		}
		
		
		
	}
	parentRoomList = parentRoomList === "," ? "" : parentRoomList.substring(0, parentRoomList.length - 1);
	parentRoomList = parentRoomList.split(",");
	var uniqueParents = [...new Set(parentRoomList)];
	parentRoomList = uniqueParents.join(",");
	parentRoomList = parentRoomList === "" ? "NULL" : parentRoomList;
	
	
	var id = parseInt(localStorage.getItem("id"));
	var api = localStorage.getItem("apiKey");
	
	
	
	$.post("/admin/addRoom", JSON.stringify({ 
	
	"apiKey": api, 
	"roomName" : roomName,
	"parentRoomList" : parentRoomList,
	"buildingId" : buildingId
	
	}), (data) => {
        if (data.success === true) 
		{
			data = data.data;
			console.log(data);
			
			window.location.replace("buildings.html");
        } 
		else 
		{
			
			console.log("error: " + data.message);
					
		}
    });
	
	

}



function logout(){
	localStorage.clear();
	window.location.replace("login.html");
}

function loadBuildings(callback)
{
	var api = localStorage.getItem("apiKey");
	var id = localStorage.getItem("id");
	
	$("#buildingList").empty();
	
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
			else if(data.message === "Invalid API Key")
			{
				window.location.replace("login.html");
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
	var buildingName = $("#buildingName").val().trim();
	var lat = $("#lat").val();
	var longi = $("#longi").val();
	var wifiSSID = $("#wifiSSID").val().trim();
	var wifiType = $("#wifiType option:selected").val().trim();
	var wifiPassword = $("#wifiPassword").val().trim();
	var id = parseInt(localStorage.getItem("id"));
	var api = localStorage.getItem("apiKey");
	
	if(buildingName === "" || lat === "" || longi === "" || wifiSSID === "" || wifiType === "" || wifiPassword === "")
	{
		$("#addBuildingWarning").show();
		return;
	}
	
	
	
	
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

			$("#editAddress").val("");
			$("#buildingNameE").val(data.branchName);
			$("#latE").val(data.latitude);
			$("#longiE").val(data.longitude);
			$("#wifiSSIDE").val(data.networkSsid);
			$('#wifiTypeE option[value=' + data.networkType + ']').attr('selected','selected');
			$("#wifiPasswordE").val(data.networkPassword);
	
			localStorage.setItem("currentBuildingEdit", data.buildingId);
			localStorage.setItem("currentWifiParamsEdit", data.wifiParamsId);
			
			$("#editBuildingModal").modal('show');
			initEditAutocomplete();
			
			//loadBuildings(function(){});
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
	var buildingName = $("#buildingNameE").val().trim();
	var lat = $("#latE").val();
	var longi = $("#longiE").val();
	var wifiSSID = $("#wifiSSIDE").val().trim();
	var wifiType = $("#wifiTypeE option:selected").val().trim();
	var wifiPassword = $("#wifiPasswordE").val().trim();
	
	
	
	if(buildingName === "" || lat === "" || longi === "" || wifiSSID === "" || wifiType === "" || wifiPassword === "")
	{
		$("#editBuildingWarning").show();
		return;
	}
	
	
	
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
					
					
					
					
					loadBuildings(function()
					{ 
						$("#editBuildingModal").modal('hide'); 
					});
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
						
						//loadBuildings(function(){});
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
	
	var roomName = $("#roomName").val().trim();
	
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
	
	
	if(roomName === "")
	{
		$("#addRoomWarning").show();
		return;
	}
	
	
	
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
function initAddAutocomplete() {
	$("#lat").val("");
	$("#longi").val("");
	$("#addAddress").val("");
	//creates inital zoomed out map
       var map = new google.maps.Map(document.getElementById('addMap'), {
           center: {lat: -0.0, lng: 0.0},
           zoom: 2,
           mapTypeId: 'roadmap'
       });

	// Create the search box and link it to the search bar element.
	var input = document.getElementById('addAddress');
	var searchBox = new google.maps.places.SearchBox(input);

	// Bias the SearchBox results towards current map's viewport.
       map.addListener('bounds_changed', function() {
           searchBox.setBounds(map.getBounds());
       });

       var markers = [];
	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}

		// Clear out the old markers.
           markers.forEach(function(marker) {
               marker.setMap(null);
           });
           markers = [];

           // For each place, get the icon, name and location.
           var bounds = new google.maps.LatLngBounds();
           places.forEach(function(place) {
               if (!place.geometry) {
                   console.log("Returned place contains no location");
                   return;
               }

               // Create a marker for the location
               markers.push(new google.maps.Marker({
                   map: map,
                   title: place.name,
                   animation: google.maps.Animation.DROP,
                   position: place.geometry.location
               }));

               // get lat and long
               $("#lat").val(place.geometry.location.lat());
			   $("#longi").val(place.geometry.location.lng());

               if (place.geometry.viewport) {
                   // Only geocodes have viewport.
                   bounds.union(place.geometry.viewport);
               } else {
                   bounds.extend(place.geometry.location);
               }
           });
           map.fitBounds(bounds);
	});
}

function initEditAutocomplete() {

	var markers = [];
	var geocoder = new google.maps.Geocoder;
	let lat = $("#latE").val();
	let long = $("#longiE").val();
	let latlong = {lat:parseFloat(lat), lng:parseFloat(long)};
	//creates inital zoomed out map
	var map = new google.maps.Map(document.getElementById('editMap'), {
		center: latlong,
		zoom: 15,
		mapTypeId: 'roadmap'
	});

	geocoder.geocode({'location': latlong}, function(results, status) {
		if (status === 'OK') {
			if(results[0]){
				$("#editAddress").val(results[0].formatted_address);
				markers.push(new google.maps.Marker({
					position: latlong,
					map: map,
					title: results[0].formatted_address,
					animation: google.maps.Animation.DROP,
				}));
			}else{
				console.log("Could'nt find address")
			}
		}else{
			console.log("Could'nt find address")
		}
	});


	// Create the search box and link it to the search bar element.
	var input = document.getElementById('editAddress');
	var searchBox = new google.maps.places.SearchBox(input);

	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});


	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function() {
		var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}

		// Clear out the old markers.
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
		markers = [];

		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();
		places.forEach(function(place) {
			if (!place.geometry) {
				console.log("Returned place contains no location");
				return;
			}


			// Create a marker for the location
			markers.push(new google.maps.Marker({
				map: map,
				title: place.name,
				animation: google.maps.Animation.DROP,
				position: place.geometry.location
			}));

			// get lat and long
			$("#latE").val(place.geometry.location.lat());
			$("#longiE").val(place.geometry.location.lng());

			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});
		map.fitBounds(bounds);
	});
}

function logout(){
	localStorage.clear();
	window.location.replace("login.html");
}

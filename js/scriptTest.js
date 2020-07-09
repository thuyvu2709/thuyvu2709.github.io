// scriptTest.js

$("#btnTest").click(function(){
	var thecode = $("#scriptTest").val();

	var F = new Function(thecode);
	console.log(F());
})
$("#ExportData").click(function(){
	downloadFile("localStorage.txt", JSON.stringify(localStorage));
})

$("#ImportData").click(function(){
	$.getJSON( "/localstorage.txt", function(data) {
	    // Success
	    console.log("Import success")
	    console.log(data);
	    for(var e in data) {
			localStorage.setItem(e, data[e]);
	    }
	})
})
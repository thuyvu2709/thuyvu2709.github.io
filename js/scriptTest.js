// scriptTest.js

$("#btnTest").click(function(){
	var thecode = $("#scriptTest").val();

	var F = new Function(thecode);
	console.log(F());
})

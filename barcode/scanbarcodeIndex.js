// scanbarcode.js
$('body').on('click', '.btnScan', function() {
	// $("#picture").css.visibility = "visible";
	// 
	var className = $(this).attr('class');
	productIndex = className.split(' ')[4];
	console.log(productIndex);

	document.getElementById("scanBarcode_"+productIndex).click();

	var takePicture = document.querySelector("#scanBarcode_"+productIndex),
	showPicture = document.createElement("img");
	// showPicture.style.visibility = "hidden";

	// console.log($(showPicture));

	// Result = $("#productcode");

	var canvas =document.getElementById("picture");
	var ctx = canvas.getContext("2d");

	function showBarcode(data){
		// console.log(data);
		// console.log("aa")
		// document.getElementById("productcode").setAttribute('value', data); 
		$(".productCode_"+productIndex).val(data);
		triggerNextProcessNewOrder(productIndex,data);
	}

	JOB.Init();
	JOB.SetImageCallback(function(result) {
		if(result.length > 0){
			var tempArray = [];
			// for(var i = 0; i < result.length; i++) {
			// 	tempArray.push(result[i].Format+" : "+result[i].Value);
			// }
			// showBarcode(tempArray.join("<br />"));
			showBarcode(result[0].Value);
		}else{
			if(result.length === 0) {
				showBarcode("Decoding failed.");
			}
		}
	});
	JOB.PostOrientation = true;
	JOB.OrientationCallback = function(result) {
		canvas.width = result.width;
		canvas.height = result.height;
		var data = ctx.getImageData(0,0,canvas.width,canvas.height);
		for(var i = 0; i < data.data.length; i++) {
			data.data[i] = result.data[i];
		}
		ctx.putImageData(data,0,0);
	};
	JOB.SwitchLocalizationFeedback(true);
	JOB.SetLocalizationCallback(function(result) {
		ctx.beginPath();
		ctx.lineWIdth = "2";
		ctx.strokeStyle="red";
		for(var i = 0; i < result.length; i++) {
			ctx.rect(result[i].x,result[i].y,result[i].width,result[i].height); 
		}
		ctx.stroke();
	});
	// if(takePicture && showPicture) {
		takePicture.onchange = function (event) {
			var files = event.target.files;
			if (files && files.length > 0) {
				file = files[0];
				try {
					var URL = window.URL || window.webkitURL;
					showPicture.onload = function(event) {
						showBarcode("");
						JOB.DecodeImage(showPicture);
						URL.revokeObjectURL(showPicture.src);
					};
					showPicture.src = URL.createObjectURL(file);
				}
				catch (e) {
					try {
						var fileReader = new FileReader();
						fileReader.onload = function (event) {
							showPicture.onload = function(event) {
								showBarcode("");
								JOB.DecodeImage(showPicture);
							};
							showPicture.src = event.target.result;
						};
						fileReader.readAsDataURL(file);
					}
					catch (e) {
						showBarcode("Neither createObjectURL or FileReader are supported");
					}
				}
			}
		};
// }

})
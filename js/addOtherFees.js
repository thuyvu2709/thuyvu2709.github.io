var triggerAfterLoad = function(){

    var roles = JSON.parse(localStorage.getItem("roles"));

    $("#employeeId").empty();
    $("#employeeId").append("<option selected disabled>Chọn nhân viên</option>")

    for (var e in roles) {
        if (e ==0) {
            continue;
        }
        $("#employeeId").append('<option value="'+roles[e][0]+'">'+roles[e][2]+' - '+roles[e][0]+'</option>')
    }
}

function addOtherFee(){
	console.log("addOtherFee")
	var numOfColumnOtherFee = 4;
	var sheetrange = 'otherFees!A:'+ String.fromCharCode(65+numOfColumnOtherFee);


	var feeName  = document.getElementById("feeName").value;
    var employeeId = document.getElementById("employeeId").value;

	var feeCost = $("#feeCost").val();
    var feeContent = $("#feeContent").val();


	// console.log(productCode)

	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date+' '+time;

	gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: mainSheetForProduct,
        range: sheetrange,
        valueInputOption: "USER_ENTERED",
        resource: {
            "majorDimension": "ROWS",
            "values": [
                [
                	dateTime,
                	feeName,
                	feeCost,
                    feeContent,
                    employeeId
                ]
            ]
        }
    }).then(function(response) {
        var result = response.result;
        console.log(`${result.updatedCells} cells updated.`);
	    $("#modelContent").html("Đã lưu thông tin");
	    $('#myModal').modal('toggle');

    }, function(response) {
        // appendPre('Error: ' + response.result.error.message);
    });
}

$('body').on('click', '#addNewFee', function() {
     addOtherFee();
})
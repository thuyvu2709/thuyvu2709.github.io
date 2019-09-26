// addNewProduct.js

// var sheetrange = 'Sheet1!A1:B1000';
// console.log('Sheet1!A1:'+ String.fromCharCode(65+numOfColumn));

function addOtherFee(){
	console.log("addOtherFee")
	var numOfColumnOtherFee = 3;
	var sheetrange = 'otherFees!A1:'+ String.fromCharCode(65+numOfColumnOtherFee);


	var feeName = $("#feeName").val();
	var feeCost = $("#feeCost").val();


	// console.log(productCode)

	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date+' '+time;

	gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: sheetrange,
        valueInputOption: "USER_ENTERED",
        resource: {
            "majorDimension": "ROWS",
            "values": [
                [
                	dateTime,
                	feeName,
                	feeCost
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
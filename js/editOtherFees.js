var currentFee = JSON.parse(localStorage.getItem("currentFee"));

var triggerAfterLoad = function(){

    var roles = JSON.parse(localStorage.getItem("roles"));

    $("#employeeId").empty();
    $("#employeeId").append("<option disabled>Chọn nhân viên</option>")

    for (var e in roles) {
        if (e ==0) {
            continue;
        }
        $("#employeeId").append('<option value="'+roles[e][0]+'">'+roles[e][2]+' - '+roles[e][0]+'</option>')
    }

    $("#employeeId").val(currentFee.employeeId);
}

$("#feeName").val(currentFee.feeName);
$("#feeCost").val(currentFee.feeCost);
$("#feeContent").val(currentFee.feeContent);

function editOtherFee(){
	console.log("editOtherFee")
	var numOfColumnOtherFee = 4;
	var sheetrange = 'otherFees!A'+currentFee.feeIndex+':'+ String.fromCharCode(65+numOfColumnOtherFee)+''+currentFee.feeIndex;


	var feeName  = document.getElementById("feeName").value;
    var employeeId = document.getElementById("employeeId").value;

	var feeCost = $("#feeCost").val();
    var feeContent = $("#feeContent").val();


	// console.log(productCode)

	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date+' '+time;

    var data = [
                [
                    dateTime,
                    feeName,
                    feeCost,
                    feeContent,
                    employeeId
                ]
            ];

    editDataInSheet(mainSheetForProduct, sheetrange, data,
        function() {
            console.log(`${result.updatedCells} cells updated.`);
    	    $("#modelContent").html("Đã lưu thông tin");
    	    $('#myModal').modal('toggle');

        }, function(response) {
            // appendPre('Error: ' + response.result.error.message);
        });
}

$("#editOtherFee").click(editOtherFee);

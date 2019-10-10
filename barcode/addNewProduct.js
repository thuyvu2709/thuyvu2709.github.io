// addNewProduct.js

// var sheetrange = 'Sheet1!A1:B1000';
// console.log('Sheet1!A1:'+ String.fromCharCode(65+numOfColumn));

var triggerAfterLoad = function(){

	loadImportScheduleList(function(){
		var importSLData = JSON.parse(localStorage.getItem("warehouse"));
		// console.log(importSLData);
		$("#importSchedule").empty();
		$("#importSchedule").append("<option disabled selected>Chọn đợt hàng</option>");
		for (var e in importSLData) {
			if (e ==0) {
				continue;
			}
			$("#importSchedule").append("<option value='"+importSLData[e][0]+"'>"+importSLData[e][0]+" - "+importSLData[e][1]+"</option>")
		}
		getLatestProductCode(function(code){
			$("#productCode").val(code);
		})
	})
}

function addNewProduct(){
	$("#loadingSpin").show();

	
	var dataset = [];

	var productCode = $("#productCode").val();
	var productName = $("#productName").val();

	var productCount = $("#productCount").val();

	var productOriginalCostEur = $("#productOriginalCostEur").val();

	var productWeight = $("#productWeight").val();
	var shipInternationalFee = $("#shipInternationalFee").val();
	var shipItalyFee = $("#shipItalyFee").val();

	var otherFee = $("#otherFee").val();

	var shipVietnamFee = $("#shipVietnamFee").val();

	var productEstimateVND = $("#productEstimateVND").val();

	var productEstimateSellingVND = $("#productEstimateSellingVND").val();

	var profitPerOneProduct = $("#profitPerOneProduct").html();

	var turnover = $("#turnover").html();

	var totalCost = $("#totalCost").html();

	var totalProfit = $("#totalProfit").html();

	var prodImageLink = $("#prodImageLink").val();

	var importCode = document.getElementById("importSchedule").value;


	productWeight = productWeight ? productWeight : 0;
	shipInternationalFee = shipInternationalFee ? shipInternationalFee : 0;
	shipItalyFee = shipItalyFee ? shipItalyFee : 0;
	shipVietnamFee = shipVietnamFee ? shipVietnamFee : 0;
	productOriginalCostEur = productOriginalCostEur ? productOriginalCostEur : 0;
	otherFee = otherFee ? otherFee : 0;
	productEstimateVND = productEstimateVND ? productEstimateVND : 0;
	
	prodImageLink = prodImageLink ? prodImageLink : "";
	// console.log(productCode)

	var dataAppendProduct = [
                [productCode, //0 A
                '=CONCATENATE(INDIRECT(ADDRESS(ROW(),3)),"_",INDIRECT(ADDRESS(ROW(),1)))',//1 B
                importCode, //2 C
                productName, //3 D
                productCount, //4 E
                productOriginalCostEur, //5 F
                productWeight, //6 G
                shipInternationalFee, //7 H
                shipItalyFee, //8 I
                shipVietnamFee, //9 J
                otherFee, //10 K
                productEstimateVND, //11 L
                productEstimateSellingVND, //12 M
				"=INDIRECT(ADDRESS(ROW(),13)) - INDIRECT(ADDRESS(ROW(),12))", //13 N
				"=INDIRECT(ADDRESS(ROW(),13))*INDIRECT(ADDRESS(ROW(),5))", //14 O
				"=INDIRECT(ADDRESS(ROW(),12))*INDIRECT(ADDRESS(ROW(),5))", //15 P
				"=INDIRECT(ADDRESS(ROW(),15)) - INDIRECT(ADDRESS(ROW(),16))", //16 Q
				"=INDIRECT(ADDRESS(ROW(),5)) - SUMIF(OrderDetail!D:D,INDIRECT(ADDRESS(ROW(),2)),OrderDetail!F:F)", //17 R
				"=INDIRECT(ADDRESS(ROW(),12)) * INDIRECT(ADDRESS(ROW(),18))", //18 S
				prodImageLink //19 T
                ]
            ];

	// gapi.client.sheets.spreadsheets.values.append({
 //        spreadsheetId: spreadsheetId,
 //        range: sheetrange,
 //        valueInputOption: "USER_ENTERED",
 //        resource: {
 //            "majorDimension": "ROWS",
 //            "values": dataAppendProduct
 //        }
 //    }).then(function(response) {
 //        var result = response.result;
 //        console.log(`${result.updatedCells} cells updated.`);

	// 	$("#loadingSpin").hide();

 //        $(".btnModal").click(function(){
 //        	location.reload();
 //        })
	//     $("#modelContent").html("Đã lưu mặt hàng");
	//     $('#myModal').modal('toggle');

 //    }, function(response) {
 //        appendPre('Error: ' + response.result.error.message);
	//     $("#modelContent").html("Có lỗi, không thể lưu");
	//     $('#myModal').modal('toggle');
 //    });

	appendProduct(dataAppendProduct, function(){
		$("#loadingSpin").hide();

		$(".btnModal").click(function(){
			location.reload();
		})
		$("#modelContent").html("Đã lưu mặt hàng");
		$('#myModal').modal('toggle');
	}, function(){
		$("#loadingSpin").hide();

		$("#modelContent").html("Có lỗi, không thể lưu");
		$('#myModal').modal('toggle');
	}); 	
}

$("#addNewProduct").click(function(){
     addNewProduct();
})

$("#btnRefresh").click(function(){
	location.reload();
});

$( "input" ).keyup(function() {
	var idClass = $(this).attr('id');

	if (idClass == "productEstimateSellingVND" || idClass == "productEstimateVND") {
		var productEstimateVND = parseFloat($("#productEstimateVND").val());
		var productCount = parseFloat($("#productCount").val());
		if (!$("#productEstimateSellingVND").val()) {
			return;
		}
		var productEstimateSellingVND = parseFloat($("#productEstimateSellingVND").val());

		$("#profitPerOneProduct").html(productEstimateSellingVND - productEstimateVND);
		$("#turnover").html(productEstimateSellingVND * productCount);
		$("#totalCost").html(productEstimateVND * productCount);
		$("#totalProfit").html((productEstimateSellingVND - productEstimateVND)*productCount);

		return;
	};

	// if (idClass == "productName") {
	// 	var productCode = $("#productCode").val();
	// 	productCode = productCode ? productCode : "$$$";
	// 	var productName = $("#productName").val();
	// 	checkProductCodeName(productCode,productName,function(check){
	// 		console.log("checkProductCodeName:"+check);
	// 		if (!check) {
	// 		    $("#modelContent").html("Mã hàng hoặc tên mặt hàng đã tồn tại hoặc hệ thống có vấn đề");
	// 	    	$('#myModal').modal('toggle');
	// 		}
	// 	})
	// return;
	// }

	if (idClass == "productEstimateVND" || idClass == "productName"){
		return;
	};


	var productCount = parseFloat($("#productCount").val());

	var productOriginalCostEur = parseFloat($("#productOriginalCostEur").val());

	var productWeight = parseFloat($("#productWeight").val());
	var shipInternationalFee = parseFloat($("#shipInternationalFee").val());
	var shipItalyFee = parseFloat($("#shipItalyFee").val());

	var otherFee = parseFloat($("#otherFee").val());

	var shipVietnamFee = parseFloat($("#shipVietnamFee").val());

	shipInternationalFee = shipInternationalFee ? shipInternationalFee : 0;
	shipItalyFee = shipItalyFee ? shipItalyFee : 0;
	otherFee = otherFee ? otherFee : 0;
	shipVietnamFee = shipVietnamFee ? shipVietnamFee : 0;

	console.log( "Handler for .keypress() called." );

	console.log($("#productOriginalCostEur").val())
	// console.log($(this).attr('id'));
	var productEstimateVND = productOriginalCostEur*EuroVndRate + productWeight * 
		( shipInternationalFee * EuroVndRate + shipItalyFee * EuroVndRate + shipVietnamFee ) + otherFee;

	console.log(productOriginalCostEur + " " + productWeight + " " + productEstimateVND);
	// $("#productEstimateVND").val();
	$("#productEstimateVND").val(productEstimateVND);
	// $("#productEstimateSellingVND").val(parseFloat(productEstimateVND + 100000));

});


$('#btnAddImage').click(function() {
	// $("#picture").css.visibility = "visible";
	document.getElementById("prodScanImage").click();
})

$("#prodScanImage").on("change", function() {
	$("#loadingSpin").show();

    var $files = $(this).get(0).files;

    if ($files.length) {

      // Reject big files
      if ($files[0].size > $(this).data("max-size") * 1024) {
        console.log("Please select a smaller file");
        return false;
      }

      // Begin file upload
      console.log("Uploading file to Imgur..");

      // Replace ctrlq with your own API key
      var apiUrl = 'https://api.imgur.com/3/image';
      var apiKey = 'bddc38af21c5d9a';

      var settings = {
        async: false,
        crossDomain: true,
        processData: false,
        contentType: false,
        type: 'POST',
        url: apiUrl,
        headers: {
          Authorization: 'Client-ID ' + apiKey,
          Accept: 'application/json'
        },
        mimeType: 'multipart/form-data'
      };

      var formData = new FormData();
      formData.append("image", $files[0]);
      settings.data = formData;

      // Response contains stringified JSON
      // Image URL available at response.data.link
      $.ajax(settings).done(function(response) {
        console.log(response);
        console.log("link:"+JSON.parse(response).data.link);
        $("#prodImageLink").val(JSON.parse(response).data.link);

    	$("#loadingSpin").hide();

      });

    }
  });

var currentProduct = JSON.parse(localStorage.getItem("currentProduct"));


$("#productCode").val(currentProduct.productCode);
$("#productName").val(currentProduct.productName);

$("#productCount").val(currentProduct.productCount);

$("#productOriginalCostEur").val(currentProduct.productOriginalCostEur);

$("#productWeight").val(currentProduct.productWeight);

$("#shipInternationalFee").val(currentProduct.shipInternationalFee);
$("#shipItalyFee").val(currentProduct.shipItalyFee);

$("#otherFee").val(currentProduct.otherFee);

$("#shipVietnamFee").val(currentProduct.shipVietnamFee);

$("#productEstimateVND").val(currentProduct.productEstimateVND);

$("#productEstimateSellingVND").val(currentProduct.productEstimateSellingVND);

$("#profitPerOneProduct").html(currentProduct.profitPerOneProduct);

$("#turnover").html(currentProduct.turnover);

$("#totalCost").html(currentProduct.totalCost);

$("#totalProfit").html(currentProduct.totalProfit);

$("#prodImageLink").val(currentProduct.prodImageLink);

function editProductFn(){
	var numOfColumn = 17;

	var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';

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
	var productIndex = currentProduct.productIndex;

	productWeight = productWeight ? productWeight : 0;
	shipInternationalFee = shipInternationalFee ? shipInternationalFee : 0;
	shipItalyFee = shipItalyFee ? shipItalyFee : 0;
	shipVietnamFee = shipVietnamFee ? shipVietnamFee : 0;
	productOriginalCostEur = productOriginalCostEur ? productOriginalCostEur : 0;
	otherFee = otherFee ? otherFee : 0;
	productEstimateVND = productEstimateVND ? productEstimateVND : 0;

	prodImageLink = prodImageLink ? prodImageLink : "";

	currentProduct = {
		productIndex : productIndex,
		productCode : productCode,
		productName : productName,
		productCount : productCount,
		productOriginalCostEur : productOriginalCostEur,
		productWeight : productWeight,
		shipInternationalFee : shipInternationalFee,
		shipItalyFee : shipItalyFee,
		otherFee : otherFee,
		shipVietnamFee : shipVietnamFee,
		productEstimateVND : productEstimateVND,
		productEstimateSellingVND : productEstimateSellingVND,
		profitPerOneProduct : profitPerOneProduct,
		turnover : turnover,
		totalCost : totalCost,
		totalProfit : totalProfit,
		prodImageLink : prodImageLink
	}

	// console.log(productCode)
	var proIndex = parseInt(productIndex) + 1;

	var sheetrange = 'Product!A'+proIndex+':'+ String.fromCharCode(65+numOfColumn)+proIndex+"";

	var dataEditP = [
                [productCode, //0 A
                productName, //1 B
                productCount, //2 C
                productOriginalCostEur, //3 D
                productWeight, //4 E
                shipInternationalFee, //5 F
                shipItalyFee, //6 G
                shipVietnamFee, //7 H
                otherFee, //8 I
                productEstimateVND, //9 J
                productEstimateSellingVND, //10 K
				"=INDIRECT(ADDRESS(ROW();11)) - INDIRECT(ADDRESS(ROW();10))", //11 L
				"=INDIRECT(ADDRESS(ROW();11))*INDIRECT(ADDRESS(ROW();3))", //12 M
				"=INDIRECT(ADDRESS(ROW();10))*INDIRECT(ADDRESS(ROW();3))", //13 N
				"=INDIRECT(ADDRESS(ROW();13)) - INDIRECT(ADDRESS(ROW();14))", //14 O
				"=INDIRECT(ADDRESS(ROW();3)) - SUMIF(OrderDetail!B:B;INDIRECT(ADDRESS(ROW();1));OrderDetail!D:D)", //15 P
				"=INDIRECT(ADDRESS(ROW();10)) * INDIRECT(ADDRESS(ROW();16))", //16 Q
				prodImageLink
                ]
            ];
    
	$("#loadingSpin").show();

    editProduct(dataEditP, sheetrange,function(){
		$("#loadingSpin").hide();

		localStorage.setItem("currentProduct",JSON.stringify(currentProduct));

	    $("#modelContent").html("Đã sửa mặt hàng");
	    $('#myModal').modal('toggle');
    }, function(){
		$("#loadingSpin").hide();

	    $("#modelContent").html("Có lỗi, không thể lưu");
	    $('#myModal').modal('toggle');
    })

	// gapi.client.sheets.spreadsheets.values.update({
 //        spreadsheetId: spreadsheetId,
 //        range: sheetrange,
 //        valueInputOption: "USER_ENTERED",
 //        resource: {
 //            "majorDimension": "ROWS",
 //            "values": dataEditP
 //        }
 //    }).then(function(response) {
 //        var result = response.result;
 //        console.log(`${result.updatedCells} cells updated.`);
	//     $("#modelContent").html("Đã sửa mặt hàng");
	//     $('#myModal').modal('toggle');

 //    }, function(response) {
 //        appendPre('Error: ' + response.result.error.message);
	//     $("#modelContent").html("Có lỗi, không thể lưu");
	//     $('#myModal').modal('toggle');
 //    });
}

$("#editProduct").click(function(){
     editProductFn();
})

$("#btnRefresh").click(function(){
	window.location = "newproduct.html";
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
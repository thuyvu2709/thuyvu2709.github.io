
var currentProduct = JSON.parse(localStorage.getItem("currentProduct"));
console.log(currentProduct);

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

$("#productEstimateSellingCTV").val(currentProduct.productEstimateSellingCTV);


$("#profitPerOneProduct").html(currentProduct.profitPerOneProduct);

$("#turnover").html(currentProduct.turnover);

$("#totalCost").html(currentProduct.totalCost);

$("#totalProfit").html(currentProduct.totalProfit);

$("#prodImageLink").val(currentProduct.prodImageLink);

$("#imgThumbnail").attr("src",currentProduct.prodImageLink);

var choosenProductCatalogIndex = -2;

var chooseImportScheduleCode =  -1;

$("#importSchedule").html("<option value='"+currentProduct.importCode+"'>"+currentProduct.importCode+"</option>")

var mode = "edit";//"duplicate"

var triggerAfterLoad = function(){


	loadWarehouse(function(){

		fetchEuroRate(function(currencyRates) {
			EuroVndRate = parseFloat(currencyRates.lsCurrency["EUR"].sell);
			$(".euroVndRate").html("(tỉ giá EUR/VND: "+EuroVndRate+")");
		})

		var importSLData = JSON.parse(localStorage.getItem("warehouse"));

		var indexInTable = {};
		for(var e in importSLData) {
			indexInTable[importSLData[e][0]] = e;
		}

		let sortableData = importSLData.slice(0);
		sortableData.sort(function(a,b) {
		  if (isNaN(parseInt(a[0]))) {
			return -1;
		  }
		  if (isNaN(parseInt(b[0]))) {
			return 1;
		  }
		  return parseInt(a[0]) - parseInt(b[0]);
		});

		lsAutoImportSchedule = [];
		for (var e in importSLData) {
			if (e ==0) {
				continue;
			}

			if (!importSLData[e][0] || !importSLData[e][1] || isNaN(importSLData[e][0])) {
				continue;
			}

			if (importSLData[e][0] == currentProduct.importCode) {
				$("#importSchedule").val(importSLData[e][0]+" - "+importSLData[e][1]);
				chooseImportScheduleCode = importSLData[e][0];
			}
			lsAutoImportSchedule.push({
				label : importSLData[e][0]+" - "+importSLData[e][1],
				value : importSLData[e][0]+" - "+importSLData[e][1],
				data : importSLData[e],
				importCode : importSLData[e][0]
			});
		}

		$("#importSchedule").autocomplete({
			source: function(request, response) {
		        var results = $.ui.autocomplete.filter(lsAutoImportSchedule, request.term);

		        response(results.slice(0, 1000));
		    },
			select: function( event, ui ) {
				chooseImportScheduleCode = ui.item.importCode;
			}
		});		
	})

	loadProductCatalogList(function(productCatalogList){
		if (!productCatalogList) {
			productCatalogList = JSON.parse(localStorage.getItem("productCatalogList"));
		}
		
		var lsPCName = [];
		for (var e in productCatalogList) {
			if (e==0) {
				continue;
			}
			lsPCName.push({
				label : productCatalogList[e][0],
				value : productCatalogList[e][0],
				data : productCatalogList[e],
				pcIndex : e
			});
		}
		// console.log(lsPCName);
		$( "#productName" ).autocomplete({
			max:10,
			source: function(request, response) {
		        var results = $.ui.autocomplete.filter(lsPCName, request.term);

		        response(results.slice(0, 10));
		    },
			select: function( event, ui ) {
				// console.log(event);
				console.log(ui);
				// $("#customerName").val(ui.item.);
				// $("#customerAddress").val(ui.item.data[2]);
				// $("#customerPhone").val(ui.item.data[0]);
				// choosenCustomerIndex = ui.item.cusIndex;
				// $("#saveCustomerInfor").html("Cập nhật T.T Khách")
				$("#productName").val(ui.item.data[0]);

				$("#productOriginalCostEur").val(ui.item.data[1]);

				$("#productWeight").val(ui.item.data[2]);

				$("#productEstimateVND").val(ui.item.data[3]);

				$("#productEstimateSellingVND").val(ui.item.data[4]);

				$("#productEstimateSellingCTV").val(ui.item.data[6]);

				$("#prodImageLink").val(ui.item.data[5]);
	
				$("#imgThumbnail").attr("src",ui.item.data[5]);
				choosenProductCatalogIndex = ui.item.pcIndex;

			}
		});
	})
}

function editProductFn(){

	var ckValidate = validateInputData();
	if (!ckValidate) {
		return false;
	}
	
	var dataset = [];

	var productCode = $("#productCode").val();
	var productName = $("#productName").val();

	var productCount = $("#productCount").val();

	var productOriginalCostEur = $("#productOriginalCostEur").val();

	var productWeight = $("#productWeight").val();
	var shipInternationalFee = $("#shipInternationalFee").val();
	var shipItalyFee = $("#shipItalyFee").val();
	var productUrl = $("#productUrl").val();

	var otherFee = $("#otherFee").val();

	var shipVietnamFee = $("#shipVietnamFee").val();

	var productEstimateVND = $("#productEstimateVND").val();

	var productEstimateSellingVND = $("#productEstimateSellingVND").val();

	var productEstimateSellingCTV = $("#productEstimateSellingCTV").val();

	var profitPerOneProduct = $("#profitPerOneProduct").html();

	var turnover = $("#turnover").html();

	var totalCost = $("#totalCost").html();

	var totalProfit = $("#totalProfit").html();

	var prodImageLink = $("#prodImageLink").val();
	var productIndex = currentProduct.productIndex;

	// var importCode = document.getElementById("importSchedule").value;
	// console.log("importCode:"+importCode);
	var importCode = chooseImportScheduleCode;

	productWeight = productWeight ? productWeight : 0;
	shipInternationalFee = shipInternationalFee ? shipInternationalFee : 0;
	shipItalyFee = shipItalyFee ? shipItalyFee : 0;
	productUrl = productUrl ? productUrl : "0";
	shipVietnamFee = shipVietnamFee ? shipVietnamFee : 0;
	productOriginalCostEur = productOriginalCostEur ? productOriginalCostEur : 0;
	otherFee = otherFee ? otherFee : 0;
	productEstimateVND = productEstimateVND ? productEstimateVND : 0;
	productEstimateSellingCTV = productEstimateSellingCTV ? productEstimateSellingCTV : productEstimateVND;
	prodImageLink = prodImageLink ? prodImageLink : "";

	currentProduct = {
		productIndex : productIndex,
		productCode : productCode,
		importCode : importCode,
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
		productEstimateSellingCTV : productEstimateSellingCTV,
		profitPerOneProduct : profitPerOneProduct,
		turnover : turnover,
		totalCost : totalCost,
		totalProfit : totalProfit,
		prodImageLink : prodImageLink,
		productUrl : productUrl
	}

    localStorage.setItem("currentProduct",JSON.stringify(currentProduct));


	// console.log(productCode)
	var proIndex = parseInt(productIndex) + 1;
	var numOfColumn = 21;
	var sheetrange = 'Product!A'+proIndex+':'+ String.fromCharCode(65+numOfColumn)+proIndex+"";

	var dataEditP = [
                [productCode, //0 A
                '=CONCATENATE(INDIRECT(ADDRESS(ROW();3));"_";INDIRECT(ADDRESS(ROW();1)))',//1 B
                importCode,
                productName, //1 B
                productCount, //2 C
                productOriginalCostEur, //3 D
                productWeight, //4 E
                shipInternationalFee, //5 F
                productUrl, //6 G
                shipVietnamFee, //7 H
                otherFee, //8 I
                productEstimateVND, //9 J
                productEstimateSellingVND, //10 K
				"=INDIRECT(ADDRESS(ROW();13)) - INDIRECT(ADDRESS(ROW();12))", //13 N
				"=INDIRECT(ADDRESS(ROW();13))*INDIRECT(ADDRESS(ROW();5))", //14 O
				"=INDIRECT(ADDRESS(ROW();12))*INDIRECT(ADDRESS(ROW();5))", //15 P
				"=INDIRECT(ADDRESS(ROW();15)) - INDIRECT(ADDRESS(ROW();16))", //16 Q
				"=INDIRECT(ADDRESS(ROW();5)) - SUMIF(OrderDetail!D:D;INDIRECT(ADDRESS(ROW();2));OrderDetail!F:F)", //17 R
				"=INDIRECT(ADDRESS(ROW();12)) * INDIRECT(ADDRESS(ROW();18))", //18 S
				prodImageLink,
				productEstimateSellingCTV,
				'=SUMIF(OrderDetail!D:D; INDIRECT(ADDRESS(ROW();2)); OrderDetail!L:L)'
                ]
            ];
    
	// console.log(dataEditP);
	
	$("#loadingSpin").show();

	var dataAppendCatalog = [[
        productName, //3 D
        productOriginalCostEur, //5 F
        productWeight, //6 G
        productEstimateVND, //11 L
        productEstimateSellingVND, //12 M
		prodImageLink, //19 T
		productEstimateSellingCTV
    ]]
    updateProductCatalog(dataAppendCatalog,function(){
		if (mode == "edit") {
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
		} else if (mode == "duplicate"){
			appendProduct(dataEditP, function(){
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

function updateProductCatalog(data, callback) {
	var indexColumnOfAllData = 7;
	
	var range = 'ProductCatalog!A:'+String.fromCharCode(65+indexColumnOfAllData);

	if (choosenProductCatalogIndex == -1) { //=>Add into catalog
		addCommonData(customerSheet, data,range,function(){
			callback();
		})
    } else if (choosenProductCatalogIndex >= 0) { //=>Edit into catalog
	 	realPCIndex = (parseInt(choosenProductCatalogIndex)+1);
		// console.log("realCusIndex:"+realCusIndex);
		range = 'ProductCatalog!A'+realPCIndex+":"+String.fromCharCode(65+indexColumnOfAllData)+realPCIndex;
		// console.log(range);
		editCommonData(customerSheet, data,range,function(){
			callback();
		})
    } else {
    	callback();
    }
}

$("#editProduct").click(function(){
     editProductFn();
})

$("#btnRefresh").click(function(){
	window.location = "newproduct.html";
});

// $( "input" ).keyup(function() {
// 	var idClass = $(this).attr('id');

// 	if (idClass == "productEstimateSellingVND" || idClass == "productEstimateVND") {
// 		var productEstimateVND = parseFloat($("#productEstimateVND").val());
// 		var productCount = parseFloat($("#productCount").val());
// 		if (!$("#productEstimateSellingVND").val()) {
// 			return;
// 		}
// 		var productEstimateSellingVND = parseFloat($("#productEstimateSellingVND").val());

// 		$("#profitPerOneProduct").html(productEstimateSellingVND - productEstimateVND);
// 		$("#turnover").html(productEstimateSellingVND * productCount);
// 		$("#totalCost").html(productEstimateVND * productCount);
// 		$("#totalProfit").html((productEstimateSellingVND - productEstimateVND)*productCount);

// 		return;
// 	};

// 	// if (idClass == "productName") {
// 	// 	var productCode = $("#productCode").val();
// 	// 	productCode = productCode ? productCode : "$$$";
// 	// 	var productName = $("#productName").val();
// 	// 	checkProductCodeName(productCode,productName,function(check){
// 	// 		console.log("checkProductCodeName:"+check);
// 	// 		if (!check) {
// 	// 		    $("#modelContent").html("Mã hàng hoặc tên mặt hàng đã tồn tại hoặc hệ thống có vấn đề");
// 	// 	    	$('#myModal').modal('toggle');
// 	// 		}
// 	// 	})
// 	// return;
// 	// }

// 	if (idClass == "productEstimateVND" || idClass == "productName"){
// 		return;
// 	};


// 	var productCount = parseFloat($("#productCount").val());

// 	var productOriginalCostEur = parseFloat($("#productOriginalCostEur").val());

// 	var productWeight = parseFloat($("#productWeight").val());
// 	var shipInternationalFee = parseFloat($("#shipInternationalFee").val());
// 	var shipItalyFee = parseFloat($("#shipItalyFee").val());

// 	var otherFee = parseFloat($("#otherFee").val());

// 	var shipVietnamFee = parseFloat($("#shipVietnamFee").val());

// 	shipInternationalFee = shipInternationalFee ? shipInternationalFee : 0;
// 	shipItalyFee = shipItalyFee ? shipItalyFee : 0;
// 	otherFee = otherFee ? otherFee : 0;
// 	shipVietnamFee = shipVietnamFee ? shipVietnamFee : 0;

// 	console.log( "Handler for .keypress() called." );

// 	console.log($("#productOriginalCostEur").val())
// 	// console.log($(this).attr('id'));
// 	var productEstimateVND = productOriginalCostEur*EuroVndRate + productWeight * 
// 		( shipInternationalFee * EuroVndRate + shipItalyFee * EuroVndRate + shipVietnamFee ) + otherFee;

// 	console.log(productOriginalCostEur + " " + productWeight + " " + productEstimateVND);
// 	// $("#productEstimateVND").val();
// 	$("#productEstimateVND").val(productEstimateVND);
// 	// $("#productEstimateSellingVND").val(parseFloat(productEstimateVND + 100000));

// });


$( "#productCount" ).keyup(function() {
	recalculateRefValues();
})

$("#productOriginalCostEur").keyup(function(){
	recalculateProdEstVND();
})
$("#productWeight").keyup(function(){
	recalculateProdEstVND();
})
$("#shipInternationalFee").keyup(function(){
	recalculateProdEstVND();
})

$( "#otherFee" ).keyup(function() {
	recalculateProdEstVND();
})

$( "#productEstimateVND" ).keyup(function() {
	recalculateRefValues();
})
$( "#productEstimateSellingVND" ).keyup(function() {
	recalculateRefValues();
})

function recalculateRefValues(){
	var productEstimateVND = $("#productEstimateVND").val();
	var productCount = $("#productCount").val();

	var productEstimateSellingVND = $("#productEstimateSellingVND").val();

	if (!productCount || !productEstimateVND || !productEstimateSellingVND) {
		return;
	}

	var productEstimateVND = Math.round(parseFloat(productEstimateVND));
	var productCount = parseInt(productCount);

	var productEstimateSellingVND = parseInt(productEstimateSellingVND);

	$("#profitPerOneProduct").html(productEstimateSellingVND - productEstimateVND);
	$("#turnover").html(productEstimateSellingVND * productCount);
	$("#totalCost").html(productEstimateVND * productCount);
	$("#totalProfit").html((productEstimateSellingVND - productEstimateVND)*productCount);
}

function recalculateProdEstVND(){
	var productOriginalCostEur = $("#productOriginalCostEur").val();

	var productWeight = $("#productWeight").val();

	var shipInternationalFee = $("#shipInternationalFee").val();
	var otherFee = $("#otherFee").val();

	if (!shipInternationalFee) {
		shipInternationalFee = 0;
	}

	if (!otherFee) {
		otherFee = 0;
	}

	if (!productOriginalCostEur || !productWeight) {
		return;
	}

	productOriginalCostEur = parseFloat(productOriginalCostEur);
	productWeight = parseFloat(productWeight);
	shipInternationalFee = parseFloat(shipInternationalFee);
	otherFee = parseFloat(otherFee);
	
	var productEstimateVND = Math.ceil(productOriginalCostEur*EuroVndRate + productWeight * 
		( shipInternationalFee * EuroVndRate ))+ otherFee;

	$("#productEstimateVND").val(productEstimateVND);

	recalculateRefValues();
}



$("#btnDuplicate").click(function(){
	mode = "duplicate";
	$("#pageMode").html("Thêm mặt hàng");
    window.scrollTo(0, 0);
    $("#editProduct").html("Thêm mặt hàng");
	getLatestProductCode(function(code){
		$("#productCode").val(code);
	})
})

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
		$("#imgThumbnail").attr("src",JSON.parse(response).data.link);

    	$("#loadingSpin").hide();

      });

    }
  });


  function validateInputData() {

	var productCode = $("#productCode").val();
	var productName = $("#productName").val();
	var importCode = chooseImportScheduleCode;

	var warningContent = undefined;
	
	if (!importCode || importCode=="-1") {
		warningContent = "Không có mã đợt hàng!"
	}

	if (!productCode) {
		warningContent = "Không có mã sản phẩm!"
	}

	if (!productName) {
		warningContent = "Không có tên sản phẩm!"
	}

	if (warningContent) {
		$("#modelContent").html(warningContent);
		$('#myModal').modal('show');
		return false;
	} else {
		return true;
	}
}
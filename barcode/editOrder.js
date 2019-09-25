// addNewProduct.js

// var sheetrange = 'Sheet1!A1:B1000';
// console.log('Sheet1!A1:'+ String.fromCharCode(65+numOfColumn));


// var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';
// var indexColumnOfAllData = 15;
// var sheetrange = 'Product!A:'+String.fromCharCode(65+indexColumnOfAllData);
// var dataset = [];

var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';

var sheetOrder = "Order";
var sheetOrderDetail = "OrderDetail";

var currentOrder = JSON.parse(localStorage.getItem("currentOrder"));


// console.log(currentOrder);

$("#customerName").val(currentOrder.customerName);
$("#customerAddress").val(currentOrder.customerAddress);
$("#customerPhone").val(currentOrder.customerPhone);
$("#shippingCost").val(currentOrder.shippingCost);
$("#totalPay").html(currentOrder.totalPay);
$("#totalPayIncludeShip").html(currentOrder.totalPayIncludeShip);
$("#orderNode").val(currentOrder.orderNode);


var productList = JSON.parse(localStorage.getItem("productList"));

var triggerAfterLoad = function(){
	
	console.log("triggerAfterLoad");

	$("#loadingSpin").show();
	loadProductList(function(){
		$("#loadingSpin").hide();
	});
};

$("#orderCode").val(currentOrder.orderCode);

var orderCode = currentOrder.orderCode;

var orderIndex = parseInt(currentOrder.orderIndex)+1;

var numOfProType = 1;

$("#btnRefresh").hide();
$("#btnPrintOrder").hide();

// $(document).ready(function(){
// 	console.log("Test");
// 	window.scrollTo(0,0);
// });

var prodListOrder = currentOrder.prodListOrder;

fillListOfProduct(prodListOrder);

function fillListOfProduct(prodListOrder) {

	// var prodListOrder = currentOrder.prodListOrder;
	// console.log(prodListOrder);

	$("#listProduct").empty();

	for (e in prodListOrder) {
		// console.log(e)
		$("#listProduct").append('<div class="card">'+
        '<div class="card-header" id="heading_"'+e+'>'+
          '<h5 class="mb-0">'+
            '<button class="btn btn-link btnShowProduct btnProductName_'+e+'" data-toggle="collapse" data-target="#collapse_'+e+'" aria-expanded="false" aria-controls="collapse_'+e+'">'+
				prodListOrder[e].productName +" | "+
				prodListOrder[e].productCount +" | "+ 
				prodListOrder[e].productEstimateSellingVND +" | "+ 
				prodListOrder[e].turnover +

            '</button>'+
            '<div class="btn deleteelement delprof_'+e+'" style="border : 1px solid black">'+
            	"Xoá sản phẩm"+
            '</div>'+
          '</h5>'+
        '</div>'+

        '<div id="collapse_'+e+'" class="'+(e==0 ? "collapse show" : "collapse")+'" aria-labelledby="heading_'+e+'" data-parent="#listProduct">'+
          '<div class="card-body">'+
/////////
            '<div class="form-group row">'+
              '<label for="productCode" class="col-sm-2 col-form-label">'+
              	'Mã sản phẩm'+
              	'<span class="fa fa-search btn btn-default btnSearchProduct_'+e+'"></span>'+
          	  '</label>'+
              '<div class="col-sm-10">'+
                '<input type="text" class="form-control productCode_'+e+'" placeholder="Mã sản phẩm" value="'+prodListOrder[e].productCode+'">'+
                // '<div style="height: 0px;width:0px; overflow:hidden;">'+
                //   '<input id="scanBarcode_'+e+'" type="file" class="btn btn-primary mb-2" accept="image/*;capture=camera" />'+
                // '</div>'+
                // '<button class="btn btn-primary mb-2 btnScan '+e+'">Quét mã vạch</button>'+

              '</div>'+
            '</div>'+

            '<div class="form-group row">'+
              '<label for="productName" class="col-sm-2 col-form-label">Tên sản phẩm</label>'+
                '<div class="col-sm-10">'+
                '<input type="text" class="form-control productName_'+e+'" placeholder="Tên sản phẩm" value="'+prodListOrder[e].productName+'" required>'+
              '</div>'+
            '</div>'+

            '<div class="form-group row">'+
              '<label for="productCount" class="col-sm-2 col-form-label">Số lượng</label>'+
              '<div class="col-sm-10">'+
                '<input type="number" class="form-control productCount_'+e+'" placeholder="0" value="'+prodListOrder[e].productCount+'" required>'+
              '</div>'+
            '</div>'+

            '<div class="form-group row">'+
              '<label for="productEstimateSellingVND" class="col-sm-2 col-form-label">Giá bán (VND) </label>'+
              '<div class="col-sm-10">'+
                '<input type="number" class="form-control productEstimateSellingVND_'+e+'" value="'+prodListOrder[e].productEstimateSellingVND+'">'+
              '</div>'+
            '</div>'+

            '<div class="form-group column">'+
              '<label class="col-sm-2 col-form-label">'+
                'Tổng tiền:'+
                '<p class="turnover_'+e+'">'+prodListOrder[e].turnover+'</p>'+
              '</label>'+
            '</div>'+
///////////
          '</div>'+
        '</div>'+
      '</div>')

		$(".btnSearchProduct_"+e).click(searchForm);
	}
	console.log(e);
	numOfProType = parseInt(e)+1;
	addNewFormOfProduct(numOfProType-1);
}

function addNewFormOfProduct(currentIndex){
	console.log("addNewFormOfProduct:"+currentIndex+" vs "+ numOfProType);


	if (currentIndex != numOfProType - 1)  {
		return;
	}
	console.log("Add new form");

	e = numOfProType;
	$("#listProduct").append('<div class="card">'+
        '<div class="card-header" id="heading_"'+e+'>'+
          '<h5 class="mb-0">'+
            '<button class="btn btn-link btnProductName_'+e+'" data-toggle="collapse" data-target="#collapse_'+e+'" aria-expanded="false" aria-controls="collapse_'+e+'">'+
              'Thêm hàng vào đơn hàng' +
            '</button>'+
            // '<div class="btn deleteelement delprof_'+e+'" style="border : 1px solid black">'+
            // 	"Xoá sản phẩm"+
            // '</button>'+
          '</h5>'+
        '</div>'+

        '<div id="collapse_'+e+'" class="collapse" aria-labelledby="heading_'+e+'" data-parent="#listProduct">'+
          '<div class="card-body">'+
/////////
            '<div class="form-group row">'+
              '<label for="productCode" class="col-sm-2 col-form-label">'+
              	'Mã sản phẩm'+
              	'<span class="fa fa-search btn btn-default btnSearchProduct_'+e+'"></span>'+
          	  '</label>'+
              '<div class="col-sm-10">'+
                '<input type="text" class="form-control productCode_'+e+'" placeholder="Mã sản phẩm">'+
                // '<div style="height: 0px;width:0px; overflow:hidden;">'+
                //   '<input id="scanBarcode_'+e+'" type="file" class="btn btn-primary mb-2" accept="image/*;capture=camera" />'+
                // '</div>'+
                // '<button class="btn btn-primary mb-2 btnScan '+e+'">Quét mã vạch</button>'+

              '</div>'+
            '</div>'+

            '<div class="form-group row">'+
              '<label for="productName" class="col-sm-2 col-form-label">Tên sản phẩm</label>'+
                '<div class="col-sm-10">'+
                '<input type="text" class="form-control productName_'+e+'" placeholder="Tên sản phẩm" required>'+
              '</div>'+
            '</div>'+

            '<div class="form-group row">'+
              '<label for="productCount" class="col-sm-2 col-form-label">Số lượng</label>'+
              '<div class="col-sm-10">'+
                '<input type="number" class="form-control productCount_'+e+'" placeholder="0" required>'+
              '</div>'+
            '</div>'+

            '<div class="form-group row">'+
              '<label for="productEstimateSellingVND" class="col-sm-2 col-form-label">Giá bán (VND) </label>'+
              '<div class="col-sm-10">'+
                '<input type="number" class="form-control productEstimateSellingVND_'+e+'" placeholder="0 VND">'+
              '</div>'+
            '</div>'+

            '<div class="form-group column">'+
              '<label class="col-sm-2 col-form-label">'+
                'Tổng tiền:'+
                '<p class="turnover_'+e+'">0</p>'+
              '</label>'+
            '</div>'+
///////////
          '</div>'+
        '</div>'+
      '</div>')

	numOfProType = numOfProType + 1;

	$('#collapse_'+e).on('shown.bs.collapse', function() {
  		console.log("shown:"+e);
  		$('.productCode_'+e).focus();
	})

	var totalPay = 0;
	for (var i = 0; i < numOfProType; i++) { 
		var toi = $(".turnover_"+i).html() ? $(".turnover_"+i).html() : 0;
		totalPay = totalPay + parseFloat(toi);
	}
	$("#totalPay").html(totalPay);
	var shippingCost = parseFloat($("#shippingCost").val());
	shippingCost = shippingCost ? shippingCost : 0;

	$("#totalPayIncludeShip").html((totalPay + shippingCost));

	$( "input" ).keyup(inputKeyupfunction);

	$(".btnSearchProduct_"+e).click(searchForm);

}

// function updateProductName(index,name) {
// 	$("#btnProductName"+index).html($())
// }

function searchForm(){
	console.log("searchForm:");
	var index = $(this).attr("class").split(" ").pop().split("_").pop();
	
	$("#myModal2 .modal-body").empty();

	for(e in productList) {
		if (e == 0) {
			continue;
		}

		$(".modal-body").append('<div class="card">'+
        // '<div class="card-header">'+
          // '<h5 class="mb-0">'+
            '<button class="btn btn-link searchProductChoose searchProductBtn_'+index+'">'+
              productList[e][1] + " | " + productList[e][3] +
            '</button>'+
          // '</h5>'+
        // '</div>'+
      '</div>')
	}

	$("#myModal2 .searchProductChoose").click(function(){
		var index = $(this).attr("class").split(" ").pop().split("_").pop();

		var productIndex = parseInt(index);
		var productCode = $(this).html().split(" ")[0];

		console.log("this is productCode:"+productCode+" index:"+index);

		$(".productCode_"+index).val(productCode);

		triggerNextProcessNewOrder(productIndex, productCode);
		$('#myModal2').modal('hide');
	})

	
	$("#myModal2 .modal-title").html('<input type="text" class="form-control searchInputProduct_'+index+'" placeholder="Tìm kiếm">')

	$("#myModal2 .modal-body").css('max-height','300px');
	$("#myModal2 .modal-body").css('overflow','scroll');

	$('#myModal2').modal('toggle');
	
	$("#myModal2 .searchInputProduct_"+index+"").keyup(function(){
		var index = $(this).attr("class").split(" ").pop().split("_").pop();
		filterInSearchForm(index,$(this).val());
	})

}

function filterInSearchForm(index,searchText){
	$(".modal-body").empty();

	for(e in productList) {
		if (e == 0) {
			continue;
		}
		if (searchText) {
			if (!(productList[e][1].toUpperCase().includes(searchText.toUpperCase()) 
				|| productList[e][3].toUpperCase().includes(searchText.toUpperCase()))) {
				continue;
			}
		}
		$(".modal-body").append('<div class="card">'+
        // '<div class="card-header">'+
          // '<h5 class="mb-0">'+
            '<button class="btn btn-link searchProductChoose searchProductBtn_'+index+'">'+
              productList[e][1] + " | " + productList[e][3] +
            '</button>'+
          // '</h5>'+
        // '</div>'+
      '</div>')
	}

	$(".searchProductChoose").click(function(){
		var index = $(this).attr("class").split(" ").pop().split("_").pop();

		var productIndex = parseInt(index);
		var productCode = $(this).html().split(" ")[0];

		console.log("this is productCode:"+productCode+" index:"+index);

		$(".productCode_"+index).val(productCode);

		triggerNextProcessNewOrder(productIndex, productCode);
		$('#myModal2').modal('hide');
	})
}


function triggerNextProcessNewOrder(productIndex, productCode){
	var index = -1;
	for(e in productList) {
		if (productList[e][0] == productCode) {
			index = e;
		}
	}
	if (index == -1) {
	    // $("#modelContent").html("Không tìm thấy mặt hàng");
	    // $('#myModal').modal('toggle');
	    return;
	}

	$(".productName_"+productIndex).val(productList[index][1]);
	$(".productCount_"+productIndex).val(1);
	$(".productEstimateSellingVND_"+productIndex).val(productList[index][10])
	$(".btnProductName_"+productIndex).html(productList[index][1]+" | 1 | "+productList[index][10]+" | "+productList[index][10]);
			// $(".btnProductName_"+productIndex).html($(".productName_"+productIndex).val() + " | " + productCount + " | " + productEstimateSellingVND + " | " + turnover);

	$(".turnover_"+productIndex).html(productList[index][10]);

	totalPay = 0;
	for (var i = 0; i < numOfProType; i++) { 
		var toi = $(".turnover_"+i).html() ? $(".turnover_"+i).html() : 0;
		totalPay = totalPay + parseFloat(toi);
	}
	$("#totalPay").html(totalPay);
	shippingCost = $("#shippingCost").val();
	shippingCost = shippingCost ? shippingCost : 0;

	totalPayIncludeShip = parseFloat(shippingCost) + totalPay;

	$("#totalPayIncludeShip").html(totalPayIncludeShip);

	// $(".btnProductName_"+productIndex).html($(".productName_"+productIndex).val() + " | " + productCount + " | " + productEstimateSellingVND + " | " + turnover);

	addNewFormOfProduct(parseInt(productIndex));
};

$( "input" ).keyup(inputKeyupfunction);

function inputKeyupfunction() {
	if (!$(this).attr("class")) {
		return;
	};
	if ($(this).attr("id") == "shippingCost"){
		var totalPay = parseFloat($("#totalPay").html());
		var shippingCost = $("#shippingCost").val();
		shippingCost = shippingCost ? shippingCost : 0;

		shippingCost = parseFloat(shippingCost);

		$("#totalPayIncludeShip").html((totalPay + shippingCost));
		return;
	}
	var className = $(this).attr("class").split(" ").pop().split("_");
	// console.log(className)
	if (className[0] == "productCode"){
		var productIndex = parseInt(className[1]);
		var productCode = $(this).val();

		// $(".btnProductName_"+productIndex).html($(".productName_"+productIndex).val() + " | " + productCount + " | " + productEstimateSellingVND + " | " + turnover);

		// console.log("this is productCode:"+productCode)

		triggerNextProcessNewOrder(productIndex, productCode);
	}
	
	if (className[0] == "productCount" || className[0] == "productEstimateSellingVND"){
		var productIndex = parseInt(className[1]);
		var productCount = parseInt($(".productCount_"+productIndex).val());
		var productEstimateSellingVND = parseFloat($(".productEstimateSellingVND_"+productIndex).val());
		productCount = productCount ? productCount : 0;
		productEstimateSellingVND = productEstimateSellingVND ? productEstimateSellingVND : 0;
		var turnover = productCount*productEstimateSellingVND;
		$(".turnover_"+productIndex).html(turnover);

		totalPay = 0;
		for (var i = 0; i < numOfProType; i++) { 
			var toi = $(".turnover_"+i).html() ? $(".turnover_"+i).html() : 0;
			console.log(toi);
			totalPay = totalPay + parseFloat(toi);
		}
		$("#totalPay").html(totalPay);
		shippingCost = $("#shippingCost").val();
		shippingCost = shippingCost ? shippingCost : 0;

		totalPayIncludeShip = parseFloat(shippingCost) + totalPay;

		$("#totalPayIncludeShip").html(totalPayIncludeShip);

		$(".btnProductName_"+productIndex).html($(".productName_"+productIndex).val() + " | " + productCount + " | " + productEstimateSellingVND + " | " + turnover);

	}

};

function addDetailOrder() {
	console.log("addDetailOrder");
	var numOfColumn = 7;
	// var sheetrange = 'Test2!A1:'+ String.fromCharCode(65+numOfColumn);

    //for append
    submitDataAppend = [];
    submitDataEdit = [];
    rangeEdit = [];

    // deleteRange = [];
    
    console.log("numOfProType:"+numOfProType);


	for (var i = 0; i <numOfProType;i++) {
		// prodListOrder[i] = {};
		if (!$(".productCode_"+i).val()) {
			continue;
		}
		var isAppend = false;
		if (!prodListOrder[i]) {
			prodListOrder[i] = {};
			isAppend = true;
		}
		if (prodListOrder[i].delete){
			continue;
		}
		// if (prodListOrder[i].delete) {
		// 	deleteRange.push(i);
		// 	continue;
		// }
		// prodListOrder[i] = {}
		prodListOrder[i].productCode = $(".productCode_"+i).val();
		prodListOrder[i].productName = $(".productName_"+i).val();
		prodListOrder[i].productCount = $(".productCount_"+i).val();
		prodListOrder[i].productEstimateSellingVND = $(".productEstimateSellingVND_"+i).val();
		prodListOrder[i].turnover = $(".turnover_"+i).html();

		if (isAppend){
			submitDataAppend.push([
				orderCode,
				$(".productCode_"+i).val(),
				$(".productName_"+i).val(),
				$(".productCount_"+i).val(),
				$(".productEstimateSellingVND_"+i).val(),
				"=INDIRECT(ADDRESS(ROW();4)) *  INDIRECT(ADDRESS(ROW();5))",
				"=VLOOKUP(INDIRECT(ADDRESS(ROW();2));Product!A:O;10;FALSE)",
				"=(INDIRECT(ADDRESS(ROW();5)) - INDIRECT(ADDRESS(ROW();7))) * INDIRECT(ADDRESS(ROW();4))"
			])
		} else {
			submitDataEdit.push([
				orderCode,
				$(".productCode_"+i).val(),
				$(".productName_"+i).val(),
				$(".productCount_"+i).val(),
				$(".productEstimateSellingVND_"+i).val(),
				"=INDIRECT(ADDRESS(ROW();4)) *  INDIRECT(ADDRESS(ROW();5))",
				"=VLOOKUP(INDIRECT(ADDRESS(ROW();2));Product!A:O;10;FALSE)",
				"=(INDIRECT(ADDRESS(ROW();5)) - INDIRECT(ADDRESS(ROW();7))) * INDIRECT(ADDRESS(ROW();4))"
			])			
			var orderDetailIndex = parseInt(prodListOrder[i].orderDetailIndex) + 1;
			rangeEdit.push(
				sheetOrderDetail+'!A'+orderDetailIndex+':'+ String.fromCharCode(65+numOfColumn)+orderDetailIndex			
			)
		}
	}

	for (i in prodListOrder) {
		if (prodListOrder[i].delete){
			submitDataEdit.push(["","","","","","","",""])			
			var orderDetailIndex = parseInt(prodListOrder[i].orderDetailIndex) + 1;
			rangeEdit.push(
				sheetOrderDetail+'!A'+orderDetailIndex+':'+ String.fromCharCode(65+numOfColumn)+orderDetailIndex			
			)
		}
	}

	currentOrder.prodListOrder = prodListOrder;

	// console.log(prodListOrder);
	console.log("submitDataAppend");
	console.log(submitDataAppend);

	console.log("submitDataEdit");
	console.log(submitDataEdit);
	console.log(rangeEdit);

	var fEdit = function(){
		console.log("fEdit")
		if (submitDataEdit.length > 0) {
			// var numOfColumn = 6;

			var updateOneByOne = function (index) {
				if (index<submitDataEdit.length) {
					// var sheetrange = 'Test2!A'+
					// 	rangeEdit[index] +
					// 	':'+ String.fromCharCode(65+numOfColumn) +
					// 	rangeEdit[index];
					console.log("Edit:");
					console.log(submitDataEdit[index]);
					console.log(rangeEdit[index])

					// gapi.client.sheets.spreadsheets.values.update({
				 //        spreadsheetId: spreadsheetId,
				 //        range: rangeEdit[index],
				 //        valueInputOption: "USER_ENTERED",
				 //        resource: {
				 //            "majorDimension": "ROWS",
				 //            "values": [submitDataEdit[index]]
				 //        }
				 //    }).then(function(response) {
				 //        var result = response.result;
				 //    	console.log(`${result.updatedCells} cells updated.`);
					// 	// finishOrder();
				 //        // addDetailOrder();
				 //        updateOneByOne(index+1);
				 //    }, function(response) {
				 //        appendPre('Error: ' + response.result.error.message);
				 //    });

				 var dataEditOD = [submitDataEdit[index]];
			 	 editOrderDetail(dataEditOD, rangeEdit[index], function(){
			 	 	updateOneByOne(index+1);
			 	 })

				} else {
					finishOrder();
					return;
				}
			}
			updateOneByOne(0);
		}
	}

	// var fDelete = function (){
	// 	gapi.client.sheets.spreadsheets.values.clear({
	//         spreadsheetId: spreadsheetId,
	// 		range : "Test!A1:E1"
	//     }).then(function(response) {
	//         var result = response.result;
	//     	console.log(`${result.updatedCells} cells updated.`);
	// 		// finishOrder();
	//         // addDetailOrder();
	//         fEdit();

	//     }, function(response) {
	//         appendPre('Error: ' + response.result.error.message);
	//     });
	// }

	if (submitDataAppend.length > 0){
		// var numOfColumn = 6;
		// var sheetrange = sheetOrderDetail+'!A1:'+ String.fromCharCode(65+numOfColumn);

		// gapi.client.sheets.spreadsheets.values.append({
	 //        spreadsheetId: spreadsheetId,
	 //        range: sheetrange,
	 //        valueInputOption: "USER_ENTERED",
	 //        resource: {
	 //            "majorDimension": "ROWS",
	 //            "values": submitDataAppend
	 //        }
	 //    }).then(function(response) {
	 //        var result = response.result;
	 //    	console.log(`${result.updatedCells} cells updated.`);
		// 	// finishOrder();
	 //        // addDetailOrder();
	 //        fEdit();

	 //    }, function(response) {
	 //        appendPre('Error: ' + response.result.error.message);
	 //    });

	 	appendOrderDetail(submitDataAppend,function(){
	 		fEdit();
	 	})

	} else {
		fEdit();
	}

}

function finishOrder(){
	$("#addNewOrder").hide();
	$("#btnRefresh").show();
	$("#btnPrintOrder").show();
	$(".modal-body").empty();
	$(".modal-body").html("<p id='modelContent'>Đã lưu mặt hàng</p>");
	// $("#modelContent").html("Đã lưu đơn hàng");
	$("#loadingSpin").hide();
	
	localStorage.setItem("currentOrder",JSON.stringify(currentOrder));

	$('#myModal').modal('toggle');
}

$("#editOrder").click(function(){
	$("#loadingSpin").show();

	console.log("editOrder");
	//orderCode
	var customerName = $("#customerName").val();
	var customerAddress = $("#customerAddress").val();
	var customerPhone = $("#customerPhone").val();

	var orderNode = $("#orderNode").val();

	var paymentStatus = currentOrder.paymentStatus;
	var shippingStatus = currentOrder.shippingStatus;

	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date+' '+time;

	var orderDate = dateTime;

	var totalPay = $("#totalPay").html();

	var totalPayIncludeShip = $("#totalPayIncludeShip").html();

	var shippingCost = $("#shippingCost").val();
	shippingCost = shippingCost ? shippingCost : 0;

	currentOrder  = {
		orderCode : orderCode,//
		customerName : customerName,//
		customerAddress : customerAddress,//
		customerPhone : customerPhone,//
		shippingCost : shippingCost,//
		totalPay : totalPay,//
		orderDate : orderDate,
		totalPayIncludeShip : totalPayIncludeShip,
		orderIndex: orderIndex,//
		orderNode : orderNode,
		paymentStatus : paymentStatus,
		shippingStatus : shippingStatus
	}

	console.log(orderCode);
	// addDetailOrder();

	var dataEditOrder = [
                [orderCode,
                orderDate,
                customerName,
                customerAddress,
                "'"+customerPhone,
                "=SUMIF(OrderDetail!A:A,INDIRECT(ADDRESS(ROW(),1)),OrderDetail!F:F)",
				shippingCost,
				"=INDIRECT(ADDRESS(ROW();6)) + INDIRECT(ADDRESS(ROW();7))",
				paymentStatus,
				shippingStatus,
				orderNode
                ]
            ];

	var sheetrange = sheetOrder+'!A'+orderIndex +":"+ String.fromCharCode(65+numOfColumn) + orderIndex;

    editOrder(dataEditOrder, sheetrange, function(){
    	addDetailOrder();
    })
	// var numOfColumn = 10;
	// var sheetrange = sheetOrder+'!A'+orderIndex +":"+ String.fromCharCode(65+numOfColumn) + orderIndex;

	// console.log(sheetrange);
	
	// gapi.client.sheets.spreadsheets.values.update({
 //        spreadsheetId: spreadsheetId,
 //        range: sheetrange,
 //        valueInputOption: "USER_ENTERED",
 //        resource: {
 //            "majorDimension": "ROWS",
 //            "values": [
 //                [orderCode,
 //                orderDate,
 //                customerName,
 //                customerAddress,
 //                "'"+customerPhone,
 //                "=SUMIF(OrderDetail!A:A,INDIRECT(ADDRESS(ROW(),1)),OrderDetail!F:F)",
	// 			shippingCost,
	// 			"=INDIRECT(ADDRESS(ROW();6)) + INDIRECT(ADDRESS(ROW();7))",
	// 			paymentStatus,
	// 			shippingStatus,
	// 			orderNode
 //                ]
 //            ]
 //        }
 //    }).then(function(response) {
 //        var result = response.result;
 //    	// console.log(`${result.updatedCells} cells updated.`);
	//     // $("#modelContent").html("Đã lưu đơn hàng");
	//     // $('#myModal').modal('toggle');
 //        addDetailOrder();

 //    }, function(response) {
 //        appendPre('Error: ' + response.result.error.message);
 //    });
})

// function getLatestOrderCode(callback) {
//   var indexColumnOfAllData = 1;
//   var sheetrange = 'Order!A:'+String.fromCharCode(65+indexColumnOfAllData);
//   var dataset = [];

//   gapi.client.sheets.spreadsheets.values.get({
//       spreadsheetId: spreadsheetId,
//       range: sheetrange,
//   }).then(function(response) {
//       console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
//       dataset = response.result.values;
//       // showList(dataset);
//       localStorage.setItem("orderCode","DONHANG_"+dataset.length);

//       // window.productList = dataset;
//       callback();
//   }, function(response) {
//       console.log('Error: ' + response.result.error.message);
//   });
// }

$("#btnRefresh").click(function(){
	getLatestOrderCode(function(){
		window.location = "neworder.html";
	})
});

$("#btnPrintOrder").click(function(){

	localStorage.setItem("currentOrder",JSON.stringify(currentOrder));

	// var win = window.open("showorder.html", '_blank');
 //  	win.focus();
	// window.print();
	window.location = "showorder.html";
})

$(".deleteelement").click(function(){
	console.log("delete");
	var cardIndex = $(this).attr("class").split(" ").pop().split("_").pop();
	// $(".btnProductName_"+cardIndex).click();
	cardIndex = parseInt(cardIndex);

	prodListOrder[cardIndex].delete = true;

	var turnover = parseFloat($(".turnover_"+cardIndex).html());
	var totalPayIncludeShip = parseFloat($("#totalPayIncludeShip").html());
	var totalPay = parseFloat($("#totalPay").html());


	turnover = turnover ? turnover : 0;

	totalPayIncludeShip = totalPayIncludeShip - turnover;
	totalPay = totalPay - turnover;

	$("#totalPay").html(totalPay);
	$("#totalPayIncludeShip").html(totalPayIncludeShip);

	$(".btnProductName_"+cardIndex).prop('disabled', true);
	$("#collapse_"+cardIndex).collapse();
	$("#collapse_"+cardIndex).empty();
})

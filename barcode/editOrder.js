// addNewProduct.js

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
$("#prepaid").val(currentOrder.prepaid);
$("#totalWillPay").html(parseFloat(currentOrder.totalPayIncludeShip) - parseFloat(currentOrder.prepaid));

if (!currentOrder.shippingType) {
	$("#shippingType").val(0);
} else {
	$("#shippingType").val(currentOrder.shippingType);
}

var productList = JSON.parse(localStorage.getItem("productList"));

var triggerAfterLoad = function(){
	
	console.log("triggerAfterLoad");

	$("#loadingSpin").show();
	loadProductList(function(){
		$("#loadingSpin").hide();
	});

	loadImportScheduleList(function(){
		importSLData = JSON.parse(localStorage.getItem("warehouse"));
	})
};

$("#orderCode").val(currentOrder.orderCode);

var orderCode = currentOrder.orderCode;

var realOrderIndex = parseInt(currentOrder.orderIndex)+1;

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

	for (var e in prodListOrder) {
		// console.log(e)

		var productIndexInStore = -1;
		for(var e1 in productList) {
			if (productList[e1][1] == prodListOrder[e].productRefCode) {
				productIndexInStore = e1;
			}
		}

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
			'  <label for="importCode" class="col-sm-2 col-form-label">Đợt hàng</label>'+
			'    <div class="col-sm-10">'+
			'      <select class="mdb-select md-form importScheduleGeneral importSchedule_'+e+'"'+
			'        style="width: 100%">'+
			'        <option selected value="'+productIndexInStore+'">'+prodListOrder[e].importCode+'</option>'+
			'      </select>'+
			'    </div>'+
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
			'  <label for="importCode" class="col-sm-2 col-form-label">Đợt hàng</label>'+
			'    <div class="col-sm-10">'+
			'      <select class="mdb-select md-form importScheduleGeneral importSchedule_'+e+'"'+
			'        style="width: 100%">'+
			'        <option disabled>Chọn đợt hàng</option>'+
			'      </select>'+
			'    </div>'+
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
	shippingCost = shippingCost ? parseFloat(shippingCost) : 0;

	$("#totalPayIncludeShip").html((totalPay + shippingCost));

	var prepaid = parseFloat($("#prepaid").val());
	prepaid = prepaid ? prepaid : 0;
	var totalWillPay = (totalPay + shippingCost) - prepaid;
	$("#totalWillPay").html(totalWillPay);

	$( "input" ).keyup(inputKeyupfunction);

	$(".btnSearchProduct_"+e).click(searchForm);

}

function searchForm(){
	console.log("searchForm:");
	var index = $(this).attr("class").split(" ").pop().split("_").pop();
	
	$("#myModal2 .modal-body").empty();

	for(e in productList) {
		if (e == 0) {
			continue;
		}
		if (!productList[e][0]) {
			continue;
		}

		$("#myModal2 .modal-body").append('<div class="card">'+
        // '<div class="card-header">'+
          // '<h5 class="mb-0">'+
            '<button class="btn btn-link searchProductChoose searchProductChooseIndexInStore_'+e+' searchProductBtn_'+index+'">'+
              productList[e][0]+" ("+productList[e][2]+") | " + productList[e][3] + " ("+productList[e][17]+")"+
            '</button>'+
          // '</h5>'+
        // '</div>'+
      '</div>')
	}

	$("#myModal2 .searchProductChoose").click(searchProductChooseInForm);

	var filterImportInSearch = "";
	
	var lsImportCodeSearchProduct = "";
	for (e in importSLData) {
		if (e ==0 ) continue;
		lsImportCodeSearchProduct += ("<option value='"+importSLData[e][0]+"'>"+importSLData[e][0]+" - "+importSLData[e][1]+"</option>")
	}

	$("#myModal2 .modal-title").html(
		'<input type="text" class="form-control searchInputProdText searchInputProduct_'+index+'" placeholder="Tìm kiếm">'+
		// '<div class="btn btn-default">'+
		'<select class="mdb-select md-form importSearchProductFilter" style="width:100%">'+
			'<option value="-1" selected>Hàng có sẵn</option>'+
			lsImportCodeSearchProduct +
			'<option value="-2">Hàng đã bán hết</option>'+
			'<option value="-3">Toàn bộ</option>'+
		'</select>'
    	// '</div>'
	)

	$("#myModal2 .importSearchProductFilter").change(function(){
		$("#myModal2 .searchInputProdText").val("");
		var index = $("#myModal2 .searchInputProdText").attr("class").split(" ").pop().split("_").pop();

		filterInSearchForm(index,"");
	})

	$("#myModal2 .modal-body").css('max-height','300px');
	$("#myModal2 .modal-body").css('overflow','scroll');

	$('#myModal2').modal('toggle');
	$("#myModal2 .searchInputProduct_"+index+"").keyup(function(){
		var index = $(this).attr("class").split(" ").pop().split("_").pop();
		filterInSearchForm(index,$(this).val());
	})

}

function searchProductChooseInForm(){
	var lsClass = $(this).attr("class").split(" ");

	var index = lsClass.pop().split("_").pop();
	var indexInStore = lsClass.pop().split("_").pop();
	// console.log(lsClass);
	console.log("searchProductChoose:"+index+" "+indexInStore);

	var productIndex = parseInt(index);

	triggerNextProcessNewOrder(productIndex, "", indexInStore);
	$('#myModal2').modal('hide');
}

function filterInSearchForm(index,searchText){
	$("#myModal2  .modal-body").empty();

	for(var e in productList) {
		if (e == 0) {
			continue;
		}
		if (!productList[e][0]) {
			continue;
		}
		if (searchText) {
			if (!(productList[e][1].toUpperCase().includes(searchText.toUpperCase()) 
				|| productList[e][3].toUpperCase().includes(searchText.toUpperCase()))) {
				continue;
			}
		}
		var importCode = document.getElementsByClassName("importSearchProductFilter")[0].value;

		if (importCode > -1) {
		  if (importCode != productList[e][2]) {
		    continue;
		  }
		} else if (importCode == -1) {
		  if (productList[e][17] == 0) {
		    continue;
		  }
		} else if (importCode == -2) {
		  if (productList[e][17] != 0) {
		    continue;
		  }
		}

		$("#myModal2 .modal-body").append('<div class="card">'+
        // '<div class="card-header">'+
          // '<h5 class="mb-0">'+
            '<button class="btn btn-link searchProductChoose searchProductChooseIndexInStore_'+e+' searchProductBtn_'+index+'">'+
              productList[e][0]+" ("+productList[e][2]+") | " + productList[e][3] + " ("+productList[e][17]+")"+
            '</button>'+
          // '</h5>'+
        // '</div>'+
      '</div>')
	}

	$("#myModal2 .searchProductChoose").click(searchProductChooseInForm);
}


function triggerNextProcessNewOrder(productIndex, productCode, productIndexInStore){
	var index = -1;
	var importCode = 0;
	if (productIndexInStore) {
		index = parseInt(productIndexInStore);
		productCode = productList[index][0];
		$(".productCode_"+productIndex).val(productCode);
		$(".importSchedule_"+productIndex).empty();
		importCode = productList[index][2];
		// if (lsImportCode.length > 1) {
		for (var e in importSLData) {
			if (importSLData[e][0] == importCode) {
				$(".importSchedule_"+productIndex).append("<option selected value='"+index+"'>"+importSLData[e][0]+" - "+importSLData[e][1]+"</option>")
				continue;
			}
		}
	} else {
		var lsImportCode = [];
		for(var e in productList) {
			if (productList[e][0] == productCode) {
				index = e;
				importCode = productList[e][2];
				lsImportCode.push({
					productIndexInStore : e,
					importCode : productList[e][2]
				});
			}
		}
		$(".importSchedule_"+productIndex).empty();
		// if (lsImportCode.length > 1) {
		for (var e in importSLData) {
			if (importSLData[e][0] == importCode) {
				$(".importSchedule_"+productIndex).append("<option selected value='"+index+"'>"+importSLData[e][0]+" - "+importSLData[e][1]+"</option>")
				continue;
			}
			for (var e1 in lsImportCode) {
				if (importSLData[e][0] == lsImportCode[e1].importCode) {
					$(".importSchedule_"+productIndex).append("<option value='"+lsImportCode[e1].productIndexInStore+"'>"+importSLData[e][0]+" - "+importSLData[e][1]+"</option>")
				}
			}
		}
		// }
		$(".importScheduleGeneral").change(function(){
			var productIndex = $(this).attr("class").split(" ").pop().split("_").pop();
			productIndex = parseInt(productIndex);
			productIndexInStore = document.getElementsByClassName($(this).attr("class"))[0].value;
			console.log(productIndex+" "+productIndexInStore);
			triggerNextProcessNewOrder(productIndex,"",productIndexInStore);
		})
	}
	if (index == -1) {
	    // $("#modelContent").html("Không tìm thấy mặt hàng");
	    // $('#myModal').modal('toggle');
	    return;
	}

	$(".productName_"+productIndex).val(productList[index][3]);
	$(".productCount_"+productIndex).val(1);
	$(".productEstimateSellingVND_"+productIndex).val(productList[index][12])
	// $(".btnProductName_"+productIndex).html(productList[index][3]);
	$(".turnover_"+productIndex).html(productList[index][12]);

	totalPay = 0;
	for (var i = 0; i < numOfProType; i++) { 
		totalPay = totalPay + parseFloat($(".turnover_"+i).html());
	}
	$("#totalPay").html(totalPay);
	shippingCost = $("#shippingCost").val();
	shippingCost = shippingCost ? parseFloat(shippingCost) : 0;

	totalPayIncludeShip = shippingCost + totalPay;

	$("#totalPayIncludeShip").html(totalPayIncludeShip);

	var prepaid = parseFloat($("#prepaid").val());
	prepaid = prepaid ? prepaid : 0;
	var totalWillPay = (totalPay + shippingCost) - prepaid;
	$("#totalWillPay").html(totalWillPay);

	$(".btnProductName_"+productIndex).html(productList[index][3] + " | " + 1 + " | " + productList[index][12] + " | " + productList[index][12]);

	addNewFormOfProduct(productIndex);
};

$( "input" ).keyup(inputKeyupfunction);

function inputKeyupfunction() {
	if (!$(this).attr("class")) {
		return;
	};
	if ($(this).attr("id") == "shippingCost" || $(this).attr("id") == "prepaid"){
		var totalPay = parseFloat($("#totalPay").html());
		var shippingCost = $("#shippingCost").val();
		shippingCost = shippingCost ? parseFloat(shippingCost) : 0;


		$("#totalPayIncludeShip").html((totalPay + shippingCost));

		var prepaid = parseFloat($("#prepaid").val());
		prepaid = prepaid ? prepaid : 0;
		var totalWillPay = (totalPay + shippingCost) - prepaid;
		$("#totalWillPay").html(totalWillPay);

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
		shippingCost = shippingCost ? parseFloat(shippingCost) : 0;

		totalPayIncludeShip = parseFloat(shippingCost) + totalPay;

		$("#totalPayIncludeShip").html(totalPayIncludeShip);

		var prepaid = parseFloat($("#prepaid").val());
		prepaid = prepaid ? prepaid : 0;
		var totalWillPay = (totalPay + shippingCost) - prepaid;
		$("#totalWillPay").html(totalWillPay);

		$(".btnProductName_"+productIndex).html($(".productName_"+productIndex).val() + " | " + productCount + " | " + productEstimateSellingVND + " | " + turnover);

	}

};

function addDetailOrder() {
	console.log("addDetailOrder");
	var numOfColumn = 10;
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

		var productIndexInStore = document.getElementsByClassName("importSchedule_"+i)[0].value;		
		productIndexInStore = parseInt(productIndexInStore);
		console.log(productIndexInStore);
		console.log(productList[productIndexInStore]);
		prodListOrder[i].importCode = productList[productIndexInStore][2];

		if (isAppend){
			submitDataAppend.push([
				orderCode,
				$(".productCode_"+i).val(),
				prodListOrder[i].importCode,
				'=CONCATENATE(INDIRECT(ADDRESS(ROW(),3)),"_",INDIRECT(ADDRESS(ROW(),2)))',
				$(".productName_"+i).val(),
				$(".productCount_"+i).val(),
				$(".productEstimateSellingVND_"+i).val(),
				"=INDIRECT(ADDRESS(ROW(),6)) *  INDIRECT(ADDRESS(ROW(),7))",
				"=VLOOKUP(INDIRECT(ADDRESS(ROW(),4)),Product!B:U,11,FALSE)",
				"=(INDIRECT(ADDRESS(ROW(),7)) - INDIRECT(ADDRESS(ROW(),9))) * INDIRECT(ADDRESS(ROW(),6))",
				"=VLOOKUP(INDIRECT(ADDRESS(ROW(),3)),Warehouse!A:C,3,0)"
			])
		} else {
			submitDataEdit.push([
				orderCode,
				$(".productCode_"+i).val(),
				prodListOrder[i].importCode,
				'=CONCATENATE(INDIRECT(ADDRESS(ROW(),3)),"_",INDIRECT(ADDRESS(ROW(),2)))',
				$(".productName_"+i).val(),
				$(".productCount_"+i).val(),
				$(".productEstimateSellingVND_"+i).val(),
				"=INDIRECT(ADDRESS(ROW(),6)) *  INDIRECT(ADDRESS(ROW(),7))",
				"=VLOOKUP(INDIRECT(ADDRESS(ROW(),4)),Product!B:U,11,FALSE)",
				"=(INDIRECT(ADDRESS(ROW(),7)) - INDIRECT(ADDRESS(ROW(),9))) * INDIRECT(ADDRESS(ROW(),6))",
				"=VLOOKUP(INDIRECT(ADDRESS(ROW(),3)),Warehouse!A:C,3,0)"
			])			
			var orderDetailIndex = parseInt(prodListOrder[i].orderDetailIndex) + 1;
			rangeEdit.push(
				sheetOrderDetail+'!A'+orderDetailIndex+':'+ String.fromCharCode(65+numOfColumn)+orderDetailIndex			
			)
		}
	}

	for (i in prodListOrder) {
		if (prodListOrder[i].delete){
			submitDataEdit.push(["","","","","","","","","","",""])			
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


	if (submitDataAppend.length > 0){

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

	// var today = new Date();
	// var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	// var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	// var dateTime = date+' '+time;
	var dateTime = getCurrentDateTime().dateTime;//date+' '+time;

	var orderDate = dateTime;

	var totalPay = $("#totalPay").html();

	var totalPayIncludeShip = $("#totalPayIncludeShip").html();

	var otherCost = $("#otherCost").val();

	var shippingCost = $("#shippingCost").val();

	var shippingType = $("#shippingType").val();

	var prepaid = $("#prepaid").val();
	prepaid = prepaid ? prepaid : 0;

	otherCost = otherCost ? otherCost : 0;
	shippingCost = shippingCost ? shippingCost : 0;

	var shipIndex = currentOrder.shipIndex;
	var orderIndex = currentOrder.orderIndex;
	
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
		shippingStatus : shippingStatus,
		otherCost: otherCost,
		prepaid : prepaid,
		shippingType : shippingType,
		shipIndex : shipIndex
	}

	console.log(orderCode);
	// addDetailOrder();

	var dataEditOrder = [
                [orderCode,
                orderDate,
                customerName,
                customerAddress,
                "'"+customerPhone,
                "=SUMIF(OrderDetail!A:A,INDIRECT(ADDRESS(ROW(),1)),OrderDetail!H:H)",
				shippingCost,
				"=INDIRECT(ADDRESS(ROW();6)) + INDIRECT(ADDRESS(ROW();7))",
				paymentStatus,
				"=SUMIF(OrderDetail!A:A,INDIRECT(ADDRESS(ROW(),1)),OrderDetail!K:K) / COUNTIF(OrderDetail!A:A,INDIRECT(ADDRESS(ROW(),1)))",
				orderNode,
				shippingType,
				otherCost,
				prepaid
                ]
            ];
    var numOfColumn = 13;
	var sheetrange = sheetOrder+'!A'+realOrderIndex +":"+ String.fromCharCode(65+numOfColumn) + realOrderIndex;

    editOrder(dataEditOrder, sheetrange, function(){
    	addDetailOrder();
    })

})



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

	var shippingCost = $("#shippingCost").val();
	shippingCost = shippingCost ? parseFloat(shippingCost) : 0;

	var prepaid = parseFloat($("#prepaid").val());
	prepaid = prepaid ? prepaid : 0;
	var totalWillPay = (totalPay + shippingCost) - prepaid;
	$("#totalWillPay").html(totalWillPay);

	$(".btnProductName_"+cardIndex).prop('disabled', true);
	$("#collapse_"+cardIndex).collapse();
	$("#collapse_"+cardIndex).empty();
})

// addNewProduct.js

var productList = JSON.parse(localStorage.getItem("productList"));

// orderCode = localStorage.getItem("orderCode");

var currentOrder = {};
var importSLData = {};

var choosenCustomerIndex = -1;

var url = new URL(window.location.href);

var makeCopy = url.searchParams.get("makeCopy");

if (makeCopy) {
	var currentOrder = JSON.parse(localStorage.getItem("currentOrder"));

	$("#customerName").val(currentOrder.customerName);
	$("#customerAddress").val(currentOrder.customerAddress);
	$("#customerPhone").val(currentOrder.customerPhone);
	$("#shippingType").val(currentOrder.shippingType);

	try {
		currentOrder.otherInfor = JSON.parse(currentOrder.otherInfor);
		if (currentOrder.otherInfor) {
			$("#ckCTV").prop('checked', currentOrder.otherInfor.ckCTV);
		}
	} catch (e) {
	}
}

$("#customerPhone").change(function () {
	console.log("phone:", $("#customerPhone").val())
	var ghtkAuthorization = localStorage.getItem("ghtkAuthorization");
	if (ghtkAuthorization) {
		$("#customerPhoneAdditionLabel").css("color", "blue");
		$("#customerPhoneAdditionLabel").html("(đang kiểm tra....)")
		var settings = {
			"url": "https://web.giaohangtietkiem.vn/api/v1/customer/tel-report?customer_tels[]=" + $("#customerPhone").val(),
			"method": "GET",
			"timeout": 0,
			"headers": {
				"Authorization": ghtkAuthorization
			},
		};

		$.ajax(settings).done(function (response) {
			if (response.success == true) {
				if (!response.data[0]) {
					$("#customerPhoneAdditionLabel").html("(không tìm được thông tin về sđt này)")
					$("#customerPhoneAdditionLabel").css("color", "red");
				} else if (response.data[0]["isBlue"] == true) {
					$("#customerPhoneAdditionLabel").html("(không thấy có vấn đề gì với sđt)")
				} else {
					$("#customerPhoneAdditionLabel").html("(có vấn đề với sđt, gọi thanh đi!)")
					$("#customerPhoneAdditionLabel").css("color", "red");
				}
			} else {
				$("#customerPhoneAdditionLabel").html("(....kiểm tra thất bại! gọi thanh đi)")
				$("#customerPhoneAdditionLabel").css("color", "red");
			}
		});
	}
})

var triggerAfterLoad = function () {

	// console.log("triggerAfterLoad");

	$("#loadingSpin").show();

	loadProductList(function () {
		productList = JSON.parse(localStorage.getItem("productList"));

		$("#loadingSpin").hide();

		loadWarehouse(function () {
			importSLData = JSON.parse(localStorage.getItem("warehouse"));

			loadCustomerList(function (customerList) {
				if (!customerList) {
					customerList = JSON.parse(localStorage.getItem("customerList"));
				}
				// customerList = JSON.parse(localStorage.getItem("customerList"));
				var lsCusName = [];
				for (var e in customerList) {
					if (e == 0) {
						continue;
					}
					lsCusName.push({
						label: customerList[e][1],
						value: customerList[e][1],
						data: customerList[e],
						cusIndex: e
					});
				}
				// console.log(lsCusName);
				$("#customerName").autocomplete({
					source: function (request, response) {
						var results = $.ui.autocomplete.filter(lsCusName, request.term);

						response(results.slice(0, 20));
					},
					select: function (event, ui) {
						// console.log(event);
						// console.log(ui);
						// $("#customerName").val(ui.item.);
						$("#customerAddress").val(ui.item.data[2]);
						$("#customerPhone").val(ui.item.data[0]);
						$("#customerPhone").trigger("change");
						choosenCustomerIndex = ui.item.cusIndex;
						// $("#saveCustomerInfor").html("Cập nhật T.T Khách")
					}
				});

				getLatestOrderCode(function () {
					orderCode = localStorage.getItem("orderCode");
					$("#orderCode").val(orderCode);
				})

				getGhtkAccess(function (rs) {
					if (rs) {
						ghtkToken = rs["ghtkToken"];
						ghtkAuthorization = rs["ghtkAuthorization"];
						localStorage.setItem("ghtkToken", ghtkToken);
						localStorage.setItem("ghtkAuthorization", ghtkAuthorization);
					}
				})

			})

		})
	});
};


var numOfProType = 1;

$("#btnRefresh").hide();
$("#btnPrintOrder").hide();


function addNewFormOfProduct(currentIndex) {
	// console.log("addNewFormOfProduct:"+currentIndex+" vs "+ numOfProType);


	if (currentIndex != numOfProType - 1) {
		return;
	}
	// console.log("Add new form");

	e = numOfProType;
	$("#listProduct").append('<div class="card">' +
		'<div class="card-header" id="heading_"' + e + '>' +
		'<h5 class="mb-0">' +
		'<button class="btn btn-link btnShowProduct btnProductName_' + e + '" data-toggle="collapse" data-target="#collapse_' + e + '" aria-expanded="false" aria-controls="collapse_' + e + '">' +
		'Thêm hàng vào đơn hàng' +
		'</button>' +
		'</h5>' +
		'</div>' +

		'<div id="collapse_' + e + '" class="collapse" aria-labelledby="heading_' + e + '" data-parent="#listProduct">' +
		'<div class="card-body">' +
		/////////
		'<div class="form-group row">' +
		'<label for="productCode" class="col-sm-2 col-form-label">' +
		'Mã sản phẩm' +
		'<span class="fa fa-search btn btn-default btnSearchProductGeneral btnSearchProduct_' + e + '"></span>' +
		'<span class="fa fa-plus btnAddMiniProduct btnAddMiniProduct_' + e + '"></span>' +
		'</label>' +
		'<div class="col-sm-10">' +
		'<input type="text" class="form-control productCode_' + e + '" placeholder="Mã sản phẩm">' +
		// '<div style="height: 0px;width:0px; overflow:hidden;">'+
		//   '<input id="scanBarcode_'+e+'" type="file" class="btn btn-primary mb-2" accept="image/*;capture=camera" />'+
		// '</div>'+
		// '<button class="btn btn-primary mb-2 btnScan '+e+'">Quét mã vạch</button>'+

		'</div>' +
		'</div>' +

		'<div class="form-group row">' +
		'  <label for="importCode" class="col-sm-2 col-form-label">Đợt hàng</label>' +
		'    <div class="col-sm-10">' +
		'      <select class="mdb-select md-form importScheduleGeneral importSchedule_' + e + '"' +
		'        style="width: 100%">' +
		'        <option disabled>Chọn đợt hàng</option>' +
		'      </select>' +
		'    </div>' +
		'</div>' +

		'<div class="form-group row">' +
		'<label for="productName" class="col-sm-2 col-form-label">Tên sản phẩm</label>' +
		'<div class="col-sm-10">' +
		'<input type="text" class="form-control productName_' + e + '" placeholder="Tên sản phẩm" required>' +
		'</div>' +
		'</div>' +

		'<div class="form-group row">' +
		'<label for="productCount" class="col-sm-2 col-form-label">Số lượng</label>' +
		'<div class="col-sm-10">' +
		'<input type="number" class="form-control productCount_' + e + '" placeholder="0" required>' +
		'</div>' +
		'</div>' +

		'<div class="form-group row">' +
		'<label for="productEstimateSellingVND" class="col-sm-2 col-form-label">Giá bán (VND) </label>' +
		'<div class="col-sm-10">' +
		'<input type="number" class="form-control productEstimateSellingVND_' + e + '" placeholder="0 VND">' +
		'</div>' +
		'</div>' +

		'<div class="form-group column">' +
		'<label class="col-sm-2 col-form-label">' +
		'Tổng tiền:' +
		'<p class="turnover_' + e + '">0</p>' +
		'</label>' +
		'</div>' +
		///////////
		'</div>' +
		'</div>' +
		'</div>')

	numOfProType = numOfProType + 1;

	$('#collapse_' + e).on('shown.bs.collapse', function () {
		// console.log("shown:"+e);
		// $('.productCode_'+e).focus();
		// $(".btnSearchProduct_"+e).click();
		$(".btnSearchProduct_" + $(this).attr("id").split("_").pop()).click();
	})

	var totalPay = 0;
	for (var i = 0; i < numOfProType; i++) {
		totalPay = totalPay + parseFloat($(".turnover_" + i).html());
	}
	$("#totalPay").html(totalPay);

	var shippingCost = $("#shippingCost").val();
	shippingCost = shippingCost ? parseFloat(shippingCost) : 0;


	$("#totalPayIncludeShip").html((totalPay + shippingCost));

	var prepaid = parseFloat($("#prepaid").val());
	prepaid = prepaid ? prepaid : 0;
	var totalWillPay = (totalPay + shippingCost) - prepaid;
	$("#totalWillPay").html(totalWillPay);

	$("input").keyup(inputKeyupfunction);

	$(".btnSearchProduct_" + e).click(searchForm);
	$(".btnAddMiniProduct_" + e).click(addMiniProduct)


	// /////////
	// $(".btnShowProduct").mouseup(function(){
	// 	console.log("Show product");
	// 	console.log($(this).attr("class").split(" ").pop())
	// })
}

// function updateProductName(index,name) {
// 	$("#btnProductName"+index).html($())
// }

$(".btnSearchProduct_0").click(searchForm);
$(".btnAddMiniProduct_0").click(addMiniProduct)

function addMiniProduct() {
	console.log("addMiniProduct");
	var index = $(this).attr("class").split(" ").pop().split("_").pop();
	newMiniProduct(index);
}

function searchForm() {
	// console.log("searchForm:");
	var index = $(this).attr("class").split(" ").pop().split("_").pop();

	$("#myModal2 .modal-body").empty();

	for (e in productList) {
		if (e == 0) {
			continue;
		}
		if (!productList[e][0]) {
			continue;
		}

		$("#myModal2 .modal-body").append('<div class="card">' +
			// '<div class="card-header">'+
			// '<h5 class="mb-0">'+
			'<button class="btn btn-link searchProductChoose searchProductChooseIndexInStore_' + e + ' searchProductBtn_' + index + '">' +
			productList[e][0] + " (" + productList[e][2] + ") | " + productList[e][3] + " (" + productList[e][17] + ")" +
			'</button>' +
			// '</h5>'+
			// '</div>'+
			'</div>')
	}

	$("#myModal2 .searchProductChoose").click(searchProductChooseInForm);

	var filterImportInSearch = "";

	var lsImportCodeSearchProduct = "";
	for (e in importSLData) {
		// console.log(importSLData[e][0]+" "+importSLData[e][4])
		if (e == 0) continue;
		if (!importSLData[e][0]) continue;
		// if (importSLData[e][4]==0) continue;
		lsImportCodeSearchProduct += ("<option value='" + importSLData[e][0] + "'>" + importSLData[e][0] + " - " + importSLData[e][1] + "</option>")
	}

	$("#myModal2 .modal-title").html(
		'<input type="text" class="form-control searchInputProdText searchInputProduct_' + index + '" placeholder="Tìm kiếm">' +
		// '<div class="btn btn-default">'+
		'<select class="mdb-select md-form importSearchProductFilter" style="width:100%">' +
		'<option value="-1">Hàng có sẵn</option>' +
		lsImportCodeSearchProduct +
		'<option value="-2">Hàng đã bán hết</option>' +
		'<option value="-3" selected>Toàn bộ</option>' +
		'</select>'
		// '</div>'
	)

	$("#myModal2 .importSearchProductFilter").change(function () {
		$("#myModal2 .searchInputProdText").val("");
		var index = $("#myModal2 .searchInputProdText").attr("class").split(" ").pop().split("_").pop();

		filterInSearchForm(index, "");
	})

	$("#myModal2 .modal-body").css('max-height', '300px');
	$("#myModal2 .modal-body").css('overflow', 'scroll');

	$('#myModal2').modal('show');
	$("#myModal2 .searchInputProduct_" + index + "").keyup(function () {
		var index = $(this).attr("class").split(" ").pop().split("_").pop();
		filterInSearchForm(index, $(this).val());
	})

}

function searchProductChooseInForm() {
	var lsClass = $(this).attr("class").split(" ");

	var index = lsClass.pop().split("_").pop();
	var indexInStore = lsClass.pop().split("_").pop();
	// console.log(lsClass);
	// console.log("searchProductChoose:"+index+" "+indexInStore);

	var productIndex = parseInt(index);

	triggerNextProcessNewOrder(productIndex, "", indexInStore);
	$('#myModal2').modal('hide');
}

function filterInSearchForm(index, searchText) {
	$("#myModal2  .modal-body").empty();

	for (e in productList) {
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
		// importCode = parseInt(importCode);
		// console.log("Dot hang:"+importCode+" ");
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

		$("#myModal2 .modal-body").append('<div class="card">' +
			// '<div class="card-header">'+
			// '<h5 class="mb-0">'+
			'<button class="btn btn-link searchProductChoose searchProductChooseIndexInStore_' + e + ' searchProductBtn_' + index + '">' +
			productList[e][0] + " (" + productList[e][2] + ") | " + productList[e][3] + " (" + productList[e][17] + ")" +
			'</button>' +
			// '</h5>'+
			// '</div>'+
			'</div>')
	}

	$("#myModal2 .searchProductChoose").click(searchProductChooseInForm);
}

function triggerNextProcessNewOrder(productIndex, productCode, productIndexInStore) {
	var index = -1;
	var importCode = 0;
	if (productIndexInStore) {
		index = parseInt(productIndexInStore);
		productCode = productList[index][0];
		$(".productCode_" + productIndex).val(productCode);
		$(".importSchedule_" + productIndex).empty();
		importCode = productList[index][2];
		// if (lsImportCode.length > 1) {
		for (var e in importSLData) {
			if (importSLData[e][0] == importCode) {
				$(".importSchedule_" + productIndex).append("<option selected value='" + index + "'>" + importSLData[e][0] + " - " + importSLData[e][1] + "</option>")
				continue;
			}
		}
	} else {
		var lsImportCode = [];
		for (var e in productList) {
			if (productList[e][0] == productCode) {
				index = e;
				importCode = productList[e][2];
				lsImportCode.push({
					productIndexInStore: e,
					importCode: productList[e][2]
				});
			}
		}
		$(".importSchedule_" + productIndex).empty();
		// if (lsImportCode.length > 1) {
		for (var e in importSLData) {
			if (importSLData[e][0] == importCode) {
				$(".importSchedule_" + productIndex).append("<option selected value='" + index + "'>" + importSLData[e][0] + " - " + importSLData[e][1] + "</option>")
				continue;
			}
			for (var e1 in lsImportCode) {
				if (importSLData[e][0] == lsImportCode[e1].importCode) {
					$(".importSchedule_" + productIndex).append("<option value='" + lsImportCode[e1].productIndexInStore + "'>" + importSLData[e][0] + " - " + importSLData[e][1] + "</option>")
				}
			}
		}
		// }
		$(".importScheduleGeneral").change(function () {
			var productIndex = $(this).attr("class").split(" ").pop().split("_").pop();
			productIndex = parseInt(productIndex);
			productIndexInStore = document.getElementsByClassName($(this).attr("class"))[0].value;
			// console.log(productIndex+" "+productIndexInStore);
			triggerNextProcessNewOrder(productIndex, "", productIndexInStore);
		})
	}
	if (index == -1) {
		// $("#modelContent").html("Không tìm thấy mặt hàng");
		// $('#myModal').modal('toggle');
		return;
	}

	$(".productName_" + productIndex).val(productList[index][3]);
	$(".productCount_" + productIndex).val(1);

	var productSellPrice = productList[index][12];
	if ($("#ckCTV").is(":checked")) {
		productSellPrice = productList[index][20];
	}

	$(".productEstimateSellingVND_" + productIndex).val(productSellPrice);

	// $(".btnProductName_"+productIndex).html(productList[index][3]);
	$(".turnover_" + productIndex).html(productSellPrice);

	totalPay = 0;
	for (var i = 0; i < numOfProType; i++) {
		totalPay = totalPay + parseFloat($(".turnover_" + i).html());
	}
	$("#totalPay").html(totalPay);
	var shippingCost = $("#shippingCost").val();
	shippingCost = shippingCost ? parseFloat(shippingCost) : 0;


	totalPayIncludeShip = (shippingCost) + totalPay;

	$("#totalPayIncludeShip").html(totalPayIncludeShip);

	var prepaid = parseFloat($("#prepaid").val());
	prepaid = prepaid ? prepaid : 0;
	var totalWillPay = (totalPay + shippingCost) - prepaid;
	$("#totalWillPay").html(totalWillPay);

	$(".btnProductName_" + productIndex).html(productList[index][3] + " | " + 1 + " | " + productSellPrice + " | " + productSellPrice);

	addNewFormOfProduct(productIndex);
};

$("input").keyup(inputKeyupfunction);

function inputKeyupfunction() {
	if (!$(this).attr("class")) {
		return;
	};
	if ($(this).attr("id") == "shippingCost" || $(this).attr("id") == "prepaid") {
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
	if (className[0] == "productCode") {
		var productIndex = parseInt(className[1]);
		var productCode = $(this).val();

		// console.log("this is productCode:"+productCode)

		triggerNextProcessNewOrder(productIndex, productCode);
	}

	if (className[0] == "productCount" || className[0] == "productEstimateSellingVND") {
		var productIndex = parseInt(className[1]);
		var productCount = parseInt($(".productCount_" + productIndex).val());
		var productEstimateSellingVND = parseFloat($(".productEstimateSellingVND_" + productIndex).val());
		productCount = productCount ? productCount : 0;
		productEstimateSellingVND = productEstimateSellingVND ? productEstimateSellingVND : 0;
		var turnover = productCount * productEstimateSellingVND;
		$(".turnover_" + productIndex).html(turnover);

		totalPay = 0;
		for (var i = 0; i < numOfProType; i++) {
			totalPay = totalPay + parseFloat($(".turnover_" + i).html());
		}
		$("#totalPay").html(totalPay);

		var shippingCost = $("#shippingCost").val();
		shippingCost = shippingCost ? parseFloat(shippingCost) : 0;

		totalPayIncludeShip = shippingCost + totalPay;

		$("#totalPayIncludeShip").html(totalPayIncludeShip);

		var prepaid = parseFloat($("#prepaid").val());
		prepaid = prepaid ? prepaid : 0;
		var totalWillPay = (totalPay + shippingCost) - prepaid;
		$("#totalWillPay").html(totalWillPay);

		$(".btnProductName_" + productIndex).html($(".productName_" + productIndex).val() + " | " + productCount + " | " + productEstimateSellingVND + " | " + turnover);

	}

};

function addDetailOrder() {

	//    console.log(`${result.updatedCells} cells updated.`);
	// $("#modelContent").html("Đã lưu đơn hàng");
	// $('#myModal').modal('toggle');
	var prodListOrder = {};
	submitData = [];
	for (var i = 0; i < numOfProType; i++) {
		// prodListOrder[i] = {};
		if (!$(".productCode_" + i).val()) {
			continue;
		}
		prodListOrder[i] = {}
		prodListOrder[i].productCode = $(".productCode_" + i).val();
		prodListOrder[i].productName = $(".productName_" + i).val();
		prodListOrder[i].productCount = $(".productCount_" + i).val();
		prodListOrder[i].productEstimateSellingVND = $(".productEstimateSellingVND_" + i).val();
		prodListOrder[i].turnover = $(".turnover_" + i).html();

		var productIndexInStore = document.getElementsByClassName("importSchedule_" + i)[0].value;
		productIndexInStore = parseInt(productIndexInStore);
		prodListOrder[i].importCode = productList[productIndexInStore][2];
		prodListOrder[i].image = productList[productIndexInStore][2];
		prodListOrder[i].productImage = productList[productIndexInStore][19];
		prodListOrder[i].productWeight = productList[productIndexInStore][6];

		submitData.push([
			orderCode,
			$(".productCode_" + i).val(),
			prodListOrder[i].importCode,
			'=CONCATENATE(INDIRECT(ADDRESS(ROW();3));"_";INDIRECT(ADDRESS(ROW();2)))',
			$(".productName_" + i).val(),
			$(".productCount_" + i).val(),
			$(".productEstimateSellingVND_" + i).val(),
			"=INDIRECT(ADDRESS(ROW();6)) *  INDIRECT(ADDRESS(ROW();7))",
			"=VLOOKUP(INDIRECT(ADDRESS(ROW();4));Product!B:U;11;FALSE)",
			"=(INDIRECT(ADDRESS(ROW();7)) - INDIRECT(ADDRESS(ROW();9))) * INDIRECT(ADDRESS(ROW();6))",
			"=VLOOKUP(INDIRECT(ADDRESS(ROW();3));Warehouse!A:C;3;0)",
			'=IF(IFERROR(VLOOKUP(INDIRECT(ADDRESS(ROW();1)); IMPORTRANGE("' + shippingSheet + '";"Shipping!A:A");1;false);"")="";0;1) * INDIRECT(ADDRESS(ROW();6))'
		])
	}

	currentOrder.prodListOrder = prodListOrder;
	localStorage.setItem("currentOrder", JSON.stringify(currentOrder));

	$("#loading-text").html("Thêm các sản phẩm vào đơn hàng");

	appendOrderDetail(submitData, finishOrder);
}

function finishOrder() {
	// $("#addNewOrder").hide();
	// $("#btnRefresh").show();
	// $("#btnPrintOrder").show();
	// $("#modelContent").html("Đã lưu đơn hàng");

	// $("#loadingSpin").hide();

	// $('#myModal').modal('toggle');
	saveCustomerInforFn(function () {
		console.log("saveCustomerInfor")
		localStorage.setItem("currentOrder", JSON.stringify(currentOrder));
		window.location = "showorder.html";
	})
}

$("#updateAddress").click(function () {
	triggerAutocompleteViettelpost($("#customerAddress").val(), function (addrData) {
		if (addrData["OTHER"] && addrData["PROVINCE_NAME"] && addrData["DISTRICT_NAME"]) {
			var addr = addrData["OTHER"] + "," + addrData["WARDS_NAME"] + "," + addrData["DISTRICT_NAME"] + "," + addrData["PROVINCE_NAME"];
			$("#customerAddress").val(addr);
		}
	})
})

$("#downCustomerInfor").click(function () {
	var orderCopy = JSON.parse(localStorage.getItem("orderCopy"));
	$("#customerName").val(orderCopy.customerName);
	$("#customerAddress").val(orderCopy.customerAddress);
	$("#customerPhone").val(orderCopy.customerPhone);
})

$("#reloadOrderCode").click(function () {
	getLatestOrderCode(function () {
		orderCode = localStorage.getItem("orderCode");
		$("#orderCode").val(orderCode);
	})
})

$("#addNewOrder").click(function () {
	//orderCode
	var ckInput = validateInputData();

	if (!ckInput) {
		return;
	}
	
	$("#addNewOrder").hide();
	$("#loadingSpin").show();

	orderCode = $("#orderCode").val()

	var customerName = $("#customerName").val();
	var customerAddress = $("#customerAddress").val();
	var customerPhone = $("#customerPhone").val();
	// var today = new Date();
	// var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	// var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = getCurrentDateTime().dateTime;//date+' '+time;

	var orderDate = dateTime;

	var totalPay = $("#totalPay").html();

	var totalPayIncludeShip = $("#totalPayIncludeShip").html();

	var shippingCost = $("#shippingCost").val();

	var orderNode = $("#orderNode").val();
	var otherCost = $("#otherCost").val();

	var shippingType = $("#shippingType").val();

	var otherInfor = {
		isFreeShip: $("#isFreeShip").is(":checked"),
		ckCTV: $("#ckCTV").is(":checked")
	}

	var prepaid = $("#prepaid").val();
	prepaid = prepaid ? prepaid : 0;

	otherCost = otherCost ? otherCost : 0;
	shippingCost = shippingCost ? shippingCost : 0;

	currentOrder = {
		orderCode: orderCode,
		customerName: customerName,
		customerAddress: customerAddress,
		customerPhone: customerPhone,
		shippingCost: shippingCost,
		totalPay: totalPay,
		orderDate: orderDate,
		totalPayIncludeShip: totalPayIncludeShip,
		orderNode: orderNode,
		otherCost: otherCost,
		prepaid: prepaid,
		shippingType: shippingType,
		otherInfor: otherInfor
	}

	var submitOrderData = [
		[orderCode,
			orderDate,
			customerName,
			customerAddress,
			"'" + customerPhone,
			"=SUMIF(OrderDetail!A:A;INDIRECT(ADDRESS(ROW();1));OrderDetail!H:H)",
			shippingCost,
			"=INDIRECT(ADDRESS(ROW();6)) + INDIRECT(ADDRESS(ROW();7))",
			"ORDERED",
			"=SUMIF(OrderDetail!A:A;INDIRECT(ADDRESS(ROW();1));OrderDetail!K:K) / COUNTIF(OrderDetail!A:A;INDIRECT(ADDRESS(ROW();1)))",
			orderNode,
			shippingType,
			JSON.stringify(otherInfor),
			prepaid,
			0,
			'=IF(IFERROR(VLOOKUP(INDIRECT(ADDRESS(ROW();1)); IMPORTRANGE("' + shippingSheet + '";"Shipping!A:A");1;false);"")="";0;1)'
		]
	]
	$("#loading-text").html("Thêm thông tin chung đơn hàng");

	appendOrder(submitOrderData, addDetailOrder);
})

$("#btnRefresh").click(function () {
	$("#loadingSpin").show();
	getLatestOrderCode(function () {
		$("#loadingSpin").hide();
		location.reload();
		window.scrollTo(0, 0);
	})
});

$("#btnPrintOrder").click(function () {

	localStorage.setItem("currentOrder", JSON.stringify(currentOrder));

	// var win = window.open("showorder.html", '_blank');
	//  	win.focus();
	window.location = "showorder.html";
	// window.print();
})

function saveCustomerInforFn(callback) {
	$("#loadingSpin").show();
	var data = [
		["'" + $("#customerPhone").val(), $("#customerName").val(), $("#customerAddress").val()]
	]
	var indexColumnOfAllData = 3;
	var range = 'Customer!A:' + String.fromCharCode(65 + indexColumnOfAllData);

	var realCusIndex = -1;
	if (choosenCustomerIndex > -1) {
		// console.log("choosenCustomerIndex:"+(parseInt(choosenCustomerIndex)+1));
		realCusIndex = (parseInt(choosenCustomerIndex) + 1);
		// console.log("realCusIndex:"+realCusIndex);
		range = 'Customer!A' + realCusIndex + ":" + String.fromCharCode(65 + indexColumnOfAllData) + realCusIndex;
		// console.log(range);
		editCommonData(customerSheet, data, range, function () {
			$("#loadingSpin").hide();
			callback();
		})
	} else {
		addCommonData(customerSheet, data, range, function () {
			$("#loadingSpin").hide();
			callback();
		})
	}
}

function validateInputData() {
	$("#myModal2 .modal-body").empty();

	var orderCode = $("#orderCode").val()

	var customerName = $("#customerName").val();
	var warningContent = undefined;
	if (!orderCode) {
		warningContent = "Không có mã đơn hàng!"
	}
	if (!customerName) {
		warningContent = "Không có tên khách hàng kìa!"
	}
	if (warningContent) {
		$("#myModal2 .modal-title").html("Cảnh báo")

		$("#myModal2 .modal-body").append('<div class="card">' +
			warningContent +
			'</div>')

		$('#myModal2').modal('show');
		return false;
	} else {
		return true;
	}
}

// $("#saveCustomerInfor").click(function(){
// 	saveCustomerInforFn(function(){
// 		console.log("saveCustomerInfor")
// 	})
// })

// $(".click-to-fix-address").click(function(){

//   $("#modelContent").html(content);
//   $("#modalYes").click(function(){
//   })
//   $('#myModal').modal('toggle');
//   $(".downloadProds").click(function(){
//      downloadFile("hang.csv", downloadContent);
//   })
//   $(".viewProds").click(function(){
//     var ls1 = downloadContent.split("\n");
//     var ls2 = [];
//     for (s in ls1) {
//       ls2.push(ls1[s].split(","));
//     }
//     console.log(ls2);
//     localStorage.setItem("tmp",JSON.stringify(ls2));
//     window.location = "../manager/viewtmp.html";

//   })
// })


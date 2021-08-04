
$("#footerInclude").load("../common/footer.html");

var currentOrder = JSON.parse(localStorage.getItem("currentOrder"));
var pickList = JSON.parse(localStorage.getItem("viettelPostPickList"));
var viettelpostToken = localStorage.getItem("viettelpostToken");

var sheetOrder = "Order";


var userRole = JSON.parse(localStorage.getItem("userRole"));

if (!currentOrder.otherInfor){
	currentOrder.otherInfor = {}
}

try{
	currentOrder.otherInfor = JSON.parse(currentOrder.otherInfor);
}catch(e){

}

// var ghtkUrl="services.giaohangtietkiem.vn"
// $("#textareaCopy").hide();
// console.log("ghtkUrl:"+ghtkUrl)

var dataOrder = {};
dataOrder.order={};


// var triggerAfterLoad = function(){
	
// 	// console.log("triggerAfterLoad");

// 	loadCustomerList(function(){
// 		customerList = JSON.parse(localStorage.getItem("customerList"));
// 		var lsCusName = [];
// 		for (var e in customerList) {
// 			if (e==0) {
// 				continue;
// 			}
// 			lsCusName.push({
// 				label : customerList[e][1],
// 				value : customerList[e][1],
// 				data : customerList[e],
// 				cusIndex : e
// 			});
// 		}
// 		// console.log(lsCusName);
// 		$( "#customerName" ).autocomplete({
// 			source: function(request, response) {
// 		        var results = $.ui.autocomplete.filter(lsCusName, request.term);

// 		        response(results.slice(0, 10));
// 		    },
// 			select: function( event, ui ) {
// 				// console.log(event);
// 				console.log(ui);
// 				// $("#customerName").val(ui.item.);
// 				$("#customerAddress").html(ui.item.data[2]);
// 				$("#customerPhone").html(ui.item.data[0]);

// 				currentOrder.customerAddress = ui.item.data[2];
// 				currentOrder.customerPhone = ui.item.data[0];
// 			}
// 		});
// 	})
// };

function loadPickList() {
	$("#loadingSpin").show();
	viettelPostGetPickAddress(function(rs){
		// console.log(rs);
		pickList = rs;

		console.log(rs);
		var readAddrStepByStep = function(index) {
			if (index < pickList.length) {
				viettelPostAddressObjToAddressString(pickList[index],function(addrObj){
					pickList[index] = addrObj;
					readAddrStepByStep(index+1);
				});
			} else {
				$("#loadingSpin").hide();
				console.log(pickList);
				localStorage.setItem("viettelPostPickList",JSON.stringify(pickList));
				var pickListHtml = '';
				for (e in pickList){
					pickListHtml += '<option value="'+e+'">'+pickList[e].name+'-'+pickList[e].province+'</option>'
				}
				$("#pickList").html(pickListHtml);
			}
		}
		readAddrStepByStep(0)
	}) 	
}

if (!pickList) {
	loadPickList();
} else {
	var pickListHtml = '';
	for (e in pickList){
		pickListHtml += '<option value="'+e+'">'+pickList[e].name+'-'+pickList[e].province+'</option>'
	}
	$("#pickList").html(pickListHtml);
}

// console.log(pickList);
// console.log(currentOrder);

$("#orderCode").html(currentOrder.orderCode);
$("#customerName").val(currentOrder.customerName);
$("#customerNameShow").html(currentOrder.customerName);

$("#customerName").change(function(){
	$("#customerNameShow").html($("#customerName").val());
})

$("#orderDate").html(currentOrder.orderDate);

var address = currentOrder.customerAddress.replace(/[|&;$%@"<>()+,]/g, "").trim().replace(" ","+");

$("#customerAddress").html(
	'<a href="http://maps.google.com/maps?q='+address+'">'+currentOrder.customerAddress+'</a>'
);



$("#customerPhone").html(
	'<a href="tel:'+currentOrder.customerPhone+'">'+currentOrder.customerPhone+'</a>'
);

$("#totalPay").val(currentOrder.totalPay);

$("#shippingCost").html(currentOrder.shippingCost);

$("#totalPayIncludeShip").html(currentOrder.totalPayIncludeShip);

$("#orderNode").html((currentOrder.orderNode ? currentOrder.orderNode : ""));

$("#orderNode").height( $("#orderNode")[0].scrollHeight );


$("#shippingStatus").html("Giao hàng:"+(currentOrder.shippingStatus == "SHIPPED" ? "Đã giao" : "Chưa giao hàng"));

$("#paymentStatus").html((currentOrder.paymentStatus == "PAID" ? "Khách đã thanh toán đủ" : "Khách chưa thanh toán"));

$("#otherCost").html(currentOrder.otherCost);

$("#prepaid").html(currentOrder.prepaid);

$("#orderNodeGHTK").val("Hàng dễ vỡ, vui lòng nhẹ tay, không cho khách mở hàng")

var totalPay = parseFloat(currentOrder.totalPay);

$("#insuranceFee").html(totalPay > 3000 ? (totalPay*1000)*0.5/100 : 0);

$("#totalPay").change(function(){
	var totalPay = parseFloat($("#totalPay").val());
	currentOrder.totalPay = totalPay;
	$("#insuranceFee").html(totalPay > 3000 ? (totalPay*1000)*0.5/100 : 0);
})

if (currentOrder.otherInfor && currentOrder.otherInfor.isFreeShip!=undefined) {
	$("#isFreeShip").prop('checked', currentOrder.otherInfor.isFreeShip);
    $("#shopPayShipAns").html(currentOrder.otherInfor.isFreeShip==true ? "Có" : "Không");

} else {
	currentOrder.otherInfor = {
		isFreeShip : false
	}
}

currentOrder.willpay = parseFloat(currentOrder.totalPayIncludeShip) - parseFloat(currentOrder.prepaid ? currentOrder.prepaid : 0);

if (currentOrder.shippingType == "POST_COD") {
	// $("#collectMoneyType").val("1").change();
	$("#collectMoneyType").prop("selectedIndex", 1);

	$("#shippingCost").html("Khách thanh toán với bên vận chuyển");
	$("#titleWillpay").html("Thu COD:");
	$("#shippingType").html("Ship Dịch Vụ Vận Chuyển có COD");
	$("#codType").html("Thu hộ tiền");
} else if (currentOrder.shippingType == "POST_NO_COD") {

	$("#collectMoneyType").prop("selectedIndex", 3);
	
	$("#shippingCost").html("Khách thanh toán với bên vận chuyển");
	$("#shippingType").html("Ship Dịch Vụ Vận Chuyển không COD");
	currentOrder.willpay = 0;
	$("#codType").html("Không thu hộ tiền");
}

$("#willpay").html(currentOrder.willpay);


if (!currentOrder.shippingCost) {
	$(".shippingCost").hide();
}

var prodListOrder = currentOrder.prodListOrder;

// console.log(prodListOrder.size);

// console.log(prodListOrder)

// console.log($("#portfolio"))
var count = 0;
var totalWeight = 0.0;
for (i in prodListOrder){
	if (prodListOrder[i].delete) {
		continue;
	}
	var prodWeight = prodListOrder[i].productWeight;
	prodWeight = prodWeight ? prodWeight : 0;
	$("#lsTable").append("<tr>"+
    "<td class='showImage borderMustard image_"+i+"'>"+(parseInt(i)+1)+"</td>"+
    // "<td>"+prodListOrder[i].productName+"</td>"+
    "<td>"+
    	"<input class='productName prodName_"+i+"' value='"+prodListOrder[i].productName+"'></input>"+
    "</td>"+
    "<td class='prodQuantity_"+i+"'>"+prodListOrder[i].productCount+"</td>"+
    "<td class='prodPrice_"+i+"'>"+prodListOrder[i].productEstimateSellingVND+"</td>"+
	"<td>"+
    	"<input class='productWeight prodWeight_"+i+"' value='"+prodWeight+"'></input>"+
	"</td>"+
  "</tr>")
	totalWeight += parseFloat(prodListOrder[i].productWeight)*parseFloat(prodListOrder[i].productCount);
	count+=parseFloat(prodListOrder[i].productCount);
}

// var avgWeight = (Math.round((totalWeight / parseFloat(count)) * 1000) / 1000)*1000;
if (!totalWeight) {
	totalWeight = 0;
	// avgWeight = 0;
}
$("#totalWeight").html(Math.round(totalWeight*1000));
$("#prodList").html("???????????");
// $("#avgWeight").val(avgWeight);

// $("#avgWeight").change(function(){
// 	var tw = parseFloat($("#avgWeight").val())*count;
// 	$("#totalWeight").val(tw);
// 	caluclateTransportFeeFn(true);//does not show loading
// })

var customerAddressObj = {}

addressChecking(currentOrder.customerAddress, function(obj) {
	customerAddressObj = obj;
	// console.log(customerAddressObj);
	$("#addressChecking").html(" > Địa  đã chuẩn :)")
	caluclateTransportFeeFn(true);
})

$(".productWeight").change(function(){
	// console.log("productWeight change")
	tw = 0;
	for (i in prodListOrder){
		if (prodListOrder[i].delete) {
			continue;
		}
		prodListOrder[i].productWeight = parseFloat($(".prodWeight_"+i).val());
		tw += prodListOrder[i].productWeight * parseFloat(prodListOrder[i].productCount);

	}
	$("#totalWeight").html(Math.round(tw * 1000));
	caluclateTransportFeeFn(true);
})

// $("#totalWeight").change(function(){
// 	// console.log("totalWeight change")
// 	// var avgw = parseFloat($("#totalWeight").val()) / count;
// 	// $("#avgWeight").val(avgw);
// 	caluclateTransportFeeFn(true);//does not show loading
// })

$(".showImage").click(function(){
	var index = $(this).attr("class").split(" ").pop().split("_").pop();
	index = parseInt(index);
	// console.log("AA"+index);
	$("#myModal .modal-body").html('<img style="width:100%" src="'+prodListOrder[index].productImage+'" />')
    $('#myModal').modal('toggle');
})

$("#updateAddress").click(function(){
	triggerAutocompleteViettelpost(currentOrder.customerAddress,function(addrData){
		console.log(addrData);
		
		customerAddressObj = addrData;
		
		if (addrData["OTHER"] && addrData["PROVINCE_NAME"] && addrData["DISTRICT_NAME"]) {
			var addr = addrData["OTHER"]+","+addrData["WARDS_NAME"]+","+addrData["DISTRICT_NAME"]+","+addrData["PROVINCE_NAME"];
			currentOrder.customerAddress = addr;

			var address = currentOrder.customerAddress.replace(/[|&;$%@"<>()+,]/g, "").trim().replace(" ","+");

			$("#customerAddress").html(
				'<a href="http://maps.google.com/maps?q='+address+'">'+currentOrder.customerAddress+'</a>'
			);

			$("#addressChecking").html("")

			loadAddressIntoUI();
			saveAddressAsManager();
			saveAddressAsShipper();
			caluclateTransportFeeFn(true);//does not show loading
		}
	})
})

$('#isFreeShip').click(function(){
    if($(this).is(':checked')){
        $("#shopPayShipAns").html("Có");
        currentOrder.otherInfor.isFreeShip = true;
    } else {
        $("#shopPayShipAns").html("Không");
        currentOrder.otherInfor.isFreeShip = false;
    }
});

$('#isShopBringPkToPost').click(function(){
    if($(this).is(':checked')){
        $("#shopBringPkToPostAns").html("Có");
        dataOrder.order.pick_option = "post";
    } else {
        $("#shopBringPkToPostAns").html("Không");
        dataOrder.order.pick_option = "cod";
    }
});

$("#pickLoadForce").click(function(){
	loadPickList();
})

function loadAddressIntoUI(){
	var aix = strToAddr(currentOrder.customerAddress);
	$("#province").html(aix.province);
	$("#district").html(aix.district);
	$("#ward").html(aix.ward);	
	$("#address").html(aix.address);
}

loadAddressIntoUI();//load at beginning

function jsonToHtml(data) {
    if (!data) {
        return "<div/>"
    }
    // console.log("jsonToHtml");
    // console.log(data);
    var rs1 = JSON.stringify(data, null, "\t");
    rs1 = rs1.split("\t").join("&nbsp;");
    rs1 = rs1.split("\n").join("<br/>");
    return rs1;
}

$('.datetimepicker').daterangepicker({
	timePicker: true,
    locale: {
      format: 'DD-MM-YYYY hh:mm:ss'
    },
    singleDatePicker: true,
    timePicker24Hour: true
  }, function(start, end, label) {
  	// console.log(start.format('YYYY-MM-DD hh:mm:ss'));
  	dataOrder.pick_date=start.format('YYYY-MM-DD hh:mm:ss');
  });

// caluclateTransportFeeFn(true);//does not show loading

$("#pickList").change(function(){
	caluclateTransportFeeFn(true);//does not show loading
})

// $("#transportType").change(function(){
// 	caluclateTransportFeeFn(true);//does not show loading	
// })

function caluclateTransportFeeFn(notloadShow){//true mean does not show
	$("#transportFee").html($("#transportFee").html()+" - Đang tính...");
	var pickIndex = $("#pickList").val();
	// var dataFee = {};
	// dataFee.pick_province = pickList[pickIndex].province;
	// dataFee.pick_district = pickList[pickIndex].district;
	
	// dataFee.province = $("#province").html();
	// dataFee.district = $("#district").html();
	// dataFee.address = $("#address").html();
	// dataFee.weight = parseInt($("#totalWeight").html());
	// dataFee.value = currentOrder.totalPay;
	// dataFee.transport = $("#transportType").val();

	var pick_money = 0;
	if (currentOrder.shippingType == "POST_COD") {
		pick_money=currentOrder.willpay*1000;		
	}

	var feeObj = {
	  "RECEIVER_PROVINCE":customerAddressObj["RECEIVER_PROVINCE"],
	  "RECEIVER_DISTRICT":customerAddressObj["RECEIVER_DISTRICT"],
  	  "SENDER_PROVINCE":pickList[pickIndex].provinceId,
	  "SENDER_DISTRICT":pickList[pickIndex].districtId,
  	  "PRODUCT_TYPE":"HH",
	  "PRODUCT_WEIGHT":parseInt($("#totalWeight").html()),
	  "PRODUCT_PRICE":currentOrder.totalPay,
	  "MONEY_COLLECTION":pick_money,
  	  "TYPE" :1
	}
	// console.log(feeObj);

	if (!notloadShow) {
		$("#loadingSpin").show();
		$("#loading-text").html();
	}
	calculateTransportFeeAPIViettelPost(feeObj, function(feeLs){
		console.log(feeLs);
		var feeCt = "";
		for (e in feeLs) {
			feeCt = feeCt + "<option value='"+feeLs[e]["MA_DV_CHINH"]+"'>"
				+feeLs[e]["MA_DV_CHINH"]+"-"+feeLs[e]["GIA_CUOC"]+"-"+feeLs[e]["TEN_DICHVU"]+"-"+feeLs[e]["THOI_GIAN"]
				+"</option>"
		}
		$("#transportType").html(feeCt);
		$("#loadingSpin").hide();
	});
}
  
$("#calculateFeeLoadForce").click(function(){
	caluclateTransportFeeDetailFn();
})

function caluclateTransportFeeDetailFn(){
	var pick_money = 0;
	if (currentOrder.shippingType == "POST_COD") {
		pick_money=currentOrder.willpay*1000;		
	}
	var pickIndex = $("#pickList").val();

	var feeObj = {
		"PRODUCT_WEIGHT":parseInt($("#totalWeight").html()),
		"PRODUCT_PRICE":currentOrder.totalPay,
		"MONEY_COLLECTION":pick_money,
		"ORDER_SERVICE_ADD":"",
		"ORDER_SERVICE":$("#transportType").val(),
		"RECEIVER_PROVINCE":customerAddressObj["RECEIVER_PROVINCE"],
		"RECEIVER_DISTRICT":customerAddressObj["RECEIVER_DISTRICT"],
		"SENDER_PROVINCE":pickList[pickIndex].provinceId,
		"SENDER_DISTRICT":pickList[pickIndex].districtId,
		"PRODUCT_TYPE":"HH",
		"NATIONAL_TYPE":1
	}
	// console.log(feeObj);

	calculateTransportFeeAPIViettelPostDetail(feeObj, function(res){
		console.log(res);
	})
}

function saveAddressAsManager(){
	if (userRole!="manager"){
		return;
	}
	var realOrderIndex = parseInt(currentOrder.orderIndex)+1;
	var dataEditOrder = [
                [
                currentOrder.customerAddress
                ]
            ];
    // console.log(dataEditOrder);
    // console.log(otherInfor);

	var sheetrange = sheetOrder+'!D'+realOrderIndex +":D" + realOrderIndex;

	$("#loading-text").html("Cập nhật địa chỉ lên hệ thống");
	$("#loadingSpin").show();
    editOrder(dataEditOrder, sheetrange, function(){
    	$("#loadingSpin").hide();
    })
}

function saveOtherInforAsManager(){
	if (userRole!="manager"){
		return;
	}

	var realOrderIndex = parseInt(currentOrder.orderIndex)+1;
	var dataEditOrder = [
                [
                JSON.stringify(currentOrder.otherInfor)
                ]
            ];
    // console.log(dataEditOrder);
    // console.log(otherInfor);

	var sheetrange = sheetOrder+'!M'+realOrderIndex +":M" + realOrderIndex;

	$("#loading-text").html("Cập nhật thông tin chung");
	$("#loadingSpin").show();
    editOrder(dataEditOrder, sheetrange, function(){
    	$("#loadingSpin").hide();
    })
}

function saveOtherInforAsShipper(){
	if (currentOrder.shipIndex==-1 || currentOrder.shipIndex==undefined) {
		return;
	}

	var actualShipIndex = parseInt(currentOrder.shipIndex) + 1;

	sheetrange = 'Shipping!D'+actualShipIndex+':D'+actualShipIndex;
	var orderCopy = JSON.parse(JSON.stringify(currentOrder))
	for (e in orderCopy.prodListOrder) {
		orderCopy.prodListOrder[e].profit="";
		orderCopy.prodListOrder[e].totalPay="";
		orderCopy.prodListOrder[e].turnover="";
	}
	dataUpdateShipping = [
		[
			JSON.stringify(orderCopy)
		]
	];

	// console.log(dataUpdateShipping);

	$("#loadingSpin").show();
	$("#loading-text").html("Cập nhật thông tin vận đơn của shipper");

	updateShipping(dataUpdateShipping, sheetrange, function(){
		$("#loadingSpin").hide();
	},function(){
		console.log("Something wrong");
	})
}

function saveAddressAsShipper(){
	if (currentOrder.shipIndex==-1 || currentOrder.shipIndex==undefined) {
		return;
	}

	var actualShipIndex = parseInt(currentOrder.shipIndex) + 1;

	sheetrange = 'Shipping!B'+actualShipIndex+':B'+actualShipIndex;

	dataUpdateShipping = [
	[currentOrder.customerAddress]
	];

	// console.log(dataUpdateShipping);

	$("#loadingSpin").show();
	$("#loading-text").html("Cập nhật địa chỉ của shipper");

	updateShipping(dataUpdateShipping, sheetrange, function(){
		$("#loadingSpin").hide();
	},function(){
		console.log("Something wrong");
	})
}

// 

function showOrderPush(){
	if (currentOrder.otherInfor.order) {
		$("#showOrderPush").html("<h4>Thông tin vận đơn:</h4>"+jsonToHtml(currentOrder.otherInfor.order)+"<hr/>");
	}
}

showOrderPush();

// function prepareDataOrder(){
// 	var pickIndex = $("#pickList").val();
// 	// console.log(pickIndex);
// 	dataOrder.order.pick_address = pickList[pickIndex].address;
// 	dataOrder.order.pick_province = pickList[pickIndex].province;
// 	dataOrder.order.pick_district = pickList[pickIndex].district;
// 	dataOrder.order.pick_ward = pickList[pickIndex].ward;
// 	dataOrder.order.pick_name = pickList[pickIndex].name;
// 	dataOrder.order.pick_tel = pickList[pickIndex].tel;

// 	dataOrder.order.province = $("#province").html();
// 	dataOrder.order.district = $("#district").html();
// 	dataOrder.order.ward = $("#ward").html();
// 	dataOrder.order.address = $("#address").html();
// 	dataOrder.order.hamlet = "Khác";
// 	dataOrder.order.id = "ThuyTitVu-"+currentOrder.orderCode+"-"+(new Date().getTime());
// 	dataOrder.order.tel = currentOrder.customerPhone;
// 	dataOrder.order.name = $("#customerName").val();

// 	dataOrder.order.deliver_work_shift = $("input[type='radio'][name='deliverShift']:checked").val();

// 	if (currentOrder.shippingType == "POST_COD") {
// 		dataOrder.order.pick_money=currentOrder.willpay*1000;		
// 	} else {
// 		dataOrder.order.pick_money=0;
// 	}
// 	dataOrder.order.is_freeship = currentOrder.otherInfor.isFreeShip==true ? "1" : "0";
// 	dataOrder.order.note = $("#orderNodeGHTK").val();
// 	dataOrder.order.value = currentOrder.totalPay*1000;
// 	dataOrder.order.transport = $("#transportType").val();
// 	// dataOrder.products = [{
// 	// 	"name": "Hàng ThuyTitVu - "+count+" mặt hàng",
//  //        "weight": parseFloat($("#totalWeight").val())/1000,
//  //        "quantity": 1
// 	// }]
// 	// console.log(dataOrder);

// 	dataOrder.products = [];
// 	for (i in prodListOrder){
// 		if (prodListOrder[i].delete) {
// 			continue;
// 		}
// 		dataOrder.products.push({
// 			"name": $(".prodName_"+i).val(),
// 			"weight": (parseFloat($(".prodWeight_"+i).val())*parseFloat(prodListOrder[i].productCount)),
// 			"quantity": parseFloat(prodListOrder[i].productCount)
// 		})
// 	}
// }

// $("#saveRequest").click(function(){
// 	prepareDataOrder();
// 	currentOrder.otherInfor.savedRequest = dataOrder;
// 	saveOtherInforAsManager();
// 	saveOtherInforAsShipper();
// 	$("#modelContent").html("Đã lưu yêu cầu");
// 	$('#myModal').modal('toggle');
// })

$("#ghtkPost").click(function(){
	var pickIndex = $("#pickList").val();
	var totalQuantity = 0;
	// for (e in currentOrder.prodListOrder) {
	// 	totalQuantity = totalQuantity + parseInt(currentOrder.prodListOrder[e].productCount)
	// }

	if (currentOrder.shippingType == "POST_COD") {
		pick_money=currentOrder.willpay*1000;		
	} else {
		pick_money=0;
	}
	var dataOrder = {
		"ORDER_NUMBER": currentOrder.orderCode,
		"GROUPADDRESS_ID": pickList[pickIndex].groupaddressId,
		"CUS_ID": pickList[pickIndex].cusId,
		// "DELIVERY_DATE": "11/10/2018 15:09:52",
		"SENDER_FULLNAME": pickList[pickIndex].name,
		"SENDER_ADDRESS": pickList[pickIndex].address+","+ pickList[pickIndex].wardsName+","+ pickList[pickIndex].districtName+","+ pickList[pickIndex].provinceName,
		"SENDER_PHONE": pickList[pickIndex].phone,
		"SENDER_EMAIL": "Levanthanh3005@icloud.com",
		"SENDER_WARD": pickList[pickIndex].wardsId,
		"SENDER_DISTRICT": pickList[pickIndex].districtId,
		"SENDER_PROVINCE": pickList[pickIndex].provinceId,
		"SENDER_LATITUDE": 0,
		"SENDER_LONGITUDE": 0,
		"RECEIVER_FULLNAME": $("#customerName").val(),
		"RECEIVER_ADDRESS": currentOrder.customerAddress,
		"RECEIVER_PHONE": currentOrder.customerPhone,
		"RECEIVER_EMAIL": "Levanthanh3005@icloud.com",
		"RECEIVER_WARD": customerAddressObj["RECEIVER_WARD"],
		"RECEIVER_DISTRICT": customerAddressObj["RECEIVER_DISTRICT"],
		"RECEIVER_PROVINCE": customerAddressObj["RECEIVER_PROVINCE"],
		"RECEIVER_LATITUDE": 0,
		"RECEIVER_LONGITUDE": 0,
		"PRODUCT_NAME": "Hàng Thuỷ gửi",
		"PRODUCT_DESCRIPTION": "Hàng Thuỷ gửi",
		"PRODUCT_QUANTITY": count,
		"PRODUCT_PRICE": $("#totalPay").val(),
		"PRODUCT_WEIGHT": $("#totalWeight").val(),
		"PRODUCT_LENGTH": $("#packLength").val(),
		"PRODUCT_WIDTH": $("#packWidth").val(),
		"PRODUCT_HEIGHT": $("#packHeight").val(),
		"PRODUCT_TYPE": "HH",
		"ORDER_PAYMENT": $("#collectMoneyType").val(),
		"ORDER_SERVICE": $("#transportType").val(),
		"ORDER_SERVICE_ADD": "",
		"ORDER_VOUCHER": "",
		"ORDER_NOTE": $("#orderNodeGHTK").val(),
		"MONEY_COLLECTION": pick_money,
		"LIST_ITEM": [{
		    "PRODUCT_NAME": "Máy xay sinh tố Philips HR2118 2.0L ",
		    "PRODUCT_PRICE": 2150000,
		    "PRODUCT_WEIGHT": 2500,
		    "PRODUCT_QUANTITY": 1
		}]
	}
	// console.log(pickIndex);
	// dataOrder.order.pick_address = pickList[pickIndex].address;
	// dataOrder.order.pick_province = pickList[pickIndex].province;
	// dataOrder.order.pick_district = pickList[pickIndex].district;
	// dataOrder.order.pick_ward = pickList[pickIndex].ward;
	// dataOrder.order.pick_name = pickList[pickIndex].name;
	// dataOrder.order.pick_tel = pickList[pickIndex].tel;

	// dataOrder.order.province = $("#province").html();
	// dataOrder.order.district = $("#district").html();
	// dataOrder.order.ward = $("#ward").html();
	// dataOrder.order.address = $("#address").html();
	// dataOrder.order.hamlet = "Khác";
	// dataOrder.order.id = "ThuyTitVu-"+currentOrder.orderCode+"-"+(new Date().getTime());
	// dataOrder.order.tel = currentOrder.customerPhone;
	// dataOrder.order.name = $("#customerName").val();

	// dataOrder.order.deliver_work_shift = $("input[type='radio'][name='deliverShift']:checked").val();


	// dataOrder.order.is_freeship = currentOrder.otherInfor.isFreeShip==true ? "1" : "0";
	// dataOrder.order.note = $("#orderNodeGHTK").val();
	// dataOrder.order.value = currentOrder.totalPay*1000;
	// dataOrder.order.transport = $("#transportType").val();
	// dataOrder.products = [{
	// 	"name": "Hàng ThuyTitVu - "+count+" mặt hàng",
 //        "weight": parseFloat($("#totalWeight").val())/1000,
 //        "quantity": 1
	// }]
	// console.log(dataOrder);
	var totalQuantity = 0;
	var totalWeight = 0;
	dataOrder["LIST_ITEM"] = [];
	for (i in prodListOrder){
		if (prodListOrder[i].delete) {
			continue;
		}
		dataOrder["LIST_ITEM"].push({
			// "name": $(".prodName_"+i).val(),
			// "weight": (parseFloat($(".prodWeight_"+i).val())*parseFloat(prodListOrder[i].productCount)),
			// "quantity": parseFloat(prodListOrder[i].productCount)

			 "PRODUCT_NAME": $(".prodName_"+i).val(),
		     "PRODUCT_PRICE": parseInt($(".prodPrice_"+i).html())*1000,
		     "PRODUCT_WEIGHT": parseInt($(".prodWeight_"+i).val())*1000,
		     "PRODUCT_QUANTITY": parseInt($(".prodQuantity_"+i).html())
		})
		totalQuantity = totalQuantity + parseInt($(".prodQuantity_"+i).html());
		totalWeight = totalWeight + parseInt(parseFloat($(".prodWeight_"+i).val())*1000);
	}

	dataOrder["PRODUCT_WEIGHT"] = totalWeight;
	dataOrder["PRODUCT_QUANTITY"] = totalQuantity;

	// console.log(dataOrder);
	// return;
	
	$("#loadingSpin").show();

	vietttelPostCreateABill(dataOrder, function(data){

		$("#loadingSpin").hide();

		currentOrder.otherInfor.order = data;
		currentOrder.otherInfor.order.viettelPostlabel = data["data"]["ORDER_NUMBER"];

		showOrderPush();

// 		{
//  "status": 200,
//  "error": false,
//  "message": "OK",
//  "data": {
//   "ORDER_NUMBER": "14696431294",
//   "MONEY_COLLECTION": 388000,
//   "EXCHANGE_WEIGHT": 50,
//   "MONEY_TOTAL": 26000,
//   "MONEY_TOTAL_FEE": 23636,
//   "MONEY_FEE": 0,
//   "MONEY_COLLECTION_FEE": 0,
//   "MONEY_OTHER_FEE": 0,
//   "MONEY_VAS": 0,
//   "MONEY_VAT": 2364,
//   "KPI_HT": 24,
//   "RECEIVER_PROVINCE": 1,
//   "RECEIVER_DISTRICT": 2,
//   "RECEIVER_WARDS": 31
//  },
//  "viettelPostlabel": "14696431294"
// }

		if (data["error"]==false) {
			console.log("Copy");
			$("#textareaBanking").show();
			$("#textareaBanking").val(data["data"]["ORDER_NUMBER"]);
			var copyText = document.getElementById("textareaBanking");
			copyText.select(); 
			copyText.setSelectionRange(0, 99999); /*For mobile devices*/
			document.execCommand("copy");

			$("#textareaBanking").hide();
			localStorage.setItem("currentOrder",JSON.stringify(currentOrder));

			saveOtherInforAsManager();
			saveOtherInforAsShipper();
		} else {
			try{
				data = JSON.parse(data);
			}catch(e) {

			}
			$("#modelContent").html(jsonToHtml(data));
			$('#myModal').modal('toggle');
		}
	})
})
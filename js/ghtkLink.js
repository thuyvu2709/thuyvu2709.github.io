
$("#footerInclude").load("../common/footer.html");

var currentOrder = JSON.parse(localStorage.getItem("currentOrder"));
var pickList = JSON.parse(localStorage.getItem("pickList"));
var ghtkToken = localStorage.getItem("ghtkToken");

var userRole = JSON.parse(localStorage.getItem("userRole"));

if (!currentOrder.otherInfor){
	currentOrder.otherInfor = {}
}

try{
	currentOrder.otherInfor = JSON.parse(currentOrder.otherInfor);
}catch(e){

}

var ghtkUrl="services.giaohangtietkiem.vn"
// $("#textareaCopy").hide();
// console.log("ghtkUrl:"+ghtkUrl)

var dataOrder = {};

function loadPickList() {
	$("#loadingSpin").show();
	getPickAddress(function(rs){
		// console.log(rs);
		pickList = rs;
		localStorage.setItem("pickList",JSON.stringify(pickList));

		var pickListHtml = '';
		for (e in pickList){
			pickListHtml += '<option value="'+e+'">'+pickList[e].name+'-'+pickList[e].province+'</option>'
		}
		$("#pickList").html(pickListHtml);
		$("#loadingSpin").hide();
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

var address = currentOrder.customerAddress.replace(/[|&;$%@"<>()+,]/g, "").trim().replace(" ","+");

$("#customerAddress").html(
	'<a href="http://maps.google.com/maps?q='+address+'">'+currentOrder.customerAddress+'</a>'
);
$("#customerPhone").html(
	'<a href="tel:'+currentOrder.customerPhone+'">'+currentOrder.customerPhone+'</a>'
);

$("#totalPay").html(currentOrder.totalPay);

$("#shippingCost").html(currentOrder.shippingCost);

$("#totalPayIncludeShip").html(currentOrder.totalPayIncludeShip);

$("#orderNode").html((currentOrder.orderNode ? currentOrder.orderNode : ""));

$("#orderNode").height( $("#orderNode")[0].scrollHeight );


$("#shippingStatus").html("Giao hàng:"+(currentOrder.shippingStatus == "SHIPPED" ? "Đã giao" : "Chưa giao hàng"));

$("#paymentStatus").html((currentOrder.paymentStatus == "PAID" ? "Khách đã thanh toán đủ" : "Khách chưa thanh toán"));

$("#otherCost").html(currentOrder.otherCost);

$("#prepaid").html(currentOrder.prepaid);

$("#orderNodeGHTK").val("Hàng dễ vỡ, vui lòng nhẹ tay, không giao được thì liên hệ với sđt shop, không tự ý huỷ đơn, gọi điện cho khách trước khi giao")

if (currentOrder.otherInfor) {
	$("#isFreeShip").prop('checked', currentOrder.otherInfor.isFreeShip);
    $("#shopPayShipAns").html(currentOrder.otherInfor.isFreeShip==true ? "Có" : "Không");

} else {
	currentOrder.otherInfor = {
		isFreeShip : false
	}
}

currentOrder.willpay = parseFloat(currentOrder.totalPayIncludeShip) - parseFloat(currentOrder.prepaid ? currentOrder.prepaid : 0);

if (currentOrder.shippingType == "POST_COD") {
	$("#shippingCost").html("Khách thanh toán với bên vận chuyển");
	$("#titleWillpay").html("Thu COD:");
	$("#shippingType").html("Ship Dịch Vụ Vận Chuyển có COD");
} else if (currentOrder.shippingType == "POST_NO_COD") {
	$("#shippingCost").html("Khách thanh toán với bên vận chuyển");
	$("#shippingType").html("Ship Dịch Vụ Vận Chuyển không COD");
	currentOrder.willpay = 0;
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
	$("#lsTable").append("<tr>"+
    "<td>"+(parseInt(i)+1)+"</td>"+
    // "<td>"+prodListOrder[i].productName+"</td>"+
    "<td class='showImage borderMustard image_"+i+"'>"+prodListOrder[i].productName+"</td>"+
    "<td>"+prodListOrder[i].productCount+"</td>"+
    "<td>"+prodListOrder[i].productEstimateSellingVND+"</td>"+
	"<td>"+prodListOrder[i].productWeight+"</td>"+
  "</tr>")
	totalWeight += parseFloat(prodListOrder[i].productWeight);
	count++;
}

var avgWeight = (Math.round((totalWeight / parseFloat(count)) * 1000) / 1000)*1000;
if (!totalWeight) {
	totalWeight = 0;
	avgWeight = 0;
}
$("#totalWeight").val(parseInt(totalWeight*1000));
$("#prodList").html(count+" x hàng gửi của Thuỷ");
$("#avgWeight").val(avgWeight);

$("#avgWeight").change(function(){
	var tw = parseFloat($("#avgWeight").val())*count;
	$("#totalWeight").val(tw);
	caluclateTransportFeeFn(true);//does not show loading
})

$("#totalWeight").change(function(){
	var avgw = parseFloat($("#totalWeight").val()) / count;
	$("#avgWeight").val(avgw);
	caluclateTransportFeeFn(true);//does not show loading
})

$(".showImage").click(function(){
	var index = $(this).attr("class").split(" ").pop().split("_").pop();
	index = parseInt(index);
	// console.log("AA"+index);
	$("#myModal .modal-body").html('<img style="width:100%" src="'+prodListOrder[index].productImage+'" />')
    $('#myModal').modal('toggle');
})

$("#updateAddress").click(function(){
	triggerAutocompleteViettelpost(currentOrder.customerAddress,function(addrData){
		// console.log(addrData);

		if (addrData["OTHER"] && addrData["PROVINCE_NAME"] && addrData["DISTRICT_NAME"]) {
			var addr = addrData["OTHER"]+","+addrData["WARDS_NAME"]+","+addrData["DISTRICT_NAME"]+","+addrData["PROVINCE_NAME"];
			currentOrder.customerAddress = addr;

			var address = currentOrder.customerAddress.replace(/[|&;$%@"<>()+,]/g, "").trim().replace(" ","+");

			$("#customerAddress").html(
				'<a href="http://maps.google.com/maps?q='+address+'">'+currentOrder.customerAddress+'</a>'
			);
			loadAddressIntoUI();
			// saveAddressAsManager();
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

caluclateTransportFeeFn(true);//does not show loading

$("#pickList").change(function(){
	caluclateTransportFeeFn(true);//does not show loading
})

$("#transportType").change(function(){
	caluclateTransportFeeFn(true);//does not show loading	
})

function caluclateTransportFeeFn(notloadShow){//true mean does not show
	$("#transportFee").html($("#transportFee").html()+" - Đang tính...");
	var pickIndex = $("#pickList").val();
	var dataFee = {};
	dataFee.pick_province = pickList[pickIndex].province;
	dataFee.pick_district = pickList[pickIndex].district;
	
	dataFee.province = $("#province").html();
	dataFee.district = $("#district").html();
	dataFee.address = $("#address").html();
	dataFee.weight = parseFloat($("#totalWeight").val());
	dataFee.value = currentOrder.totalPay;
	dataFee.transport = $("#transportType").val();
	
	if (!notloadShow) {
		$("#loadingSpin").show();
		$("#loading-text").html();
	}
	calculateTransportFeeAPI(dataFee, function(fee){
		$("#transportFee").html(fee);
		$("#loadingSpin").hide();
	});
}
  
$("#calculateFeeLoadForce").click(function(){
	caluclateTransportFeeFn();
})

function saveAddressAsManager(){
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

// 

function showOrderPush(){
	if (currentOrder.otherInfor.order) {
		$("#showOrderPush").html("<h4>Thông tin vận đơn:</h4>"+jsonToHtml(currentOrder.otherInfor.order)+"<hr/>");
	}
}

showOrderPush();

$("#ghtkPost").click(function(){
	// var dataOrder = {
	//     "products": [{
	//         "name": "bút",
	//         "weight": 0.1,
	//         "quantity": 1
	//     }, {
	//         "name": "tẩy",
	//         "weight": 0.2,
	//         "quantity": 1
	//     }],
	//     "order": {
	//         "id": "a4",
	//         "pick_name": "HCM-nội thành",
	//         "pick_address": "590 CMT8 P.11",
	//         "pick_province": "TP. Hồ Chí Minh",
	//         "pick_district": "Quận 3",
	//         "pick_ward": "Phường 1",
	//         "pick_tel": "0911222333",
	//         "tel": "0911222333",
	//         "name": "GHTK - HCM - Noi Thanh",
	//         "address": "123 nguyễn chí thanh",
	//         "province": "TP. Hồ Chí Minh",
	//         "district": "Quận 1",
	//         "ward": "Phường Bến Nghé",
	//         "hamlet": "Khác",
	//         "is_freeship": "1",
	//         "pick_date": "2016-09-30",
	//         "pick_money": 47000,
	//         "note": "Khối lượng tính cước tối đa: 1.00 kg",
	//         "value": 3000000,
	//         "transport": "fly"
	//     }
	// };
	var pickIndex = $("#pickList").val();
	// console.log(pickIndex);
	dataOrder.order={};
	dataOrder.order.pick_address = pickList[pickIndex].address;
	dataOrder.order.pick_province = pickList[pickIndex].province;
	dataOrder.order.pick_district = pickList[pickIndex].district;
	dataOrder.order.pick_ward = pickList[pickIndex].ward;
	dataOrder.order.pick_name = pickList[pickIndex].name;
	dataOrder.order.pick_tel = pickList[pickIndex].tel;

	dataOrder.order.province = $("#province").html();
	dataOrder.order.district = $("#district").html();
	dataOrder.order.ward = $("#ward").html();
	dataOrder.order.address = $("#address").html();
	dataOrder.order.hamlet = "Khác";
	dataOrder.order.id = "ThuyTitVu-"+currentOrder.orderCode+"-"+(new Date().getTime());
	dataOrder.order.tel = currentOrder.customerPhone;
	dataOrder.order.name = $("#customerName").val();
	if (currentOrder.shippingType == "POST_COD") {
		dataOrder.order.pick_money=currentOrder.willpay*1000;		
	} else {
		dataOrder.order.pick_money=0;
	}
	dataOrder.order.is_freeship = currentOrder.otherInfor.isFreeShip==true ? "1" : "0";
	dataOrder.order.note = $("#orderNodeGHTK").val();
	dataOrder.order.value = currentOrder.totalPay*1000;
	dataOrder.order.transport = $("#transportType").val();
	dataOrder.products = [{
		"name": "Hàng Thuỷ gửi",
        "weight": parseFloat($("#avgWeight").val())/1000,
        "quantity": count
	}]
	// console.log(dataOrder);
	
	$("#loadingSpin").show();

	createAnOrder(dataOrder, function(data){

// {
//  "success": true,
//  "message": "Các đơn hàng đã được add vào hệ thống GHTK thành công. Thông tin đơn hàng thành công được trả về trong trường success_orders.
// GHTK chỉ hỗ trợ chọn phương thức vận chuyển với các đơn hàng đặc biệt hoặc liên miền, gửi từ Hà Nội hoặc Tp. HCM. Các tuyến đường còn lại hoặc không nhận dạng được địa chỉ sẽ được chuyển theo phương thức mặc định : Nội miền/ Nội tỉnh đường bộ & Liên miền : Đường bay.",
//  "order": {
//   "partner_id": "ThuyTitVu-DONHANG_865-1598383517256",
//   "label": "S15549745.HN12.G3.876491853",
//   "area": "1",
//   "fee": "18000",
//   "status_id": "2",
//   "insurance_fee": "0",
//   "estimated_pick_time": "Sáng 2020-08-26",
//   "estimated_deliver_time": "Chiều 2020-08-26",
//   "products": [],
//   "tracking_id": 876491853,
//   "sorting_code": "HN12.G3"
//  }
// }
		$("#loadingSpin").hide();

		currentOrder.otherInfor.order = data;

		showOrderPush();

		if (data["success"]==true) {
			console.log("Copy");
			$("#textareaBanking").show();
			$("#textareaBanking").val(data["order"]["label"]);
			var copyText = document.getElementById("textareaBanking");
			copyText.select(); 
			copyText.setSelectionRange(0, 99999); /*For mobile devices*/
			document.execCommand("copy");

			$("#textareaBanking").hide();
			localStorage.setItem("currentOrder",JSON.stringify(currentOrder));

			saveOtherInforAsManager();
		} else {
			$("#modelContent").html(jsonToHtml(data));
			$('#myModal').modal('toggle');
		}
	})
})
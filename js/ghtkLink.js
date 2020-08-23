
$("#footerInclude").load("../common/footer.html");

var currentOrder = JSON.parse(localStorage.getItem("currentOrder"));
var pickList = JSON.parse(localStorage.getItem("pickList"));
var ghtkUrl="services.giaohangtietkiem.vn"

// console.log("ghtkUrl:"+ghtkUrl)

var dataOrder = {};

function loadPickList() {
	getPickAddress(function(rs){
		// console.log(rs);
		pickList = rs;
		localStorage.setItem("pickList",JSON.stringify(pickList));

		var pickListHtml = '';
		for (e in pickList){
			pickListHtml += '<option value="'+e+'">'+pickList[e].name+'-'+pickList[e].province+'</option>'
		}
		$("#pickList").html(pickListHtml);
	}) 	
}

ghtkToken = "";
$("#loadingSpin").show();
var triggerAfterLoad = function(){
	console.log("triggerAfterLoad");
	getGhtkAccess(function(rs){
		ghtkToken = rs["ghtkToken"];

		$("#loadingSpin").hide();

		if (!pickList) {
			loadPickList();
		} else {
			var pickListHtml = '';
			for (e in pickList){
				pickListHtml += '<option value="'+e+'">'+pickList[e].name+'-'+pickList[e].province+'</option>'
			}
			$("#pickList").html(pickListHtml);
		}
	})
}

// console.log(pickList);
// console.log(currentOrder);

$("#orderCode").html(currentOrder.orderCode);
$("#customerName").html(currentOrder.customerName);

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
$("#totalWeight").html(parseInt(totalWeight*1000));
$("#prodList").html(count+" x hàng gửi của Thuỷ");
$("#avgWeight").val(avgWeight);

$("#avgWeight").change(function(){
	var tw = parseFloat($("#avgWeight").val())*count;
	$("#totalWeight").html(tw);
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
		console.log(addrData);

		if (addrData["OTHER"] && addrData["PROVINCE_NAME"] && addrData["DISTRICT_NAME"]) {
			var addr = addrData["OTHER"]+","+addrData["WARDS_NAME"]+","+addrData["DISTRICT_NAME"]+","+addrData["PROVINCE_NAME"];
			currentOrder.customerAddress = addr;

			var address = currentOrder.customerAddress.replace(/[|&;$%@"<>()+,]/g, "").trim().replace(" ","+");

			$("#customerAddress").html(
				'<a href="http://maps.google.com/maps?q='+address+'">'+currentOrder.customerAddress+'</a>'
			);
		}
	})
})

currentOrder.shopPayShip = 0;

$('#shopPayShip').click(function(){
    if($(this).is(':checked')){
        $("#shopPayShipAns").html("Có");
        currentOrder.shopPayShip = 1;
    } else {
        $("#shopPayShipAns").html("Không");
        currentOrder.shopPayShip = 0;
    }
});

$("#pickLoadForce").click(function(){
	loadPickList();
})

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
	dataOrder.pick_address = pickList[pickIndex].address;
	dataOrder.pick_province = pickList[pickIndex].province;
	dataOrder.pick_district = pickList[pickIndex].district;
	dataOrder.pick_ward = pickList[pickIndex].ward;
	dataOrder.pick_name = pickList[pickIndex].name;
	dataOrder.pick_tel = pickList[pickIndex].tel;

	var aix = strToAddr(currentOrder.customerAddress);
	dataOrder.province = aix.province;
	dataOrder.district = aix.district;
	dataOrder.ward = aix.ward;
	dataOrder.address = aix.address;
	dataOrder.hamlet = "";
	dataOrder.id = currentOrder.orderCode;
	dataOrder.tel = currentOrder.customerPhone;
	dataOrder.name = currentOrder.customerPhone;
	if (currentOrder.shippingType == "POST_COD") {
		dataOrder.pick_money=currentOrder.willpay;		
	} else {
		dataOrder.pick_money=0;
	}
	dataOrder.is_freeship = currentOrder.shopPayShip;
	dataOrder.note = $("#orderNodeGHTK").val();
	dataOrder.value = currentOrder.totalPay;
	dataOrder.transport = $("#transportType").val();
	dataOrder.products = [{
		"name": "Hàng Thuỷ gửi",
        "weight": $("#avgWeight").val(),
        "quantity": count
	}]
	// console.log(dataOrder);
	createAnOrder(dataOrder, function(data){
		$("#modelContent").html(jsonToHtml(data));
		$('#myModal').modal('toggle');
	})
})
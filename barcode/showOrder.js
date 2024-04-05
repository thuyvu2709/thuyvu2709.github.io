// addNewProduct.js

currentOrder = JSON.parse(localStorage.getItem("currentOrder"));


if (currentOrder.orderIndex) {
	$("#editOrder").show();
} else {
	$("#editOrder").hide();
}

$("#orderCode").html(currentOrder.orderCode);
$("#orderDate").html(currentOrder.orderDate)
$("#customerName").html(currentOrder.customerName);

var address = currentOrder.customerAddress.replace(/[|&;$%@"<>()+,]/g, "").trim().replace(" ","+");

$("#customerAddress").html(
	currentOrder.customerAddress
	// "số 76 số 76 số"
);
$("#customerPhone").html(
	'<a href="tel:'+currentOrder.customerPhone+'">'+currentOrder.customerPhone+'</a>'
);

$("#shippingCost").html(currentOrder.shippingCost);

var otherInfor = {}
try{
	otherInfor = JSON.parse(currentOrder.otherInfor)
}catch(e) {
	if (currentOrder.otherInfor.isFreeShip != undefined) {
		otherInfor = currentOrder.otherInfor;
	}
}

$("#prepaid").html(currentOrder.prepaid);
var restPay = parseFloat(currentOrder.totalPayIncludeShip) - parseFloat(currentOrder.prepaid ? currentOrder.prepaid : 0);


if (otherInfor.isFreeShip == false && (currentOrder.shippingType == "POST_COD" || currentOrder.shippingType == "POST_NO_COD" )) {
	$("#totalPayIncludeShip").html(currentOrder.totalPayIncludeShip + " (+ Phí Ship)");	
} else {
	$("#totalPayIncludeShip").html(currentOrder.totalPayIncludeShip);
}

if (otherInfor.isFreeShip == false) {
	$("#willpay").html(restPay + " (+ Phí Ship)")
} else {
	$("#willpay").html(restPay)
}

$("#totalPay").html(currentOrder.totalPay);

$("#shippingStatus").html("Giao hàng:"+(currentOrder.shippingStatus == "SHIPPED" ? "Đã giao" : "Chưa giao hàng"));

// $("#paymentStatus").html("Thanh toán:"+(currentOrder.paymentStatus == "PAID" ? "Đã thanh toán" : "Chưa thanh toán"));

if (currentOrder.paymentStatus == "PAID") {
	if (otherInfor.isFreeShip == false && (currentOrder.shippingType == "POST_COD" || currentOrder.shippingType == "POST_NO_COD" )) {
		$("#paymentStatus").html("<i class='textRed'>(Khách đã thanh toán đủ tiền hàng - Khách chỉ thanh toán phí ship với bên vận chuyển)</i>");
	} else {
		$("#paymentStatus").html("<i class='textRed'>(Khách đã thanh toán đủ tiền hàng)</i>");
	}
	$(".prepaid").hide();
	$("#willpay").html("0");
}

if (!currentOrder.shippingCost) {
	$(".shippingCost").hide();
}

// console.log(currentOrder)
// console.log(">>"+currentOrder.shippingType);
if (currentOrder.shippingType == "SHIPPER_NO_COD" || !currentOrder.shippingType) {
	$("#shippingType").html("Shipper không thu tiền - Khách chuyển khoản trước qua:");
} else if (currentOrder.shippingType == "SHIPPER_COD") {
	$("#shippingType").html("Shipper thu tiền " + $("#willpay").html());
} else if (currentOrder.shippingType == "POST_COD") {
	if (currentOrder.shippingCost=="0") {
		$("#shippingCost").html("Khách thanh toán với bên vận chuyển");
	} else {
		$("#shippingCost").html(currentOrder.shippingCost)
	}
	$("#titleWillpay").html("Thu COD:");
	$("#shippingType").html("COD qua dịch vụ vận chuyển");
} else if (currentOrder.shippingType == "SHOPEE") {
	if (currentOrder.shippingCost=="0") {
		$("#shippingCost").html("Khách thanh toán với bên vận chuyển");
	} else {
		$("#shippingCost").html(currentOrder.shippingCost)
	}
	$("#shippingType").html("Shopee");
} else if (currentOrder.shippingType == "POST_NO_COD") {
	if (currentOrder.shippingCost=="0") {
		$("#shippingCost").html("Khách thanh toán với bên vận chuyển");
	} else {
		$("#shippingCost").html(currentOrder.shippingCost)
	}
	$("#shippingType").html("Dịch vụ vận chuyển (không COD) - Khách chuyển khoản trước qua:");
} else if (currentOrder.shippingType == "SHIP_BY_THIRD_PARTY") {
	$("#shippingType").html("Dịch vụ bên thứ 3");
} else {
	$("#shippingCost").html("");
	$("#shippingType").html("");
}

if (otherInfor && otherInfor.isFreeShip) {
	$(".shippingCost").hide();
	// $("#shippingCost").html("Đã thanh toán ship");
}

$("#orderNode").html((currentOrder.orderNode ? currentOrder.orderNode : ""));
$("#orderNode").height( $("#orderNode")[0].scrollHeight );
$("#otherCost").html(currentOrder.otherCost);

allText = "Mã đơn hàng: "+currentOrder.orderCode +"\n"+
"Tên khách hàng:"+currentOrder.customerName+"\n"+
"Địa chỉ khách hàng:"+currentOrder.customerAddress+"\n"+
"Số điện thoại khách hàng:"+currentOrder.customerPhone+"\n";
// "shippingCost:"+currentOrder.shippingCost+"\n";
// "Tổng tiền trả cả ship:"+currentOrder.shippingCost+"\n"+


var prodListOrder = currentOrder.prodListOrder;

var importSLData = JSON.parse(localStorage.getItem("warehouse"));
var importSLDataParse = {}
for (var e in importSLData) {
	importSLDataParse[importSLData[e][0]] = importSLData[e];
}

// console.log(prodListOrder.size);

// console.log(prodListOrder)

// console.log($("#portfolio"))

var totalCount = 0;
$("#lsTable").empty();
for (var i in prodListOrder){
	if (prodListOrder[i].delete) {
		continue;
	}
	var isAvailable = prodListOrder[i].available == 1 ? "borderMustard" : "";
	var totalUnit = parseFloat(prodListOrder[i].productCount)*parseFloat(prodListOrder[i].productEstimateSellingVND)
	$("#lsTable").append("<tr>"+
    "<td>"+(parseInt(i)+1)+"</td>"+
    // "<td class='showImage "+isAvailable+" image_"+i+"'>"+prodListOrder[i].productName+
    "<td class='showImage image_"+i+"'>"+prodListOrder[i].productName+
   	"   <span class='simply'>(Đh "+prodListOrder[i].importCode+":"+importSLDataParse[prodListOrder[i].importCode][1] +")</span>"+
   	"	<div class='divImgThumbnail simply'><img class='imgThumbnail' src='"+prodListOrder[i].productImage+"' /></div>"+
	"</td>"+
    "<td>"+prodListOrder[i].productCount+"</td>"+
    "<td>"+prodListOrder[i].productEstimateSellingVND+"</td>"+
    "<td>"+totalUnit+"</td>"+
    // "<td>"+prodListOrder[i].available+"</td>"+
  "</tr>")
	allText = allText + 
		(parseInt(i)+1)+"-"+prodListOrder[i].productName+" (Số lượng:"+prodListOrder[i].productCount+")\n";
	totalCount = totalCount + parseInt(prodListOrder[i].productCount);
}

$("#totalCount").html(totalCount);
$("#showImgDivThumbnail").click(function(){
	$(".divImgThumbnail").show();
})

allText = allText +  "Tổng tiền trả cả ship:"+currentOrder.totalPayIncludeShip + "\n";

allText = allText + "Tổng số lượng:"+totalCount +"\n";

allText = allText + (currentOrder.paymentStatus == "PAID" ? "Khách hàng đã thanh toán\n" : "Khách hàng chưa thanh toán\n");

allText = allText + (currentOrder.orderNode ? "Chú ý:"+currentOrder.orderNode : "");

var zoom = 1;

$(".showImage").click(function(){
	var index = $(this).attr("class").split(" ").pop().split("_").pop();
	index = parseInt(index);
	// console.log("AA"+index);
	$("#myModal .modal-body").html('<img style="width:100%" src="'+prodListOrder[index].productImage+'" />')
    $('#myModal').modal('toggle');
})

$("#zoomin").click(function(){
	location.reload();
	// console.log(document.body.style.zoom);
	// zoom = zoom / 10;
	// document.body.style.zoom  = zoom;
})
$("#zoomout").click(function(){
	location.reload();
	// console.log(document.body.style.zoom);
	// zoom = zoom * 10;
	// document.body.style.zoom = zoom;
})

var textarea = document.getElementById("textarea");
$(textarea).hide();

$("#copyText").click(function(){
	console.log("Copy");
	$(textarea).show();

	textarea.value = allText;

	textarea.select(); 
	textarea.setSelectionRange(0, 99999); /*For mobile devices*/
	document.execCommand("copy");

	var orderCopy = {
		customerName : currentOrder.customerName,
		customerPhone : currentOrder.customerPhone,
		customerAddress: currentOrder.customerAddress
	}
	localStorage.setItem("orderCopy",JSON.stringify(orderCopy));


	$(textarea).hide();
})

$("#requestShipping").click(function(){
	// requestShipping(currentOrder);
	var willpay = parseFloat(currentOrder.totalPayIncludeShip) - parseFloat(currentOrder.prepaid ? currentOrder.prepaid : 0);
 //    console.log(currentOrder.totalPayIncludeShip);
 //    console.log(currentOrder.prepaid);    
 //    var lsBtnShip = 
 //    '<h5>Chọn kiểu giao hàng</h5>'+
 //    // '<div class="btn btnNormal5px shippingType type_0 order_'+orderIndex+'" >Ship không thu tiền</div>'+
 //    '<div class="btn btnNormal5px shippingType type_0" >Shipper không thu tiền</div>'+
 //    '<div class="btn btnNormal5px shippingType type_1" >Shipper thu '+willpay+'k</div>'+
 //    '<div class="btn btnNormal5px shippingType type_2" >Ship Poste</div>';
 //    $("#simpleModal .modal-content").html(lsBtnShip);
 //    $("#simpleModal").modal('toggle');

 //    $(".shippingType").click(function(){
	// $("#simpleModal").modal('hide');
	// console.log(orderIndex);

	if(currentOrder.shipIndex == -1 || !currentOrder.shipIndex) {  
		$("#requestShipping").hide();
	}

	console.log(willpay);
	// currentOrder.shippingType =  $(this).attr("class").split(" ").pop().split("_").pop();
	console.log("shippingType:"+currentOrder.shippingType);
	if (currentOrder.shippingType == "POST_COD" 
		|| currentOrder.shippingType == "SHOPEE"
		|| currentOrder.shippingType == "POST_NO_COD" ) {
		currentOrder.otherCost = 5;
	}
	currentOrder.willpay = willpay;

	requestShipping(currentOrder);
    // });
})


$("#editOrder").click(function(){
	// console.log("AAA");
	window.location = "editorder.html"
})

$("#printOrder").click(function(){
	$(".controlOrder").hide();
	$("#orderPrintHeader").show();
	window.print();
	$(".controlOrder").show();
	$("#orderPrintHeader").hide();

})

$("#simplify").click(function(){
	$(".simply").hide();
	// $("#shippingCost").html($("#shippingCost").html());
	// $("#orderCode").html(currentOrder.orderCode+" | "+currentOrder.customerName)
	var prepaid = currentOrder.prepaid ? currentOrder.prepaid : 0;
	if (prepaid == 0) {
		$(".prepaid").hide();
		$(".willpay").hide();
	}

	$(".click-to-back").hide();
	// $(".controlOrder").hide();
	$("#headerInclude").hide();
	// $("#footerInclude").hide();

	// if (parseFloat(currentOrder.totalPayIncludeShip) == parseFloat(currentOrder.prepaid)
	// 	|| currentOrder.paymentStatus == "PAID"
	// 	){
	// 	$(".willpay").hide();
	// 	$(".prepaid").hide();
	// 	// $(".prepaid").html("Khách đã thanh toán");
	// 	// $(".totalPayIncludeShip").html("<h5>Khách đã thanh toán đủ tiền hàng: "+currentOrder.totalPayIncludeShip+"</h5>")
	// }

	if ($("#tableWrap").width()/$("#tableWrap").height() > parseFloat(540/230)) {
		// "background-size" : "width height",
		$("#tableWrap").css({
			"background" : "url('../img/LogoOnlyTransparent20.png') no-repeat",
			"background-size" : "auto 100%",
			"background-position" : "center"
		})
	} else {
		$("#tableWrap").css({
			"background" : "url('../img/LogoOnlyTransparent20.png') no-repeat",
			"background-size" : "100% auto",
			"background-position" : "center"
		})
	}
});

$("#showController").click(function(){
	$(".click-to-back").show();
	$(".controlOrder").show();
	$("#headerInclude").show();
	$("#footerInclude").show();
	$(".simply").show();
	$(".prepaid").show();
	$(".willpay").show();
})

$("#makeCopy").click(function(){
	window.location = "neworder.html?makeCopy=true";
})

$("#ghtkLink").click(function(){
  window.location = "../shipper/ghtkLink.html";  
})

$("#createNewOrder").click(function(){
	// $("#loadingSpin").show();
	// getLatestOrderCode(function(){
	// 	$("#loadingSpin").hide();

	window.location = "neworder.html";
	// })
})

var url = new URL(window.location.href);
var isSimplified = url.searchParams.get("simplify");

if (isSimplified == "true") {
	$("#simplify").click();
}

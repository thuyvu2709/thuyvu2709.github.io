// addNewProduct.js

currentOrder = JSON.parse(localStorage.getItem("currentOrder"));


if (currentOrder.orderIndex) {
	$("#editOrder").show();
} else {
	$("#editOrder").hide();
}

$("#orderCode").html(currentOrder.orderCode);
$("#customerName").html(currentOrder.customerName);

var address = currentOrder.customerAddress.replace(/[|&;$%@"<>()+,]/g, "").trim().replace(" ","+");

$("#customerAddress").html(
	'<a href="http://maps.google.com/maps?q='+address+'">'+currentOrder.customerAddress+'</a>'
);
$("#customerPhone").html(
	'<a href="tel:'+currentOrder.customerPhone+'">'+currentOrder.customerPhone+'</a>'
);

$("#shippingCost").html(currentOrder.shippingCost);

$("#totalPayIncludeShip").html(currentOrder.totalPayIncludeShip);

$("#shippingStatus").html("Giao hàng:"+(currentOrder.shippingStatus == "SHIPPED" ? "Đã giao" : "Chưa giao hàng"));

$("#paymentStatus").html("Thanh toán:"+(currentOrder.paymentStatus == "PAID" ? "Đã thanh toán" : "Chưa thanh toán"));

$("#prepaid").html(currentOrder.prepaid);
$("#willpay").html(parseFloat(currentOrder.totalPayIncludeShip) - parseFloat(currentOrder.prepaid ? currentOrder.prepaid : 0));


if (!currentOrder.shippingCost) {
	$(".shippingCost").hide();
}

// console.log(">>"+currentOrder.shippingType);
if (currentOrder.shippingType == 0 || !currentOrder.shippingType) {
	$("#shippingType").html("Shipper không thu tiền");
} else if (currentOrder.shippingType == 1) {
	$("#shippingType").html("Shipper thu tiền " + $("#willpay").html());
} else if (currentOrder.shippingType == 2) {
	$("#shippingCost").html("Khách thanh toán với bên vận chuyển");

	$("#shippingType").html("Ship Poste");
} else if (currentOrder.shippingType == 3) {
	$("#shippingCost").html("Khách thanh toán với bên vận chuyển");

	$("#shippingType").html("Ship Shopee");
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

// console.log(prodListOrder.size);

// console.log(prodListOrder)

// console.log($("#portfolio"))

for (i in prodListOrder){
	if (prodListOrder[i].delete) {
		continue;
	}
	var isAvailable = prodListOrder[i].available == 1 ? "borderMustard" : "";
	$("#lsTable").append("<tr>"+
    "<td>"+(parseInt(i)+1)+"</td>"+
    "<td class='showImage "+isAvailable+" image_"+i+"'>"+prodListOrder[i].productName+
   	"   <span class='simply'>(Đh "+prodListOrder[i].importCode+")</span>"+
	"</td>"+
    "<td>"+prodListOrder[i].productCount+"</td>"+
    "<td>"+prodListOrder[i].productEstimateSellingVND+"</td>"+
    // "<td>"+prodListOrder[i].available+"</td>"+
  "</tr>")
	allText = allText + 
		(parseInt(i)+1)+"-"+prodListOrder[i].productName+" (Số lượng:"+prodListOrder[i].productCount+")\n"
}

allText = allText +  "Tổng tiền trả cả ship:"+currentOrder.totalPayIncludeShip + "\n";

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
	console.log(willpay);
	// currentOrder.shippingType =  $(this).attr("class").split(" ").pop().split("_").pop();
	console.log("shippingType:"+currentOrder.shippingType);
	if (currentOrder.shippingType == 2 || currentOrder.shippingType == 3) {
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
	$("#shippingCost").html("Phí giao hàng:"+$("#shippingCost").html());
	$("#orderCode").html(currentOrder.orderCode+" | "+currentOrder.customerName)
	var prepaid = currentOrder.prepaid ? currentOrder.prepaid : 0;
	if (prepaid == 0) {
		$(".prepaid").hide();
		$(".willpay").hide();
	}

	if (parseFloat(currentOrder.totalPayIncludeShip) == parseFloat(currentOrder.prepaid)
		|| currentOrder.paymentStatus == "PAID"
		){
		$(".willpay").hide();
		$(".prepaid").show();
		$(".prepaid").html("Khách đã thanh toán");
	}
});

$("#createNewOrder").click(function(){
	// $("#loadingSpin").show();
	// getLatestOrderCode(function(){
	// 	$("#loadingSpin").hide();

	window.location = "neworder.html";
	// })
})

// $(window).bind("pageshow", function(event) {
//     if (event.originalEvent.persisted) {
//       alert("From back / forward cache.");
//     }
// });

$("#footerInclude").load("../common/footer.html");

currentOrder = JSON.parse(localStorage.getItem("currentOrder"));

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
$("#willpay").html(parseFloat(currentOrder.totalPayIncludeShip) - parseFloat(currentOrder.prepaid ? currentOrder.prepaid : 0));

if (currentOrder.shippingType == "SHIPPER_NO_COD" || !currentOrder.shippingType) {
	$("#shippingType").html("Shipper không thu tiền");
} else if (currentOrder.shippingType == "SHIPPER_COD") {
	$("#shippingType").html("Shipper thu tiền " + $("#willpay").html());
} else if (currentOrder.shippingType == "POST_COD") {
	$("#shippingCost").html("Khách thanh toán với bên vận chuyển");
	$("#titleWillpay").html("Thu COD:");
	$("#shippingType").html("Ship Viettelpost");
} else if (currentOrder.shippingType == "SHOPEE") {
	$("#shippingCost").html("Khách thanh toán với bên vận chuyển");
	$("#shippingType").html("Ship Shopee");
} else if (currentOrder.shippingType == "POST_NO_COD") {
	$("#shippingCost").html("Khách thanh toán với bên vận chuyển");
	$("#shippingType").html("Ship Viettelpost không COD");
}


if (!currentOrder.shippingCost) {
	$(".shippingCost").hide();
}

var prodListOrder = currentOrder.prodListOrder;

// console.log(prodListOrder.size);

// console.log(prodListOrder)

// console.log($("#portfolio"))

for (i in prodListOrder){
	if (prodListOrder[i].delete) {
		continue;
	}
	$("#lsTable").append("<tr>"+
	"<td>"+'<input type="checkbox" class="checkbox"/>'+"</td>"+	
    "<td>"+(parseInt(i)+1)+"</td>"+
    // "<td>"+prodListOrder[i].productName+"</td>"+
    "<td class='showImage borderMustard image_"+i+"'>"+prodListOrder[i].productName+"</td>"+
    "<td>"+prodListOrder[i].productCount+"</td>"+
    "<td>"+prodListOrder[i].productEstimateSellingVND+"</td>"+
  "</tr>")
}

$(".showImage").click(function(){
	var index = $(this).attr("class").split(" ").pop().split("_").pop();
	index = parseInt(index);
	// console.log("AA"+index);
	$("#myModal .modal-body").html('<img style="width:100%" src="'+prodListOrder[index].productImage+'" />')
    $('#myModal').modal('toggle');
})

var zoom = 1;

$("#zoomin").click(function(){
	console.log(document.body.style.zoom);
	zoom = zoom / 10;
	document.body.style.zoom  = zoom;
})
$("#zoomout").click(function(){
	console.log(document.body.style.zoom);
	zoom = zoom * 10;
	document.body.style.zoom = zoom;
})
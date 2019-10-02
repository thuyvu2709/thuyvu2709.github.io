
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

$("#paymentStatus").html("Thanh toán:"+(currentOrder.paymentStatus == "PAID" ? "Đã thanh toán" : "Chưa thanh toán"));

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
    "<td>"+(parseInt(i)+1)+"</td>"+
    // "<td>"+prodListOrder[i].productName+"</td>"+
    "<td><a href='"+prodListOrder[i].productImage+"'>"+prodListOrder[i].productName+"</a></td>"+
    "<td>"+prodListOrder[i].productCount+"</td>"+
    "<td>"+prodListOrder[i].productEstimateSellingVND+"</td>"+
  "</tr>")
}

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
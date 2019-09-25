// addNewProduct.js

// var sheetrange = 'Sheet1!A1:B1000';
// console.log('Sheet1!A1:'+ String.fromCharCode(65+numOfColumn));


// var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';
// var indexColumnOfAllData = 15;
// var sheetrange = 'Product!A:'+String.fromCharCode(65+indexColumnOfAllData);
// var dataset = [];


currentOrder = JSON.parse(localStorage.getItem("currentOrder"));

console.log(currentOrder);

$("#orderCode").html(currentOrder.orderCode);
$("#customerName").html(currentOrder.customerName);
$("#customerAddress").html(currentOrder.customerAddress);
$("#customerPhone").html(currentOrder.customerPhone);
$("#shippingCost").html(currentOrder.shippingCost);

$("#totalPayIncludeShip").html(currentOrder.totalPayIncludeShip);


if (!currentOrder.shippingCost) {
	$(".shippingCost").hide();
}

allText = "Mã đơn hàng: "+currentOrder.orderCode +"\n"+
"Tên khách hàng:"+currentOrder.customerName+"\n"+
"Địa chỉ khách hàng:"+currentOrder.customerAddress+"\n"+
"Số điện thoại khách hàng:"+currentOrder.customerPhone+"\n"+
"shippingCost:"+currentOrder.shippingCost+"\n";
// "Tổng tiền trả cả ship:"+currentOrder.shippingCost+"\n"+


var prodListOrder = currentOrder.prodListOrder;

// console.log(prodListOrder.size);

// console.log(prodListOrder)

for (i in prodListOrder){
	$("#lsTable").append("<tr>"+
    "<td>"+(parseInt(i)+1)+"</td>"+
    "<td>"+prodListOrder[i].productName+"</td>"+
    "<td>"+prodListOrder[i].productCount+"</td>"+
    "<td>"+prodListOrder[i].productEstimateSellingVND+"</td>"+
  "</tr>")
	allText = allText + 
		(parseInt(i)+1)+"-"+prodListOrder[i].productName+" (Số lượng:"+prodListOrder[i].productCount+")\n"
}

allText = allText +  "Tổng tiền trả cả ship:"+currentOrder.totalPayIncludeShip;


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
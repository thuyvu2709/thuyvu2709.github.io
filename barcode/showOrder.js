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

if (!currentOrder.shippingCost) {
	$(".shippingCost").hide();
}

$("#orderNode").html((currentOrder.orderNode ? currentOrder.orderNode : ""));
$("#orderNode").height( $("#orderNode")[0].scrollHeight );


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
	$("#lsTable").append("<tr>"+
    "<td>"+(parseInt(i)+1)+"</td>"+
    "<td>"+prodListOrder[i].productName+"</td>"+
    "<td>"+prodListOrder[i].productCount+"</td>"+
    "<td>"+prodListOrder[i].productEstimateSellingVND+"</td>"+
  "</tr>")
	allText = allText + 
		(parseInt(i)+1)+"-"+prodListOrder[i].productName+" (Số lượng:"+prodListOrder[i].productCount+")\n"
}

allText = allText +  "Tổng tiền trả cả ship:"+currentOrder.totalPayIncludeShip + "\n";

allText = allText + (currentOrder.paymentStatus == "PAID" ? "Khách hàng đã thanh toán\n" : "Khách hàng chưa thanh toán\n");

allText = allText + (currentOrder.orderNode ? "Chú ý:"+currentOrder.orderNode : "");

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

$("#requestShipping").click(function(){
	// var receiver = "kenkreck1004@gmail.com";
	// var cc = "levanthanh3005@gmail.com";
	$("#loadingSpin").show();
	// var roles = getSpecificRoles();
	// var receiver = roles["shipper"];
	// var cc = roles["manager"];
	// console.log(receiver);
	// console.log(cc);
	// sendOrderViaEmail(receiver, cc,currentOrder, function(e){
	// 	console.log("Sent");
	// 	console.log(e);
	// 	console.log("Email id:"+e.id+" can do reply email here");
	// 	var emailId = e.id;
	// 	var orderIndex = parseInt(currentOrder.orderIndex)+1;
		
	// 	getLatestShippingIndex(function(shipIndex){
	// 		var dataEditOrder = [
	// 			[
	// 				shipIndex,
	// 				emailId
	// 			]
	// 		];
	// 		var range = 'Order!L'+orderIndex +":M"+ orderIndex;

	// 		editOrder(dataEditOrder,range,function(){

	var dataShipping = [
		[
			currentOrder.orderCode,
			currentOrder.customerAddress,
			"'"+currentOrder.customerPhone,
			JSON.stringify(currentOrder),
			"Requested",
			"",
			"",
			currentOrder.shippingCost
		]
	];
	if(currentOrder.shipIndex == -1) {	 

		appendShipping(dataShipping, function(){
			console.log("Done request shipping")
			$("#loadingSpin").hide();
		},function(){
			console.log("Something wrong");
			$("#loadingSpin").hide();
		})
	} else {
		var sheetrange = 'Shipping!A'+currentOrder.shipIndex+':H'+currentOrder.shipIndex;
		updateShipping(dataShipping, sheetrange, function(){
			console.log("updated");
		}, function(){
			console.log("Something wrong");
		})
	}
	// 		});
	// 	})
	// });

})


$("#editOrder").click(function(){
	// console.log("AAA");
	window.location = "editorder.html"
})

$("#printOrder").click(function(){
	$(".controlOrder").hide();
	window.print();
	$(".controlOrder").show();

})

// function getLatestOrderCode(callback) {
//   var indexColumnOfAllData = 1;
//   var sheetrange = 'Order!A:'+String.fromCharCode(65+indexColumnOfAllData);
//   var dataset = [];

//   gapi.client.sheets.spreadsheets.values.get({
//       spreadsheetId: spreadsheetId,
//       range: sheetrange,
//   }).then(function(response) {
//       console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
//       dataset = response.result.values;
//       // showList(dataset);
//       var latestCode = parseFloat(dataset[dataset.length-1][0].split("_").pop())+1;

//       localStorage.setItem("orderCode","DONHANG_"+latestCode);

//       // window.productList = dataset;
//       callback();
//   }, function(response) {
//       console.log('Error: ' + response.result.error.message);
//   });
// }

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
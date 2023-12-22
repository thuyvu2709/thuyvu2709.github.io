// scriptTest.js

$("#btnTest").click(function(){
	var thecode = $("#scriptTest").val();

	var F = new Function(thecode);
	console.log(F());
})
$("#ExportData").click(function(){
	downloadFile("localStorage.txt", JSON.stringify(localStorage));
})

$("#ImportData").click(function(){
	$.getJSON( "/localStorage.txt", function(data) {
	    // Success
	    console.log("Import success")
	    console.log(data);
	    for(var e in data) {
			localStorage.setItem(e, data[e]);
	    }
	})
})

document.getElementById('ImportDataFromFile').addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
	const reader = new FileReader()
	reader.onload = function(event2) {

		var data = JSON.parse(event2.target.result);
		localStorage.clear();

		for(var e in data) {
			console.log(e);
			localStorage.setItem(e, data[e]);
	    }

	};
	reader.readAsText(event.target.files[0])
}
  
//   function handleFileLoad(event) {
// 	console.log(event);
// 	document.getElementById('fileContent').textContent = event.target.result;
//   }

// ///////FOR MERGEING

$("#loadDataToMerge").click(function(){
	console.log("loadDataToMerge");
	$("#currentDataInfor").html("");
	loadOrderList(function(){
		loadOrderListDetail(function(){
			loadProductList(function(){
				loadImportScheduleList(function(){
					  $("#currentDataInfor").html("Order:"+JSON.parse(localStorage.getItem("orderList")).length+" lines<br/>"+
					  	"OrderDetail:"+JSON.parse(localStorage.getItem("orderListDetail")).length+" lines<br/>"+
					  	"Product:"+JSON.parse(localStorage.getItem("productList")).length+" lines<br/>"+
					  	"Warehouse:"+JSON.parse(localStorage.getItem("warehouse")).length+" lines<br/>"
					  	)
				})
			})
		})
	})
})

var triggerAfterLoad = function(){
	getDatasetList(function(){
		// console.log("getDatasetList");
	  datasetList = JSON.parse(localStorage.getItem("DatasetList"));
	  // console.log(datasetList);
	  var content = '';
	  for (e in datasetList) {
	    if (e == 0) {
	      continue;
	    }
	    if (datasetList[e][1] == localStorage.getItem("mainSheetForProduct")) {
	    	continue;
	    };
	    content = content + '<div class="card">'+
	      '<div class="card-header">'+
	        '<h5 class="mb-0">'+
	          '<button class="btn btn-link datasetItem set_'+e+'">'+
	            datasetList[e][0]+
	          '</button>'+
	          datasetList[e][1]+
	        '</h5>'+
	      '</div>'+
	    '</div>';
	  }
	  // console.log(content);

	  $("#listDataset").html(content);

	  $("#dataMergeSource").html("From:"+localStorage.getItem("datasetName")+" with main id: "+localStorage.getItem("mainSheetForProduct") +" merge to:");

	  $(".datasetItem").click(function(){
	    var setIndex = parseInt($(this).attr("class").split(" ").pop().split("_").pop());
	    console.log("mainSheetForProduct"+datasetList[setIndex][1]);
	    console.log("shippingSheet"+datasetList[setIndex][2]);
	    console.log("datasetName"+datasetList[setIndex][0]);
	    mergeProcessing(datasetList[setIndex][1]);
	    // window.location = "/";
	  })

	  $("#currentDataInfor").html("Order:"+JSON.parse(localStorage.getItem("orderList")).length+" lines<br/>"+
	  	"OrderDetail:"+JSON.parse(localStorage.getItem("orderListDetail")).length+" lines<br/>"+
	  	"Product:"+JSON.parse(localStorage.getItem("productList")).length+" lines<br/>"+
	  	"Warehouse:"+JSON.parse(localStorage.getItem("warehouse")).length+" lines<br/>"
	  	)

	});
}

// mergeProcessing();

function parseOrderShipping(){
  lsOrderShipping = JSON.parse(localStorage.getItem("ordershipping"));;
  // console.log(lsOrderShipping);
  orderShipStatus = {};
  for (var e in lsOrderShipping) {
    if (e == 0) {
      continue;
    }
    if (!lsOrderShipping[e][0]){
      continue;
    }

    orderShipStatus[lsOrderShipping[e][0]] = {
      status : lsOrderShipping[e][4],
      stype : lsOrderShipping[e][8],
      paidStatus : lsOrderShipping[e][9],
      completeTime : lsOrderShipping[e][6],
      sindex : (parseInt(e)+1)
    }
  }
  return orderShipStatus;
}

function mergeProcessing(targetMainSheet) {
	console.log("mergeProcessing");
	var orderShipStatus = parseOrderShipping();

	data = JSON.parse(localStorage.getItem("orderList"));
	orderListDetail = JSON.parse(localStorage.getItem("orderListDetail"));
	lsOrderShipping = JSON.parse(localStorage.getItem("ordershipping"));;

	// var status = $("#orderFilter").val();
	var orderSheetData = [];
	var orderDetailSheetData = [];

	orderDetailSheetData.push(orderListDetail[0]);

	var warehouseIdLs = [];
	var productIdLs = [];
	var productCountInOrderDetail = {};

	for(var e in data) {
		if (e == 0) {
			orderSheetData.push(data[e]);
			continue;
		}
		if (!data[e][0]){
		  	continue;
		}

		// if (status == 'PROCESSING') {
		  if (data[e][8] == "PAID" && orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED") {
		    continue;
		  }
		  if (data[e][11]=="SHOPEE" && orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED") {
		    continue;
		  }
		  if (data[e][11]=="POST_COD" && orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED") {
		    continue;
		  }
		// } 

		// console.log(data[e]);
		data[e][5] = '=SUMIF(OrderDetail!A:A;INDIRECT(ADDRESS(ROW();1));OrderDetail!H:H)';
		data[e][7] = '=INDIRECT(ADDRESS(ROW();6)) + INDIRECT(ADDRESS(ROW();7))';
		data[e][9] = '=SUMIF(OrderDetail!A:A;INDIRECT(ADDRESS(ROW();1));OrderDetail!K:K) / COUNTIF(OrderDetail!A:A;INDIRECT(ADDRESS(ROW();1)))';
		orderSheetData.push(data[e]);
		for (var f in orderListDetail) {
			if (f == 0) {
				continue;
			}
			if (!orderListDetail[f][0]){
				continue;
			}
			if (orderListDetail[f][0]==data[e][0]){

				if (!productCountInOrderDetail[orderListDetail[f][3]]) {
					productCountInOrderDetail[orderListDetail[f][3]] = 0;
				}
				productCountInOrderDetail[orderListDetail[f][3]] = productCountInOrderDetail[orderListDetail[f][3]] + parseInt(orderListDetail[f][5])


				orderListDetail[f][3] = '=CONCATENATE(INDIRECT(ADDRESS(ROW();3));"_";INDIRECT(ADDRESS(ROW();2)))';
				orderListDetail[f][7] = '=INDIRECT(ADDRESS(ROW();6)) *  INDIRECT(ADDRESS(ROW();7))';
				orderListDetail[f][8] = '=VLOOKUP(INDIRECT(ADDRESS(ROW();4));Product!B:U;11;FALSE)';
				orderListDetail[f][9] = '=(INDIRECT(ADDRESS(ROW();7)) - INDIRECT(ADDRESS(ROW();9))) * INDIRECT(ADDRESS(ROW();6))';
				orderListDetail[f][10] = '=VLOOKUP(INDIRECT(ADDRESS(ROW();3));Warehouse!A:C;3;0)';
				orderDetailSheetData.push(orderListDetail[f]);
				warehouseIdLs.push(orderListDetail[f][2]);
				productIdLs.push(orderListDetail[f][3]);
			}
		}
	}

    // console.log(productIdLs);
	var productData = JSON.parse(localStorage.getItem("productList"));
	var productSheetData = [];
	productSheetData.push(productData[0]);

	// console.log(productCountInOrderDetail);

    for (var p in productData) {
		var ckP = false;
    	if (productIdLs.includes(productData[p][1])) {
    		ckP  = true;
    	} else if (parseInt(productData[p][17]) > 0) {
			ckP  = true;
    		warehouseIdLs.push(productData[p][2]);
    	}

		if (ckP == true) {
			var totalCount = parseInt(productData[p][17]) + productCountInOrderDetail(productData[p][1]);
			productData[p][4] = totalCount;
			productSheetData.push(productData[p]);
		}
    }

	var warehouseData = JSON.parse(localStorage.getItem("warehouse"));
	var warehouseSheetData = [];
	warehouseSheetData.push(warehouseData[0]);

    for (var w in warehouseData) {
    	if (warehouseIdLs.includes(warehouseData[w][0])) {
			warehouseData[w][4] = "=sumif(Product!C:C;INDIRECT(ADDRESS(ROW();1));Product!R:R)";
    		warehouseSheetData.push(warehouseData[w]);
    	}
    }

    // console.log(warehouseSheetData);
    // console.log(orderSheetData);
	// console.log(orderDetailSheetData);
    // console.log(productSheetData);
    addData(targetMainSheet,warehouseSheetData,"Warehouse", function(){
		console.log("warehouseSheetData : Done");
	    addData(targetMainSheet,orderSheetData,"Order", function(){
			console.log("orderSheetData : Done");
		    addData(targetMainSheet,orderDetailSheetData,"OrderDetail", function(){
				console.log("orderDetailSheetData : Done");
			    addData(targetMainSheet,productSheetData,"Product", function(){
    				console.log("Done");
    			});		
    		});
    	});
    });
};

function addData(targetMainSheet,data, tableName, callback) {
  var spreadsheetId = targetMainSheet;
  console.log("addData:  to : "+targetMainSheet);
  var numOfColumn = data[0].length;
  // console.log(numOfColumn);
  var range = tableName+'!A1:'+ String.fromCharCode(65+numOfColumn);

  if (passDataLocalhost) {
    callback();
  }

  if(!gapi.client.sheets) {
    callback();
    console.log("addWarehouse : please authorize")
    return;
  }

  gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: "USER_ENTERED",
      resource: {
          "majorDimension": "ROWS",
          "values": data
      }
  }).then(function(response) {
    var result = response.result;
    console.log(`${result.updatedCells} cells updated.`);
    // finishOrder();
    // addDetailOrder();
    // updateOneByOne(index+1);
    callback();
  }, function(response) {
      appendPre('Error: ' + response.result.error.message);
  });
}


function fullMergeMainSheet() {
	var targetMainSheet = "1GDYy_fy2xix4JqkWOIarvPOeFh7v2NNmA2efT-uJMs8"
	
	console.log("mergeProcessing");

	var warehouseData = JSON.parse(localStorage.getItem("warehouse"));
	var warehouseSheetData = [];

    for (var w in warehouseData) {
		warehouseSheetData.push(warehouseData[w]);
    }

	var orderDetailData = JSON.parse(localStorage.getItem("orderListDetail"));
	var orderDetailSheetData = [];

    for (var i in orderDetailData) {
		orderDetailSheetData.push(orderDetailData[i])
    }

	var orderData = JSON.parse(localStorage.getItem("orderList"));
	var orderSheetData = [];

    for (var i in orderData) {
		orderSheetData.push(orderData[i])
    }

	var productData = JSON.parse(localStorage.getItem("productList"));
	var productSheetData = [];

    for (var p in productData) {
		productSheetData.push(productData[p]);
    }

    // console.log(warehouseSheetData);
    // console.log(orderSheetData);
	// console.log(orderDetailSheetData);
    // console.log(productSheetData);
    addData(targetMainSheet,warehouseSheetData,"Warehouse", function(){
		console.log("warehouseSheetData : Done");
	    addData(targetMainSheet,orderSheetData,"Order", function(){
			console.log("orderSheetData : Done");
		    addData(targetMainSheet,orderDetailSheetData,"OrderDetail", function(){
				console.log("orderDetailSheetData : Done");
			    addData(targetMainSheet,productSheetData,"Product", function(){
    				console.log("Done");
    			});		
    		});
    	});
    });
};

function fullMergeShippingSheet() {
	var targetShippping = "1kkXyG5HaSHdkuPGMxj31rOibztYIVKlgfWJHoUtDyZs"
	
	console.log("mergeProcessing");

	var shippingData = JSON.parse(localStorage.getItem("ordershipping"));
	var shippingSheetData = [];

    for (var i in shippingData) {
		shippingSheetData.push(shippingData[i]);
    }

    addData(targetShippping,shippingSheetData,"Shipping", function(){
		console.log("shippingSheetData : Done");
    });
};

function fullMergeCustomerSheet() {
	var targetSheet = "11dq9d1UQ8PlDYQbIencMX71JlLk09HugE2hDpDaKhgk"
	
	console.log("mergeProcessing");

	var customerData = JSON.parse(localStorage.getItem("customerList"));
	// var customerSheetData = [];

    // for (var i in customerSheetData) {
	// 	customerData.push(customerSheetData[i]);
    // }

    addData(targetSheet,customerData,"Customer", function(){
		console.log("Customer : Done");
    });
};

function fullMergeProductCatalogList() {
	var targetSheet = "11dq9d1UQ8PlDYQbIencMX71JlLk09HugE2hDpDaKhgk"
	
	console.log("mergeProcessing");

	var data = JSON.parse(localStorage.getItem("productCatalogList"));
	// var sheetData = [];

    // for (var i in customerSheetData) {
	// 	shet.push(customerSheetData[i]);
    // }

    addData(targetSheet,data,"ProductCatalog", function(){
		console.log("ProductCatalog : Done");
    });
}
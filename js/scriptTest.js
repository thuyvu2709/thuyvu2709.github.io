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
	$.getJSON( "/localstorage.txt", function(data) {
	    // Success
	    console.log("Import success")
	    console.log(data);
	    for(var e in data) {
			localStorage.setItem(e, data[e]);
	    }
	})
})


// ///////FOR MERGEING

$("#loadDataToMerge").click(function(){
	console.log("loadDataToMerge");
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

getDatasetList(function(){
	console.log("getDatasetList");
  datasetList = JSON.parse(localStorage.getItem("DatasetList"));
  console.log(datasetList);
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
  console.log(content);

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
	var warehouseIdLs = [];
	var productIdLs = [];

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
		orderSheetData.push(data[e]);
		for (var f in orderListDetail) {
			if (f == 0) {
				orderDetailSheetData.push(orderListDetail[f]);
				continue;
			}
			if (!orderListDetail[f][0]){
				continue;
			}
			if (orderListDetail[f][0]==data[e][0]){
				orderDetailSheetData.push(orderListDetail[f]);
				warehouseIdLs.push(orderListDetail[f][2]);
				productIdLs.push(orderListDetail[f][3]);
			}
		}
	}


	var warehouseData = JSON.parse(localStorage.getItem("warehouse"));
	var warehouseSheetData = [];
	warehouseSheetData.push(warehouseData[0]);

    for (var w in warehouseData) {
    	if (warehouseIdLs.includes(warehouseData[w][0])) {
    		warehouseSheetData.push(warehouseData[w]);
    	}
    }

    // console.log(productIdLs);
	var productData = JSON.parse(localStorage.getItem("productList"));
	var productSheetData = [];
	productSheetData.push(productData[0]);

    for (var p in productData) {
    	if (productIdLs.includes(productData[p][1])) {
    		productSheetData.push(productData[p]);
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
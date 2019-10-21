var mainSheetForProduct = '1QEO7O0jtOVrWSVTc5EnYs03PNHqDS7nspWC2CzaZP_c';
var roleSheet = '15y7rVe9z9O1y1ISNxQMQbx-rVTY9hU7ePlEO86kpMd0';
var shippingSheet = '1sN3aFKDTAjPJNNSHX2TssCY5S0mwcbmtJe4AyBAMtMY';
var hostname = window.location.hostname;
var passDataLocalhost = (hostname == "localhost");

var historyPath = [];
try {
  historyPath = JSON.parse(localStorage.getItem("historyPath"));
} catch(e) {
  historyPath = [];
}

saveHistory();

function saveHistory(){
  var currentHref = window.location.pathname;
  // console.log(window.location);
  // console.log(currentHref);
  if (!historyPath) {
    historyPath = [];
  };
  
  if (historyPath[historyPath.length-1] == currentHref) {
    return;
  }

  historyPath.push(currentHref);
  // console.log(historyPath);

  localStorage.setItem("historyPath",JSON.stringify(historyPath));
}
function cleanHistory() {
  // var last = historyPath.pop();
  localStorage.setItem("historyPath",JSON.stringify([historyPath.pop()]));
}
function backPage() {
  console.log("back");
  historyPath.pop();
  var backHref = historyPath.pop();
  localStorage.setItem("historyPath",JSON.stringify(historyPath));

  window.location = backHref;
}

function comeBackHomeToAuthorize(){
    $("#loadingSpin").hide();
    console.log("Need to comeBackHomeToAuthorize");
    console.log(window.location);
    var hostname = window.location.hostname;
    if (hostname == "localhost" 
        || hostname == "10.7.136.107"
        || hostname == "172.20.10.6"
        || pageName == "index") {
        return;
    } else {
        window.location = "/";
    }
}

function loadProductList(callback) {
  var spreadsheetId = mainSheetForProduct;
  var indexColumnOfAllData = 19;
  var sheetrange = 'Product!A:'+String.fromCharCode(65+indexColumnOfAllData);
  var dataset = [];

  console.log("loadProductList:"+sheetrange);

  if (passDataLocalhost) {
    callback();
    return;
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetrange,
  }).then(function(response) {
      // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
      dataset = response.result.values;
      // showList(dataset);
      localStorage.setItem("productList",JSON.stringify(dataset));

      callback(dataset);
  }, function(response) {
      console.log('Error: ' + response.result.error.message);
  });
}

function loadImportScheduleList(callback) {
  var spreadsheetId = mainSheetForProduct;
  var indexColumnOfAllData = 5;
  var sheetrange = 'Warehouse!A:'+String.fromCharCode(65+indexColumnOfAllData);
  var dataset = [];

  console.log("loadImportScheduleList:"+sheetrange);

  if (passDataLocalhost) {
    callback();
    return;
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetrange,
  }).then(function(response) {
      // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
      dataset = response.result.values;
      // showList(dataset);
      localStorage.setItem("warehouse",JSON.stringify(dataset));

      callback();
  }, function(response) {
      console.log('Error: ' + response.result.error.message);
  });
}

function getLatestProductCode(callback) {
  var spreadsheetId = mainSheetForProduct;

  console.log("getLatestProductCode");

  var indexColumnOfAllData = 1;
  var sheetrange = 'Product!A:'+String.fromCharCode(65+indexColumnOfAllData);
  var dataset = [];

  if (passDataLocalhost) {
    callback();
    return;
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetrange,
  }).then(function(response) {
      // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
      dataset = response.result.values;
      // showList(dataset);
      // localStorage.setItem("orderCode","DONHANG_"+dataset.length);
      var latestCode = 0;
      for (var e in dataset) {
        var code = parseInt(dataset[e][0]);
        if (latestCode < code) {
          latestCode = code; 
        }
      }
      latestCode = latestCode+1;

      localStorage.setItem("productLatestCode",latestCode);

      callback(latestCode);
  }, function(response) {
      console.log('Error: ' + response.result.error.message);
  });
}

function getLatestOrderCode(callback) {
  var spreadsheetId = mainSheetForProduct;

  console.log("getLatestOrderCode");

  var indexColumnOfAllData = 1;
  var sheetrange = 'Order!A:'+String.fromCharCode(65+indexColumnOfAllData);
  var dataset = [];

  if (passDataLocalhost) {
    callback();
    return;
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetrange,
  }).then(function(response) {
      // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
      dataset = response.result.values;
      // showList(dataset);
      // localStorage.setItem("orderCode","DONHANG_"+dataset.length);
      var latestCode = parseFloat(dataset[dataset.length-1][0].split("_").pop())+1;

      localStorage.setItem("orderCode","DONHANG_"+latestCode);

      callback();
  }, function(response) {
      console.log('Error: ' + response.result.error.message);
  });
}

function getLatestTaskCode(callback) {
  var spreadsheetId = shippingSheet;

  console.log("getLatestTaskCode");

  var indexColumnOfAllData = 1;
  var sheetrange = 'Task!A:'+String.fromCharCode(65+indexColumnOfAllData);
  var dataset = [];

  if (passDataLocalhost) {
    callback();
    return;
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetrange,
  }).then(function(response) {
      // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
      dataset = response.result.values;
      // showList(dataset);
      // localStorage.setItem("orderCode","DONHANG_"+dataset.length);
      var latestCode = parseFloat(dataset[dataset.length-1][0])+1;

      // localStorage.setItem("taskCode","DONHANG_"+latestCode);

      callback(latestCode);
  }, function(response) {
      console.log('Error: ' + response.result.error.message);
  });
}


function getLatestImportCode(callback) {
  var spreadsheetId = mainSheetForProduct;

  console.log("getLatestTaskCode");

  var indexColumnOfAllData = 1;
  var sheetrange = 'Warehouse!A:'+String.fromCharCode(65+indexColumnOfAllData);
  var dataset = [];

  if (passDataLocalhost) {
    callback();
    return;
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetrange,
  }).then(function(response) {
      // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
      dataset = response.result.values;
      // showList(dataset);
      // localStorage.setItem("orderCode","DONHANG_"+dataset.length);
      var latestCode = parseFloat(dataset[dataset.length-1][0])+1;

      // localStorage.setItem("taskCode","DONHANG_"+latestCode);

      callback(latestCode);
  }, function(response) {
      console.log('Error: ' + response.result.error.message);
  });
}


function loadOrderList(callback) {

  console.log("loadOrderList");
  var spreadsheetId = mainSheetForProduct;


  var indexColumnOfAllData = 12;
  var sheetrange = 'Order!A:'+String.fromCharCode(65+indexColumnOfAllData);

  if (passDataLocalhost) {
    callback();
    return;
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetrange,
  }).then(function(response) {
      // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
      dataset = response.result.values;
      // showList(dataset);
      localStorage.setItem("orderList",JSON.stringify(dataset));

      callback();
  }, function(response) {
      console.log('Error: ' + response.result.error.message);
  });
}

function loadReport(callback) {

  console.log("loadReport");
  
  var spreadsheetId = mainSheetForProduct;

  var indexColumnOfAllData = 2;
  var sheetrange = 'Report!A:'+String.fromCharCode(65+indexColumnOfAllData);

  if (passDataLocalhost) {
    callback();
    return;
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetrange,
  }).then(function(response) {
      // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
      dataset = response.result.values;
      // showList(dataset);
      localStorage.setItem("report",JSON.stringify(dataset));

      callback();
  }, function(response) {
      console.log('Error: ' + response.result.error.message);
  });
}

function loadOrderListDetail(callback) {

  console.log("loadOrderListDetail");

  var spreadsheetId = mainSheetForProduct;


  if (passDataLocalhost) {
    callback();
    return;
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  var indexColumnOfAllData = 10;
  var sheetrange = 'OrderDetail!A:'+String.fromCharCode(65+indexColumnOfAllData);

  gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetrange,
  }).then(function(response) {
      // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
      dataset = response.result.values;
      // showList(dataset);
      localStorage.setItem("orderListDetail",JSON.stringify(dataset));

      callback();
  }, function(response) {
      console.log('Error: ' + response.result.error.message);
  });
}

function loadWarehouse(callback) {

  console.log("loadWarehouse");

  var spreadsheetId = mainSheetForProduct;


  if (passDataLocalhost) {
    callback();
    return;
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  var indexColumnOfAllData = 9;
  var sheetrange = 'Warehouse!A:'+String.fromCharCode(65+indexColumnOfAllData);

  gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetrange,
  }).then(function(response) {
      // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
      dataset = response.result.values;
      // showList(dataset);
      localStorage.setItem("warehouse",JSON.stringify(dataset));

      callback();
  }, function(response) {
      console.log('Error: ' + response.result.error.message);
  });
}


function appendOrderDetail(submitData,callback) {
  var numOfColumn = 10;
  var sheetrange = 'OrderDetail!A1:'+ String.fromCharCode(65+numOfColumn);
  var spreadsheetId = mainSheetForProduct;


  if (passDataLocalhost) {
    callback();
    return;
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: sheetrange,
        valueInputOption: "USER_ENTERED",
        resource: {
            "majorDimension": "ROWS",
            "values": submitData
        }
    }).then(function(response) {
      var result = response.result;
      console.log(`${result.updatedCells} cells updated.`);
      // finishOrder();
      callback();
      // addDetailOrder();

    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
}

function appendOrder(submitOrderData,callback) {
  var numOfColumn = 13;
  var sheetrange = 'Order!A1:'+ String.fromCharCode(65+numOfColumn);
  var spreadsheetId = mainSheetForProduct;

  if (passDataLocalhost) {
    callback();
    return;
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: sheetrange,
        valueInputOption: "USER_ENTERED",
        resource: {
            "majorDimension": "ROWS",
            "values": submitOrderData
        }
    }).then(function(response) {
        var result = response.result;
      // console.log(`${result.updatedCells} cells updated.`);
      // $("#modelContent").html("Đã lưu đơn hàng");
      // $('#myModal').modal('toggle');
        callback();

    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
}

function appendTask(submitTaskData,callback) {
  var numOfColumn = 4;
  var sheetrange = 'Task!A1:'+ String.fromCharCode(65+numOfColumn);
  var spreadsheetId = shippingSheet;

  if (passDataLocalhost) {
    callback();
    return;
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: sheetrange,
        valueInputOption: "USER_ENTERED",
        resource: {
            "majorDimension": "ROWS",
            "values": submitTaskData
        }
    }).then(function(response) {
        var result = response.result;
        console.log(`${result.updatedCells} cells updated.`);
      // $("#modelContent").html("Đã lưu đơn hàng");
      // $('#myModal').modal('toggle');
        callback();

    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
}


function appendWarehouse(submitImportData,callback) {
  var numOfColumn = 9;
  var sheetrange = 'Warehouse!A1:'+ String.fromCharCode(65+numOfColumn);
  var spreadsheetId = mainSheetForProduct;

  if (passDataLocalhost) {
    callback();
    return;
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: sheetrange,
        valueInputOption: "USER_ENTERED",
        resource: {
            "majorDimension": "ROWS",
            "values": submitImportData
        }
    }).then(function(response) {
        var result = response.result;
      // console.log(`${result.updatedCells} cells updated.`);
      // $("#modelContent").html("Đã lưu đơn hàng");
      // $('#myModal').modal('toggle');
        callback();

    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
}

function appendProduct(dataAppendProduct, callback, callbackError) {
    var numOfColumn = 19;
    var sheetrange = 'Product!A1:'+ String.fromCharCode(65+numOfColumn);

    var spreadsheetId = mainSheetForProduct;

  if (passDataLocalhost) {
    callback();
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: sheetrange,
        valueInputOption: "USER_ENTERED",
        resource: {
            "majorDimension": "ROWS",
            "values": dataAppendProduct
        }
    }).then(function(response) {
        var result = response.result;
        console.log(`${result.updatedCells} cells updated.`);

        callback()

    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
      // $("#modelContent").html("Có lỗi, không thể lưu");
      // $('#myModal').modal('toggle');
        callbackError();
    });
}

function editOrderDetail(dataEditOD, range, callback) {
  var spreadsheetId = mainSheetForProduct;


  if (passDataLocalhost) {
    callback();
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: "USER_ENTERED",
      resource: {
          "majorDimension": "ROWS",
          "values": dataEditOD
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


function editOrder(dataEditOrder,range,callback){
  
  var spreadsheetId = mainSheetForProduct;
  // var sheetrange = range;

  // console.log(sheetrange);
  
  if (passDataLocalhost) {
    callback();
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: "USER_ENTERED",
        resource: {
            "majorDimension": "ROWS",
            "values": dataEditOrder
        }
    }).then(function(response) {
        var result = response.result;
      // console.log(`${result.updatedCells} cells updated.`);
      // $("#modelContent").html("Đã lưu đơn hàng");
      // $('#myModal').modal('toggle');
        callback();

    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
}

function editWarehouse(dataEditWarehouse,range,callback){
  
  var spreadsheetId = mainSheetForProduct;
  // var sheetrange = range;

  // console.log(sheetrange);
  
  if (passDataLocalhost) {
    callback();
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: "USER_ENTERED",
        resource: {
            "majorDimension": "ROWS",
            "values": dataEditWarehouse
        }
    }).then(function(response) {
        var result = response.result;
      // console.log(`${result.updatedCells} cells updated.`);
      // $("#modelContent").html("Đã lưu đơn hàng");
      // $('#myModal').modal('toggle');
        callback();

    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
}


function editProduct(dataEditP, range,callback, callbackError) {
  
  console.log("editProduct");

  var spreadsheetId = mainSheetForProduct;
  // var sheetrange = range;

  if (passDataLocalhost) {
    callback();
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: "USER_ENTERED",
        resource: {
            "majorDimension": "ROWS",
            "values": dataEditP
        }
    }).then(function(response) {
        var result = response.result;
        console.log(`${result.updatedCells} cells updated.`);
      // $("#modelContent").html("Đã sửa mặt hàng");
      // $('#myModal').modal('toggle');
        callback();
    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
      // $("#modelContent").html("Có lỗi, không thể lưu");
      // $('#myModal').modal('toggle');
      callbackError();
    });
}

function getRoleList(callback) {
  var spreadsheetId = roleSheet;

  if (passDataLocalhost) {
    callback();
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  var indexColumnOfAllData = 3;
  var sheetrange = 'Roles!A:'+String.fromCharCode(65+indexColumnOfAllData);

  gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetrange,
  }).then(function(response) {
      // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
      dataset = response.result.values;
      // showList(dataset);
      localStorage.setItem("roles",JSON.stringify(dataset));

      callback(dataset);
  }, function(response) {
      console.log('Error: ' + response.result.error.message);
  });
}

function loadOtherFee(callback) {
  var spreadsheetId = mainSheetForProduct;

  if (passDataLocalhost) {
    callback();
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  var indexColumnOfAllData = 4;
  var sheetrange = 'OtherFees!A:'+String.fromCharCode(65+indexColumnOfAllData);

  gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetrange,
  }).then(function(response) {
      // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
      dataset = response.result.values;
      // showList(dataset);
      localStorage.setItem("otherFees",JSON.stringify(dataset));

      callback(dataset);
  }, function(response) {
      console.log('Error: ' + response.result.error.message);
  });
}

function getCurrentUser() {
    var auth2 = gapi.auth2.getAuthInstance();
    
    if (auth2.isSignedIn.get()) {
      var profile = auth2.currentUser.get().getBasicProfile();
      // console.log('ID: ' + profile.getId());
      // console.log('Full Name: ' + profile.getName());
      // console.log('Given Name: ' + profile.getGivenName());
      // console.log('Family Name: ' + profile.getFamilyName(),);
      // console.log('Image URL: ' + profile.getImageUrl());
      // console.log('Email: ' + profile.getEmail());
      return ({
        status : true,
        id : profile.getId(),
        name : profile.getName(),
        givenName : profile.getGivenName(),
        familyName : profile.getFamilyName(),
        imageUrl : profile.getImageUrl(),
        email : profile.getEmail()
      })
    };
    return {
      status :false
    }
}

function appendShipping(dataAppendShipping, callback, callbackError) {
  var numOfColumn = 7;
  var sheetrange = 'Shipping!A1:'+ String.fromCharCode(65+numOfColumn)+"1";

  var spreadsheetId = shippingSheet;

  if (passDataLocalhost) {
    callback();
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: sheetrange,
        valueInputOption: "USER_ENTERED",
        resource: {
            "majorDimension": "ROWS",
            "values": dataAppendShipping
        }
    }).then(function(response) {
        var result = response.result;
        console.log(`${result.updatedCells} cells updated.`);

        callback()

    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
      // $("#modelContent").html("Có lỗi, không thể lưu");
      // $('#myModal').modal('toggle');
        callbackError();
    });
}

function updateShipping(dataUpdateShipping, sheetrange, callback, callbackError) {
    // var numOfColumn = 5;
    // var sheetrange = 'Shipping!A1:'+ String.fromCharCode(65+numOfColumn);

    var spreadsheetId = shippingSheet;

  if (passDataLocalhost) {
    callback();
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: sheetrange,
        valueInputOption: "USER_ENTERED",
        resource: {
            "majorDimension": "ROWS",
            "values": dataUpdateShipping
        }
    }).then(function(response) {
        var result = response.result;
        console.log(`${result.updatedCells} cells updated.`);

        callback()

    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
      // $("#modelContent").html("Có lỗi, không thể lưu");
      // $('#myModal').modal('toggle');
        callbackError();
    });
}

function getLatestShippingIndex(callback) {
  var spreadsheetId = shippingSheet;

  console.log("getLatestShippingIndex");

  if (passDataLocalhost) {
    callback();
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  var indexColumnOfAllData = 1;
  var sheetrange = 'Shipping!A:'+String.fromCharCode(65+indexColumnOfAllData);
  var dataset = [];

  gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetrange,
  }).then(function(response) {
      console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
      dataset = response.result.values;

      callback(dataset.length);
  }, function(response) {
      console.log('Error: ' + response.result.error.message);
  });
}

function updateOrderStatus(line, column, value, callback) {
    var spreadsheetId = mainSheetForProduct;

    var sheetrange = 'Order!'+String.fromCharCode(65+column) + line+":"+String.fromCharCode(65+column) + line;
    console.log(sheetrange);
    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: sheetrange,
        valueInputOption: "USER_ENTERED",
        resource: {
            "majorDimension": "ROWS",
            "values": [
                [
                  value
                ]
            ]
        }
    }).then(function(response) {
        var result = response.result;
        callback();
    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
  }


function getOrderShipping(callback) {
  var spreadsheetId = shippingSheet;

  console.log("getOrderShipping");

  var indexColumnOfAllData = 9;
  var sheetrange = 'Shipping!A:'+String.fromCharCode(65+indexColumnOfAllData);
  var dataset = [];

  if (passDataLocalhost) {
    callback();
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetrange,
  }).then(function(response) {
      // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
      dataset = response.result.values;

      localStorage.setItem("ordershipping",JSON.stringify(dataset));


      callback(dataset);
  }, function(response) {
      console.log('Error: ' + response.result.error.message);
  });
}

function getTaskList(callback) {
  var spreadsheetId = shippingSheet;

  console.log("getTaskList");

  var indexColumnOfAllData = 5;
  var sheetrange = 'Task!A:'+String.fromCharCode(65+indexColumnOfAllData);
  var dataset = [];

  if (passDataLocalhost) {
    callback();
  }

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetrange,
  }).then(function(response) {
      // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
      dataset = response.result.values;

      localStorage.setItem("tasklist",JSON.stringify(dataset));


      callback(dataset);
  }, function(response) {
      console.log('Error: ' + response.result.error.message);
  });
}

function editDataInSheet(spreadsheets, sheetrange, data, callback, callbackError){
  gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheets,
        range: sheetrange,
        valueInputOption: "USER_ENTERED",
        resource: {
            "majorDimension": "ROWS",
            "values": data
        }
    }).then(function(response) {
      callback();
    }, function(response) {
        // appendPre('Error: ' + response.result.error.message);
      callbackError();
    });
}

function appendDataInSheet(spreadsheets, sheetrange, data, callback, callbackError){
  gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheets,
        range: sheetrange,
        valueInputOption: "USER_ENTERED",
        resource: {
            "majorDimension": "ROWS",
            "values": data
        }
    }).then(function(response) {
      callback();
    }, function(response) {
        // appendPre('Error: ' + response.result.error.message);
      callbackError();
    });
}

function sendEmail(headers_obj, message, callback){
    // var email = '';

    // for(var header in headers_obj) {
    //   email += header += ": "+headers_obj[header]+"\r\n";
    // }

    // email += "\r\n" + message;

    // var sendRequest = gapi.client.gmail.users.messages.send({
    //   'userId': 'me',
    //   'resource': {
    //     'raw': b64EncodeUnicode(email).replace(/\+/g, '-').replace(/\//g, '_')
    //   }
    // });
    // // sendRequest.execute(function(){console.log("done")});

    // return sendRequest.execute(callback);
    callback({
      id : "1234"
    })
    // sendEmail("levanthanh3005@gmail.com","vanle@unibz.it","Test","Test",function(){console.log("done")});
}

function getSpecificRoles(){
  var roles = JSON.parse(localStorage.getItem("roles"));
  var shipper = "";
  var manager = "";  
  var marketer = "";
  console.log(roles);
  for (var e in roles) {
    if (roles[e][1] == "shipper") {
      shipper += roles[e][0]+";";
    } else if (roles[e][1] == "manager" 
      && roles[e][0]!="thuy.vtlminhlong@gmail.com"
      ) {
      manager += roles[e][0]+";";
    } else if (roles[e][1] == "marketer" 
      ) {
      marketer += roles[e][0]+";";
    }
  }
  return {
    "shipper" : shipper,
    "manager" : manager,
    "marketer" :marketer
  }
}

function requestShipping(currentOrder){
  $("#loadingSpin").show();

  var dataShipping = [
    [
      currentOrder.orderCode,
      currentOrder.customerAddress,
      "'"+currentOrder.customerPhone,
      JSON.stringify(currentOrder),
      "Requested",
      currentOrder.otherCost,
      "",
      currentOrder.shippingCost
    ]
  ];
  if(currentOrder.shipIndex == -1 || !currentOrder.shipIndex) {  
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
      console.log("updated:"+currentOrder.shipIndex);
      $("#loadingSpin").hide();
    }, function(){
      console.log("Something wrong");
    })
  }
}

function splitOrderAvailable(currentOrder,callbackSplitOrderMain){
  // $("#loadingSpin").show();
  //Add new order
  var orderCode;

  var dataProdListOrderReady = [];
  var dataProfListOrderRemoveSplit = [];
  var dataRangeRemoveSplit = []
  var prodListOrder = currentOrder.prodListOrder;
  var numOfColumnOrderDetail = 10;

  function prepareProdListOrder(){
    for (var e in prodListOrder) {
      if (prodListOrder[e].available == 1) {
        // prodListOrderReady.push(prodListOrder[e]);
        dataProdListOrderReady.push([
          orderCode,
          prodListOrder[e].productCode,
          prodListOrder[e].importCode,
          '=CONCATENATE(INDIRECT(ADDRESS(ROW(),3)),"_",INDIRECT(ADDRESS(ROW(),2)))',
          prodListOrder[e].productName,
          prodListOrder[e].productCount,
          prodListOrder[e].productEstimateSellingVND,
          "=INDIRECT(ADDRESS(ROW(),6)) *  INDIRECT(ADDRESS(ROW(),7))",
          "=VLOOKUP(INDIRECT(ADDRESS(ROW(),4)),Product!B:U,11,FALSE)",
          "=(INDIRECT(ADDRESS(ROW(),7)) - INDIRECT(ADDRESS(ROW(),9))) * INDIRECT(ADDRESS(ROW(),6))",
          "=VLOOKUP(INDIRECT(ADDRESS(ROW(),3)),Warehouse!A:C,3,0)"
        ])

        // dataProfListOrderRemoveSplit.push([
        //   "","","","","","","","","","",""
        // ])
        var orderDetailIndex = parseInt(prodListOrder[e].orderDetailIndex) + 1;

        dataRangeRemoveSplit.push("OrderDetail!A"+orderDetailIndex+":"+String.fromCharCode(65+numOfColumnOrderDetail)+orderDetailIndex);
      }
    }
  }


  var splitAddNewOrder = function (callbackSplitAddNew) {

    var submitOrderData = [
        [
          orderCode,
          currentOrder.orderDate,
          currentOrder.customerName,
          currentOrder.customerAddress,
          "'"+currentOrder.customerPhone,
          "=SUMIF(OrderDetail!A:A,INDIRECT(ADDRESS(ROW(),1)),OrderDetail!H:H)",
          currentOrder.shippingCost,
          "=INDIRECT(ADDRESS(ROW();6)) + INDIRECT(ADDRESS(ROW();7))",
          "ORDERED",
          "=SUMIF(OrderDetail!A:A,INDIRECT(ADDRESS(ROW(),1)),OrderDetail!K:K) / COUNTIF(OrderDetail!A:A,INDIRECT(ADDRESS(ROW(),1)))",
          currentOrder.orderNode,
          "",
          currentOrder.otherCost
        ]
    ]

    appendOrder(submitOrderData,function(){
      appendOrderDetail(dataProdListOrderReady,callbackSplitAddNew);
    });
  }

  var fRemove = function(){
    console.log("fEdit")
    if (dataRangeRemoveSplit.length > 0) {
      // var numOfColumn = 6;

      var updateOneByOne = function (index) {
        if (index<dataRangeRemoveSplit.length) {

          console.log("Remove:");
          console.log(dataRangeRemoveSplit[index])

          var dataEditOD = [
            ["","","","","","","","","","",""]
          ] 
          
          editOrderDetail(dataEditOD, dataRangeRemoveSplit[index], function(){
            updateOneByOne(index+1);
          })

        } else {
          callbackSplitOrderMain();
          return;
        }
      }
      updateOneByOne(0);
    }
  }

  getLatestOrderCode(function(){
    orderCode = localStorage.getItem("orderCode");
    prepareProdListOrder();
    splitAddNewOrder(function(){
      fRemove();
    });
  })
}

function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

function removeSpecialAlias(str){
  return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
}

function parseDate(str) {//2019-9-4 16:19:31
  var sdate = str.split(" ")[0];
  var stime = str.split(" ")[1];

  var syear = sdate.split("-")[0];
  var smonth =sdate.split("-")[1];
  var sday =sdate.split("-")[2];

  var shour = stime.split(":")[0];
  var smin = stime.split(":")[1];
  var ssec = stime.split(":")[2];
  return {
    date : sdate,
    time : stime,
    year : syear,
    month : smonth,
    day : sday,
    hour : shour,
    min : smin,
    sec : ssec,
    monthyear : smonth+"-"+syear
  }
}
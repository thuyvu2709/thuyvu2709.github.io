

// var datasetName = 2019;
// var mainSheetForProduct = '1QEO7O0jtOVrWSVTc5EnYs03PNHqDS7nspWC2CzaZP_c';
// var roleSheet = '15y7rVe9z9O1y1ISNxQMQbx-rVTY9hU7ePlEO86kpMd0';
// var shippingSheet = '1sN3aFKDTAjPJNNSHX2TssCY5S0mwcbmtJe4AyBAMtMY';

var datasetName = 2020;

var roleSheet = '1VAolcxUn4Zp9Xmqck_b4m8d1LAGX7xesgqGiNxctA3s';
//roleSheet always keep

var mainSheetForProduct = '1u6eIlj1JUaNjDb0bjSueW5EeCjWMmQPquwUXADQc_p0';
var shippingSheet = '1_s-3RUe6oHb0mPISZWFSnrafP7MMt1D7iJnqXYR3tqw';

var customerSheet = '11dq9d1UQ8PlDYQbIencMX71JlLk09HugE2hDpDaKhgk';
// var bscSheet = '16UKch39mTWBvvyxyrH_KiEBHP7y2l_cQrRpFN8NvMmQ';

var storeAddress = {
  "SENDER_FULLNAME": "Lê Phan Xuân An",
  "SENDER_ADDRESS": "ngõ 153, PHƯỜNG PHÚ ĐÔ, QUẬN NAM TỪ LIÊM, Hà Nội",
  "SENDER_PHONE": "0376180193",
  "SENDER_EMAIL": "lean23062001@gmail.com",
  "SENDER_WARD": 490,
  "SENDER_DISTRICT": 25,
  "SENDER_PROVINCE": 1,
  "SENDER_DISTRICT_NAME": "QUẬN NAM TỪ LIÊM",
  "SENDER_PROVINCE_NAME": "Hà Nội",
  "SENDER_WARD_NAME": "PHƯỜNG PHÚ ĐÔ"
}

var ghtkUrl = "https://services.giaohangtietkiem.vn"

datasetName = localStorage.getItem("datasetName");
if (!datasetName) {
  // datasetName = 2019;
  // mainSheetForProduct = '1QEO7O0jtOVrWSVTc5EnYs03PNHqDS7nspWC2CzaZP_c';
  // roleSheet = '15y7rVe9z9O1y1ISNxQMQbx-rVTY9hU7ePlEO86kpMd0';
  // shippingSheet = '1sN3aFKDTAjPJNNSHX2TssCY5S0mwcbmtJe4AyBAMtMY';
  datasetName = 2020;
  mainSheetForProduct = '1DD-wAE56uwKK_7Q7rZ5zigPAiMXwoqHKpiyBa6XJLk8';
  // roleSheet = '15y7rVe9z9O1y1ISNxQMQbx-rVTY9hU7ePlEO86kpMd0';
  shippingSheet = '1iSGH0EXjdFOeZYDxWcy98Gv3d9CkvlcrraUZuaTR5ZY';

} else {
  mainSheetForProduct = localStorage.getItem("mainSheetForProduct");
  // roleSheet = localStorage.getItem("roleSheet");
  shippingSheet = localStorage.getItem("shippingSheet");
  $("#pageIcon").html(datasetName);
}




var hostname = window.location.hostname;
var passDataLocalhost = (hostname == "localhost" || hostname == "172.20.10.6" || hostname == "192.168.100.10");

var historyPath = [];
// var currentHistoryData;
try {
  historyPath = JSON.parse(localStorage.getItem("historyPath"));
} catch (e) {
  historyPath = [];
}

saveHistory();

function saveHistory(object) {
  var currentHref = window.location.href;
  // console.log(window.location);
  // console.log(currentHref);
  if (!historyPath) {
    historyPath = [{}];
  };


  if (historyPath[historyPath.length - 1] &&
    historyPath[historyPath.length - 1].href == currentHref) {
    if (object) {
      historyPath[historyPath.length - 1].data = object;
      localStorage.setItem("historyPath", JSON.stringify(historyPath));
    }
    return;
  }

  historyPath.push({
    href: currentHref,
    data: object
  });
  // console.log(historyPath);

  localStorage.setItem("historyPath", JSON.stringify(historyPath));
}
function cleanHistory() {
  // var last = historyPath.pop();
  localStorage.setItem("historyPath", JSON.stringify([]));
}
function backPage() {
  // console.log("back");
  historyPath.pop();
  var historyData = historyPath.pop();
  if (!historyData) {
    return;
  }
  var backHref = historyData.href;

  // console.log(historyPath);

  localStorage.setItem("historyPath", JSON.stringify(historyPath));
  localStorage.setItem("currentHistoryData", JSON.stringify(historyData.data));
  // console.log("backHref:"+backHref);

  window.location = backHref;
}

function readCurrentHistoryData() {
  var historicalData = {}
  try {
    var historicalData = JSON.parse(localStorage.getItem("currentHistoryData"));
  } catch (e) {
    return {};
  }

  localStorage.setItem("currentHistoryData", JSON.stringify({}));

  return historicalData;
}

function comeBackHomeToAuthorize() {
  $("#loadingSpin").hide();
  // console.log("Need to comeBackHomeToAuthorize");
  // console.log(window.location);
  var hostname = window.location.hostname;
  if (hostname == "localhost"
    || hostname == "10.7.136.107"
    || hostname == "172.20.10.6"
    || hostname == "172.20.10.11"
    || hostname == "192.168.100.10"
    || pageName == "index") {
    return;
  } else {
    window.location = "/";
  }
}

function loadProductListByLine(startLine, endLine, callback) {

  var spreadsheetId = mainSheetForProduct;
  var indexColumnOfAllData = 22;
  var sheetrange = 'Product!A' + startLine + ':' + String.fromCharCode(65 + indexColumnOfAllData)+ '' + endLine;
  var dataset = [];

  // console.log("loadProductList:"+sheetrange);

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    dataset = response.result.values;
    // showList(dataset);
    // localStorage.setItem("productList", JSON.stringify(dataset));

    callback(dataset);
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function loadProductList(callback) {
  rs = [];
  var batchNum = 1000;
  var startLine = 1;
  var endLine = startLine + batchNum;

  console.log("loadProductList");

  var callEachBacht = function (startLine, endLine) {
    loadProductListByLine(startLine, endLine, function (rsb) {
      rs = rs.concat(rsb)

      if (rsb.length < batchNum) {
        localStorage.setItem("productList", JSON.stringify(rs));
        callback(rs);
        return;
      } else {
        startLine = endLine + 1;
        endLine = startLine + batchNum;
        setTimeout(function () {
          callEachBacht(startLine, endLine)
        }, 500);
      }
    })
  }
  callEachBacht(startLine, endLine);
}

// function loadCustomerList(callback) {
//   var spreadsheetId = customerSheet;
//   var indexColumnOfAllData = 3;
//   var sheetrange = 'Customer!A:'+String.fromCharCode(65+indexColumnOfAllData);
//   var dataset = [];

//   // console.log("loadProductList:"+sheetrange);

//   if (passDataLocalhost) {
//     callback();
//     return;
//   }

//   if(!gapi.client.sheets) {
//     callback();
//     comeBackHomeToAuthorize();
//     return;
//   }

//   gapi.client.sheets.spreadsheets.values.get({
//       spreadsheetId: spreadsheetId,
//       range: sheetrange,
//   }).then(function(response) {
//       // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
//       dataset = response.result.values;
//       // showList(dataset);
//       localStorage.setItem("customerList",JSON.stringify(dataset));

//       callback(dataset);
//   }, function(response) {
//       console.log('Error: ' + response.result.error.message);
//   });
// }

function loadCustomerListByLine(startLine, endLine, callback) {
  var spreadsheetId = customerSheet;
  var indexColumnOfAllData = 3;
  var sheetrange = 'Customer!A' + startLine + ':' + String.fromCharCode(65 + indexColumnOfAllData) + '' + endLine;
  var dataset = [];

  // console.log("loadProductList:"+sheetrange);

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;
    // showList(dataset);
    // localStorage.setItem("customerList", JSON.stringify(dataset));

    callback(dataset);
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function loadCustomerList(callback) {
  rs = [];
  var batchNum = 1000;
  var startLine = 1;
  var endLine = startLine + batchNum;

  var callEachBacht = function (startLine, endLine) {
    loadCustomerListByLine(startLine, endLine, function (rsb) {
      rs = rs.concat(rsb)

      if (rsb.length < batchNum) {
        // localStorage.setItem("customerList",JSON.stringify(dataset));

        callback(rs);
        return;
      } else {
        startLine = endLine + 1;
        endLine = startLine + batchNum;
        setTimeout(function () {
          callEachBacht(startLine, endLine)
        }, 500);
      }
    })
  }
  callEachBacht(startLine, endLine);
}

// function loadProductCatalogList(callback) {
//   var spreadsheetId = customerSheet;
//   var indexColumnOfAllData = 7;
//   var sheetrange = 'ProductCatalog!A:'+String.fromCharCode(65+indexColumnOfAllData);
//   var dataset = [];

//   // console.log("loadProductList:"+sheetrange);

//   if (passDataLocalhost) {
//     callback();
//     return;
//   }

//   if(!gapi.client.sheets) {
//     callback();
//     comeBackHomeToAuthorize();
//     return;
//   }

//   gapi.client.sheets.spreadsheets.values.get({
//       spreadsheetId: spreadsheetId,
//       range: sheetrange,
//   }).then(function(response) {
//       // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
//       dataset = response.result.values;
//       // showList(dataset);
//       localStorage.setItem("productCatalogList",JSON.stringify(dataset));

//       callback(dataset);
//   }, function(response) {
//       console.log('Error: ' + response.result.error.message);
//   });
// }

function loadProductCatalogListByLine(startLine, endLine, callback) {
  var spreadsheetId = customerSheet;
  var indexColumnOfAllData = 7;
  var sheetrange = 'ProductCatalog!A' + startLine + ':' + String.fromCharCode(65 + indexColumnOfAllData) + '' + endLine;
  var dataset = [];

  // console.log("loadProductList:"+sheetrange);

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;
    // showList(dataset);

    callback(dataset);
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function loadProductCatalogList(callback) {
  rs = [];
  var batchNum = 1000;
  var startLine = 1;
  var endLine = startLine + batchNum;

  var callEachBacht = function (startLine, endLine) {
    loadProductCatalogListByLine(startLine, endLine, function (rsb) {
      rs = rs.concat(rsb)

      if (rsb.length < batchNum) {
        // localStorage.setItem("customerList",JSON.stringify(dataset));

        callback(rs);
        return;
      } else {
        startLine = endLine + 1;
        endLine = startLine + batchNum;
        setTimeout(function () {
          callEachBacht(startLine, endLine)
        }, 500);
      }
    })
  }
  callEachBacht(startLine, endLine);
}

function loadBSCTransaction(callback) {
  var spreadsheetId = bscSheet;
  var indexColumnOfAllData = 5;
  var sheetrange = 'Transaction!A:' + String.fromCharCode(65 + indexColumnOfAllData);
  var dataset = [];

  // console.log("loadProductList:"+sheetrange);

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;
    // showList(dataset);
    localStorage.setItem("BSCTransaction", JSON.stringify(dataset));

    callback(dataset);
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function loadBSCCoin(callback) {
  var spreadsheetId = bscSheet;
  var indexColumnOfAllData = 5;
  var sheetrange = 'Coin!A:' + String.fromCharCode(65 + indexColumnOfAllData);
  var dataset = [];

  // console.log("loadProductList:"+sheetrange);

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;
    // showList(dataset);
    localStorage.setItem("BSCCoin", JSON.stringify(dataset));

    callback(dataset);
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function loadImportScheduleList(callback) {
  var spreadsheetId = mainSheetForProduct;
  var indexColumnOfAllData = 5;
  var sheetrange = 'Warehouse!A:' + String.fromCharCode(65 + indexColumnOfAllData);
  var dataset = [];

  // console.log("loadImportScheduleList:"+sheetrange);

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;
    // showList(dataset);
    localStorage.setItem("warehouse", JSON.stringify(dataset));

    callback();
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function getLatestProductCode(callback) {
  var spreadsheetId = mainSheetForProduct;

  // console.log("getLatestProductCode");

  var indexColumnOfAllData = 1;
  var sheetrange = 'Product!A:' + String.fromCharCode(65 + indexColumnOfAllData);
  var dataset = [];

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
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
    latestCode = latestCode + 1;

    localStorage.setItem("productLatestCode", latestCode);

    callback(latestCode);
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function getLatestOrderCode(callback) {
  var spreadsheetId = mainSheetForProduct;

  // console.log("getLatestOrderCode");

  var indexColumnOfAllData = 1;
  var sheetrange = 'Order!A:' + String.fromCharCode(65 + indexColumnOfAllData);
  var dataset = [];

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;
    // showList(dataset);
    // localStorage.setItem("orderCode","DONHANG_"+dataset.length);
    var maxCode = 0;
    for (var e in dataset) {
      if (!dataset[e][0]) {
        continue;
      }
      var code = parseFloat(dataset[e][0].split("_").pop());
      if (maxCode < code) {
        maxCode = code;
      }
    }
    var latestCode = maxCode + 1;

    localStorage.setItem("orderCode", "DONHANG_" + latestCode);

    callback();
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function getLatestTaskCode(callback) {
  var spreadsheetId = shippingSheet;

  // console.log("getLatestTaskCode");

  var indexColumnOfAllData = 1;
  var sheetrange = 'Task!A:' + String.fromCharCode(65 + indexColumnOfAllData);
  var dataset = [];

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;
    // showList(dataset);
    // localStorage.setItem("orderCode","DONHANG_"+dataset.length);
    var latestCode = parseFloat(dataset[dataset.length - 1][0]) + 1;

    // localStorage.setItem("taskCode","DONHANG_"+latestCode);

    callback(latestCode);
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function getViettelPostAccess(callback) {
  var spreadsheetId = shippingSheet;

  // console.log("getViettelPostAccess");

  var indexColumnOfAllData = 2;
  var sheetrange = 'Viettelpost!A:' + String.fromCharCode(65 + indexColumnOfAllData);
  var dataset = [];

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;
    callback({
      "USERNAME": dataset[0][1],
      "PASSWORD": dataset[1][1]
    });
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function getGhtkAccess(callback) {
  var spreadsheetId = shippingSheet;

  // console.log("getGhtkAccess");

  var indexColumnOfAllData = 1;
  var sheetrange = 'GHTK!A:' + String.fromCharCode(65 + indexColumnOfAllData);
  var dataset = [];

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;
    callback({
      "ghtkToken": dataset[0][1],
      "ghtkAuthorization": dataset[1][1]
    });
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function getGhnAccess(callback) {
  var spreadsheetId = shippingSheet;

  // console.log("getGhtkAccess");

  var indexColumnOfAllData = 1;
  var sheetrange = 'Giaohangnhanh!A:' + String.fromCharCode(65 + indexColumnOfAllData);
  var dataset = [];

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;
    callback({
      "ghnToken": dataset[0][1]
    });
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}


function getLatestImportCode(callback) {
  var spreadsheetId = mainSheetForProduct;

  // console.log("getLatestTaskCode");

  var indexColumnOfAllData = 1;
  var sheetrange = 'Warehouse!A:' + String.fromCharCode(65 + indexColumnOfAllData);
  var dataset = [];

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;

    var latestCode = 0;
    for (var e in dataset) {
      var c = parseFloat(dataset[e][0]) + 1;
      if (latestCode < c) {
        latestCode = c;
      }
    }

    callback(latestCode);
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}


function loadOrderListByLine(startLine, endLine, callback) {

  // console.log("loadOrderList");
  var spreadsheetId = mainSheetForProduct;


  var indexColumnOfAllData = 14;
  var sheetrange = 'Order!A'+startLine+':' + String.fromCharCode(65 + indexColumnOfAllData)+ '' + endLine;

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;
    // showList(dataset);
    // localStorage.setItem("orderList", JSON.stringify(dataset));

    callback(dataset);
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function loadOrderList(callback) {
  rs = [];
  var batchNum = 500;
  var startLine = 1;
  var endLine = startLine + batchNum;
  console.log("loadOrderList");

  var callEachBacht = function (startLine, endLine) {
    loadOrderListByLine(startLine, endLine, function (rsb) {
      rs = rs.concat(rsb)

      if (rsb.length < batchNum) {
        localStorage.setItem("orderList", JSON.stringify(rs));
        callback(rs);
        return;
      } else {
        startLine = endLine + 1;
        endLine = startLine + batchNum;
        setTimeout(function () {
          callEachBacht(startLine, endLine)
        }, 500);
      }
    })
  }
  callEachBacht(startLine, endLine);

}

function loadReport(callback) {

  // console.log("loadReport");

  var spreadsheetId = mainSheetForProduct;

  var indexColumnOfAllData = 2;
  var sheetrange = 'Report!A:' + String.fromCharCode(65 + indexColumnOfAllData);

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;
    // showList(dataset);
    localStorage.setItem("report", JSON.stringify(dataset));

    callback();
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
    if (response.result.error.code == 401) {
      window.location = "/";
    }
  });
}

function loadOrderListDetailByLine(startLine, endLine, callback) {

  // console.log("loadOrderListDetail");

  var spreadsheetId = mainSheetForProduct;


  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  var indexColumnOfAllData = 10;
  var sheetrange = 'OrderDetail!A'+startLine+':' + String.fromCharCode(65 + indexColumnOfAllData)+ '' + endLine;

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;
    // showList(dataset);
    // localStorage.setItem("orderListDetail", JSON.stringify(dataset));

    callback(dataset);

  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function loadOrderListDetail(callback) {
  rs = [];
  var batchNum = 1000;
  var startLine = 1;
  var endLine = startLine + batchNum;

  console.log("loadOrderListDetail");

  var callEachBacht = function (startLine, endLine) {
    loadOrderListDetailByLine(startLine, endLine, function (rsb) {
      rs = rs.concat(rsb)

      if (rsb.length < batchNum) {
        // localStorage.setItem("customerList",JSON.stringify(dataset));
        localStorage.setItem("orderListDetail", JSON.stringify(rs));

        callback(rs);
        return;
      } else {
        startLine = endLine + 1;
        endLine = startLine + batchNum;
        setTimeout(function () {
          callEachBacht(startLine, endLine)
        }, 500);
      }
    })
  }
  callEachBacht(startLine, endLine);
}

function loadWarehouseByLine(startLine, endLine, callback) {
  var spreadsheetId = mainSheetForProduct;


  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  var indexColumnOfAllData = 10;
  var sheetrange = 'Warehouse!A' + startLine + ':' + String.fromCharCode(65 + indexColumnOfAllData) + '' + endLine;

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;
    // showList(dataset);
    // localStorage.setItem("warehouse",JSON.stringify(dataset));

    callback(dataset);
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function loadWarehouse(callback) {

  rs = [];
  var batchNum = 1000;
  var startLine = 1;
  var endLine = startLine + batchNum;

  console.log("loadWarehouse");

  var callEachBacht = function (startLine, endLine) {
    loadWarehouseByLine(startLine, endLine, function (rsb) {
      rs = rs.concat(rsb)

      if (rsb.length < batchNum) {
        // localStorage.setItem("customerList",JSON.stringify(dataset));
        localStorage.setItem("warehouse", JSON.stringify(rs));

        callback(rs);
        return;
      } else {
        startLine = endLine + 1;
        endLine = startLine + batchNum;
        setTimeout(function () {
          callEachBacht(startLine, endLine)
        }, 500);
      }
    })
  }
  callEachBacht(startLine, endLine);
}


function appendOrderDetail(submitData, callback) {
  var numOfColumn = 12;
  var sheetrange = 'OrderDetail!A1:' + String.fromCharCode(65 + numOfColumn) + '';
  var spreadsheetId = mainSheetForProduct;


  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
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
  }).then(function (response) {
    var result = response.result;
    console.log(`${result.updatedCells} cells updated.`);
    // finishOrder();
    callback();
    // addDetailOrder();

  }, function (response) {
    appendPre('Error: ' + response.result.error.message);
  });
}

function appendOrder(submitOrderData, callback) {
  var numOfColumn = 15;
  var sheetrange = 'Order!A1:' + String.fromCharCode(65 + numOfColumn) + '1';
  var spreadsheetId = mainSheetForProduct;

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
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
  }).then(function (response) {
    var result = response.result;
    // console.log(`${result.updatedCells} cells updated.`);
    // $("#modelContent").html("Đã lưu đơn hàng");
    // $('#myModal').modal('toggle');
    callback();

  }, function (response) {
    appendPre('Error: ' + response.result.error.message);
  });
}

function appendTask(submitTaskData, callback) {
  var numOfColumn = 6;
  var sheetrange = 'Task!A1:' + String.fromCharCode(65 + numOfColumn);
  var spreadsheetId = shippingSheet;

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
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
  }).then(function (response) {
    var result = response.result;
    console.log(`${result.updatedCells} cells updated.`);
    // $("#modelContent").html("Đã lưu đơn hàng");
    // $('#myModal').modal('toggle');
    callback();

  }, function (response) {
    appendPre('Error: ' + response.result.error.message);
  });
}


function appendWarehouse(submitImportData, callback) {
  var numOfColumn = 10;
  var sheetrange = 'Warehouse!A1:' + String.fromCharCode(65 + numOfColumn) + "1";
  var spreadsheetId = mainSheetForProduct;

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
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
  }).then(function (response) {
    var result = response.result;
    // console.log(`${result.updatedCells} cells updated.`);
    // $("#modelContent").html("Đã lưu đơn hàng");
    // $('#myModal').modal('toggle');
    callback();

  }, function (response) {
    appendPre('Error: ' + response.result.error.message);
  });
}

function appendProduct(dataAppendProduct, callback, callbackError) {
  var numOfColumn = 21;
  var sheetrange = 'Product!A1:' + String.fromCharCode(65 + numOfColumn);

  var spreadsheetId = mainSheetForProduct;

  if (passDataLocalhost) {
    callback();
  }

  if (!gapi.client.sheets) {
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
  }).then(function (response) {
    var result = response.result;
    console.log(`${result.updatedCells} cells updated.`);

    callback()

  }, function (response) {
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
    return;
  }

  if (!gapi.client.sheets) {
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
  }).then(function (response) {
    var result = response.result;
    console.log(`${result.updatedCells} cells updated.`);
    // finishOrder();
    // addDetailOrder();
    // updateOneByOne(index+1);
    callback();
  }, function (response) {
    appendPre('Error: ' + response.result.error.message);
  });
}


function editOrder(dataEditOrder, range, callback) {

  var spreadsheetId = mainSheetForProduct;
  // var sheetrange = range;

  // console.log(sheetrange);

  if (passDataLocalhost) {
    callback();
  }

  if (!gapi.client.sheets) {
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
  }).then(function (response) {
    var result = response.result;
    // console.log(`${result.updatedCells} cells updated.`);
    // $("#modelContent").html("Đã lưu đơn hàng");
    // $('#myModal').modal('toggle');
    callback();

  }, function (response) {
    appendPre('Error: ' + response.result.error.message);
  });
}

function editWarehouse(dataEditWarehouse, range, callback) {

  var spreadsheetId = mainSheetForProduct;
  // var sheetrange = range;

  // console.log(sheetrange);

  if (passDataLocalhost) {
    callback();
  }

  if (!gapi.client.sheets) {
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
  }).then(function (response) {
    var result = response.result;
    // console.log(`${result.updatedCells} cells updated.`);
    // $("#modelContent").html("Đã lưu đơn hàng");
    // $('#myModal').modal('toggle');
    callback();

  }, function (response) {
    appendPre('Error: ' + response.result.error.message);
  });
}

function editCommonData(spreadsheetId, data, range, callback) {

  // var sheetrange = range;

  // console.log(sheetrange);
  // console.log("editCommonData:"+spreadsheetId);
  // console.log(data);
  // console.log(range);
  if (passDataLocalhost) {
    callback();
  }

  if (!gapi.client.sheets) {
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
      "values": data
    }
  }).then(function (response) {
    var result = response.result;
    // console.log(`${result.updatedCells} cells updated.`);
    // $("#modelContent").html("Đã lưu đơn hàng");
    // $('#myModal').modal('toggle');
    callback();

  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function addCommonData(spreadsheetId, data, range, callback) {

  // var sheetrange = range;

  // console.log(sheetrange);
  // console.log("editCommonData:"+spreadsheetId);
  // console.log(data);
  // console.log(range);
  if (passDataLocalhost) {
    callback();
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId,
    range: range,
    valueInputOption: "USER_ENTERED",
    resource: {
      "majorDimension": "ROWS",
      "values": data
    }
  }).then(function (response) {
    var result = response.result;
    // console.log(`${result.updatedCells} cells updated.`);
    // $("#modelContent").html("Đã lưu đơn hàng");
    // $('#myModal').modal('toggle');
    callback();

  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });

}


function editProduct(dataEditP, range, callback, callbackError) {

  console.log("editProduct");

  var spreadsheetId = mainSheetForProduct;
  // var sheetrange = range;

  if (passDataLocalhost) {
    callback();
    return;
  }

  if (!gapi.client.sheets) {
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
  }).then(function (response) {
    var result = response.result;
    console.log(`${result.updatedCells} cells updated.`);
    // $("#modelContent").html("Đã sửa mặt hàng");
    // $('#myModal').modal('toggle');
    callback();
  }, function (response) {
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

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  var indexColumnOfAllData = 3;
  var sheetrange = 'Roles!A:' + String.fromCharCode(65 + indexColumnOfAllData);

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    roleset = response.result.values;
    // showList(dataset);
    localStorage.setItem("roles", JSON.stringify(roleset));

    getDatasetList(function (datasource) {
      for (var e in datasource) {
        if (datasource[e][3] == 1) {
          localStorage.setItem("mainSheetForProduct", datasource[e][1]);
          localStorage.setItem("shippingSheet", datasource[e][2]);
          localStorage.setItem("datasetName", datasource[e][0]);
          localStorage.setItem("defaultDatasetName", datasource[e][0]);
        }
      };

      callback(roleset);
    })

  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function getDatasetList(callback) {
  var spreadsheetId = roleSheet;

  if (passDataLocalhost) {
    callback();
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  var indexColumnOfAllData = 4;
  var sheetrange = 'DataSetList!A:' + String.fromCharCode(65 + indexColumnOfAllData);

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;
    // showList(dataset);
    localStorage.setItem("DatasetList", JSON.stringify(dataset));

    callback(dataset);
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function loadOtherFee(callback) {
  var spreadsheetId = mainSheetForProduct;

  if (passDataLocalhost) {
    callback();
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  var indexColumnOfAllData = 4;
  var sheetrange = 'OtherFees!A:' + String.fromCharCode(65 + indexColumnOfAllData);

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;
    // showList(dataset);
    localStorage.setItem("otherFees", JSON.stringify(dataset));

    callback(dataset);
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function getCurrentUser() {
  console.log("getCurrentUser");
  // var auth2 = gapi.auth2.getAuthInstance();

  // if (auth2.isSignedIn.get()) {
  // var profile = auth2.currentUser.get().getBasicProfile();
  // console.log('ID: ' + profile.getId());
  // console.log('Full Name: ' + profile.getName());
  // console.log('Given Name: ' + profile.getGivenName());
  // console.log('Family Name: ' + profile.getFamilyName(),);
  // console.log('Image URL: ' + profile.getImageUrl());
  // console.log('Email: ' + profile.getEmail());
  return ({
    status: true,
    // id : profile.getId(),
    // name : profile.getName(),
    // givenName : profile.getGivenName(),
    // familyName : profile.getFamilyName(),
    // imageUrl : profile.getImageUrl(),
    email: "thuy.vtlminhlong@gmail.com"
  })
  // };
  // return {
  //   status :false
  // }
}

function appendShipping(dataAppendShipping, callback, callbackError) {
  var numOfColumn = 10;
  var sheetrange = 'Shipping!A1:' + String.fromCharCode(65 + numOfColumn) + "1";

  var spreadsheetId = shippingSheet;

  if (passDataLocalhost) {
    callback();
  }

  if (!gapi.client.sheets) {
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
  }).then(function (response) {
    var result = response.result;
    console.log(`${result.updatedCells} cells updated.`);

    callback()

  }, function (response) {
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

  if (!gapi.client.sheets) {
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
  }).then(function (response) {
    var result = response.result;
    console.log(`${result.updatedCells} cells updated.`);

    callback()

  }, function (response) {
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

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  var indexColumnOfAllData = 1;
  var sheetrange = 'Shipping!A:' + String.fromCharCode(65 + indexColumnOfAllData);
  var dataset = [];

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;

    callback(dataset.length);
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function updateOrderStatus(line, column, value, callback) {
  var spreadsheetId = mainSheetForProduct;

  var sheetrange = 'Order!' + String.fromCharCode(65 + column) + line + ":" + String.fromCharCode(65 + column) + line;
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
  }).then(function (response) {
    var result = response.result;
    callback();
  }, function (response) {
    appendPre('Error: ' + response.result.error.message);
  });
}


function getOrderShippingByLine(startLine, endLine, callback) {
  var spreadsheetId = shippingSheet;

  // console.log("getOrderShipping");

  var indexColumnOfAllData = 14;
  var sheetrange = 'Shipping!A' + startLine + ':' + String.fromCharCode(65 + indexColumnOfAllData)+ '' + endLine;
  var dataset = [];

  if (passDataLocalhost) {
    callback();
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;

    // localStorage.setItem("ordershipping", JSON.stringify(dataset));


    callback(dataset);
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function getOrderShipping(callback) {
  rs = [];
  var batchNum = 500;
  var startLine = 1;
  var endLine = startLine + batchNum;

  console.log("getOrderShipping");

  var callEachBacht = function (startLine, endLine) {
    getOrderShippingByLine(startLine, endLine, function (rsb) {
      rs = rs.concat(rsb)

      if (rsb.length < batchNum) {
        // localStorage.setItem("customerList",JSON.stringify(dataset));
        // localStorage.setItem("warehouse", JSON.stringify(rs));
        localStorage.setItem("ordershipping", JSON.stringify(rs));
        callback(rs);
        return;
      } else {
        startLine = endLine + 1;
        endLine = startLine + batchNum;
        setTimeout(function () {
          callEachBacht(startLine, endLine)
        }, 500);
      }
    })
  }
  callEachBacht(startLine, endLine);
}

function getTaskList(callback) {
  var spreadsheetId = shippingSheet;

  // console.log("getTaskList");

  var indexColumnOfAllData = 7;
  var sheetrange = 'Task!A:' + String.fromCharCode(65 + indexColumnOfAllData);
  var dataset = [];

  if (passDataLocalhost) {
    callback();
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;

    localStorage.setItem("tasklist", JSON.stringify(dataset));


    callback(dataset);
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function getShippingReport(callback) {
  var spreadsheetId = shippingSheet;

  var indexColumnOfAllData = 5;
  var sheetrange = 'Report!A:B';
  var dataset = [];

  if (passDataLocalhost) {
    callback();
  }

  if (!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: sheetrange,
  }).then(function (response) {
    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
    dataset = response.result.values;

    localStorage.setItem("shippingReport", JSON.stringify(dataset));


    callback(dataset);
  }, function (response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function editDataInSheet(spreadsheets, sheetrange, data, callback, callbackError) {
  gapi.client.sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheets,
    range: sheetrange,
    valueInputOption: "USER_ENTERED",
    resource: {
      "majorDimension": "ROWS",
      "values": data
    }
  }).then(function (response) {
    callback();
  }, function (response) {
    // appendPre('Error: ' + response.result.error.message);
    callbackError();
  });
}

function appendDataInSheet(spreadsheets, sheetrange, data, callback, callbackError) {
  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheets,
    range: sheetrange,
    valueInputOption: "USER_ENTERED",
    resource: {
      "majorDimension": "ROWS",
      "values": data
    }
  }).then(function (response) {
    callback();
  }, function (response) {
    // appendPre('Error: ' + response.result.error.message);
    callbackError();
  });
}

function sendEmail(headers_obj, message, callback) {

  var email = '';

  for (var header in headers_obj) {
    email += header += ": " + headers_obj[header] + "\r\n";
  }

  email += "\r\n" + message;

  var sendRequest = gapi.client.gmail.users.messages.send({
    'userId': 'me',
    'resource': {
      'raw': b64EncodeUnicode(email).replace(/\+/g, '-').replace(/\//g, '_')
    }
  });
  // sendRequest.execute(function(){console.log("done")});

  return sendRequest.execute(callback);
  // callback({
  //   id : "1234"
  // })
  // sendEmail("levanthanh3005@gmail.com","vanle@unibz.it","Test","Test",function(){console.log("done")});
}

function getSpecificRoles() {
  var roles = JSON.parse(localStorage.getItem("roles"));
  var shipper = "";
  var manager = "";
  var marketer = "";
  // console.log(roles);
  for (var e in roles) {
    if (roles[e][1] == "shipper") {
      shipper += roles[e][0] + ";";
    } else if (roles[e][1] == "manager"
      // && roles[e][0]!="thuy.vtlminhlong@gmail.com"
    ) {
      manager += roles[e][0] + ";";
    } else if (roles[e][1] == "marketer"
    ) {
      marketer += roles[e][0] + ";";
    }
  }
  return {
    "shipper": shipper,
    "manager": manager,
    "marketer": marketer
  }
}

function getCurrentDateTime(mdate) {
  var today = new Date();
  if (mdate) {
    today = mdate;
  }
  var date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes();// + ":" + today.getSeconds();
  var dateTime = date + ' ' + time;
  return {
    dateTime: dateTime,
    date: date
  };
}

function requestShipping(currentOrder, callback) {
  $("#loadingSpin").show();

  var willpay = parseFloat(currentOrder.totalPayIncludeShip) - parseFloat(currentOrder.prepaid ? currentOrder.prepaid : 0);

  // console.log(willpay);
  // currentOrder.shippingType =  $(this).attr("class").split(" ").pop().split("_").pop();
  console.log("shippingType:" + currentOrder.shippingType);
  if (currentOrder.shippingType == "POST_COD"
    || currentOrder.shippingType == "SHOPEE"
    || currentOrder.shippingType == "POST_NO_COD") {
    currentOrder.otherCost = 5;
  }
  currentOrder.willpay = willpay;

  for (e in currentOrder.prodListOrder) {
    currentOrder.prodListOrder[e].turnover = undefined;
    currentOrder.prodListOrder[e].totalPay = undefined;
    currentOrder.prodListOrder[e].profit = undefined;
    currentOrder.prodListOrder[e].available = undefined;
  }
  if (!currentOrder.shippingStatus) {
    currentOrder.shippingStatus = "Requested";
  }
  if (!currentOrder.shippingPaidStatus) {
    currentOrder.shippingPaidStatus = "0";
  }
  var dataShipping = [
    [
      currentOrder.orderCode,
      currentOrder.customerAddress,
      "'" + currentOrder.customerPhone,
      JSON.stringify(currentOrder),
      currentOrder.shippingStatus,
      currentOrder.otherCost,
      currentOrder.shippingCompleteTime,
      currentOrder.shippingCost,
      currentOrder.shippingType,
      currentOrder.shippingPaidStatus,
      getCurrentDateTime().dateTime
    ]
  ];
  if (currentOrder.shippingType == "SHIP_BY_THIRD_PARTY") {
    dataShipping = [
      [
        currentOrder.orderCode,
        currentOrder.customerAddress,
        "'" + currentOrder.customerPhone,
        JSON.stringify(currentOrder),
        "COMPLETED",
        currentOrder.otherCost,
        getCurrentDateTime().dateTime,
        currentOrder.shippingCost,
        currentOrder.shippingType,
        "1",
        getCurrentDateTime().dateTime
      ]
    ];
  }
  if (currentOrder.shipIndex == -1 || !currentOrder.shipIndex) {
    appendShipping(dataShipping, function () {
      console.log("Done request shipping")
      $("#loadingSpin").hide();

      sendToShipperViaEmail(currentOrder, "Yeu cau giao hang-" + currentOrder.shippingType);

    }, function () {
      console.log("Something wrong");
      $("#loadingSpin").hide();
      if (callback) {
        callback();
      }

    })
  } else {
    var sheetrange = 'Shipping!A' + currentOrder.shipIndex + ':K' + currentOrder.shipIndex;
    updateShipping(dataShipping, sheetrange, function () {
      console.log("updated:" + currentOrder.shipIndex);
      $("#loadingSpin").hide();

      sendToShipperViaEmail(currentOrder, "Cap nhat yeu cau-" + currentOrder.shippingType);

      if (callback) {
        callback();
      }

    }, function () {
      console.log("Something wrong");
    })
  }
}

function splitOrderAvailable(currentOrder, callbackSplitOrderMain) {
  // $("#loadingSpin").show();
  //Add new order
  var orderCode;

  var dataProdListOrderReady = [];
  var dataProfListOrderRemoveSplit = [];
  var dataRangeRemoveSplit = []
  var prodListOrder = currentOrder.prodListOrder;
  var numOfColumnOrderDetail = 10;

  function prepareProdListOrder() {
    for (var e in prodListOrder) {
      if (prodListOrder[e].available == 1) {

        dataProdListOrderReady.push([
          orderCode,
          prodListOrder[e].productCode,
          prodListOrder[e].importCode,
          '=CONCATENATE(INDIRECT(ADDRESS(ROW();3));"_";INDIRECT(ADDRESS(ROW();2)))',
          prodListOrder[e].productName,
          prodListOrder[e].productCount,
          prodListOrder[e].productEstimateSellingVND,
          "=INDIRECT(ADDRESS(ROW();6)) *  INDIRECT(ADDRESS(ROW();7))",
          "=VLOOKUP(INDIRECT(ADDRESS(ROW();4));Product!B:U;11;FALSE)",
          "=(INDIRECT(ADDRESS(ROW();7)) - INDIRECT(ADDRESS(ROW();9))) * INDIRECT(ADDRESS(ROW();6))",
          "=VLOOKUP(INDIRECT(ADDRESS(ROW();3));Warehouse!A:C;3;0)",
          '=IF(IFERROR(VLOOKUP(INDIRECT(ADDRESS(ROW();1)); IMPORTRANGE("' + shippingSheet + '";"Shipping!A:A");1;false);"")="";0;1) * INDIRECT(ADDRESS(ROW();6))'
        ])

        // dataProfListOrderRemoveSplit.push([
        //   "","","","","","","","","","",""
        // ])
        var orderDetailIndex = parseInt(prodListOrder[e].orderDetailIndex) + 1;

        dataRangeRemoveSplit.push("OrderDetail!A" + orderDetailIndex + ":" + String.fromCharCode(65 + numOfColumnOrderDetail) + orderDetailIndex);
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
        "'" + currentOrder.customerPhone,
        "=SUMIF(OrderDetail!A:A;INDIRECT(ADDRESS(ROW();1));OrderDetail!H:H)",
        currentOrder.shippingCost,
        "=INDIRECT(ADDRESS(ROW();6)) + INDIRECT(ADDRESS(ROW();7))",
        "ORDERED",
        "=SUMIF(OrderDetail!A:A;INDIRECT(ADDRESS(ROW();1));OrderDetail!K:K) / COUNTIF(OrderDetail!A:A;INDIRECT(ADDRESS(ROW();1)))",
        currentOrder.orderNode,
        currentOrder.shippingType,
        currentOrder.otherCost,
        currentOrder.prepaid,
        0,
        '=IF(IFERROR(VLOOKUP(INDIRECT(ADDRESS(ROW();1)); IMPORTRANGE("' + shippingSheet + '";"Shipping!A:A");1;false);"")="";0;1)'
      ]
    ]

    appendOrder(submitOrderData, function () {
      appendOrderDetail(dataProdListOrderReady, callbackSplitAddNew);
    });
  }
}

function splitOrderAsRequested(currentOrder, lsProdIndex, callbackSplitOrderMain) {
  // $("#loadingSpin").show();
  //Add new order
  var orderCode;

  var dataProdListOrderReady = [];
  var dataProfListOrderRemoveSplit = [];
  var dataRangeRemoveSplit = []
  var prodListOrder = currentOrder.prodListOrder;
  var numOfColumnOrderDetail = 10;

  function prepareProdListOrder() {
    for (var e in lsProdIndex) {
      var prod = prodListOrder[lsProdIndex[e]];
      dataProdListOrderReady.push([
        orderCode,
        prod.productCode,
        prod.importCode,
        '=CONCATENATE(INDIRECT(ADDRESS(ROW();3));"_";INDIRECT(ADDRESS(ROW();2)))',
        prod.productName,
        prod.productCount,
        prod.productEstimateSellingVND,
        "=INDIRECT(ADDRESS(ROW();6)) *  INDIRECT(ADDRESS(ROW();7))",
        "=VLOOKUP(INDIRECT(ADDRESS(ROW();4));Product!B:U;11;FALSE)",
        "=(INDIRECT(ADDRESS(ROW();7)) - INDIRECT(ADDRESS(ROW();9))) * INDIRECT(ADDRESS(ROW();6))",
        "=VLOOKUP(INDIRECT(ADDRESS(ROW();3));Warehouse!A:C;3;0)",
        '=IF(IFERROR(VLOOKUP(INDIRECT(ADDRESS(ROW();1)); IMPORTRANGE("' + shippingSheet + '";"Shipping!A:A");1;false);"")="";0;1) * INDIRECT(ADDRESS(ROW();6))'
      ])

      // dataProfListOrderRemoveSplit.push([
      //   "","","","","","","","","","",""
      // ])
      var orderDetailIndex = parseInt(prod.orderDetailIndex) + 1;

      dataRangeRemoveSplit.push("OrderDetail!A" + orderDetailIndex + ":" + String.fromCharCode(65 + numOfColumnOrderDetail) + orderDetailIndex);
    }
  }


  var splitAddNewOrder = function (callbackSplitAddNew) {

    var submitOrderData = [
      [
        orderCode,
        currentOrder.orderDate,
        currentOrder.customerName,
        currentOrder.customerAddress,
        "'" + currentOrder.customerPhone,
        "=SUMIF(OrderDetail!A:A;INDIRECT(ADDRESS(ROW();1));OrderDetail!H:H)",
        currentOrder.shippingCost,
        "=INDIRECT(ADDRESS(ROW();6)) + INDIRECT(ADDRESS(ROW();7))",
        "ORDERED",
        "=SUMIF(OrderDetail!A:A;INDIRECT(ADDRESS(ROW();1));OrderDetail!K:K) / COUNTIF(OrderDetail!A:A;INDIRECT(ADDRESS(ROW();1)))",
        currentOrder.orderNode + (currentOrder.prepaid > 0 ? " Note Trả trước: " + currentOrder.prepaid + "k ở đơn hàng " + currentOrder.orderCode + " " + currentOrder.customerName : ""),
        currentOrder.shippingType,
        JSON.stringify(currentOrder.otherInfor),
        currentOrder.prepaid,
        0,
        '=IF(IFERROR(VLOOKUP(INDIRECT(ADDRESS(ROW();1)); IMPORTRANGE("' + shippingSheet + '";"Shipping!A:A");1;false);"")="";0;1)'
      ]
    ]

    appendOrder(submitOrderData, function () {
      appendOrderDetail(dataProdListOrderReady, callbackSplitAddNew);
    });
  }

  var fRemove = function () {
    console.log("fEdit")
    if (dataRangeRemoveSplit.length > 0) {
      // var numOfColumn = 6;

      var updateOneByOne = function (index) {
        if (index < dataRangeRemoveSplit.length) {

          console.log("Remove:");
          console.log(dataRangeRemoveSplit[index])

          var dataEditOD = [
            ["", "", "", "", "", "", "", "", "", "", ""]
          ]

          editOrderDetail(dataEditOD, dataRangeRemoveSplit[index], function () {
            updateOneByOne(index + 1);
          })

        } else {
          callbackSplitOrderMain();
          return;
        }
      }
      updateOneByOne(0);
    }
  }

  getLatestOrderCode(function () {
    orderCode = localStorage.getItem("orderCode");
    prepareProdListOrder();
    splitAddNewOrder(function () {
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

function removeSpecialAlias(str) {
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
  var smonth = sdate.split("-")[1];
  var sday = sdate.split("-")[2];

  var shour = stime.split(":")[0];
  var smin = stime.split(":")[1];
  var ssec = stime.split(":")[2];
  return {
    date: sdate,
    time: stime,
    year: syear,
    month: smonth,
    day: sday,
    hour: shour,
    min: smin,
    sec: ssec,
    monthyear: smonth + "-" + syear
  }
}


function downloadFile(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

// Start file download.

function strToAddr(addr) {
  var aix = {
    address: addr
  }
  try {
    var ails = aix.address.split(",");
    var ailg = ails.length;
    aix.province = ails[ailg - 1].trim();
    aix.district = ails[ailg - 2].trim();
    aix.ward = ails[ailg - 3].trim();
    aix.address = aix.address.split(aix.province).join("")
      .split(aix.district + ",").join("")
      .split(aix.ward + ",").join("").trim();
    aix.province = aix.province.toUpperCase().split("TỈNH").join("");
    aix.district = aix.district.toUpperCase();
    aix.ward = aix.ward.toUpperCase();

    if (aix.address[aix.address.length - 1] == ",") {
      aix.address = aix.address.substring(0, aix.address.length - 1);
    }

  } catch (e) {

  }

  aix.province = aix.province ? aix.province : "";
  aix.district = aix.district ? aix.district : "";
  aix.ward = aix.ward ? aix.ward : "";
  aix.address = aix.address ? aix.address : "";

  return aix;
}

function fetchEuroRate(callback) {
  fetch(herokuPrefix + "https://portal.vietcombank.com.vn/UserControls/TVPortal.TyGia/pListTyGia.aspx", {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "accept-language": "en-GB,en;q=0.9",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Brave\";v=\"120\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "sec-gpc": "1",
      "upgrade-insecure-requests": "1"
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "omit"
  }).then(function (test) {
    new Response(test.body).text().then(function (text) {
      // console.log(text);
      var data = $.parseHTML(text);
      var lsCurrency = {};
      $(data).find('tr.odd').each(function () {
        // console.log($(this))
        var eachCurrency = [];
        $(this).find('td').each(function () {
          eachCurrency.push($(this).html().trim());
        })
        lsCurrency[eachCurrency[1]] = {
          name: eachCurrency[0],
          code: eachCurrency[1],
          buyWithCash: eachCurrency[2].replace(".", "").replace(",", "."),
          buyWithBankTransfer: eachCurrency[3].replace(".", "").replace(",", "."),
          sell: eachCurrency[4].replace(".", "").replace(",", ".")
        }
      })

      callback({
        html: data,
        lsCurrency
      });
    });
  });
}
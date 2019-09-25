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
  var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';
  var indexColumnOfAllData = 19;
  var sheetrange = 'Product!A:'+String.fromCharCode(65+indexColumnOfAllData);
  var dataset = [];

  console.log("loadProductList:"+sheetrange);


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

      callback();
  }, function(response) {
      console.log('Error: ' + response.result.error.message);
  });
}

function getLatestOrderCode(callback) {
  var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';

  console.log("getLatestOrderCode");

  var indexColumnOfAllData = 1;
  var sheetrange = 'Order!A:'+String.fromCharCode(65+indexColumnOfAllData);
  var dataset = [];

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



function loadOrderList(callback) {

  console.log("loadOrderList");
  var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';


  var indexColumnOfAllData = 12;
  var sheetrange = 'Order!A:'+String.fromCharCode(65+indexColumnOfAllData);

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
  
  var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';

  var indexColumnOfAllData = 2;
  var sheetrange = 'Report!A:'+String.fromCharCode(65+indexColumnOfAllData);

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

  var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';


  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  var indexColumnOfAllData = 6;
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

// var textarea = document.getElementById("textarea");
// $(textarea).hide();

// $(".copyPayment").click(function(){
//     var allText =  "Thông tin chuyển khoản :\n"+
//     "- Chủ tài khoản: Le Van Thanh \n"+
//     "- Ngân hàng: Techcombank chi nhánh Phúc Yên, Vĩnh Phúc \n"+
//     "- Số tài khoản : 19034601990019 \n"+
//     "- Chuyển khoản ghi rõ: tên người gửi - mặt hàng mua";
//     console.log("Copy");
//     $(textarea).show();

//     textarea.value = allText;

//     textarea.select(); 
//     textarea.setSelectionRange(0, 99999); /*For mobile devices*/
//     document.execCommand("copy");

//     $(textarea).hide();
// })

function appendOrderDetail(submitData,callback) {
  var numOfColumn = 11;
  var sheetrange = 'OrderDetail!A1:'+ String.fromCharCode(65+numOfColumn);
  var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';


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
  var numOfColumn = 10;
  var sheetrange = 'Order!A1:'+ String.fromCharCode(65+numOfColumn);
  var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';

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

function appendProduct(dataAppendProduct, callback, callbackError) {
    var numOfColumn = 19;
    var sheetrange = 'Product!A1:'+ String.fromCharCode(65+numOfColumn);

    var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';

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
  var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';

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
  
  var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';
  // var sheetrange = range;

  // console.log(sheetrange);
  
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

function editProduct(dataEditP, range,callback, callbackError) {
  
  console.log("editProduct");

  var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';
  // var sheetrange = range;

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
  var spreadsheetId = '1mQPua5Rr8sDpYH7zQ37sTgiI2GmyoxMCiH9x78EhwTI';

  if(!gapi.client.sheets) {
    callback();
    comeBackHomeToAuthorize();
    return;
  }

  var indexColumnOfAllData = 2;
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

function getCurrentUser() {
    var auth2 = gapi.auth2.getAuthInstance();
    
    if (auth2.isSignedIn.get()) {
      var profile = auth2.currentUser.get().getBasicProfile();
      console.log('ID: ' + profile.getId());
      console.log('Full Name: ' + profile.getName());
      console.log('Given Name: ' + profile.getGivenName());
      console.log('Family Name: ' + profile.getFamilyName(),);
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
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
    var numOfColumn = 6;
    var sheetrange = 'Shipping!A1:'+ String.fromCharCode(65+numOfColumn);

    var spreadsheetId = '1oPfxrbF1sHAYjCRNZFJsH4L4x7JYLkSuqwnzsEF3mUI';

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

    var spreadsheetId = '1oPfxrbF1sHAYjCRNZFJsH4L4x7JYLkSuqwnzsEF3mUI';

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
  var spreadsheetId = '1oPfxrbF1sHAYjCRNZFJsH4L4x7JYLkSuqwnzsEF3mUI';

  console.log("getLatestShippingIndex");

  var indexColumnOfAllData = 1;
  var sheetrange = 'Shipping!A:'+String.fromCharCode(65+indexColumnOfAllData);
  var dataset = [];

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

      callback(dataset.length);
  }, function(response) {
      console.log('Error: ' + response.result.error.message);
  });
}

function getOrderShipping(callback) {
  var spreadsheetId = '1oPfxrbF1sHAYjCRNZFJsH4L4x7JYLkSuqwnzsEF3mUI';

  console.log("getOrderShipping");

  var indexColumnOfAllData = 6;
  var sheetrange = 'Shipping!A:'+String.fromCharCode(65+indexColumnOfAllData);
  var dataset = [];

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
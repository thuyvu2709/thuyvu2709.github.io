
// var status = "PROCESSING";

$("#orderFilter").val("PROCESSING");

var spreadsheetId = mainSheetForProduct;
var sheetOrder = "Order";
var orderShipStatus =[];
var listProductParse = {};
var listOrderDetailParse = {};

var lsNotifications = [];

var url = new URL(window.location.href);

//Load history
var historicalData = readCurrentHistoryData();
if (historicalData){
  // console.log("historicalData");
  // console.log(historicalData);
  if (historicalData.searchText){
    $("#orderSearchInput").val(historicalData.searchText);
  }

  if (historicalData.status) {
    $("#orderFilter").val(historicalData.status);
  }
}

$(".click-to-select-all").hide();
$(".click-to-view").hide();

var afterLoadHTML = function(){
  // document.getElementsByClassName
  // console.log("afterLoadHTML");
  // console.log(historicalData);
  if (historicalData && historicalData.goToClass) {
    // document.getElementsByClassName(historicalData.goToClass)[0].scrollIntoView();
    var $container = $("html,body");
    var orderIndex = historicalData.goToClass.split(" ").pop().split("_").pop();
    var btnOrder = "btnOrder_"+orderIndex;

    // console.log("goToClass:"+btnOrder);

    var $scrollTo = $('.'+btnOrder);

    $("html,body").animate({scrollTop: $scrollTo.offset().top - $container.offset().top + $container.scrollTop() - 100, scrollLeft: 0},300); 
    $scrollTo.click();

    historicalData = undefined;
  }
}
/////////////


var triggerAfterLoad = function(){

  $("#loadingSpin").show();

  loadProductList(function(){
    // console.log("1")
    loadOrderList(function(){
          // console.log("2")
      loadOrderListDetail(function(){
        filterOrderWithProdRefCode();
        filterOrderWithDate();
        parseOrderDetail();
        getOrderShipping(function(lsOrderset){
          parseOrderShipping();
          parseProduct();
          $("#loadingSpin").hide();
          // console.log("Gooo");
          loadOrderListHtml();
        })

      })
    })
  })
}

$(".text-center").click(function(){
  // getOrderShipping(function(lsOrderset){
  //     lsOrder = lsOrderset;
  //     loadOrderShippingListHtml(lsOrder);
  //     getTaskList(function(lsTaskset){
  //       lsTask = lsTaskset;
  //     })
  // });
  // triggerAfterLoad();
  // console.log("listProductParse");
  // console.log(listProductParse);
})

var orderWithProdRef = [];
function filterOrderWithProdRefCode(){
  var prodRefCodeFilter = url.searchParams.get("prodRefCodeFilter");
  if (!prodRefCodeFilter) {
    return;
  }
  var status = "REQUESTED";
  $("#orderFilter").val(status);
  orderListDetail = JSON.parse(localStorage.getItem("orderListDetail"));
  for (var e in orderListDetail) {
    if (orderListDetail[e][3] == prodRefCodeFilter) {
      orderWithProdRef.push(orderListDetail[e][0]);
    }
  }
  if (orderWithProdRef.length == 0) {
    orderWithProdRef.push("$$$");
  }
}

function filterOrderWithDate(){
  // console.log("filterOrderWithDate")
  var startDateStr = url.searchParams.get("startDate");
  if (!startDateStr) {
    return;
  }
  // console.log("1");
  var endDateStr = url.searchParams.get("endDate");
  if (!endDateStr) {
    return;
  }
  // console.log("2");
  var startDate = new Date(startDateStr);
  var endDate = new Date(endDateStr);

  var status = "REQUESTED";
  $("#orderFilter").val(status);
  var orderList = JSON.parse(localStorage.getItem("orderList"));

  for (var e in orderList) {
      // var orderDate = new Date(orderList[e][1]);
      var orderDateRaw = new Date(orderList[e][1]);
      var orderDate = new Date(orderDateRaw.getFullYear(), orderDateRaw.getMonth(), orderDateRaw.getDate())
            // console.log(orderDate + " " + startDate +" " + (startDate<=orderDate) +" " +(orderDate <= endDate))

      if (startDate <= orderDate && orderDate <= endDate){
        orderWithProdRef.push(orderList[e][0]);
      }
  }
  if (orderWithProdRef.length == 0) {
    orderWithProdRef.push("$$$");
  }
}

// $(".text-center").click(function(){
//   parseOrderShipping();
//   parseProduct();
//   $("#loadingSpin").hide();
//   console.log("Gooo");
//   loadOrderListHtml();
// })

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

    if (orderShipStatus[lsOrderShipping[e][0]]) {
      $(".modal-body").empty();
      $(".modal-body").html("<p id='modelContent'>Cảnh báo! Có 2 yêu cầu giao hàng cho đơn "+lsOrderShipping[e][0]+"</p>");
      $('#myModal').modal('show');
    }

    orderShipStatus[lsOrderShipping[e][0]] = {
      status : lsOrderShipping[e][4],
      stype : lsOrderShipping[e][8],
      paidStatus : lsOrderShipping[e][9],
      completeTime : lsOrderShipping[e][6],
      sindex : (parseInt(e)+1),
      orderDetail : JSON.parse(lsOrderShipping[e][3])
    }

    /*
    shipping type: 0: ship, ko thu tien
                   1: ship, co thu tien (COD)
                   2: ship DVVC
    */
    // console.log(orderShipStatus[lsOrderShipping[e][0]]);
  }
  // console.log(orderShipStatus)
  // console.log(orderShipStatus["DONHANG_50"]);
}

function parseProduct(){
  listProductParse = {};
  var productList = JSON.parse(localStorage.getItem("productList"));
  for (var e in productList) {
    listProductParse[productList[e][1]] = {
      image : productList[e][19],
      productWeight: productList[e][6]
    }
  }
}

function parseOrderDetail(){
  listOrderDetailParse = {};
  var orderListDetail = JSON.parse(localStorage.getItem("orderListDetail"));
  for (var e in orderListDetail) {
    if (!orderListDetail[e][0]) {
      continue;
    }
    if (!listOrderDetailParse[orderListDetail[e][0]]) {
      listOrderDetailParse[orderListDetail[e][0]] = [];
    }
    listOrderDetailParse[orderListDetail[e][0]].push(orderListDetail[e]);
    if (orderListDetail[e][8] == "#N/A" || orderListDetail[e][9] == "#N/A") {
      $(".modal-body").empty();
      $(".modal-body").html("<p id='modelContent'>Cảnh báo! Đơn hàng "+orderListDetail[e][0]+" mặt hàng "+ orderListDetail[e][4] +" mã "+orderListDetail[e][3] +" không tồn tại trong bảng sản phẩm, hãy thêm vào hoặc đổi mã</p>");
      $('#myModal').modal('show');
    }
  }
}

$(".click-to-notify").hide();

function addNotification(text){
  lsNotifications.push(text);
  $(".click-to-notify").show();
}

function loadOrderListHtml() {
  $("#loadingSpin").show();

  data = JSON.parse(localStorage.getItem("orderList"));
  orderListDetail = JSON.parse(localStorage.getItem("orderListDetail"));
  lsOrderShipping = JSON.parse(localStorage.getItem("ordershipping"));;
  $("#controllMany").hide();
  $("#listOrder").empty();
  // console.log(data);
  var status = $("#orderFilter").val();

  var indexInTable = {};
  for(var e in data) {
    indexInTable[data[e][0]] = e;
  }

  let sortableData = data.slice(0);
  
  sortableData.sort(function(a,b) {    
    if (a[0] && b[0]) {
      if ((a[0]).split("_").length > 0 && (b[0]).split("_").length > 0) {
        return parseInt((a[0]).split("_")[1]) - parseInt((b[0]).split("_")[1]);
      } else {
        return false;
      }
    } else {
      return false;
    }
  });


  for(var es in sortableData) {

    var e = indexInTable[sortableData[es][0]];
    if (e == 0) {
      continue;
    }
    if (!data[e][0]){
      continue;
    }

    if (status == 'PROCESSING') {
      if (data[e][8] == "PAID" && orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED") {
        continue;
      }
      if (data[e][11]=="SHOPEE" && orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED") {
        continue;
      }
      if (data[e][11]=="POST_COD" && orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED") {
        continue;
      }
      if (data[e][11]=="SHIPPER_COD" && orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED") {
        continue;
      }
      if (data[e][11]=="SHIPPER_NO_COD" && orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED") {
        continue;
      }
    } else if (status == 'COMPLETE') {
      if (!(data[e][8] == "PAID" && orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED")) {
        continue;
      }
      if (!(data[e][11]=="SHOPEE" && orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED")) {
        continue;
      }
      if (!(data[e][11]=="POST_COD" && orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED")) {
        continue;
      }
    } else if (status == 'READY') {
      if (parseFloat(data[e][9])<1) {
        continue;
      }
      
      if (data[e][8] == "PAID" && orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED") {
        continue;
      };
      // if (data[e][11]=="SHOPEE" && orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED") {
      //   continue;
      // }
      if (data[e][11]=="POST_COD" && orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED") {
        continue;
      }
      if (data[e][11]=="SHIPPER_COD" && orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED") {
        continue;
      }
      if (data[e][11]=="SHIPPER_NO_COD" && orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED") {
        continue;
      }
    } else if (status == 'SHOPEE-READY') {
      if (data[e][9]<1) {
        continue;
      }
      if (orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED") {
        continue;
      };
      if (data[e][11]!="SHOPEE") {
        continue;
      }
    } else if (status == 'SHOPEE-PROCESS') {
      if (orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED") {
        continue;
      };
      if (data[e][11]!="SHOPEE") {
        continue;
      }
    }

    if (orderWithProdRef.length>0) {
      if (!orderWithProdRef.includes(data[e][0])){
        continue;
      }
    }

    var optionPaid;
    var iconPaid = "";
    if (data[e][8] == "PAID") {
      optionPaid = '<option value="PAID" selected>Đã thanh toán</option><option value="ORDERED">Đã đặt hàng</option>';
      iconPaid = ' | <i class="fas fa-dollar-sign"></i>';
    } else {
      optionPaid = '<option value="ORDERED" selected>Chưa thanh toán</option><option value="PAID">Đã thanh toán</option>'
    }

    var optionShip;
    var shippingType = data[e][11];
    var iconShip = "";

    var btnShopReceiveMoney = "";
    if (orderShipStatus[data[e][0]]) {
      if(orderShipStatus[data[e][0]].status == "SHIPPER_RECEIVED_MONEY") {
        iconShip = ' | <i class="fas fa-motorcycle" style="color:red">'+orderShipStatus[data[e][0]].stype+' (Shipper received money)</i>';
        optionShip = '<option value="COMPLETED" selected>Shop đã nhận tiền</option><option value="Requested">Chưa giao hàng</option>';
        btnShopReceiveMoney = '<div class="btn btn-default btnNormal5px shopReceiveMoney order_'+e+'" >SHOP đã nhận tiền ('+orderShipStatus[data[e][0]].orderDetail.willpay+')</div>';

      } else if(orderShipStatus[data[e][0]].status == "SENT_POST") {
        iconShip = ' | <i class="fas fa-motorcycle" style="color:red">'+orderShipStatus[data[e][0]].stype+' (Sent Post)</i>';
        optionShip = '<option value="COMPLETED" selected>Đã hoàn thành</option><option value="Requested">Chưa giao hàng</option>';
      } else if(orderShipStatus[data[e][0]].status == "COMPLETED") {
        iconShip = ' | <i class="fas fa-motorcycle" style="color:red">'+orderShipStatus[data[e][0]].stype+' (Sent)</i>';
        optionShip = '<option value="COMPLETED" selected>Đã giao hàng</option><option value="Requested">Chưa giao hàng</option>';
      } else {
        iconShip = ' | <i class="fas fa-motorcycle" style="color:red">'+orderShipStatus[data[e][0]].stype+' (Requested)</i>';
        optionShip = '<option value="Requested" selected>Chưa giao hàng</option><option value="COMPLETED">Đã giao hàng</option>'
      }

    } else {
      iconShip = ' | <i class="fas fa-motorcycle" >'+data[e][11]+'</i>';
      optionShip = '<option value="Requested" selected>Chưa giao hàng</option>'
    }

    var dateOrder = new Date(data[e][1]);
    var today = new Date();
    var diffTime = Math.abs(dateOrder - today);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    // console.log(data[e][0]+ " "+diffDays);

    if (diffDays > 29 && data[e][11] == "SHIP_BY_THIRD_PARTY") {
      addNotification(data[e][0]+" "+data[e][2]+" by thirdparty bị quá 30 ngày");
    };

    var searchText = $("#orderSearchInput").val();
    var titleString = data[e][0]+' | '+data[e][2]+' | '+data[e][5];
    var searchContent = data[e][0]+" "+data[e][2]+" "+data[e][3];
    if (searchText) {
      if (!searchContent.toUpperCase().includes(searchText.toUpperCase())){
        continue;
      }
    }

    var orderReady = "";
    if (data[e][9] == 1) {
      orderReady = "borderMustard"
    }

    ///Short description
    var orderDetailBrief="";
    var currentOrderDetail = listOrderDetailParse[data[e][0]];
    var numOfProd = 0;
    var productWeights = 0;
    for (o in currentOrderDetail) {
      // console.log("orderListDetail[e][3]:"+orderListDetail[e][3]);
      var pw = parseFloat(listProductParse[orderListDetail[e][3]] ? listProductParse[orderListDetail[e][3]].productWeight : 0);
      orderDetailBrief += "<span class='"+(currentOrderDetail[o][10]==1 ? "textMustard":"")+"'>"
                        // +'<input type="checkbox" class="checkSubbox checkOrder_'+currentOrderDetail[o][0]+' checkProd_'+e+'"/>'
                        +currentOrderDetail[o][3]+" | "
                        +currentOrderDetail[o][4] 
                        +" (x "+currentOrderDetail[o][5] +" | "+pw+"kg/pc)"
                        +"</span>"
                        +"<br/>";
      numOfProd = numOfProd + parseInt(currentOrderDetail[o][5]);
      productWeights = productWeights + pw;
    }
    // console.log(prodListOrder[o]);
    orderDetailBrief+=(data[e][10] ? "Note:"+data[e][10]+"<br/>" : "");
    // orderDetailBrief+="Tiền hàng:"+data[e][5]+" ( <i class='fas fa-box'>x"+numOfProd+"</i> <i class='fas fa-weight'>"+productWeights+"kg</i> )";
    orderDetailBrief+="Tiền hàng:"+data[e][5]+" ( <i class='fas fa-box'>x"+numOfProd+"</i> )";
    orderDetailBrief+="<hr/>";
    ///

    var paidDiv = "";
    if (shippingType == "SHIPPER_NO_COD" || shippingType == "POST_NO_COD" || shippingType == "SHIP_BY_THIRD_PARTY") {
      paidDiv = '<select class="mdb-select md-form selectPayment selectPaymentStatus_'+e+'">'+
              optionPaid +
            '</select><br/>';
    }

  	$("#listOrder").append(
      // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+data[e][0]+' | '+data[e][2]+' | '+data[e][5]+'</a>'
      '<div class="card cardElement_'+e+'">'+
        '<div class="card-header" id="heading_"'+e+'>'+
          '<h5 class="mb-0">'+
            '<input type="checkbox" class="checkbox check_'+e+'"/>'+
            '<button class="btn '+orderReady+' btn-link btnOrder_'+e+'" data-toggle="collapse" data-target="#collapse_'+e+'" aria-expanded="false" aria-controls="collapse_'+e+'">'+
              data[e][0]+' | '+data[e][2] + ' | '+data[e][5] + 
              iconShip +
              iconPaid +
            '</button>'+
          '</h5>'+
        '</div>'+

        '<div id="collapse_'+e+'" class="collapse" aria-labelledby="heading_'+e+'" data-parent="#listOrder">'+
          '<div class="card-body">'+
            paidDiv+
            // '<select class="mdb-select md-form selectShip selectShipStatus_'+e+'">'+
            //   optionShip +
            // '</select>'+
            // '<label class="mdb-main-label">Đã đặt hàng</label>'+
            // '<div class="btn orderelementdetail order_'+e+' " style="border: 1px solid black;margin-left:10px;">Báo cáo</div>'+
            // '<hr/>'+
            orderDetailBrief+
            '<div class="btn btnNormal5px orderelementsimplified order_'+e+'" >Tối giản</div>'+
            '<div class="btn btnNormal5px orderelement order_'+e+'" >Chi tiết</div>'+
            '<div class="btn btnNormal5px deleteelement order_'+e+'" >Xoá đơn hàng</div>'+
            '<div class="btn btnNormal5px editorder order_'+e+'" >Sửa đơn hàng</div>'+
            '<br/>'+
            '<div class="btn btnNormal5px requestshipping order_'+e+'" >Yêu cầu giao hàng</div>'+
            '<div class="btn btnNormal5px splitorder order_'+e+'" >Tách đơn hàng</div>'+
            '<div class="btn btnNormal5px makecopy order_'+e+'" >Tạo mới y hệt</div>'+
            '<div class="btn btnNormal5px refundBtn order_'+e+'" >Hoàn tiền</div>'+
            btnShopReceiveMoney+
          '</div>'+
        '</div>'+
      '</div>'
      )
  }

  $(".checkbox").hide();
  // $(".checkSubbox").hide();

  afterLoadHTML();


  function removeOrderDetail(orderCode, callback){
    var numOfColumn = 5;
    // console.log("length:"+orderListDetail.length);
    var scanOrderDetail = function (index) {
      if (index < orderListDetail.length) {
        // console.log(orderListDetail[index][0] + " "+orderCode);
        if (orderListDetail[index][0] == orderCode) {
          // console.log(orderListDetail[index][0]+" "+index+" <>")
          var realIndex = index + 1;
          gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetId,
            range : "OrderDetail!A"+realIndex+":K"+realIndex,
            valueInputOption: "USER_ENTERED",
            resource: {
                "majorDimension": "ROWS",
                "values": [["","","","","","","","","","",""]]
            }
          }).then(function(response) {
            
            var result = response.result;
            // console.log(`${result.updatedCells} cells updated.`);
            
            scanOrderDetail(index+1);

          }, function(response) {
            appendPre('Error: ' + response.result.error.message);
          });
        } else {
          scanOrderDetail(index+1);
        }
      } else {
        callback();
        return;
      }
    }
    scanOrderDetail(0);
  }

  function removeOrder(orderIndex, callback) {

    gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range : "Order!A"+orderIndex+":P"+orderIndex,
      valueInputOption: "USER_ENTERED",
      resource: {
          "majorDimension": "ROWS",
          "values": [["","","","","","","","","","","","","","","",""]]
      }
    }).then(function(response) {
      
      var result = response.result;
      // console.log(`${result.updatedCells} cells updated.`);
      
      callback();

    }, function(response) {
      appendPre('Error: ' + response.result.error.message);
    });

    
  }

  $(".deleteelement").click(function(){
    var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    var currentOrder=getOrder(orderIndex);

    // console.log("delete:"+orderIndex);

    var deleteTrigger = function() {
      $("#loadingSpin").show();

      // $(".btnOrder_"+orderIndex).prop('disabled', true);
      // $("#collapse"+orderIndex).collapse();
      orderIndex = parseInt(orderIndex);
      if (orderIndex) {
        var orderCode = data[orderIndex][0];
        // console.log("delete orderCode:"+orderCode);
        $("#loading-text").html("Xoá chi tiết đơn hàng");

        removeOrderDetail(orderCode,function(){
            $("#loading-text").html("Xoá đơn hàng");

            removeOrder(orderIndex+1,function(){
              $(".cardElement_"+orderIndex).remove();

                $("#loadingSpin").hide();
                var shippingIndex = currentOrder.shipIndex;

                if(shippingIndex && shippingIndex > -1) {  
                  $("#loadingSpin").show();

                  var dataUpdateShipping = [
                    ["","","","","","","","","",""]
                  ];
                  var sheetrange = 'Shipping!A'+shippingIndex+':J'+shippingIndex;

                  $("#loading-text").html("Xoá yêu cầu giao hàng");

                  updateShipping(dataUpdateShipping, sheetrange, function(){
                    $("#loadingSpin").hide();
                  }, function(){
                    console.log("Something wrong");
                  })
                }
            })
        })
      }
    }

    $("#modelContent").html("Bạn có chắc chắn muốn xoá không");
    $("#modalYes").click(function(){
      deleteTrigger();
    })
    $('#myModal').modal('show');
  })

  $(".refundBtn").click(function(){
    var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    console.log("refund:"+orderIndex);
    var refundValue = data[orderIndex][14];
    refundValue = refundValue ? refundValue : 0;
    var content = "<div>"+
    "<h3>Hoàn tiền</h3>"+
    '<input type="text" class="form-control refundAmount order_'+orderIndex+'" placeholder="Tiền hoàn" value='+refundValue+'>'+
    "</div>"

    $("#modelContent").html(content);
    $("#modalYes").click(function(){
      var orderIndex = $(".refundAmount").attr("class").split(" ").pop().split("_").pop();
      console.log("Refund : "+ $('.refundAmount').val() + " with "+orderIndex);
      var newValue = $('.refundAmount').val();

      var realOrderIndex = parseInt(orderIndex) + 1;

      var column = 14; //for refund
      $("#loadingSpin").show();
      updateOrderStatus(realOrderIndex,column, newValue , function(){
        $("#loadingSpin").hide();
      });

    })
    $('#myModal').modal('show');
  })

  function getOrder(orderIndex) {
    // console.log($(this));
    var orderCode = data[orderIndex][0];
    var shipIndex = -1;
    if (orderShipStatus[data[orderIndex][0]]){
      shipIndex = orderShipStatus[data[orderIndex][0]].sindex
    }
    var currentOrder = {
      orderCode : orderCode,
      orderDate : data[orderIndex][1],
      customerName : data[orderIndex][2],
      customerAddress : data[orderIndex][3],
      customerPhone : data[orderIndex][4],
      totalPay : data[orderIndex][5],
      shippingCost : data[orderIndex][6],
      totalPayIncludeShip : data[orderIndex][7],
      paymentStatus : data[orderIndex][8],
      shippingStatus : orderShipStatus[data[orderIndex][0]] ? orderShipStatus[data[orderIndex][0]].status : "Requested",
      shippingPaidStatus : orderShipStatus[data[orderIndex][0]] ? orderShipStatus[data[orderIndex][0]].paidStatus : "0",
      shippingCompleteTime : orderShipStatus[data[orderIndex][0]] ? orderShipStatus[data[orderIndex][0]].completeTime : "",
      orderNode : data[orderIndex][10],
      shippingType : data[orderIndex][11],
      otherInfor : data[orderIndex][12],
      prepaid : data[orderIndex][13],
      refund : data[orderIndex][14],
      shipIndex : shipIndex,
      orderIndex : orderIndex,
      otherCost : 0
    }

    var prodListOrder = {};
    var prodIndex = 0;
    for (e in orderListDetail) {
      if (orderListDetail[e][0] == orderCode){
        prodListOrder[prodIndex] = {
          productCode : orderListDetail[e][1],
          importCode : orderListDetail[e][2],
          productRefCode : orderListDetail[e][3],
          productName : orderListDetail[e][4],
          productCount : orderListDetail[e][5],
          productEstimateSellingVND : orderListDetail[e][6],
          turnover : orderListDetail[e][7],
          totalPay : orderListDetail[e][8],
          profit : orderListDetail[e][9],
          available : orderListDetail[e][10],
          orderDetailIndex : e,
          productImage : listProductParse[orderListDetail[e][3]] ? listProductParse[orderListDetail[e][3]].image : "",
          productWeight : listProductParse[orderListDetail[e][3]] ? listProductParse[orderListDetail[e][3]].productWeight : ""
        }
        prodIndex++;
      }
    }

    currentOrder.prodListOrder = prodListOrder;

    localStorage.setItem("currentOrder",JSON.stringify(currentOrder));
    return currentOrder;
  }

  $(".orderelement").click(function(){
    var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    getOrder(orderIndex);

    saveHistory({
      searchText : $("#orderSearchInput").val(),
      status : $("#orderFilter").val(),
      goToClass : $(this).attr("class")
    })

    window.location = "../barcode/showorder.html";
  })

  $(".orderelementsimplified").click(function(){
    var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    getOrder(orderIndex);

    saveHistory({
      searchText : $("#orderSearchInput").val(),
      status : $("#orderFilter").val(),
      goToClass : $(this).attr("class")
    })

    window.location = "../barcode/showorder.html?simplify=true";
  })


  $(".makecopy").click(function(){
    var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    getOrder(orderIndex);

    saveHistory({
      searchText : $("#orderSearchInput").val(),
      status : $("#orderFilter").val(),
      goToClass : $(this).attr("class")
    })

    window.location = "../barcode/neworder.html?makeCopy=true";

  })

  $(".splitorder").click(function(){
    var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    var currentOrder=getOrder(orderIndex);

    // $("#loadingSpin").show();

    saveHistory({
      searchText : $("#orderSearchInput").val(),
      status : $(".orderFilter").val(),
      goToClass : $(this).attr("class")
    })
    // $(".checkOrder_"+currentOrder.orderCode).show();
    // splitOrderAvailable(currentOrder,function(){
    //   location.reload();
    // });

    var content = 
    '<h5>Tách đơn hàng:'+currentOrder.orderCode+' '+currentOrder.customerName+'</h5>';
    // '<div class="btn btnNormal5px shippingType type_0 order_'+orderIndex+'" >Ship không thu tiền</div>'+
    var prodListOrder = currentOrder.prodListOrder;

    for (e in currentOrder.prodListOrder) {
      content += "<div class='checksubdiv "+(prodListOrder[e].available==1 ? "textMustard":"")+"'>"
          +'  <input type="checkbox" class="checkSubbox checkOrder_'+prodListOrder[e].orderCode+' checkProd_'+e+'">'
          +prodListOrder[e].productName+" | "
          +"x"+prodListOrder[e].productCount
          +"</input>"
          +"</div>"
          +"<br/>";
    }
    content+='<div class="btn btnNormal5px btnSplitNow" >Tách</div>';

    $("#simpleModal .modal-content").html(content);
    $("#simpleModal").modal('toggle');

    $(".checksubdiv").click(function(){
      var objInput = $($(this).find("input")[0]);
      if (objInput.is(":checked")){
        objInput.prop( "checked", false );
      } else {
        objInput.prop( "checked", true );        
      }
    })

    $(".btnSplitNow").click(function(){
      var lsChecked = $(".checkSubbox");
      $("#loadingSpin").show();
      var lsProdChecked = []
      for (e=0;e<lsChecked.length;e++){
        if ($(lsChecked[e]).is(":checked")){
          lsProdChecked.push(e);
        }
      }
      // console.log(lsProdChecked);
      // $("#loadingSpin").hide();
      splitOrderAsRequested(currentOrder,lsProdChecked,function(){
        location.reload();
      });
    })
  })

  $(".orderelementdetail").click(function(){
    
  })

  $(".editorder").click(function(){
    // console.log("AAA");
    var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    var currentOrder=getOrder(orderIndex);
    
    saveHistory({
      searchText : $("#orderSearchInput").val(),
      status : $("#orderFilter").val(),
      goToClass : $(this).attr("class")
    })

    window.location = "../barcode/editorder.html"
  })

  $(".requestshipping").click(function(){
    var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    var currentOrder=getOrder(orderIndex);
    var willpay = parseFloat(currentOrder.totalPayIncludeShip) - parseFloat(currentOrder.prepaid ? currentOrder.prepaid : 0);
    var noti4000 = "";
    if (parseFloat(currentOrder.totalPayIncludeShip) >= 4000) {
      noti4000 = "<div class='textRed'>Chú ý đơn này giá trị hơn 4 triệu ("+currentOrder.totalPayIncludeShip+"k), có thể yêu cầu shipper đi giao</div>"
    }
    // console.log(currentOrder.totalPayIncludeShip);
    // console.log(currentOrder.prepaid);    
    // console.log(currentOrder);
    var lsBtnShip = 
    '<h5>Chọn kiểu giao hàng</h5>'+
    // '<div class="btn btnNormal5px shippingType type_0 order_'+orderIndex+'" >Ship không thu tiền</div>'+
    '<div class="btn btnNormal5px shippingType SHIPPER_NO_COD" >Shipper không thu tiền</div>'+
    '<div class="btn btnNormal5px shippingType SHIPPER_COD" >Shipper thu '+willpay+'k</div>'+
    '<div class="btn btnNormal5px shippingType POST_COD" >Ship DVVC thu COD</div>'+
    '<div class="btn btnNormal5px shippingType POST_NO_COD" >Ship DVVC ko COD</div>'+
    '<div class="btn btnNormal5px shippingType SHOPEE" >Ship Shopee</div>' + 
    '<div class="btn btnNormal5px shippingType SHIP_BY_THIRD_PARTY" >Ship từ bên thứ 3</div>'+
    noti4000;
    
    $("#simpleModal .modal-content").html(lsBtnShip);

    $("."+currentOrder.shippingType).css(
      {"background-color": "#c57e0f", "color": "white"}
    );
    $("#simpleModal").modal('toggle');

    $(".shippingType").click(function(){
      $("#simpleModal").modal('hide');
      // console.log(orderIndex);
      // console.log(willpay);
      currentOrder.shippingType =  $(this).attr("class").split(" ").pop();

      //////////
      // console.log("shippingType:"+currentOrder.shippingType);
      if (currentOrder.shippingType == "POST_COD" 
        || currentOrder.shippingType == "SHOPEE"
        || currentOrder.shippingType == "POST_NO_COD" ) {
        currentOrder.otherCost = 5;
      }
      currentOrder.willpay = willpay;

      requestShipping(currentOrder);

      var realOrderIndex = parseInt(orderIndex) + 1;

      var column = 11; //for shipping
      $("#loadingSpin").show();
      updateOrderStatus(realOrderIndex,column,currentOrder.shippingType, function(){
        // console.log("updateOrderStatus for shipping");
        $("#loadingSpin").hide();
      });

    });
  })

  $(".selectPayment").change(function(){
    // console.log("selectPayment:");;
    var line = $(this).attr("class").split(" ").pop().split("_").pop();

    // console.log("selectPayment:"+$(this).attr("class").split(" ").pop().split("_").pop())
    // console.log(document.getElementsByClassName($(this).attr("class"))[0].value);
    var value = document.getElementsByClassName($(this).attr("class"))[0].value;
    
    line = parseInt(line) + 1;

    var column = 8; //for payment
    $("#loadingSpin").show();
    updateOrderStatus(line,column,value, function(){
      $("#loadingSpin").hide();
    });
  })


  $(".selectShip").change(function(){

    console.log("selectShip:"+$(this).attr("class").split(" ").pop().split("_").pop())
    console.log(document.getElementsByClassName($(this).attr("class"))[0].value);
    var value = document.getElementsByClassName($(this).attr("class"))[0].value;
    
    var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    var shipIndex = orderShipStatus[data[orderIndex][0]].sindex;

    // var today = new Date();
    // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // var dateTime = date+' '+time;

    var dateTime = getCurrentDateTime().dateTime;//date+' '+time;

    // var sheetrange = 'Task!D'+shipIndex+':E'+shipIndex;
    var sheetrange = 'Shipping!E'+shipIndex+':G'+shipIndex;

    var dataUpdateTask = [
      [value,orderShipStatus[data[orderIndex][0]].otherCost, dateTime]
    ];

    $("#loadingSpin").show();

    updateShipping(dataUpdateTask, sheetrange, function(){
      
      //Update into excel : order
      
      // var realOrderIndex = orderIndex + 1;

      // var column = 11; //for shipping
      // // $("#loadingSpin").show();
      // updateOrderStatus(realOrderIndex,column,value, function(){
      //   console.log("updateOrderStatus for shipping");
      //   $("#loadingSpin").hide();
      // });
      //end updating

      $("#loadingSpin").hide();

    },function(){
      console.log("Something wrong");
    })

  })

  $(".shopReceiveMoney").click(function(){

    console.log("shopReceiveMoney:"+$(this).attr("class").split(" ").pop().split("_").pop())
    console.log(document.getElementsByClassName($(this).attr("class"))[0].value);
    
    var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    var shipIndex = orderShipStatus[data[orderIndex][0]].sindex;

    // var today = new Date();
    // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // var dateTime = date+' '+time;

    var dateTime = getCurrentDateTime().dateTime;//date+' '+time;

    // var sheetrange = 'Task!D'+shipIndex+':E'+shipIndex;
    var sheetrange = 'Shipping!E'+shipIndex+':G'+shipIndex;

    var dataUpdateTask = [
      ["COMPLETED",orderShipStatus[data[orderIndex][0]].otherCost, dateTime]
    ];

    $("#loadingSpin").show();

    updateShipping(dataUpdateTask, sheetrange, function(){

      $("#loadingSpin").hide();

    },function(){
      console.log("Something wrong");
    })

  })

  $(".requestshippingMany").click(function(){
    var lsChecked = $(".checkbox");
    $("#loadingSpin").show();

    var requestShip = function(index) {
      if (index >= lsChecked.length)  {
        $("#loadingSpin").hide();
        return;
      }

      if ($(lsChecked[index]).is(":checked")){
        // console.log($(lsChecked[index]).attr("class").split(" ").pop().split("_").pop());
        var orderIndex = $(lsChecked[index]).attr("class").split(" ").pop().split("_").pop();

        // console.log($(lsChecked[index]));
        // requestshipping order_'+e+'
        var currentOrder=getOrder(orderIndex);
        // console.log(orderIndex);
        // console.log(currentOrder);

        $("#loading-text").html("Request ship "+currentOrder.orderCode);

        requestShipping(currentOrder,function(){
          requestShip(index+1);
        });

      } else {
        requestShip(index+1);
      }
    }
    requestShip(0);
  })

  $("#loadingSpin").hide();

  function mergeOrder(){
    var lsChecked = $(".checkbox");
    // console.log("Merge theo order:"+$(".mergeByOrder").val());
    var keepOrderCode = "DONHANG_"+$(".mergeByOrder").val();
    var sheetOrderDetail = "OrderDetail";
    var lsRemoveOrderCode = [];
    var keptOrder = {};
    // console.log(lsChecked.length);
    // for (var e1=0;e1<lsChecked.length;e1++){
      // console.log($(lsChecked[e1]).attr("class").split(" ").pop().split("_").pop()+" "+e1+" "+$(lsChecked[e1]).is(":checked"))
    $("#loadingSpin").show();
    
    var checkOneByOne =function (e1, callbackE1) {  
      // console.log("checkOneByOne:"+e1+" "+lsChecked.length);
      if (e1 >= lsChecked.length) {
        callbackE1();
        return;
      }
      if ($(lsChecked[e1]).is(":checked")){
        var orderIndex =  $(lsChecked[e1]).attr("class").split(" ").pop().split("_").pop();
        var currentOrder=getOrder(orderIndex);
        // console.log(currentOrder.orderCode+" "+orderIndex);
        if (currentOrder.orderCode!=keepOrderCode) {
          // console.log("Cut "+currentOrder.orderCode);
          $("#loading-text").html("Convert details in DONHANG_"+currentOrder.orderCode);

          // console.log(currentOrder);
          lsRemoveOrderCode.push({
            orderCode : currentOrder.orderCode,
            orderIndex : currentOrder.orderIndex,
            prepaid : currentOrder.prepaid
          });

          var prodListOrder = currentOrder.prodListOrder;
          var updateEachOrderDetail = function(e2, callbackE2) {
            if (!prodListOrder[e2]) {
              callbackE2();
              return;
            }
            var dataEditOD = [[keepOrderCode]];
            var orderDetailIndex = parseInt(prodListOrder[e2].orderDetailIndex)+1;
            var rangeEdit = sheetOrderDetail+'!A'+orderDetailIndex+':A'+orderDetailIndex;
            // console.log("Cut e2:"+e2+" "+dataEditOD+ " "+rangeEdit);
            $("#loading-text").html("Convert details in DONHANG_"+currentOrder.orderCode+" "+prodListOrder[e2].productName);

            editOrderDetail(dataEditOD, rangeEdit, function(){
              updateEachOrderDetail(e2+1, callbackE2);
            })
          }
          updateEachOrderDetail(0, function(){
            checkOneByOne(e1+1, callbackE1);
          });
        } else {
          keptOrder = {
            orderCode : currentOrder.orderCode,
            orderIndex : currentOrder.orderIndex,
            prepaid : currentOrder.prepaid
          }
          checkOneByOne(e1+1, callbackE1);
        }
      } else {
        checkOneByOne(e1+1, callbackE1);
      }
    }

    var fixPrepaid = function (callbackPrepaid) {
      var totalPrepaid = parseInt(keptOrder.prepaid);
      for (var e in lsRemoveOrderCode) {
        totalPrepaid = totalPrepaid + parseInt(lsRemoveOrderCode[e].prepaid);
      }
      
      var dataEdit = [[totalPrepaid]];
      var orderRealIndex = parseInt(keptOrder.orderIndex)+1;
      var rangeEdit = sheetOrder+'!N'+orderRealIndex+':N'+orderRealIndex;
      // console.log("Cut e2:"+e2+" "+dataEditOD+ " "+rangeEdit);
      $("#loading-text").html("Sửa đặt cọc:"+totalPrepaid);

      editOrder(dataEdit, rangeEdit, function(){
        callbackPrepaid();
      })
    }

    checkOneByOne(0, function(){
      // console.log("Remove orders:")
      // console.log(lsRemoveOrderCode);
      var removeOrderByMerge = function(e3, callbackE3) {
        if (!lsRemoveOrderCode[e3]) {
          callbackE3();
          return;
        }
        $("#loading-text").html("Remove "+lsRemoveOrderCode[e3].orderCode+" at Index:"+lsRemoveOrderCode[e3].orderIndex);
        var realIndex = parseInt(lsRemoveOrderCode[e3].orderIndex)+1;
        removeOrder(realIndex, function(){
          removeOrderByMerge(e3+1, callbackE3);
        })
      }

      removeOrderByMerge(0, function(){
        // $("#loadingSpin").hide();
        fixPrepaid(function() {
          location.reload();
        })
      })
    });
  }

  $(".click-to-view").click(function(){
    var lsChecked = $(".checkbox");
    var totalCost = 0;
    var num = 0;
    var requestedNum = 0;
    var stillInStore = 0;
    // for (e in lsChecked){
    //   if ($(lsChecked[e]).is(":checked")){
    var downloadContent = "No, Name, Count, Price, Total\n";
    var numOfOrder = 0;
    var totalPay = 0;
    var totalOwnerPay = 0;
    var totalProfit = 0;
    var numOfProd = 0;
    var lsOrderCodeSelected = [];
    $('.checkbox').each(function(){ 
        // this.checked = true; });
        if (this.checked){
          numOfOrder = numOfOrder + 1
          var orderIndex =  $(this).attr("class").split(" ").pop().split("_").pop();
          var currentOrder=getOrder(orderIndex);

          lsOrderCodeSelected.push(currentOrder.orderCode);
          totalPay = totalPay + parseInt(currentOrder.totalPay);
          for  (e in currentOrder.prodListOrder) {
            totalOwnerPay = totalOwnerPay + parseInt(currentOrder.prodListOrder[e].totalPay)*parseInt(currentOrder.prodListOrder[e].productCount);
            totalProfit = totalProfit + parseInt(currentOrder.prodListOrder[e].profit);
            numOfProd = numOfProd + parseInt(currentOrder.prodListOrder[e].productCount);          
          }
        }
      }
    )

    var content = "Số đơn hàng:"+numOfOrder+"<br/>"+
                  "Số mặt hàng:"+numOfProd+"<br/>"+
                  "Tổng doanh thu:"+totalPay+"<br/>"+
                  "Tổng vốn:"+totalOwnerPay+"<br/>"+
                  "Tổng lãi:"+totalProfit+"<br/>"+
                  "<hr/>"+
                  "<div>"+
                  "<span class='btn btnNormal5px mergeOrder'>Gộp đơn theo order:</span>"+
                  "<input type='text' class='mergeByOrder'/>"+
                  "</div>"
                  ;
    $("#modelContent").html(content);

    $(".mergeOrder").click(function(){
      // console.log(lsOrderCodeSelected);
      var mergedOrderCodeInput = $(".mergeByOrder").val();
      if (mergedOrderCodeInput && lsOrderCodeSelected.includes("DONHANG_"+mergedOrderCodeInput)) {
            mergeOrder();          
      } else {
        $(".mergeByOrder").val("Sai gì đó rồi!!!");
      }
    });

    $("#modalYes").click(function(){
    })
    $('#myModal').modal('show');
  })

};

function checkSystemConsistent(){

  data = JSON.parse(localStorage.getItem("orderList"));

  for(var e in data) {
    if (data[e][11] == "SHIPPER_COD" || data[e][11] == "POST_COD") {
      if (orderShipStatus[data[e][0]]){
        if (orderShipStatus[data[e][0]].status == "COMPLETED" && data[e][8]!="PAID") {
          // console.log(orderShipStatus[data[e][0]]);
          // console.log(data[e]);
          $(".modal-body").empty();
          $(".modal-body").html("<p id='modelContent'>"+data[e][0]+" : "+data[e][11]+" đã thanh toán?</p>");
          $('#myModal').modal('show');
          return;
        } 
      }
    }
  }
}

$(".click-to-notify").click(function(){
  $(".modal-body").empty();
  var content = "<div id='modelContent'>Chú ý:<br/>"
  for (e in lsNotifications){
    content+= lsNotifications[e]+"<br/>"
  }
  content+="</div>";

  $(".modal-body").html(content);

  $('#myModal').modal('show');
})

// $(".click-to-select").click(function(){
  
//   // checkSystemConsistent();

//   if($(".checkbox").is(':visible') ) {
//     $(".checkbox").hide();
//     $("#controllMany").hide();
//   } else {
//     $(".checkbox").show();
//     $("#controllMany").show();
//   }
// })



$("#orderFilter").change(function(){
  console.log("orderFilter:");
  orderWithProdRef = [];
  // status = document.getElementsByClassName($(this).attr("class"))[0].value;
  loadOrderListHtml();
})


$("#orderSearchInput").keyup(function(){
  var searchText = $(this).val();
  // console.log("search:"+searchText);
  loadOrderListHtml();
});

$(".click-to-select").click(function(){
  if($(".checkbox").is(':visible') ) {
    $(".checkbox").hide();
    $(".prodExtend").hide();
    $(".click-to-select-all").hide();
    $("#controllMany").hide();
    $(".click-to-view").hide();

  } else {
    $(".checkbox").show();
    $(".prodExtend").show();
    $(".click-to-select-all").show();
    $("#controllMany").show();
    $(".click-to-view").show();

  }
})

$(".click-to-select-all").click(function(){
  // var lsChecked = $(".checkbox");
  // for (e in lsChecked){
  //   $(lsChecked[e]).attr("checked", true);
  // }
  var count = 0;
  var check = false;
  $('.checkbox').each(function(){ 
    count++;
    if (count == 1 && this.checked) {
      check = true;
    }
    if (check){
      this.checked = false; 
    } else {
      this.checked = true;
    }
  });

})


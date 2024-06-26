// 0:SHIPPER_NO_COD
// 1:SHIPPER_COD
// 2:POST_COD
// 3:SHOPEE
// 4:POST_NO_COD
// 5:SHIP_BY_THIRD_PARTY

//=if(I2=0,"SHIPPER_NO_COD",if(I2=1,"SHIPPER_COD",if(I2=2,"POST_COD","SHOPEE")))
var lsOrder;
var lsTask;
var lsOrderDetail;
var ghtkToken = "";

var ghnToken = "";

var userRole = JSON.parse(localStorage.getItem("userRole"));

var startDateFilter = undefined;
var endDateFilter = undefined;
$('.datetimepicker').hide();

// $(".orderFilter").val("Need_Schedule");
$(".orderFilter").val("Requested");
$(".maintitle").html("Quản lý đơn hàng - " + localStorage.getItem("datasetName"));

$(".click-to-select-all").hide();
$(".click-to-view").hide();

//Load history

//saveHistory({
// orderFilter : $(".orderFilter").val(),
// goToClass : $(this).attr("class")
// })
var historicalData = readCurrentHistoryData();
if (historicalData) {
  // console.log("historicalData");
  // console.log(historicalData);

  if (historicalData.orderFilter) {
    var orderFilter = historicalData.orderFilter;
    $(".orderFilter").val(orderFilter);
  }
}

var afterLoadHTML = function () {
  // document.getElementsByClassName
  if (historicalData && historicalData.goToClass) {
    // document.getElementsByClassName(historicalData.goToClass)[0].scrollIntoView();
    var $container = $("html,body");
    var orderIndex = historicalData.goToClass.split(" ").pop().split("_").pop();
    var btnOrder = "btnOrder_" + orderIndex;
    // var orderFilter = $(".orderFilter");
    // if (orderFilter == "Requested" 
    //   || orderFilter == "SENT_POST"
    //   || orderFilter == "SHIPPER_RECEIVED_MONEY"
    //   || orderFilter == "COMPLETED" 
    //   || orderFilter == "ALL" 
    //   ) {
    // btnOrder = "btnOrder_"+orderIndex;
    // }

    // console.log("goToClass:"+btnOrder);

    var $scrollTo = $('.' + btnOrder);

    $("html,body").animate({ scrollTop: $scrollTo.offset().top - $container.offset().top + $container.scrollTop() - 100, scrollLeft: 0 }, 300);
    $scrollTo.click();

    historicalData = undefined;
  }
}
/////////////

var triggerAfterLoad = function () {

  $("#loadingSpin").show();

  var step2 = function () {
    getOrderShipping(function (lsOrderset) {
      $("#loadingSpin").hide();
      lsOrder = lsOrderset;
      if (!lsOrder || lsOrder.length == 0) {
        lsOrder = JSON.parse(localStorage.getItem("ordershipping"));
      }
      readOrderDetail(function () {
        loadOrderShippingListHtml();
      });
      getTaskList(function (lsTaskset) {
        // console.log("getTaskList");
        lsTask = lsTaskset;
        if (!lsTask) {
          lsTask = JSON.parse(localStorage.getItem("tasklist"));
        }
      })
    });
    if (userRole == "manager") {
      getGhtkAccess(function (rs) {
        ghtkToken = "";
        ghtkAuthorization = "";
        if (rs) {
          ghtkToken = rs["ghtkToken"];
          ghtkAuthorization = rs["ghtkAuthorization"];
        }
        localStorage.setItem("ghtkToken", ghtkToken);
        localStorage.setItem("ghtkAuthorization", ghtkAuthorization);

      })
      // getGhnAccess(function(rs){
      //   if (rs) {
      //     ghnToken = rs["ghnToken"];
      //   }
      //   localStorage.setItem("ghnToken",ghnToken);
      // })
      loginViettelPost(function () {
      })
    }

    getShippingReport(function (shippingRpData) {
      $(".textBottomCenter").html(shippingRpData ? shippingRpData[5][1] : 0);
    })
  }

  if (userRole == "manager") {
    loadOrderList(function () {
      parseOrderSheetList();

      // getGhtkAccess(function(rs){
      //   var ghtkToken = "";
      //   if (rs) {
      //     ghtkToken = rs["ghtkToken"];
      //   }
      //   localStorage.setItem("ghtkToken",ghtkToken);
      // })

      step2();
    })
  } else {
    step2();
  }
}

listOrderSheetParse = {};

function parseOrderSheetList() {
  listOrderSheetParse = {};
  var orderList = JSON.parse(localStorage.getItem("orderList"));
  for (var e in orderList) {
    listOrderSheetParse[orderList[e][0]] = {
      orderIndex: e,
      totalPay: orderList[e][5]
    }
  }
}

$(".text-center").click(function () {
  // getOrderShipping(function(lsOrderset){
  //     lsOrder = lsOrderset;
  //     loadOrderShippingListHtml(lsOrder);
  //     getTaskList(function(lsTaskset){
  //       lsTask = lsTaskset;
  //     })
  // });
  // triggerAfterLoad();
  // console.log("Trigger");

  // lsOrder = JSON.parse(localStorage.getItem("ordershipping"));
  // lsTask =  JSON.parse(localStorage.getItem("tasklist"));
  // // console.log(lsOrder);
  // readOrderDetail(loadOrderShippingListHtml);

})

// var orderListParse = {}

// function parseOrder(){
//   if (userRole!="manager") {
//     return;
//   }
//   loadOrderList(function(orderlist){
//     for (e in orderlist) {
//       if (!orderlist[e][0]) {
//         continue;
//       }
//       orderListParse[orderlist[e][0]] = {
//         index : e,
//         orderCode : orderlist[e][1]
//       }
//     }
//   })
// }

function readOrderDetail(callback) {
  // console.log("userRole:"+userRole);
  // if (userRole!="manager") {
  //   callback();
  //   return;
  // }
  lsOrderDetail = {}
  for (var e in lsOrder) {
    if (e == 0) {
      continue;
    }

    if (!lsOrder[e][0]) {
      continue;
    }
    lsOrderDetail[lsOrder[e][0]] = JSON.parse(lsOrder[e][3]);
    // console.log(lsOrderDetail[lsOrder[e][0]]);
    if (userRole == "manager") {
      if (!listOrderSheetParse[lsOrder[e][0]]) {
        $(".modal-body").empty();
        $(".modal-body").html("<p id='modelContent'>" + lsOrder[e][0] + "-" + lsOrderDetail[lsOrder[e][0]].customerName + " ko tồn tại trong sheet Order</p>");
        $('#myModal').modal('toggle');
      } else if (listOrderSheetParse[lsOrder[e][0]].totalPay != lsOrderDetail[lsOrder[e][0]].totalPay) {
        $(".modal-body").empty();
        $(".modal-body").html("<p id='modelContent'>" + lsOrder[e][0] + "-" + lsOrderDetail[lsOrder[e][0]].customerName + " tổng tiền hàng ko khớp</p>");
        $('#myModal').modal('toggle');
      }

    }
  }
  // console.log(lsOrderDetail);
  callback();
}

// $(document).ready(function () {

//DatePicker Example
// $('#datetimepicker').datetimepicker();
// });

// var mode = "Requested";

var totalShippingCost = 0;

var packedCost = 0;
var postAndShopeeCost = 0;
var shippedCost = 0;

var lsCount = {}

// 0:SHIPPER_NO_COD
// 1:SHIPPER_COD
// 2:POST_COD
// 3:SHOPEE
// 4:POST_NO_COD
// 5:SHIP_BY_THIRD_PARTY

if (userRole != "manager") {
  $(".click-to-select").hide();
}

function loadOrderShippingListHtml() {

  // console.log("loadOrderShippingListHtml");

  $("#controllMany").hide();

  $("#listShippingOrder").empty();

  // $(".maintitle").html("Quản lý giao hàng");


  // var userRole = JSON.parse(localStorage.getItem("userRole"));

  totalShippingCost = 0
  var totalShipperReceivedMoney = 0;

  var mode = $(".orderFilter").val();

  lsCount = {
    "SHIPPER_NO_COD": 0,
    "SHIPPER_COD": 0,
    "POST_COD": 0,
    "SHOPEE": 0,
    "POST_NO_COD": 0
  };

  for (e in lsOrder) {
    if (e == 0) {
      continue;
    }

    if (!lsOrder[e][0]) {
      continue;
    }

    if (lsOrder[e][4] == "COMPLETED") {
      totalShippingCost += parseInt(lsOrder[e][7]) + parseInt(lsOrder[e][5])
    }
    var willpay = lsOrderDetail[lsOrder[e][0]].willpay;
    willpay = willpay ? willpay : 0;
    if (mode != "ALL" && mode != "Need_Schedule" && mode != "PAYSHIP") {
      if (mode == "RequestedSHIP" && lsOrder[e][4] == "Requested") {
        if (!(lsOrder[e][8] == "SHIPPER_COD" || lsOrder[e][8] == "SHIPPER_NO_COD")) {
          continue;
        }
      } else
        if (mode == "RequestedPOST" && lsOrder[e][4] == "Requested") {
          if (!(lsOrder[e][8] == "POST_COD" || lsOrder[e][8] == "POST_NO_COD")) {
            continue;
          }
        } else
          if (mode == "RequestedSHOPEE" && lsOrder[e][4] == "Requested") {
            if (!(lsOrder[e][8] == "SHOPEE")) {
              continue;
            }
          } else
            if (mode != lsOrder[e][4]) {
              continue;
            }
    }

    if (lsOrder[e][4] == "SHIPPER_RECEIVED_MONEY") {
      totalShipperReceivedMoney += parseFloat(lsOrderDetail[lsOrder[e][0]].willpay);
    }

    if (lsOrder[e][4] == "SENT_POST") {
      totalShipperReceivedMoney += parseFloat(lsOrderDetail[lsOrder[e][0]].totalPay);
    }

    var payshipButton = "";
    if (mode == "PAYSHIP") {
      if (lsOrder[e][9] == "1" || lsOrder[e][4] != "COMPLETED") {
        continue;
      }
      packedCost += 5;

      console.log(lsOrder[e][0] + ">" + lsOrder[e][7] + ">" + parseFloat(lsOrder[e][7] ? lsOrder[e][7] : 0) + " " + lsOrder[e][8]);


      if (lsOrder[e][8] == "SHIPPER_COD" || lsOrder[e][8] == "SHIPPER_NO_COD") {
        shippedCost += parseFloat(lsOrder[e][7] ? lsOrder[e][7] : 0);
      } else {
        postAndShopeeCost += parseFloat(lsOrder[e][5] ? lsOrder[e][5] : 0);
      }
      // console.log("userRole:"+userRole);
      if (userRole == "manager") {
        payshipButton = '<div class="btn btn-default btnNormal5px payship order_' + e + '">Trả công ship</div>';
        $("#controllMany").show();
      }
    }

    var searchText = $("#orderSearchInput").val();
    var searchContent = lsOrder[e][0] + " " + lsOrder[e][1] + " " + lsOrder[e][2] + " " + lsOrderDetail[lsOrder[e][0]].customerName;
    if (searchText) {
      if (!searchContent.toUpperCase().includes(searchText.toUpperCase())) {
        continue;
      }
    }

    if (mode == "COMPLETED") {
      if (startDateFilter) {
        if (new Date(lsOrder[e][6]) < startDateFilter) {
          continue;
        }
      }
      if (endDateFilter) {
        if (new Date(lsOrder[e][6]) > endDateFilter) {
          continue;
        }
      }
    }
    var shippingCodeDescription = "";
    var shipIcon = '[<i class="fas fa-motorcycle">' + lsOrder[e][8] + '</i>]';

    var mark = "";
    var bgMarkAsLogiticCodice = ""
    if (lsOrder[e][8] == "POST_COD" || lsOrder[e][8] == "POST_NO_COD") {
      if (lsOrderDetail[lsOrder[e][0]].otherInfor) {
        try {
          lsOrderDetail[lsOrder[e][0]].otherInfor = JSON.parse(lsOrderDetail[lsOrder[e][0]].otherInfor);
        } catch (e) {

        }
        // console.log(lsOrderDetail[lsOrder[e][0]].otherInfor)

        var logiticCodice = undefined
        try {
          logiticCodice = lsOrderDetail[lsOrder[e][0]].otherInfor.order.order.label;
          if (logiticCodice) {
            shippingCodeDescription += "GHTK Code: <b><span class='textRed ghtkCode'>" + logiticCodice + "</span></b><br/>";
            mark = "textGreen";
            bgMarkAsLogiticCodice = "bgBisque"
            shipIcon = '[<img src="../img/ghtk.png" class="shippingLogo">' + lsOrder[e][8] + '</img> ]';
            lsOrderDetail[lsOrder[e][0]].otherInfor.shippingProvider = "GHTK";
            lsOrderDetail[lsOrder[e][0]].otherInfor.logiticCodice = logiticCodice;
          }
          // console.log(lsOrder[e][0]+" "+lsOrderDetail[lsOrder[e][0]].otherInfor.order.order.label);
        } catch (e) {

        }

        try {
          logiticCodice = lsOrderDetail[lsOrder[e][0]].otherInfor.order.viettelPostlabel;
          if (logiticCodice) {
            shippingCodeDescription += "ViettelPost Code: <b><span class='textRed ghtkCode'>" + logiticCodice + "</span></b><br/>";
            mark = "textRed";
            bgMarkAsLogiticCodice = "bgBisque"
            shipIcon = '[<img src="../img/viettelpost.png" class="shippingLogo">' + lsOrder[e][8] + '</img> ]';
            lsOrderDetail[lsOrder[e][0]].otherInfor.shippingProvider = "ViettelPost";
            lsOrderDetail[lsOrder[e][0]].otherInfor.logiticCodice = logiticCodice;
          }
          // console.log(lsOrder[e][0]+" "+lsOrderDetail[lsOrder[e][0]].otherInfor.order.order.label);
        } catch (e) {

        }

        try {
          logiticCodice = lsOrderDetail[lsOrder[e][0]].otherInfor.order.ghnLabel;
          if (logiticCodice) {
            shippingCodeDescription += "GHN Code: <b><span class='textRed ghtkCode'>" + logiticCodice + "</span></b><br/>";
            mark = "textRed";
            bgMarkAsLogiticCodice = "bgBisque"
            shipIcon = '[<img src="../img/ghn.png" class="shippingLogo">' + lsOrder[e][8] + '</img> ]';
            lsOrderDetail[lsOrder[e][0]].otherInfor.shippingProvider = "GHN";
            lsOrderDetail[lsOrder[e][0]].otherInfor.logiticCodice = logiticCodice;
          }
          // console.log(lsOrder[e][0]+" "+lsOrderDetail[lsOrder[e][0]].otherInfor.order.order.label);
        } catch (e) {

        }

        if (!logiticCodice) {
          // if (userRole=="manager"){
          try {
            savedGHTKRequest = lsOrderDetail[lsOrder[e][0]].otherInfor.savedRequest;
            // console.log(savedGHTKRequest);
            if (savedGHTKRequest) {
              shippingCodeDescription += '<div class="btn btn-default btnNormal5px getGHTKCodeFromSavedRequest getGHTKCodeFromSavedRequest_' + e + '" >Lấy mã GHTK</div><br/><br/>';
            }
            // console.log(lsOrder[e][0]+" "+lsOrderDetail[lsOrder[e][0]].otherInfor.order.order.label);
          } catch (e) {

          }
          // }
        }
      }
    }

    var title = lsOrder[e][0] + ' | ' + lsOrderDetail[lsOrder[e][0]].customerName + " | " + lsOrder[e][1] + " | " + shipIcon;


    var address = lsOrder[e][1].replace(/[|&;$%@"<>()+,]/g, "").trim().replace(" ", "+");

    var deleteButton = userRole == "manager" ? '<div class="btn btn-default btnNormal5px delete order_' + e + '">Xoá</div>' : "";

    // var datetime = '<input type="text" class="datetimepicker form-control"/></br>';


    // var datetime;
    // var requestedDate;
    // var next2days;

    // if (lsOrder[e][11]) {
    //   datetime = '<div class="btn btn-default btnNormal5px" >Thời gian giao:'+lsOrder[e][11]+'</div><br/>';
    // } else {

    //   var dateText = lsOrder[e][10].split(" ")[0].replace(new RegExp('-', 'g'), '/');
    //   requestedDate = new Date(dateText);
    //   // console.log(dateText);
    //   next2days = new Date();
    //   next2days.setDate(requestedDate.getDate()+2);

    //   if (next2days < new Date()) {
    //     datetime = '<div class="btn btn-default btnNormal5px textRed" >Quá hạn lên lịch!</div><br/>';
    //   } else {
    //     datetime ='   <div class="form-group">'+
    //             // '      <label class="control-label">Thời gian giao hàng</label>'+
    //             '      <div class=\'input-group date\'>'+
    //             '         <input type=\'text\' class="datetimepicker form-control datetimepickerorder_'+e+'" placeholder="Chọn thời gian giao hàng"/>'+
    //             '      </div>'+
    //             '     <div class="btn btn-default btnNormal5px btnChooseShippingSchedule chooseShippingSchedule_'+e+'">'+
    //             '       Xác nhận thời gian giao hàng'+
    //             '     </div>'+
    //             '   </div>'+
    //             '<hr/>';
    //   }
    // }

    var completeButton = '<div class="btn btn-default  btnNormal5px complete order_' + e + '" >Hoàn thành</div>';

    if (lsOrder[e][8] == "SHIPPER_COD" && lsOrder[e][4] == "Requested") {
      completeButton = '<div class="btn btn-default btnNormal5px complete order_' + e + '" >Hoàn thành (thu ' + lsOrderDetail[lsOrder[e][0]].willpay + 'k)</div>';
      title = lsOrder[e][0] + ' | ' + lsOrderDetail[lsOrder[e][0]].customerName + " | " + lsOrder[e][1] + " | " + shipIcon + " (" + lsOrderDetail[lsOrder[e][0]].willpay + "k)";

    }

    if (lsOrder[e][8] == "POST_NO_COD" && lsOrder[e][4] == "Requested" || lsOrder[e][4] == "PACKED") {
      completeButton = '<div class="btn btn-default btnNormal5px complete order_' + e + '" >Đã gửi bên vận chuyển</div>';
      // '<div class="btn btn-default btnNormal5px shipperReceiveMonney order_'+e+'" >Ship đã nhận tiền</div>';
    }

    if (lsOrder[e][8] == "POST_COD" && lsOrder[e][4] == "Requested" || lsOrder[e][4] == "PACKED") {
      completeButton = '<div class="btn btn-default btnNormal5px complete order_' + e + '" >Đã gửi bên vận chuyển (COD thu : ' + lsOrderDetail[lsOrder[e][0]].totalPay + 'k) </div>';
      title = lsOrder[e][0] + ' | ' + lsOrderDetail[lsOrder[e][0]].customerName + " | " + lsOrder[e][1] + " | " + shipIcon + " (" + lsOrderDetail[lsOrder[e][0]].willpay + "k)";
    }

    if (lsOrder[e][8] == "POST_COD" && lsOrder[e][4] == "SENT_POST") {
      completeButton = '<div class="btn btn-default btnNormal5px complete order_' + e + '" >SHOP đã nhận tiền</div>';
    }

    if (lsOrder[e][4] == "SHIPPER_RECEIVED_MONEY") {
      if (userRole == "manager") {
        completeButton = '<div class="btn btn-default btnNormal5px complete order_' + e + '" >SHOP đã nhận tiền (' + lsOrderDetail[lsOrder[e][0]].willpay + ')</div>';
      } else {
        completeButton = '<div class="btn btn-default btnNormal5px order_' + e + '" >Chờ xác nhận từ SHOP</div>';
      }
    }

    var packButton = '';
    if (lsOrder[e][4] == "Requested") {
      packButton = '<div class="btn btn-default btnNormal5px packedOrder order_' + e + '" >Đã đóng gói</div>';
    }


    if (lsOrder[e][6] && lsOrder[e][4] == "COMPLETED") {
      completeButton = '<div class="btn borderMustard btn-default btnNormal5px" >Hoàn thành lúc ' + lsOrder[e][6] + '</div>';
    }

    lsCount[lsOrder[e][8]] = lsCount[lsOrder[e][8]] + 1;

    var preparedButton = '<div class="btn btn-default btnNormal5px prepared preparedOrder_' + e + '" ">Đã chuẩn bị</div><br/>';
    // var orderReady = "";
    // if (lsOrder[e][8]) {
    //   // console.log(lsOrder[e][8]);
    //   orderReady = "borderMustard"
    //   preparedButton = '<div class="btn borderMustard btn-default btnNormal" style="margin:10px 10px 0;">Đã chuẩn bị lúc:'+lsOrder[e][8]+'</div><br/>';
    // }

    // var orderDetailBrief = "<hr/>Shipper không thu tiền<hr/>";

    var packageImageBtn = '<br/>'
      + '<div class="btn btn-default btnNormal5px packageImage packageImage_1_' + e + '" ">Chụp ảnh hàng</div>'
      + '<div style="height: 0px;width:0px; overflow:hidden;">'
      + '  <input id="pkScanImage_1_' + e + '" class="pkScanImage pkScanImage_1_' + e + '" type="file" class="btn btn-primary mb-2" accept="image/*;capture=camera" />'
      + '</div>'
      + '<div class="btn btn-default ' + (lsOrder[e][12] ? "" : "divHide") + ' btnNormal5px showPackageImage showPackageImage_1_' + e + '" ">Xem ảnh hàng</div>'
      + '<br/>'
      + '<div class="btn btn-default btnNormal5px packageImage packageImage_2_' + e + '" ">Chụp ảnh gói hàng</div>'
      + '<div style="height: 0px;width:0px; overflow:hidden;">'
      + '  <input id="pkScanImage_2_' + e + '" class="pkScanImage pkScanImage_2_' + e + '" type="file" class="btn btn-primary mb-2" accept="image/*;capture=camera" />'
      + '</div>'
      + '<div class="btn btn-default ' + (lsOrder[e][13] ? "" : "divHide") + ' btnNormal5px showPackageImage showPackageImage_2_' + e + '" ">Xem ảnh gói hàng</div>'
      + '<br/>';

    var orderDetailBrief = "<hr/>";

    // if (lsOrder[e][8]=="SHIPPER_COD") {
    //   shipIcon = '[<i class="fas fa-motorcycle">COD</i>]';
    //   // orderDetailBrief = "<hr/>Shipper nhớ thu tiền<hr/>";
    // } else if (lsOrder[e][8]=="POST_COD") {
    //   shipIcon = '[<i class="fas fa-motorcycle">VIETTELPOST</i>]';
    //   // if (lsOrder[e][4] == "SENT_POST") {
    //   //    shipIcon = '[<i class="fas fa-motorcycle">VIETTELPOST (Đã gửi)</i>]';     
    //   // }
    //   // orderDetailBrief = "<hr/>Shipper gửi VIETTELPOST<hr/>";
    // } else if (lsOrder[e][8]=="SHOPEE") {
    //   shipIcon = '[<i class="fas fa-motorcycle">SHOPEE</i>]';
    //   // orderDetailBrief = "<hr/>Shipper gửi VIETTELPOST<hr/>";
    // }

    // var title = lsOrder[e][0]+' | '+lsOrder[e][1] +" | "+shipIcon;
    // if (userRole=="manager") {
    // console.log(lsOrderDetail[lsOrder[e][0]].customerName);
    // var title = lsOrder[e][0]+' | '+lsOrderDetail[lsOrder[e][0]].customerName+" | "+lsOrder[e][1] +" | "+shipIcon;
    // }

    orderDetailBrief += '<div class="btn btn-default btnNormal5px startPreparing order_' + e + '" >Bắt đầu xếp hàng</div><br/>'

    var prodListOrder = lsOrderDetail[lsOrder[e][0]].prodListOrder;
    var numOfProd = 0;
    var productWeights = 0;
    for (o in prodListOrder) {
      if (prodListOrder[o].delete) {
        continue;
      }
      numOfProd = numOfProd + parseInt(prodListOrder[o].productCount);
      // productWeights = productWeights + parseFloat(prodListOrder[o].productWeight);

      // orderDetailBrief += prodListOrder[o].productName + " (sl:"+prodListOrder[o].productCount +" | "+prodListOrder[o].productWeight+" kg/pc)<br/>"
      // orderDetailBrief += prodListOrder[o].productName + " (sl:"+prodListOrder[o].productCount +")<br/>"

    }
    // console.log(prodListOrder[o]);
    // orderDetailBrief+="Tổng tiền hàng:"+lsOrderDetail[lsOrder[e][0]].totalPay+"</br>";
    // orderDetailBrief+="Tiền hàng:"+lsOrderDetail[lsOrder[e][0]].totalPay+" ( <i class='fas fa-box'>x"+numOfProd+"</i> <i class='fas fa-weight'>"+productWeights+"kg</i> ) <br/>";
    // orderDetailBrief+="Tiền hàng:"+lsOrderDetail[lsOrder[e][0]].totalPay+" ( <i class='fas fa-box'>x"+numOfProd+"</i> ) <br/>";
    orderDetailBrief += "Tiền hàng:" + lsOrderDetail[lsOrder[e][0]].totalPay + " <br/> Số lượng hàng: " + numOfProd + " <br/>";

    lsOrderDetail[lsOrder[e][0]].numOfProd = numOfProd;

    var dateText = lsOrder[e][10].split(" ")[0].replace(new RegExp('-', 'g'), '/');
    var requestedDate = new Date(dateText);
    var next2days = new Date(requestedDate);
    //5: Friday, 6: Sat, 0->4: Sun to thursay
    if (requestedDate.getDay() >= 0 && requestedDate.getDay() <= 4) {
      next2days.setDate(requestedDate.getDate() + 2);
    } else if (requestedDate.getDay() == 5) {
      next2days.setDate(requestedDate.getDate() + 4);
    } else if (requestedDate.getDay() == 6) {
      next2days.setDate(requestedDate.getDate() + 3);
    }

    orderDetailBrief += "Yêu câù lúc:" + getCurrentDateTime(requestedDate).date + " Deadline:" + getCurrentDateTime(next2days).date + "<br/>";
    orderDetailBrief += shippingCodeDescription;

    orderDetailBrief += (lsOrderDetail[lsOrder[e][0]].orderNode ? "Note:" + lsOrderDetail[lsOrder[e][0]].orderNode + "<br/>" : "");
    orderDetailBrief += (lsOrderDetail[lsOrder[e][0]].otherInfor ? lsOrderDetail[lsOrder[e][0]].otherInfor.isFreeShip == true ? "<span class='text-mustard'>Shop thanh toán ship, free ship cho khách</span><br/>" : "" : "")

    orderDetailBrief += "<hr/>";
    var ghtkBtn = "";

    if (userRole == "manager") {
      // mark = (next2days < new Date() ? "textRed" : "");
      if (lsOrder[e][8] == "POST_COD" || lsOrder[e][8] == "POST_NO_COD") {
        ghtkBtn = '<br/>'
          + '<div class="btn btn-default btnNormal5px ghtkLink order_' + e + '">Liên kết GHTK</div>'
          + '<div class="btn btn-default btnNormal5px viettelpostLink order_' + e + '">Liên kết ViettelPost</div>'
          + '<div class="btn btn-default btnNormal5px ghnLink order_' + e + '">Liên kết GHN</div>';
      }
    }

    $("#listShippingOrder").append(
      // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+lsOrder[e][0]+' | '+lsOrder[e][2]+' | '+lsOrder[e][5]+'</a>'
      '<div class="card cardElement_' + e + ' ' + bgMarkAsLogiticCodice + '">' +
      '<div class="card-header" id="heading_' + e + '">' +
      '<h5 class="mb-0">' +
      '<input type="checkbox" class="checkbox check_' + e + '"/>' +
      '<button class="btn btn-link ' + mark + ' btnOrder_' + e + '" data-toggle="collapse" data-target="#collapse_' + e + '" aria-expanded="false" aria-controls="collapse_' + e + '">' +
      title +
      '</button>' +
      '</h5>' +
      '</div>' +

      '<div id="collapse_' + e + '" class="collapse" aria-labelledby="heading_' + e + '" data-parent="#listShippingOrder">' +
      '<div class="card-body">' +
      '<div class="btn btn-default btnNormal5px">' +
      '  <a href="tel:' + lsOrder[e][2] + '"><span class="fas fa-phone"></span>' + lsOrder[e][2] + '</a>' +
      '</div>' +
      '<br/>' +
      '<div class="btn btn-default btnNormal5px" style="margin-top:10px;">' +
      '  <a href="http://maps.google.com/maps?q=' + address + '"><span class="fas fa-address-card"></span>' + lsOrder[e][1] + '</a>' +
      '</div>' +
      '<br/>' +
      orderDetailBrief +

      // datetime +

      '<div class="btn btn-default btnNormal5px detail order_' + e + '">Xem chi tiết</div>' +
      '<div class="btn btn-default btnNormal5px startPreparingPrintingForm order_' + e + '" >In đơn</div><br/>' +
      // preparedButton +
      // packageImageBtn+
      completeButton +
      deleteButton +
      payshipButton +
      ghtkBtn +
      packButton +
      '</div>' +
      '</div>' +
      '</div>'
    )

    if (lsOrder[e][12]) {
      $(".showPackageImage").click(clickToShowImageEvent);
    }

    // $('.datetimepicker').datetimepicker();
    // if (!lsOrder[e][11]) {
    //   // $('.datetimepickerorder_'+e).datetimepicker();
    //   // console.log(lsOrder[e]);

    //   // $('.datetimepicker').datetimepicker();
    //   $('.datetimepickerorder_'+e).datetimepicker({
    //     // autoclose: true,
    //     minDate : requestedDate,
    //     maxDate : next2days
    //   });
    //   // console.log($('.datetimepickerorder_'+e));
    //   // $('.datetimepickerorder_'+e).data("DateTimePicker").minDate(requestedDate);
    //   // $('.datetimepickerorder_'+e).data("DateTimePicker").maxDate(next2days);

    // }
  }

  // if ($('#listShippingOrder').is(':empty')){
  //   if ($(".orderFilter").val() != "Requested") {
  //     $(".orderFilter").val("Requested");
  //     loadOrderShippingListHtml();
  //   }
  //   return;
  // }

  $(".checkbox").hide();

  afterLoadHTML();

  if (mode == "SHIPPER_RECEIVED_MONEY") {
    $("#note").html("Shipper đã nhận :" + totalShipperReceivedMoney);
  } else if (mode == "SENT_POST") {
    $("#note").html("Tiền hàng từ post:" + totalShipperReceivedMoney);
  } else if (mode == "PAYSHIP") {

    var reportPay = ("Tiền gói hàng (số đơn:" + (packedCost / 5) + " X 5): " + packedCost + "k<br/>Tiền đi ship: " + shippedCost + "k<br/>Tiền post và shoppe: " + postAndShopeeCost + "k<br/>");
    var taskPayfn = getTaskUnpaid();

    var taskPay = taskPayfn.taskPay;
    reportPay += taskPayfn.text;
    reportPay += "Tiền nhiệm vụ:" + taskPayfn.taskPay + "k<br/>";
    reportPay += "Tổng tiền cho shipper:" + (packedCost + shippedCost + postAndShopeeCost + taskPayfn.taskPay) + "k<br/>";
    reportPay += "<div class='text-blue'>Shipper đang cầm:" + totalShipperReceivedMoney + "k</div><br/>";

    $("#note").html(reportPay);
  } else {
    var lsCountText = "<hr/>Tổng cộng:<br/>";
    // console.log(lsCount)
    for (e in lsCount) {
      lsCountText += e + " : " + lsCount[e] + "<br/>"
    }
    $("#note").html(lsCountText);
  }



  $(".complete").click(shipComplete)
  $(".detail").click(showDetail);
  $(".delete").click(deleteShipRequest);

  $(".payship").click(payShipForEachShip);

  // $('.datetimepicker').datetimepicker();
  $('.prepared').click(shipPrepared);

  $('.packageImage').click(pkImageBtnClick);
  $(".pkScanImage").on("change", pkImageScan);

  $(".btnChooseShippingSchedule").hide();
  $(".btnChooseShippingSchedule").click(chooseShippingScheduleFn);
  $(".startPreparing").click(startPreparingFn);
  $(".startPreparingPrintingForm").click(startPreparingPrintingFormFn);

  // $('.datetimepicker').change(function(){
  //   // console.log($(this).attr("class"));
  //   // console.log($(this).val());
  //   var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();

  //   if ($(this).val()) {
  //     // console.log(".btnChooseShippingSchedule "+orderIndex);
  //     $(".chooseShippingSchedule_"+orderIndex).show();
  //     // chooseShippingScheduleFn(orderIndex, $(this).val());
  //   }  else {
  //     $(".chooseShippingSchedule_"+orderIndex).hide();
  //   }
  // });
  $(".ghtkLink").click(ghtkLinkFn);
  $(".viettelpostLink").click(viettelpostLinkFn);
  $(".ghnLink").click(ghnLinkFn);
  $(".shipperReceiveMonney").click(shipperReceiveMonney);
  $(".packedOrder").click(packedFn);
  $(".ghtkCode").click(ghtkShowOrderFn);
  $(".getGHTKCodeFromSavedRequest").click(getGHTKCodeFromSavedRequestFn)
}

function saveOtherInforAsShipper(currentOrder) {
  if (currentOrder.shipIndex == -1 || currentOrder.shipIndex == undefined) {
    return;
  }

  var actualShipIndex = parseInt(currentOrder.shipIndex) + 1;

  sheetrange = 'Shipping!D' + actualShipIndex + ':D' + actualShipIndex;
  var orderCopy = JSON.parse(JSON.stringify(currentOrder))

  dataUpdateShipping = [
    [
      JSON.stringify(orderCopy)
    ]
  ];

  // console.log(dataUpdateShipping);

  $("#loadingSpin").show();
  $("#loading-text").html("Cập nhật thông tin vận đơn của shipper");

  updateShipping(dataUpdateShipping, sheetrange, function () {
    $("#loadingSpin").hide();
  }, function () {
    console.log("Something wrong");
  })
}

function getGHTKCodeFromSavedRequestFn() {
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var savedGHTKRequest = lsOrderDetail[lsOrder[orderIndex][0]].otherInfor.savedRequest;
  savedGHTKRequest.order.id = savedGHTKRequest.order.id + "-" + (new Date().getTime());

  var currentOrder = lsOrderDetail[lsOrder[orderIndex][0]];
  currentOrder.shipIndex = parseInt(orderIndex);

  // console.log(currentOrder);

  // return;
  $("#loadingSpin").show();

  createAnGHTKOrder(savedGHTKRequest, function (data) {

    // {
    //  "success": true,
    //  "message": "Các đơn hàng đã được add vào hệ thống GHTK thành công. Thông tin đơn hàng thành công được trả về trong trường success_orders.
    // GHTK chỉ hỗ trợ chọn phương thức vận chuyển với các đơn hàng đặc biệt hoặc liên miền, gửi từ Hà Nội hoặc Tp. HCM. Các tuyến đường còn lại hoặc không nhận dạng được địa chỉ sẽ được chuyển theo phương thức mặc định : Nội miền/ Nội tỉnh đường bộ & Liên miền : Đường bay.",
    //  "order": {
    //   "partner_id": "ThuyTitVu-DONHANG_865-1598383517256",
    //   "label": "S15549745.HN12.G3.876491853",
    //   "area": "1",
    //   "fee": "18000",
    //   "status_id": "2",
    //   "insurance_fee": "0",
    //   "estimated_pick_time": "Sáng 2020-08-26",
    //   "estimated_deliver_time": "Chiều 2020-08-26",
    //   "products": [],
    //   "tracking_id": 876491853,
    //   "sorting_code": "HN12.G3"
    //  }
    // }
    $("#loadingSpin").hide();

    currentOrder.otherInfor.order = data;

    if (data["success"] == true) {
      $(".getGHTKCodeFromSavedRequest_" + orderIndex).html("Lấy Mã GHTK:<span class='textRed'>" + data["order"]["label"] + "</span>");

      saveOtherInforAsShipper(currentOrder);
    } else {
      $("#modelContent").html(jsonToHtml(data));
      $('#myModal').modal('toggle');
    }
  })
}

function getTaskUnpaid() {
  var text = "Danh sách nhiệm vụ hoàn thành <br/>";
  var taskPay = 0;
  // console.log(lsTask);
  for (e in lsTask) {
    if (lsTask[e][3] == "COMPLETED" && !lsTask[e][6]) {
      // console.log(lsTask[e])
      // console.log(lsTask[e][6])
      text += "--" + lsTask[e][1] + " : " + parseFloat(lsTask[e][5] ? lsTask[e][5] : 0) + "k<br/>";
      taskPay += parseFloat(lsTask[e][5] ? lsTask[e][5] : 0);
    }
  }
  return {
    text: text,
    taskPay: taskPay
  }
}

function jsonToHtml(data) {
  if (!data) {
    return "<div/>"
  }
  // console.log("jsonToHtml");
  // console.log(data);
  var rs1 = JSON.stringify(data, null, "\t");
  rs1 = rs1.split("\t").join("&nbsp;");
  rs1 = rs1.split("\n").join("<br/>");
  return rs1;
}

function ghtkShowOrderFn() {
  // var ghtkCode = $(this).html();
  // // console.log(ghtkCode);
  // ghtkUrl="services.giaohangtietkiem.vn";
  // ghtkToken = localStorage.getItem("ghtkToken");

  // getGHTKOrderStatus(ghtkCode, function(data){
  //     $("#modelContent").html(jsonToHtml(data));
  //     $('#myModal').modal('toggle');
  // });
}

function packedFn() {
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualOrderIndex = parseInt(orderIndex) + 1;

  var sheetrange = 'Shipping!E' + actualOrderIndex + ':G' + actualOrderIndex;

  var otherCost = lsOrder[orderIndex][5];
  // console.log("Reply : email:"+emailId);

  sheetrange = 'Shipping!E' + actualOrderIndex + ':E' + actualOrderIndex;

  var nextStep = "PACKED"; //FOR SHIPPER_NO_COD, SHOPEE, POST_NO_COD

  dataUpdateShipping = [
    [nextStep]
  ];

  // console.log(dataUpdateShipping);

  $("#loadingSpin").show();

  updateShipping(dataUpdateShipping, sheetrange, function () {
    $("#loadingSpin").hide();

    $(".cardElement_" + orderIndex).remove();

  }, function () {
    console.log("Something wrong");
  })
}

function startPreparingFn() {
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  orderIndex = parseInt(orderIndex);
  var prodListOrder = lsOrderDetail[lsOrder[orderIndex][0]].prodListOrder;
  var currentIndex = 0;
  // console.log(Object.keys(prodListOrder).length)

  function getItem(index) {
    if (index < 0) {
      return;
    };
    if (index < Object.keys(prodListOrder).length) {
      console.log("getItem")
      $(".modal-body").empty();
      var content = prodListOrder[index].productName + "<span class='textRed'> (sl : " + prodListOrder[index].productCount + ")</span><br/>";
      content += '<img style="width:100%" src="' + prodListOrder[index].productImage + '" />'
      content += '<div>';
      content += '<div class="btn btn-default btnNormal textViolet prepareBack">Quay lại</div>';
      content += '<div class="btn btn-default btnNormal textBlue prepareNext">Tiếp</div>';
      content += '</div>';
      $(".modal-body").html(content);
    } else {
      console.log("prepare done")
      $(".modal-body").empty();
      var content = "Xong ! Tổng cộng " + lsOrderDetail[lsOrder[orderIndex][0]].numOfProd + " cái, nhớ đếm lại<br/> => chụp 2 bức ảnh hàng: <br/> - 1 bức là hàng trong hộp <br/>- 1 bức là vỏ hộp đã bọc <br/>";
      // try{
      //   console.log(lsOrderDetail[lsOrder[orderIndex][0]].otherInfor);
      //   if (lsOrderDetail[lsOrder[orderIndex][0]].otherInfor.order.order.label) {
      //     content+='<div class="btn btn-default btnNormal startToPrint">In đơn hàng</div>';
      //   }
      // }catch(eprint) {

      // }

      $(".modal-body").html(content);
    }
    $('.prepareNext').click(function () {
      getItem(index + 1);
    });
    $('.prepareBack').click(function () {
      getItem(index - 1);
    });
    // $('.startToPrint').click(function(){
    //   try{
    //     if (lsOrderDetail[lsOrder[orderIndex][0]].otherInfor.order.order.label) {
    //       var orderDetail = lsOrderDetail[lsOrder[orderIndex][0]];
    //       var content = makePrintWindowTemplate(orderDetail);
    //       var w = window.open('', 'width=80, height=80');

    //       w.document.body.innerHTML = content;

    //       // var script1 = w.document.createElement('script');
    //       // script1.type = "text/javascript";
    //       // // script1.src = '../vendor/JsBarcode/JsBarcode.all.min.js';
    //       // script1.src = "https://thuyvu2709.github.io/vendor/JsBarcode/JsBarcode.all.min.js"
    //       // w.document.body.appendChild(script1);

    //       var script2 = w.document.createElement('script');

    //       // script2.innerHTML = 'JsBarcode("#barcode")'+
    //       // '            .options({font: "OCR-B"})'+
    //       // '            .code128a("'+orderDetail.otherInfor.order.order.tracking_id+'", {height: 55})'+
    //       // '            .render();';
    //       script2.type = "text/javascript";
    //       // script2.src = "https://thuyvu2709.github.io/js/printerAPI-genBarcode.js";
    //       script2.src = "https://thuyvu2709.github.io/js/printerAPI-genBarcode.js";

    //       w.document.body.appendChild(script2);

    //       // var checkForContent = function () {
    //       //     setTimeout(function () {
    //       //         var ckContent = w.document.querySelector('barcode').innerHTML

    //       //         if (ckContent.length) {
    //       //             w.print()
    //       //             w.close()
    //       //         } else {
    //       //             checkForContent()
    //       //         }
    //       //     }, 1000)
    //       // }

    //       // checkForContent();
    //       w.print();
    //     }
    //   }catch(eprint) {

    //   }
    // });
  }

  $('#myModal').modal('show');
  getItem(0);
}

function startPreparingPrintingFormFn() {
  // $("#loadingSpin").show();

  // var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  // orderIndex = parseInt(orderIndex);
  // var prodListOrder = lsOrderDetail[lsOrder[orderIndex][0]].prodListOrder;

  // $(".modal-body").empty();


  // var orderDetail = lsOrderDetail[lsOrder[orderIndex][0]];

  // var content = '        <div class="ptitle1 pcentralize">THUYTITVU SHOP</div>'+
  // '        <div class="ptitle2 pcentralize">XÁCH TAY HÀNG Ý PHÁP ĐỨC MỸ</div>'+
  // '        <div class="pcentralize">~❀~</div>'+
  // '        <div class="normal pcentralize">Mã GHTK:'+orderDetail.otherInfor.order.order.label+'</div>'+
  // '        <svg id="barcode" class="centralize"></svg>'+
  // '        <div class="normal">Người nhận hàng:'+orderDetail.customerName+'</div>'+
  // '        <div class="normal">ĐT:'+orderDetail.customerPhone+'</div>'+
  // '        <div class="normal">ĐC:'+orderDetail.customerAddress+'</div>'+
  // '        <div class="normal">Ghi chú: Hàng dễ vỡ, vui lòng nhẹ tay, không cho khách mở hàng</div>';

  // $(".modal-body").html(content);
  // $("#myModal").css("background-color","white");

  // JsBarcode("#barcode").options({font: "OCR-B"}).code128a(orderDetail.otherInfor.order.order.tracking_id, {height: 55}).render();

  // $('#myModal').modal('show');

  $("#loadingSpin").show();
  // var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  // orderIndex = parseInt(orderIndex);
  // var prodListOrder = lsOrder[orderIndex][3].prodListOrder;

  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  orderIndex = parseInt(orderIndex);

  // var orderDetail = lsOrderDetail["DONHANG_3778"]
  var orderDetail = lsOrderDetail[lsOrder[orderIndex][0]];

  // console.log(lsOrder[orderIndex][3]);

	fetch(herokuPrefix + 'https://pi-to-esc-pos.vercel.app/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      {
        "orderCode": orderDetail.orderCode,
        "receiverName": orderDetail.customerName,
        "receiverPhone": orderDetail.customerPhone,
        "receiverAddress": orderDetail.customerAddress,
        "shipperProvider": orderDetail.otherInfor ? orderDetail.otherInfor.shippingProvider : "",
        "receiverBarcode": orderDetail.otherInfor ? orderDetail.otherInfor.logiticCodice : "",
      }
    )
  }).then(data => {
    $("#loadingSpin").hide();
  })
    .catch(error => {
      console.error('Lỗi:', error);
      $("#loadingSpin").hide();
    });

}


function chooseShippingScheduleFn() {
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var value = $(".datetimepickerorder_" + orderIndex).val();
  console.log(orderIndex + " - " + value);
  var actualOrderIndex = parseInt(orderIndex) + 1;

  var sheetrange = 'Shipping!L' + actualOrderIndex + ':L' + actualOrderIndex;

  var dataUpdateShipping = [
    [value]
  ];

  $("#loadingSpin").show();

  updateShipping(dataUpdateShipping, sheetrange, function () {

    $(".cardElement_" + orderIndex).remove();
    $("#loadingSpin").hide();

  }, function () {
    console.log("Something wrong");
  })
}

function deleteShipRequest() {
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualOrderIndex = parseInt(orderIndex) + 1;
  var dataUpdateShipping = [
    ["", "", "", "", "", "", "", "", "", ""]
  ];
  var sheetrange = 'Shipping!A' + actualOrderIndex + ':J' + actualOrderIndex;

  $("#loadingSpin").show();

  updateShipping(dataUpdateShipping, sheetrange, function () {
    $("#loadingSpin").hide();
    $(".cardElement_" + orderIndex).remove();
  }, function () {
    console.log("Something wrong");
  })
}

function ghtkLinkFn() {
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualOrderIndex = parseInt(orderIndex) + 1;

  var orderJs = JSON.parse(lsOrder[orderIndex][3]);
  orderJs.shipIndex = parseInt(orderIndex);

  localStorage.setItem("currentOrder", JSON.stringify(orderJs));

  saveHistory({
    orderFilter: $(".orderFilter").val(),
    goToClass: $(this).attr("class")
  })

  window.location = "ghtkLink.html";
}

function ghnLinkFn() {
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualOrderIndex = parseInt(orderIndex) + 1;

  var orderJs = JSON.parse(lsOrder[orderIndex][3]);
  orderJs.shipIndex = parseInt(orderIndex);

  localStorage.setItem("currentOrder", JSON.stringify(orderJs));

  // $("#loadingSpin").show();

  // loginViettelPost(function(){
  //   $("#loadingSpin").hide();

  saveHistory({
    orderFilter: $(".orderFilter").val(),
    goToClass: $(this).attr("class")
  })

  window.location = "giaohangnhanhLink.html";
  // })
}

function viettelpostLinkFn() {
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualOrderIndex = parseInt(orderIndex) + 1;

  var orderJs = JSON.parse(lsOrder[orderIndex][3]);
  orderJs.shipIndex = parseInt(orderIndex);

  localStorage.setItem("currentOrder", JSON.stringify(orderJs));

  // $("#loadingSpin").show();

  // loginViettelPost(function(){
  //   $("#loadingSpin").hide();

  saveHistory({
    orderFilter: $(".orderFilter").val(),
    goToClass: $(this).attr("class")
  })

  window.location = "viettelpostLink.html";
  // })
}

function showDetail() {
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualOrderIndex = parseInt(orderIndex) + 1;

  var orderJs = JSON.parse(lsOrder[orderIndex][3]);
  orderJs.shipIndex = parseInt(orderIndex);

  localStorage.setItem("currentOrder", JSON.stringify(orderJs));

  saveHistory({
    orderFilter: $(".orderFilter").val(),
    goToClass: $(this).attr("class")
  })

  window.location = "showordershipping.html";
}

function shipperReceiveMonney() {
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualOrderIndex = parseInt(orderIndex) + 1;

  var sheetrange = 'Shipping!J' + actualOrderIndex + ':J' + actualOrderIndex;

  var otherCost = lsOrder[orderIndex][5];
  // console.log("Reply : email:"+emailId);

  var dataUpdateShipping = [
    [lsOrder[orderIndex][3].willpay]
  ];

  $("#loadingSpin").show();

  updateShipping(dataUpdateShipping, sheetrange, function () {

    $(".cardElement_" + orderIndex).remove();
    $("#loadingSpin").hide();

  }, function () {
    console.log("Something wrong");
  })
}


function updatePaymentComplete(orderIndex) {
  var line = parseInt(orderIndex) + 1;
  var value = "PAID";
  var column = 8; //for payment
  $("#loadingSpin").show();
  updateOrderStatus(line, column, value, function () {
    $("#loadingSpin").hide();
  });
}

function payShipForEachShip(oix, callback) {
  var orderIndex = oix.type ? $(this).attr("class").split(" ").pop().split("_").pop() : oix;
  var actualOrderIndex = parseInt(orderIndex) + 1;

  var sheetrange = 'Shipping!J' + actualOrderIndex + ':J' + actualOrderIndex;

  dataUpdateShipping = [
    [
      "1"
    ]
  ];

  $("#loadingSpin").show();
  // console.log(orderIndex);
  // console.log($(this).attr("class").split)
  $("#modelContent").html("Thanh toán ship cho đơn:" + lsOrderDetail[lsOrder[orderIndex][0]].orderCode + " " + lsOrderDetail[lsOrder[orderIndex][0]].customerName);

  updateShipping(dataUpdateShipping, sheetrange, function () {
    $("#loadingSpin").hide();

    $(".cardElement_" + orderIndex).remove();

    if (callback) {
      callback();
    }

  }, function () {
    console.log("Something wrong");
  })
}


$(".payShipAll").click(function () {
  // lsPay = $("#listShippingOrder").children();
  // var runPayShip = function(index) {
  //   if (index  == lsPay.length) {
  //     return;
  //   }
  //   var currentChild = lsPay.eq(lsPay);
  //   var orderIndex = $(currentChild).attr("class").split(" ").pop().split("_").pop();
  //   payShipForEachShip(orderIndex, function(){
  //     runPayShip(index+1);
  //   })
  // }
  // runPayShip(0);
  var lsChecked = $(".checkbox");
  var requestShip = function (index) {
    if (index >= lsChecked.length) {
      return;
    }

    // if ($(lsChecked[index]).is(":checked")){
    // console.log();
    var orderIndex = $(lsChecked[index]).attr("class").split(" ").pop().split("_").pop();
    // var actualOrderIndex = parseInt(orderIndex) + 1;
    payShipForEachShip(orderIndex, function () {
      requestShip(index + 1);
    })

    // requestShipping(currentOrder,function(){
    //   requestShip(index+1);
    // });

    // } else {
    //   requestShip(index+1);
    // }
  }
  requestShip(0);
})

$(".payShipSelect").click(function () {
  // lsPay = $("#listShippingOrder").children();
  // var runPayShip = function(index) {
  //   if (index  == lsPay.length) {
  //     return;
  //   }
  //   var currentChild = lsPay.eq(lsPay);
  //   var orderIndex = $(currentChild).attr("class").split(" ").pop().split("_").pop();
  //   payShipForEachShip(orderIndex, function(){
  //     runPayShip(index+1);
  //   })
  // }
  // runPayShip(0);

  /////////////////////

  var lsChecked = $(".checkbox");
  var requestShip = function (index) {
    if (index >= lsChecked.length) {
      return;
    }

    if ($(lsChecked[index]).is(":checked")) {
      // console.log();
      var orderIndex = $(lsChecked[index]).attr("class").split(" ").pop().split("_").pop();
      // var actualOrderIndex = parseInt(orderIndex) + 1;
      payShipForEachShip(orderIndex, function () {
        requestShip(index + 1);
      })

      // requestShipping(currentOrder,function(){
      //   requestShip(index+1);
      // });

    } else {
      requestShip(index + 1);
    }
  }
  requestShip(0);
})

function shipComplete() {
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualOrderIndex = parseInt(orderIndex) + 1;

  // var today = new Date();
  // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  // var dateTime = date+' '+time;
  var dateTime = getCurrentDateTime().dateTime;//date+' '+time;

  var sheetrange = 'Shipping!E' + actualOrderIndex + ':G' + actualOrderIndex;

  var otherCost = lsOrder[orderIndex][5];
  // console.log("Reply : email:"+emailId);

  sheetrange = 'Shipping!E' + actualOrderIndex + ':G' + actualOrderIndex;

  var nextStep = "COMPLETED"; //FOR SHIPPER_NO_COD, SHOPEE, POST_NO_COD


  var currentOrder = lsOrderDetail[lsOrder[orderIndex][0]];

  if (lsOrder[orderIndex][8] == "SHIPPER_COD") {
    if (lsOrder[orderIndex][4] == "Requested") {
      // nextStep = "SHIPPER_RECEIVED_MONEY";
      nextStep = "COMPLETED";
      sendToManagerViaEmail(currentOrder, "Shipper received cash:" + lsOrderDetail[lsOrder[orderIndex][0]].willpay);

    } else if (lsOrder[orderIndex][4] == "SHIPPER_RECEIVED_MONEY") {
      nextStep = "COMPLETED";
      updatePaymentComplete(listOrderSheetParse[lsOrder[orderIndex][0]].orderIndex);

      sendToManagerViaEmail(currentOrder, "Shop received cash:" + lsOrderDetail[lsOrder[orderIndex][0]].willpay);
    }
  } else if (lsOrder[orderIndex][8] == "POST_COD") {

    // if (lsOrder[orderIndex][4] == "Requested") {
    //   nextStep = "SENT_POST";
    // } else if (lsOrder[orderIndex][4] == "SENT_POST") {
    nextStep = "COMPLETED";
    // updatePaymentComplete(listOrderSheetParse[lsOrder[orderIndex][0]].orderIndex);
    sendToManagerViaEmail(currentOrder, "Sent via " + lsOrder[orderIndex][8]);

    // }

  } else if (lsOrder[orderIndex][4] == "Requested") {
    sendToManagerViaEmail(currentOrder, "Sent via " + lsOrder[orderIndex][8]);
  }

  if (userRole == "manager") {
    sheetrange = 'Shipping!E' + actualOrderIndex + ':J' + actualOrderIndex;
    dataUpdateShipping = [
      [nextStep, //E
        otherCost, //F
        dateTime, // G
        lsOrder[orderIndex][7],// H
        lsOrder[orderIndex][8],// I
        1// J
      ]
    ];
  } else {
    sheetrange = 'Shipping!E' + actualOrderIndex + ':G' + actualOrderIndex;
    dataUpdateShipping = [
      [nextStep,
        otherCost,
        dateTime
      ]
    ];
  }

  // console.log(dataUpdateShipping);

  $("#loadingSpin").show();

  updateShipping(dataUpdateShipping, sheetrange, function () {
    if (dataUpdateShipping[0][0] == "COMPLETED" ||
      dataUpdateShipping[0][0] == "SHIPPER_RECEIVED_MONEY") {
    }
    $("#loadingSpin").hide();

    $(".cardElement_" + orderIndex).remove();

  }, function () {
    console.log("Something wrong");
  })
}


function shipPrepared() {
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  // var actualOrderIndex = parseInt(orderIndex) + 1;

  // var today = new Date();
  // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  // var dateTime = date+' '+time;

  // var sheetrange = 'Shipping!I'+actualOrderIndex+':I'+actualOrderIndex;

  // var emailId = lsOrder[orderIndex][5];
  // console.log("Reply : email:"+emailId);

  // var dataUpdateShipping = [
  //   [dateTime]
  // ];

  // $("#loadingSpin").show();

  // updateShipping(dataUpdateShipping, sheetrange, function(){
  // $(".cardElement_"+orderIndex).remove();
  $(".btnOrder_" + orderIndex).addClass("borderMustard");
  $(".preparedOrder_" + orderIndex).addClass("borderMustard");
  // console.log($(".preparedOrder_"+orderIndex));
  $(".preparedOrder_" + orderIndex).html("Đã chuẩn bị");
  //     $("#loadingSpin").hide();
  // },function(){
  //   console.log("Something wrong");
  // })
}

function shippingReport() {
  $("#listShippingOrder").empty();
  $("#listShippingOrder").html(totalShippingCost);
}

function showTask() {
  $("#listShippingOrder").empty();
  var mode = $(".orderFilter").val();

  $("#note").html("");

  // console.log(lsTask);

  for (e in lsTask) {
    if (e == 0) {
      continue;
    }

    if (!lsTask[e][0]) {
      continue;
    }

    if (lsTask[e][3] && mode == "TASK") {
      continue;
    }

    var deleteButton = userRole == "manager" ? '<div class="btn btn-default btnNormal delete order_' + e + '" style="margin:10px 0 0;">Xoá</div>' : "";

    var completeButton = '<div class="btn btn-default btnNormal complete order_' + e + '" style="margin:10px 10px 0;">Hoàn thành</div>';
    var additionalContent = "";
    var payTaskBtn = "";
    var editTask = '';
    if (mode == "TASKALL") {
      additionalContent = '<hr/>' +
        "Tình trạng: " + lsTask[e][3] + "<br/>" +
        "Thời gian hoàn thành: " + lsTask[e][4] + "<br/>" +
        "Công task: " + (lsTask[e][5] ? lsTask[e][5] : 0) + "<br/>" +
        "Đã thanh toán: " + (lsTask[e][6] ? "Rồi" : "Chưa") + "<br/>";

      editTask = '<div class="btn btn-default btnNormal editTask order_' + e + '" style="margin:10px 10px 0;">Sửa thông tin</div>';
      payTaskBtn = '<div class="btn btn-default btnNormal payTask order_' + e + '" style="margin:10px 10px 0;">Thanh toán </div>';

    }
    $("#listShippingOrder").append(
      // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+lsOrder[e][0]+' | '+lsOrder[e][2]+' | '+lsOrder[e][5]+'</a>'
      '<div class="card cardElement_' + e + '">' +
      '<div class="card-header" id="heading_"' + e + '>' +
      '<h5 class="mb-0">' +
      '<button class="btn ' + (lsTask[e][6] == 1 ? "textRed" : "") + ' btn-link btnOrder_' + e + '" data-toggle="collapse" data-target="#collapse_' + e + '" aria-expanded="false" aria-controls="collapse_' + e + '">' +
      lsTask[e][0] + ' | ' + lsTask[e][1] + ' | ' + (lsTask[e][5] ? lsTask[e][5] : 0) + 'k ' + (lsTask[e][6] == 1 ? "| PAID" : "") +
      '</button>' +
      '</h5>' +
      '</div>' +

      '<div id="collapse_' + e + '" class="collapse" aria-labelledby="heading_' + e + '" data-parent="#listShippingOrder">' +
      '<div class="card-body">' +
      '<div class="task content">' +
      // '<textarea class="field-textarea form-control taskContent_'+e+'" readonly>'+
      (mode == "TASKALL" ? "Không hiển thị" : lsTask[e][2]) +
      // '</textarea>'+
      '</div>' +
      additionalContent +
      '<hr/>' +
      completeButton +
      deleteButton +
      payTaskBtn +
      editTask +
      '</div>' +
      '</div>' +
      '</div>'
    )
    // $('.taskContent_'+e).height( $('.taskContent_'+e)[0].scrollHeight );
    // console.log($('.taskContent_'+e)[0].scrollHeight)
  }

  $(".complete").click(taskComplete)
  $(".delete").click(deleteTask);
  $(".editTask").click(showEditTask);
  $(".payTask").click(payTaskFn);

  if (userRole == "manager") {
    $("#addNewItem").show()
    $("#addNewItem").click(addNewTask);
  }
}

function addNewTask() {
  $("#loadingSpin").show();

  getLatestTaskCode(function (taskCode) {
    $("#loadingSpin").hide();

    console.log("getLatestTaskCode");
    // var submitTaskData = [
    //   [taskCode, title, content, "", ""]
    // ]
    // appendTask(submitTaskData, function(){
    //   console.log("appendTask");

    var modalBody = '<div>Thêm thông tin nhiệm vụ:</div><br/>' +
      '<div>Mã nhiệm vụ:<div class="taskCode">' + taskCode + '</div></div><br/>' +
      '<div class="btn btn-default btnNormal">' +
      'Tên nhiệm vụ:<input class="taskName"/>' +
      '</div>' +
      '<br/>' +
      '<div class="btn btn-default btnNormal">' +
      ' Chi phí:<input class="taskfee" />' +
      '</div>' +
      '<div class="btn btn-default btnNormal">' +
      ' Nội dung:<input class="taskContent" />' +
      '</div>' +
      '<br/>' +
      '<div class="btn btn-default taskSaveInfor btnNormal">Lưu thông tin' +
      '</div>'
      ;
    $("#myModal .modal-body").html(modalBody);
    $('#myModal').modal('toggle');
    $('.taskSaveInfor').click(appendTaskFn);
  })
}

function appendTaskFn() {
  $("#loadingSpin").show();

  var taskCode = $(".taskCode").html();
  var title = $(".taskName").val();
  var taskfee = $(".taskfee").val();
  taskfee = taskfee ? taskfee : 0;
  var taskContent = $(".taskContent").val();

  var submitTaskData = [
    [taskCode, title, taskContent, "", "", taskfee]
  ]

  appendTask(submitTaskData, function () {
    $("#loadingSpin").hide();

    console.log("appendTask");
  })
}

function showEditTask() {
  var taskIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  // var modalBody ="<div>"+
  //       " Nhận hàng: "+data[e][5]+" | "+data[e][6] + "<br/>"+
  //       " Thanh toán: "+data[e][7]+" | "+data[e][8]+ "|" + data[e][9]+"<br/>"+ 
  //       "</div>";
  var modalBody = '<div>Thông tin nhiệm vụ:</div><br/>' +
    '<div class="btn btn-default btnNormal">' +
    lsTask[taskIndex][1] +
    '</div>' +
    '<br/>' +
    // '<div>Trạng thái : '+
    '<div class="btn btn-default btnNormal"> Trạng thái :' +
    lsTask[taskIndex][3] +
    '</div>' +
    '<br/>' +
    // '<div>Chi phí</div>'+
    '<input class="taskChooseIndex" readonly hidden value="' + taskIndex + '"/>' +
    '<div class="btn btn-default btnNormal">' +
    ' Chi phí <input class="taskfee" value="' + (lsTask[taskIndex][5] ? lsTask[taskIndex][5] : 0) + '"/>' +
    '</div>' +
    '<br/>' +
    '<div class="btn btn-default btnNormal"> Thanh toán ?' +
    ' <input type="checkbox" class="taskCkPaid" ' + (lsTask[taskIndex][6] == 1 ? 'checked' : '') + '/>' +
    '</div>' +
    '<br/>' +
    '<div class="btn btn-default taskSaveInfor btnNormal">Lưu thông tin' +
    '</div>'
    ;
  $("#myModal .modal-body").html(modalBody);
  $('#myModal').modal('toggle');
  $('.taskSaveInfor').click(saveTaskFn)
}

function payTaskFn() {
  var taskIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualTaskIndex = parseInt(taskIndex) + 1;

  // var today = new Date();
  // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  // var dateTime = date+' '+time;
  var dateTime = getCurrentDateTime().dateTime;//date+' '+time;

  var sheetrange = 'Task!G' + actualTaskIndex + ':G' + actualTaskIndex;

  lsTask[taskIndex][6] = "1";

  var dataUpdateTask = [
    ["1"]
  ];

  $("#loadingSpin").show();

  updateShipping(dataUpdateTask, sheetrange, function () {

    // $(".cardElement_"+taskIndex).remove();
    $("#loadingSpin").hide();

  }, function () {
    console.log("Something wrong");
  })

}

function saveTaskFn() {
  var taskfee = $(".taskfee").val();
  taskfee = taskfee ? taskfee : 0;
  var taskCkPaid = $(".taskCkPaid").is(":checked") ? "1" : "";
  var taskIndex = $(".taskChooseIndex").val();
  var actualTaskIndex = parseInt(taskIndex) + 1;

  console.log(taskfee + " " + taskCkPaid + " " + taskIndex);

  var sheetrange = 'Task!F' + actualTaskIndex + ':G' + actualTaskIndex;

  lsTask[taskIndex][5] = taskfee;
  lsTask[taskIndex][6] = taskCkPaid;

  var dataUpdateTask = [
    [taskfee, taskCkPaid]
  ];

  $("#loadingSpin").show();

  updateShipping(dataUpdateTask, sheetrange, function () {

    // $(".cardElement_"+taskIndex).remove();
    $("#loadingSpin").hide();

  }, function () {
    console.log("Something wrong");
  })

}

function deleteTask() {
  var taskIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualTaskIndex = parseInt(taskIndex) + 1;
  var dataUpdateTask = [
    ["", "", "", "", "", "", ""]
  ];
  var sheetrange = 'Task!A' + actualTaskIndex + ':G' + actualTaskIndex;

  $("#loadingSpin").show();

  updateShipping(dataUpdateTask, sheetrange, function () {
    $("#loadingSpin").hide();
    $(".cardElement_" + taskIndex).remove();
  })
}

function taskComplete() {
  var taskIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualTaskIndex = parseInt(taskIndex) + 1;

  // var today = new Date();
  // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  // var dateTime = date+' '+time;
  var dateTime = getCurrentDateTime().dateTime;//date+' '+time;

  var sheetrange = 'Task!D' + actualTaskIndex + ':E' + actualTaskIndex;

  lsTask[taskIndex][3] = "COMPLETED";
  lsTask[taskIndex][4] = dateTime;

  var dataUpdateTask = [
    ["COMPLETED", dateTime]
  ];

  $("#loadingSpin").show();

  updateShipping(dataUpdateTask, sheetrange, function () {

    $(".cardElement_" + taskIndex).remove();
    $("#loadingSpin").hide();

  }, function () {
    console.log("Something wrong");
  })
}

$(".orderFilter").change(function () {
  var mode = document.getElementsByClassName($(this).attr("class"))[0].value;
  // console.log("orderFilter:"+mode);

  $("#controllMany").hide();

  if (mode == "Need_Schedule"
    || mode == "Requested"
    || mode == "RequestedPOST"
    || mode == "RequestedSHIP"
    || mode == "RequestedSHOPEE"
    || mode == "SENT_POST"
    || mode == "SHIPPER_RECEIVED_MONEY"
    || mode == "COMPLETED"
    || mode == "ALL"
    || mode == "PAYSHIP"
    || mode == "PACKED"
  ) {
    $(".maintitle").html("Quản lý đơn hàng - " + localStorage.getItem("datasetName"));
    if (mode == "COMPLETED") {
      $('.datetimepicker').show();
    }
    loadOrderShippingListHtml(lsOrder);
  } else if (mode == "TASK"
    || mode == "TASKALL"
  ) {
    $(".maintitle").html("Quản lý nhiệm vụ");
    showTask();
  } else if (mode == "REPORT") {
    $(".maintitle").html("Báo cáo");
    shippingReport();
  }
})

$(".click-to-select").click(function () {
  if ($(".checkbox").is(':visible')) {
    $(".checkbox").hide();
    $("#controllMany").hide();
    $(".click-to-select-all").hide();
    $(".click-to-view").hide();
  } else {
    $(".checkbox").show();
    $("#controllMany").show();
    $(".click-to-select-all").show();
    $(".click-to-view").show();
  }
})



$(".click-to-select-all").click(function () {
  // var lsChecked = $(".checkbox");
  // for (e in lsChecked){
  //   $(lsChecked[e]).attr("checked", true);
  // }
  var count = 0;
  var check = false;
  $('.checkbox').each(function () {
    count++;
    if (count == 1 && this.checked) {
      check = true;
    }
    if (check) {
      this.checked = false;
    } else {
      this.checked = true;
    }
  });

})

$(".click-to-view").click(function () {
  var lsChecked = $(".checkbox");
  var totalCost = 0;
  var num = 0;
  var requestedNum = 0;
  var stillInStore = 0;
  // for (e in lsChecked){
  //   if ($(lsChecked[e]).is(":checked")){
  var numOfOrder = 0;
  var totalPay = 0;
  var totalOwnerPay = 0;
  var totalProfit = 0;
  var numOfProd = 0;
  var lsOrderCodeSelected = [];

  // 0:SHIPPER_NO_COD
  // 1:SHIPPER_COD
  // 2:POST_COD
  // 3:SHOPEE
  // 4:POST_NO_COD
  // 5:SHIP_BY_THIRD_PARTY

  var groupsOfShipType = {};

  var sumAllOfShipType = {
    amount: 0,
    willpay: 0,
    totalPay: 0,
    prepaid: 0
  }

  var detailReport = "Đơn Hàng, Khách, Cách Ship, Ship Thu, Cọc, Tổng Tiền Hàng\n";

  $('.checkbox').each(function () {
    // this.checked = true; });
    if (this.checked) {
      numOfOrder = numOfOrder + 1
      var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
      // var currentOrder=lsOrder[orderIndex];
      var orderDetail = lsOrderDetail[lsOrder[orderIndex][0]];

      // console.log(currentOrder);
      // console.log(orderDetail);
      if (!groupsOfShipType[orderDetail.shippingType]) {
        groupsOfShipType[orderDetail.shippingType] = {
          amount: 0,
          willpay: 0,
          totalPay: 0,
          prepaid: 0
        }
      }

      // console.log(orderDetail);
      detailReport = detailReport + orderDetail.orderCode + "," + orderDetail.customerName + "," + orderDetail.shippingType + "," + orderDetail.willpay + "," + orderDetail.prepaid + "," + orderDetail.totalPay + "\n"

      groupsOfShipType[orderDetail.shippingType] = {
        amount: groupsOfShipType[orderDetail.shippingType].amount + 1,
        willpay: groupsOfShipType[orderDetail.shippingType].willpay + orderDetail.willpay,
        totalPay: groupsOfShipType[orderDetail.shippingType].totalPay + parseInt(orderDetail.totalPay),
        prepaid: groupsOfShipType[orderDetail.shippingType].prepaid + parseInt(orderDetail.prepaid)
      }

      sumAllOfShipType = {
        amount: sumAllOfShipType.amount + 1,
        willpay: sumAllOfShipType.willpay + orderDetail.willpay,
        totalPay: sumAllOfShipType.totalPay + parseInt(orderDetail.totalPay),
        prepaid: sumAllOfShipType.prepaid + parseInt(orderDetail.prepaid)
      }
      // console.log(sumAllOfShipType.prepaid);
    }
  }
  )

  var contentDetail = "<div class='viewReport'><table><tr><th>Method</th><th>Số lượng</th><th>Ship thu</th><th>Cọc</th><th>Tổng tiền hàng</th></tr>";
  for (var e in groupsOfShipType) {
    contentDetail += "<tr> <td>" + e + "</td> <td>" + groupsOfShipType[e].amount + "</td> <td>" + groupsOfShipType[e].willpay + "</td> <td>" + groupsOfShipType[e].prepaid + "</td> <td>" + groupsOfShipType[e].totalPay + "</td> </tr>"
  }
  contentDetail += "</table></div>"


  var content = "<h4>Báo cáo</h4><br/>" +
    contentDetail + "<br/>" +
    "Số đơn hàng:" + sumAllOfShipType.amount + "<br/>" +
    "Tổng tiền khách đã cọc:" + sumAllOfShipType.prepaid + "<br/>" +
    "Tổng tiền khách sẽ thanh toán cho bên giao hàng (willpay):" + sumAllOfShipType.willpay + "<br/>" +
    "Tổng tiền thanh toán (totalpay):" + sumAllOfShipType.totalPay + "<hr/>" +
    "<div class='btn btn-primary mb-2 reportDetail'>Xem báo cáo chi tiết</div>&nbsp;"
    ;
  $("#modelContent").html(content);

  $(".reportDetail").click(function () {
    downloadFile("shippingreport.csv", detailReport);
  })

  $('#myModal').modal('show');
})

$(".completeMany").click(function () {
  var lsChecked = $(".checkbox");
  var requestShip = function (index) {
    if (index >= lsChecked.length) {
      return;
    }

    if ($(lsChecked[index]).is(":checked")) {
      console.log(lsChecked[index]);



      // requestShipping(currentOrder,function(){
      //   requestShip(index+1);
      // });

    } else {
      requestShip(index + 1);
    }
  }
  requestShip(0);
})

$("#orderSearchInput").keyup(function () {
  var searchText = $(this).val();
  // console.log("search:"+searchText);
  loadOrderShippingListHtml();
});

function pkImageBtnClick() {
  var lsIndex = $(this).attr("class").split(" ").pop().split("_");
  var orderIndex = lsIndex.pop();
  var num = lsIndex.pop();
  // console.log(orderIndex+" "+num);
  console.log("packageImage:" + num + " " + orderIndex);
  document.getElementById("pkScanImage_" + num + "_" + orderIndex).click();
}

function pkImageScan() {
  $("#loadingSpin").show();

  var lsIndex = $(this).attr("class").split(" ").pop().split("_");
  var orderIndex = lsIndex.pop();
  var num = lsIndex.pop();

  var $files = $(this).get(0).files;

  if ($files.length) {

    // Reject big files
    if ($files[0].size > $(this).data("max-size") * 1024) {
      console.log("Please select a smaller file");
      return false;
    }

    // Begin file upload
    console.log("Uploading file to Imgur..");

    // Replace ctrlq with your own API key
    var apiUrl = 'https://api.imgur.com/3/image';
    var apiKey = 'bddc38af21c5d9a';

    var settings = {
      async: false,
      crossDomain: true,
      processData: false,
      contentType: false,
      type: 'POST',
      url: apiUrl,
      headers: {
        Authorization: 'Client-ID ' + apiKey,
        Accept: 'application/json'
      },
      mimeType: 'multipart/form-data'
    };

    var formData = new FormData();
    formData.append("image", $files[0]);
    settings.data = formData;

    // Response contains stringified JSON
    // Image URL available at response.data.link
    $.ajax(settings).done(function (response) {
      console.log(response);
      console.log("link:" + JSON.parse(response).data.link);
      // $("#prodImageLink").val(JSON.parse(response).data.link);
      $("#loadingSpin").hide();
      // $(".packageImage_"+num+"_"+orderIndex).hide();
      $(".showPackageImage_" + num + "_" + orderIndex).show();

      var link = JSON.parse(response).data.link;

      var actualOrderIndex = parseInt(orderIndex) + 1;

      var sheetrange;
      if (num == "1") {
        sheetrange = 'Shipping!M' + actualOrderIndex + ':M' + actualOrderIndex;
      } else if (num == "2") {
        sheetrange = 'Shipping!N' + actualOrderIndex + ':N' + actualOrderIndex;
      }


      dataUpdateShipping = [[link]];

      // console.log(dataUpdateShipping);

      updateShipping(dataUpdateShipping, sheetrange, function () {

        clickToShowImage(link, ".showPackageImage_" + num + "_" + orderIndex);
        $("#loadingSpin").hide();

      }, function () {
        console.log("Something wrong");
      })
    });

  }
}

function clickToShowImageEvent() {
  var lsIndex = $(this).attr("class").split(" ").pop().split("_");
  var orderIndex = parseInt(lsIndex.pop());
  var num = parseInt(lsIndex.pop());
  // console.log("AA"+index);
  if (num == "1") {
    $("#myModal .modal-body").html('<img style="width:100%" src="' + lsOrder[orderIndex][12] + '" />')
  } else {
    $("#myModal .modal-body").html('<img style="width:100%" src="' + lsOrder[orderIndex][13] + '" />')
  }
  $('#myModal').modal('toggle');
}

function clickToShowImage(imageLink, classname) {
  $(classname).click(function () {
    // console.log("AA"+index);
    $("#myModal .modal-body").html('<img style="width:100%" src="' + imageLink + '" />')
    $('#myModal').modal('toggle');
  })
}



$('.datetimepicker').daterangepicker({
}, function (start, end, label) {
  console.log("A new date selection was made: " + start.format('YYYY/MM/DD') + ' to ' + end.format('YYYY/MM/DD'));
  // reportByDate(start.format('YYYY/MM/DD'),end.format('YYYY/MM/DD'));
  startDateFilter = start;
  endDateFilter = end;
  loadOrderShippingListHtml();
});

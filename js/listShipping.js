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

var userRole = JSON.parse(localStorage.getItem("userRole"));

// $(".orderFilter").val("Need_Schedule");
$(".orderFilter").val("Requested");

//Load history

//saveHistory({
// orderFilter : $(".orderFilter").val(),
// goToClass : $(this).attr("class")
// })
var historicalData = readCurrentHistoryData();
if (historicalData){
  // console.log("historicalData");
  // console.log(historicalData);

  if (historicalData.orderFilter) {
    var orderFilter = historicalData.orderFilter;
    $(".orderFilter").val(orderFilter);
  }
}

var afterLoadHTML = function(){
  // document.getElementsByClassName
  if (historicalData && historicalData.goToClass) {
    // document.getElementsByClassName(historicalData.goToClass)[0].scrollIntoView();
    var $container = $("html,body");
    var orderIndex = historicalData.goToClass.split(" ").pop().split("_").pop();
    var btnOrder = "btnOrder_"+orderIndex;
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

    var $scrollTo = $('.'+btnOrder);

    $("html,body").animate({scrollTop: $scrollTo.offset().top - $container.offset().top + $container.scrollTop() - 100, scrollLeft: 0},300); 
    $scrollTo.click();

    historicalData = undefined;
  }
}
/////////////

var triggerAfterLoad = function(){

  $("#loadingSpin").show();

  var step2 = function(){
    getOrderShipping(function(lsOrderset){
        $("#loadingSpin").hide();
        lsOrder = lsOrderset;
        if (!lsOrder) {
            lsOrder = JSON.parse(localStorage.getItem("ordershipping"));
        }
        readOrderDetail(function(){
          loadOrderShippingListHtml();
        });
        getTaskList(function(lsTaskset){
          // console.log("getTaskList");
          lsTask = lsTaskset;
        })
    });

    getShippingReport(function(shippingRpData){
      $(".textBottomCenter").html(shippingRpData ? shippingRpData[5][1] : 0);
    })
  }

  if (userRole=="manager"){
    loadOrderList(function(){
      parseOrderSheetList();
      step2();
    })
  } else {
    step2();
  }
}

listOrderSheetParse = {};

function parseOrderSheetList(){
  listOrderSheetParse = {};
  var orderList = JSON.parse(localStorage.getItem("orderList"));
  for(var e in orderList) {
    listOrderSheetParse[orderList[e][0]] = {
      orderIndex : e,
      totalPay : orderList[e][5]
    }
  }
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

function readOrderDetail(callback){
  // console.log("userRole:"+userRole);
  // if (userRole!="manager") {
  //   callback();
  //   return;
  // }
  lsOrderDetail = {}
  for (var e in lsOrder){
    if (e == 0) {
      continue;
    }

    if (!lsOrder[e][0]) {
      continue;
    }
    lsOrderDetail[lsOrder[e][0]] = JSON.parse(lsOrder[e][3]);

    if (userRole=="manager"){
      if (!listOrderSheetParse[lsOrder[e][0]]) {
        $(".modal-body").empty();
        $(".modal-body").html("<p id='modelContent'>"+lsOrder[e][0]+" ko tồn tại trong sheet Order</p>");
        $('#myModal').modal('toggle');
      } else if (listOrderSheetParse[lsOrder[e][0]].totalPay != lsOrderDetail[lsOrder[e][0]].totalPay) {
        $(".modal-body").empty();
        $(".modal-body").html("<p id='modelContent'>"+lsOrder[e][0]+" tổng tiền hàng ko khớp</p>");
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

if (userRole!="manager") {
  $(".click-to-select").hide();
}

function loadOrderShippingListHtml() {

  console.log("loadOrderShippingListHtml");
  
  $("#controllMany").hide();

  $("#listShippingOrder").empty();
  
  // $(".maintitle").html("Quản lý giao hàng");


  // var userRole = JSON.parse(localStorage.getItem("userRole"));
  
  totalShippingCost = 0
  var totalShipperReceivedMoney = 0;
  
  var mode = $(".orderFilter").val();

  lsCount = {
    "SHIPPER_NO_COD" : 0,
    "SHIPPER_COD" : 0,
    "POST_COD" : 0,
    "SHOPEE" : 0,
    "POST_NO_COD" : 0
  };

  for(e in lsOrder) {
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
    if (mode != "ALL" && mode != "Need_Schedule" && mode!="PAYSHIP") {
      if (mode == "RequestedSHIP" && lsOrder[e][4]=="Requested") {
        if (!(lsOrder[e][8] == "SHIPPER_COD" || lsOrder[e][8] == "SHIPPER_NO_COD")) {
          continue;
        }
      } else 
      if (mode == "RequestedPOST" && lsOrder[e][4]=="Requested") {
        if (!(lsOrder[e][8] == "POST_COD" || lsOrder[e][8] == "POST_NO_COD")) {
          continue;
        }
      } else 
      if (mode == "RequestedSHOPEE" && lsOrder[e][4]=="Requested") {
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
      if (lsOrder[e][9]=="1" || lsOrder[e][4] != "COMPLETED") {
        continue;
      }
      packedCost+=5;
      if (lsOrder[e][8] == "SHIPPER_COD" || lsOrder[e][8] == "SHIPPER_NO_COD") {
        // console.log(lsOrder[e][0]+">"+lsOrder[e][7]+">"+parseFloat(lsOrder[e][7] ? lsOrder[e][7] : 0));
        shippedCost += parseFloat(lsOrder[e][7] ? lsOrder[e][7] : 0);
      } else {
        postAndShopeeCost += parseFloat(lsOrder[e][5] ? lsOrder[e][5] : 0);
      }
      // console.log("userRole:"+userRole);
      if (userRole=="manager") {
        payshipButton = '<div class="btn btn-default btnNormal5px payship order_'+e+'">Trả công ship</div>';
        $("#controllMany").show();
      }
    }

    var searchText = $("#orderSearchInput").val();
    var searchContent = lsOrder[e][0]+" "+lsOrder[e][1]+" "+lsOrder[e][2]+" "+lsOrderDetail[lsOrder[e][0]].customerName;
    if (searchText) {
      if (!searchContent.toUpperCase().includes(searchText.toUpperCase())){
        continue;
      }
    }
    

    // if (mode == "Need_Schedule") {
    //   if (lsOrder[e][11]) {
    //     continue;
    //   }
    // }

    var shipIcon = '[<i class="fas fa-motorcycle">'+lsOrder[e][8]+'</i>]';
    var title = lsOrder[e][0]+' | '+lsOrderDetail[lsOrder[e][0]].customerName+" | "+lsOrder[e][1] +" | "+shipIcon;


    var address = lsOrder[e][1].replace(/[|&;$%@"<>()+,]/g, "").trim().replace(" ","+");

    var deleteButton = userRole=="manager" ? '<div class="btn btn-default btnNormal5px delete order_'+e+'">Xoá</div>' : "";

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

    var completeButton = '<div class="btn btn-default  btnNormal5px complete order_'+e+'" >Hoàn thành</div>';

    if (lsOrder[e][8] == "SHIPPER_COD" && lsOrder[e][4] == "Requested") {
      completeButton = '<div class="btn btn-default btnNormal5px complete order_'+e+'" >Hoàn thành (thu '+lsOrderDetail[lsOrder[e][0]].willpay+'k)</div>';
      title = lsOrder[e][0]+' | '+lsOrderDetail[lsOrder[e][0]].customerName+" | "+lsOrder[e][1] +" | "+shipIcon + " ("+ lsOrderDetail[lsOrder[e][0]].willpay +"k)";

    }

    if (lsOrder[e][8] == "POST_NO_COD" && lsOrder[e][4] == "Requested") {
      completeButton = '<div class="btn btn-default btnNormal5px complete order_'+e+'" >Đã gửi Post</div>';
        // '<div class="btn btn-default btnNormal5px shipperReceiveMonney order_'+e+'" >Ship đã nhận tiền</div>';
    }

    if (lsOrder[e][8] == "POST_COD" && lsOrder[e][4] == "Requested") {
      completeButton = '<div class="btn btn-default btnNormal5px complete order_'+e+'" >Đã gửi Post (COD thu : '+lsOrderDetail[lsOrder[e][0]].totalPay+'k) </div>';
      title = lsOrder[e][0]+' | '+lsOrderDetail[lsOrder[e][0]].customerName+" | "+lsOrder[e][1] +" | "+shipIcon + " ("+ lsOrderDetail[lsOrder[e][0]].willpay +"k)";
    }

    if (lsOrder[e][8] == "POST_COD" && lsOrder[e][4] == "SENT_POST") {
      completeButton = '<div class="btn btn-default btnNormal5px complete order_'+e+'" >SHOP đã nhận tiền</div>';
    }

    if (lsOrder[e][4] == "SHIPPER_RECEIVED_MONEY") {
      if (userRole=="manager") {
        completeButton = '<div class="btn btn-default btnNormal5px complete order_'+e+'" >SHOP đã nhận tiền</div>';
      } else {
        completeButton = '<div class="btn btn-default btnNormal5px order_'+e+'" >Chờ xác nhận từ SHOP</div>';
      }
    }

    if (lsOrder[e][6] && lsOrder[e][4] == "COMPLETED") {
      completeButton = '<div class="btn borderMustard btn-default btnNormal5px" >Hoàn thành lúc '+lsOrder[e][6]+'</div>';
    }

    lsCount[lsOrder[e][8]] = lsCount[lsOrder[e][8]] + 1;

    var preparedButton = '<div class="btn btn-default btnNormal5px prepared preparedOrder_'+e+'" ">Đã chuẩn bị</div><br/>';
    // var orderReady = "";
    // if (lsOrder[e][8]) {
    //   // console.log(lsOrder[e][8]);
    //   orderReady = "borderMustard"
    //   preparedButton = '<div class="btn borderMustard btn-default btnNormal" style="margin:10px 10px 0;">Đã chuẩn bị lúc:'+lsOrder[e][8]+'</div><br/>';
    // }

    // var orderDetailBrief = "<hr/>Shipper không thu tiền<hr/>";
    var orderDetailBrief  = "<hr/>";

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
      orderDetailBrief += prodListOrder[o].productName + " (sl:"+prodListOrder[o].productCount +")<br/>"

    }
    // console.log(prodListOrder[o]);
    // orderDetailBrief+="Tổng tiền hàng:"+lsOrderDetail[lsOrder[e][0]].totalPay+"</br>";
    // orderDetailBrief+="Tiền hàng:"+lsOrderDetail[lsOrder[e][0]].totalPay+" ( <i class='fas fa-box'>x"+numOfProd+"</i> <i class='fas fa-weight'>"+productWeights+"kg</i> ) <br/>";
    // orderDetailBrief+="Tiền hàng:"+lsOrderDetail[lsOrder[e][0]].totalPay+" ( <i class='fas fa-box'>x"+numOfProd+"</i> ) <br/>";
    orderDetailBrief+="Tiền hàng:"+lsOrderDetail[lsOrder[e][0]].totalPay+" <br/> Số lượng hàng: "+numOfProd+" <br/>";

    var dateText = lsOrder[e][10].split(" ")[0].replace(new RegExp('-', 'g'), '/');
    var requestedDate = new Date(dateText);
    var next2days = new Date(requestedDate);
    //5: Friday, 6: Sat, 0->4: Sun to thursay
    if (requestedDate.getDay() >=0 && requestedDate.getDay() <=4) {
      next2days.setDate(requestedDate.getDate()+2);
    } else if (requestedDate.getDay() ==5){
      next2days.setDate(requestedDate.getDate()+4);
    } else if (requestedDate.getDay() ==6){
      next2days.setDate(requestedDate.getDate()+3);
    }

    orderDetailBrief+="Requested at:"+getCurrentDateTime(requestedDate).date+" Deadline:"+getCurrentDateTime(next2days).date+"<br/>";

    orderDetailBrief+=(lsOrderDetail[lsOrder[e][0]].orderNode ? "Note:"+lsOrderDetail[lsOrder[e][0]].orderNode : "");
    orderDetailBrief+="<hr/>";

    var mark = "";
    if (userRole=="manager"){
      mark = (next2days < new Date() ? "textRed" : "");
    }

    $("#listShippingOrder").append(
        // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+lsOrder[e][0]+' | '+lsOrder[e][2]+' | '+lsOrder[e][5]+'</a>'
        '<div class="card cardElement_'+e+'">'+
          '<div class="card-header" id="heading_'+e+'">'+
            '<h5 class="mb-0">'+
              '<input type="checkbox" class="checkbox check_'+e+'"/>'+
              '<button class="btn btn-link '+mark+' btnOrder_'+e+'" data-toggle="collapse" data-target="#collapse_'+e+'" aria-expanded="false" aria-controls="collapse_'+e+'">'+
                title +
              '</button>'+
            '</h5>'+
          '</div>'+

          '<div id="collapse_'+e+'" class="collapse" aria-labelledby="heading_'+e+'" data-parent="#listShippingOrder">'+
            '<div class="card-body">'+
              '<div class="btn btn-default btnNormal5px">'+
              '  <a href="tel:'+lsOrder[e][2]+'"><span class="fas fa-phone"></span>'+lsOrder[e][2]+'</a>'+
              '</div>'+
              '<br/>'+
              '<div class="btn btn-default btnNormal5px" style="margin-top:10px;">'+
              '  <a href="http://maps.google.com/maps?q='+address+'"><span class="fas fa-address-card"></span>'+lsOrder[e][1]+'</a>'+
              '</div>'+
              '<br/>'+
              orderDetailBrief+
              
              // datetime +

              '<div class="btn btn-default btnNormal5px detail order_'+e+'">Xem chi tiết</div>'+
              preparedButton +
              completeButton +
              deleteButton +
              payshipButton+
            '</div>'+
          '</div>'+
        '</div>'
      )

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

  if (mode == "SHIPPER_RECEIVED_MONEY"){
    $("#note").html("Shipper đã nhận :"+totalShipperReceivedMoney);
  } else if (mode == "SENT_POST") {
    $("#note").html("Tiền hàng từ post:"+totalShipperReceivedMoney);
  } else if (mode == "PAYSHIP") {
    
    var  reportPay = ("Tiền gói hàng (số đơn X 5): "+packedCost+"<br/>Tiền đi ship: "+shippedCost+"<br/>Tiền post và shoppe: "+postAndShopeeCost+"<br/>");
    var taskPayfn = getTaskUnpaid();

    var taskPay = taskPayfn.taskPay;
    reportPay += taskPayfn.text;
    reportPay += "Tiền nhiệm vụ:"+taskPayfn.taskPay+"<br/>";
    reportPay += "Tổng tiền cho shipper:"+(packedCost+shippedCost+postAndShopeeCost+taskPayfn.taskPay);

    $("#note").html(reportPay);
  } else {
    var lsCountText = "<hr/>Tổng cộng:<br/>";
    console.log(lsCount)
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

  $(".btnChooseShippingSchedule").hide();
  $(".btnChooseShippingSchedule").click(chooseShippingScheduleFn);

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

  $(".shipperReceiveMonney").click(shipperReceiveMonney);
}

function getTaskUnpaid(){
  var text = "Danh sách nhiệm vụ hoàn thành <br/>";
  var taskPay = 0;
  // console.log(lsTask);
  for(e in lsTask) {
    if (lsTask[e][3] == "COMPLETED" && !lsTask[e][6]) {
      // console.log(lsTask[e])
      // console.log(lsTask[e][6])
      text += "--"+lsTask[e][1]+" : "+parseFloat(lsTask[e][5] ? lsTask[e][5] : 0)+"<br/>";
      taskPay += parseFloat(lsTask[e][5] ? lsTask[e][5] : 0);
    }
  }
  return {
    text : text,
    taskPay : taskPay
  }
}

function chooseShippingScheduleFn(){
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var value = $(".datetimepickerorder_"+orderIndex).val();
  console.log( orderIndex+ " - "+ value);
  var actualOrderIndex = parseInt(orderIndex) + 1;

  var sheetrange = 'Shipping!L'+actualOrderIndex+':L'+actualOrderIndex;

  var dataUpdateShipping = [
    [value]
  ];

  $("#loadingSpin").show();

  updateShipping(dataUpdateShipping, sheetrange, function(){

      $(".cardElement_"+orderIndex).remove();
      $("#loadingSpin").hide();

  },function(){
    console.log("Something wrong");
  })
}

function deleteShipRequest() {
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualOrderIndex = parseInt(orderIndex) + 1;
  var dataUpdateShipping = [
    ["","","","","","","","","",""]
  ];
  var sheetrange = 'Shipping!A'+actualOrderIndex+':J'+actualOrderIndex;

  $("#loadingSpin").show();

  updateShipping(dataUpdateShipping, sheetrange, function(){
     $("#loadingSpin").hide();
     $(".cardElement_"+orderIndex).remove();
  }, function(){
    console.log("Something wrong");
  })
}

function showDetail(){
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualOrderIndex = parseInt(orderIndex) + 1;

  localStorage.setItem("currentOrder",lsOrder[orderIndex][3]);

  saveHistory({
    orderFilter : $(".orderFilter").val(),
    goToClass : $(this).attr("class")
  })

  window.location = "showordershipping.html";  
}

function shipperReceiveMonney(){
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualOrderIndex = parseInt(orderIndex) + 1;

  var sheetrange = 'Shipping!J'+actualOrderIndex+':J'+actualOrderIndex;

  var otherCost = lsOrder[orderIndex][5];
  // console.log("Reply : email:"+emailId);

  var dataUpdateShipping = [
    [lsOrder[orderIndex][3].willpay]
  ];

  $("#loadingSpin").show();

  updateShipping(dataUpdateShipping, sheetrange, function(){

      $(".cardElement_"+orderIndex).remove();
      $("#loadingSpin").hide();

  },function(){
    console.log("Something wrong");
  })
}


function updatePaymentComplete(orderIndex){
  var line = parseInt(orderIndex) + 1;
  var value = "PAID";
  var column = 8; //for payment
  $("#loadingSpin").show();
  updateOrderStatus(line,column,value, function(){
    $("#loadingSpin").hide();
  });
}

function payShipForEachShip(oix, callback){
  var orderIndex = oix ? oix : $(this).attr("class").split(" ").pop().split("_").pop();
  var actualOrderIndex = parseInt(orderIndex) + 1;

  var sheetrange = 'Shipping!J'+actualOrderIndex+':J'+actualOrderIndex;

  dataUpdateShipping = [
    [
      "1"
    ]
  ];

  $("#loadingSpin").show();
  $("#modelContent").html("Thanh toán ship cho đơn:"+lsOrderDetail[lsOrder[orderIndex][0]].orderCode+" "+lsOrderDetail[lsOrder[orderIndex][0]].customerName);

  updateShipping(dataUpdateShipping, sheetrange, function(){
      $("#loadingSpin").hide();

      $(".cardElement_"+orderIndex).remove();

      if (callback) {
        callback();
      }

  },function(){
    console.log("Something wrong");
  })
}


$(".payShipAll").click(function(){
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
  var requestShip = function(index) {
    if (index >= lsChecked.length)  {
      return;
    }

    // if ($(lsChecked[index]).is(":checked")){
      // console.log();
      var orderIndex = $(lsChecked[index]).attr("class").split(" ").pop().split("_").pop();
      // var actualOrderIndex = parseInt(orderIndex) + 1;
      payShipForEachShip(orderIndex,function(){
        requestShip(index+1);  
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

$(".payShipSelect").click(function(){
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
  var requestShip = function(index) {
    if (index >= lsChecked.length)  {
      return;
    }

    if ($(lsChecked[index]).is(":checked")){
      // console.log();
      var orderIndex = $(lsChecked[index]).attr("class").split(" ").pop().split("_").pop();
      // var actualOrderIndex = parseInt(orderIndex) + 1;
      payShipForEachShip(orderIndex,function(){
        requestShip(index+1);  
      })

      // requestShipping(currentOrder,function(){
      //   requestShip(index+1);
      // });
      
    } else {
      requestShip(index+1);
    }
  }
  requestShip(0);
})

function shipComplete(){
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualOrderIndex = parseInt(orderIndex) + 1;

  // var today = new Date();
  // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  // var dateTime = date+' '+time;
  var dateTime = getCurrentDateTime().dateTime;//date+' '+time;

  var sheetrange = 'Shipping!E'+actualOrderIndex+':G'+actualOrderIndex;

  var otherCost = lsOrder[orderIndex][5];
  // console.log("Reply : email:"+emailId);

  sheetrange = 'Shipping!E'+actualOrderIndex+':G'+actualOrderIndex;

  var nextStep = "COMPLETED"; //FOR SHIPPER_NO_COD, SHOPEE, POST_NO_COD

  
  var currentOrder = lsOrderDetail[lsOrder[orderIndex][0]];

  if (lsOrder[orderIndex][8] == "SHIPPER_COD"){
    if (lsOrder[orderIndex][4] == "Requested") {
      nextStep = "SHIPPER_RECEIVED_MONEY";

      sendToManagerViaEmail(currentOrder, "Shipper received cash:"+lsOrderDetail[lsOrder[orderIndex][0]].willpay);

    } else if (lsOrder[orderIndex][4] == "SHIPPER_RECEIVED_MONEY") {
      nextStep = "COMPLETED";
      updatePaymentComplete(listOrderSheetParse[lsOrder[orderIndex][0]].orderIndex);

      sendToManagerViaEmail(currentOrder, "Shop received cash:"+lsOrderDetail[lsOrder[orderIndex][0]].willpay);
    }
  } else if (lsOrder[orderIndex][8] == "POST_COD"){

    // if (lsOrder[orderIndex][4] == "Requested") {
    //   nextStep = "SENT_POST";
    // } else if (lsOrder[orderIndex][4] == "SENT_POST") {
      nextStep = "COMPLETED";
      // updatePaymentComplete(listOrderSheetParse[lsOrder[orderIndex][0]].orderIndex);
      sendToManagerViaEmail(currentOrder, "Sent via "+lsOrder[orderIndex][8]);

    // }

  } else if (lsOrder[orderIndex][4] == "Requested") {
    sendToManagerViaEmail(currentOrder, "Sent via "+lsOrder[orderIndex][8]);
  }

  dataUpdateShipping = [
    [nextStep, 
      otherCost, 
      dateTime
      ]
  ];

  // console.log(dataUpdateShipping);

  $("#loadingSpin").show();

  updateShipping(dataUpdateShipping, sheetrange, function(){
      if (dataUpdateShipping[0][0] == "COMPLETED" ||
        dataUpdateShipping[0][0] == "SHIPPER_RECEIVED_MONEY") {
      }
      $("#loadingSpin").hide();

      $(".cardElement_"+orderIndex).remove();

  },function(){
    console.log("Something wrong");
  })
}


function shipPrepared(){
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
      $(".btnOrder_"+orderIndex).addClass("borderMustard");
      $(".preparedOrder_"+orderIndex).addClass("borderMustard");
      // console.log($(".preparedOrder_"+orderIndex));
      $(".preparedOrder_"+orderIndex).html("Đã chuẩn bị");
  //     $("#loadingSpin").hide();
  // },function(){
  //   console.log("Something wrong");
  // })
}

function shippingReport(){
  $("#listShippingOrder").empty();
  $("#listShippingOrder").html(totalShippingCost);
}

function showTask(){
  $("#listShippingOrder").empty();
  
  var mode = $(".orderFilter").val();

  $("#note").html("");

  // console.log(lsTask);
  
  for(e in lsTask) {
    if (e == 0) {
      continue;
    }

    if (!lsTask[e][0]) {
      continue;
    }

    if (lsTask[e][3] && mode=="TASK") {
      continue;
    }

    var deleteButton = userRole=="manager" ? '<div class="btn btn-default btnNormal delete order_'+e+'" style="margin:10px 0 0;">Xoá</div>' : "";

    var completeButton = '<div class="btn btn-default btnNormal complete order_'+e+'" style="margin:10px 10px 0;">Hoàn thành</div>';
    var additionalContent = "";
    var editTask = '';
    if (mode == "TASKALL") {
      additionalContent = '<hr/>' +
      "Tình trạng: "+lsTask[e][3]+"<br/>"+
      "Thời gian hoàn thành: "+lsTask[e][4]+"<br/>"+
      "Công task: "+(lsTask[e][5] ? lsTask[e][5] : 0)+"<br/>"+
      "Đã thanh toán: "+(lsTask[e][6] ? "Rồi" : "Chưa")+"<br/>";
      
      editTask = '<div class="btn btn-default btnNormal editTask order_'+e+'" style="margin:10px 10px 0;">Sửa thông tin</div>';

    }
    $("#listShippingOrder").append(
        // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+lsOrder[e][0]+' | '+lsOrder[e][2]+' | '+lsOrder[e][5]+'</a>'
        '<div class="card cardElement_'+e+'">'+
          '<div class="card-header" id="heading_"'+e+'>'+
            '<h5 class="mb-0">'+
              '<button class="btn '+(lsTask[e][6]==1 ? "textRed" :"")+' btn-link btnOrder_'+e+'" data-toggle="collapse" data-target="#collapse_'+e+'" aria-expanded="false" aria-controls="collapse_'+e+'">'+
                lsTask[e][0]+' | '+lsTask[e][1] + (lsTask[e][6]==1 ? "| PAID" : "")+
              '</button>'+
            '</h5>'+
          '</div>'+

          '<div id="collapse_'+e+'" class="collapse" aria-labelledby="heading_'+e+'" data-parent="#listShippingOrder">'+
            '<div class="card-body">'+
              '<div class="task content">'+
                // '<textarea class="field-textarea form-control taskContent_'+e+'" readonly>'+
                  (mode=="TASKALL" ? "Không hiển thị" : lsTask[e][2]) +
                // '</textarea>'+
              '</div>'+
              additionalContent+
              '<hr/>' +
              completeButton +
              deleteButton +
              editTask +
            '</div>'+
          '</div>'+
        '</div>'
      )
      // $('.taskContent_'+e).height( $('.taskContent_'+e)[0].scrollHeight );
      // console.log($('.taskContent_'+e)[0].scrollHeight)
  }

  $(".complete").click(taskComplete)
  $(".delete").click(deleteTask);
  $(".editTask").click(showEditTask);
}

function showEditTask(){
  var taskIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  // var modalBody ="<div>"+
  //       " Nhận hàng: "+data[e][5]+" | "+data[e][6] + "<br/>"+
  //       " Thanh toán: "+data[e][7]+" | "+data[e][8]+ "|" + data[e][9]+"<br/>"+ 
  //       "</div>";
  var modalBody = '<div>Thông tin nhiệm vụ:</div><br/>'+
              '<div class="btn btn-default btnNormal">'+
              lsTask[taskIndex][1]+
              '</div>'+
              '<br/>'+
              // '<div>Trạng thái : '+
              '<div class="btn btn-default btnNormal"> Trạng thái :'+
              lsTask[taskIndex][3]+
              '</div>'+
              '<br/>'+
              // '<div>Chi phí</div>'+
              '<input class="taskChooseIndex" readonly hidden value="'+taskIndex+'"/>'+
              '<div class="btn btn-default btnNormal">'+
              ' Chi phí <input class="taskfee" value="'+(lsTask[taskIndex][5] ? lsTask[taskIndex][5] : 0)+'"/>'+
              '</div>'+
              '<br/>'+
              '<div class="btn btn-default btnNormal"> Thanh toán ?'+
              ' <input type="checkbox" class="taskCkPaid" '+(lsTask[taskIndex][6]==1 ? 'checked' : '')+'/>'+
              '</div>'+
              '<br/>'+
              '<div class="btn btn-default taskSaveInfor btnNormal">Lưu thông tin'+
              '</div>'
              ;
  $("#myModal .modal-body").html(modalBody);
  $('#myModal').modal('toggle');
  $('.taskSaveInfor').click(saveTaskFn)
}

function saveTaskFn(){
  var taskfee = $(".taskfee").val();
  taskfee = taskfee ? taskfee : 0;
  var taskCkPaid = $(".taskCkPaid").is(":checked") ? "1" : "";
  var taskIndex = $(".taskChooseIndex").val();
  var actualTaskIndex = parseInt(taskIndex) + 1;

  console.log(taskfee+ " "+taskCkPaid + " "+taskIndex);

  var sheetrange = 'Task!F'+actualTaskIndex+':G'+actualTaskIndex;

  lsTask[taskIndex][5] = taskfee;
  lsTask[taskIndex][6] = taskCkPaid;

  var dataUpdateTask = [
    [taskfee, taskCkPaid]
  ];

  $("#loadingSpin").show();

  updateShipping(dataUpdateTask, sheetrange, function(){
    
    // $(".cardElement_"+taskIndex).remove();
    $("#loadingSpin").hide();

  },function(){
    console.log("Something wrong");
  })

}

function deleteTask() {
  var taskIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualTaskIndex = parseInt(taskIndex) + 1;
  var dataUpdateTask = [
    ["","","","",""]
  ];
  var sheetrange = 'Task!A'+actualTaskIndex+':E'+actualTaskIndex;

  $("#loadingSpin").show();

  updateShipping(dataUpdateTask, sheetrange, function(){
     $("#loadingSpin").hide();
     $(".cardElement_"+taskIndex).remove();
  })
}

function taskComplete(){
  var taskIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualTaskIndex = parseInt(taskIndex) + 1;

  // var today = new Date();
  // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  // var dateTime = date+' '+time;
  var dateTime = getCurrentDateTime().dateTime;//date+' '+time;

  var sheetrange = 'Task!D'+actualTaskIndex+':E'+actualTaskIndex;

  lsTask[taskIndex][3] = "COMPLETED";
  lsTask[taskIndex][4] = dateTime;

  var dataUpdateTask = [
    ["COMPLETED", dateTime]
  ];

  $("#loadingSpin").show();

  updateShipping(dataUpdateTask, sheetrange, function(){
    
    $(".cardElement_"+taskIndex).remove();
    $("#loadingSpin").hide();

  },function(){
    console.log("Something wrong");
  })
}

$(".orderFilter").change(function(){
  var mode = document.getElementsByClassName($(this).attr("class"))[0].value;
  console.log("orderFilter:"+mode);

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
      ) {
    $(".maintitle").html("Quản lý đơn hàng");
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

$(".click-to-select").click(function(){
  if($(".checkbox").is(':visible') ) {
    $(".checkbox").hide();
    $("#controllMany").hide();
  } else {
    $(".checkbox").show();
    $("#controllMany").show();
  }
})


$(".completeMany").click(function(){
  var lsChecked = $(".checkbox");
  var requestShip = function(index) {
    if (index >= lsChecked.length)  {
      return;
    }

    if ($(lsChecked[index]).is(":checked")){
      console.log(lsChecked[index]);
      


      // requestShipping(currentOrder,function(){
      //   requestShip(index+1);
      // });

    } else {
      requestShip(index+1);
    }
  }
  requestShip(0);
})

$("#orderSearchInput").keyup(function(){
  var searchText = $(this).val();
  console.log("search:"+searchText);
  loadOrderShippingListHtml();
});


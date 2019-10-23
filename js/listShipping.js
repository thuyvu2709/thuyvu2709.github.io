var lsOrder;
var lsTask;
var lsOrderDetail;

var triggerAfterLoad = function(){

  $("#loadingSpin").show();

  // var lsOrderset = JSON.parse(localStorage.getItem("ordershipping"));
  // var lsTaskset =  JSON.parse(localStorage.getItem("tasklist"));
  
  getOrderShipping(function(lsOrderset){
      $("#loadingSpin").hide();
      lsOrder = lsOrderset;
      readOrderDetail(loadOrderShippingListHtml);
      getTaskList(function(lsTaskset){
        lsTask = lsTaskset;
      })
  });
}

$(".text-center").click(function(){
  // getOrderShipping(function(lsOrderset){
  //     lsOrder = lsOrderset;
  //     loadOrderShippingListHtml(lsOrder);
  //     getTaskList(function(lsTaskset){
  //       lsTask = lsTaskset;
  //     })
  // });
  triggerAfterLoadX();
})

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
  }
  // console.log(lsOrderDetail);
  callback();
}

// $(document).ready(function () {

//DatePicker Example
// $('#datetimepicker').datetimepicker();
// });

var mode = "PROCESSING";

var totalShippingCost = 0;

function loadOrderShippingListHtml() {

  $("#listShippingOrder").empty();
  // $(".maintitle").html("Quản lý giao hàng");


  var userRole = JSON.parse(localStorage.getItem("userRole"));
  
  totalShippingCost = 0
  var totalShipperReceivedMoney = 0;

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
    if (mode == "PROCESSING") {
      if (lsOrder[e][4] == "COMPLETED" || lsOrder[e][4] == "SHIPPER_RECEIVED_MONEY") {
        continue;
      }
    } else if (mode == "COMPLETED") {
      if (lsOrder[e][4] != "COMPLETED" && lsOrder[e][4] != "SHIPPER_RECEIVED_MONEY") {
        continue;
      }
    } else if (mode == "SHIPPER_RECEIVED_MONEY") {
      if (lsOrder[e][4] != "SHIPPER_RECEIVED_MONEY") {
        continue;
      } else {
        totalShipperReceivedMoney += parseFloat(lsOrderDetail[lsOrder[e][0]].willpay);
      }
    }


    var address = lsOrder[e][1].replace(/[|&;$%@"<>()+,]/g, "").trim().replace(" ","+");

    var deleteButton = userRole=="manager" ? '<div class="btn btn-default btnNormal5px delete order_'+e+'">Xoá</div>' : "";

    var datetime = '<input type="text" class="datetimepicker form-control"/></br>';


    var datetime =
    '   <div class="form-group">'+
    '      <label class="control-label">Thời gian giao hàng</label>'+
    '      <div class=\'input-group date\'>'+
    '         <input type=\'text\' class="datetimepicker form-control datetimepickerorder_'+e+'" placeholder="Chọn thời gian giao hàng"/>'+
    '      </div>'+
    '     <div class="btn btn-default btnNormal5px btnChooseShippingSchedule chooseShippingSchedule_'+e+'">'+
    '       Xác nhận'+
    '     </div>'+
    '   </div>'+
    '<hr/>';

    var completeButton = '<div class="btn btn-default  btnNormal5px complete order_'+e+'" >Hoàn thành</div>';

    if (lsOrder[e][8] == 1) {
      completeButton = '<div class="btn btn-default btnNormal5px complete order_'+e+'" >Hoàn thành (thu '+lsOrderDetail[lsOrder[e][0]].willpay+')</div>';
    }

    if (lsOrder[e][8] == 2 && lsOrder[e][4] == "Requested") {
      completeButton = '<div class="btn btn-default btnNormal5px complete order_'+e+'" >Đã gửi Post</div>';
        // '<div class="btn btn-default btnNormal5px shipperReceiveMonney order_'+e+'" >Ship đã nhận tiền</div>';
    }

    if (lsOrder[e][8] == 2 && lsOrder[e][4] == "SEND_POST") {
      completeButton = '<div class="btn btn-default btnNormal5px complete order_'+e+'" >Shipper đã nhận tiền</div>';
    }

    if (lsOrder[e][8] == 2 && lsOrder[e][4] == "SHIPPER_RECEIVED_MONEY") {
      if (userRole=="manager") {
        completeButton = '<div class="btn btn-default btnNormal5px complete order_'+e+'" >SHOP đã nhận tiền</div>';
      } else {
        completeButton = '<div class="btn btn-default btnNormal5px order_'+e+'" >Chờ xác nhận từ SHOP</div>';
      }
    }

    if (lsOrder[e][6] && lsOrder[e][4] == "COMPLETED") {
      completeButton = '<div class="btn borderMustard btn-default btnNormal5px" >Hoàn thành lúc '+lsOrder[e][6]+'</div>';
    }

    var preparedButton = '<div class="btn btn-default btnNormal5px prepared preparedOrder_'+e+'" ">Đã chuẩn bị</div><br/>';
    // var orderReady = "";
    // if (lsOrder[e][8]) {
    //   // console.log(lsOrder[e][8]);
    //   orderReady = "borderMustard"
    //   preparedButton = '<div class="btn borderMustard btn-default btnNormal" style="margin:10px 10px 0;">Đã chuẩn bị lúc:'+lsOrder[e][8]+'</div><br/>';
    // }

    var shipIcon = '[<i class="fas fa-motorcycle"></i>]'

    if (lsOrder[e][8]==1) {
      shipIcon = '[<i class="fas fa-motorcycle">COD</i>]'
    } else if (lsOrder[e][8]==2) {
      shipIcon = '[<i class="fas fa-motorcycle">VIETTELPOST</i>]'
    }

    var title = lsOrder[e][0]+' | '+lsOrder[e][1];
    if (userRole=="manager") {
      // console.log(lsOrderDetail[lsOrder[e][0]].customerName);
      title = lsOrder[e][0]+' | '+lsOrderDetail[lsOrder[e][0]].customerName+" | "+lsOrder[e][1] +" | "+shipIcon
    }

    var orderDetailBrief = "<hr/>";
    var prodListOrder = lsOrderDetail[lsOrder[e][0]].prodListOrder;
    for (o in prodListOrder) {
      orderDetailBrief += prodListOrder[o].productName + " (sl:"+prodListOrder[o].productCount +")<br/>"
    }
    // console.log(prodListOrder[o]);
    orderDetailBrief+=(lsOrderDetail[lsOrder[e][0]].orderNode ? "Note:"+lsOrderDetail[lsOrder[e][0]].orderNode : "");
    orderDetailBrief+="<hr/>";

    $("#listShippingOrder").append(
        // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+lsOrder[e][0]+' | '+lsOrder[e][2]+' | '+lsOrder[e][5]+'</a>'
        '<div class="card cardElement_'+e+'">'+
          '<div class="card-header" id="heading_'+e+'">'+
            '<h5 class="mb-0">'+
              '<button class="btn btn-link btnOrder_'+e+'" data-toggle="collapse" data-target="#collapse_'+e+'" aria-expanded="false" aria-controls="collapse_'+e+'">'+
                title +
              '</button>'+
            '</h5>'+
          '</div>'+

          '<div id="collapse_'+e+'" class="collapse" aria-labelledby="heading_'+e+'" data-parent="#listShippingOrder">'+
            '<div class="card-body">'+
              // datetime +
              '<div class="btn btn-default btnNormal5px">'+
              '  <a href="tel:'+lsOrder[e][2]+'"><span class="fas fa-phone"></span>'+lsOrder[e][2]+'</a>'+
              '</div>'+
              '<br/>'+
              '<div class="btn btn-default btnNormal5px" style="margin-top:10px;">'+
              '  <a href="http://maps.google.com/maps?q='+address+'"><span class="fas fa-address-card"></span>'+lsOrder[e][1]+'</a>'+
              '</div>'+
              '<br/>'+
              orderDetailBrief+
              '<div class="btn btn-default btnNormal5px detail order_'+e+'">Xem chi tiết</div>'+
              preparedButton +
              completeButton +
              deleteButton +
            '</div>'+
          '</div>'+
        '</div>'
      )
  }

  $("#note").html("Shipper đã nhận :"+totalShipperReceivedMoney);

  $(".complete").click(shipComplete)
  $(".detail").click(showDetail);
  $(".delete").click(deleteShipRequest);
  $('.datetimepicker').datetimepicker();
  $('.prepared').click(shipPrepared);

  $(".btnChooseShippingSchedule").hide();
  // $(".btnChooseShippingSchedule").click(chooseShippingScheduleFn);

  // $('.datetimepicker').change(function(){
  //   console.log($(this).attr("class"));
  //   console.log($(this).val());
  //   var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();

  //   if ($(this).val()) {
  //     console.log(".btnChooseShippingSchedule "+orderIndex);
  //     $(".chooseShippingSchedule_"+orderIndex).show();
  //   } else {
  //     $(".chooseShippingSchedule_"+orderIndex).hide();
  //   }
  // });

  $(".shipperReceiveMonney").click(shipperReceiveMonney);
}

function chooseShippingScheduleFn(){
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var value = $(".datetimepickerorder_"+orderIndex).val();
  console.log(value);

}

function deleteShipRequest() {
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualOrderIndex = parseInt(orderIndex) + 1;
  var dataUpdateShipping = [
    ["","","","","","","","",""]
  ];
  var sheetrange = 'Shipping!A'+actualOrderIndex+':I'+actualOrderIndex;

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

function shipComplete(){
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualOrderIndex = parseInt(orderIndex) + 1;

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;

  var sheetrange = 'Shipping!E'+actualOrderIndex+':G'+actualOrderIndex;

  var otherCost = lsOrder[orderIndex][5];
  // console.log("Reply : email:"+emailId);

  var dataUpdateShipping = [
    ["COMPLETED", otherCost, dateTime]
  ];

  sheetrange = 'Shipping!E'+actualOrderIndex+':G'+actualOrderIndex;


  if (lsOrder[orderIndex][8] == 1){

    dataUpdateShipping = [
      ["SHIPPER_RECEIVED_MONEY", 
        otherCost, 
        dateTime
        ]
    ];
  } else if (lsOrder[orderIndex][8] == 2){

    var nextStep = "";
    if (lsOrder[orderIndex][4] == "Requested") {
      nextStep = "SEND_POST";
    } else if (lsOrder[orderIndex][4] == "SEND_POST") {
      nextStep = "SHIPPER_RECEIVED_MONEY";
    } else if (lsOrder[orderIndex][4] == "SHIPPER_RECEIVED_MONEY") {
      nextStep = "COMPLETED";
    }

    dataUpdateShipping = [
      [nextStep, 
        otherCost, 
        dateTime
        ]
    ];
  }

  $("#loadingSpin").show();

  updateShipping(dataUpdateShipping, sheetrange, function(){
      if (dataUpdateShipping[0][0] == "COMPLETED" ||
        dataUpdateShipping[0][0] == "SHIPPER_RECEIVED_MONEY") {
        $(".cardElement_"+orderIndex).remove();
      }
      $("#loadingSpin").hide();

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

  var userRole = JSON.parse(localStorage.getItem("userRole"));

  for(e in lsTask) {
    if (e == 0) {
      continue;
    }

    if (!lsTask[e][0]) {
      continue;
    }

    if (lsTask[e][3]) {
      continue;
    }

    var deleteButton = userRole=="manager" ? '<div class="btn btn-default btnNormal delete order_'+e+'" style="margin:10px 0 0;">Xoá</div>' : "";

    var completeButton = '<div class="btn btn-default btnNormal complete order_'+e+'" style="margin:10px 10px 0;">Hoàn thành</div>';

    $("#listShippingOrder").append(
        // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+lsOrder[e][0]+' | '+lsOrder[e][2]+' | '+lsOrder[e][5]+'</a>'
        '<div class="card cardElement_'+e+'">'+
          '<div class="card-header" id="heading_"'+e+'>'+
            '<h5 class="mb-0">'+
              '<button class="btn btn-link btnOrder_'+e+'" data-toggle="collapse" data-target="#collapse_'+e+'" aria-expanded="false" aria-controls="collapse_'+e+'">'+
                lsTask[e][0]+' | '+lsTask[e][1] +
              '</button>'+
            '</h5>'+
          '</div>'+

          '<div id="collapse_'+e+'" class="collapse" aria-labelledby="heading_'+e+'" data-parent="#listShippingOrder">'+
            '<div class="card-body">'+
              '<div class="task content">'+
                // '<textarea class="field-textarea form-control taskContent_'+e+'" readonly>'+
                  lsTask[e][2] +
                // '</textarea>'+
              '</div>'+
              '<hr/>' +
              completeButton +
              deleteButton +
            '</div>'+
          '</div>'+
        '</div>'
      )
      // $('.taskContent_'+e).height( $('.taskContent_'+e)[0].scrollHeight );
      // console.log($('.taskContent_'+e)[0].scrollHeight)
  }

  $(".complete").click(taskComplete)
  $(".delete").click(deleteTask);
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

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;

  var sheetrange = 'Task!D'+actualTaskIndex+':E'+actualTaskIndex;

  lsTask[taskIndex][4] = "COMPLETED";
  lsTask[taskIndex][5] = dateTime;

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
  console.log("orderFilter:");;
  mode = document.getElementsByClassName($(this).attr("class"))[0].value;
  if (mode == "PROCESSING" || mode == "COMPLETED" || mode == "ALL" || mode == "SHIPPER_RECEIVED_MONEY") {
    $(".maintitle").html("Quản lý đơn hàng");
    loadOrderShippingListHtml(lsOrder);
  } else if (mode == "TASK") {
    $(".maintitle").html("Quản lý nhiệm vụ");
    showTask();
  } else if (mode == "REPORT") {
    $(".maintitle").html("Báo cáo");
    shippingReport();
  }
})

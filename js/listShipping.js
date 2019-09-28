var lsOrder;
var lsTask;

var triggerAfterLoad = function(){

  $("#loadingSpin").show();

  // var lsOrderset = JSON.parse(localStorage.getItem("ordershipping"));
  // var lsTaskset =  JSON.parse(localStorage.getItem("tasklist"));
  
  getOrderShipping(function(lsOrderset){
      $("#loadingSpin").hide();
      lsOrder = lsOrderset;
      loadOrderShippingListHtml(lsOrder);
      getTaskList(function(lsTaskset){
        lsTask = lsTaskset;
      })
  });
}

// $(".text-center").click(function(){
//   getOrderShipping(function(lsOrderset){
//       lsOrder = lsOrderset;
//       loadOrderShippingListHtml(lsOrder);
//       getTaskList(function(lsTaskset){
//         lsTask = lsTaskset;
//       })
//   });
// })

// $(document).ready(function () {

//DatePicker Example
// $('#datetimepicker').datetimepicker();
// });

var mode = "PROCESSING";

var totalShippingCost = 0;

function loadOrderShippingListHtml(lsOrder) {

  $("#listShippingOrder").empty();
  // $(".maintitle").html("Quản lý giao hàng");


  var userRole = JSON.parse(localStorage.getItem("userRole"));
  
  totalShippingCost = 0

  for(e in lsOrder) {
    if (e == 0) {
      continue;
    }

    if (!lsOrder[e][0]) {
      continue;
    }

    if (lsOrder[e][4] == "COMPLETED") {
      totalShippingCost += parseInt(lsOrder[e][7])
    }

    if (mode == "PROCESSING") {
      if (lsOrder[e][4] == "COMPLETED") {
        continue;
      }
    } else if (mode == "COMPLETED") {
      if (lsOrder[e][4] != "COMPLETED") {
        continue;
      }
    }

    var address = lsOrder[e][1].replace(/[|&;$%@"<>()+,]/g, "").trim().replace(" ","+");

    var deleteButton = userRole=="manager" ? '<div class="btn btn-default btnNormal delete order_'+e+'" style="margin:10px 0 0;">Xoá</div>' : "";

    var datetime = '<input type="text" class="datetimepicker form-control"/></br>';


    var datetime =
    '   <div class="form-group">'+
    '      <label class="control-label">Thời gian giao hàng</label>'+
    '      <div class=\'input-group date\'>'+
    '         <input type=\'text\' class="datetimepicker form-control datetimepickerorder_'+e+'" placeholder="Chọn thời gian giao hàng"/>'+
    '      </div>'+
    '     <div class="btn btn-default btnNormal btnChooseShippingSchedule chooseShippingSchedule_'+e+'">'+
    '       Xác nhận'+
    '     </div>'+
    '   </div>'+
    '<hr/>';

    var completeButton = '<div class="btn btn-default btnNormal complete order_'+e+'" style="margin:10px 10px 0;">Hoàn thành</div>';

    if (lsOrder[e][6]) {
      completeButton = '<div class="btn btn-default btnNormal" style="margin:10px 10px 0;">Hoàn thành lúc '+lsOrder[e][6]+'</div>';
    }

    $("#listShippingOrder").append(
        // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+lsOrder[e][0]+' | '+lsOrder[e][2]+' | '+lsOrder[e][5]+'</a>'
        '<div class="card cardElement_'+e+'">'+
          '<div class="card-header" id="heading_"'+e+'>'+
            '<h5 class="mb-0">'+
              '<button class="btn btn-link btnOrder_'+e+'" data-toggle="collapse" data-target="#collapse_'+e+'" aria-expanded="false" aria-controls="collapse_'+e+'">'+
                lsOrder[e][0]+' | '+lsOrder[e][1] +
              '</button>'+
            '</h5>'+
          '</div>'+

          '<div id="collapse_'+e+'" class="collapse" aria-labelledby="heading_'+e+'" data-parent="#listShippingOrder">'+
            '<div class="card-body">'+
              // datetime +
              '<div class="btn btn-default btnNormal">'+
              '  <a href="tel:'+lsOrder[e][2]+'"><span class="fas fa-phone"></span>'+lsOrder[e][2]+'</a>'+
              '</div>'+
              '<br/>'+
              '<div class="btn btn-default btnNormal" style="margin-top:10px;">'+
              '  <a href="http://maps.google.com/maps?q='+address+'"><span class="fas fa-address-card"></span>'+lsOrder[e][1]+'</a>'+
              '</div>'+
              '<br/>'+
              '<div class="btn btn-default btnNormal detail order_'+e+'" style="margin-top:10px;">Xem chi tiết</div>'+
              completeButton +
              deleteButton +
            '</div>'+
          '</div>'+
        '</div>'
      )
  }

  $(".complete").click(shipComplete)
  $(".detail").click(showDetail);
  $(".delete").click(deleteShipRequest);
  $('.datetimepicker').datetimepicker();

  $(".btnChooseShippingSchedule").hide();
  $(".btnChooseShippingSchedule").click(chooseShippingScheduleFn);

  $('.datetimepicker').change(function(){
    console.log($(this).attr("class"));
    console.log($(this).val());
    var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();

    if ($(this).val()) {
      console.log(".btnChooseShippingSchedule "+orderIndex);
      $(".chooseShippingSchedule_"+orderIndex).show();
    } else {
      $(".chooseShippingSchedule_"+orderIndex).hide();
    }
  });
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
    ["","","","","","","",""]
  ];
  var sheetrange = 'Shipping!A'+actualOrderIndex+':H'+actualOrderIndex;

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

function shipComplete(){
  var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualOrderIndex = parseInt(orderIndex) + 1;

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;

  var sheetrange = 'Shipping!E'+actualOrderIndex+':G'+actualOrderIndex;

  var emailId = lsOrder[orderIndex][5];
  console.log("Reply : email:"+emailId);

  var dataUpdateShipping = [
    ["COMPLETED", emailId, dateTime]
  ];

  $("#loadingSpin").show();

  updateShipping(dataUpdateShipping, sheetrange, function(){
    // $(".cardElement_"+orderIndex).remove();
    // // $("#loadingSpin").show();

    var roles = getSpecificRoles();
    var receiver = roles["manager"];
    var cc = roles["shipper"];
    console.log(receiver);
    console.log(cc);

    var emailContent = "Hoàn thành";
    // var subject = lsOrder[orderIndex][0] + " - " +removeSpecialAlias(lsOrder[orderIndex][1]).toUpperCase();
    var subject = lsOrder[orderIndex][0] + " -  COMPLETED"; 

    var headers_obj = {
            'To': receiver,
            'CC' : cc,
            'Subject': subject,
            'In-Reply-To': emailId
          };

    sendEmail(headers_obj,emailContent, function(){
      $(".cardElement_"+orderIndex).remove();
      $("#loadingSpin").hide();
    });

  },function(){
    console.log("Something wrong");
  })
}

function shippingReport(){
  $("#listShippingOrder").empty();
  $("#listShippingOrder").html(totalShippingCost);
}

function showTask(){
  $("#listShippingOrder").empty();
  $(".maintitle").html("Quản lý nhiệm vụ");

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
  var sheetrange = 'Task!A'+actualOrderIndex+':E'+actualOrderIndex;

  $("#loadingSpin").show();

  updateShipping(dataUpdateShipping, sheetrange, function(){
     $("#loadingSpin").hide();
     $(".cardElement_"+taskIndex).remove();
  })
}

function taskComplete(){
  var taskIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var actualTaskIndex = parseInt(orderIndex) + 1;

  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;

  var sheetrange = 'Task!D'+actualTaskIndex+':E'+actualTaskIndex;

  lsOrder[taskIndex][4] = "COMPLETED";
  lsOrder[taskIndex][5] = dateTime;

  var dataUpdateTask = [
    ["COMPLETED", dateTime]
  ];

  $("#loadingSpin").show();

  updateShipping(dataUpdateTask, sheetrange, function(){
    
    $(".cardElement_"+orderIndex).remove();
    $("#loadingSpin").hide();

  },function(){
    console.log("Something wrong");
  })
}


$(".orderFilter").change(function(){
  console.log("orderFilter:");;
  mode = document.getElementsByClassName($(this).attr("class"))[0].value;
  if (mode == "PROCESSING" || mode == "COMPLETED" || mode == "ALL") {
    loadOrderShippingListHtml(lsOrder);
  } else if (mode == "TASK") {
    showTask();
  } else if (mode == "REPORT") {
    $(".maintitle").html("Báo cáo");
    shippingReport();
  }
})

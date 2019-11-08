
var status = "PROCESSING";

var spreadsheetId = mainSheetForProduct;
var sheetOrder = "Order";
var orderShipStatus =[];
var listProductParse = {};
var listOrderDetailParse = {};

var url = new URL(window.location.href);

var triggerAfterLoadX = function(){

  $("#loadingSpin").show();

  loadProductList(function(){
    // console.log("1")
    loadOrderList(function(){
          // console.log("2")
      loadOrderListDetail(function(){
        filterOrderWithProdRefCode();
        parseOrderDetail();
        getOrderShipping(function(lsOrderset){
          parseOrderShipping();
          parseProduct();
          $("#loadingSpin").hide();
          console.log("Gooo");
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
  triggerAfterLoadX();
})

var orderWithProdRef = [];
function filterOrderWithProdRefCode(){
  var prodRefCodeFilter = url.searchParams.get("prodRefCodeFilter");
  if (!prodRefCodeFilter) {
    return;
  }
  status = "REQUESTED";
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
    orderShipStatus[lsOrderShipping[e][0]] = {
      status : lsOrderShipping[e][4],
      stype : lsOrderShipping[e][8],
      sindex : (parseInt(e)+1)
    }
    /*
    shipping type: 0: ship, ko thu tien
                   1: ship, co thu tien (COD)
                   2: ship viettel post
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
      image : productList[e][19]
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
  }
}

function loadOrderListHtml() {
  data = JSON.parse(localStorage.getItem("orderList"));
  orderListDetail = JSON.parse(localStorage.getItem("orderListDetail"));
  lsOrderShipping = JSON.parse(localStorage.getItem("ordershipping"));;
  $("#listOrder").empty();
  // console.log(data);
  for(var e in data) {
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
    } if (status == 'COMPLETE') {
      if (!(data[e][8] == "PAID" && orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED")) {
        continue;
      }
    } if (status == 'READY') {
      if (data[e][9]<1) {
        continue;
      }
      if (data[e][8] == "PAID" && orderShipStatus[data[e][0]] && orderShipStatus[data[e][0]].status == "COMPLETED") {
        continue;
      };
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
    var iconShip = "";

    if (orderShipStatus[data[e][0]]) {

      if(orderShipStatus[data[e][0]].status == "COMPLETED") {
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

    var searchText = $("#orderSearchInput").val();
    var titleString = data[e][0]+' | '+data[e][2]+' | '+data[e][5];
    if (searchText) {
      if (!titleString.toUpperCase().includes(searchText.toUpperCase())){
        continue;
      }
    }

    var orderReady = "";
    if (data[e][9] == 1) {
      orderReady = "borderMustard"
    }

    ///Short description
    var orderDetailBrief="<hr/>";
    var currentOrderDetail = listOrderDetailParse[data[e][0]];
    for (o in currentOrderDetail) {
      orderDetailBrief += "<span class='"+(currentOrderDetail[o][10]==1 ? "textMustard":"")+"'>"
                        +currentOrderDetail[o][3]+" | "
                        +currentOrderDetail[o][4] 
                        +" (x "+currentOrderDetail[o][5] +")"
                        +"</span>"
                        +"<br/>";
    }
    // console.log(prodListOrder[o]);
    orderDetailBrief+=(data[e][10] ? "Note:"+data[e][10]+"<br/>" : "");
    orderDetailBrief+="Tiền hàng:"+data[e][5];
    orderDetailBrief+="<hr/>";
    ///

  	$("#listOrder").append(
      // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+data[e][0]+' | '+data[e][2]+' | '+data[e][5]+'</a>'
      '<div class="card cardElement_'+e+'">'+
        '<div class="card-header" id="heading_"'+e+'>'+
          '<h5 class="mb-0">'+
            '<button class="btn '+orderReady+' btn-link btnOrder_'+e+'" data-toggle="collapse" data-target="#collapse_'+e+'" aria-expanded="false" aria-controls="collapse_'+e+'">'+
              data[e][0]+' | '+data[e][2] + ' | '+data[e][5] + 
              iconShip +
              iconPaid +
            '</button>'+
          '</h5>'+
        '</div>'+

        '<div id="collapse_'+e+'" class="collapse" aria-labelledby="heading_'+e+'" data-parent="#listOrder">'+
          '<div class="card-body">'+
            '<select class="mdb-select md-form selectPayment selectPaymentStatus_'+e+'">'+
              optionPaid +
            '</select>'+
            '<select class="mdb-select md-form selectShip selectShipStatus_'+e+'">'+
              optionShip +
            '</select>'+
            // '<label class="mdb-main-label">Đã đặt hàng</label>'+
            // '<div class="btn orderelementdetail order_'+e+' " style="border: 1px solid black;margin-left:10px;">Báo cáo</div>'+
            // '<hr/>'+
            orderDetailBrief+
            '<div class="btn btnNormal5px orderelement order_'+e+'" >Chi tiết</div>'+
            '<div class="btn btnNormal5px deleteelement order_'+e+'" >Xoá đơn hàng</div>'+
            '<div class="btn btnNormal5px editorder order_'+e+'" >Sửa đơn hàng</div>'+
            '<br/>'+
            '<div class="btn btnNormal5px requestshipping order_'+e+'" >Yêu cầu giao hàng</div>'+
            '<div class="btn btnNormal5px splitorder order_'+e+'" >Tách đơn hàng có sẵn</div>'+
          '</div>'+
        '</div>'+
      '</div>'
      )
  }



  function removeOrderDetail(orderCode, callback){
    var numOfColumn = 5;
    // console.log("length:"+orderListDetail.length);
    var scanOrderDetail = function (index) {
      if (index < orderListDetail.length) {
        // console.log(orderListDetail[index][0] + " "+orderCode);
        if (orderListDetail[index][0] == orderCode) {
          console.log(orderListDetail[index][0]+" "+index+" <>")
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
            console.log(`${result.updatedCells} cells updated.`);
            
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
      range : "Order!A"+orderIndex+":N"+orderIndex,
      valueInputOption: "USER_ENTERED",
      resource: {
          "majorDimension": "ROWS",
          "values": [["","","","","","","","","","","","","",""]]
      }
    }).then(function(response) {
      
      var result = response.result;
      console.log(`${result.updatedCells} cells updated.`);
      
      callback();

    }, function(response) {
      appendPre('Error: ' + response.result.error.message);
    });

    
  }

  $(".deleteelement").click(function(){
    var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    console.log("delete:"+orderIndex);

    var deleteTrigger = function() {
      $("#loadingSpin").show();

      // $(".btnOrder_"+orderIndex).prop('disabled', true);
      // $("#collapse"+orderIndex).collapse();
      orderIndex = parseInt(orderIndex);
      if (orderIndex) {
        var orderCode = data[orderIndex][0];
        console.log("delete orderCode:"+orderCode);

        removeOrderDetail(orderCode,function(){
            removeOrder(orderIndex+1,function(){
              $(".cardElement_"+orderIndex).remove();
              $("#loadingSpin").hide();
            })
        })
      }
    }

    $("#modelContent").html("Bạn có chắc chắn muốn xoá không");
    $("#modalYes").click(function(){
      deleteTrigger();
    })
    $('#myModal').modal('toggle');
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
      shippingStatus : data[orderIndex][9],
      orderNode : data[orderIndex][10],
      shippingType : data[orderIndex][11],
      otherCost : data[orderIndex][12],
      prepaid : data[orderIndex][13],
      shipIndex : shipIndex,
      orderIndex : orderIndex
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
          productImage : listProductParse[orderListDetail[e][3]] ? listProductParse[orderListDetail[e][3]].image : ""
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
    window.location = "../barcode/showorder.html";
  })

  $(".splitorder").click(function(){
    var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    var currentOrder=getOrder(orderIndex);

    $("#loadingSpin").show();

    splitOrderAvailable(currentOrder,function(){
      location.reload();
    });

    // window.location = "../barcode/showorder.html";
  })

  $(".orderelementdetail").click(function(){
    
  })

  $(".editorder").click(function(){
    // console.log("AAA");
    var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    var currentOrder=getOrder(orderIndex);
    window.location = "../barcode/editorder.html"
  })

  $(".requestshipping").click(function(){
    var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    var currentOrder=getOrder(orderIndex);
    var willpay = parseFloat(currentOrder.totalPayIncludeShip) - parseFloat(currentOrder.prepaid ? currentOrder.prepaid : 0);
    console.log(currentOrder.totalPayIncludeShip);
    console.log(currentOrder.prepaid);    
    var lsBtnShip = 
    '<h5>Chọn kiểu giao hàng</h5>'+
    // '<div class="btn btnNormal5px shippingType type_0 order_'+orderIndex+'" >Ship không thu tiền</div>'+
    '<div class="btn btnNormal5px shippingType SHIPPER_NO_COD" >Shipper không thu tiền</div>'+
    '<div class="btn btnNormal5px shippingType SHIPPER_COD" >Shipper thu '+willpay+'k</div>'+
    '<div class="btn btnNormal5px shippingType POST_COD" >Ship Poste thu COD</div>'+
    '<div class="btn btnNormal5px shippingType POST_NO_COD" >Ship Poste ko COD</div>'+
    '<div class="btn btnNormal5px shippingType SHOPEE" >Ship Shopee</div>';

    $("#simpleModal .modal-content").html(lsBtnShip);
    $("#simpleModal").modal('toggle');

    $(".shippingType").click(function(){
      $("#simpleModal").modal('hide');
      console.log(orderIndex);
      console.log(willpay);
      currentOrder.shippingType =  $(this).attr("class").split(" ").pop();

      //////////
      console.log("shippingType:"+currentOrder.shippingType);
      if (currentOrder.shippingType == "POST_COD" 
        || currentOrder.shippingType == "SHOPEE"
        || currentOrder.shippingType == "POST_NO_COD" ) {
        currentOrder.otherCost = 5;
      }
      currentOrder.willpay = willpay;

      requestShipping(currentOrder);
      //////////
    });
  })

  $(".selectPayment").change(function(){
    console.log("selectPayment:");;
    var line = $(this).attr("class").split(" ").pop().split("_").pop();

    console.log("selectPayment:"+$(this).attr("class").split(" ").pop().split("_").pop())
    console.log(document.getElementsByClassName($(this).attr("class"))[0].value);
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

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    // var sheetrange = 'Task!D'+shipIndex+':E'+shipIndex;
    var sheetrange = 'Shipping!E'+shipIndex+':G'+shipIndex;

    var dataUpdateTask = [
      [value,orderShipStatus[data[orderIndex][0]].otherCost, dateTime]
    ];

    $("#loadingSpin").show();

    updateShipping(dataUpdateTask, sheetrange, function(){
      
      $("#loadingSpin").hide();

    },function(){
      console.log("Something wrong");
    })

  })

};


$(".orderFilter").change(function(){
  console.log("orderFilter:");
  orderWithProdRef = [];
  status = document.getElementsByClassName($(this).attr("class"))[0].value;
  loadOrderListHtml();
})


$("#orderSearchInput").keyup(function(){
  var searchText = $(this).val();
  console.log("search:"+searchText);
  loadOrderListHtml();
});


var url = new URL(window.location.href);
var status = "PROCESSING";

var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';
var sheetOrder = "Order";

var triggerAfterLoad = function(){

  $("#loadingSpin").show();

  loadProductList(function(){
    // console.log("1")
    loadOrderList(function(){
          // console.log("2")
      loadOrderListDetail(function(){
          $("#loadingSpin").hide();
          console.log("Gooo");
          loadOrderListHtml();
      })
    })
  })
}

function loadOrderListHtml() {
  data = JSON.parse(localStorage.getItem("orderList"));
  orderListDetail = JSON.parse(localStorage.getItem("orderListDetail"));

  $("#listOrder").empty();
  // console.log(data);
  for(e in data) {
    if (e == 0) {
      continue;
    }
    if (!data[e][0]){
      continue;
    }

    if (status == 'PROCESSING') {
      if (data[e][8] == "PAID" && data[e][9] == "SHIPPED") {
        continue;
      }
    } if (status == 'COMPLETE') {
      if (!(data[e][8] == "PAID" && data[e][9] == "SHIPPED")) {
        continue;
      }
    }

    var optionPaid;
    if (data[e][8] == "PAID") {
      optionPaid = '<option value="paid">Đã thanh toán</option>';
    } else {
      optionPaid = '<option value="unpaid">Đã đặt hàng</option><option value="paid">Đã thanh toán</option>'
    }

    var optionShip;
    if (data[e][9] == "SHIPPED") {
      optionShip = '<option value="shipped">Đã giao hàng</option>';
    } else {
      optionShip = '<option value="unshipped">Chưa giao hàng</option><option value="shipped">Đã giao hàng</option>'
    }

    var searchText = $("#orderSearchInput").val();
    var titleString = data[e][0]+' | '+data[e][2]+' | '+data[e][5];
    if (searchText) {
      if (!titleString.toUpperCase().includes(searchText.toUpperCase())){
        continue;
      }
    }

  	$("#listOrder").append(
      // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+data[e][0]+' | '+data[e][2]+' | '+data[e][5]+'</a>'
      '<div class="card cardElement_'+e+'">'+
        '<div class="card-header" id="heading_"'+e+'>'+
          '<h5 class="mb-0">'+
            '<button class="btn btn-link btnOrder_'+e+'" data-toggle="collapse" data-target="#collapse_'+e+'" aria-expanded="false" aria-controls="collapse_'+e+'">'+
              data[e][0]+' | '+data[e][2]+' | '+data[e][5] +
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
            '<div class="btn orderelement order_'+e+'" style="border: 1px solid black;margin-left:10px;">Chi tiết</div>'+
            '<div class="btn deleteelement order_'+e+'" style="border: 1px solid black;margin-left:10px;">Xoá đơn hàng</div>'+
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
            range : "OrderDetail!A"+realIndex+":F"+realIndex,
            valueInputOption: "USER_ENTERED",
            resource: {
                "majorDimension": "ROWS",
                "values": [["","","","","","","",""]]
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
      range : "Order!A"+orderIndex+":M"+orderIndex,
      valueInputOption: "USER_ENTERED",
      resource: {
          "majorDimension": "ROWS",
          "values": [["","","","","","","","","","",""]]
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

  $(".orderelement").click(function(){
    var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    // console.log($(this));
    var orderCode = data[orderIndex][0];
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
      shipIndex : data[orderIndex][11],
      emailId : data[orderIndex][12],
      orderIndex : orderIndex
    }

    var prodListOrder = {};
    var prodIndex = 0;
    for (e in orderListDetail) {
      if (orderListDetail[e][0] == orderCode){
        prodListOrder[prodIndex] = {
          productCode : orderListDetail[e][1],
          productName : orderListDetail[e][2],
          productCount : orderListDetail[e][3],
          productEstimateSellingVND : orderListDetail[e][4],
          turnover : orderListDetail[e][5],
          orderDetailIndex : e
        }
        prodIndex++;
      }
    }

    currentOrder.prodListOrder = prodListOrder;

    localStorage.setItem("currentOrder",JSON.stringify(currentOrder));

    window.location = "../barcode/showorder.html";
  })


  $(".orderelementdetail").click(function(){
    
  })

  $(".selectPayment").change(function(){
    console.log("selectPayment:");;
    var line = $(this).attr("class").split(" ").pop().split("_").pop();

    console.log("selectPayment:"+$(this).attr("class").split(" ").pop().split("_").pop())
    console.log(document.getElementsByClassName($(this).attr("class"))[0].value);
    var value = document.getElementsByClassName($(this).attr("class"))[0].value;
    
    line = parseInt(line) + 1;

    var column = 8; //for ship
    $("#loadingSpin").show();
    updateOrderStatus(line,column,value.toUpperCase(), function(){
      $("#loadingSpin").hide();
    });
  })


  $(".selectShip").change(function(){
    var line = $(this).attr("class").split(" ").pop().split("_").pop();

    console.log("selectShip:"+$(this).attr("class").split(" ").pop().split("_").pop())
    console.log(document.getElementsByClassName($(this).attr("class"))[0].value);
    var value = document.getElementsByClassName($(this).attr("class"))[0].value;
    
    line = parseInt(line) + 1;

    var column = 9; //for ship
    $("#loadingSpin").show();
    updateOrderStatus(line,column,value.toUpperCase(), function(){
      $("#loadingSpin").hide();
    });
  })

  function updateOrderStatus(line, column, value, callback) {
    var sheetrange = sheetOrder+'!'+String.fromCharCode(65+column) + line+":"+String.fromCharCode(65+column) + line;
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

};


$(".orderFilter").change(function(){
  console.log("orderFilter:");;
  status = document.getElementsByClassName($(this).attr("class"))[0].value;
  loadOrderListHtml();
})


$("#orderSearchInput").keyup(function(){
  var searchText = $(this).val();
  console.log("search:"+searchText);
  loadOrderListHtml();
});

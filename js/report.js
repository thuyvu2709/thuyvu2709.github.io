
var url = new URL(window.location.href);
var status = "PROCESSING";

var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';
var sheetOrder = "Order";

// var orderList = [];

var triggerAfterLoad = function(){

  $("#loadingSpin").show();

  loadReport(function(){
      console.log("Gooo");
      loadReportHtml();
      loadOrderList(function(){
        loadOrderListDetail(function(){
          $("#loadingSpin").hide();
          parseOrderDetail();
          parseOrder();
          // orderList = JSON.parse(localStorage.getItem("orderList"));
          var todayRaw  = new Date();
          var today = todayRaw.getFullYear()+"/"+(new Date().getMonth()+1)+"/"+new Date().getDate();
          console.log(today);

          reportByDate(today,today);
        })
      })
  })
}

function loadReportHtml() {
  data = JSON.parse(localStorage.getItem("report"));
  
  var totalCurrentProfit = parseInt(data[0][1]);
  var totalTurnover =  parseInt(data[1][1]);
  var totalExpectProfit = parseInt(data[2][1]);
  var totalPay =  parseInt(data[3][1]);

  var totalNumOfRestProduct = parseInt(data[4][1]);
  var totalPayForRestProduct = parseInt(data[5][1]);  

  var breakevenPoint = parseInt(totalPay - totalTurnover);

  $(".totalCurrentProfit").html("Tổng lãi hiện tại: "+totalCurrentProfit);
  $(".totalTurnover").html("Tổng doanh thu: "+totalTurnover);
  $(".totalExpectProfit").html("Tổng lãi dự kiến: "+totalExpectProfit);
  $(".totalPay").html("Tổng tiền vốn: "+totalPay);

  $(".totalNumOfRestProduct").html("Tổng số hàng tồn: "+totalNumOfRestProduct);
  $(".totalPayForRestProduct").html("Tổng tiền vốn cho hàng tồn: "+totalPayForRestProduct);


  if (breakevenPoint > 0)  {
    $(".breakevenPoint").html("Mục tiêu đến điểm hoà vốn: "+breakevenPoint);
  } else {
    $(".breakevenPoint").html("Bạn đã vượt qua điểm hoà vốn");
  }
};

var listOrderParse;

function parseOrder(){
  listOrderParse = {};
  // var totalProfitAll = 0;
  var orderList = JSON.parse(localStorage.getItem("orderList"));
  for (var e in orderList) {
    if (!orderList[e][0]){
      continue;
    }
    if (!listOrderParse[orderList[e][0]]) {
      listOrderParse[orderList[e][0]] = [];
    }
    var lsProduct = listOrderDetailParse[orderList[e][0]];
    var totalProfitInOrder = 0;
    var numOfItem = 0;
    var totalPay = 0;
    for (var f in lsProduct) {
      // if (lsProduct[f][9]==NaN || lsProduct[f][9]=="NaN") {
      //   continue;
      // }
      var currProfit = parseInt(lsProduct[f][9].replace(",",""));
      if (isNaN(currProfit)) {
        continue;
      }
      // console.log(currProfit + " "+(isNaN(currProfit)))
      // console.log(orderList[e][0]+" "+lsProduct[f][9]+" "+parseInt(lsProduct[f][9].replace(",","")))
      totalProfitInOrder = totalProfitInOrder + currProfit;
      numOfItem += parseInt(lsProduct[f][5]);
      totalPay += parseInt(lsProduct[f][7]);
    }
    // totalProfitAll = totalProfitAll + totalProfitInOrder;
    // console.log(totalProfitAll + " "+totalProfitInOrder);

    listOrderParse[orderList[e][0]] = {
      orderCode : orderList[e][0],
      date : orderList[e][1],
      orderOwner : orderList[e][2],
      totalProfit : totalProfitInOrder,
      numOfItem : numOfItem,
      totalPay : totalPay
    }
  }
  // console.log(listOrderParse);
  // console.log(totalProfitAll);
}

var listOrderDetailParse;

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

var chosenStartDate;
var chosenEndDate;

function reportByDate(startDateStr, endDateStr) {
  var startDate = new Date(startDateStr);
  var endDate = new Date(endDateStr);
  // console.log("reportByDate:"+startDateStr+" "+endDateStr)
  var totalProfit = 0;
  var numOfItem = 0;
  var totalPay = 0;
  var numOfOrder = 0;
  for (var e in listOrderParse) {
      var orderDateRaw = new Date(listOrderParse[e].date);
      var orderDate = new Date(orderDateRaw.getFullYear(), orderDateRaw.getMonth(), orderDateRaw.getDate())
      // console.log(orderDate + " " + startDate +" " + (startDate<=orderDate) +" " +(orderDate <= endDate))
      if (startDate<=orderDate && orderDate <= endDate){
        totalProfit += listOrderParse[e].totalProfit;
        numOfItem += listOrderParse[e].numOfItem;
        totalPay += listOrderParse[e].totalPay;
        numOfOrder += 1;
        // console.log(listOrderParse[e])
      }
  }
  $(".reportByDate").html("<div>Tổng lãi:"+totalProfit+"</div>"+
    "<div>Tổng số mặt hàng:"+numOfItem+"</div>"+
    "<div>Tổng số đơn hàng:"+numOfOrder+"</div>"+
    "<div>Tổng doanh thu:"+totalPay+"</div>"+
    "<div class='btn btnNormal5px showOrderByDate'>Xem đơn hàng</div>"
    )
  chosenStartDate = startDateStr;
  chosenEndDate = endDateStr;
  $(".showOrderByDate").click(function(){
    window.location = "listorder.html?startDate="+chosenStartDate+"&endDate="+chosenEndDate;
    // http://localhost:3000/thuyvu2709.github.io/manager/listorder.html?startDate=2020-07-02&endDate=2020-07-03
    // http://localhost:3000/thuyvu2709.github.io/manager/listorder.html?startDate=2020-07-02&endDate=2020-07-02
  })
}


//DatePicker Example
// Ref: https://www.daterangepicker.com
$('.datetimepicker').daterangepicker({
  }, function(start, end, label) {
    console.log("A new date selection was made: " + start.format('YYYY/MM/DD') + ' to ' + end.format('YYYY/MM/DD'));
    reportByDate(start.format('YYYY/MM/DD'),end.format('YYYY/MM/DD'));
  });

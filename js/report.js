
var url = new URL(window.location.href);
var status = "PROCESSING";

var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';
var sheetOrder = "Order";

var triggerAfterLoad = function(){

  // $("#loadingSpin").show();

  // loadReport(function(){
  //     $("#loadingSpin").hide();
  //     console.log("Gooo");
  loadReportHtml();
  // })
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
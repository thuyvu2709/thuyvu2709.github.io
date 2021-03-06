var triggerAfterLoad = function(){
  $("#loadingSpin").show();
  loadBSCCoin(function(){
    // console.log(JSON.parse(localStorage.getItem("BSCCoin")))
    loadBSCTransaction(function(){
      $("#loadingSpin").hide();
      console.log("Gooo");
      loadBSCTransactionHMTL();
    })
  })
}

var coins = []
var transaction = []

var numOfDecimal = 5;

$("#addCoin").click(addCoin)

$("#coinSearchInput").change(function(){
  loadBSCTransactionHMTL();
});

function loadBSCTransactionHMTL() {
  coins = JSON.parse(localStorage.getItem("BSCCoin"));
  transaction = JSON.parse(localStorage.getItem("BSCTransaction"));
  // console.log(coins)
  // console.log(transaction)

  $("#listBSC").empty();
  // console.log(data);
  var totalPay = 0;
  for(var e in coins) {
    if (e==0 || !coins[e][0]) {
      continue;
    }

    var coinName = coins[e][0];

    if ($("#coinSearchInput").val()) {
      if (!coinName.toUpperCase().includes($("#coinSearchInput").val().toUpperCase())){
        continue;
      }
    }

    var cardBody = "<table class='txBscTbl'> <tr> <th>No</th> <th>Giá</th> <th>SL</th> <th>Tổng</th> <th>Thời gian</th> <th>Sửa</th></tr><tbody> "
    var txCount =0;
    for(var et in transaction) {
      if (transaction[et][0] == coinName) {
        txCount=txCount+1
        var txCoinCount = parseFloat(transaction[et][2]);

        if (txCoinCount > 0) {
          cardBody=cardBody + "<tr> ";
        } else {
          cardBody=cardBody + "<tr class='rowRed'> ";          
        }
        cardBody=cardBody +
          "<td>"+txCount+"</td>"+
          "<td>"+parseFloat(transaction[et][1]).toFixed(numOfDecimal)+"</td>"+
          "<td>"+txCoinCount.toFixed(numOfDecimal)+"</td>"+
          "<td>"+parseFloat(transaction[et][3]).toFixed(numOfDecimal)+"</td>"+
          "<td>"+(transaction[et][4] ? transaction[et][4] :"")+"</td>"+
          "<td><i class='fas fa-edit editTX editTX_"+et+"'></i></td>"+
          "</tr>";

        totalPay = totalPay + parseFloat(transaction[et][3]);
      }
    }
    cardBody = cardBody + "</tbody> </table><br/>";
    // console.log(coins[e][4])
    // console.log(coins[e][4] != "0" && coins[e][4])
    cardBody = cardBody + 
      "• <span class='btn btn-default btnNormal addTX addTX_"+e+"'>Thêm giao dịch</span></br>"+
      "<span>• Giá mua trung bình:"+parseFloat(coins[e][3]).toFixed(numOfDecimal)+" USD</span></br>"+
      "<span>• Tổng tiền thanh toán:"+parseFloat(coins[e][2]).toFixed(numOfDecimal)+" USD</span></br>"+
      "<span>• Tổng số token:"+parseFloat(coins[e][1]).toFixed(numOfDecimal)+" Token</span></br>"+
      (coins[e][4] != "0" && coins[e][4] ? "<span>• Địa chỉ token:"+coins[e][4]+"</span></br>" : "");

  	$("#listBSC").append(
      // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+data[e][0]+' | '+data[e][2]+' | '+data[e][5]+'</a>'
      '<div class="card cardElement_'+e+'">'+
        '<div class="card-header" id="heading_"'+e+'>'+
          '<h5 class="mb-0">'+
            '<button class="btn btn-link btnOrder_'+e+'" data-toggle="collapse" data-target="#collapse_'+e+'" aria-expanded="false" aria-controls="collapse_'+e+'">'+
              coins[e][0]+' | '+parseFloat(coins[e][3]).toFixed(numOfDecimal) + ' | ' + parseFloat(coins[e][2]).toFixed(numOfDecimal) + " USD "+
            '</button>'+
          '</h5>'+
        '</div>'+

        '<div id="collapse_'+e+'" class="collapse" aria-labelledby="heading_'+e+'" data-parent="#listBSC">'+
          '<div class="card-body">'+
            cardBody +
          '</div>'+
        '</div>'+
      '</div>'
      )
  }
  $(".addTX").click(addTransaction)
  $(".editTX").click(editTransaction)
  $("#note").html("Tổng tiền đã thanh toán:"+totalPay.toFixed(numOfDecimal)+" USD");
  addSortableColumns();
};

function editTransaction(){
  var txIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  txData = transaction[txIndex]

  var modalBody = '<h3>Thông tin giao dịch của '+txData[0]+'</h3><br/>'+
              '<span>Giá:</span><br/>'+
              '<span class="btn btn-default btnNormal">'+
              ' <input class="txPrice" value="'+txData[1]+'"/>'+
              '</span><br/>'+
              '<span>Số lượng:</span><br/>'+
              '<span class="btn btn-default btnNormal">'+
              ' <input class="txCount" value="'+txData[2]+'"/>'+
              '</span><br/>'+
              '<span>Ngày:</span><br/>'+
              '<span class="btn btn-default btnNormal">'+
              ' <input class="txDate" value=""/>'+
              '</span><br/>'+
              "<span class='btn btn-default btnNormal editFnTX editFnTX_"+txIndex+"'>Sửa giao dịch</span>"+
              "<span class='btn btn-default textRed btnNormal delFnTX delFnTX_"+txIndex+"'>Xoá giao dịch</span></br>"+

              '<br/>'
              ;
  $("#myModal .modal-body").html(modalBody);

  $('#myModal').modal('toggle');

  $('.txDate').daterangepicker({
      singleDatePicker: true,
  }, function(start, end, label) {
    console.log("A new date selection was made: " + start.format('YYYY/MM/DD'));
  });

  if (txData[4]){
    $('.txDate').val(txData[4])
  }

  $(".editFnTX").click(editFnTX);
  $(".delFnTX").click(delFnTX);

}


function editFnTX() {
    $("#loadingSpin").show();

    var txIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    txData = transaction[txIndex]

    var actualIndexInSheet = parseInt(txIndex) +1;
    var range = "Transaction!A"+actualIndexInSheet+":E"+actualIndexInSheet;

    // console.log($(".txPrice").val())
    var data = [
      [txData[0],$(".txPrice").val(),$(".txCount").val(),"=INDIRECT(ADDRESS(ROW(),3))*INDIRECT(ADDRESS(ROW(),2))",$(".txDate").val()]
    ]
    // console.log(data);
    // console.log(bscSheet);
    editCommonData(bscSheet,data, range,function(){
      $("#loadingSpin").hide();
      $('#myModal').modal('hide');
    })
}

function delFnTX() {
    $("#loadingSpin").show();

    var txIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    txData = transaction[txIndex]

    var actualIndexInSheet = parseInt(txIndex) +1;
    var range = "Transaction!A"+actualIndexInSheet+":E"+actualIndexInSheet;

    // console.log($(".txPrice").val())
    var data = [
      ["","","","",""]
    ]
    // console.log(data);
    // console.log(bscSheet);
    editCommonData(bscSheet,data, range,function(){
      $("#loadingSpin").hide();
      $('#myModal').modal('hide');
    })
}

function addTransaction(){
  var coinIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  coinData = coins[coinIndex]

  var modalBody = '<h3>Thêm giao dịch của '+coinData[0]+'</h3><br/>'+
              '<span>Giá:</span><br/>'+
              '<span class="btn btn-default btnNormal">'+
              ' <input class="txPrice" value=""/>'+
              '</span><br/>'+
              '<span>Số lượng:</span><br/>'+
              '<span class="btn btn-default btnNormal">'+
              ' <input class="txCount" value=""/>'+
              '</span><br/>'+
              '<span>Ngày:</span><br/>'+
              '<span class="btn btn-default btnNormal">'+
              ' <input class="txDate" value=""/>'+
              '</span><br/>'+
              "<span class='btn btn-default btnNormal addFnTX addFnTX_"+coinIndex+"'>Thêm giao dịch</span></br>"+
              '<br/>'
              ;
  $("#myModal .modal-body").html(modalBody);

  $('#myModal').modal('toggle');

// Ref: https://www.daterangepicker.com
  $('.txDate').daterangepicker({
        singleDatePicker: true,
    }, function(start, end, label) {
      console.log("A new date selection was made: " + start.format('YYYY/MM/DD'));
    });

  $(".addFnTX").click(addFnTX);
}

function addFnTX() {
    $("#loadingSpin").show();

    var coinIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    coinData = coins[coinIndex]

    var range = "Transaction!A:E";

    // console.log($(".txPrice").val())
    var data = [
      [coinData[0],$(".txPrice").val(),$(".txCount").val(),"=INDIRECT(ADDRESS(ROW(),3))*INDIRECT(ADDRESS(ROW(),2))",$(".txDate").val()]
    ]
    // console.log(data);
    // console.log(bscSheet);
    addCommonData(bscSheet,data, range,function(){
      $("#loadingSpin").hide();
      $('#myModal').modal('hide');
    })
}

function addCoin(){

  var modalBody = '<h3>Thêm thông tin coin</h3><br/>'+
              '<span>Tên coin:</span><br/>'+
              '<span class="btn btn-default btnNormal">'+
              ' <input class="coinName" value=""/>'+
              '</span><br/>'+
              '<span>Địa chỉ token:</span><br/>'+
              '<span class="btn btn-default btnNormal">'+
              ' <input class="coinAddress" value=""/>'+
              '</span><br/>'+
              "<span class='btn btn-default btnNormal addFnCoin'>Thêm Coin</span></br>"+
              '<br/>'
              ;
  $("#myModal .modal-body").html(modalBody);

  $('#myModal').modal('toggle');

  $(".addFnCoin").click(addFnCoin);
}

function addFnCoin() {
  $("#loadingSpin").show();

  var range = "Coin!A:E";

  var data = [
    [$(".coinName").val(),
     "=sumif(Transaction!A:A,INDIRECT(ADDRESS(ROW(),1)),Transaction!C:C)",
     "=sumif(Transaction!A:A,INDIRECT(ADDRESS(ROW(),1)),Transaction!D:D)",
     "=INDIRECT(ADDRESS(ROW(),3))/INDIRECT(ADDRESS(ROW(),2))",
     $(".coinAddress").val()]
  ]
  // console.log(data);
  // console.log(bscSheet);
  addCommonData(bscSheet,data, range,function(){
    $("#loadingSpin").hide();
    $('#myModal').modal('hide');
  })
}

function addSortableColumns() {
  // Ref: https://jsfiddle.net/spetnik/gFzCk/1953/

  $('th')
    .wrapInner('<span title="sort this column"/>')
    .each(function(){

        var th = $(this),
            thIndex = th.index(),
            inverse = false;

        var table = th.parent().parent().parent();

        th.click(function(){

            table.find('td').filter(function(){

                return $(this).index() === thIndex;

            }).sortElements(function(a, b){

                if( $.text([a]) == $.text([b]) )
                    return 0;

                return $.text([a]) > $.text([b]) ?
                    inverse ? -1 : 1
                    : inverse ? 1 : -1;

            }, function(){

                // parentNode is the element we want to move
                return this.parentNode; 

            });

            inverse = !inverse;

        });

    });
}
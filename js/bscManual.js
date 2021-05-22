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

function loadBSCTransactionHMTL() {
  var coins = JSON.parse(localStorage.getItem("BSCCoin"));
  var transaction = JSON.parse(localStorage.getItem("BSCTransaction"));
  // console.log(coins)
  // console.log(transaction)

  $("#listBSC").empty();
  // console.log(data);
  for(var e in coins) {
    if (e==0) {
      continue;
    }

    var coinName = coins[e][0];

    var cardBody = "<table class='txBscTbl'> <tr> <th>STT</th> <th>Giá</th> <th>SL</th> <th>Tổng</th> </tr> <tbody> "
    var txCount =0;
    for(var et in transaction) {
      if (transaction[et][0] == coinName) {
        txCount=txCount+1
        cardBody=cardBody + "<tr> <td>"+txCount+"</td><td>"+parseFloat(transaction[et][1]).toFixed(2)+"</td><td>"+parseFloat(transaction[et][2]).toFixed(2)+"</td><td>"+parseFloat(transaction[et][3]).toFixed(2)+"</td>  </tr>"
      }
    }
    cardBody = cardBody + "</tbody> </table>";

    // "<span>- USD lúc mua token:"+data[e].usdAmount+"</span></br>"+
    // "<span>- Giá token lúc mua:"+parseFloat(data[e].tokenPrice).toFixed(15)+"</span></br>"+
    // "<span>- USD hiện tại:"+parseFloat(data[e].currentUSDAmount).toFixed(2)+"</span></br>"+
    // "<span>- Giá token hiện tại:"+parseFloat(data[e].currentTokenPrice).toFixed(15)+"</span></br>"+
    // "<span>- Số lượng token:"+data[e].tokenAmount+"</span></br>"+
    // "<span>- Địa chỉ contract:"+data[e].tokenAddress+"</span></br>"+
    // "<span>- Thời gian mua:"+data[e].executionTime+"</span></br>"+
    // "<span>- USD lãi:"+parseFloat(data[e].gainUSD).toFixed(2)+"</span></br>"+
    // "<span>- USD % lãi:"+data[e].gainUSDRate+"</span></br>"+
    // "<span>- Cập nhật cuối:"+priceLastToUpdate+" s </span></br>"+
    // "<span><a href='https://poocoin.app/tokens/"+data[e].tokenAddress+"'>Xem chart</a></span></br>"+
    // "<span>"+
    // "   <input class='alertUpper alertUpper_"+e+"' value='"+alertUpper+"'>"+
    // "   <div class='btn btn-default btnNormal editAlertUpper editAlertUpper_"+e+"'>Sửa Upper</div>"+
    // "</span><br/>"+
    // "<span>"+
    // "   <input class='alertLower alertLower_"+e+"' value='"+alertLower+"'>"+
    // "   <div class='btn btn-default btnNormal editAlertLower editAlertLower_"+e+"'>Sửa Lower</div>"+
    // "</span>";

  	$("#listBSC").append(
      // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+data[e][0]+' | '+data[e][2]+' | '+data[e][5]+'</a>'
      '<div class="card cardElement_'+e+'">'+
        '<div class="card-header" id="heading_"'+e+'>'+
          '<h5 class="mb-0">'+
            '<button class="btn btn-link btnOrder_'+e+'" data-toggle="collapse" data-target="#collapse_'+e+'" aria-expanded="false" aria-controls="collapse_'+e+'">'+
              coins[e][0]+' | '+parseFloat(coins[e][3]).toFixed(2) + ' | ' + parseFloat(coins[e][2]).toFixed(2) + " USD "+
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
  $(".editAlertUpper").click(fnEditAlertUpper)
  $(".editAlertLower").click(fnEditAlertLower)

};

function fnEditAlertUpper() {
  var tokenIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  tokenIndex = parseInt(tokenIndex);
  console.log(data[tokenIndex])
  alertUpper = $(".alertUpper_"+tokenIndex).val()
  $.ajax({
    url: "https://bscaddress.herokuapp.com/setalertupper/"+data[tokenIndex].txAddress+"/"+alertUpper,
    success: function(res) {
      console.log(res)
        $("#myModal .modal-body").html("Đã cập nhật xong");
        $('#myModal').modal('toggle');
    }
  });
}

function fnEditAlertLower() {
  var tokenIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  tokenIndex = parseInt(tokenIndex);
  console.log(data[tokenIndex])
  alertUpper = $(".alertLower_"+tokenIndex).val()
  $.ajax({
    url: "https://bscaddress.herokuapp.com/setalertlower/"+data[tokenIndex].txAddress+"/"+alertUpper,
    success: function(res) {
      console.log(res)
        $("#myModal .modal-body").html("Đã cập nhật xong");
        $('#myModal').modal('toggle');
    }
  });
}


function loadBSCToken(response) {
  data = response.tokens;
  var lastUpdate = response.last
  var timeAfterLast = (parseFloat(response.timeAfterLast) / (1000*60)).toFixed(1)
  $("#infor").html("Cập nhật lần cuối:"+timeAfterLast+" phút trước")
  $("#listBSC").empty();
  // console.log(data);
  for(var e in data) {
    

    priceLastToUpdate = parseFloat(data[e].priceLastToUpdate) % 1000;

    var cardBody = 
    "<span>- USD lúc mua token:"+data[e].usdAmount+"</span></br>"+
    "<span>- Giá token lúc mua cuối:"+parseFloat(data[e].tokenPriceAtBuyingTime).toFixed(15)+"</span></br>"+
    "<span>- USD hiện tại:"+parseFloat(data[e].currentUSDAmount).toFixed(2)+"</span></br>"+
    "<span>- Giá token hiện tại:"+parseFloat(data[e].tokenPriceNow).toFixed(15)+"</span></br>"+
    "<span>- Số lượng token:"+data[e].tokenAmount+"</span></br>"+
    "<span>- Địa chỉ contract:"+data[e].tokenAddress+"</span></br>"+
    "<span>- Lần mua cuối:"+data[e].executionTime+"</span></br>"+
    "<span>- USD lãi:"+parseFloat(data[e].gainUSD).toFixed(2)+"</span></br>"+
    "<span>- USD % lãi:"+data[e].gainUSDRate+"</span></br>"+
    "<span>- Cập nhật cuối:"+priceLastToUpdate+" s </span></br>"+
    "<span><a href='https://poocoin.app/tokens/"+data[e].tokenAddress+"'>Xem chart</a></span>";

    txLive = data[e].priceSource == "web3" ? "| Live" : "";

    $("#listBSC").append(
      // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+data[e][0]+' | '+data[e][2]+' | '+data[e][5]+'</a>'
      '<div class="card cardElement_'+e+'">'+
        '<div class="card-header" id="heading_"'+e+'>'+
          '<h5 class="mb-0">'+
            '<button class="btn btn-link btnOrder_'+e+'" data-toggle="collapse" data-target="#collapse_'+e+'" aria-expanded="false" aria-controls="collapse_'+e+'">'+
              data[e].tokenName+' | '+parseFloat(data[e].currentUSDAmount).toFixed(2) + ' USD | '+data[e].gainUSDRate+' % '+ txLive +
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
  $(".editAlertUpper").click(fnEditAlertUpper)
  $(".editAlertLower").click(fnEditAlertLower)

};
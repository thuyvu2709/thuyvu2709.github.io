function loadWarehouse(callback) {
  $.ajax({
    url: "https://kenkreck1004.herokuapp.com/https://bscaddress.herokuapp.com/lastupdate",
    success: function(res) {
      console.log(res)
      callback(res);
    }
  });
}

$("#loadingSpin").show();

loadWarehouse(function(response){
  $("#loadingSpin").hide();
  console.log("Gooo");
  loadWarehouseHtml(response);
})

function loadWarehouseHtml(response) {
  var data = response.tx;
  var lastUpdate = response.last
  $("#listBSC").empty();
  // console.log(data);
  for(var e in data) {
    var cardBody = "<p>bnbAmount:"+data[e].bnbAmount+"</p></br>"+
    "<p>usdAmount:"+data[e].usdAmount+"</p></br>"+
    "<p>tokenAmount:"+data[e].tokenAmount+"</p></br>"+
    "<p>tokenName:"+data[e].tokenName+"</p></br>"+
    "<p>tokenAddress:"+data[e].tokenAddress+"</p></br>"+
    "<p>bnbPrice:"+data[e].bnbPrice+"</p></br>"+
    "<p>tokenPrice:"+data[e].tokenPrice+"</p></br>"+
    "<p>executionTime:"+data[e].executionTime+"</p></br>"+
    "<p>currentTokenPrice:"+data[e].currentTokenPrice+"</p></br>"+
    "<p>gainUSD:"+data[e].gainUSD+"</p></br>"+
    "<p>gainUSDRate:"+data[e].gainUSDRate+"</p></br>"+
    "<p>currentUSDAmount:"+data[e].currentUSDAmount+"</p></br>";

  	$("#listBSC").append(
      // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+data[e][0]+' | '+data[e][2]+' | '+data[e][5]+'</a>'
      '<div class="card cardElement_'+e+'">'+
        '<div class="card-header" id="heading_"'+e+'>'+
          '<h5 class="mb-0">'+
            '<button class="btn btn-link btnOrder_'+e+'" data-toggle="collapse" data-target="#collapse_'+e+'" aria-expanded="false" aria-controls="collapse_'+e+'">'+
              data[e].tokenName+' | '+data[e].gainUSDRate +
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
};
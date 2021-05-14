$("#headerInclude").load("../common/header.html");

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
    var cardBody = 
    "<span>USD lúc mua token:"+data[e].usdAmount+"</span></br>"+
    "<span>Giá token lúc mua:"+data[e].tokenPrice+"</span></br>"+
    "<span>USD hiện tại:"+data[e].currentUSDAmount+"</span></br>"+
    "<span>Giá token hiện tại:"+data[e].currentTokenPrice+"</span></br>"+
    "<span>Số lượng token:"+data[e].tokenAmount+"</span></br>"+
    "<span>Địa chỉ contract:"+data[e].tokenAddress+"</span></br>"+
    "<span>Thời gian mua:"+data[e].executionTime+"</span></br>"+
    "<span>USD lãi:"+data[e].gainUSD+"</span></br>"+
    "<span>USD % lãi:"+data[e].gainUSDRate+"</span>";

  	$("#listBSC").append(
      // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+data[e][0]+' | '+data[e][2]+' | '+data[e][5]+'</a>'
      '<div class="card cardElement_'+e+'">'+
        '<div class="card-header" id="heading_"'+e+'>'+
          '<h5 class="mb-0">'+
            '<button class="btn btn-link btnOrder_'+e+'" data-toggle="collapse" data-target="#collapse_'+e+'" aria-expanded="false" aria-controls="collapse_'+e+'">'+
              data[e].tokenName+' | '+parseFloat(data[e].currentUSDAmount).toFixed(2) + ' USD | '+data[e].gainUSDRate+' % '+
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
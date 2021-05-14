$("#headerInclude").load("../common/header.html");

function loadWarehouse(callback) {
  $.ajax({
    url: "https://bscaddress.herokuapp.com/lastupdate",
    success: function(res) {
      // console.log(res)
      callback(res);
    }
  });
}

$("#forceFetch").click(function(){
  $.ajax({
    url: "https://bscaddress.herokuapp.com/forceupdate",
    success: function(res) {
      // console.log(res)
      callback(res);
    }
  });
})

$("#loadingSpin").show();

loadWarehouse(function(response){
  $("#loadingSpin").hide();
  console.log("Gooo");
  loadWarehouseHtml(response);
})

var data;

function loadWarehouseHtml(response) {
  data = response.tx;
  var lastUpdate = response.last
  var timeAfterLast = (parseFloat(response.timeAfterLast) / (1000*60)).toFixed(1)
  $("#infor").html("Cập nhật lần cuối:"+timeAfterLast+" phút trước")
  $("#listBSC").empty();
  // console.log(data);
  for(var e in data) {
    alertUpper = parseFloat(data[e].alertUpper || 0);
    alertLower = parseFloat(data[e].alertLower || 0);

    var cardBody = 
    "<span>- USD lúc mua token:"+data[e].usdAmount+"</span></br>"+
    "<span>- Giá token lúc mua:"+parseFloat(data[e].tokenPrice).toFixed(10)+"</span></br>"+
    "<span>- USD hiện tại:"+parseFloat(data[e].currentUSDAmount).toFixed(2)+"</span></br>"+
    "<span>- Giá token hiện tại:"+parseFloat(data[e].currentTokenPrice).toFixed(10)+"</span></br>"+
    "<span>- Số lượng token:"+data[e].tokenAmount+"</span></br>"+
    "<span>- Địa chỉ contract:"+data[e].tokenAddress+"</span></br>"+
    "<span>- Thời gian mua:"+data[e].executionTime+"</span></br>"+
    "<span>- USD lãi:"+parseFloat(data[e].gainUSD).toFixed(2)+"</span></br>"+
    "<span>- USD % lãi:"+data[e].gainUSDRate+"</span></br>"+
    "<span><a href='https://poocoin.app/tokens/"+data[e].tokenAddress+"'>Xem chart</a></span></br>"+
    "<span>"+
    "   <input class='alertUpper alertUpper_"+e+"' value='"+alertUpper+"'>"+
    "   <div class='btn btn-default btnNormal editAlertUpper editAlertUpper_"+e+"'>Sửa Upper</div>"+
    "</span><br/>"+
    "<span>"+
    "   <input class='alertLower alertLower_"+e+"' value='"+alertLower+"'>"+
    "   <div class='btn btn-default btnNormal editAlertLower editAlertLower_"+e+"'>Sửa Lower</div>"+
    "</span>";


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
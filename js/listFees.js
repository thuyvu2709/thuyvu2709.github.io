
var otherFeeData;
var username;
// var triggerAfterLoad = function(){

//   $("#loadingSpin").show();

//   loadOtherFee(function(){
//     $("#loadingSpin").hide();
//     convertUserName();  
//     console.log("Gooo");
//     loadOtherFeeHtml();
//   })
// }

$(".text-center").click(function(){
  // triggerAfterLoadx();
  convertUserName();  
  console.log("Gooo");
  loadOtherFeeHtml();
})

function convertUserName(){
  var roles = JSON.parse(localStorage.getItem("roles"));
  username = []
  for (var e in roles) {
    username[roles[e][0]] = {
      role : roles[e][1],
      name : roles[e][2]
    }
  }
}

function loadOtherFeeHtml() {
  data = JSON.parse(localStorage.getItem("otherFees"));
  otherFeeData = data;
  $("#listFees").empty();
  // console.log(data);
  for(e in data) {
    if (e == 0) {
      continue;
    }
    if (!data[e][0]){
      continue;
    }

  	$("#listFees").append(
      // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+data[e][0]+' | '+data[e][2]+' | '+data[e][5]+'</a>'
      '<div class="card cardElement_'+e+'">'+
        '<div class="card-header" id="heading_"'+e+'>'+
          '<h5 class="mb-0">'+
            '<button class="btn btn-link btnOrder_'+e+'" data-toggle="collapse" data-target="#collapse_'+e+'" aria-expanded="false" aria-controls="collapse_'+e+'">'+
              parseDate(data[e][0]).monthyear+' | '+data[e][2] + ' - '+username[data[e][4]].name +
            '</button>'+
          '</h5>'+
        '</div>'+

        '<div id="collapse_'+e+'" class="collapse" aria-labelledby="heading_'+e+'" data-parent="#listFees">'+
          '<div class="card-body">'+
            'Thời gian: '+data[e][0]+'<br/>'+
            'Tên chi phí: '+data[e][1]+'<br/>'+
            'Số tiền: '+data[e][2]+'<br/>'+
            'Nội dung: '+data[e][3]+'<br/>'+
            'Nhân viên: '+username[data[e][4]].name+'<br/>'+
            'Nhiệm vụ: '+username[data[e][4]].role+'<br/>'+
            'Email: '+data[e][4]+'<br/>'+
            '<hr/>'+
            '<div class="btn btn-default btnNormal editFee_'+e+'" >Sửa</div>'+
            '<div class="btn btn-default btnNormal deleteFee_'+e+'" >Sửa</div>'+

          '</div>'+
        '</div>'+
      '</div>'
      )

    $(".editFee_"+e).click(editOtherFee);
    $(".deleteFee_"+e).click(deleteOtherFee);

  }
};

function editOtherFee() {
  var feeIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  feeIndex = parseInt(feeIndex);
  var realIndex = feeIndex + 1;
  var currentFee = {
    feeIndex : realIndex,
    feeTime : otherFeeData[feeIndex][0],
    feeName : otherFeeData[feeIndex][1],
    feeCost : otherFeeData[feeIndex][2],
    feeContent : otherFeeData[feeIndex][3],
    employeeName : username[otherFeeData[feeIndex][4]].name,
    employeeId : otherFeeData[feeIndex][4]
  }

  localStorage.setItem("currentFee",JSON.stringify(currentFee));
  window.location = "editOtherFees.html";
}

function deleteOtherFee() {
  var feeIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  feeIndex = parseInt(feeIndex);
  var realIndex = feeIndex + 1;

  var numOfColumnOtherFee = 4;
  var sheetrange = 'otherFees!A'+feeIndex+':'+ String.fromCharCode(65+numOfColumnOtherFee)+''+feeIndex;
  var data= [
    ["","","","",""]
  ]
  editDataInSheet(mainSheetForProduct, sheetrange, data,
        function() {
          console.log("remove fee")
        }, function(response) {
            // appendPre('Error: ' + response.result.error.message);
            console.log("some thing wrong");
        });
}
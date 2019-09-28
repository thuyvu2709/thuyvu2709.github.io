
var otherFeeData;
var username;
var triggerAfterLoad = function(){

  $("#loadingSpin").show();

  loadOtherFee(function(){
    $("#loadingSpin").hide();
    convertUserName();  
    console.log("Gooo");
    loadOtherFeeHtml();
  })
}

// $(".text-center").click(function(){
//   loadotherFee(function(){
//     console.log("Gooo");
//     loadotherFeeHtml();
//   })
// })

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
              parseDate(data[e][0]).monthyear+' | '+data[e][2] + ' - '+username[data[e][4]].name
            '</button>'+
          '</h5>'+
        '</div>'+

        '<div id="collapse_'+e+'" class="collapse" aria-labelledby="heading_'+e+'" data-parent="#listSchedule">'+
          '<div class="card-body">'+
            'Thời gian: '+data[e][0]+'<br/>'+
            'Tên chi phí: '+data[e][1]+'<br/>'+
            'Loại chi phí: '+data[e][2]+'<br/>'+
            'Nhân viên: '+data[e][3]+'<br/>'+

            '<hr/>'+
            '<div class="btn btn-default btnNormal editWH_'+e+'" >Sửa</div>'+
          '</div>'+
        '</div>'+
      '</div>'
      )

    $(".checkImport_"+e).click(requestToCheckProducts);
    $(".editWH_"+e).click(editotherFee);
  }
};

function editOtherFee() {
  var importIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var realIndex = parseInt(importIndex) - 1;
  var currentImport = {
    importIndex : realIndex,
    importCode : otherFeeData[importIndex][0],
    importName : otherFeeData[importIndex][1],
    importStatus : otherFeeData[importIndex][2],
    importShippingFee : otherFeeData[importIndex][3]
  }

  localStorage.setItem("currentImport",JSON.stringify(currentImport));
  window.location = "editImportSchedule.html";
}
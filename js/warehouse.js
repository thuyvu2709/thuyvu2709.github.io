
var warehouseData;
var triggerAfterLoad = function(){

  $("#loadingSpin").show();

  loadWarehouse(function(){
    $("#loadingSpin").hide();
    console.log("Gooo");
    loadWarehouseHtml();
  })
}

// $(".text-center").click(function(){
//   loadWarehouse(function(){
//     console.log("Gooo");
//     loadWarehouseHtml();
//   })
// })

function loadWarehouseHtml() {
  data = JSON.parse(localStorage.getItem("warehouse"));
  warehouseData = data;
  $("#listSchedule").empty();
  // console.log(data);
  for(e in data) {
    if (e == 0) {
      continue;
    }
    if (!data[e][0]){
      continue;
    }

    var scheduleStatus = data[e][2];
    var cardBody = "";
    if (scheduleStatus == 0) {
      cardBody = '<div class="btn btn-default btnNormal checkRequest checkImport_'+e+'" >Yêu cầu kiểm hàng</div>';
    } else {
      cardBody = '<div class="btn btn-default btnNormal" >Hàng tồn:'+data[e][4]+'</div>';      
    }
  	$("#listSchedule").append(
      // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+data[e][0]+' | '+data[e][2]+' | '+data[e][5]+'</a>'
      '<div class="card cardElement_'+e+'">'+
        '<div class="card-header" id="heading_"'+e+'>'+
          '<h5 class="mb-0">'+
            '<button class="btn btn-link btnOrder_'+e+'" data-toggle="collapse" data-target="#collapse_'+e+'" aria-expanded="false" aria-controls="collapse_'+e+'">'+
              data[e][0]+' | '+data[e][1] +
            '</button>'+
          '</h5>'+
        '</div>'+

        '<div id="collapse_'+e+'" class="collapse" aria-labelledby="heading_'+e+'" data-parent="#listSchedule">'+
          '<div class="card-body">'+
            cardBody +
            '<hr/>'+
            '<div class="btn btn-default btnNormal editWH_'+e+'" style="margin : 0px 10px 0px 0px">Sửa</div>'+
            '<div class="btn btn-default btnNormal viewProductInWH_'+e+'" >Xem danh sách hàng</div>'+
          '</div>'+
        '</div>'+
      '</div>'
      )

    $(".checkImport_"+e).click(requestToCheckProducts);
    $(".editWH_"+e).click(editWarehouseFn);
    $(".viewProductInWH_"+e).click(viewProductInWH);
  }
};

function viewProductInWH() {
  var importIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  // console.log(warehouseData[importIndex]);
  window.location="listproduct.html?importCode="+warehouseData[importIndex][0];
}

function editWarehouseFn() {
  var importIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  var realIndex = parseInt(importIndex) + 1;
  var currentImport = {
    importIndex : realIndex,
    importCode : warehouseData[importIndex][0],
    importName : warehouseData[importIndex][1],
    importStatus : warehouseData[importIndex][2],
    importShippingFee : warehouseData[importIndex][3]
  }

  localStorage.setItem("currentImport",JSON.stringify(currentImport));
  window.location = "editImportSchedule.html";
}
function requestToCheckProducts(){
  var importIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  importIndex = parseInt(importIndex);
  var importCode = warehouseData[importIndex][0];
  console.log(importCode);
  var title = "Kiểm tra "+warehouseData[importIndex][1]
  $("#loadingSpin").show();

  var content = "<hr/>";
  loadProductList(function(productList){
    // var productList = JSON.parse(localStorage.getItem("productList"));
    console.log("loadProductList");
    for (e in productList) {
      if (productList[e][2] == importCode) {
        content += "<a href='"+productList[e][19]+"'>"+productList[e][3]+" : "+productList[e][4] + "</a><br/>";
      }
    }
    content += "<hr/>"

    getLatestTaskCode(function(taskCode){
      console.log("getLatestTaskCode");
      var submitTaskData = [
        [taskCode, title, content, "", ""]
      ]
      appendTask(submitTaskData, function(){
        console.log("appendTask");

        var dataEditWarehouse = [
          [1]
        ]
        var actualIndexInSheet = importIndex +1;
        var range = "Warehouse!C"+actualIndexInSheet+":C"+actualIndexInSheet;
        
        editWarehouse(dataEditWarehouse, range, function(){
          
          console.log("editWarehouse");
          $("#loadingSpin").hide();

        })

      })
    })

  })
}
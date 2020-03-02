
var warehouseData;
var importType = 0;
var triggerAfterLoad = function(){

  $("#loadingSpin").show();

  loadWarehouse(function(){
    $("#loadingSpin").hide();
    console.log("Gooo");
    loadWarehouseHtml();
  })
}

// $(".text-center").click(function(){
//   triggerAfterLoadX();
// })

function loadWarehouseHtml() {
  var data = JSON.parse(localStorage.getItem("warehouse"));
  warehouseData = data;
  $("#listSchedule").empty();
  // console.log(data);
  for(var e in data) {
    if (e == 0) {
      continue;
    }
    if (!data[e][0]){
      continue;
    }
    if (importType==0) {
      if (data[e][4]==0) {
        continue;
      }
    }

    if ($("#warehouseSearchInput").val()) {
      if (!data[e][1].toUpperCase().includes($("#warehouseSearchInput").val().toUpperCase())){
        continue;
      }
    }

    var scheduleStatus = data[e][2];
    var cardBody = "";

    if (scheduleStatus == 0) {
      cardBody += '<div class="btn btn-default btnNormal checkRequest checkImport_'+e+'" >Yêu cầu kiểm hàng</div>';
    } else {
      cardBody += '<div class="btn btn-default btnNormal" >Hàng tồn:'+data[e][4]+'</div>';      
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
            '<div class="btn btn-default btnNormal showWH_'+e+'" style="margin : 5px">Xem</div>'+
            '<hr/>'+
            // 'Tồn kho : '+data[e][4]+'<br/>'+
            'Tổng vốn : ' + data[e][10]+
            '<hr/>'+
            '<div class="btn btn-default btnNormal editWH_'+e+'" style="margin : 5px">Sửa</div>'+
            '<div class="btn btn-default btnNormal deleteWH_'+e+'" style="margin : 5px">Xoá</div>'+
            '<div class="btn btn-default btnNormal viewProductInWH_'+e+'" style="margin : 5px">Xem danh sách hàng</div>'+
          '</div>'+
        '</div>'+
      '</div>'
      )

    $(".checkImport_"+e).click(requestToCheckProducts);
    $(".editWH_"+e).click(editWarehouseFn);
    $(".viewProductInWH_"+e).click(viewProductInWH);
    $(".deleteWH_"+e).click(deleteWH);
    $(".showWH_"+e).click(showWH);
  }
};

$("#warehouseSearchInput").change(function(){
  console.log("search"+$("#warehouseSearchInput").val());
  loadWarehouseHtml();
});

function showWH(){
  var importIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  // var modalBody ="<div>"+
  //       " Nhận hàng: "+data[e][5]+" | "+data[e][6] + "<br/>"+
  //       " Thanh toán: "+data[e][7]+" | "+data[e][8]+ "|" + data[e][9]+"<br/>"+ 
  //       "</div>";
  var address = warehouseData[importIndex][6] ? warehouseData[importIndex][6].replace(/[|&;$%@"<>()+,]/g, "").trim().replace(" ","+") : "";

  var modalBody = '<div>Thông tin nhận hàng:</div><br/>'+
              '<div class="btn btn-default btnNormal">'+
              '  <a href="tel:'+warehouseData[importIndex][5]+'"><span class="fas fa-phone"></span>'+warehouseData[importIndex][5]+'</a>'+
              '</div>'+
              '<br/>'+
              '<div class="btn btn-default btnNormal" style="margin-top:10px;">'+
              '  <a href="http://maps.google.com/maps?q='+address+'"><span class="fas fa-address-card"></span>'+warehouseData[importIndex][6]+'</a>'+
              '</div>'+
              '<div>Thông tin chuyển khoản:</div><br/>'+
              '<div class="btn btn-default btnNormal">'+
              ' <input class="banking bankingReceiver" readonly value="'+warehouseData[importIndex][7]+'"/>'+
              '</div>'+
              '<br/>'+
              '<div class="btn btn-default btnNormal">'+
              ' <input class="banking bankingNumber" readonly value="'+warehouseData[importIndex][8]+'"/>'+
              '</div>'+
              '<br/>'+
              '<div class="btn btn-default btnNormal">'+
              ' <input class="banking bankingName" readonly value="'+warehouseData[importIndex][9]+'"/>'+
              '</div>'
              ;
  $("#myModal .modal-body").html(modalBody);

  $(".banking").click(copyData);

  $('#myModal').modal('toggle');
}

function copyData(){
  console.log($(this).attr("class"));

  var copyText = document.getElementsByClassName($(this).attr("class"))[0];

  /* Select the text field */
  copyText.select(); 
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  /*For mobile devices*/
  document.execCommand("copy");
}

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
    importShippingFee : warehouseData[importIndex][3],
    inventory : warehouseData[importIndex][4],
    receiverPhone: warehouseData[importIndex][5],
    receiverAddress: warehouseData[importIndex][6],
    receiverName: warehouseData[importIndex][7],
    bankingAccountNumber: warehouseData[importIndex][8],
    bankingName: warehouseData[importIndex][9],
    totalPay: warehouseData[importIndex][10]
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

  var address = warehouseData[importIndex][6] ? warehouseData[importIndex][6].replace(/[|&;$%@"<>()+,]/g, "").trim().replace(" ","+") : "";

  var content ='<div>Thông tin nhận hàng:</div><br/>'+
              '<div class="btn btn-default btnNormal">'+
              '  <a href="tel:'+warehouseData[importIndex][5]+'"><span class="fas fa-phone"></span>'+warehouseData[importIndex][5]+'</a>'+
              '</div>'+
              '<br/>'+
              '<div class="btn btn-default btnNormal" style="margin-top:10px;">'+
              '  <a href="http://maps.google.com/maps?q='+address+'"><span class="fas fa-address-card"></span>'+warehouseData[importIndex][6]+'</a>'+
              '</div>';
  content+= "<table>";
  loadProductList(function(productList){
    // var productList = JSON.parse(localStorage.getItem("productList"));
    console.log("loadProductList");
//     <table>
  // <tr>
  //   <td>
  //     <div class="prodShippingName">Blackmore evening primrose : 1</div>
  //     <img class="prodShippingImage" src='https://i.imgur.com/zOnD0oa.jpg'/>
  //   </td>
  // </tr>
//   <tr>
//     <td>
//       <div class="prodShippingName">Blackmore evening primrose : 1</div>
//       <img class="prodShippingImage" src='https://i.imgur.com/zOnD0oa.jpg'/>
//     </td>
//   </tr>
// </table>
    for (e in productList) {
      if (productList[e][2] == importCode) {
        // content += "<a href='"+productList[e][19]+"'>"+productList[e][3]+" : "+productList[e][4] + "</a><br/>";
        content += '<tr>'+
        '    <td>'+
        '      <div class="prodShippingName">'+productList[e][3]+' : '+productList[e][4] + '</div>'+
        '      <img class="prodShippingImage" src="'+productList[e][19]+'"/>'+
        '    </td>'+
        '  </tr>';
      }
    }
    content += "<table/>"

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

function deleteWH(){
  var importIndex = $(this).attr("class").split(" ").pop().split("_").pop();
  importIndex = parseInt(importIndex);
  var importCode = warehouseData[importIndex][0];
  console.log(importCode);

  $("#loadingSpin").show();

  var actualIndexInSheet = importIndex +1;
  var range = "Warehouse!A"+actualIndexInSheet+":J"+actualIndexInSheet;

  var dataEditWarehouse = [
    ["","","","","","","","","",""]
  ]

  editWarehouse(dataEditWarehouse, range, function(){
    
    console.log("delete Warehouse");
    $("#loadingSpin").hide();

  })
}

$("#importFilter").change(function(){
  // console.log("importFilter:");
  importType = document.getElementById("importFilter").value;
  // console.log("importType:"+importType);
  loadWarehouseHtml();
})
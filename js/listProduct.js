console.log(window.location);
var url = new URL(window.location.href);
var importCode = url.searchParams.get("importCode");
var lsNotifications = [];


console.log("importCode:"+importCode);

$(".click-to-select-all").hide();
$(".click-to-view").hide();

if (!importCode) {
  importCode = -3;
}

//Load history

//saveHistory({
//   searchText : $("#prodSearchInput").val(),
//   importCode : $("#importFilter").val(),
//   goToClass : $(this).attr("class")
// })
var historicalData = readCurrentHistoryData();
if (historicalData){
  console.log("historicalData");
  console.log(historicalData);
  if (historicalData.searchText){
    $("#prodSearchInput").val(historicalData.searchText);
  }

  if (historicalData.importCode) {
    importCode = historicalData.importCode;
    $("#importFilter").val(importCode);
  }
}

var afterLoadHTML = function(){
  // document.getElementsByClassName
  if (historicalData && historicalData.goToClass) {
    // document.getElementsByClassName(historicalData.goToClass)[0].scrollIntoView();
    var $container = $("html,body");
    var orderIndex = historicalData.goToClass.split(" ").pop().split("_").pop();
    var btnOrder = "btnProd_"+orderIndex;

    console.log("goToClass:"+btnOrder);

    var $scrollTo = $('.'+btnOrder);

    $("html,body").animate({scrollTop: $scrollTo.offset().top - $container.offset().top + $container.scrollTop() - 100, scrollLeft: 0},300); 
    $scrollTo.click();

    historicalData = undefined;
  }
}
/////////////

var triggerAfterLoad = function(){

  $("#loadingSpin").show();

  loadProductList(function(){
      console.log("Gooo");
      loadProductListHtml();

      loadImportScheduleList(function(){
          var importSLData = JSON.parse(localStorage.getItem("warehouse"));
          // console.log(importSLData);
          $("#importFilter").empty();
          $("#importFilter").append("<option value='-1'>Hàng có sẵn</option>");
      
          for (var e in importSLData) {
            if (e ==0) {
              continue;
            }
            if (!importSLData[e][0]) {
              continue;
            }
            $("#importFilter").append("<option value='"+importSLData[e][0]+"'>"+importSLData[e][0]+" - "+importSLData[e][1]+"</option>")
          }

          $("#importFilter").append("<option value='-2'>Hàng đã bán hết</option>");
          $("#importFilter").append("<option value='-3'>Toàn bộ</option>");
          $("#importFilter").append("<option value='-4'>Hàng số âm</option>");

          $("#importFilter").val(importCode);
      })
  })
}

$(".text-center").click(function(){
  // getOrderShipping(function(lsOrderset){
  //     lsOrder = lsOrderset;
  //     loadOrderShippingListHtml(lsOrder);
  //     getTaskList(function(lsTaskset){
  //       lsTask = lsTaskset;
  //     })
  // });
  triggerAfterLoadX();
})
// console.log(c);

$(".click-to-notify").hide();

function addNotification(text){
  lsNotifications.push(text);
  $(".click-to-notify").show();
}


function loadProductListHtml(){
  data = JSON.parse(localStorage.getItem("productList"));
  var indexColumnOfAllData = 19;

  // console.log(data);

  $("#listProduct").empty();

	for(e in data) {
    if (e == 0) {
      continue;
    }
    if (!data[e][0]) {
      continue;
    }

    var searchText = $("#prodSearchInput").val();

    if (searchText) {
      if (!(data[e][0].toUpperCase().includes(searchText.toUpperCase()) 
        || data[e][3].toUpperCase().includes(searchText.toUpperCase()))) {
        continue;
      }
    }

    // var importCode = document.getElementById("importFilter").value;

    if (importCode > -1) {
      if (importCode != data[e][2]) {
        continue;
      }
    } else if (importCode == -1) {
      if (data[e][17] == 0) {
        continue;
      }
    } else if (importCode == -2) {
      if (data[e][17] != 0) {
        continue;
      }
    }  else if (importCode == -4) {
      if (parseFloat(data[e][17]) >= 0) {
        continue;
      }
    }

    if (data[e][17] < 0) {
      addNotification(data[e][0]+" ("+data[e][2]+") | "+data[e][3] + " | " +data[e][17] +" hàng tồn bị âm");
    }

    var imageDiv = "";
    if (data[e][19]) {
      imageDiv = '<img class="prodImage" src="'+data[e][19]+'" alt="'+data[e][3]+'" />';
    }
		$("#listProduct").append('<div class="card">'+
        '<div class="card-header" id="heading"'+e+'>'+
          '<h5 class="mb-0">'+
            '<input type="checkbox" class="checkbox prodExtend check_'+e+'"/>'+
            '<button class="btn btn-link btnProd_'+e+'" data-toggle="collapse" data-target="#collapse'+e+'" aria-expanded="false" aria-controls="collapse'+e+'">'+
              data[e][0]+" ("+data[e][2]+") | "+data[e][3] + " | " +data[e][17] +
              '<span class="prodExtend" style="color:red">'+
                " / <i class='fas fa-motorcycle'/>" +data[e][21] +
                (data[e][17] ==0 ? " / CLEAR" : "") +
              '</span>'+
            '</button>'+
          '</h5>'+
        '</div>'+

        '<div id="collapse'+e+'" class="collapse imageContainer" aria-labelledby="heading'+e+'" data-parent="#listProduct">'+
          '<div class="card-body">'+
  	        '<p>Mã hàng:'+data[e][0]+'</p>'+
            // '<p>Mã hàng tham chiếu:'+data[e][1]+'</p>'+
            '<p>Mã đợt hàng:'+data[e][2]+'</p>'+
            '<p>Giá gốc:'+data[e][5]+' EUR</p>'+
            '<p>Giá gốc:'+data[e][11]+' VND</p>'+
            '<p>Giá bán lẻ:'+data[e][12]+' VND</p>'+
            '<p>Giá bán CTV:'+data[e][20]+' VND</p>'+
            '<p>Số lượng:'+data[e][4]+'</p>'+
            '<p>Cân nặng:'+data[e][6]+'</p>'+
            '<p>Lãi xuất/SP:'+data[e][13]+'</p>'+
            '<p>Hàng tồn:'+data[e][17]+'</p>'+
            '<div class="btn btnNormal5px editproductelement product_'+e+'" >Sửa mặt hàng</div>'+
            '<div class="btn btnNormal5px textRed deleteproductelement product_'+e+'" >Xoá mặt hàng</div>'+
            '<div class="btn btnNormal5px showorder product_'+e+'" >Xem đơn hàng</div>'+
          '</div>'+
          imageDiv+
        '</div>'+
      '</div>')
	}

  $(".prodExtend").hide();

  afterLoadHTML();


  $(".editproductelement").click(editProductFn);
  $(".deleteproductelement").click(deleteProduct);


  $(".showorder").click(showOrder);
  $("#loadingSpin").hide();

  function showOrder(){
    var productIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    productIndex = parseInt(productIndex);

    saveHistory({
      searchText : $("#prodSearchInput").val(),
      importCode : $("#importFilter").val(),
      goToClass : $(this).attr("class")
    })

    window.location = "listorder.html?prodRefCodeFilter="+data[productIndex][1];
  }

  function deleteProduct() {
    var productIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    productIndex = parseInt(productIndex);
    console.log($(this).attr("class")+" vs "+productIndex);

    var dataEditP = [
                ["", //0 A
                 "",
                 "",
                 "", //1 B
                 "", //2 C
                 "", //3 D
                 "", //4 E
                 "", //5 F
                 "", //6 G
                 "", //7 H
                 "", //8 I
                 "", //9 J
                 "", //10 K
                 "", //11 L
                "", //12 M
                "", //13 N
                "", //14 O
                "", //15 P
                "", //16 Q
                "",
                ""
                ]
            ];
    var proIndex = parseInt(productIndex) + 1;
    var numOfColumn = 20;
    var sheetrange = 'Product!A'+proIndex+':'+ String.fromCharCode(65+numOfColumn)+proIndex+"";

    var deleteTrigger = function() {
      
      $("#loadingSpin").show();

      editProduct(dataEditP, sheetrange,function(){
          $("#loadingSpin").hide();
          $("#simpleModal .modal-content").html("Đã xoá mặt hàng");
          $('#simpleModal').modal('toggle');
        }, function(){
          $("#loadingSpin").hide();
          $("#simpleModal .modal-content").html("Có lỗi, không thể xoá");
          $('#simpleModal').modal('toggle');
      })

      var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
      console.log("delete:"+orderIndex);
    }

    $("#modelContent").html("Bạn có chắc chắn muốn xoá không");
    $("#modalYes").click(function(){
      deleteTrigger();
    })
    $('#myModal').modal('toggle');

  }

  function editProductFn() {
    var productIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    productIndex = parseInt(productIndex);
    console.log($(this).attr("class")+" vs "+productIndex);
    // var productCode = data[productIndex][0];
    console.log(data[productIndex]);
    var currentProduct = {
      productIndex : productIndex,
      productCode : data[productIndex][0],
      productRefCode : data[productIndex][1],
      importCode : data[productIndex][2],
      productName : data[productIndex][3],
      productCount : data[productIndex][4],
      productOriginalCostEur : data[productIndex][5],
      productWeight : data[productIndex][6],
      shipInternationalFee : data[productIndex][7],
      shipItalyFee : data[productIndex][8],
      shipVietnamFee : data[productIndex][9],
      otherFee : data[productIndex][10],
      productEstimateVND : data[productIndex][11],
      productEstimateSellingVND : data[productIndex][12],
      productEstimateSellingCTV : data[productIndex][20],
      profitPerOneProduct : data[productIndex][13],
      turnover : data[productIndex][14],
      totalCost : data[productIndex][15],
      totalProfit : data[productIndex][16],
      numOfRest : data[productIndex][17],
      totalPayOfRest : data[productIndex][18],
      prodImageLink : data[productIndex][19]
    }

    localStorage.setItem("currentProduct",JSON.stringify(currentProduct));

    saveHistory({
      searchText : $("#prodSearchInput").val(),
      importCode : $("#importFilter").val(),
      goToClass : $(this).attr("class")
    })

    window.location = "../barcode/editproduct.html";
  }
}

$(".click-to-notify").click(function(){
  $(".modal-body").empty();
  var content = "<div id='modelContent'>Chú ý:<br/>"
  for (e in lsNotifications){
    content+= lsNotifications[e]+"<br/>"
  }
  content+="</div>";

  $(".modal-body").html(content);

  $('#myModal').modal('toggle');
  $("#modalYes").click(function(){
  })
})

$("#prodSearchInput").keyup(function(){
  var searchText = $(this).val();
  console.log("search:"+searchText);
  loadProductListHtml();
});

$("#importFilter").change(function(){
  // console.log("importFilter:");
  $("#prodSearchInput").val("");

  importCode = document.getElementById("importFilter").value;

  loadProductListHtml();
})

$(".click-to-select").click(function(){
  if($(".checkbox").is(':visible') ) {
    $(".checkbox").hide();
    $(".prodExtend").hide();
    $(".click-to-select-all").hide();
    $("#controllMany").hide();
    $(".click-to-view").hide();

  } else {
    $(".checkbox").show();
    $(".prodExtend").show();
    $(".click-to-select-all").show();
    $("#controllMany").show();
    $(".click-to-view").show();

  }
})

$(".click-to-select-all").click(function(){
  // var lsChecked = $(".checkbox");
  // for (e in lsChecked){
  //   $(lsChecked[e]).attr("checked", true);
  // }
  var count = 0;
  var check = false;
  $('.checkbox').each(function(){ 
    count++;
    if (count == 1 && this.checked) {
      check = true;
    }
    if (check){
      this.checked = false; 
    } else {
      this.checked = true;
    }
  });

})

$(".click-to-view").click(function(){
  var lsChecked = $(".checkbox");
  var totalCost = 0;
  var num = 0;
  var requestedNum = 0;
  var stillInStore = 0;
  // for (e in lsChecked){
  //   if ($(lsChecked[e]).is(":checked")){
  var downloadContent = "STT, Tên hàng, SL, Giá, Thành tiền\n";
  var count = 0;
  $('.checkbox').each(function(){ 
      // this.checked = true; });
      if (this.checked){
        var productIndex =  $(this).attr("class").split(" ").pop().split("_").pop();
        // console.log(data[productIndex]);
        totalCost+= (parseInt(data[productIndex][4]) * parseInt(data[productIndex][11]));
        num += parseInt(data[productIndex][4]);
        requestedNum += parseInt(data[productIndex][21]);
        stillInStore += parseInt(data[productIndex][17]);
        count++;
        downloadContent += count+","
        +data[productIndex][3]+","
        +data[productIndex][4]+","
        +data[productIndex][11]+","
        +(parseInt(data[productIndex][4]) * parseInt(data[productIndex][11]))
        +"\n";
      }
    }
  )
  downloadContent += "-, Tổng số lượng, "+num+"\n";
  downloadContent += "-, Tổng tiền, "+totalCost;

  var content = "Tổng tiền vốn: "+totalCost+" <br/>"+
                "Tổng số lượng: "+num+" <br/>"+
                "Tổng số lượng đã yêu cầu giao: "+requestedNum+" <br/>"+
                "Hàng tồn: "+stillInStore+" <br/>"+
                "<div class='btn btn-primary mb-2 downloadProds'>Tải CSV file</div>"+
                "<div class='btn btn-primary mb-2 viewProds'>Xem bảng</div>"+
                " <br/>";

  $("#modelContent").html(content);
  $("#modalYes").click(function(){
  })
  $('#myModal').modal('toggle');
  $(".downloadProds").click(function(){
     downloadFile("hang.csv", downloadContent);
  })
  $(".viewProds").click(function(){
    var ls1 = downloadContent.split("\n");
    var ls2 = [];
    for (s in ls1) {
      ls2.push(ls1[s].split(","));
    }
    console.log(ls2);
    localStorage.setItem("tmp",JSON.stringify(ls2));
    window.location = "../manager/viewtmp.html";

  })
})



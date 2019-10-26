console.log(window.location);
var url = new URL(window.location.href);
var importCode = url.searchParams.get("importCode");

console.log("importCode:"+importCode);

if (!importCode) {
  importCode = -3;
}

var triggerAfterLoad = function(){

  $("#loadingSpin").show();

  loadProductList(function(){
      console.log("Gooo");
      loadProductListHtml();

      loadImportScheduleList(function(){
          var importSLData = JSON.parse(localStorage.getItem("warehouse"));
          console.log(importSLData);
          $("#importFilter").empty();
          $("#importFilter").append("<option value='-1'>Hàng có sẵn</option>");
      
          for (var e in importSLData) {
            if (e ==0) {
              continue;
            }
            $("#importFilter").append("<option value='"+importSLData[e][0]+"'>"+importSLData[e][0]+" - "+importSLData[e][1]+"</option>")
          }

          $("#importFilter").append("<option value='-2'>Hàng đã bán hết</option>");
          $("#importFilter").append("<option value='-3'>Toàn bộ</option>");
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
    }

    var imageDiv = "";
    if (data[e][19]) {
      imageDiv = '<img class="prodImage" src="'+data[e][19]+'" alt="'+data[e][3]+'" />';
    }
		$("#listProduct").append('<div class="card">'+
        '<div class="card-header" id="heading"'+e+'>'+
          '<h5 class="mb-0">'+
            '<button class="btn btn-link" data-toggle="collapse" data-target="#collapse'+e+'" aria-expanded="false" aria-controls="collapse'+e+'">'+
              data[e][0]+" ("+data[e][2]+") | "+data[e][3] + " | " +data[e][17] +
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
            '<p>Giá bán:'+data[e][12]+' VND</p>'+
            '<p>Số lượng:'+data[e][4]+'</p>'+
            '<p>Cân nặng:'+data[e][6]+'</p>'+
            '<p>Lãi xuất/SP:'+data[e][13]+'</p>'+
            '<p>Hàng tồn:'+data[e][17]+'</p>'+
            '<div class="btn btnNormal5px editproductelement product_'+e+'" >Sửa mặt hàng</div>'+
            '<div class="btn btnNormal5px textRed deleteproductelement product_'+e'" >Xoá mặt hàng</div>'+
            '<div class="btn btnNormal5px showorder product_'+e+'" >Xem đơn hàng</div>'+
          '</div>'+
          imageDiv+
        '</div>'+
      '</div>')
	}


  $(".editproductelement").click(editProduct);
  $(".deleteproductelement").click(deleteProduct);


  $(".showorder").click(showOrder);
  $("#loadingSpin").hide();

  function showOrder(){
    var productIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    productIndex = parseInt(productIndex);
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
                ""
                ]
            ];
    var proIndex = parseInt(productIndex) + 1;
    var numOfColumn = 19;
    var sheetrange = 'Product!A'+proIndex+':'+ String.fromCharCode(65+numOfColumn)+proIndex+"";

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

  }

  function editProduct() {
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
      profitPerOneProduct : data[productIndex][13],
      turnover : data[productIndex][14],
      totalCost : data[productIndex][15],
      totalProfit : data[productIndex][16],
      numOfRest : data[productIndex][17],
      totalPayOfRest : data[productIndex][18],
      prodImageLink : data[productIndex][19]
    }

    localStorage.setItem("currentProduct",JSON.stringify(currentProduct));

    window.location = "../barcode/editproduct.html";
  }
}

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


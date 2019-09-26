// filterSheet.js

// var sheetrange = 'Sheet1!A:A';
// var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';


// my_range = {
//     'sheetId': spreadsheetId,
//     'startRowIndex': 10000,
//     'startColumnIndex': 0,
// }

// var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';
// var indexColumnOfAllData = 15;
// var sheetrange = 'Product!A:'+String.fromCharCode(65+indexColumnOfAllData);
// var dataset = [];


// gapi.client.sheets.spreadsheets.values.get({
//     spreadsheetId: spreadsheetId,
//     range: sheetrange,
// }).then(function(response) {
//     // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
//     dataset = response.result.values;
//     showList(dataset);
// }, function(response) {
//     console.log('Error: ' + response.result.error.message);
// });

// function showList(data) {

// $(".text-center").click(function(){
//   loadProductList(function(){
//       // $("#loadingSpin").hide();
//       console.log("Gooo");
//       loadProductListHtml();
//   })
// });

var triggerAfterLoad = function(){

  $("#loadingSpin").show();

  loadProductList(function(){
      console.log("Gooo");
      loadProductListHtml();
  })
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

    var searchText = $("#prodSearchInput").val();

    if (searchText) {
      if (!(data[e][0].toUpperCase().includes(searchText.toUpperCase()) 
        || data[e][3].toUpperCase().includes(searchText.toUpperCase()))) {
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
              e+" - "+data[e][3] +
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
            '<div class="btn editproductelement product_'+e+'" style="border: 1px solid black;margin-left:10px;">Sửa mặt hàng</div>'+
          '</div>'+
          imageDiv+
        '</div>'+
      '</div>')
	}


  $(".editproductelement").click(editProduct);

  $("#loadingSpin").hide();

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

// var searchInput = document.getElementById("prodSearchInput");

// // Get the offset position of the navbar
// var stickySearchInput = searchInput.offsetTop;

// window.onscroll = function() {
//   console.log("scroll:"+window.pageYOffset+" "+stickySearchInput+" "+ (window.pageYOffset - stickySearchInput))
//   if (window.pageYOffset > stickySearchInput-100) {
//     console.log("sticky");
//     searchInput.classList.add("sticky");
//   } else {
//     searchInput.classList.remove("sticky");
//   }
// };

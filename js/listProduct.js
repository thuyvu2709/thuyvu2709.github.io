// console.log(window.location);
var url = new URL(window.location.href);
var importCode = url.searchParams.get("importCode");
var lsNotifications = [];

// $( "#listProduct" ).disableSelection();
// $( "#listProduct" ).sortable();

$("#listProduct").sortable({
  group: 'no-drop',
  handle: 'i.iconMove',
  onDragStart: function ($item, container, _super) {
    // Duplicate items of the no drop area
    if (!container.options.drop)
      $item.clone().insertAfter($item);
    _super($item, container);
  }
});
$("#listProduct").sortable({
  group: 'no-drop',
  drop: false
});
$("#listProduct").sortable({
  group: 'no-drop',
  drag: false
});


console.log("importCode:" + importCode);

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
if (historicalData) {
  console.log("historicalData");
  console.log(historicalData);
  if (historicalData.searchText) {
    $("#prodSearchInput").val(historicalData.searchText);
  }

  if (historicalData.importCode) {
    importCode = historicalData.importCode;
    $("#importFilter").val(importCode);
  }
}

var afterLoadHTML = function () {
  // document.getElementsByClassName
  if (historicalData && historicalData.goToClass) {
    // document.getElementsByClassName(historicalData.goToClass)[0].scrollIntoView();
    var $container = $("html,body");
    var orderIndex = historicalData.goToClass.split(" ").pop().split("_").pop();
    var btnOrder = "btnProd_" + orderIndex;

    // console.log("goToClass:"+btnOrder);

    var $scrollTo = $('.' + btnOrder);

    $("html,body").animate({ scrollTop: $scrollTo.offset().top - $container.offset().top + $container.scrollTop() - 100, scrollLeft: 0 }, 300);
    $scrollTo.click();

    historicalData = undefined;
  }
}
/////////////

lsAutoImportSchedule = [];

var triggerAfterLoad = function () {

  $("#loadingSpin").show();

  loadProductList(function () {
    console.log("Gooo");
    loadProductListHtml();

    loadOrderListDetail(function () {
      console.log("loadOrderListDetail");

      loadWarehouse(function () {
        var importSLData = JSON.parse(localStorage.getItem("warehouse"));
        // console.log(importSLData);
        $("#importFilter").empty();
        $("#importFilter").append("<option value='-1'>Hàng có sẵn</option>");


        var indexInTable = {};
        for(var e in importSLData) {
          indexInTable[importSLData[e][0]] = e;
        }
    
        let sortableData = importSLData.slice(0);
        sortableData.sort(function(a,b) {
          if (isNaN(parseInt(a[0]))) {
          return -1;
          }
          if (isNaN(parseInt(b[0]))) {
          return 1;
          }
          return parseInt(a[0]) - parseInt(b[0]);
        });
    

        // for (var e in importSLData) {
        for (var es in sortableData) {
          var e = indexInTable[sortableData[es][0]];

          if (!importSLData[e][0]) {
            continue;
          }

          lsAutoImportSchedule.push({
            label: importSLData[e][0] + " - " + importSLData[e][1],
            value: importSLData[e][0] + " - " + importSLData[e][1],
            data: importSLData[e],
            importCode: importSLData[e][0]
          });

          var importSLDateStr = importSLData[e][0] + " - " + importSLData[e][1];
          // if (importSLDateStr.length > 50) {
          importSLDateStr = importSLDateStr.substring(0, 39);
          // }
          $("#importFilter").append("<option value='" + importSLData[e][0] + "'>" + importSLDateStr + "</option>")
        }

        $("#importFilter").append("<option value='-2'>Hàng đã bán hết</option>");
        $("#importFilter").append("<option value='-3'>Toàn bộ</option>");
        $("#importFilter").append("<option value='-4'>Hàng số âm</option>");

        $("#importFilter").val(importCode);
      })
    });
  })
}

// $(".text-center").click(function(){
//   // getOrderShipping(function(lsOrderset){
//   //     lsOrder = lsOrderset;
//   //     loadOrderShippingListHtml(lsOrder);
//   //     getTaskList(function(lsTaskset){
//   //       lsTask = lsTaskset;
//   //     })
//   // });
//   triggerAfterLoadX();
// })
// console.log(c);

$(".click-to-notify").hide();

function addNotification(text) {
  lsNotifications.push(text);
  $(".click-to-notify").show();
}


function loadProductListHtml() {
  $("#loadingSpin").hide();

  data = JSON.parse(localStorage.getItem("productList"));
  var indexColumnOfAllData = 19;

  // console.log(data);

  $("#listProduct").empty();

  for (e in data) {
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
    } else if (importCode == -4) {
      if (parseFloat(data[e][17]) >= 0) {
        continue;
      }
    }

    if (data[e][17] < 0) {
      addNotification(data[e][0] + " (" + data[e][2] + ") | " + data[e][3] + " | " + data[e][17] + " hàng tồn bị âm");
    }

    var imageDiv = "";
    if (data[e][19]) {
      imageDiv = '<img class="prodImage" src="' + data[e][19] + '" alt="' + data[e][3] + '" />';
    }
    $("#listProduct").append('<divli class="card cardElement_' + e + '">' +
      '<div class="card-header" id="heading' + e + '">' +
      '<h5 class="mb-0">' +
      '<input type="checkbox" class="checkbox prodExtend check_' + e + '"/>' +
      '<i class="fas fa-arrows-alt iconMove text-mustard"></i>' +
      '<button class="btn btn-link btnProd_' + e + '" data-toggle="collapse" data-target="#collapse' + e + '" aria-expanded="false" aria-controls="collapse' + e + '">' +
      data[e][0] + " (" + data[e][2] + ") | " + data[e][3] + " | " + data[e][17] +
      '<span class="prodExtend" style="color:red">' +
      " / <i class='fas fa-motorcycle'/>" + data[e][21] +
      (data[e][17] == 0 ? " / CLEAR" : "") +
      '</span>' +
      '</button>' +
      '</h5>' +
      '</div>' +

      '<div id="collapse' + e + '" class="collapse imageContainer" aria-labelledby="heading' + e + '" data-parent="#listProduct">' +
      '<div class="card-body">' +
      '<p>Mã hàng:' + data[e][0] + '</p>' +
      // '<p>Mã hàng tham chiếu:'+data[e][1]+'</p>'+
      '<p>Mã đợt hàng:' + data[e][2] + '</p>' +
      '<p>Giá gốc:' + data[e][5] + ' EUR</p>' +
      '<p>Giá gốc:' + data[e][11] + ' VND</p>' +
      '<p>Giá bán lẻ:' + data[e][12] + ' VND</p>' +
      '<p>Giá bán CTV:' + data[e][20] + ' VND</p>' +
      '<p>Số lượng:' + data[e][4] + '</p>' +
      '<p>Cân nặng:' + data[e][6] + '</p>' +
      '<p>Lãi xuất/SP:' + data[e][13] + '</p>' +
      '<p>Hàng tồn:' + data[e][17] + '</p>' +
      (data[e][8] == "0" ? "" : ('<p>URL:<a href="' + data[e][8]) + '">' + data[e][8] + '</a></p>') +
      '<div class="btn btnNormal5px editproductelement product_' + e + '" >Sửa mặt hàng</div>' +
      '<div class="btn btnNormal5px textRed deleteproductelement product_' + e + '" >Xoá mặt hàng</div>' +
      '<div class="btn btnNormal5px showorder product_' + e + '" >Xem đơn hàng</div>' +
      '<div class="btn btnNormal5px makecopy makecopy_' + e + '" >Tạo mới y hệt</div>' +

      '</div>' +
      imageDiv +
      '</div>' +
      '</divli>')
  }

  $(".prodExtend").hide();
  $(".iconMove").hide();

  afterLoadHTML();
  $(".makecopy").click(makecopy);

  $(".editproductelement").click(editProductFn);
  $(".deleteproductelement").click(deleteProduct);

  $(".showorder").click(showOrder);
  $("#loadingSpin").hide();

  function showOrder() {
    var productIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    productIndex = parseInt(productIndex);

    saveHistory({
      searchText: $("#prodSearchInput").val(),
      importCode: $("#importFilter").val(),
      goToClass: $(this).attr("class")
    })

    window.location = "listorder.html?prodRefCodeFilter=" + data[productIndex][1];
  }

  function deleteProduct() {
    var productIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    productIndex = parseInt(productIndex);
    console.log($(this).attr("class") + " vs " + productIndex);

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
    var sheetrange = 'Product!A' + proIndex + ':' + String.fromCharCode(65 + numOfColumn) + proIndex + "";

    // var deleteTrigger = function() {

    //   // var orderIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    //   // console.log("delete:"+orderIndex);
    // }

    $("#modelContent").html("Bạn có chắc chắn muốn xoá không");
    $("#modalYes").click(function () {
      // deleteTrigger();
      $("#loadingSpin").show();

      editProduct(dataEditP, sheetrange, function () {
        $("#loadingSpin").hide();
        $("#simpleModal .modal-content").html("Đã xoá mặt hàng");
        $('#simpleModal').modal('toggle');
        $(".cardElement_" + productIndex).remove();
      }, function () {
        $("#loadingSpin").hide();
        $("#simpleModal .modal-content").html("Có lỗi, không thể xoá");
        $('#simpleModal').modal('toggle');
        // $(".cardElement_"+productIndex).remove();
      })
    })
    $('#myModal').modal('toggle');

  }

  function makecopy() {
    var productIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    productIndex = parseInt(productIndex);
    console.log($(this).attr("class") + " vs " + productIndex);
    // var productCode = data[productIndex][0];
    console.log(data[productIndex]);
    var currentProduct = {
      productIndex: productIndex,
      productCode: data[productIndex][0],
      productRefCode: data[productIndex][1],
      importCode: data[productIndex][2],
      productName: data[productIndex][3],
      productCount: data[productIndex][4],
      productOriginalCostEur: data[productIndex][5],
      productWeight: data[productIndex][6],
      shipInternationalFee: data[productIndex][7],
      // shipItalyFee : data[productIndex][8],
      productUrl: (data[productIndex][8] == "0" ? "" : data[productIndex][8]),
      shipVietnamFee: data[productIndex][9],
      otherFee: data[productIndex][10],
      productEstimateVND: data[productIndex][11],
      productEstimateSellingVND: data[productIndex][12],
      productEstimateSellingCTV: data[productIndex][20],
      profitPerOneProduct: data[productIndex][13],
      turnover: data[productIndex][14],
      totalCost: data[productIndex][15],
      totalProfit: data[productIndex][16],
      numOfRest: data[productIndex][17],
      totalPayOfRest: data[productIndex][18],
      prodImageLink: data[productIndex][19]
    }

    localStorage.setItem("currentProduct", JSON.stringify(currentProduct));

    saveHistory({
      searchText: $("#prodSearchInput").val(),
      importCode: $("#importFilter").val(),
      goToClass: $(this).attr("class")
    })

    window.location = "../barcode/newproduct.html?makeCopy=true";
  }

  function editProductFn() {
    var productIndex = $(this).attr("class").split(" ").pop().split("_").pop();
    productIndex = parseInt(productIndex);
    console.log($(this).attr("class") + " vs " + productIndex);
    // var productCode = data[productIndex][0];
    console.log(data[productIndex]);
    var currentProduct = {
      productIndex: productIndex,
      productCode: data[productIndex][0],
      productRefCode: data[productIndex][1],
      importCode: data[productIndex][2],
      productName: data[productIndex][3],
      productCount: data[productIndex][4],
      productOriginalCostEur: data[productIndex][5],
      productWeight: data[productIndex][6],
      shipInternationalFee: data[productIndex][7],
      // shipItalyFee : data[productIndex][8],
      productUrl: (data[productIndex][8] == "0" ? "" : data[productIndex][8]),
      shipVietnamFee: data[productIndex][9],
      otherFee: data[productIndex][10],
      productEstimateVND: data[productIndex][11],
      productEstimateSellingVND: data[productIndex][12],
      productEstimateSellingCTV: data[productIndex][20],
      profitPerOneProduct: data[productIndex][13],
      turnover: data[productIndex][14],
      totalCost: data[productIndex][15],
      totalProfit: data[productIndex][16],
      numOfRest: data[productIndex][17],
      totalPayOfRest: data[productIndex][18],
      prodImageLink: data[productIndex][19]
    }

    localStorage.setItem("currentProduct", JSON.stringify(currentProduct));

    saveHistory({
      searchText: $("#prodSearchInput").val(),
      importCode: $("#importFilter").val(),
      goToClass: $(this).attr("class")
    })

    window.location = "../barcode/editproduct.html";
  }

  $("#loadingSpin").hide();

}

$(".click-to-notify").click(function () {
  $(".modal-body").empty();
  var content = "<div id='modelContent'>Chú ý:<br/>"
  for (e in lsNotifications) {
    content += lsNotifications[e] + "<br/>"
  }
  content += "</div>";

  $(".modal-body").html(content);

  $('#myModal').modal('toggle');
  $("#modalYes").click(function () {
  })
})

$("#prodSearchInput").keyup(function () {
  var searchText = $(this).val();
  console.log("search:" + searchText);
  loadProductListHtml();
});

$("#importFilter").change(function () {
  // console.log("importFilter:");
  $("#prodSearchInput").val("");

  importCode = document.getElementById("importFilter").value;

  loadProductListHtml();
})

$(".click-to-select").click(function () {
  $("#loadingSpin").show();

  if ($(".checkbox").is(':visible')) {
    $(".checkbox").hide();
    $(".iconMove").hide();
    $(".prodExtend").hide();
    $(".click-to-select-all").hide();
    $("#controllMany").hide();
    $(".click-to-view").hide();

    $("#loadingSpin").hide();
  } else {
    $(".checkbox").show();
    $(".iconMove").show();
    $(".prodExtend").show();
    $(".click-to-select-all").show();
    $("#controllMany").show();
    $(".click-to-view").show();

    $("#loadingSpin").hide();

  }
})

$(".click-to-select-all").click(function () {
  // var lsChecked = $(".checkbox");
  // for (e in lsChecked){
  //   $(lsChecked[e]).attr("checked", true);
  // }
  $("#loadingSpin").show();

  var count = 0;
  var check = false;
  $('.checkbox').each(function () {
    count++;
    if (count == 1 && this.checked) {
      check = true;
    }
    if (check) {
      this.checked = false;
    } else {
      this.checked = true;
    }
  });
  $("#loadingSpin").hide();
})

$(".click-to-view").click(function () {
  var lsChecked = $(".checkbox");
  var totalCost = 0;
  var num = 0;
  var requestedNum = 0;
  var stillInStore = 0;
  var stillInStoreTotalCost = 0;
  // for (e in lsChecked){
  //   if ($(lsChecked[e]).is(":checked")){
  var downloadContent = "STT, Tên hàng, SL, Hàng tồn, Giá, Thành tiền\n";
  var detailReport = "STT, Tên hàng, Tổng số lượng, Giá, Tổng tiền vốn, số lượng đã lên đơn, doanh thu, lợi nhuận\n";
  var count = 0;

  // --------In page product
  // Tổng tiền vốn: 214256 
  // Tổng số lượng (toàn bộ): 1280 
  // Tổng tiền vốn cho hàng tồn:13524
  // Số lượng hàng tồn: 90 

  // --------In page report
  // +Đối với các mặt hàng đã bán trong đơn hàng
  // Tổng lãi hiện tại đã bán: 62901
  // Tổng doanh thu đã bán: 263633

  // +Tính dựa trên thông tin nhập của mặt hàng
  // Tổng lãi dự kiến (theo giá bán lẻ): 132477
  // Tổng tiền vốn: 214256
  // Tổng số hàng tồn: 90
  // Tổng tiền vốn cho hàng tồn: 13524

  // +Tính dựa trên tiền hoàn của đơn hàng
  // Tổng tiền hoàn:8406

  var rcount = 0;
  var totalRevenue = 0;
  var totalInterest = 0;

  var orderListDetail = JSON.parse(localStorage.getItem("orderListDetail"));

  $('.checkbox').each(function () {
    // this.checked = true; });
    if (this.checked) {
      var productIndex = $(this).attr("class").split(" ").pop().split("_").pop();
      // console.log(data[productIndex]);
      var count = parseInt(data[productIndex][4] ? data[productIndex][4] : "0");
      var eachCost = parseInt(data[productIndex][11] ? data[productIndex][11] : "0");
      totalCost += (count * eachCost);
      num += count;
      var requestedNumEach = parseInt(data[productIndex][21]);
      // requestedNumEach = requestedNumEach ? requestedNumEach : 0;

      // requestedNum += requestedNumEach;
      var stillInStoreCountEach = parseInt(data[productIndex][17] ? data[productIndex][17] : "0")
      stillInStore += stillInStoreCountEach;
      stillInStoreTotalCost += eachCost * stillInStoreCountEach;
      // console.log(data[productIndex][0] +data[productIndex][21]+" "+requestedNum);

      rcount++;

      downloadContent += rcount + ","
        + data[productIndex][3] + ","
        + count + ","
        + data[productIndex][17] + ","
        + eachCost + ","
        + (count * eachCost)
        + "\n";

      var revenue = 0;
      var interest = 0;
      var orderedCount = 0;
      for (var oldi in orderListDetail) {
        if (orderListDetail[oldi][3] == data[productIndex][1]) { // kiem tra trong OrderDetail
          revenue += parseInt(orderListDetail[oldi][7]) // Tong Tien cot 7
          interest += parseInt(orderListDetail[oldi][9]) // lai - Cot 9
          orderedCount += parseInt(orderListDetail[oldi][5]) // So luong - Cot 5
        }
      }

      detailReport += rcount + ","
        + data[productIndex][3] + ","
        + count + ","
        + eachCost + ","
        + (count * eachCost) + ","
        + orderedCount + ","
        + revenue + ","
        + interest
        + "\n";

      totalRevenue += revenue;
      totalInterest += interest;
    }
  }
  )
  downloadContent += "-, Tổng số lượng, " + num + "\n";
  downloadContent += "-, Tổng tiền, " + totalCost;

  detailReport += "-, Tổng số lượng hàng, " + num + "\n";
  detailReport += "-, Tổng vốn, " + totalCost + "\n";
  detailReport += "-, Tổng doanh thu, " + totalRevenue + "\n";
  detailReport += "-, Tổng lợi nhuận, " + totalInterest + "\n";
  detailReport += "-, Tổng tiền vốn cho hàng tồn," + stillInStoreTotalCost + "\n";
  detailReport += "-, Số lượng hàng tồn," + stillInStore;

  var content = "Tổng tiền vốn: " + totalCost + " <br/>" +
    "Tổng số lượng (toàn bộ): " + num + " <br/>" +
    // "Tổng số lượng đã yêu cầu giao: "+requestedNum+" <br/>"+
    "Tổng tiền vốn cho hàng tồn:" + stillInStoreTotalCost + "<br/>" +
    "Số lượng hàng tồn: " + stillInStore + " <br/>" +
    "<div class='btn btn-primary mb-2 downloadProds'>Tải CSV file</div>&nbsp;" +
    "<div class='btn btn-primary mb-2 viewProds'>Xem bảng (gửi cho bên bán hàng)</div>" +
    "<div class='btn btn-primary mb-2 viewProdsReport'>Xem báo cáo doanh thu/lợi nhuận</div>" +
    "<hr/>" +
    "<div class='btn btn-primary mb-2 changeImport'>Sửa đợt hàng</div>" +
    "<input type='text' class='form-control changeToNewImportInput' id='changeToNewImportInput' />" +
    " <br/>";

  $("#modelContent").html(content);
  $("#modalYes").click(function () {
  })
  $('#myModal').modal('toggle');
  $(".downloadProds").click(function () {
    downloadFile("hang.csv", downloadContent);
  })
  $(".viewProds").click(function () {
    var ls1 = downloadContent.split("\n");
    var ls2 = [];
    for (s in ls1) {
      ls2.push(ls1[s].split(","));
    }
    console.log(ls2);
    localStorage.setItem("tmp", JSON.stringify(ls2));
    window.location = "../manager/viewtmp.html";

  })

  $(".viewProdsReport").click(function () {
    var ls1 = detailReport.split("\n");
    var ls2 = [];
    for (s in ls1) {
      ls2.push(ls1[s].split(","));
    }
    console.log(ls2);
    localStorage.setItem("tmp", JSON.stringify(ls2));
    window.location = "../manager/viewtmp.html";

  })


  var chooseImportScheduleCodeToChange = "";

  $(".changeToNewImportInput").empty();

  $(".changeToNewImportInput").autocomplete({
    source: function (request, response) {
      console.log("filter")
      console.log(request);
      console.log(lsAutoImportSchedule);
      var results = $.ui.autocomplete.filter(lsAutoImportSchedule, request.term);
      console.log(results);
      response(results.slice(0, 1000));
    },
    select: function (event, ui) {
      chooseImportScheduleCodeToChange = ui.item.importCode;
    }
  });

  $(".changeImport").click(function () {
    var newImport = chooseImportScheduleCodeToChange; //$(".changeToNewImportInput").val();
    console.log("newImport:", newImport);
    if (newImport) {
      var lsProductIndex = [];
      $('.checkbox').each(function () {
        // this.checked = true; });
        if (this.checked) {
          var productIndex = $(this).attr("class").split(" ").pop().split("_").pop();
          console.log(data[productIndex])
          var proIndex = parseInt(productIndex) + 1;
          lsProductIndex.push({
            index: proIndex,
            productCode: data[productIndex][0],
            productRefCode: data[productIndex][1],
            importCode: data[productIndex][2],
            productName: data[productIndex][3]
          });
        }
      }
      )
      console.log(lsProductIndex);

      $("#loadingSpin").show();


      function changeOrderDetailBasedOnReferedProductCode(referedProductCode, orderDetailCallback) {
        console.log("changeOrderDetailBasedOnReferedProductCode:", referedProductCode);
        $("#loading-text").html("Sửa mặt hàng:" + referedProductCode + " trong bảng đơn hàng chi tiết");

        var orderListDetail = JSON.parse(localStorage.getItem("orderListDetail"));
        var prodIndexInDetailList = [];
        for (var e in orderListDetail) {
          if (orderListDetail[e][3] == referedProductCode) {
            prodIndexInDetailList.push({
              index: (parseInt(e) + 1),
              productCode: orderListDetail[e][1],
              productRefCode: orderListDetail[e][3],
              importCode: orderListDetail[e][2],
              orderCode: orderListDetail[e][0],
              productName: orderListDetail[e][4],
            });
          }
        }

        // console.log(prodIndexInDetailList);

        function fixOneByOneOrderDetail(index, callback) {
          if (index < prodIndexInDetailList.length) {
            var sheetOrderDetail = "OrderDetail";
            var rangeEdit = sheetOrderDetail + '!C' + prodIndexInDetailList[index].index + ':C' + prodIndexInDetailList[index].index;
            var dataEditOD = [[newImport]]
            // console.log("ready to push");
            // console.log(prodIndexInDetailList[index]);
            // console.log(dataEditOD);
            // console.log(rangeEdit);

            editOrderDetail(dataEditOD, rangeEdit, function () {

              $("#loading-text").html("Cập nhật đợt hàng:" + prodIndexInDetailList[index].orderCode + " cho " + prodIndexInDetailList[index].productName);

              fixOneByOneOrderDetail(index + 1, callback);
            })


          } else {
            callback();
          }
        }

        // console.log(prodIndexInDetailList);
        fixOneByOneOrderDetail(0, orderDetailCallback);
      }
      function changeImport(index, importCallback) {
        if (index < lsProductIndex.length) {
          var proIndex = lsProductIndex[index].index;
          var sheetrange = 'Product!C' + proIndex + ':' + 'C' + proIndex;
          var dataEditP = [[newImport]]
          // console.log("Change Import:",lsProductIndex[index].productRefCode, "   index:",index)
          $("#loading-text").html("Sửa mặt hàng:" + lsProductIndex[index].productRefCode + " trong bảng danh sách hàng");

          editProduct(dataEditP, sheetrange, function () {
            setTimeout(function () {
              changeOrderDetailBasedOnReferedProductCode(lsProductIndex[index].productRefCode, function () {
                // console.log("Done changeOrderDetailBasedOnReferedProductCode");
                changeImport(index + 1, importCallback);
              })

            }, 2000)
          }, function () {
            $("#loadingSpin").hide();

            $("#modelContent").html("Có lỗi, không thể lưu, dừng việc thay đổi");
            $('#myModal').modal('toggle');
            importCallback();
          }
          )

        } else {
          $("#loadingSpin").hide();
          importCallback();
        }
      }

      changeImport(0, function () {
        console.log("CHange Import done");
        $("#modelContent").html("Hoàn thành, việc cập nhật này không cập nhật bên giao hàng, hãy yêu cầu giao hàng lại");
        $('#myModal').modal('show');
      });
    }
  })
})



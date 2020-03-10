
currentImport = JSON.parse(localStorage.getItem("currentImport"));

$("#importCode").val(currentImport.importCode);

$("#importName").val(currentImport.importName);

$("#importShippingFee").val(currentImport.importShippingFee);

$("#receiverPhone").val(currentImport.receiverPhone);
$("#receiverAddress").val(currentImport.receiverAddress);
$("#receiverName").val(currentImport.receiverName);
$("#bankingAccountNumber").val(currentImport.bankingAccountNumber);
$("#bankingName").val(currentImport.bankingName);


var mode = "edit";//new

$("#newCopyImport").click(function(){
  $("#editImport").html("Thêm đợt hàng");
  mode = "new";
  getLatestImportCode(function(importCode){
      // $("#loadingSpin").show();
    $("#importCode").val(importCode);
  })
})

function editImport(){
	var submitImportData = [
        [
            $("#importCode").val(),
            $("#importName").val(),
            currentImport.importStatus,
            $("#importShippingFee").val(),
            "=sumif(Product!C:C,INDIRECT(ADDRESS(ROW(),1)),Product!R:R)",
            "'"+$("#receiverPhone").val(),
            $("#receiverAddress").val(),
            $("#receiverName").val(),
            $("#bankingAccountNumber").val(),
            $("#bankingName").val(),
            "=sumif(Product!C:C,INDIRECT(ADDRESS(ROW(),1)),Product!P:P)"
        ]
    ]
    
    $("#loadingSpin").show();
    
    var indexColumnOfAllData = 10;

    var sheetrange = 'Warehouse!A'+currentImport.importIndex+':'+String.fromCharCode(65+indexColumnOfAllData)+''+currentImport.importIndex;

    if (mode == "edit") {
        editWarehouse(submitImportData, sheetrange,function(){
            $("#loadingSpin").hide();
            // $("#modelContent").html("Đã lưu thông tin");
            // $('#myModal').modal('toggle');
            window.location = "warehouse.html";
        })
    } else {
        appendWarehouse(submitImportData,function(){
            $("#loadingSpin").hide();
            window.location = "warehouse.html";
        })
    }
}

$("#editImport").click(editImport);
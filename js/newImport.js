var url = new URL(window.location.href);

var makeCopy = url.searchParams.get("makeCopy");

if (makeCopy) {
  currentImport = JSON.parse(localStorage.getItem("currentImport"));
  console.log(currentImport);
  $("#importName").val(currentImport.importName);

  $("#receiverPhone").val(currentImport.receiverPhone);
  $("#receiverAddress").val(currentImport.receiverAddress);
  $("#receiverName").val(currentImport.receiverName);
  $("#bankingAccountNumber").val(currentImport.bankingAccountNumber);
  $("#bankingName").val(currentImport.bankingName);
}

var triggerAfterLoad = function(){

  // $("#loadingSpin").show();

  getLatestImportCode(function(importCode){
      // $("#loadingSpin").show();
    $("#importCode").val(importCode);
  })
}


function addNewImport(){
	var submitImportData = [
      [
        $("#importCode").val(),
        $("#importName").val(),
        0,
        $("#importShippingFee").val(),
        "=sumif(Product!C:C;INDIRECT(ADDRESS(ROW();1));Product!R:R)",
        "'"+$("#receiverPhone").val(),
        $("#receiverAddress").val(),
        $("#receiverName").val(),
        $("#bankingAccountNumber").val(),
        $("#bankingName").val(),
        "=sumif(Product!C:C;INDIRECT(ADDRESS(ROW();1));Product!P:P)"
      ]
    ]
    
    $("#loadingSpin").show();

    appendWarehouse(submitImportData,function(){
        $("#loadingSpin").hide();
        // $("#modelContent").html("Đã lưu thông tin");
        // $('#myModal').modal('toggle');
        window.location = "warehouse.html";
    })
}

$("#addNewImport").click(addNewImport);
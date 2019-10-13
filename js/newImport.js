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
        "=sumif(Product!C:C,INDIRECT(ADDRESS(ROW(),1)),Product!R:R)",
        $("#receiverPhone").val(),
        $("#receiverAddress").val(),
        $("#receiverName").val(),
        $("#bankingAccountNumber").val(),
        $("#bankingName").val()
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
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
  var ckValidate = validateInputData();

  if (!ckValidate) {
    return false;
  }
  
	var submitImportData = [
      [
        $("#importCode").val(),
        $("#importName").val(),
        0,
        $("#importShippingFee").val(),
        "=sumif(Product!C:C;INDIRECT(ADDRESS(ROW();1));Product!R:R)",
        "'"+$("#receiverPhone").val(),
        "'"+$("#receiverAddress").val(),
        "'"+$("#receiverName").val(),
        "'"+$("#bankingAccountNumber").val(),
        "'"+$("#bankingName").val(),
        "=sumif(Product!C:C;INDIRECT(ADDRESS(ROW();1));Product!P:P)"
      ]
    ]
    
    $("#loadingSpin").show();

    appendWarehouse(submitImportData,function(){
        $("#loadingSpin").hide();
        // $("#modelContent").html("Đã lưu thông tin");
        // $('#myModal').modal('toggle');
        window.location = "../manager/warehouse.html";
    })
}

$("#addNewImport").click(addNewImport);

function validateInputData() {
	
  var importCode = $("#importCode").val();
  var importName = $("#importName").val();

	var warningContent = undefined;
	if (!importCode) {
		warningContent = "Không có mã đợt hàng!"
	}
	if (!importName) {
		warningContent = "Không có tên đợt hàng kìa!"
	}
	if (warningContent) {
      $("#modelContent").html(warningContent);
      $('#myModal').modal('toggle');
		return false;
	} else {
		return true;
	}
}


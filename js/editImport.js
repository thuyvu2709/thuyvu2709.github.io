
currentImport = JSON.parse(localStorage.getItem("currentImport"));

$("#importCode").val(currentImport.importCode);

$("#importName").val(currentImport.importName);

$("#importShippingFee").val(currentImport.importShippingFee);


function editImport(){
	var submitImportData = [
        [
            $("#importCode").val(),
            $("#importName").val(),
            currentImport.importStatus,
            $("#importShippingFee").val(),
            "=sumif(Product!C:C,INDIRECT(ADDRESS(ROW(),1)),Product!R:R)"
        ]
    ]
    
    $("#loadingSpin").show();
    
    var indexColumnOfAllData = 4;

    var sheetrange = 'Warehouse!A:'+String.fromCharCode(65+indexColumnOfAllData);

    editWarehouse(submitImportData,function(){
        $("#loadingSpin").hide();
        // $("#modelContent").html("Đã lưu thông tin");
        // $('#myModal').modal('toggle');
        window.location = "warehouse.html";
    })
}

$("#editImport").click(editImport);
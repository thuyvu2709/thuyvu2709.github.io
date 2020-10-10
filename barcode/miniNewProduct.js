function newMiniProduct(index){
	console.log("newMiniProduct");
	$("#myModal2 .modal-body").empty();
	$("#myModal2 .modal-title").html('<h2 class="text-center">Thêm mặt hàng</h2>');

	var body = ''+
	''+
	'    <form class="needs-validation container" novalidate>'+
	''+
	'      <div class="form-group row">'+
	'        <label for="productCode" class="col-sm-2 col-form-label">Mã sản phẩm</label>'+
	'        <div class="col-sm-10">'+
	'          <input type="text" class="form-control" id="miniproductCode" placeholder="Mã sản phẩm">'+
	'<!--           <button class="btn btn-primary mb-2">Quét mã</button>'+
	' -->          '+
	''+
	'<!--           <div style=\'height: 0px;width:0px; overflow:hidden;\'>'+
	'            <input id="miniscanBarcode" type="file" class="btn btn-primary mb-2" accept="image/*;capture=camera" />'+
	'          </div>'+
	'          <button class="btn btn-primary mb-2" id="minibtnScan">Quét mã vạch</button>'+
	' -->'+
	'        </div>'+
	'      </div>'+
	''+
	'      <div class="form-group row">'+
	'        <label for="importSchedule" class="col-sm-2 col-form-label">Đợt hàng</label>'+
	'          <div class="col-sm-10">'+
	'            <select class="mdb-select md-form" id="miniimportSchedule"'+
	'              style="width: 100%">'+
	'              <option disabled>Chọn đợt hàng</option>'+
	'            </select>'+
	'          </div>'+
	'      </div>'+
	'      '+
	'      <div class="form-group row">'+
	'        <label for="productName" class="col-sm-2 col-form-label">Tên sản phẩm</label>'+
	'          <div class="col-sm-10">'+
	'          <input type="text" class="form-control" id="miniproductName" placeholder="Tên sản phẩm" required>'+
	'        </div>'+
	'      </div>'+
	''+
	'      <div class="form-group row">'+
	'        <label for="productCount" class="col-sm-2 col-form-label">Số lượng</label>'+
	'        <div class="col-sm-10">'+
	'          <input type="number" class="form-control" id="miniproductCount" placeholder="0" required>'+
	'        </div>'+
	'      </div>'+
	// ''+
	// '      <div class="form-group row">'+
	// '        <label for="productOriginalCostEur" class="col-sm-2 col-form-label">Giá gốc (EUR)</label>'+
	// '        <div class="col-sm-10">'+
	// '          <input type="number" class="form-control" id="miniproductOriginalCostEur" placeholder="0" required>'+
	// '        </div>'+
	// '      </div>'+
	// ''+
	// '      <div class="form-group row">'+
	// '        <label for="productWeight" class="col-sm-2 col-form-label">Trọng lượng (kg)</label>'+
	// '        <div class="col-sm-10">'+
	// '          <input type="number" class="form-control" id="miniproductWeight" placeholder="0.00 kg">'+
	// '        </div>'+
	// '      </div>'+
	// ''+
	// '      <div class="form-group row">'+
	// '        <label for="shipInternationalFee" class="col-sm-2 col-form-label">Cước vận chuyển quốc tế (EUR)</label>'+
	// '        <div class="col-sm-10">'+
	// '          <input type="number" class="form-control" id="minishipInternationalFee" placeholder="0 EUR">'+
	// '        </div>'+
	// '      </div>'+
	// ''+
	// '      <div class="form-group row" style="display:none">'+
	// '        <label for="shipItalyFee" class="col-sm-2 col-form-label">Cước vận chuyển trong Italy (EUR)</label>'+
	// '        <div class="col-sm-10">'+
	// '          <input type="number" class="form-control" id="minishipItalyFee" placeholder="0 EUR">'+
	// '        </div>'+
	// '      </div>'+
	// ''+
	// '      <div class="form-group row" style="display:none">'+
	// '        <label for="shipVietnamFee" class="col-sm-2 col-form-label">Cước vận chuyển trong Việt Nam (VND) </label>'+
	// '        <div class="col-sm-10">'+
	// '          <input type="number" class="form-control" id="minishipVietnamFee" placeholder="0 VND">'+
	// '        </div>'+
	// '      </div>'+
	// ''+
	// '      <div class="form-group row" style="display:none">'+
	// '        <label for="otherFee" class="col-sm-2 col-form-label">Chi phí khác (VND) </label>'+
	// '        <div class="col-sm-10">'+
	// '          <input type="number" class="form-control" id="miniotherFee" placeholder="0 VND">'+
	// '        </div>'+
	// '      </div>'+
	''+
	'      <div class="form-group row">'+
	'        <label for="productEstimateVND" class="col-sm-2 col-form-label">Giá gốc sản phẩm (VND) </label>'+
	'        <div class="col-sm-10">'+
	'          <input type="number" class="form-control" id="miniproductEstimateVND" placeholder="0 VND">'+
	'        </div>'+
	'      </div>'+
	''+
	'      <div class="form-group row">'+
	'        <label for="productEstimateSellingVND" class="col-sm-2 col-form-label">Giá bán lẻ (VND) </label>'+
	'        <div class="col-sm-10">'+
	'          <input type="number" class="form-control" id="miniproductEstimateSellingVND" placeholder="0 VND">'+
	'        </div>'+
	'      </div>'+
	// ''+
	// '      <div class="form-group row">'+
	// '        <label for="productEstimateSellingVND" class="col-sm-2 col-form-label">Giá bán CTV (VND) </label>'+
	// '        <div class="col-sm-10">'+
	// '          <input type="number" class="form-control" id="miniproductEstimateSellingCTV" placeholder="0 VND">'+
	// '        </div>'+
	// '      </div>'+
	// ''+
	// '      <div class="form-group row">'+
	// '        <label for="productUrl" class="col-sm-2 col-form-label">Đường dẫn SP</label>'+
	// '        <div class="col-sm-10">'+
	// '          <input type="text" class="form-control" id="miniproductUrl" placeholder="">'+
	// '        </div>'+
	// '      </div>'+
	''+
	'      <div class="form-group row">'+
	'        <div style=\'height: 0px;width:0px; overflow:hidden;\'>'+
	'          <input id="miniprodScanImage" type="file" class="btn btn-primary mb-2" accept="image/*;capture=camera" />'+
	'        </div>'+
	''+
	'        <label for="productImage" class="btn btn-primary col-sm-2 col-form-label" id="minibtnAddImage">Thêm hình ảnh </label>'+
	'        <div class="col-sm-10">'+
	'          <input type="text" id="miniprodImageLink" class="form-control" placeholder="Đường dẫn hình ảnh" />'+
	'        </div>'+
	''+
	'      </div>'+
	// ''+
	// '      <div class="form-group column">'+
	// '        <label class="col-sm-2 col-form-label">Thông tin tham khảo </label>'+
	// '        <label class="col-sm-2 col-form-label">'+
	// '          Lãi xuất/SP:'+
	// '          <p id="miniprofitPerOneProduct">0</p>'+
	// '        </label>'+
	// '        <label class="col-sm-2 col-form-label">'+
	// '          Doanh thu:'+
	// '          <p id="miniturnover">0</p>'+
	// '        </label>'+
	// '        <label class="col-sm-2 col-form-label">'+
	// '          Tổng tiền vốn (VND):'+
	// '          <p id="minitotalCost">0</p>'+
	// '        </label>'+
	// '        <label class="col-sm-2 col-form-label">'+
	// '          Lãi xuất tổng:'+
	// '          <p id="minitotalProfit">0</p>'+
	// '        </label>'+
	// '      </div>'+
	''+
	'      <div class="btn btn-primary mb-2" id="miniaddNewProduct">Thêm mặt hàng</div>'+
	'      <div class="btn btn-primary mb-2" id="minibtnRefresh">Xoá hết thông tin</div>'+
	''+
	'    </form>';

	$("#myModal2 .modal-body").append(body);

	$("#myModal2 .modal-body").css('max-height','');

	$("#myModal2 .modal-body").css('overflow','scroll');

	loadImportScheduleList(function(){
		var importSLData = JSON.parse(localStorage.getItem("warehouse"));
		// console.log(importSLData);
		$("#miniimportSchedule").empty();
		$("#miniimportSchedule").append("<option disabled selected>Chọn đợt hàng</option>");
		for (var e in importSLData) {
			if (e ==0) {
				continue;
			}
			$("#miniimportSchedule").append("<option value='"+importSLData[e][0]+"'>"+importSLData[e][0]+" - "+importSLData[e][1]+"</option>")
		}
		getLatestProductCode(function(code){
			$("#miniproductCode").val(code);
		})
	})

	$("#miniaddNewProduct").click(function(){
		addNewMiniProduct(index);
	})

	$('#myModal2').modal('toggle');

	$('#minibtnAddImage').click(function() {
		// $("#picture").css.visibility = "visible";
		document.getElementById("miniprodScanImage").click();
	})

	$("#miniprodScanImage").on("change", function() {
		$("#loadingSpin").show();

	    var $files = $(this).get(0).files;

	    if ($files.length) {

	      // Reject big files
	      if ($files[0].size > $(this).data("max-size") * 1024) {
	        console.log("Please select a smaller file");
	        return false;
	      }

	      // Begin file upload
	      console.log("Uploading file to Imgur..");

	      // Replace ctrlq with your own API key
	      var apiUrl = 'https://api.imgur.com/3/image';
	      var apiKey = 'bddc38af21c5d9a';

	      var settings = {
	        async: false,
	        crossDomain: true,
	        processData: false,
	        contentType: false,
	        type: 'POST',
	        url: apiUrl,
	        headers: {
	          Authorization: 'Client-ID ' + apiKey,
	          Accept: 'application/json'
	        },
	        mimeType: 'multipart/form-data'
	      };

	      var formData = new FormData();
	      formData.append("image", $files[0]);
	      settings.data = formData;

	      // Response contains stringified JSON
	      // Image URL available at response.data.link
	      $.ajax(settings).done(function(response) {
	        console.log(response);
	        console.log("link:"+JSON.parse(response).data.link);
	        $("#miniprodImageLink").val(JSON.parse(response).data.link);
	    	$("#loadingSpin").hide();

	      });

	    }
	  });

}

function addNewMiniProduct(index){
	$("#loadingSpin").show();

	
	var dataset = [];

	var productCode = $("#miniproductCode").val();
	var productName = $("#miniproductName").val();

	var productCount = $("#miniproductCount").val();

	var productOriginalCostEur = $("#miniproductOriginalCostEur").val();

	var productWeight = $("#miniproductWeight").val();
	var shipInternationalFee = $("#minishipInternationalFee").val();
	var shipItalyFee = $("#minishipItalyFee").val();

	var productUrl = $("#miniproductUrl").val();

	var otherFee = $("#miniotherFee").val();

	var shipVietnamFee = $("#minishipVietnamFee").val();

	var productEstimateVND = $("#miniproductEstimateVND").val();

	var productEstimateSellingVND = $("#miniproductEstimateSellingVND").val();

	var productEstimateSellingCTV = $("#miniproductEstimateSellingCTV").val();

	var profitPerOneProduct = $("#miniprofitPerOneProduct").html();

	var turnover = $("#miniturnover").html();

	var totalCost = $("#minitotalCost").html();

	var totalProfit = $("#minitotalProfit").html();

	var prodImageLink = $("#miniprodImageLink").val();

	var importCode = document.getElementById("miniimportSchedule").value;


	productWeight = productWeight ? productWeight : 0;
	shipInternationalFee = shipInternationalFee ? shipInternationalFee : 0;
	shipItalyFee = shipItalyFee ? shipItalyFee : 0;
	productUrl = productUrl ? productUrl : "0";
	shipVietnamFee = shipVietnamFee ? shipVietnamFee : 0;
	productOriginalCostEur = productOriginalCostEur ? productOriginalCostEur : 0;
	otherFee = otherFee ? otherFee : 0;
	productEstimateVND = productEstimateVND ? productEstimateVND : 0;
	
	productEstimateSellingCTV = productEstimateSellingCTV ? productEstimateSellingCTV : productEstimateVND;

	prodImageLink = prodImageLink ? prodImageLink : "";
	// console.log(productCode)
	var dataContent = [productCode, //0 A
                '=CONCATENATE(INDIRECT(ADDRESS(ROW(),3)),"_",INDIRECT(ADDRESS(ROW(),1)))',//1 B
                importCode, //2 C
                productName, //3 D
                productCount, //4 E
                productOriginalCostEur, //5 F
                productWeight, //6 G
                shipInternationalFee, //7 H
                productUrl, //8 I
                shipVietnamFee, //9 J
                otherFee, //10 K
                productEstimateVND, //11 L
                productEstimateSellingVND, //12 M
				"=INDIRECT(ADDRESS(ROW(),13)) - INDIRECT(ADDRESS(ROW(),12))", //13 N
				"=INDIRECT(ADDRESS(ROW(),13))*INDIRECT(ADDRESS(ROW(),5))", //14 O
				"=INDIRECT(ADDRESS(ROW(),12))*INDIRECT(ADDRESS(ROW(),5))", //15 P
				"=INDIRECT(ADDRESS(ROW(),15)) - INDIRECT(ADDRESS(ROW(),16))", //16 Q
				"=INDIRECT(ADDRESS(ROW(),5)) - SUMIF(OrderDetail!D:D,INDIRECT(ADDRESS(ROW(),2)),OrderDetail!F:F)", //17 R
				"=INDIRECT(ADDRESS(ROW(),12)) * INDIRECT(ADDRESS(ROW(),18))", //18 S
				prodImageLink, //19 T
				productEstimateSellingCTV,
				'=SUMIF(OrderDetail!D:D,INDIRECT(ADDRESS(ROW(),2)),OrderDetail!L:L)'
                ]
	var dataAppendProduct = [
                dataContent
            ];

	appendProduct(dataAppendProduct, function(){
		$("#loadingSpin").hide();
		productList.push(dataContent);
		triggerNextProcessNewOrder(index, productCode, productList.length - 1);
		$('#myModal2').modal('toggle');

	}, function(){
		$("#loadingSpin").hide();
		$("#myModal2 .modal-body").html("Có lỗi không thể lưu");

		// $('#myModal2').modal('toggle');
	}); 	
}
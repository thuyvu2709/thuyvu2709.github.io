// sendEmail.js

function sendOrderViaEmail(receiver,cc, currentOrder, callback) {
	// currentOrder = JSON.parse(localStorage.getItem("currentOrder"));
	var address = currentOrder.customerAddress.replace(/[|&;$%@"<>()+,]/g, "").trim().replace(" ","+");

	var prodListOrder = currentOrder.prodListOrder;
	var otable = "";
	for (var i in prodListOrder){
		if (prodListOrder[i].delete) {
			continue;
		}
		otable = otable + ("<tr>"+
	    "<td>"+(parseInt(i)+1)+"</td>"+
	    "<td>"+prodListOrder[i].productName+"</td>"+
	    "<td>"+prodListOrder[i].productCount+"</td>"+
	    "<td>"+prodListOrder[i].productEstimateSellingVND+"</td>"+
	  "</tr>")
	}

	var myvar = ' '+
	'<!DOCTYPE html>'+
	'<html lang="en">'+
	'  <head>'+
	'    <meta charset="utf-8">'+
	'      <style type="text/css">'+
	'.form-style-1 {'+
	'  margin:10px auto;'+
	'  padding: 20px 12px 10px 20px;'+
	'  font: 13px "Lucida Sans Unicode", "Lucida Grande", sans-serif;'+
	'}'+
	'.form-style-1 li {'+
	'  padding: 0;'+
	'  display: block;'+
	'  list-style: none;'+
	'  margin: 10px 0 0 0;'+
	'}'+
	'.form-style-1 label{'+
	'  margin:0 0 3px 0;'+
	'  padding:0px;'+
	'  display:block;'+
	'  font-weight: bold;'+
	'}'+
	''+
	'.form-style-1 .field-divided{'+
	'  width: 49%;'+
	'}'+
	''+
	'.form-style-1 .field-long{'+
	'  width: 100%;'+
	'}'+
	'.form-style-1 .field-select{'+
	'  width: 100%;'+
	'}'+
	'.form-style-1 .field-textarea{'+
	'  height: 100px;'+
	'}'+
	'.form-style-1 .required{'+
	'  color:red;'+
	'}'+
	'.inputField {'+
	'  border: 1px solid rgba(0, 0, 0, 0.35);'+
	'  padding: 5px ! important;'+
	'}'+
	'.text-center{'+
	'  text-align:center;'+
	'}'+
	'.title {'+
	'  color: #c57e0f !important;'+
	'  text-align:center;'+
	'}'+
	'.code-label {'+
	'  color: white;'+
	'  background-color: #c57e0f;'+
	'  font-size: 32px;'+
	'  font-weight: bold;'+
	'  text-align:center;'+
	'}'+
	'table, td, th {'+
	'  border: 1px solid black;'+
	'  text-align : center;'+
	'}'+
	''+
	'table {'+
	'  border-collapse: collapse;'+
	'  width: 100%;'+
	'}'+
	'</style>'+
	'  </head>'+
	'  <body id="page-top">'+
	'    <h1 class="text-center title">Xách tay Thuỷ Vũ - Góc Hàng Âu</h1>'+
	'    <form>'+
	'      <ul class="form-style-1">'+
	'        <li>'+
	'          <label>Mã đơn hàng</label>'+
	'          <label class="inputField">'+currentOrder.orderCode+'</label>'+
	'        </li>'+
	'        <li>'+
	'          <label>Tên khách hàng</label>'+
	'          <label class="inputField">'+currentOrder.customerName+'</label>'+
	'        </li>'+
	'        <li>'+
	'          <label>Địa chỉ khách hàng</label>'+
	'          <label class="inputField"><a href="http://maps.google.com/maps?q='+address+'">'+currentOrder.customerAddress+'</a></label>'+
	'        </li>'+
	'        <li>'+
	'          <label>Số điện thoại khách hàng</label>'+
	'          <label class="inputField"><a href="tel:'+currentOrder.customerPhone+'">'+currentOrder.customerPhone+'</a></label>'+
	'        </li>'+
	'        <li>'+
	'          <table style="width: 100%;border-collapse: collapse;">'+
	'            <tr>'+
	'              <th>STT</th>'+
	'              <th>Tên hàng</th>'+
	'              <th>Số lượng</th>'+
	'              <th>Giá bán</th>'+
	'            </tr>'+
	'            <tbody id = "lsTable">'+otable+'</tbody>'+
	'          </table>'+
	'        </li>'+
	'        <li>'+
	'          <label>Phí giao hàng</label>'+
	'          <label class="inputField">'+currentOrder.shippingCost+'</label>'+
	'        </li>'+
	'        <li>'+
	'          <label>Tổng tiền thanh toán : </label>'+
	'          <label class="inputField">'+currentOrder.totalPayIncludeShip+'</label>'+
	'        </li>'+
	'        <li>'+
	'          <label>Ghi chú</label>'+
	'          <textarea name="field5" id="field5" class="field-long field-textarea" readonly/>'+currentOrder.orderNode+'</textarea>'+
	'		 </li>'+
	'      </ul>'+
	'      <h2 class="text-center">Cảm ơn quý khách đã mua hàng của chúng tôi</h2>'+
	'    </form>'+
	'  </body>'+
	'</html>';

	// console.log(myvar);
	// return myvar;

	var emailContent = myvar;
	var subject = currentOrder.orderCode + " - " +removeSpecialAlias(currentOrder.customerAddress).toUpperCase();

    var headers_obj = {
            'To': receiver,
            'CC' : cc,
            'Subject': subject,
            'Content-Type': 'text/html; charset="UTF-8"'
          };

	sendEmail(headers_obj,emailContent, callback);
}

function sendToShipperViaEmail(currentOrder, status) {
	var roles = getSpecificRoles();
	var receiver = roles["shipper"];
	var cc = roles["manager"];
	notiOrderViaEmail(receiver, cc,currentOrder, status);
}

function sendToManagerViaEmail(currentOrder, status) {
	var roles = getSpecificRoles();
	var receiver = roles["manager"];
	var cc = roles["shipper"];
	notiOrderViaEmail(receiver, cc,currentOrder, status);
}

function notiOrderViaEmail(receiver,cc, currentOrder, status) {
	// currentOrder = JSON.parse(localStorage.getItem("currentOrder"));
	var address = currentOrder.customerAddress.replace(/[|&;$%@"<>()+,]/g, "").trim().replace(" ","+");

	// var prodListOrder = currentOrder.prodListOrder;

	var myvar = ' '+
	'<!DOCTYPE html>'+
	'<html lang="en">'+
	'  <head>'+
	'    <meta charset="utf-8">'+
	'      <style type="text/css">'+
	'.form-style-1 {'+
	'  margin:10px auto;'+
	'  padding: 20px 12px 10px 20px;'+
	'  font: 13px "Lucida Sans Unicode", "Lucida Grande", sans-serif;'+
	'}'+
	'.form-style-1 li {'+
	'  padding: 0;'+
	'  display: block;'+
	'  list-style: none;'+
	'  margin: 10px 0 0 0;'+
	'}'+
	'.form-style-1 label{'+
	'  margin:0 0 3px 0;'+
	'  padding:0px;'+
	'  display:block;'+
	'  font-weight: bold;'+
	'}'+
	''+
	'.form-style-1 .field-divided{'+
	'  width: 49%;'+
	'}'+
	''+
	'.form-style-1 .field-long{'+
	'  width: 100%;'+
	'}'+
	'.form-style-1 .field-select{'+
	'  width: 100%;'+
	'}'+
	'.form-style-1 .field-textarea{'+
	'  height: 100px;'+
	'}'+
	'.form-style-1 .required{'+
	'  color:red;'+
	'}'+
	'.inputField {'+
	'  border: 1px solid rgba(0, 0, 0, 0.35);'+
	'  padding: 5px ! important;'+
	'}'+
	'.text-center{'+
	'  text-align:center;'+
	'}'+
	'.title {'+
	'  color: #c57e0f !important;'+
	'  text-align:center;'+
	'}'+
	'.code-label {'+
	'  color: white;'+
	'  background-color: #c57e0f;'+
	'  font-size: 32px;'+
	'  font-weight: bold;'+
	'  text-align:center;'+
	'}'+
	'table, td, th {'+
	'  border: 1px solid black;'+
	'  text-align : center;'+
	'}'+
	''+
	'table {'+
	'  border-collapse: collapse;'+
	'  width: 100%;'+
	'}'+
	'</style>'+
	'  </head>'+
	'  <body id="page-top">'+
	'    <form>'+
	'      <ul class="form-style-1">'+
	'		 <li>'+
    '		   <label class="inputField" style="color: white;background-color: #c57e0f;">'+status+'</label>'+
	'        </li>'+
	'    <h1 class="text-center title">Xách tay Thuỷ Vũ - Góc Hàng Âu</h1>'+
	'        <li>'+
	'          <label>Mã đơn hàng</label>'+
	'          <label class="inputField">'+currentOrder.orderCode+'</label>'+
	'        </li>'+
	'        <li>'+
	'          <label>Tên khách hàng</label>'+
	'          <label class="inputField">'+currentOrder.customerName+'</label>'+
	'        </li>'+
	'        <li>'+
	'          <label>Địa chỉ khách hàng</label>'+
	'          <label class="inputField"><a href="http://maps.google.com/maps?q='+address+'">'+currentOrder.customerAddress+'</a></label>'+
	'        </li>'+
	'        <li>'+
	'          <label>Số điện thoại khách hàng</label>'+
	'          <label class="inputField"><a href="tel:'+currentOrder.customerPhone+'">'+currentOrder.customerPhone+'</a></label>'+
	'        </li>'+
	'        <li>'+
	'          Truy cập hệ thống để xem các thông tin khác'+
	'        </li>'+
	'        <li>'+
	'          <label>Ghi chú</label>'+
	'          <textarea name="field5" id="field5" class="field-long field-textarea" readonly/>'+currentOrder.orderNode+'</textarea>'+
	'		 </li>'+
	'      </ul>'+
	'    </form>'+
	'  </body>'+
	'</html>';

	// console.log(myvar);
	// return myvar;

	var emailContent = myvar;
	var subject = currentOrder.orderCode + "-" +removeSpecialAlias(currentOrder.customerName).toUpperCase()+"-"+status;

    var headers_obj = {
            'To': receiver,
            'CC' : cc,
            'Subject': subject,
            'Content-Type': 'text/html; charset="UTF-8"'
          };

	sendEmail(headers_obj,emailContent, function(){
		console.log("Send email");
	});	
}

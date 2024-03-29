
function createAnGHTKOrder(dataOrder, callback){
	// var dataOrder = {
	//     "products": [{
	//         "name": "bút",
	//         "weight": 0.1,
	//         "quantity": 1
	//     }, {
	//         "name": "tẩy",
	//         "weight": 0.2,
	//         "quantity": 1
	//     }],
	//     "order": {
	//         "id": "a4",
	//         "pick_name": "HCM-nội thành",
	//         "pick_address": "590 CMT8 P.11",
	//         "pick_province": "TP. Hồ Chí Minh",
	//         "pick_district": "Quận 3",
	//         "pick_ward": "Phường 1",
	//         "pick_tel": "0911222333",
	//         "tel": "0911222333",
	//         "name": "GHTK - HCM - Noi Thanh",
	//         "address": "123 nguyễn chí thanh",
	//         "province": "TP. Hồ Chí Minh",
	//         "district": "Quận 1",
	//         "ward": "Phường Bến Nghé",
	//         "hamlet": "Khác",
	//         "is_freeship": "1",
	//         "pick_date": "2016-09-30",
	//         "pick_money": 47000,
	//         "note": "Khối lượng tính cước tối đa: 1.00 kg",
	//         "value": 3000000,
	//         "transport": "fly"
	//     }
	// };
	$.ajax({
	  url: herokuPrefix+ghtkUrl+"/services/shipment/order/?ver=1.5",
	  headers : {
	  	"Token": ghtkToken,
	  	"Content-Type": "application/json" 
	  },
	  type: 'POST',
	  data : JSON.stringify(dataOrder),
	  success: function(res) {
	    callback(res);
	  },
	  error: function (ajaxContext) {
		try {
        	callback(JSON.parse(ajaxContext.responseText))
		}catch(e){
			callback({
				success : false,
				error: e
			})
		}
      }
	});
}

function getPickAddress(callback){

	$.ajax({
	  url: herokuPrefix+ghtkUrl+"/services/shipment/list_pick_add", 
	  headers : {
	  	"Token": ghtkToken
	  },
	  type: 'GET',
	  success: function(res) {
	    if (!res.success) {
	    	callback(undefined)
	    	return;
	    }
	    var lsAddressRaw = res.data;
	    var lsAddr = [];
	    for (ai in lsAddressRaw) {
	    	// console.log(lsAddressRaw[ai]);
	    	// var aix = lsAddressRaw[ai];
	    	// var ails = aix.address.split(",");
	    	// var ailg = ails.length;
	    	// aix.pick_province=ails[ailg-1].trim();
	    	// aix.pick_district=ails[ailg-2].trim();
	    	// aix.pick_ward=ails[ailg-3].trim();
	    	// aix.pick_address=aix.address.split(aix.pick_province).join("")
	    	// 				.split(aix.pick_district+",").join("")
	    	// 				.split(aix.pick_ward+",").join("").trim();
	    	var aix = strToAddr(lsAddressRaw[ai].address);
	    	aix.tel = lsAddressRaw[ai].pick_tel;
	    	aix.address_id = lsAddressRaw[ai].pick_address_id;
	    	aix.name = lsAddressRaw[ai].pick_name;

			lsAddr.push(aix);
	    }
	    callback(lsAddr);
	  }
	});
}

function getGHTKOrderStatus(orderId, callback){
	$.ajax({
	  url: herokuPrefix+ghtkUrl+"/services/shipment/v2/"+orderId, 
	  headers : {
	  	"Token": ghtkToken
	  },
	  type: 'GET',
	  success: function(res) {
	    // console.log(res);
	    callback(res);
	  }
	});

};
// getOrderStatus("S15549745.HN33.AD4b.935261347")

// $.ajax({
//             type : "POST",
//             url  : "https://kenkreck1004.herokuapp.com/giaohangtietkiem.vn/wp-admin/admin-ajax.php",
//             data : "action=search_package_api&orderId=S14361.MB11.M1.5.989776188&responseRecaptcha=03AGdBq268YwbYtHlLlvbibayuigGva4kmVfcGsUdYonEvvshxtLwfltbVVwH5Lm4HNYcgZed3w1pmRMoQHF2ci643MpEUtD06lCC1ZqclBv-QWtge0LI7SqdUB_J9ABpDHThMZ7352sVsXwX6LI0dQuJAviGDT_li_M8mLa7VkU7CkPBNohtjoGHt7zJaS1vS5iqQef9bV1pMKz99vs0TiFmt5ywNnIfZpPqjeQsKQou3_Pdnm6NAFF53UYnr_BtHgGbt-tP02aEGiHES6rVt-CBqAiGf6EXz5y0sOmlIkxqpiMD222ByKv_yWDfhptyRLqAEky5f3N1iwK01KBSCopAWD_GuV_jLqPojn6pNNWQhzbxM_e2Ns4GuT4AdtLheFLuVWeKgNIQtc4q38_CZVG5nNaTTQhWhG6C642uLWUf5ZvwXF9myJnhnmlbFYXap7dUpKchpnVi9",
//             success: function(res){  
//             	console.log(res)
//             },
//             error : function(err){  
//             	console.log(err)
//             }
//         });

function calculateTransportFeeAPI(data,callback){
	serialize = function(obj) {
	  var str = [];
	  for (var p in obj)
	    if (obj.hasOwnProperty(p)) {
	      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	    }
	  return str.join("&");
	};
	$.ajax({
	  url: herokuPrefix+ghtkUrl+"/services/shipment/fee?"+serialize(data), 
	  headers : {
	  	"Token": ghtkToken
	  },
	  type: 'GET',
	  success: function(res) {
	    // console.log(res);
		// fee: Object
		// a: "1"
		// cost_id: "1848"
		// delivery: true
		// delivery_type: "191211-Niemyet-Dacbiet_bay"
		// dt: "special"
		// fee: 33000
		// include_vat: "0"
		// insurance_fee: 0
		// name: "area1"
		// message: ""
		// success: true
	    if (!res) {
	    	callback(false, "Không tính được, ktr lại thông tin");
	    } else if (!res.success) {
	    	callback(false, "Không tính được, ktr lại thông tin");
	    } else {
	    	callback(true, res.fee);
	    }
	  }
	});
}
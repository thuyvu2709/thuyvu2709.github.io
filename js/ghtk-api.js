function createAnOrder(dataOrder, callback){
	var dataOrder = {
	    "products": [{
	        "name": "bút",
	        "weight": 0.1,
	        "quantity": 1
	    }, {
	        "name": "tẩy",
	        "weight": 0.2,
	        "quantity": 1
	    }],
	    "order": {
	        "id": "a4",
	        "pick_name": "HCM-nội thành",
	        "pick_address": "590 CMT8 P.11",
	        "pick_province": "TP. Hồ Chí Minh",
	        "pick_district": "Quận 3",
	        "pick_ward": "Phường 1",
	        "pick_tel": "0911222333",
	        "tel": "0911222333",
	        "name": "GHTK - HCM - Noi Thanh",
	        "address": "123 nguyễn chí thanh",
	        "province": "TP. Hồ Chí Minh",
	        "district": "Quận 1",
	        "ward": "Phường Bến Nghé",
	        "hamlet": "Khác",
	        "is_freeship": "1",
	        "pick_date": "2016-09-30",
	        "pick_money": 47000,
	        "note": "Khối lượng tính cước tối đa: 1.00 kg",
	        "value": 3000000,
	        "transport": "fly"
	    }
	};
	$.ajax({
	  url: "https://cors-anywhere.herokuapp.com/"+ghtkUrl+"/services/shipment/order/?ver=1.5",
	  headers : {
	  	"Token": ghtkToken,
	  	"Content-Type": "application/json" 
	  },
	  type: 'POST',
	  data : JSON.stringify(dataOrder),
	  success: function(res) {
	    callback(res);
	  }
	});
}

function getPickAddress(callback){
	// console.log("getPickAddress:"+ghtkToken);
	$.ajax({
	  url: "https://cors-anywhere.herokuapp.com/"+ghtkUrl+"/services/shipment/list_pick_add", 
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

function getOrderStatus(orderId){
	console.log("aaa")

	$.ajax({
	  url: "https://cors-anywhere.herokuapp.com/"+ghtkUrl+"/services/shipment/v2/"+orderId, 
	  headers : {
	  	"Token": ghtkToken
	  },
	  type: 'GET',
	  success: function(res) {
	    console.log(res);
	  }
	});

};
// getOrderStatus("S15549745.HN33.AD4b.935261347")

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
	  url: "https://cors-anywhere.herokuapp.com/"+ghtkUrl+"/services/shipment/fee?"+serialize(data), 
	  headers : {
	  	"Token": ghtkToken
	  },
	  type: 'GET',
	  success: function(res) {
	    // console.log(res);
	    if (!res) {
	    	callback("Không tính được, ktr lại thông tin");
	    } else if (!res.success) {
	    	callback("Không tính được, ktr lại thông tin");
	    } else {
	    	callback(res.fee.fee);
	    }
	  }
	});

	$.ajax({
	  url: "https://cors-anywhere.herokuapp.com/"+ghtkUrl+"/services/shipment/fee?"+serialize(data), 
	  headers : {
	  	"Token": ghtkToken
	  },
	  type: 'GET',
	  success: function(res) {
	    // console.log(res);
	    if (!res) {
	    	callback("Không tính được, ktr lại thông tin");
	    } else if (!res.success) {
	    	callback("Không tính được, ktr lại thông tin");
	    } else {
	    	callback(res.fee.fee);
	    }
	  }
	});
}
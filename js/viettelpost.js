
// var herokuPrefix = "https://dark-lime-barracuda-hat.cyclic.app/"


// var viettelpostToken = localStorage.getItem("viettelpostToken");

function loginViettelPost(callback){
	var settings = {
	    "url": herokuPrefix+"https://partner.viettelpost.vn/v2/user/Login",
	    "method": "POST",
	    "headers": {
	        "Content-Type": "application/json",
	    },
	    "data": ''
	}

	getViettelPostAccess(function(data){
		console.log(data);

		settings["data"]=JSON.stringify(data);
		$.ajax(settings).done(function(response) {
		    console.log(response);
	        localStorage.setItem("viettelpostToken",response["data"]["token"]);
	        viettelpostToken = response["data"]["token"];
	        callback(response["data"]["token"]);
		});
	})
}

function viettelPostGetPickAddress(callback){
	// console.log("getPickAddress:"+ghtkToken);
	$.ajax({
	  url: herokuPrefix+"https://partner.viettelpost.vn/v2/user/listInventory", 
	  headers : {
	  	"Token": viettelpostToken
	  },
	  type: 'GET',
	  success: function(res) {
	  	// console.log(res)
	    if (res.error) {
	    	callback(undefined)
	    	return;
	    }
	    callback(res.data);
	  }
	});
}

// function loginViettelPost2(){
// 	var settings = {
// 	    "async": true,
//   "crossDomain": true,
//   "url": herokuPrefix+"https://partner.viettelpost.vn/v2/user/ownerconnect",
//   "method": "POST",
//   "headers": {
//     "Content-Type": "application/json",
//     "Token": "eyJhbGciOiJFUzI1NiJ9.eyJzdWIiOiIwMzc2MTgwMTkzIiwiVXNlcklkIjo3MDk0ODQ5LCJGcm9tU291cmNlIjo1LCJUb2tlbiI6IjlPVFFMQldNRUxXIiwiZXhwIjoxNjgwMjg5MjY5LCJQYXJ0bmVyIjo3MDk0ODQ5fQ.o0g6EtmVq6Ixx_V5W4bp3IYgeFZ9hNozyn934SEdnej2F9I4FngYoYpGZA3MMIoaAvXlZEZfGgCAjjUU2i2_4g"
//   },
// 	    "data": ''
// 	}

// 	getViettelPostAccess(function(data){
// 		console.log(data);
// 		settings["data"]=JSON.stringify(data);
// 		$.ajax(settings).done(function(response) {
// 		    console.log(response);
// 	        localStorage.setItem("viettelpostToken",response["data"]["token"]);
// 		});
// 	})
// }

function tracking(orderId){
// 	// https://old.viettelpost.com.vn/Tracking?KEY=1606216637308
// var settings = {
// 	    "url": "https://buucuc.com/tracking?vid=1606216637308",
// 	    "method": "POST",
// 	    "headers": {
// 	        "Content-Type": "application/json",
// 	    }
// 	}
// 	$.ajax(settings).done(function(response) {
//     	console.log(response);
// 	});


var link = "https://old.viettelpost.com.vn/Tracking?KEY=1606216637308";
$.ajax({
  // url: "http://cors-anywhere.herokuapp.com/"+link, //For local
  url: "https://cors-anywhere.herokuapp.com/"+link, //For code push
  type: 'GET',
  crossDomain: true,
  success: function(res) {
    // console.log(res)
    var data = $.parseHTML(res);  //<----try with $.parseHTML().
    $(data).find('div.trackingItem').each(function(){
    	console.log($(this).find("ul"))
    });
    // console.log(data);
  }
});

}

function vietttelPostCreateABill(dataOrder,callback){
	var settings = {
	    "async": true,
	    "crossDomain": true,
	    "url": herokuPrefix+"https://partner.viettelpost.vn/v2/order/createOrder",
	    "method": "POST",
	    "headers": {
	        "Content-Type": "application/json",
	        "Token": localStorage.getItem("viettelpostToken")
	    },
	    "data": JSON.stringify(dataOrder)
	}
	$.ajax(settings).done(function(response) {
	    console.log(response);
	    callback(response);
	});
}

function updateBillStatus(){
	var settings = {
	    "async": true,
	    "crossDomain": true,
	    "url": "https://partner.viettelpost.vn/v2/order/UpdateOrder",
	    "method": "POST",
	    "headers": {
	        "Content-Type": "application/json",
	        "Token": localStorage.getItem("viettelpostToken")
	    },
	    "data": JSON.stringify({
		  "TYPE" : 4,
		  "ORDER_NUMBER" : "11506020148",
		  "NOTE" : "Ghi chú"
		})
	}
	$.ajax(settings).done(function(response) {
	    console.log(response);
	});
}

function vietttelPostCalculateShippingCost(infor){
	// "data": JSON.stringify({
	// "SENDER_PROVINCE" : 2,
	// "SENDER_DISTRICT" : 53,
	// "RECEIVER_PROVINCE" : 39,
	// "RECEIVER_DISTRICT" : 449,
	// "PRODUCT_TYPE" : "HH",
	// "PRODUCT_WEIGHT" : 500,
	// "PRODUCT_PRICE" : 5000000,
	// "MONEY_COLLECTION" : "5000000",
	// "TYPE" :1
	// })

	var settings = {
	    "async": true,
	    "crossDomain": true,
	    "url": "https://partner.viettelpost.vn/v2/user/Login",
	    "method": "POST",
	    "headers": {
	        "Content-Type": "application/json",
	    },
	    "data": JSON.stringify(infor)
	}
	$.ajax(settings).done(function(response) {
	    console.log(response);
	    callback(response);
	});
}

function findPlaceProvince(callback){
	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": herokuPrefix+"https://partner.viettelpost.vn/v2/categories/listProvinceById?provinceId=-1",
	  "method": "GET",
	  "headers": {
	  },
	}

	$.ajax(settings).done(function (response) {
	  console.log(response);
	  callback(response);
	});
}

function findPlaceProvinceById(provinceId,callback){
	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": herokuPrefix+"https://partner.viettelpost.vn/v2/categories/listProvinceById?provinceId="+provinceId,
	  "method": "GET",
	  "headers": {
	  },
	}

	$.ajax(settings).done(function (response) {
	  console.log(response);
	  callback(response);
	});
}

function findPlaceDistrict(provinceId, callback){
	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": herokuPrefix+"https://partner.viettelpost.vn/v2/categories/listDistrict?provinceId="+provinceId,
	  "method": "GET",
	  "headers": {
	  },
	}

	$.ajax(settings).done(function (response) {
	  // console.log(response);
	  callback(response);
	});
}

function findPlaceWard(districtId, callback){ //Tim xa
	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": herokuPrefix+"https://partner.viettelpost.vn/v2/categories/listWards?districtId="+districtId,
	  "method": "GET",
	  "headers": {
	  },
	}

	$.ajax(settings).done(function (response) {
	  // console.log(response);
	  callback(response);
	});
}

function calculateTransportFeeAPIViettelPostDetail(feeObj,callback) {
	var settings = {
		    "async": true,
		    "crossDomain": true,
		    "url": herokuPrefix+"https://partner.viettelpost.vn/v2/order/getPrice",
		    "method": "POST",
		    "headers": {
		        "Content-Type": "application/json",
		        "Token": localStorage.getItem("viettelpostToken")
		    },
		    "data": JSON.stringify(feeObj)
		}
	$.ajax(settings).done(function(response) {
	    // console.log(response);
	    callback(response)
	});
}

function calculateTransportFeeAPIViettelPost(feeObj,callback){
	// feeObj = {
	// 	MONEY_COLLECTION: 0,
	// 	PRODUCT_PRICE: "3380",
	// 	PRODUCT_TYPE: "HH",
	// 	PRODUCT_WEIGHT: 1400,
	// 	RECEIVER_DISTRICT: "30",
	// 	RECEIVER_PROVINCE: "1",
	// 	SENDER_DISTRICT: 122,
	// 	SENDER_PROVINCE: 10,
	// 	TYPE: 1
	// }
	// console.log("feeObj");
	// console.log(feeObj);

	var settings = {
		    "async": true,
		    "crossDomain": true,
		    "url": herokuPrefix+"https://partner.viettelpost.vn/v2/order/getPriceAll",
		    "method": "POST",
		    "headers": {
		        "Content-Type": "application/json",
		        "Token": localStorage.getItem("viettelpostToken")
		    },
		    "data": JSON.stringify(feeObj)
		}
	$.ajax(settings).done(function(response) {
	    // console.log(response);
	    callback(response)
	});
}

function addressChecking(addressString, callback) {
	var aix = strToAddr(addressString);
	var addressObj = {};
	addressObj["PROVINCE_NAME"]=aix.province;
	addressObj["DISTRICT_NAME"]=aix.district;
	addressObj["WARDS_NAME"]=aix.ward;
	addressObj["OTHER"]=aix.address;
	
	// console.log("addressChecking");
	// console.log(addressObj);
	// DISTRICT_NAME: "HUYỆN BA VÌ"
	// OTHER: "35 Nguyễn Trãi"
	// PROVINCE_NAME: "Hà Nội"
	// RECEIVER_DISTRICT: "2"
	// RECEIVER_PROVINCE: "1"
	// RECEIVER_WARD: "31"
	// WARDS_NAME: "XÃ PHÚ PHƯƠNG"

	findPlaceProvinceById(-1, function(resProvince){
		var listProvince = resProvince.data;
		var ckProvince = false;

		for (p in listProvince) {
			if (listProvince[p]["PROVINCE_NAME"].toUpperCase() == addressObj["PROVINCE_NAME"].toUpperCase()) {
				ckProvince = true;

				addressObj["RECEIVER_PROVINCE"] = listProvince[p]["PROVINCE_ID"];
				
				var selectedProvince = listProvince[p];
				
				// console.log(selectedProvince)

				findPlaceDistrict(addressObj["RECEIVER_PROVINCE"], function(resProvince){
					var listDistrict = resProvince.data;
					// console.log(listDistrict)
					var ckDistrict = false;

					for (e in listDistrict) {
						// console.log(listDistrict[e])
						// console.log(listDistrict[e]["DISTRICT_ID"]+" "+addressObj.districtId+" "+(listDistrict[e]["DISTRICT_ID"] == addressObj.districtId))
						if (listDistrict[e]["DISTRICT_NAME"].toUpperCase() == addressObj["DISTRICT_NAME"].toUpperCase()) {
							ckDistrict = true;

							var selectedDistrict = listDistrict[e]

							addressObj["RECEIVER_DISTRICT"] = listDistrict[e]["DISTRICT_ID"];

							// console.log(selectedDistrict);

							findPlaceWard(addressObj["RECEIVER_DISTRICT"], function(resWard){
								var ckWard = false;

								var listWards = resWard.data;
								// console.log(listWards);
								for (w in listWards) {
									if (listWards[w]["WARDS_NAME"].toUpperCase() == addressObj["WARDS_NAME"].toUpperCase()) {
										var selectedWard = listWards[w]
										// console.log(selectedWard);
										addressObj.wardsName = selectedWard["WARDS_NAME"];
										addressObj.districtValue = selectedDistrict["DISTRICT_VALUE"]
										addressObj.districtName = selectedDistrict["DISTRICT_NAME"]
										addressObj.provinceCode = selectedProvince["PROVINCE_CODE"]
										addressObj.provinceName = selectedProvince["PROVINCE_NAME"]
										addressObj.province = selectedProvince["PROVINCE_NAME"]
										addressObj["RECEIVER_WARD"] = selectedWard["WARDS_ID"];

										callback(addressObj);
										break;
									}
								}
								if (!ckWard) {
									callback({}, "Thông tin phường/xã bị sai");
								}
							})

							break;
						}
					}
					if (!ckDistrict) {
						callback({}, "Thông tin quận/huyện bị sai");
					}
				})
				break;
			}
		}

		if (!ckProvince) {
			callback({}, "Thông tin tỉnh bị sai");
		}

	})
}

function viettelPostAddressObjToAddressString(addressObj,callback) {
	// addressObj= {
	// 	address: "số 34 đường Trường Chinh",
	// 	cusId: 7094849,
	// 	districtId: 122,
	// 	groupaddressId: 7183005,
	// 	merchant: null,
	// 	name: "Lê Phan Xuân An",
	// 	phone: "0376180193",
	// 	postId: null,
	// 	provinceId: 10,
	// 	wardsId: 1739
	// }
	findPlaceProvinceById(addressObj.provinceId, function(resProvince){
		var selectedProvince = resProvince.data[0];
		// console.log(selectedProvince)
		findPlaceDistrict(addressObj.provinceId, function(resProvince){
			var listDistrict = resProvince.data;
			// console.log(listDistrict)
			for (e in listDistrict) {
				// console.log(listDistrict[e])
				// console.log(listDistrict[e]["DISTRICT_ID"]+" "+addressObj.districtId+" "+(listDistrict[e]["DISTRICT_ID"] == addressObj.districtId))
				if (listDistrict[e]["DISTRICT_ID"] == addressObj.districtId) {
					var selectedDistrict = listDistrict[e]
					// console.log(selectedDistrict);

					findPlaceWard(addressObj.districtId, function(resWard){
						var listWards = resWard.data;
						// console.log(listWards);
						for (w in listWards) {
							if (listWards[w]["WARDS_ID"] == addressObj.wardsId) {
								var selectedWard = listWards[w]
								// console.log(selectedWard);
								addressObj.wardsName = selectedWard["WARDS_NAME"];
								addressObj.districtValue = selectedDistrict["DISTRICT_VALUE"]
								addressObj.districtName = selectedDistrict["DISTRICT_NAME"]
								addressObj.provinceCode = selectedProvince["PROVINCE_CODE"]
								addressObj.provinceName = selectedProvince["PROVINCE_NAME"]
								addressObj.province = selectedProvince["PROVINCE_NAME"]
								callback(addressObj);
								break;
							}
						}
					})

					break;
				}
			}
		})
	})
}

function autocomplete(inp, arr, textAttr, idAttr, callback) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i][textAttr].toUpperCase().includes(val.toUpperCase())) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          var subIndex = arr[i][textAttr].toUpperCase().indexOf(val.toUpperCase());
          b.innerHTML = arr[i][textAttr].substr(0, subIndex);
          b.innerHTML += "<strong>" + arr[i][textAttr].substr(subIndex, val.length) + "</strong>";
          b.innerHTML += arr[i][textAttr].substr(subIndex+val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i][textAttr] + "' index='"+arr[i][idAttr]+"'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              // console.log(this.getElementsByTagName("input")[0])
              callback(this.getElementsByTagName("input")[0].getAttribute("index"), inp.value);
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
      });
}

// var listProvince = [];
// var listDistrict = [];
// var listWards = [];

// var stepIndex = 1;//1: Province, 2: Distric, 3: Wards

var choosenAddressData = {};

function triggerAutocompleteViettelpost(orginalAddress, callback){
	// Ref:http://w3schools-fa.ir/howto/tryit5f14.html?filename=tryhow_js_autocomplete
	var aix = strToAddr(orginalAddress);
	choosenAddressData["PROVINCE_NAME"]=aix.province;
	choosenAddressData["DISTRICT_NAME"]=aix.district;
	choosenAddressData["WARDS_NAME"]=aix.ward;
	choosenAddressData["OTHER"]=aix.address;

	var content = '<h3>Tìm địa điểm</h3><br/>'
	+(orginalAddress ? '<div>Đến:'+orginalAddress+'</div>' : '')
	+'<div class="autocomplete">'
	+'	<input class="form-control" id="myProvince" type="text" name="myProvince" placeholder="Tỉnh" value="'+aix.province+'"/>'
	+'</div>'
	+'<div class="autocomplete">'
	+'	<input class="form-control" id="myDistrict" type="text" name="myDistrict" placeholder="Quận/Huyện" value="'+aix.district+'"/>'
	+'</div>'
	+'<div class="autocomplete">'
	+'	<input class="form-control" id="myWard" type="text" name="myWard" placeholder="Xã/Phường" value="'+aix.ward+'"/>'
	+'</div>'
	+'<div class="autocomplete">'
	+'	<input class="form-control" id="myDetail" type="text" name="myDetail" placeholder="Thông tin cụ thể khác" value="'+aix.address+'">'
	+'</div>'
	+'<div class="autocomplete btn btn-link fixAddress">'
	+'Đồng ý'
	+'</div>'
	;

	$(".modal-body").empty();
	$(".modal-body").html(content);
	$('#myModal').modal('toggle');

	$(".fixAddress").click(function(){
		choosenAddressData["OTHER"] = $("#myDetail").val().split(",").join(";");
		callback(choosenAddressData);
		$('#myModal').modal('toggle');
	})
	// $("#loadingSpin").show();
 	// $("#loading-text").html("Tải danh sách các tỉnh");
	// findPlaceProvince(function(response){
	// 	$("#loadingSpin").hide();
	// 	listProvince = response["data"];

	choosingStep(1,function(addressResponse){
		console.log(addressResponse);
		// callback(addressResponse);
		choosenAddressData = addressResponse;
	},-1)

	// })
}

function addDimension(callback){
	// Ref:http://w3schools-fa.ir/howto/tryit5f14.html?filename=tryhow_js_autocomplete
	var content = '<h3>Thông tin gói hàng</h3><br/>'
	+(orginalAddress ? '<div>Đến:'+orginalAddress+'</div>' : '')
	+'<div class="autocomplete">'
	+'	<input class="form-control" id="dimX" type="text" name="myProvince" placeholder="Dài"/>'
	+'	<input class="form-control" id="dimY" type="text" name="myDistrict" placeholder="Rộng"/>'
	+'	<input class="form-control" id="dimZ" type="text" name="myDistrict" placeholder="Cao"/>'
	+'</div>'
	+'<div class="autocomplete btn btn-link fixAddress">'
	+'Đồng ý'
	+'</div>'
	;

	$(".modal-body").empty();
	$(".modal-body").html(content);
	$('#myModal').modal('toggle');

	$(".fixAddress").click(function(){
		choosenAddressData["OTHER"] = $("#myDetail").val();
		callback(choosenAddressData);
		$('#myModal').modal('toggle');
	})
	// $("#loadingSpin").show();
 	// $("#loading-text").html("Tải danh sách các tỉnh");
	// findPlaceProvince(function(response){
	// 	$("#loadingSpin").hide();
	// 	listProvince = response["data"];

	choosingStep(1,function(addressResponse){
		console.log(addressResponse);
		// callback(addressResponse);
		choosenAddressData = addressResponse;
	},-1)

	// })
}

var chosenProvinceId = 0;
var chosenDistrictId = 0;

var chosenProvinceName = "";
var chosenDistrictName = "";

function choosingStep(step, callback, id){
	if (step==1) {
		$("#loadingSpin").show();
		$("#loading-text").html("Tải danh sách các tỉnh");
		findPlaceProvince(function(response){
			$("#loadingSpin").hide();
			var listProvince = response["data"];
			autocomplete(document.getElementById("myProvince"),listProvince, "PROVINCE_NAME", "PROVINCE_ID", function(provinceId, provinceName){
				chosenProvinceId = provinceId;
				chosenProvinceName = provinceName;
				// console.log("chosenProvinceId:"+chosenProvinceId);
				choosingStep(2,callback,provinceId);
			});
		})
	} else if (step==2) {
		$("#loadingSpin").show();
		$("#loading-text").html("Tải danh sách các quận/huyện");
		findPlaceDistrict(id, function(response){
			$("#loadingSpin").hide();
			var listDistrict = response["data"];
			autocomplete(document.getElementById("myDistrict"),listDistrict, "DISTRICT_NAME", "DISTRICT_ID", function(districtId, districtName){
				chosenDistrictId = districtId;
				chosenDistrictName = districtName;
				choosingStep(3,callback,districtId)
			});
		})
	} else if (step==3) {
		$("#loadingSpin").show();
		$("#loading-text").html("Tải danh sách các xã/phường");
		findPlaceWard(id, function(response){
			$("#loadingSpin").hide();
			var listWards = response["data"];
			autocomplete(document.getElementById("myWard"),listWards, "WARDS_NAME", "WARDS_ID", function(wardId, wardName){
				callback({
					"RECEIVER_WARD": wardId,
					"RECEIVER_DISTRICT": chosenDistrictId,
					"RECEIVER_PROVINCE": chosenProvinceId,
					"PROVINCE_NAME": chosenProvinceName,
					"DISTRICT_NAME": chosenDistrictName,
					"WARDS_NAME": wardName
				});
			});
		})
	} 
}



function loginViettelPost(){
	var settings = {
	    "async": true,
	    "crossDomain": true,
	    "url": "https://partner.viettelpost.vn/v2/user/Login",
	    "method": "POST",
	    "headers": {
	        "Content-Type": "application/json",
	    },
	    "data": {}
	}
	getViettelPostAccess(function(data){
		$.ajax(settings).done(function(response) {
		    console.log(response);
	        localStorage.setItem("viettelpostToken",response["data"]["token"]);

		});
	})
}

function createABill(){
	var settings = {
	    "async": true,
	    "crossDomain": true,
	    "url": "https://partner.viettelpost.vn/v2/order/createOrder",
	    "method": "POST",
	    "headers": {
	        "Content-Type": "application/json",
	        "Token": localStorage.getItem("viettelpostToken")
	    },
	    "data": {
		    "ORDER_NUMBER": "12",
		    "GROUPADDRESS_ID": 5818802,
		    "CUS_ID": 722,
		    "DELIVERY_DATE": "11/10/2018 15:09:52",
		    "SENDER_FULLNAME": "Yanme Shop",
		    "SENDER_ADDRESS": "Số 5A ngách 22 ngõ 282 Kim Giang, Đại Kim (0967.363.789), Quận Hoàng Mai, Hà Nội",
		    "SENDER_PHONE": "0967.363.789",
		    "SENDER_EMAIL": "vanchinh.libra@gmail.com",
		    "SENDER_WARD": 0,
		    "SENDER_DISTRICT": 4,
		    "SENDER_PROVINCE": 1,
		    "SENDER_LATITUDE": 0,
		    "SENDER_LONGITUDE": 0,
		    "RECEIVER_FULLNAME": "Hoàng - Test",
		    "RECEIVER_ADDRESS": "1 NKKN P.Nguyễn Thái Bình, Quận 1, TP Hồ Chí Minh",
		    "RECEIVER_PHONE": "0907882792",
		    "RECEIVER_EMAIL": "hoangnh50@fpt.com.vn",
		    "RECEIVER_WARD": 0,
		    "RECEIVER_DISTRICT": 43,
		    "RECEIVER_PROVINCE": 2,
		    "RECEIVER_LATITUDE": 0,
		    "RECEIVER_LONGITUDE": 0,
		    "PRODUCT_NAME": "Máy xay sinh tố Philips HR2118 2.0L ",
		    "PRODUCT_DESCRIPTION": "Máy xay sinh tố Philips HR2118 2.0L ",
		    "PRODUCT_QUANTITY": 1,
		    "PRODUCT_PRICE": 2292764,
		    "PRODUCT_WEIGHT": 40000,
		    "PRODUCT_LENGTH": 38,
		    "PRODUCT_WIDTH": 24,
		    "PRODUCT_HEIGHT": 25,
		    "PRODUCT_TYPE": "HH",
		    "ORDER_PAYMENT": 3,
		    "ORDER_SERVICE": "VCN",
		    "ORDER_SERVICE_ADD": "",
		    "ORDER_VOUCHER": "",
		    "ORDER_NOTE": "cho xem hàng, không cho thử",
		    "MONEY_COLLECTION": 2292764,
		    "MONEY_TOTALFEE": 0,
		    "MONEY_FEECOD": 0,
		    "MONEY_FEEVAS": 0,
		    "MONEY_FEEINSURRANCE": 0,
		    "MONEY_FEE": 0,
		    "MONEY_FEEOTHER": 0,
		    "MONEY_TOTALVAT": 0,
		    "MONEY_TOTAL": 0,
		    "LIST_ITEM": [{
		        "PRODUCT_NAME": "Máy xay sinh tố Philips HR2118 2.0L ",
		        "PRODUCT_PRICE": 2150000,
		        "PRODUCT_WEIGHT": 2500,
		        "PRODUCT_QUANTITY": 1
		    }]
		}
	}
$.ajax(settings).done(function(response) {
    console.log(response);
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
	    "data": {
		  "TYPE" : 4,
		  "ORDER_NUMBER" : "11506020148",
		  "NOTE" : "Ghi chú"
		}
	}
	$.ajax(settings).done(function(response) {
	    console.log(response);
	});
}

function calculateShippingCost(){
	var settings = {
	    "async": true,
	    "crossDomain": true,
	    "url": "https://partner.viettelpost.vn/v2/user/Login",
	    "method": "POST",
	    "headers": {
	        "Content-Type": "application/json",
	    },
	    "data": {
		  "SENDER_PROVINCE" : 2,
		  "SENDER_DISTRICT" : 53,
		  "RECEIVER_PROVINCE" : 39,
		  "RECEIVER_DISTRICT" : 449,
		  "PRODUCT_TYPE" : "HH",
		  "PRODUCT_WEIGHT" : 500,
		  "PRODUCT_PRICE" : 5000000,
		  "MONEY_COLLECTION" : "5000000",
		  "TYPE" :1
		}
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
	  "url": "https://partner.viettelpost.vn/v2/categories/listProvinceById?provinceId=-1",
	  "method": "GET",
	  "headers": {
	  },
	}

	$.ajax(settings).done(function (response) {
	  // console.log(response);
	  callback(response);
	});
}

function findPlaceDistrict(provinceId, callback){
	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "https://partner.viettelpost.vn/v2/categories/listDistrict?provinceId="+provinceId,
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
	  "url": "https://partner.viettelpost.vn/v2/categories/listWards?districtId="+districtId,
	  "method": "GET",
	  "headers": {
	  },
	}

	$.ajax(settings).done(function (response) {
	  // console.log(response);
	  callback(response);
	});
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
        if (arr[i][textAttr].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i][textAttr].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i][textAttr].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i][textAttr] + "' index='"+arr[i][idAttr]+"'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              callback(this.getElementsByTagName("input")[0].index);
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

function triggerAutocompleteViettelpost(orginalAddress, callback){
	// Ref:http://w3schools-fa.ir/howto/tryit5f14.html?filename=tryhow_js_autocomplete
	if (!listProvince) {
		$("#loadingSpin").show();
	 	$("#loading-text").html("Tải danh sách các tỉnh");
		findPlaceProvince(function(response){
			$("#loadingSpin").hide();
			listProvince = response["data"];
			var content = '<h3>Tìm địa điểm</h3><br/>'
			+(orginalAddress ? '<div>Đến:'+orginalAddress+'</div>' : '')
			+'<div class="autocomplete">'+
			+'	<input id="myProvince" type="text" name="myProvince" placeholder="Tỉnh">'
			+'</div>'
			+'<div class="autocomplete">'+
			+'	<input id="myDistrict" type="text" name="myDistrict" placeholder="Quận">'
			+'</div>'
			+'<div class="autocomplete">'+
			+'	<input id="myWard" type="text" name="myWard" placeholder="Xã">'
			+'</div>'
			+'<div class="autocomplete">'+
			+'	<input id="myDetail" type="text" name="myDetail" placeholder="Thông tin cụ thể khác">'
			+'</div>'
			;

			$(".modal-body").empty();
			$("#modelContent").html(content);
			$('#myModal').modal('toggle');

			choosingStep(1,function(addressResponse){
				console.log(addressResponse);
			},-1)

			$("#modalYes").click(function(){
				callback("");
			})

		})
	}
}

var chosenProvinceId = 0;
var chosenDistrictId = 0;

function choosingStep(step, callback, id){
	if (step==1) {
		$("#loadingSpin").show();
		findPlaceProvince(function(response){
			$("#loadingSpin").hide();
			var listProvince = response["data"];
			autocomplete(document.getElementById("myProvince"),listProvince, "PROVINCE_NAME", "PROVINCE_ID", function(provinceId){
				chosenProvinceId = provinceId;
				choosingStep(2,callback,provinceId);
			});
		})
	} else if (step==2) {
		$("#loadingSpin").show();
		findPlaceDistrict(id, function(response){
			$("#loadingSpin").hide();
			var listDistrict = response["data"];
			autocomplete(document.getElementById("myDistrict"),listDistrict, "DISTRICT_NAME", "DISTRICT_ID", function(districtId){
				chosenDistrictId = districtId;
				choosingStep(3,callback,districtId)
			});
		})
	} else if (step==3) {
		$("#loadingSpin").show();
		findPlaceWard(id, function(response){
			$("#loadingSpin").hide();
			var listWards = response["data"];
			autocomplete(document.getElementById("myWard"),listWards, "WARDS_NAME", "WARDS_ID", function(wardId){
				callback({
					"RECEIVER_WARD": wardId,
					"RECEIVER_DISTRICT": chosenDistrictId,
					"RECEIVER_PROVINCE": chosenProvinceId
				});
			});
		})
	} 
}

// filterSheet.js

// var sheetrange = 'Sheet1!A:A';
// var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';


// my_range = {
//     'sheetId': spreadsheetId,
//     'startRowIndex': 10000,
//     'startColumnIndex': 0,
// }

var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';
var indexColumnOfName = 2;
var sheetrange = 'Sheet1!A:'+String.fromCharCode(65+indexColumnOfName);
var codeNameList = [];

$(document).ready(function(){
	if (!gapi) {
		return;
	}
	gapi.client.sheets.spreadsheets.values.get({
	    spreadsheetId: spreadsheetId,
	    range: sheetrange,
	}).then(function(response) {
	    // console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
	    codeNameList = response.result.values;

	}, function(response) {
	    console.log('Error: ' + response.result.error.message);
	});
})

function checkProductCodeName(code,name,callback) {
	// console.log(dataset);
	if (codeNameList.length == 0) {
		return false;
	}
    var posList = codeNameList.filter(
    	ds => (ds[0].toLowerCase() == code.toLowerCase() || 
    		ds[1].toLowerCase() == name.toLowerCase()));
    console.log(posList);
    callback((posList.length == 0));
}

// checkProductCodeName("1","Kcm2",function(){})
// $(document).ready(function() {

// Client ID and API key from the Developer Console
var CLIENT_ID = '553433448879-lund4kt725a4ha6358ep0eu5csnckgni.apps.googleusercontent.com';
var API_KEY = 'AIzaSyB4N3Nf7pbd5Dg-QeChfV-0d_9rnp-7mY8';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

var sheetrange = 'Product!A1:O';
var spreadsheetId = '16lwfdBGBzOikq2X_BUt415lDemdXpZ7TL_MUhBKYHt8';

var dataset = [];

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    console.log("initClient")
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    console.log("updateSigninStatus")
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        // listMajors();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function readData() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: sheetrange,
    }).then(function(response) {
        console.log(response.result.values); //[["Sản phẩm", "Giá"], ["Kcm", "100"]]
        // var range = response.result;
        // if (range.values.length > 0) {
        //   appendPre('Name, Major:');
        //   for (i = 0; i < range.values.length; i++) {
        //     var row = range.values[i];
        //     // Print columns A and E, which correspond to indices 0 and 4.
        //     appendPre(row[0] + ', ' + row[4]);
        //   }
        // } else {
        //   appendPre('No data found.');
        // }
        dataset = response.result.values;
    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
}

function insertData() {
    console.log("insert data");

    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: sheetrange,
        valueInputOption: "USER_ENTERED",
        resource: {
            "majorDimension": "ROWS",
            "values": [
                ["Kcm2", "100"]
            ]
        }
    }).then(function(response) {
        var result = response.result;
        console.log(`${result.updatedCells} cells updated.`);
    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });

    // var resource = {
    //   "majorDimension": "ROWS",
    //   "values": ["Kcm2", "100"]
    // }
    // // var spreadsheetId = spreadsheetId;
    // // var range = sheetrange;
    // var optionalArgs = {valueInputOption: "USER_ENTERED"};
    // gapi.client.sheets.spreadsheets.values.append(resource, spreadsheetId, sheetrange, optionalArgs).then((response) => {
    //     var result = response.result;
    //     console.log(`${result.updatedCells} cells updated.`);
    // });

}

function updateData() {
    console.log("update data");
    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: "Sheet1!A5:B5",
        valueInputOption: "USER_ENTERED",
        resource: {
            "majorDimension": "ROWS",
            "values": [
                ["Kcm2", "100"]
            ]
        }

    }).then(function(response) {
        var result = response.result;
        console.log(`${result.updatedCells} cells updated.`);
    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
}



function deleteData() {
    console.log("delete data");
}

$('body').on('click', '#readdata', function() {
    readData();
})

$('body').on('click', '#insertdata', function() {
    insertData();
})

$('body').on('click', '#updatedata', function() {
    updateData();
})

$('body').on('click', '#deletedata', function() {
    deleteData();
})

$('body').on('click', '#scanbarcode', function() {
    const evt = $.Event('barcodeScan');
    evt.state = {
        type: barcodeRead.substr(0, 1),
        code: barcodeRead.substr(1),
    };
    $(window).trigger(evt);
})

$(window).bind('barcodeScan', (e) => {
    appendPre("console:"+e.state.code);
});

// })
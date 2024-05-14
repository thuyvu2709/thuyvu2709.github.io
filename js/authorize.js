// $(document).ready(function() {

// Client ID and API key from the Developer Console
var CLIENT_ID = '729860036739-i1ihr5qbim6llcplhe0rglska8ft2nu8.apps.googleusercontent.com';
var API_KEY = 'AIzaSyD1wf9iJCeQbMM3DwGp07NXj6LbEh6fyyY';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets "+
             "https://www.googleapis.com/auth/gmail.send";

var authorizeButton = document.getElementById('authorize_button');
// var signoutButton = document.getElementById('signout_button');

// var herokuPrefix = "https://cors-anywhere-2-c194.onrender.com/"
// var herokuPrefix = "https://micro-cors.vercel.app/"
// var herokuPrefix = "http://localhost:8080/"

var herokuPrefix = "https://thingproxy.freeboard.io/fetch/"

var dataset = [];

var numOfColumn = 14;   

var EuroVndRate = 27;

var userRole = JSON.parse(localStorage.getItem("userRole"));

if (userRole) {
    // if (userRole == "shipper") {
    //     $("#headerInclude").load("../common/headerShipper.html");
    // } else 
    if (userRole == "manager"){
        $("#headerInclude").load("../common/header.html");
    } else {
        $("#headerInclude").load("../common/headerShipper.html");
    }
} else {
    // if (pageRole == "shipper") {
    //     $("#headerInclude").load("../common/headerShipper.html");
    // } else 
    if (pageRole == "manager"){
        $("#headerInclude").load("../common/header.html");
    } else {
        $("#headerInclude").load("../common/headerShipper.html");
    }
}

$("#footerInclude").load("../common/footer.html");

if (pageName == userRole) {
    cleanHistory();
}


function appendPre(log) {
    console.log(log);
}

/**
 *  On load, called to load the auth2 library and API client library.
 */
// function handleClientLoad() {
//     gapi.load('client:auth2', initClient);
// }

let tokenClient;
let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {

    if (window.location.hostname == "localhost") {
        console.log("initializeGapiClient skip");
        gapiInited = true;
        gisInited = true;
        maybeEnableButtons();
        return;
    }

    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
    });
    console.log("initializeGapiClient");
    gapiInited = true;

    maybeEnableButtons();

}

function gisLoaded() {
    console.log("gisLoaded");
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited ) {
        if (pageName == "index") {
            authorizeButton.onclick = handleAuthClick;
        } else if (pageName == "test") {
            authorizeButton.onclick = handleAuthClick;
            checkRole();
        } else {
            checkRole();
        }
    }
  }

// var triggerAfterLoad = function(){
//     console.log("triggerAfterLoad")
// }

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */

function triggerAfterLoading() {
    console.log("triggerAfterLoading");
    $("#loadingSpin").hide();

    // console.log(window.location);

        // localStorage.setItem("clientToken", JSON.stringify(gapi.client.getToken()));
    var clientToken = localStorage.getItem("clientToken");
    if (clientToken) {
        gapi.client.setToken( JSON.parse(localStorage.getItem("clientToken")));
    }
    
    if (typeof triggerAfterLoad !== 'undefined' && $.isFunction(triggerAfterLoad)) {
        triggerAfterLoad();
    };

    // afterSignIn();
}

function initClient() {
    console.log("initClient")
    
    $("#loadingSpin").show();

    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        gapi.client.load('gmail', 'v1', function(){
            console.log("Loaded email api");
        });

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        if (authorizeButton) {
            authorizeButton.onclick = handleAuthClick;
        }
        // signoutButton.onclick = handleSignoutClick;
        // $("#loadingSpin").hide();

        // if (typeof triggerAfterLoad !== 'undefined' && $.isFunction(triggerAfterLoad)) {
        //     triggerAfterLoad();
        // };
        // triggerAfterLoading();
        // checkRole();

    }, function(error) {
        console.log("Problem with sign in");

        appendPre(JSON.stringify(error, null, 2));

        // triggerAfterLoading();
        checkRole();
        // comeBackHomeToAuthorize();

    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    $("#loadingSpin").hide();

    console.log("updateSigninStatus:"+isSignedIn);
    if (isSignedIn) {
        checkRole();
    } else {
        console.log("Problem with sign in");
        // window.location = "/"
        comeBackHomeToAuthorize();
    }
    // afterSignIn();
}

function checkRole() {
    $("#loadingSpin").show();

    var currentUser = getCurrentUser();
    
    if (window.location.hostname == "localhost") {
        currentUser = {
            email : "levanthanh3005@gmail.com",
            status : true
        }
    }
    console.log("checkRole");
    console.log(currentUser);

    if (!currentUser.status) {
        comeBackHomeToAuthorize();
        return;
    }

    var roles = JSON.parse(localStorage.getItem("roles"));

    var continueWithRoles = function(roles) {
        // console.log("Role list")
        // console.log(roles);
        for (e in roles) {
            if (e == 0) {
                continue;
            }
            if (roles[e][0].toLowerCase() == currentUser.email.toLowerCase()) {
                localStorage.setItem("userRole",JSON.stringify(roles[e][1]));

                finishCheckRole(roles[e][1]);
                return;
            }
        }
        comeBackHomeToAuthorize();
        return;
    }

    var finishCheckRole = function(page){
        console.log("finishCheckRole");

        $("#loadingSpin").hide();

        triggerAfterLoading();
        routing(page);

    }    

    if (pageName == "index") {
        getRoleList(function(roles){
            continueWithRoles(roles);   
        })
    } else if (roles) {
        continueWithRoles(roles);
    } else {
        getRoleList(function(roles){
            continueWithRoles(roles);   
        })
    }

}

function routing(page) {
    if (pageName == "index") {
        // alert("move to page:"+page)
        window.location = "/"+page;
    } else {
        if (userRole == "manager") {
            updateTitle();
        }
    }
}

function updateTitle(){
    console.log("afterSignIn");
    loadReport(function(){
        var s = "Xách tay Thuỷ Vũ - Góc Hàng Âu";
        // var s = "1234567890123456789"
        var dataReport = JSON.parse(localStorage.getItem("report"));

        if (!dataReport[1][1] || !dataReport[3][1]) {
            return;
        }

        var totalTurnover =  parseFloat(dataReport[1][1]);
        var totalPay =  parseFloat(dataReport[3][1]);
        var totalRefund = parseInt(dataReport[6][1]);
        // console.log("totalTurnover:"+totalTurnover);
        // console.log("totalPay:"+totalPay);
        // console.log("totalRefund:"+totalRefund);

        totalTurnover = totalTurnover - totalRefund;
        // console.log("after :"+totalTurnover);
        
        var breakevenPoint = parseFloat(totalPay - totalTurnover);
        if (breakevenPoint <=0) {
            var percent = parseInt((totalTurnover - totalPay) * s.length / totalPay);
            console.log("Percent:"+percent+ " vs "+s.length);
            // console.log(s.substring(0, percent));
            // console.log(s.substring(percent, s.length));
            $(".navbar-brand").html("<span class='textYellow'>"+
                s.substring(0, percent) +
            "</span>"+
            "<span class='text-white'>"+
                s.substring(percent, s.length) +
            "</span>")
        } else {

            var percent = parseInt(totalTurnover * s.length / totalPay);
            console.log("Percent:"+percent+ " vs "+s.length);
            // console.log(s.substring(0, percent));
            // console.log(s.substring(percent, s.length));
            $(".navbar-brand").html("<span class='text-white'>"+
                s.substring(0, percent) +
            "</span>"+
            "<span class='text-blue'>"+
                s.substring(percent, s.length) +
            "</span>")
        }
    });
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    // gapi.auth2.getAuthInstance().signIn();
    localStorage.clear();
    console.log("handleAuthClick");
    console.log(tokenClient);

    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
          throw (resp);
        }
        // document.getElementById('signout_button').style.visibility = 'visible';
        // document.getElementById('authorize_button').innerText = 'Refresh';
        // await listMajors();
        console.log(resp);
        localStorage.setItem("clientToken", JSON.stringify(gapi.client.getToken()));
        updateSigninStatus(true);
      };

      if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({prompt: 'consent'});
      } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({prompt: ''});
      }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    // console.log("Signout");
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
    }

    window.location = "/";
}


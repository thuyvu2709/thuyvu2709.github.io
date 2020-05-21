// $(document).ready(function() {

// Client ID and API key from the Developer Console
var CLIENT_ID = '553433448879-lund4kt725a4ha6358ep0eu5csnckgni.apps.googleusercontent.com';
var API_KEY = 'AIzaSyB4N3Nf7pbd5Dg-QeChfV-0d_9rnp-7mY8';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets "+
             "https://www.googleapis.com/auth/gmail.send";

var authorizeButton = document.getElementById('authorize_button');
// var signoutButton = document.getElementById('signout_button');

var dataset = [];

var numOfColumn = 14;

var EuroVndRate = 27;

var userRole = JSON.parse(localStorage.getItem("userRole"));

if (userRole) {
    if (userRole == "shipper") {
        $("#headerInclude").load("../common/headerShipper.html");
    } else if (userRole == "manager"){
        $("#headerInclude").load("../common/header.html");
    }
} else {
    if (pageRole == "shipper") {
        $("#headerInclude").load("../common/headerShipper.html");
    } else if (pageRole == "manager"){
        $("#headerInclude").load("../common/header.html");
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
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// var triggerAfterLoad = function(){
//     console.log("triggerAfterLoad")
// }

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */

function triggerAfterLoading() {
    $("#loadingSpin").hide();

    // console.log(window.location);

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

    if (window.location.hostname == "localhost" ||
        window.location.hostname == "172.20.10.6" ||
        window.location.hostname == "172.20.10.11") {
        currentUser = {
            email : "kenkreck1004@gmail.com",
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
        $("#loadingSpin").hide();

        routing(page);
        triggerAfterLoading();
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
        data = JSON.parse(localStorage.getItem("report"));

        if (!data[1][1] || !data[3][1]) {
            return;
        }

        var totalTurnover =  parseFloat(data[1][1]);
        var totalPay =  parseFloat(data[3][1]);

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
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    // console.log("Signout");
    gapi.auth2.getAuthInstance().signOut();
    window.location = "/";
}


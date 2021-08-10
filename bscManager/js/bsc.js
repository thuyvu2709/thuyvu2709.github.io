$("#headerInclude").load("../common/header.html");
$("#footerInclude").load("../common/footer.html");

var startTrading = false;

var tokenList = [];
try {
  tokenList = JSON.parse(localStorage.getItem("tokenList"))
}catch(e){
} 
if (!tokenList){
  tokenList = [];
}
var walletAddress = JSON.parse(localStorage.getItem("walletAddress")) || ''
var privateKey = JSON.parse(localStorage.getItem("privateKey")) || ''
var account = {}

if (privateKey) {
  account = makeAccount(privateKey);
  walletAddress = account.address;
  $("#walletAddress").val(walletAddress)
  localStorage.setItem("privateKey",JSON.stringify(privateKey));
  localStorage.setItem("walletAddress",JSON.stringify(walletAddress));
}

$("#walletAddress").val(walletAddress)
$("#privateKey").val(privateKey);

// console.log(tokenList)

$("#addNewToken").click(function(){
  var addr = $("#newTokenAddress").val();
  if (addr && tokenList.indexOf(addr)==-1) {
    tokenList.push({
      address : addr,
      slippage : 1,
      maxSlippage : 20
    })
    localStorage.setItem("tokenList",JSON.stringify(tokenList));
    $("#loadingSpin").show();
    updateEachToken(tokenList.length-1,function(){
      console.log("Add token");
      $("#loadingSpin").hide();
    })
  }
})

$("#startTrading").click(function(){
  $("#startTrading").html("Trading...");
  startTrading = true;
})

$( "#walletAddress" ).change(function() {
  walletAddress = $("#walletAddress").val()
  localStorage.setItem("walletAddress",JSON.stringify(walletAddress));
})

$( "#privateKey" ).change(function() {
  privateKey = $("#privateKey").val()
  if (!privateKey) {
    account = {}
    walletAddress = ""
  } else {
    account = makeAccount(privateKey);
    walletAddress = account.address;
  }
  $("#walletAddress").val(walletAddress)
  localStorage.setItem("privateKey",JSON.stringify(privateKey));
  localStorage.setItem("walletAddress",JSON.stringify(walletAddress));
})

var lastTime = new Date().getTime();

// loadBUSDPrice()
if (tokenList.length > 0 ){
  runLoop();
}

var loopCount = 0;
var busdRate = 300;

function runLoop() {
  if (loopCount%100==0) {
    getTokenRate(1, data.WBNB, 18, data.BUSD, 18,function(usdRate){
      busdRate = usdRate;
      if (loopCount>=150) {
        loopCount = 100;
      }
    })
  }
  var timeout = 2000 / (tokenList.length);
  // if (tokenList.length < 5) {
  //   timeout = 5000;
  // }

  setTimeout(function(){
    loadBSC(function(){      
      var timeAfterLast = (parseFloat(new Date().getTime() - lastTime) / (1000)).toFixed(1)
      
      // if (timeAfterLast*1000 < timeout) {
      //   continue;
      // }
      console.log("Done loop, run again:"+timeAfterLast+" loopCount:"+loopCount);

      // console.log(timeAfterLast);
      
      lastTime = new Date().getTime();

      $("#infor").html("Last update:"+timeAfterLast+" s")

      loopCount++;

      runLoop();
    })
  }, timeout);
}

// loadBSC(function(){});

function loadBSC(callback){
  if (!tokenList || tokenList.length==0) {
    callback();
    return;
  }

  var runEachToken = function(step) {
    if (step >= tokenList.length) {
      callback();
      return;
    } else {
      try {
        updateEachToken(step,function(){
          runEachToken(step+1);
        })
      }catch(exp){
        console.log(exp);
        runEachToken(step+1);
      }
    }
  }
  runEachToken(0)
}

function updateEachToken(tokenIndex,callback) {
  var token = tokenList[tokenIndex];

  var tokenAddr = token.address;
  if (!walletAddress) {
    callback();
    return;
  }
  getTokenInfor(tokenAddr, walletAddress, function(tokenName, decimal,balance, balanceFull){
    calculateCurrentPriceInBUSD(balanceFull, tokenAddr, token.slippage, 
      function(amountOutFullFixed, amountOutMinFixed, amountOutFull, amountOutMin, amountInFull, decimalTokenIn, decimalTokenOut){
        // console.log("Line 106")
        // console.log(amount)
        // console.log(tokenName)
        // console.log(amountInFull.toString());
        try {
          calculateSlippage(walletAddress, amountInFull, amountOutFull, tokenAddr, data.BUSD,[],  1, tokenList[tokenIndex].maxSlippage,
            function(suitableSlippage, transactionFee, gasLimit, amountOutMin){

              // console.log(suitableSlippage);
              // console.log(transactionFee);
              var amountOutMinFixed = (amountOutMin / (10 ** decimalTokenOut)).toFixed(5)
              // console.log(amountOutMinFixed)
              tokenList[tokenIndex].tokenName = tokenName;
              tokenList[tokenIndex].slippage = suitableSlippage;
              tokenList[tokenIndex].amountOutMin = amountOutMin;
              tokenList[tokenIndex].amountInFull = amountInFull;
              tokenList[tokenIndex].amountOutFull = amountOutFull;
              tokenList[tokenIndex].transactionFee = transactionFee;
              tokenList[tokenIndex].balance = balance;
              tokenList[tokenIndex].amountOutFullFixed = amountOutFullFixed;
              tokenList[tokenIndex].amountOutMinFixed = amountOutMinFixed;
              tokenList[tokenIndex].gasLimit = gasLimit;

              triggerAction(tokenIndex,function(){
                updateUIToken(tokenIndex);              
                callback();
                return;
              })
            })
        }catch(e){
          callback();
          return;
        }
    }) 
  })
}

function triggerAction(tokenIndex,callback) {

  if (startTrading==false)  {
    callback();
    return;
  }

  var token = tokenList[tokenIndex];

  var swapNow = false;

  if (token.amountOutFullFixed == "0") {
    callback();
    return;
  }

  // if (token.sellInStrategy==true) {
  console.log(token);
  console.log(token.strategyCmd);
  if (!token.strategyCmd){
    callback();
    return;
  }
  var cmdLs = token.strategyCmd;
  var mulPrecision = 1;
  for (var e in cmdLs) {
    if (!cmdLs[e]) {
      continue;
    }
    var v = parseInt(parseFloat(cmdLs[e])*mulPrecision);
    var av = parseInt(parseFloat(token.amountOutMinFixed)*mulPrecision)
    // console.log(e);
    // console.log("v:"+v)
    // console.log("av:"+av)

    if (e=="precision") {
      mulPrecision = 10 ** parseInt(cmdLs[e])
    } else if (e=="alert") {
      if (v == av) {
        window.alert(token.tokenName + " at "+cmdLs[e]);
      }
    } else if (e=="alertGreaterThan") {
      if (v < av) {
        window.alert(token.tokenName + " greater than "+cmdLs[e]);
      }
    } else if (e=="alertSmallerThan") {
      if (v > av) {
        window.alert(token.tokenName + " smaller than "+cmdLs[e]);
      }
    } else if (e=="swap") {
      if (v == av) {
        swapNow = true;
      }
    } else if (e=="swapIfGreaterThan") {
      if (v < av) {
        swapNow = true;
      }
    } else if (e=="swapIfSmallerThan") {
      if (v > av) {
        swapNow = true;
      }
    } 
  }
  // } else {
  //   if (token.expectedSell == "0" || !token.expectedSell) {
  //     callback();
  //     return;
  //   }
  //   // console.log("Alert:"+token.alert)
  //   var lsExpectedSell = token.expectedSell.split(",");

  //   // var minV = parseInt(token.amountOutFullFixed * 10000);
  //   // var maxV = 0;

  //   for (var e in lsExpectedSell) {
  //     var v = parseInt(lsExpectedSell[e])
  //     if (v == parseInt(token.amountOutFullFixed)){
        
  //       if (token.alert==true) {
  //         window.alert(token.tokenName + " at "+v);
  //       }
  //       if (token.sellAtExpect==true) {
  //         swapNow = true;
  //       }
  //     }
  //     // if (v < minV) {
  //     //   minV = v;
  //     // } 
  //     // if (v > maxV) {
  //     //   maxV = v;
  //     // }
  //   }

  //   // if (minV > parseInt(token.amountOutFullFixed) && token.alert==true) {
  //   //   window.alert(token.tokenName + " reach minium");
  //   // }
  //   // if (maxV < parseInt(token.amountOutFullFixed) && token.alert==true) {
  //   //   window.alert(token.tokenName + " reach maximum");
  //   // }
  // }

  if (swapNow) {
      swapToken(account, tokenList[tokenIndex].amountInFull, tokenList[tokenIndex].amountOutMin, tokenList[tokenIndex].address, data.BUSD, [], tokenList[tokenIndex].slippage, tokenList[tokenIndex].gasLimit);

      console.log("Swap Now");
      callback();
      return;
  } else {
    callback();
    return;
  }
}

function updateUIToken(tokenIndex){

  var token = tokenList[tokenIndex];
  var tokenAddr = token.address;
  var transactionFeeView = token.transactionFee == 0 ? "Không tính được" : (token.transactionFee * busdRate).toFixed(6) + " $";

  // console.log(token);
  
  if (!$('.cardElement_'+tokenAddr)[0]) {
    var cardBody ="abc"
    $("#listBSC").append(
      // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+data[e][0]+' | '+data[e][2]+' | '+data[e][5]+'</a>'
      '<div class="card cardElement_'+tokenAddr+'">'+
        '<div class="card-header" id="heading_"'+tokenAddr+'>'+
          '<h5 class="mb-0">'+
            '<button class="btn btn-link btnToken_'+tokenAddr+'" data-toggle="collapse" data-target="#collapse_'+tokenAddr+'" aria-expanded="false" aria-controls="collapse_'+tokenAddr+'">'+
              token.tokenName+' | '+token.balance + ' Token | '+ token.amountOutFullFixed +" BUSD"+
            '</button>'+
          '</h5>'+
        '</div>'+

        '<div id="collapse_'+tokenAddr+'" class="collapse" aria-labelledby="heading_'+tokenAddr+'" data-parent="#listBSC">'+
          '<div class="card-body">'+
            '<form class="container">'+
            // '  <div class="form-group row">'+
            // '    <label for="customerName" class="col col-form-label">'+
            // '      Expectation:<br/>'+
            // '      <span class="textRed">Alert:<input type="checkbox" class="alertAtPrice_'+tokenAddr+'" '+(token.alert==true ? "checked" : "")+'></span>'+
            // '      <span class="textRed">Bán:<input type="checkbox" class="sellAtExpect_'+tokenAddr+'" '+(token.sellAtExpect==true ? "checked" : "")+'></span>'+
            // '      <span class="textRed">Strategy:<input type="checkbox" class="sellInStrategy_'+tokenAddr+'" '+(token.sellInStrategy==true ? "checked" : "")+'></span>'+
            // '    </label>'+
            // '    <div class="col">'+
            // '      <input type="text" class="form-control expectedSell_'+tokenAddr+'" placeholder="" value="'+(token.expectedSell ? token.expectedSell : 0 )+'" '+(token.sellInStrategy==true ? "readonly" : "")+'>'+
            // '    </div>'+
            // '  </div>'+
            '  '+
            '  <div class="form-group row">'+
            '    <label for="customerName" class="col col-form-label">'+
            '      Strategy:'+
            '    </label>'+
            '    <div class="col">'+
            // '      <input type="text" class="form-control strategyCmd_'+tokenAddr+'" placeholder="" value="'+(token.strategyCmd ? token.strategyCmd : "" )+'" '+(token.sellInStrategy==true ? "" : "readonly")+ ' >'+
            '      <div class="btn btn-default btnNormal strategyCmd_'+tokenAddr+'">Set Strategy</div>'+
            '    </div>'+
            '  </div>'+
            '  <div class="form-group row">'+
            '    <label for="customerName" class="col col-form-label">'+
            '      Slippage Phù hợp'+
            '    </label>'+
            '    <div class="col">'+
            '      <input type="text" class="form-control slippage_'+tokenAddr+'" placeholder="" value="'+(token.slippage )+'" readonly>'+
            '    </div>'+
            '  </div>'+
            '  <div class="form-group row">'+
            '    <label for="customerName" class="col col-form-label">'+
            '      Max Slippage'+
            '    </label>'+
            '    <div class="col">'+
            '      <input type="text" class="form-control maxSlippage_'+tokenAddr+'" placeholder="" value="'+(token.maxSlippage ? token.maxSlippage : 0 )+'">'+
            '    </div>'+
            '  </div>'+
            '  <div class="form-group row">'+
            '    <label for="customerName" class="col col-form-label">'+
            '      Số tiền nhận sau slippage'+
            '    </label>'+
            '    <div class="col">'+
            '      <input type="text" readonly class="form-control amountOutMin_'+tokenAddr+'" placeholder="" value="'+token.amountOutMinFixed+' $">'+
            '    </div>'+
            '  </div>'+
            '  <div class="form-group row">'+
            '    <label for="customerName" class="col col-form-label">'+
            '      Transaction Fee'+
            '    </label>'+
            '    <div class="col">'+
            '      <input type="text" readonly class="form-control transactionFee_'+tokenAddr+'" placeholder="" value="'+transactionFeeView+'">'+
            '    </div>'+
            '  </div>'+
            '  <div class="form-group row">'+
            '    <label for="customerName" class="col col-form-label">'+
            '      Token muốn swap sang'+
            '    </label>'+
            '    <div class="col">'+
            '      <input type="text" class="form-control expectedSwapToken_'+tokenAddr+'" id="" placeholder="Optional,default BUSD" value="'+(token.expectedSwapToken ? token.expectedSwapToken : data.BUSD )+'">'+
            '    </div>'+
            '  </div>'+
            '  <div class="form-group row">'+
            // "     <div class='col btn btn-default btnNormal tokenSave tokenSave_"+tokenAddr+"'>Lưu</div>"+
            "     <div class='col btn btn-default btnNormal tokenSellNow_"+tokenAddr+"'>Bán ngay</div>"+
            "     <div class='col btn btn-default btnNormal tokenDelete tokenDelete_"+tokenAddr+"'>Xoá</div>"+
            "     <div class='col btn btn-default btnNormal'><a href='https://poocoin.app/tokens/"+tokenAddr+"'>Xem chart</a></div>"+
            '  </div>'+
            ''+
            '</form>'+
          '</div>'+
        '</div>'+
      '</div>'
      )
    // $(".tokenSave_"+tokenAddr).click(tokenSaveFn);
    $(".tokenDelete_"+tokenAddr).click(tokenDeleteFn);
    $(".tokenSellNow_"+tokenAddr).click(tokenSellNowFn);
    $(".alertAtPrice_"+tokenAddr).click(setAlertAtPriceFn);
    $(".sellAtExpect_"+tokenAddr).click(setSellAtExpectFn);
    // $(".sellInStrategy_"+tokenAddr).click(setSellInStrategyFn);
    $(".strategyCmd_"+tokenAddr).click(editStrategyCmdFn);
    $(".maxSlippage_"+tokenAddr).click(editMaxSlippageFn);
    } else {
    // console.log("update btnToken_"+tokenAddr+" Only");
    $(".btnToken_"+tokenAddr).html(token.tokenName+' | '+token.balance + ' Token | '+ token.amountOutFullFixed +" BUSD")
    $(".amountOutMin_"+tokenAddr).val(token.amountOutMinFixed+"$");
    $(".slippage_"+tokenAddr).val(token.slippage)
    $(".transactionFee_"+tokenAddr).val(transactionFeeView)
    }
}

// function setSellInStrategyFn(){
//   var tokenAddr = $(this).attr("class").split(" ").pop().split("_").pop();
//   var checked = $(this).is(":checked");
//   console.log("set sell in strategy "+tokenAddr+" "+checked);

//   for (var e in tokenList) {
//     if (tokenList[e].address == tokenAddr) {
//       tokenList[e].sellInStrategy = checked;
//       if (checked==true){
//           $(".expectedSell_"+tokenAddr).val("0");
//           $(".expectedSell_"+tokenAddr).prop('readonly', true);
//           $(".strategyCmd_"+tokenAddr).prop('readonly', false);
//       } else {
//           $(".expectedSell_"+tokenAddr).prop('readonly', false);
//           $(".strategyCmd_"+tokenAddr).prop('readonly', true);
//           $(".strategyCmd_"+tokenAddr).val("")
//       }
//       break;
//     }
// // address : addr,
// // slippage : 1,
// // maxSlippage : 1
//   }
//   console.log(tokenList);
//   localStorage.setItem("tokenList",JSON.stringify(tokenList));
// }

function setSellAtExpectFn(){
  var tokenAddr = $(this).attr("class").split(" ").pop().split("_").pop();
  var checked = $(this).is(":checked");
  console.log("set sell token "+tokenAddr+" "+checked);

  for (var e in tokenList) {
    if (tokenList[e].address == tokenAddr) {
      tokenList[e].sellAtExpect = checked;
      break;
    }
// address : addr,
// slippage : 1,
// maxSlippage : 1
  }
  console.log(tokenList);
  localStorage.setItem("tokenList",JSON.stringify(tokenList));
}

function editMaxSlippageFn(){
  console.log("editMaxSlippageFn");
  var tokenAddr = $(this).attr("class").split(" ").pop().split("_").pop();

  for (var e in tokenList) {
    if (tokenList[e].address == tokenAddr) {
      tokenList[e].maxSlippage = $(".maxSlippage_"+tokenAddr).val();
      break;
    }
// address : addr,
// slippage : 1,
// maxSlippage : 1
  }
  console.log(tokenList);
  localStorage.setItem("tokenList",JSON.stringify(tokenList));
}

function setAlertAtPriceFn(){
  var tokenAddr = $(this).attr("class").split(" ").pop().split("_").pop();
  var checked = $(this).is(":checked");
  console.log("set alert token "+tokenAddr+" "+checked);

  for (var e in tokenList) {
    if (tokenList[e].address == tokenAddr) {
      tokenList[e].alert = checked;
      break;
    }
// address : addr,
// slippage : 1,
// maxSlippage : 1
  }
  console.log(tokenList);
  localStorage.setItem("tokenList",JSON.stringify(tokenList));
}

// function tokenSaveFn(){
//   var tokenAddr = $(this).attr("class").split(" ").pop().split("_").pop();
//   console.log("Save token "+tokenAddr);

//   for (var e in tokenList) {
//     if (tokenList[e].address == tokenAddr) {
//       tokenList[e].slippage = $(".slippage_"+tokenAddr).val();
//       tokenList[e].maxSlippage = $(".maxSlippage_"+tokenAddr).val();
//       tokenList[e].expectedSell = $(".expectedSell_"+tokenAddr).val();
//       tokenList[e].expectedSwapToken = $(".expectedSwapToken_"+tokenAddr).val();
//       // tokenList[e].strategyCmd = $(".strategyCmd_"+tokenAddr).val();
//       break;
//     }
// // address : addr,
// // slippage : 1,
// // maxSlippage : 1
//   }
//   localStorage.setItem("tokenList",JSON.stringify(tokenList));
// }

function tokenDeleteFn(){
  var tokenAddr = $(this).attr("class").split(" ").pop().split("_").pop();
  console.log("Delete token "+tokenAddr);

  for (var e in tokenList) {
    if (tokenList[e].address == tokenAddr) {
      tokenList.splice(e, 1); 
      $(".cardElement_"+tokenAddr).remove();
      break;
    }
// address : addr,
// slippage : 1,
// maxSlippage : 1
  }
  localStorage.setItem("tokenList",JSON.stringify(tokenList));
}

function tokenSellNowFn(){
  var tokenAddr = $(this).attr("class").split(" ").pop().split("_").pop();
  console.log("Sell now token "+tokenAddr);

  for (var e in tokenList) {
    if (tokenList[e].address == tokenAddr) {
      console.log(tokenList[e]);
      // swapToken(tokenList[e]);
      swapToken(account, tokenList[e].amountInFull, tokenList[e].amountOutMin, tokenList[e].address, data.BUSD, [], tokenList[e].slippage, tokenList[e].gasLimit)

      break;
    }
// address : addr,
// slippage : 1,
// maxSlippage : 1
  }
  localStorage.setItem("tokenList",JSON.stringify(tokenList));
}


function editStrategyCmdFn() {
    var tokenAddr = $(this).attr("class").split(" ").pop().split("_").pop();
    var tokenIndex = -1;
    for (var e in tokenList) {
      if (tokenList[e].address == tokenAddr) {
        tokenIndex = e;
        break;
      }
    }

    if (!tokenList[tokenIndex].strategyCmd) {
      tokenList[tokenIndex].strategyCmd = {
        precision : "",
        alert : "",
        alertGreaterThan : "",
        alertSmallerThan : "",
        swap : "",
        swapIfGreaterThan : "",
        swapIfSmallerThan : ""
      }
    }
    // console.log(tokenList[tokenIndex].strategyCmd)

    var lsBtnShip = 
    '<h5>Lên kế hoạch</h5>'+
    '<div>Precision:<input type="text" class="form-control smPrecision" value="'+tokenList[tokenIndex].strategyCmd["precision"]+'"></div>'+
    '<div>Alert at:<input type="text" class="form-control smAlertAt" value="'+tokenList[tokenIndex].strategyCmd["alert"]+'"></div>'+
    '<div>Alert when greater than:<input type="text" class="form-control smAlertGreaterThan" value="'+tokenList[tokenIndex].strategyCmd["alertGreaterThan"]+'"></div>'+
    '<div>Alert when smaller than:<input type="text" class="form-control smAlertSmallerThan" value="'+tokenList[tokenIndex].strategyCmd["alertSmallerThan"]+'"></div>'+
    '<div>Swap at:<input type="text" class="form-control smSwapAt" value="'+tokenList[tokenIndex].strategyCmd["swap"]+'"></div>'+
    '<div>Swap when greater than:<input type="text" class="form-control smSwapGreaterThan" value="'+tokenList[tokenIndex].strategyCmd["swapIfGreaterThan"]+'"></div>'+
    '<div>Swap when smaller than:<input type="text" class="form-control smSwapSmallerThan" value="'+tokenList[tokenIndex].strategyCmd["swapIfSmallerThan"]+'"></div>'+
    '<div class="btn btnNormal5px saveSM" >Save</div>'
    ;
    
    $("#simpleModal .modal-content").html(lsBtnShip);

    $("#simpleModal").modal('toggle');

    $(".saveSM").click(function(){
      console.log("Save Sm:"+tokenIndex);
      tokenList[tokenIndex].strategyCmd["precision"] = $(".smPrecision").val();
      tokenList[tokenIndex].strategyCmd["alert"] = $(".smAlertAt").val();
      tokenList[tokenIndex].strategyCmd["alertGreaterThan"] = $(".smAlertGreaterThan").val();
      tokenList[tokenIndex].strategyCmd["alertSmallerThan"] = $(".smAlertSmallerThan").val();
      tokenList[tokenIndex].strategyCmd["swap"] = $(".smSwapAt").val();
      tokenList[tokenIndex].strategyCmd["swapIfGreaterThan"] = $(".smSwapGreaterThan").val();
      tokenList[tokenIndex].strategyCmd["swapIfSmallerThan"] = $(".smSwapSmallerThan").val();

      $(".strategyCmd_"+tokenAddr).val(tokenList[tokenIndex].strategyCmd)

      localStorage.setItem("tokenList",JSON.stringify(tokenList));

      $("#simpleModal").modal('hide');
    });
}
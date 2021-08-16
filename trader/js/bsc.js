// $("#headerInclude").load("../common/header.html");
// $("#footerInclude").load("../common/footer.html");

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

$("#newTokenAddress").change(function(){
  var addr = $("#newTokenAddress").val();
  if (addr) {
    for (var e in tokenList) {
      if (tokenList[e].address == addr) {
        return;
      }
    }

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
      $("#newTokenAddress").val("");
    })
  }
})


var alertReceiver = localStorage.getItem("alertReceiver");
console.log(alertReceiver);
if (alertReceiver) {
  $("#alertReceiver").val(alertReceiver);
}
$("#alertReceiver").change(function(){
  alertReceiver = $("#alertReceiver").val()
  localStorage.setItem("alertReceiver",alertReceiver);
})

$("#startTrading").click(function(){
  $("#startTrading").html("Trading...");
  startTrading = true;
  document.title = "Trading....";
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
    getTokenRate(1, web3data.WBNB, 18, web3data.BUSD, 18,function(usdRate){
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

      $("#infor").html("Last update:"+timeAfterLast+" s ("+new Date().toLocaleString()+")")

      loopCount++;

      if (tokenList.length > 0 ){
        // if (loopCount < 5) {
          runLoop();
        // }
      }
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

function findNearestExpectedBalanceToAmountToSell(tokenIndex) {
  // console.log("findNearestExpectedBalanceToAmountToSell");
  if (tokenList[tokenIndex].amountOutFull == 0) {
    return {
        amountInExpectedBN : new BN("0"),
        amountInExpected : 0,
        amountOutExpectedBN : new BN("0"),
        amountOutExpected: 0
    };
  }

  // console.log(tokenList[tokenIndex]);

  var currentBalance = tokenList[tokenIndex].amountOutFull / (10 ** tokenList[tokenIndex].decimalTokenOut);//IN BUSD
  var nearestDistance = 10 ** tokenList[tokenIndex].decimalTokenOut;
  var amountInFull = tokenList[tokenIndex].amountInFull / (10 ** tokenList[tokenIndex].decimalTokenIn);
  var nearestAmountInFull = amountInFull

  var rate = currentBalance / nearestAmountInFull;

  for(var e in tokenList[tokenIndex].strategyLs){
    var strItem = tokenList[tokenIndex].strategyLs[e];
    if (!strItem.key) {
      continue;
    }
    // console.log(strItem)

    if (strItem.key == "swap" || strItem.key == "swapIfGreaterThan" || strItem.key == "swapIfSmallerThan") {
      var expectedBalance = strItem.value;
      var distance = Math.abs(currentBalance - expectedBalance);
      // console.log(currentBalance)
      // console.log(expectedBalance);
      // console.log(distance)
      // console.log(nearestDistance)
      if (distance < nearestDistance && strItem.amount < amountInFull) {
        nearestDistance = distance;
        nearestAmountInFull = strItem.amount;
      }
    }
  }
  amountOutExpected = nearestAmountInFull * rate;
  // console.log(nearestAmountInFull);
  return {
    amountInExpectedBN: new BN((nearestAmountInFull * (10 ** tokenList[tokenIndex].decimalTokenIn)).toString()),
    amountInExpected : nearestAmountInFull,
    amountOutExpectedBN : new BN((amountOutExpected * (10 ** tokenList[tokenIndex].decimalTokenOut)).toString()),
    amountOutExpected : amountOutExpected
  }
}

function updateEachToken(tokenIndex,callback) {
  var token = tokenList[tokenIndex];

  var tokenAddr = token.address;
  if (!walletAddress) {
    callback();
    return;
  }
  getTokenInfor(tokenAddr, walletAddress, function(tokenName, decimal,balance, balanceFull){
                                                  // ERC20,    18,    100(BNB), 100 000 000 000 000 000 000  
    tokenList[tokenIndex].tokenName = tokenName;
    tokenList[tokenIndex].balance = balance;
    tokenList[tokenIndex].balanceFull = balanceFull;
    tokenList[tokenIndex].decimal = decimal;

    // var amountToSellFull = 0
    // if (!tokenList[tokenIndex].amountToSell) {
    //   amountToSellFull = balanceFull;
    // } else {
    //   amountToSellFull = new BN((tokenList[tokenIndex].amountToSell * (10 ** decimal)).toString());
    //   if (amountToSellFull > balanceFull) {
    //     amountToSellFull = balanceFull;
    //   }
    // }

    calculateCurrentPriceInBUSD(balanceFull, tokenAddr, 
                              // 100 (BNB),       0xabc
      // function(amountOutFullFixed, amountOutMinFixed, amountOutFull, amountOutMin, amountInFull, decimalTokenIn, decimalTokenOut){
      function(amountOutFullFixed, amountOutFull, amountInFull, decimalTokenIn, decimalTokenOut){
            // 300 BUSD,          300 * 10^18,    100 * 10^18,  18,             18
        // console.log("Line 106")
        // console.log(amount)
        // console.log(tokenName)
        // console.log(amountInFull.toString());
        tokenList[tokenIndex].amountInFull = amountInFull;
        tokenList[tokenIndex].amountOutFull = amountOutFull;
        tokenList[tokenIndex].decimalTokenIn = decimalTokenIn;
        tokenList[tokenIndex].decimalTokenOut = decimalTokenOut;
        tokenList[tokenIndex].amountOutFullFixed = amountOutFullFixed;

        var nearestStrategy = findNearestExpectedBalanceToAmountToSell(tokenIndex);        

        var amountInExpectedBN = nearestStrategy.amountInExpectedBN;
        var amountOutExpectedBN = nearestStrategy.amountOutExpectedBN;
        var amountInExpected = nearestStrategy.amountInExpected;
        var amountOutExpected = nearestStrategy.amountOutExpected;
        var amountToSell = nearestStrategy.amountInExpected;

        tokenList[tokenIndex].amountInExpectedBN = amountInExpectedBN;
        tokenList[tokenIndex].amountOutExpectedBN = amountOutExpectedBN;
        tokenList[tokenIndex].amountInExpected = amountInExpected;
        tokenList[tokenIndex].amountOutExpected = amountOutExpected;
        tokenList[tokenIndex].amountToSell = amountToSell;


        try {
          calculateSlippage(walletAddress, amountInExpectedBN, amountOutExpectedBN, tokenAddr, web3data.BUSD,[],  1, tokenList[tokenIndex].maxSlippage,
            function(suitableSlippage, transactionFee, gasLimit, amountOutMin){
                    // 2,              0.0003,         21000,    290 * 10^18
              // console.log(suitableSlippage);
              // console.log(transactionFee);
              // console.log(amountOutMin.toString());

              var amountOutMinFixed = (amountOutMin / (10 ** decimalTokenOut)).toFixed(5)
              // console.log(amountOutMinFixed)
              tokenList[tokenIndex].slippage = suitableSlippage;
              tokenList[tokenIndex].amountOutMin = amountOutMin;

              tokenList[tokenIndex].transactionFee = transactionFee;

              tokenList[tokenIndex].amountOutMinFixed = amountOutMinFixed;
              tokenList[tokenIndex].gasLimit = gasLimit;

              // console.log(tokenList[tokenIndex].amountToSell);

              // if (!tokenList[tokenIndex].amountToSell) {
              //   tokenList[tokenIndex].amountToSell = balanceFull / (10 ** decimal);
              // } else {
              //   if (tokenList[tokenIndex].amountToSell > balanceFull / (10 ** decimal)) {
              //     tokenList[tokenIndex].amountToSell = balanceFull / (10 ** decimal);
              //   } 
              // }

              triggerAction(tokenIndex,function(){
                updateUIToken(tokenIndex);              
                callback();
                return;
              })
            })
        }catch(e){
          console.log(e)
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
  var alertNow = false;

  var strSwapIndex = -1;

  if (token.amountOutFullFixed == "0") {
    callback();
    return;
  }

  // if (token.sellInStrategy==true) {
  // console.log(token);
  // console.log(token.strategyLs);
  if (!tokenList[tokenIndex].strategyLs || tokenList[tokenIndex].strategyLs.length==0){
    callback();
    return;
  }

  var cmdLs = tokenList[tokenIndex].strategyLs;
  var mulPrecision = 1;
  var referedValue  = tokenList[tokenIndex].amountOutFull / (10 ** tokenList[tokenIndex].decimalTokenOut);


  var runStrategyStep = function(step) {
    cmdLs = tokenList[tokenIndex].strategyLs;
    // console.log("runStrategyStep:"+step)
    // console.log(cmdLs); 
    if (step > cmdLs.length) {
      callback()
      return;
    }
    if (!cmdLs[step]) {
      runStrategyStep(step+1);
      return;
    }
    if (!cmdLs[step].key) {
      runStrategyStep(step+1);
      return;
    }
    var key = cmdLs[step].key;
    var value = cmdLs[step].value;
    var amount = cmdLs[step].amount;

    console.log(cmdLs[step])

    if (key=="precision") {
      mulPrecision = 10 ** parseInt(value)
      runStrategyStep(step+1);
      return;
    } else if (key=="alert") {
      var v = parseInt(referedValue * mulPrecision);
      var av = parseInt(value * mulPrecision);

      if (v == av) {
        // window.alert(token.tokenName + " at "+value);
        // tokenList[tokenIndex].strategyLs[step] = {};
        alertNow = true;
      }
      // runStrategyStep(step+1);
      // return;
    } else if (key=="alertGreaterThan") {
      var v = parseInt(referedValue * mulPrecision);
      var av = parseInt(value * mulPrecision);

      if (v > av) {
        // window.alert(token.tokenName + " greater than "+value);
        // tokenList[tokenIndex].strategyLs[step] = {};
        alertNow = true;
      }
      // runStrategyStep(step+1);
      // return;
    } else if (key=="alertSmallerThan") {
      var v = parseInt(referedValue * mulPrecision);
      var av = parseInt(value * mulPrecision);

      if (v < av) {
        // window.alert(token.tokenName + " smaller than "+value);
        // tokenList[tokenIndex].strategyLs[step] = {};
        alertNow = true;
      }
      // runStrategyStep(step+1);
      // return;
    } else if (key=="swap") {
      var v = parseInt(referedValue * mulPrecision);
      var av = parseInt(value * mulPrecision);

      if (v == av) {
        swapNow = true;
      }
    } else if (key=="swapIfGreaterThan") {
      var v = parseInt(referedValue * mulPrecision);
      var av = parseInt(value * mulPrecision);
      console.log("swapIfGreaterThan")
      console.log(v);
      console.log(av);
      if (v > av) {
        swapNow = true;
      }
    } else if (key=="swapIfSmallerThan") {
      var v = parseInt(referedValue * mulPrecision);
      var av = parseInt(value * mulPrecision);

      if (v < av) {
        swapNow = true;
      }
    }
    console.log("alertNow:"+alertNow);

    if (alertNow) {

      $(".modal-body").empty();

      $(".modal-body").html("<p id='modelContent'>"+key+ " " +token.tokenName + " now at "+value+" </p>");

      $('#myModal').modal('toggle');

      tokenList[tokenIndex].strategyLs[step] = {};
      saveTokenList();

      console.log("Lets alert");
      if (alertReceiver){
        var headers_obj = {
          'To': alertReceiver,
          'Subject': key+" "+token.tokenName + " at "+value,
          'Content-Type': 'text/html; charset="UTF-8"'
        };

        var mbody = "<a href='https://poocoin.app/tokens/"+token.address+"'>Xem chart</a><br/>"+
                  "<p>Token</p><br/>"+
                  "<span>"+token.address+"</span>";

        sendEmail(headers_obj,"<a href='https://poocoin.app/tokens/"+token.address+"'>Xem chart</a>", function(){
          console.log("Send Email");
        });
      }

      runStrategyStep(step + 1);
      return;
    }

    console.log("swapNow:"+swapNow)
    if (swapNow) {
      console.log("Lets swap");
      swapNowFn(tokenIndex, function(status,tx){
        console.log(status,tx);
        if (status == true) {

          if (alertReceiver) {
            var headers_obj = {
              'To': alertReceiver,
              'Subject': "SWAP "+token.tokenName +" "+token.amountInExpected + " at "+value,
              'Content-Type': 'text/html; charset="UTF-8"'
            };

            var mbody = "<a href='https://poocoin.app/tokens/"+token.address+"'>Xem chart</a><br/>"+
                  "<a href='https://bscscan.com/tx/"+tx.transactionHash+"'>Xem transaction</a><br/>"+
                  "<p>Token</p><br/>"+
                  "<span>"+token.address+"</span>";

            sendEmail(headers_obj, mbody, function(){
              console.log("Send Email");
            });
          }

          tokenList[tokenIndex].strategyLs[step] = {};
          console.log("True");
          saveTokenList();
        }

        runStrategyStep(step + 1);
        return;
      })
    } else {
      runStrategyStep(step + 1);
      return;
    }
  }

  runStrategyStep(0);
}

function updateUIToken(tokenIndex){

  var token = tokenList[tokenIndex];
  var tokenAddr = token.address;
  var transactionFeeView = token.transactionFee == 0 ? "Không tính được" : (token.transactionFee * busdRate).toFixed(6) + " $";

  // console.log(token);

  // var addHearderColor = "";
  // if (startTrading == true) {
  //   addHearderColor = "themeMustard";
  // }
  if (!$('.cardElement_'+tokenAddr)[0]) {
    var cardBody ="abc"

    $("#listBSC").append(
      // '<a href="#" class="list-group-item list-group-item-action orderelement order_'+e+'">'+web3data[e][0]+' | '+web3data[e][2]+' | '+web3data[e][5]+'</a>'
      '<div class="card cardElement_'+tokenAddr+'">'+
        '<div class="card-header classheading_'+tokenAddr+'" id="heading_'+tokenAddr+'">'+
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
            '      SL Token muốn bán'+
            '    </label>'+
            '    <div class="col">'+
            '      <input type="text" class="form-control amountToSellToken_'+tokenAddr+'" placeholder="" value="'+(token.amountToSell)+'" readonly>'+
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
            // '  <div class="form-group row">'+
            // '    <label for="customerName" class="col col-form-label">'+
            // '      Token muốn swap sang'+
            // '    </label>'+
            // '    <div class="col">'+
            // '      <input type="text" class="form-control expectedSwapToken_'+tokenAddr+'" id="" placeholder="Optional,default BUSD" value="'+(token.expectedSwapToken ? token.expectedSwapToken : data.BUSD )+'">'+
            // '    </div>'+
            // '  </div>'+
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
      // $(".alertAtPrice_"+tokenAddr).click(setAlertAtPriceFn);
      // $(".sellAtExpect_"+tokenAddr).click(setSellAtExpectFn);
      // $(".sellInStrategy_"+tokenAddr).click(setSellInStrategyFn);
      $(".strategyCmd_"+tokenAddr).click(editStrategyCmdFn2);
      $(".maxSlippage_"+tokenAddr).click(editMaxSlippageFn);
      // $(".amountToSellToken_"+tokenAddr).change(editAmountToSellTokenFn);
    } else {
      // console.log("update btnToken_"+tokenAddr+" Only");
      $(".btnToken_"+tokenAddr).html(token.tokenName+' | '+token.balance + ' Token | '+ token.amountOutFullFixed +" BUSD")
      $(".amountOutMin_"+tokenAddr).val(token.amountOutMinFixed+"$");
      $(".slippage_"+tokenAddr).val(token.slippage)
      $(".transactionFee_"+tokenAddr).val(transactionFeeView)
      $(".amountToSellToken_"+tokenAddr).val(token.amountToSell);
      if (startTrading) {
        $("#heading_"+tokenAddr).css("background-color","#c57e0f")
      }
      // $("#heading_"+tokenAddr).css("color","white")

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

// function editAmountToSellTokenFn(){
//   var tokenAddr = $(this).attr("class").split(" ").pop().split("_").pop();
//   console.log("editAmountToSellTokenFn "+tokenAddr);

//   for (var e in tokenList) {
//     if (tokenList[e].address == tokenAddr) {
//       var v = $(".amountToSellToken_"+tokenAddr).val();
//       if (v.indexOf("%")>0) {
//         var percent = v.substring(0,v.indexOf("%"));
//         console.log(v);
//         console.log(tokenList[e])
//         v = (tokenList[e].balanceFull / (10 ** tokenList[e].decimal)) * (parseFloat(percent) / 100);
//         tokenList[e].amountToSell = v;
//         $(".amountToSellToken_"+tokenAddr).val(v);
//       } else {
//         if (v > (tokenList[e].balanceFull / (10 ** tokenList[e].decimal))) {
//           v = (tokenList[e].balanceFull / (10 ** tokenList[e].decimal));
//         }
//         tokenList[e].amountToSell = v;
//         $(".amountToSellToken_"+tokenAddr).val(v);
//       }
//       break;
//     }
// // address : addr,
// // slippage : 1,
// // maxSlippage : 1
//   }
//   // console.log(tokenList);
//   localStorage.setItem("tokenList",JSON.stringify(tokenList));
// }

// function setSellAtExpectFn(){
//   var tokenAddr = $(this).attr("class").split(" ").pop().split("_").pop();

//   for (var e in tokenList) {
//     if (tokenList[e].address == tokenAddr) {
//       var v = $(".amountToSellToken_"+tokenAddr).val();
//       if (v.indexOf("%")>0) {
//         v = v.substring(0,v.indexOf("%"));
//         console.log(v);
//       }
//       tokenList[e].amountToSell = v;
//       break;
//     }
// // address : addr,
// // slippage : 1,
// // maxSlippage : 1
//   }
//   console.log(tokenList);
//   localStorage.setItem("tokenList",JSON.stringify(tokenList));
// }

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
  // console.log(tokenList);
  localStorage.setItem("tokenList",JSON.stringify(tokenList));
}

// function setAlertAtPriceFn(){
//   var tokenAddr = $(this).attr("class").split(" ").pop().split("_").pop();
//   var checked = $(this).is(":checked");
//   console.log("set alert token "+tokenAddr+" "+checked);

//   for (var e in tokenList) {
//     if (tokenList[e].address == tokenAddr) {
//       tokenList[e].alert = checked;
//       break;
//     }
// // address : addr,
// // slippage : 1,
// // maxSlippage : 1
//   }
//   console.log(tokenList);
//   localStorage.setItem("tokenList",JSON.stringify(tokenList));
// }

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

function swapNowFn(tokenIndex, callback){
  $("#loadingSpin").show();

  swapToken(account, 
    tokenList[tokenIndex].amountInExpectedBN, tokenList[tokenIndex].amountOutExpectedBN, 
    tokenList[tokenIndex].address, web3data.BUSD, [], tokenList[tokenIndex].slippage, 
    tokenList[tokenIndex].gasLimit,function(status,tx){
      $("#loadingSpin").hide();

      $(".modal-body").empty();

      if (status == true) {
        $(".modal-body").html("<p id='modelContent'>DONE: Swap "+parseFloat(tokenList[tokenIndex].amountInExpected).toFixed(3)+" "+tokenList[tokenIndex].tokenName
            +" for "+parseFloat(tokenList[tokenIndex].amountOutExpected).toFixed(3)+" BUSD"+"</p>");
      } else{
        $(".modal-body").html("<p id='modelContent'>CAN NOT: Swap "+parseFloat(tokenList[tokenIndex].amountInExpected).toFixed(3)+" "+tokenList[tokenIndex].tokenName
            +" for "+parseFloat(tokenList[tokenIndex].amountOutExpected).toFixed(3)+" BUSD"+"</p>");
      }
      $('#myModal').modal('toggle');

      callback(status,tx);
    });
}

function tokenSellNowFn(){
  var tokenAddr = $(this).attr("class").split(" ").pop().split("_").pop();
  console.log("Sell now token "+tokenAddr);

  for (var e in tokenList) {
    if (tokenList[e].address == tokenAddr) {

      console.log(tokenList[e]);
      // swapToken(tokenList[e]);
      // swapToken(account, tokenList[e].amountInFull, tokenList[e].amountOutMin, tokenList[e].address, web3data.BUSD, [], tokenList[e].slippage, tokenList[e].gasLimit)
      swapNowFn(e, function(status,tx){
        console.log(status,tx);
      })

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

    // $(".saveSM").click(function(){
    //   console.log("Save Sm:"+tokenIndex);
    //   tokenList[tokenIndex].strategyCmd["precision"] = $(".smPrecision").val();
    //   tokenList[tokenIndex].strategyCmd["alert"] = $(".smAlertAt").val();
    //   tokenList[tokenIndex].strategyCmd["alertGreaterThan"] = $(".smAlertGreaterThan").val();
    //   tokenList[tokenIndex].strategyCmd["alertSmallerThan"] = $(".smAlertSmallerThan").val();
    //   tokenList[tokenIndex].strategyCmd["swap"] = $(".smSwapAt").val();
    //   tokenList[tokenIndex].strategyCmd["swapIfGreaterThan"] = $(".smSwapGreaterThan").val();
    //   tokenList[tokenIndex].strategyCmd["swapIfSmallerThan"] = $(".smSwapSmallerThan").val();

    //   $(".strategyCmd_"+tokenAddr).val(tokenList[tokenIndex].strategyCmd)

    //   localStorage.setItem("tokenList",JSON.stringify(tokenList));

    //   $("#simpleModal").modal('hide');
    // });
}

function saveTokenList(){
  localStorage.setItem("tokenList",JSON.stringify(tokenList));
}

var addTokenPercentFn = function(target,tokenIndex){
  // console.log("addTokenPercentFn");
  // console.log($(this));
  // target.val(123);
  //       var v = $(".amountToSellToken_"+tokenAddr).val();
//       if (v.indexOf("%")>0) {
//         v = v.substring(0,v.indexOf("%"));
//         console.log(v);
//       }
//       tokenList[e].amountToSell = v;
  
  var v = target.val();

  if (v.indexOf("%")>0) {
    var percent = v.substring(0,v.indexOf("%"));
    // console.log(v);
    // console.log(tokenList[tokenIndex])
    v = (tokenList[tokenIndex].balanceFull / (10 ** tokenList[tokenIndex].decimal)) * (parseFloat(percent) / 100);
    target.val(v);
  } else {
    if (v > (tokenList[tokenIndex].balanceFull / (10 ** tokenList[tokenIndex].decimal))) {
      v = (tokenList[tokenIndex].balanceFull / (10 ** tokenList[tokenIndex].decimal));
    }
    target.val(v);
  }

}

function editStrategyCmdFn2() {
    var tokenAddr = $(this).attr("class").split(" ").pop().split("_").pop();
    var tokenIndex = -1;
    for (var e in tokenList) {
      if (tokenList[e].address == tokenAddr) {
        tokenIndex = e;
        break;
      }
    }

    if (!tokenList[tokenIndex].strategyLs) {
      tokenList[tokenIndex].strategyLs = [];
      // FORM: {key: "key",value : "value", amount : ""};
    }


    // console.log(tokenList[tokenIndex].strategyCmd)

    var lsBtnShip = 
      '    <h5>Build Strategy</h5>'+
      '    <form class="container">'+
      '      <div class="form-group">'+
      '        <label for="importSchedule" class="col-form-label">'+
      '         Select'+
      '       </label>'+
      '          <div class="">'+
      '            <select class="mdb-select md-form form-control cmdMiniSelect"'+
      '              >'+
      '              <option value="default">Please Select</option>'+
      '              <option value="precision">Precision</option>'+
      '              <option value="alert">Alert</option>'+
      '              <option value="alertGreaterThan">Alert If greater than</option>'+
      '              <option value="alertSmallerThan">Alert If smaller than</option>'+
      '              <option value="swap">swap at</option>'+
      '              <option value="swapIfGreaterThan">swap If greater than</option>'+
      '              <option value="swapIfSmallerThan">swap If smaller than</option>'+
      '            </select>'+
      '          </div>'+
      '      </div>'+

      '      '+
      '      <div class="cmdMiniContent">'+
      '      </div>'+

      '      <div class="btn btn-primary mb-2 miniaddNewStrategy">Add Strategy</div>'+
      // '      <div class="btn btn-primary mb-2" id="minibtnRefresh">Xoá hết thông tin</div>'+
      '      <div class="cmdLsStrategies">'+
      '      </div>'+
      ''+
      '    </form>';
    
    $("#simpleModal .modal-content").html(lsBtnShip);

    $("#simpleModal").modal('toggle');

    var e = 0;
    var strLen = tokenList[tokenIndex].strategyLs.length;
    while (e < strLen) {
      var strItem = tokenList[tokenIndex].strategyLs[e];
      if (!strItem || !strItem.key) {
        tokenList[tokenIndex].strategyLs.splice(e,1);
        e = 0;
        strLen = strLen - 1;
      } else {
        e = e + 1; 
      }
    }

    var removeTokenStr = function(){
      var strIndex = $(this).attr("class").split(" ").pop().split("_").pop();
      console.log("remove str:"+strIndex)
      $(this).remove();
      tokenList[tokenIndex].strategyLs[strIndex] = {};
      saveTokenList();
      // window.reload();
    }

    for(var e in tokenList[tokenIndex].strategyLs){
        var strItem = tokenList[tokenIndex].strategyLs[e];
        if (!strItem.amount){
          $(".cmdLsStrategies").append("<span class='btn btn-secondary lsStrategy lsStrategy_"+e+"'>"+strItem.key+":"+strItem.value+"</span>");
        } else {
          $(".cmdLsStrategies").append("<span class='btn btn-secondary lsStrategy lsStrategy_"+e+"'>"+strItem.key+":"+strItem.value+":"+strItem.amount+"</span>");        
        }
        $(".lsStrategy_"+e).click(removeTokenStr);     
    }

    $(".cmdMiniSelect").change(function(){
      // console.log($(".cmdMiniSelect").val())
      $('.miniaddNewStrategy').unbind('click');
      // console.log($('.miniaddNewStrategy'));

      if ($(".cmdMiniSelect").val()=="default"){
        $(".cmdMiniContent").html(
          '     <div class="form-group">'+
          '        <label for="productName" class="col-form-label">Please select</label>'+
          '     </div>'
          )
      } else if ($(".cmdMiniSelect").val()=="precision"){
        $(".cmdMiniContent").html(
          '     <div class="form-group">'+
          '        <label for="productName" class="col-form-label">Precision at (0-6)</label>'+
          '        <div class="">'+
          '          <input type="text" class="form-control smPrecision"  placeholder="" >'+
          '        </div>'+
          '     </div>'
          )
        $(".miniaddNewStrategy").click(function(){
          var key = "precision";
          var value = $(".smPrecision").val();
          var index = tokenList[tokenIndex].strategyLs.length;

          tokenList[tokenIndex].strategyLs.push({
            key,
            value
          });

          $(".cmdLsStrategies").append("<span class='btn btn-secondary lsStrategy lsStrategy_"+index+"'>"+key+":"+value+"</span>");
          $(".lsStrategy_"+index).click(removeTokenStr)
          saveTokenList();
        })
      } else if ($(".cmdMiniSelect").val()=="alert"){
        $(".cmdMiniContent").html(
          '     <div class="form-group">'+
          '        <label for="productName" class="col-form-label">Alert At</label>'+
          '        <div class="">'+
          '          <input type="text" class="form-control smAlertAt"  placeholder="" >'+
          '        </div>'+          
          '     </div>'
          )
        $(".miniaddNewStrategy").click(function(){
          // tokenList[tokenIndex].strategyCmd["alert"] = $(".smAlertAt").val()

          var key = "alert";
          var value = $(".smAlertAt").val();
          var index = tokenList[tokenIndex].strategyLs.length;

          tokenList[tokenIndex].strategyLs.push({
            key,
            value
          });
          $(".cmdLsStrategies").append("<span class='btn btn-secondary lsStrategy lsStrategy_"+index+"'>"+key+":"+value+"</span>");
          $(".lsStrategy_"+index).click(removeTokenStr)
          saveTokenList();

        })
      } else if ($(".cmdMiniSelect").val()=="alertGreaterThan"){
        $(".cmdMiniContent").html(
          '     <div class="form-group">'+
          '        <label for="productName" class="col-form-label">Alert If Greater Than</label>'+
          '        <div class="">'+
          '          <input type="text" class="form-control smAlertGreaterThan"  placeholder="" >'+
          '        </div>'+          
          '     </div>'
          )
        $(".miniaddNewStrategy").click(function(){
          // tokenList[tokenIndex].strategyLs.append({
          //   key :"alertGreaterThan",
          //   value : $(".smAlertGreaterThan").val()
          // }
          var key = "alertGreaterThan";
          var value = $(".smAlertGreaterThan").val();
          var index = tokenList[tokenIndex].strategyLs.length;

          tokenList[tokenIndex].strategyLs.push({
            key,
            value
          });
          $(".cmdLsStrategies").append("<span class='btn btn-secondary lsStrategy lsStrategy_"+index+"'>"+key+":"+value+"</span>");
          $(".lsStrategy_"+index).click(removeTokenStr)
          saveTokenList();

        })
      } else if ($(".cmdMiniSelect").val()=="alertSmallerThan"){
        $(".cmdMiniContent").html(
          '     <div class="form-group">'+          
          '        <label for="productName" class="col-form-label">Alert If Smaller Than</label>'+
          '        <div class="">'+
          '          <input type="text" class="form-control smAlertSmallerThan"  placeholder="" >'+
          '        </div>'+          
          '     </div>'
          )
        $(".miniaddNewStrategy").click(function(){
          // tokenList[tokenIndex].strategyCmd["alertSmallerThan"] = $(".smAlertSmallerThan").val()
          // tokenList[tokenIndex].strategyLs.append({
          //   key :"alertSmallerThan",
          //   value : $(".smAlertGreaterThan").val()
          // }
          var key = "alertSmallerThan";
          var value = $(".smAlertSmallerThan").val();
          var index = tokenList[tokenIndex].strategyLs.length;

          tokenList[tokenIndex].strategyLs.push({
            key,
            value
          });
          $(".cmdLsStrategies").append("<span class='btn btn-secondary lsStrategy lsStrategy_"+index+"'>"+key+":"+value+"</span>");
          $(".lsStrategy_"+index).click(removeTokenStr)
          saveTokenList();

        })
      } else if ($(".cmdMiniSelect").val()=="swap"){
        $(".cmdMiniContent").html(
          '     <div class="form-group">'+          
          '        <label for="productName" class="col-form-label">Swap at:</label>'+
          '        <div class="">'+
          '          <input type="text" class="form-control smSwapAtValue"  placeholder="" >'+
          '        </div>'+             
          '        <label for="productName" class="col-form-label">Swap Amount of Token</label>'+
          '        <div class="">'+
          '          <input type="text" class="form-control smSwapAtAmount"  placeholder="" >'+
          '        </div>'+      
          '     </div>'
          )
        $(".smSwapAtAmount").change(function(){
          addTokenPercentFn($(this),tokenIndex);
        });
        $(".miniaddNewStrategy").click(function(){
          // tokenList[tokenIndex].strategyCmd["alertSmallerThan"] = $(".smAlertSmallerThan").val()
          // tokenList[tokenIndex].strategyLs.append({
          //   key :"alertSmallerThan",
          //   value : $(".smAlertGreaterThan").val()
          // }
          var key = "swap";
          var value = $(".smSwapAtValue").val();
          var amount = $(".smSwapAtAmount").val();

          var index = tokenList[tokenIndex].strategyLs.length;

          tokenList[tokenIndex].strategyLs.push({
            key,
            value,
            amount
          });
          $(".cmdLsStrategies").append("<span class='btn btn-secondary lsStrategy lsStrategy_"+index+"'>"+key+":"+value+":"+amount+"</span>");
          $(".lsStrategy_"+index).click(removeTokenStr)
          saveTokenList();

        })
      } else if ($(".cmdMiniSelect").val()=="swapIfGreaterThan"){
        $(".cmdMiniContent").html(
          '     <div class="form-group">'+          
          '        <label for="productName" class="col-form-label">Swap If Greater Than</label>'+
          '        <div class="">'+
          '          <input type="text" class="form-control smSwapIfGreaterThanValue"  placeholder="" >'+
          '        </div>'+          
          '        <label for="productName" class="col-form-label">Swap Amount of Token</label>'+
          '        <div class="">'+
          '          <input type="text" class="form-control smSwapIfGreaterThanAmount"  placeholder="" >'+
          '        </div>'+       
          '     </div>'
          )

        $(".smSwapIfGreaterThanAmount").change(function(){
          addTokenPercentFn($(this),tokenIndex);
        });
        $(".miniaddNewStrategy").click(function(){
          // tokenList[tokenIndex].strategyCmd["alertSmallerThan"] = $(".smAlertSmallerThan").val()
          // tokenList[tokenIndex].strategyLs.append({
          //   key :"alertSmallerThan",
          //   value : $(".smAlertGreaterThan").val()
          // }
          var key = "swapIfGreaterThan";
          var value = $(".smSwapIfGreaterThanValue").val();
          var amount = $(".smSwapIfGreaterThanAmount").val();

          var index = tokenList[tokenIndex].strategyLs.length;

          tokenList[tokenIndex].strategyLs.push({
            key,
            value,
            amount
          });


          $(".cmdLsStrategies").append("<span class='btn btn-secondary lsStrategy lsStrategy_"+index+"'>"+key+":"+value+":"+amount+"</span>");
          $(".lsStrategy_"+index).click(removeTokenStr)
          saveTokenList();

        })
      } else if ($(".cmdMiniSelect").val()=="swapIfSmallerThan"){
        $(".cmdMiniContent").html(
          '     <div class="form-group">'+          
          '        <label for="productName" class="col-form-label">Swap If Smaller Than</label>'+
          '        <div class="">'+
          '          <input type="text" class="form-control smSwapIfSmallerThanValue"  placeholder="" >'+
          '        </div>'+          
          '        <label for="productName" class="col-form-label">Swap Amount of Token</label>'+
          '        <div class="">'+
          '          <input type="text" class="form-control smSwapIfSmallerThanAmount"  placeholder="" >'+
          '        </div>'+       
          '     </div>'
          )

        $(".smSwapIfSmallerThanAmount").change(function(){
          addTokenPercentFn($(this),tokenIndex);
        });
        $(".miniaddNewStrategy").click(function(){
          // tokenList[tokenIndex].strategyCmd["alertSmallerThan"] = $(".smAlertSmallerThan").val()
          // tokenList[tokenIndex].strategyLs.append({
          //   key :"alertSmallerThan",
          //   value : $(".smAlertGreaterThan").val()
          // }
          var key = "swapIfSmallerThan";
          var value = $(".smSwapIfSmallerThanValue").val();
          var amount = $(".smSwapIfSmallerThanAmount").val();

          var index = tokenList[tokenIndex].strategyLs.length;

          tokenList[tokenIndex].strategyLs.push({
            key,
            value,
            amount
          });


          $(".cmdLsStrategies").append("<span class='btn btn-secondary lsStrategy lsStrategy_"+index+"'>"+key+":"+value+":"+amount+"</span>");
          $(".lsStrategy_"+index).click(removeTokenStr)
          saveTokenList();

        })
      }
    })

    // $(".saveSM").click(function(){
    //   console.log("Save Sm:"+tokenIndex);
    //   tokenList[tokenIndex].strategyCmd["precision"] = $(".smPrecision").val();
    //   tokenList[tokenIndex].strategyCmd["alert"] = $(".smAlertAt").val();
    //   tokenList[tokenIndex].strategyCmd["alertGreaterThan"] = $(".smAlertGreaterThan").val();
    //   tokenList[tokenIndex].strategyCmd["alertSmallerThan"] = $(".smAlertSmallerThan").val();
    //   tokenList[tokenIndex].strategyCmd["swap"] = $(".smSwapAt").val();
    //   tokenList[tokenIndex].strategyCmd["swapIfGreaterThan"] = $(".smSwapGreaterThan").val();
    //   tokenList[tokenIndex].strategyCmd["swapIfSmallerThan"] = $(".smSwapSmallerThan").val();

    //   $(".strategyCmd_"+tokenAddr).val(tokenList[tokenIndex].strategyCmd)

    //   localStorage.setItem("tokenList",JSON.stringify(tokenList));

    //   $("#simpleModal").modal('hide');
    // });

    // $(".lsStrategy").click(removeTokenStr)
}
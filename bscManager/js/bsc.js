$("#headerInclude").load("../common/header.html");
$("#footerInclude").load("../common/footer.html");


var tokenList = [];
try {
  tokenList = JSON.parse(localStorage.getItem("tokenList"))
}catch(e){
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
runLoop();
var loopCount = 0;
var busdRate = 300;

function runLoop() {
  if (loopCount%100) {
    getTokenRate(1, data.WBNB, 18, data.BUSD, 18,function(usdRate){
      busdRate = usdRate;
    })
  }
  setTimeout(function(){
    loadBSC(function(){
      console.log("Done loop, run again");
      
      var timeAfterLast = (parseFloat(new Date().getTime() - lastTime) / (1000)).toFixed(1)
      lastTime = new Date().getTime();
      $("#infor").html("Cập nhật lần cuối:"+timeAfterLast+" giây trước")

      loopCount++;

      runLoop();
    })
  }, 3000);
}

// loadBSC(function(){});

function loadBSC(callback){
  if (tokenList.length==0) {
    callback();
    return;
  }
  var runEachToken = function(step) {
    if (step >= tokenList.length) {
      callback();
      return;
    }
    updateEachToken(step,function(){
      runEachToken(step+1);
    })
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
  getTokenInfor(tokenAddr, walletAddress, function(tokenName, decimal,balance){
    calculateCurrentPriceInBUSD(balance, tokenAddr, token.slippage, 
      function(amountOutFullFixed, amountOutMinFixed, amountOutFull, amountOutMin, amountInFull, decimalTokenIn, decimalTokenOut){
        // console.log("Line 106")
        // console.log(amount)
        // console.log(tokenName)
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
            })
          })
    }) 
  })
}

function triggerAction(tokenIndex,callback) {
  var token = tokenList[tokenIndex];

  if (token.amountOutFullFixed == "0") {
    callback();
    return;
  }
  if (token.expectedSell == "0" || !token.expectedSell) {
    callback();
    return;
  }
  // console.log("Alert:"+token.alert)
  var lsExpectedSell = token.expectedSell.split(",");
  var swapNow = false;

  for (var e in lsExpectedSell) {
    var v = parseInt(lsExpectedSell[e])
    if (v == parseInt(token.amountOutFullFixed)){
      
      if (token.alert==true) {
        window.alert(token.tokenName + " at "+v);
      }
      if (token.sellAtExpect==true) {
        swapNow = true;
      }
    }
  }
  if (swapNow) {
      // swapToken(account, tokenList[e].amountInFull, tokenList[e].amountOutMin, tokenList[e].address, data.BUSD, [], tokenList[e].slippage)
      swapToken(account, tokenList[e].amountInFull, tokenList[e].amountOutMin, tokenList[e].address, data.BUSD, [], tokenList[e].slippage, tokenList[e].gasLimit);

      console.log("Swap Now");
      callback();
  } else {
    callback();
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
            '  <div class="form-group row">'+
            '    <label for="customerName" class="col col-form-label">'+
            '      Expectation:<br/>'+
            '      <span class="textRed">Alert:<input type="checkbox" class="alertAtPrice_'+tokenAddr+'" '+(token.alert==true ? "checked" : "")+'></span>'+
            '      <span class="textRed">Bán:<input type="checkbox" class="sellAtExpect_'+tokenAddr+'" '+(token.sellAtExpect==true ? "checked" : "")+'></span>'+
            '    </label>'+
            '    <div class="col">'+
            '      <input type="text" class="form-control expectedSell_'+tokenAddr+'" placeholder="" value="'+(token.expectedSell ? token.expectedSell : 0 )+'">'+
            '    </div>'+
            '  </div>'+
            '  '+
            '  <div class="form-group row">'+
            '    <label for="customerName" class="col col-form-label">'+
            '      Slippage Phù hợp'+
            '    </label>'+
            '    <div class="col">'+
            '      <input type="text" class="form-control slippage_'+tokenAddr+'" placeholder="" value="'+(token.slippage )+'">'+
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
            "     <div class='col btn btn-default btnNormal tokenSave tokenSave_"+tokenAddr+"'>Lưu</div>"+
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
    $(".tokenSave_"+tokenAddr).click(tokenSaveFn);
    $(".tokenDelete_"+tokenAddr).click(tokenDeleteFn);
    $(".tokenSellNow_"+tokenAddr).click(tokenSellNowFn);
    $(".alertAtPrice_"+tokenAddr).click(setAlertAtPriceFn);
    $(".sellAtExpect_"+tokenAddr).click(setSellAtExpectFn);

    } else {
    // console.log("update btnToken_"+tokenAddr+" Only");
    $(".btnToken_"+tokenAddr).html(token.tokenName+' | '+token.balance + ' Token | '+ token.amountOutFullFixed +" BUSD")
    $(".amountOutMin_"+tokenAddr).val(token.amountOutMinFixed+"$");
    $(".slippage_"+tokenAddr).val(token.slippage)
    $(".transactionFee_"+tokenAddr).val(transactionFeeView)
    }
}

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

function tokenSaveFn(){
  var tokenAddr = $(this).attr("class").split(" ").pop().split("_").pop();
  console.log("Save token "+tokenAddr);

  for (var e in tokenList) {
    if (tokenList[e].address == tokenAddr) {
      tokenList[e].slippage = $(".slippage_"+tokenAddr).val();
      tokenList[e].maxSlippage = $(".maxSlippage_"+tokenAddr).val();
      tokenList[e].expectedSell = $(".expectedSell_"+tokenAddr).val();
      tokenList[e].expectedSwapToken = $(".expectedSwapToken_"+tokenAddr).val();
      break;
    }
// address : addr,
// slippage : 1,
// maxSlippage : 1
  }
  localStorage.setItem("tokenList",JSON.stringify(tokenList));
}

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
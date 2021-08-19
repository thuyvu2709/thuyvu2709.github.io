// var herokuPrefix = "https://kenkreck1004.herokuapp.com/";
var herokuPrefix = "";
const web3 = new Web3(herokuPrefix+'https://bsc-dataseed1.binance.org:443');
const BN = web3.utils.BN;


var web3data = {
	BUSD: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
	WBNB: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", //wbnb
	factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",  //PancakeSwap V2 factory
	router: "0x10ED43C718714eb63d5aA57B78B54704E256024E", //PancakeSwap V2 router
	Slippage : 1, //in Percentage
	gasPrice : 5, //in gwei
	gasLimit : 21000, //at least 21000
	routerABI: [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}],
	factoryABI: [{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[],"name":"INIT_CODE_PAIR_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
	ERCABI:   [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]
}
// console.log(data)
routerContract = new web3.eth.Contract(web3data.routerABI,web3data.router);
factoryContract = new web3.eth.Contract(web3data.factoryABI,web3data.factory);
wbnbContract = new web3.eth.Contract(web3data.ERCABI,web3data.WBNB);

function convertNumToBN(num, decimal){
	// return new BN(new BigNumber(num.toString()).mul(10 ** decimal).toString());
	var vbn = new BN("0");
	try {
		vbn =  new BN(web3.utils.toWei(num.toString()));
		if (decimal < 18) {
			vbn = vbn.div(new BN((10 ** (18-decimal)).toString()))
		} else if (decimal > 18) {
			vbn = vbn.mul(new BN((10 ** (decimal-18)).toString()))
		}
	} catch(e) {

	}
	return vbn;
}

function convertBNToNum(bnNum, decimal) {
  var vf = web3.utils.fromWei(bnNum);
  vf = parseFloat(vf);
  if (decimal > 18) {
  	vf = vf / (10 ** (decimal - 18));
  } else if (decimal < 18) {
  	vf = vf * (10 ** (18 - decimal));
  }
  return vf;
}

function makeAccount(privateKey) {
	var account =  web3.eth.accounts.privateKeyToAccount(privateKey) 
	console.log("makeAccount")
	console.log(account);
	return account;
}

function checkLiq(tokenIn, tokenOut) {
	var fakeAddr = "0xf4Aa5a106188E003CBDced3456769EA03cA45cBD"

	factoryContract.methods.getPair(tokenIn, tokenOut).call({from: fakeAddr}, function(error, result){
		console.log(result);
		pairAddressx = result; 
		if (pairAddressx == null || pairAddressx == undefined) {
			console.log("No pair address")
			return;
	    }
	    wbnbContract.methods.balanceOf(pairAddressx).call({from: fakeAddr}, function(error, result){
	    	var liquityWBNB = result;
	    	console.log(result)
	    	console.log(web3.utils.fromWei(liquityWBNB,'ether'))

	    })
	});
}

// checkLiq('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82','0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')

function calculateCurrentPrice(amountIn, tokenIn, tokenOut, slippage) {
	// var amountInToWei = web3.utils.toWei(amountIn)
	var fakeAddr = "0xf4Aa5a106188E003CBDced3456769EA03cA45cBD"
	tokenInContract = new web3.eth.Contract(web3data.ERCABI,tokenIn);
	tokenInContract.methods.decimals().call({from: fakeAddr}, function(error, result){

		// var amountInFull = (amountIn * ( 10 ** result )).toString()
		var amountInFull = (convertNumToBN(amountIn, result)).toString();
		console.log(amountInFull)
		// var pathExchange = [tokenIn, tokenOut];

		routerContract.methods.getAmountsOut(amountInFull, [tokenIn, tokenOut]).call({from: fakeAddr}, function(error, result){
			console.log(error)
			console.log(result)
			var amounts = result;
	        // var amountOutMin = amounts[1].sub(amounts[1] (web3data.Slippage));
	        // console.log(amountOutMin)
	        // tokenOutDecimal = 18;
            // var amountOutMinParam = ethers.utils.parseUnits(web3.utils.fromWei(amountOutMin.toString()), 18);
            tokenOutContract = new web3.eth.Contract(web3data.ERCABI,tokenOut);
            // console.log(tokenOutContract);
            // console.log(bvalue.sub(bvalue.mul((1/100))))

            tokenOutContract.methods.decimals().call({from: fakeAddr}, function(error, result){
				var decimal = result;
				console.log(decimal)
				// var vDecimal = new BN(10).pow(new BN(decimal)); 
				// console.log(vDecimal);
	            var amountOutMin = new BN(amounts[1]);
	            amountOutMin = amountOutMin.sub(amountOutMin.mul(new BN(slippage)).div(new BN(100)))
	            // console.log(amountOutMin.toString())
	            // amountOutMin = (amountOutMin / (10 ** decimal)).toFixed(5)
	            amountOutMin = (convertBNToNum(amountOutMin, decimal)).toFixed(5);
	            // amountOutMin = ethers.utils.parseUnits(amountOutMin, decimal)
	            // console.log(ethers)
	            console.log(amountIn+" "+amountOutMin);
            })
		});
	})
}

function getTokenRate(amountIn, tokenIn, decimalTokenIn, tokenOut, decimalTokenOut, callback) {
	// var amountInToWei = web3.utils.toWei(amountIn)
	var fakeAddr = "0xf4Aa5a106188E003CBDced3456769EA03cA45cBD"
	tokenInContract = new web3.eth.Contract(web3data.ERCABI,tokenIn);
	// tokenInContract.methods.decimals().call({from: fakeAddr}, function(error, result){
		// var amountIn = 1;

		var amountInFull = (convertNumToBN(amountIn, decimalTokenIn)).toString();//(amountIn * ( 10 ** decimalTokenIn )).toString()
		// console.log(amountInFull)
		// var pathExchange = [tokenIn, tokenOut];

		routerContract.methods.getAmountsOut(amountInFull, [tokenIn, tokenOut]).call({from: fakeAddr}, function(error, result){
			// console.log(error)
			// console.log(result)
			var amounts = result;
	        // var amountOutMin = amounts[1].sub(amounts[1] (web3data.Slippage));
	        // console.log(amountOutMin)
	        // tokenOutDecimal = 18;
            // var amountOutMinParam = ethers.utils.parseUnits(web3.utils.fromWei(amountOutMin.toString()), 18);
            tokenOutContract = new web3.eth.Contract(web3data.ERCABI,tokenOut);
            // console.log(tokenOutContract);
            // console.log(bvalue.sub(bvalue.mul((1/100))))

            // tokenOutContract.methods.decimals().call({from: fakeAddr}, function(error, result){
				// var decimal = result;
				// console.log(decimalTokenOut)
				// var vDecimal = new BN(10).pow(new BN(decimal)); 
				// console.log(vDecimal);
	            var amountOut = new BN(amounts[1]);

	            amountOutFull = convertBNToNum(amountOut, decimalTokenOut); //(amountOut / (10 ** decimalTokenOut))

	            // console.log("Rate:"+(amountOutFull))

	            callback(amountOutFull);
            })
		// });
	// })
}

// calculateCurrentPrice('1','0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c','0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',1);

function calculateCurrentPriceInBUSD(amountInFull, tokenIn,path, callback) {
	// var amountInToWei = web3.utils.toWei(amountIn)
	var fakeAddr = "0xA781f67c8097394449217246FA3fF3303d91F018"
	tokenInContract = new web3.eth.Contract(web3data.ERCABI,tokenIn);
	
	if (!path || path.length == 0) {
		path = [tokenIn, web3data.WBNB, web3data.BUSD]
	}
	
	tokenInContract.methods.decimals().call({from: fakeAddr}, function(error, result){
		if (error) {
        	callback(0, new BN("0"), new BN("0"), 0, 0);
			return;
		}

		var decimalTokenIn = result;
		// var amountInFull = (amountIn * ( 10 ** result )).toLocaleString('fullwide', { useGrouping: false })
		// console.log(amountIn)
		if (amountInFull.toString() == 0) {
        	callback(0, new BN("0"), new BN("0"), 0, 0);
			return;
		}
		// console.log(result)
		// console.log(amountInFull)
		// var pathExchange = [tokenIn, tokenOut];
		try{
			routerContract.methods.getAmountsOut(amountInFull, path).call({from: fakeAddr}, function(error, result){

				if (error) {
	            	callback(0, new BN("0"), new BN("0"), 0, 0);
					return;
				}

				var amounts = result;
		        // var amountOutMin = amounts[1].sub(amounts[1] (web3data.Slippage));
		        // console.log(amountOutMin)
		        // tokenOutDecimal = 18;
	            // var amountOutMinParam = ethers.utils.parseUnits(web3.utils.fromWei(amountOutMin.toString()), 18);
	            tokenOutContract = new web3.eth.Contract(web3data.ERCABI,web3data.BUSD);
	            // console.log(tokenOutContract);
	            // console.log(bvalue.sub(bvalue.mul((1/100))))

	            tokenOutContract.methods.decimals().call({from: fakeAddr}, function(error, result){
					// var decimal = result;
					var decimalTokenOut = result;

					// console.log(decimal)
					// var vDecimal = new BN(10).pow(new BN(decimal)); 
					// console.log(vDecimal);
		            // var amountOutMin = new BN(amounts[2]);

		            var amountOutFull = new BN(amounts[2]);

		            // amountOutMin = amountOutMin.sub(amountOutMin.mul(new BN(slippage)).div(new BN(100)))
		            // console.log(amountOutMin.toString())
		            // amountOutMinFixed = (amountOutMin / (10 ** decimalTokenOut)).toFixed(5)
		            amountOutFullFixed = convertBNToNum(amountOutFull, decimalTokenOut).toFixed(5); //(amountOutFull / (10 ** decimalTokenOut)).toFixed(5)
		            // amountOutMin = ethers.utils.parseUnits(amountOutMin, decimal)
		            // console.log(ethers)
		            // console.log(amountIn+" "+amountOutFull+" "+amountOutMin);
		            // console.log(amountOutFullFixed+" "+amountOutMinFixed);
		            // callback(amountOutFullFixed, amountOutMinFixed, amountOutFull, amountOutMin, amountInFull, decimalTokenIn, decimalTokenOut);
		            callback(amountOutFullFixed, amountOutFull, amountInFull, decimalTokenIn, decimalTokenOut);
	            })
			});
		}catch(e){
			console.log(e);
            callback(0, new BN("0"), new BN("0"), 0, 0);
            return;
		}
	})
}

function calculateSlippage(accAddr, amountInFull, amountOutFull, tokenIn, tokenOut, path, initSlip, maxSlippage, callback) {
	// var slippage = 1;
	// console.log("calculate Slippage")
	// console.log(amountInFull.toString())
	if (amountInFull.toString() == "0") {
		// callback(initSlip, 0, new BN("0"));
		callback(initSlip, 0, 0, new BN("0"))
		return;
	};

	if (initSlip >= maxSlippage) {
		callback(initSlip, 0, 0, new BN("0"))
		return;
	}

	var runEachSlippage = function(slippage) {
		if (slippage >= maxSlippage) {
			callback(maxSlippage, 0, 0, new BN("0"))
			return;
		}

        var amountOutMin = amountOutFull.sub(amountOutFull.mul(new BN(slippage)).div(new BN(100)))
        // console.log("Check Slip:"+slippage+" "+amountOutMin);
		// calculateCurrentPriceInBUSD(amountIn,tokenIn,slippage, 
		// 	function(amountOutFullFixed, amountOutMinFixed, amountOutFull, amountOutMin, amountInFull){
		// 		console.log(amountOutFullFixed);
		// 		console.log(amountOutFull.toString());
		// 		console.log(amountOutMin.toString());
		// 		var accAddr = "0xA781f67c8097394449217246FA3fF3303d91F018";
		estimateTransactionFeeForSwap(accAddr, amountInFull, amountOutMin, tokenIn, tokenOut,path, function(status, transactionFee, gasLimit){
			// console.log(status)
			// console.log(transactionFee);
			if (status) {
				callback(slippage, transactionFee, gasLimit, amountOutMin)
				return;
			} else {
				runEachSlippage(slippage + 1);
			}
		});
			// })
	}
	runEachSlippage(initSlip);
}

function getTokenInfor(tokenIn, userAddr, callback){
	var fakeAddr = "0xf4Aa5a106188E003CBDced3456769EA03cA45cBD"
	tokenInContract = new web3.eth.Contract(web3data.ERCABI,tokenIn);
	tokenInContract.methods.decimals().call({from: fakeAddr}, function(error, result){

		if (error) {
        	callback(0, 0, 0, new BN("0"));
			return;
		}

		var decimal = result;
		tokenInContract.methods.name().call({from: fakeAddr}, function(error, result){

			if (error) {
	        	callback(0, 0, 0, new BN("0"));
				return;
			}

			var name = result;
			// console.log("Name:"+name+" Decimals"+decimal)
			tokenInContract.methods.balanceOf(userAddr).call({from: fakeAddr}, function(error, result){

				if (error) {
		        	callback(0, 0, 0, new BN("0"));
					return;
				}

				// console.log(result)
				var bal =  convertBNToNum(result, decimal).toFixed(5); //(result / (10 ** decimal)).toFixed(5)
				// console.log(bal)
				callback(name, decimal,bal,result);
			})
		})
	})
}
// getTokenInfor('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',function(name,decimal){

// });

function estimateTransactionFeeForSwap(accAddr, amountInFull,amountOutMin, tokenIn, tokenOut, path, callback) {
	// tokenInContract = new web3.eth.Contract(web3data.ERCABI,tokenIn);
	// tokenInContract.methods.decimals().call({from: fakeAddr}, function(error, result){

	// console.log(amountInFull)
    // var amountOutMin = amountOutFull.sub(amountOutFull.mul(new BN(slippage)).div(new BN(100)))
    // console.log("amountOutMin:"+amountOutMin.toString())
	if (!path || path.length == 0) {
		path = [tokenIn, web3data.WBNB, web3data.BUSD]
	}

	// const path = [INPUT_TOKEN.address, OUTPUT_TOKEN.address]
	// const to = account.address;
	const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    // console.log("estimateTrx:"+amountInFull.toString()+" "+amountOutMin.toString()+" "+path+" "+accAddr+" "+deadline)
	// estimateTrx:
		// 15000000000000000 
		// 3381471008340863396 
		// 0xfa363022816abf82f18a9c2809dcd2bb393f6ac5,0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c,0xe9e7cea3dedca5984780bafc599bd69add087d56 
		// 0x7175dCBAe09E494A11f8EF52Ea6d7F55b4489bB7 
		// 1628518255

	web3.eth.estimateGas({
		from : accAddr,
		to : web3data.router,
		gas : 5,
		// data: routerContract.methods.swapExactTokensForTokens(amountInFull.toString(),amountOutMin.toString(),path,accAddr,deadline).encodeABI() 
		data: routerContract.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(amountInFull.toString(),amountOutMin.toString(),path,accAddr,deadline).encodeABI() 		
	}).then((gasLimit) => {
		// console.log(gasLimit)
		// console.log(gasLimit);
		var gasPrice = 5 / (10 ** 9)
		// console.log(gasPrice)
		var transactionFee = gasPrice  * gasLimit; // calculate the transaction fee
		// console.log(transactionFee);
		callback(true, transactionFee, gasLimit);
	}).catch(err => {
		console.log(err)
		callback(false, 0, 0);
	}); // estimate the gas limit for this transaction
}

function swapToken(account, amountInFull,amountOutMin, tokenIn, tokenOut, path, slippage, gasLimit, callback){
	// tokenInContract = new web3.eth.Contract(web3data.ERCABI,tokenIn);
	// tokenInContract.methods.decimals().call({from: fakeAddr}, function(error, result){

	// console.log(amountInFull)
	if (!path || path.length == 0) {
		path = [tokenIn, web3data.WBNB, web3data.BUSD]
	}
	if (!gasLimit || gasLimit == 0) {
		return;
	}

	// const path = [INPUT_TOKEN.address, OUTPUT_TOKEN.address]
	// const to = account.address;
	const deadline = Math.floor(Date.now() / 1000) + 60 * 20

	const tx = {
		from : account.address,
		to : web3data.router,
		gas : 5,
		gasLimit : gasLimit,
		data: routerContract.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(amountInFull.toString(),amountOutMin.toString(),path,account.address,deadline).encodeABI() 
	};
	
	console.log(tx);
	
	signAndSend(tx,account.privateKey, function(sendCk, receipt){
		if (sendCk == true) {
			console.log(receipt);
			if (receipt.status==false) {
				callback(false, undefined);
			} else {
				callback(true, receipt);
			}
		} else {
			callback(false, undefined);
		}
	})
	// })
}


function sendTransactionInSM(fromAddress,toAddress,gasLimit,value, privateKey){
	const tx = {
	  // this could be provider.addresses[0] if it exists
	  from: fromAddress, 
	  // target address, this could be a smart contract address
	  to: toAddress, 
	  // optional if you want to specify the gas limit 
	  gas: gasLimit, 
	  // optional if you are invoking say a payable function 
	  value: value,
	  // this encodes the ABI of the method and the arguements
	  data: myContract.methods.myMethod(arg, arg2).encodeABI() 
	};
	signAndSend(tx,privateKey)
}

function sendETH(fromAddress,toAddress,gasLimit,value, privateKey){
	const tx = {
	  // this could be provider.addresses[0] if it exists
	  from: fromAddress, 
	  // target address, this could be a smart contract address
	  to: toAddress, 
	  // optional if you want to specify the gas limit 
	  gas: gasLimit, 
	  // optional if you are invoking say a payable function 
	  value: value
	};
	signAndSend(tx,privateKey)
}

function signAndSend(tx,privateKey, callback){
	var sendCallBack = false;
	const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);
	signPromise.then((signedTx) => {
	  // raw transaction string may be available in .raw or 
	  // .rawTransaction depending on which signTransaction
	  // function was called
	  const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
	  sentTx.on("receipt", receipt => {
	    // do something when receipt comes back
	    console.log(receipt);
	    if (!sendCallBack) {
	    	sendCallBack = true;
	    	callback(true, receipt);
	    	return;
	    }
	  });
	  sentTx.on("error", err => {
	    // do something on transaction error
	    console.log(err)
    	if (!sendCallBack) {
	    	sendCallBack = true;
	    	callback(false, undefined);
	    	return;
	    }
	  });
	}).catch((err) => {
	  // do something when promise fails
	  console.log(err)
	  if (!sendCallBack) {
	  	sendCallBack = true;
	  	callback(false, undefined);
	  	return;
	  }
	});
}
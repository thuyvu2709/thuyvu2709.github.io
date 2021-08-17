$(document).ready(function() {
    
    var sender1 = "0xf4Aa5a106188E003CBDced3456769EA03cA45cBD";
    var pass1 = "0x1c6816fb9663bb1e4622b643cb49ebd19fdc497e8eedbe92a25c1c6850a4ff6f";

    var sender2 = "0x1ad62129d6f8850843fda0d4a4712dec2aa8492d";
    var pass2 = "0x0c1d2435ce5af77e6f4c8260084f46a23bdc745a886e38d5f63ee3afad6eed22";

    // var sender3 = "0xacbf9eba9e03dc417e19c6a26cde0fd8515f5011";
    // var pass3 = "0xb84e5832949298d21b187d8d1e2fae95958019250a10d0727a98e2e9828819ca";

    var sender = sender1;
    var pass = pass1;

    var contractAddress = "0x93B749909f1ED6eD7DFF9d69Afa112659DC0C5f8";
	
	// const myContract = new web3.eth.Contract(contractAbi,contractAddress);

	// var Web3 = require('web3');

	// web3 = new Web3();

	// web3.setProvider(new web3.providers.HttpProvider('http://127.0.0.1:8545'));
	// web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"));

    const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
    const BN = web3.utils.BN;

    // const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
    // const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

    const account = web3.eth.accounts.privateKeyToAccount(pass)

	console.log(account);
	console.log(web3)

	// sendETH(sender1,sender2,21000,100,pass1)

	var data = {
		BUSD: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
		WBNB: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", //wbnb
		factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",  //PancakeSwap V2 factory
		router: "0x10ED43C718714eb63d5aA57B78B54704E256024E", //PancakeSwap V2 router
		privateKey: pass,
		Slippage : 1, //in Percentage
		gasPrice : 5, //in gwei
		gasLimit : 21000, //at least 21000
		routerABI: [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}],
		factoryABI: [{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[],"name":"INIT_CODE_PAIR_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}],
		ERCABI:   [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]
	}

	routerContract = new web3.eth.Contract(data.routerABI,data.router);
	factoryContract = new web3.eth.Contract(data.factoryABI,data.factory);
	wbnbContract = new web3.eth.Contract(data.ERCABI,data.WBNB);

	function checkLiq(tokenIn, tokenOut) {
		factoryContract.methods.getPair(tokenIn, tokenOut).call({from: account.address}, function(error, result){
			console.log(result);
			pairAddressx = result; 
			if (pairAddressx == null || pairAddressx == undefined) {
				console.log("No pair address")
				return;
		    }
		    wbnbContract.methods.balanceOf(pairAddressx).call({from: account.address}, function(error, result){
		    	var liquityWBNB = result;
		    	console.log(result)
		    	console.log(web3.utils.fromWei(liquityWBNB,'ether'))

		    })
		});
	}

	// checkLiq('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82','0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')

	// function calculateCurrentPrice(amountIn, tokenIn, tokenOut, slippage) {
	// 	// var amountInToWei = web3.utils.toWei(amountIn)
	// 	var fakeAddr = "0xf4Aa5a106188E003CBDced3456769EA03cA45cBD"
	// 	tokenInContract = new web3.eth.Contract(data.ERCABI,tokenIn);
	// 	tokenInContract.methods.decimals().call({from: fakeAddr}, function(error, result){

	// 		var amountInFull = (amountIn * ( 10 ** result )).toString()
	// 		console.log(amountInFull)

	// 		routerContract.methods.getAmountsOut(amountInFull, [tokenIn, tokenOut]).call({from: fakeAddr}, function(error, result){
	// 			console.log(error)
	// 			console.log(result)
	// 			var amounts = result;
	// 	        // var amountOutMin = amounts[1].sub(amounts[1] (data.Slippage));
	// 	        // console.log(amountOutMin)
	// 	        // tokenOutDecimal = 18;
	//             // var amountOutMinParam = ethers.utils.parseUnits(web3.utils.fromWei(amountOutMin.toString()), 18);
	//             tokenOutContract = new web3.eth.Contract(data.ERCABI,tokenOut);
	//             // console.log(tokenOutContract);
	//             // console.log(bvalue.sub(bvalue.mul((1/100))))

	//             tokenOutContract.methods.decimals().call({from: fakeAddr}, function(error, result){
	// 				var decimal = result;
	// 				// console.log(decimal)
	// 				// var vDecimal = new BN(10).pow(new BN(decimal)); 
	// 				// console.log(vDecimal);
	// 	            var amountOutMin = new BN(amounts[1]);
	// 	            amountOutMin = amountOutMin.sub(amountOutMin.mul(new BN(slippage)).div(new BN(100)))
	// 	            // console.log(amountOutMin.toString())
	// 	            amountOutMin = (amountOutMin / (10 ** decimal)).toFixed(5)
	// 	            // amountOutMin = ethers.utils.parseUnits(amountOutMin, decimal)
	// 	            // console.log(ethers)
	// 	            console.log(amountIn+" "+amountOutMin);
	//             })
	// 		});
	// 	})
	// }

	// calculateCurrentPrice('1','0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c','0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',1);


	function calculateCurrentPriceInBUSD(amountIn, tokenIn, slippage,callback) {
		// var amountInToWei = web3.utils.toWei(amountIn)
		var fakeAddr = "0xA781f67c8097394449217246FA3fF3303d91F018"
		tokenInContract = new web3.eth.Contract(data.ERCABI,tokenIn);
		tokenInContract.methods.decimals().call({from: fakeAddr}, function(error, result){
			var decimalTokenIn = result;
			var amountInFull = (amountIn * ( 10 ** result )).toLocaleString('fullwide', { useGrouping: false })
			// console.log(amountIn)
			if (amountIn == 0) {
				callback("0","0",new BN("0"),new BN("0"));
				return;
			}
			// console.log(result)
			// console.log(amountInFull)
			// var pathExchange = [tokenIn, tokenOut];
			
			routerContract.methods.getAmountsOut(amountInFull, [tokenIn, data.WBNB, data.BUSD]).call({from: fakeAddr}, function(error, result){
				// console.log(error)
				// console.log(result)
				var amounts = result;
		        // var amountOutMin = amounts[1].sub(amounts[1] (data.Slippage));
		        // console.log(amountOutMin)
		        // tokenOutDecimal = 18;
	            // var amountOutMinParam = ethers.utils.parseUnits(web3.utils.fromWei(amountOutMin.toString()), 18);
	            tokenOutContract = new web3.eth.Contract(data.ERCABI,data.BUSD);
	            // console.log(tokenOutContract);
	            // console.log(bvalue.sub(bvalue.mul((1/100))))

	            tokenOutContract.methods.decimals().call({from: fakeAddr}, function(error, result){
					// var decimal = result;
					var decimalTokenOut = result;

					// console.log(decimal)
					// var vDecimal = new BN(10).pow(new BN(decimal)); 
					// console.log(vDecimal);
		            var amountOutMin = new BN(amounts[2]);
		            var amountOutFull = new BN(amounts[2]);

		            amountOutMin = amountOutMin.sub(amountOutMin.mul(new BN(slippage)).div(new BN(100)))
		            // console.log(amountOutMin.toString())
		            amountOutMinFixed = (amountOutMin / (10 ** decimalTokenOut)).toFixed(5)
		            amountOutFullFixed = (amountOutFull / (10 ** decimalTokenOut)).toFixed(5)
		            // amountOutMin = ethers.utils.parseUnits(amountOutMin, decimal)
		            // console.log(ethers)
		            // console.log(amountIn+" "+amountOutFull+" "+amountOutMin);
		            // console.log(amountOutFullFixed+" "+amountOutMinFixed);
		            callback(amountOutFullFixed, amountOutMinFixed, amountOutFull, amountOutMin, amountInFull, decimalTokenIn, decimalTokenOut);
	            })
			});
		})
	}

	// calculateCurrentPriceInBUSD(1046530,'0xce4a4a15fccd532ead67be3ecf7e6122c61d06bb',40, 
	// 	function(amountOutFullFixed, amountOutMinFixed, amountOutFull, amountOutMin, amountInFull){
	// 	console.log("sell 1046530 thunder cake")
	// 	console.log(amountOutFullFixed);
	// 	console.log(amountOutFull.toString());
	// 	console.log(amountOutMin.toString());
	// 	var accAddr = "0xA781f67c8097394449217246FA3fF3303d91F018";
	// 	estimateTransactionFeeForSwap(accAddr, amountInFull, amountOutMin, "0xce4a4a15fccd532ead67be3ecf7e6122c61d06bb", data.BUSD,[]);
	// })

	// calculateSlippage(2, "0xce4a4a15fccd532ead67be3ecf7e6122c61d06bb",1,20, function(slippage, transactionFee){
	// 	console.log("calculateSlippage")
	// 	console.log(slippage)
	// 	console.log(transactionFee);
	// })

	function testSlip(){
		var amountIn = 0.015;
		// var tokenIn = "0x0b771e34526886d9fff8e764cf557d1cb5943c89";//WCOMP
		// var tokenIn = "0xce4a4a15fccd532ead67be3ecf7e6122c61d06bb";//THUNDERCAKE
		var tokenIn = "0xfa363022816abf82f18a9c2809dcd2bb393f6ac5";//Honey

		var slippage = 1;
		var accAddr = "0x7175dCBAe09E494A11f8EF52Ea6d7F55b4489bB7";

		calculateCurrentPriceInBUSD(amountIn,tokenIn,slippage, 
				function(amountOutFullFixed, amountOutMinFixed, amountOutFull, amountOutMin, amountInFull, decimalTokenIn, decimalTokenOut){

		            // var amountOutMin = amountOutFull.sub(amountOutFull.mul(new BN(slippage)).div(new BN(100)))

					// estimateTransactionFeeForSwap(accAddr, amountInFull, amountOutMin, tokenIn, data.BUSD,[], function(status, transactionFee){
					// 	console.log(status)
					// 	console.log(transactionFee);
					// 	if (status) {
					// 		callback(slippage, transactionFee)
					// 		return;
					// 	} else {
					// 		runEachSlippage(slippage + 1);
					// 	}
					// });

					calculateSlippage(accAddr, amountInFull, amountOutFull, tokenIn, data.BUSD,[],	1,20,function(suitableSlippage, transactionFee, amountOutMin){
						console.log(suitableSlippage);
						console.log(transactionFee);
						var amountOutMinFixed = (amountOutMin / (10 ** decimalTokenOut)).toFixed(5)
						console.log(amountOutMinFixed)
					})
				})
	}
	
	testSlip();

	function calculateSlippage(accAddr, amountInFull, amountOutFull, tokenIn, tokenOut, path, initSlip, maxSlippage, callback) {
		// var slippage = 1;
		if (initSlip >= maxSlippage) {
			callback(initSlip, 0, new BN("0"));
			return;
		}

		var runEachSlippage = function(slippage) {
			if (slippage >= maxSlippage) {
				callback(maxSlippage, 0, new BN("0"));
				return;
			}
	
	        var amountOutMin = amountOutFull.sub(amountOutFull.mul(new BN(slippage)).div(new BN(100)))
	        console.log("Check Slip: inFull:"+amountInFull.toString()+" outfull:"+amountOutFull.toString()+" "+slippage+" "+amountOutMin);
			// calculateCurrentPriceInBUSD(amountIn,tokenIn,slippage, 
			// 	function(amountOutFullFixed, amountOutMinFixed, amountOutFull, amountOutMin, amountInFull){
			// 		console.log(amountOutFullFixed);
			// 		console.log(amountOutFull.toString());
			// 		console.log(amountOutMin.toString());
			// 		var accAddr = "0xA781f67c8097394449217246FA3fF3303d91F018";
			estimateTransactionFeeForSwap(accAddr, amountInFull, amountOutMin, tokenIn, tokenOut,path, function(status, transactionFee){
				// console.log(status)
				// console.log(transactionFee);
				if (status) {
					callback(slippage, transactionFee, amountOutMin)
					return;
				} else {
					runEachSlippage(slippage + 1);
				}
			});
				// })
		}
		runEachSlippage(initSlip);
	}

	function getTokenRate(amountIn, tokenIn, decimalTokenIn, tokenOut, decimalTokenOut, callback) {
		// var amountInToWei = web3.utils.toWei(amountIn)
		var fakeAddr = "0xf4Aa5a106188E003CBDced3456769EA03cA45cBD"
		tokenInContract = new web3.eth.Contract(data.ERCABI,tokenIn);
		// tokenInContract.methods.decimals().call({from: fakeAddr}, function(error, result){
			// var amountIn = 1;

			var amountInFull = (amountIn * ( 10 ** decimalTokenIn )).toString()
			console.log(amountInFull)
			// var pathExchange = [tokenIn, tokenOut];

			routerContract.methods.getAmountsOut(amountInFull, [tokenIn, tokenOut]).call({from: fakeAddr}, function(error, result){
				// console.log(error)
				// console.log(result)
				var amounts = result;
		        // var amountOutMin = amounts[1].sub(amounts[1] (data.Slippage));
		        // console.log(amountOutMin)
		        // tokenOutDecimal = 18;
	            // var amountOutMinParam = ethers.utils.parseUnits(web3.utils.fromWei(amountOutMin.toString()), 18);
	            tokenOutContract = new web3.eth.Contract(data.ERCABI,tokenOut);
	            // console.log(tokenOutContract);
	            // console.log(bvalue.sub(bvalue.mul((1/100))))

	            // tokenOutContract.methods.decimals().call({from: fakeAddr}, function(error, result){
					// var decimal = result;
					// console.log(decimalTokenOut)
					// var vDecimal = new BN(10).pow(new BN(decimal)); 
					// console.log(vDecimal);
		            var amountOut = new BN(amounts[1]);

		            amountOutFull = (amountOut / (10 ** decimalTokenOut))

		            console.log("Rate:"+(amountOutFull))

		            callback(amountOutFull);
	            })
			// });
		// })
	}

	// function bnbToBUSD(amountBNB,callback) {
 // 		getTokenRate(data.WBNB, 18, data.BUSD, 18, function(amountOut){

 // 		})
	// }
	// getTokenRate(0.03, data.WBNB, 18, data.BUSD, 18,function(){

	// })

	function estimateTransactionFeeForSwap(accAddr, amountInFull,amountOutMin, tokenIn, tokenOut, path, callback) {
		// tokenInContract = new web3.eth.Contract(data.ERCABI,tokenIn);
		// tokenInContract.methods.decimals().call({from: fakeAddr}, function(error, result){

		// console.log(amountInFull)
        // var amountOutMin = amountOutFull.sub(amountOutFull.mul(new BN(slippage)).div(new BN(100)))
        // console.log("amountOutMin:"+amountOutMin.toString())
		if (path.length == 0) {
			path = [tokenIn, data.WBNB, data.BUSD]
		}

		// const path = [INPUT_TOKEN.address, OUTPUT_TOKEN.address]
		// const to = account.address;
		const deadline = Math.floor(Date.now() / 1000) + 60 * 20

        console.log("estimateTrx:"+amountInFull.toString()+" "+amountOutMin.toString()+" "+path+" "+accAddr+" "+deadline)
		// estimateTrx:
			// 15000000000000000 
			// 3381471008340863396 
			// 0xfa363022816abf82f18a9c2809dcd2bb393f6ac5,0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c,0xe9e7cea3dedca5984780bafc599bd69add087d56 
			// 0x7175dCBAe09E494A11f8EF52Ea6d7F55b4489bB7 
			// 1628518255

		web3.eth.estimateGas({
			from : accAddr,
			to : data.router,
			gas : 5,
			data: routerContract.methods.swapExactTokensForTokens(amountInFull.toString(),amountOutMin.toString(),path,accAddr,deadline).encodeABI() 
		}).then((gasLimit) => {
			// console.log(gasLimit)
			// console.log(gasLimit);
			var gasPrice = 5 / (10 ** 9)
			// console.log(gasPrice)
			var transactionFee = gasPrice  * gasLimit; // calculate the transaction fee
			// console.log(transactionFee);
			callback(true, transactionFee);
		}).catch(err => {
			console.log(err)
			callback(false, 0);
		}); // estimate the gas limit for this transaction
	}

	function swapToken(account, amountInFull,amountOutMin, tokenIn, tokenOut, path, slippage){
		tokenInContract = new web3.eth.Contract(data.ERCABI,tokenIn);
		tokenInContract.methods.decimals().call({from: fakeAddr}, function(error, result){

			console.log(amountInFull)


			// const path = [INPUT_TOKEN.address, OUTPUT_TOKEN.address]
			// const to = account.address;
			const deadline = Math.floor(Date.now() / 1000) + 60 * 20

	    	const tx = {
			  // this could be provider.addresses[0] if it exists
			  from: account.address, 
			  // target address, this could be a smart contract address
			  to: tokenOut, 
			  // optional if you want to specify the gas limit 
			  gas: 5, 
			  // optional if you are invoking say a payable function 
			  // value: value,
			  // this encodes the ABI of the method and the arguements
			  // data: myContract.methods.myMethod(arg, arg2).encodeABI() 
			  data: routerContract.methods.swapExactTokensForTokens(amountInFull,amountOutMin,path,account.address,deadline).encodeABI() 
			};
			
			signAndSend(tx,account.privateKey)
		})
	}

	function getTokenInfor(tokenIn, userAddr, callback){
		var fakeAddr = "0xf4Aa5a106188E003CBDced3456769EA03cA45cBD"
		tokenInContract = new web3.eth.Contract(data.ERCABI,tokenIn);
		tokenInContract.methods.decimals().call({from: fakeAddr}, function(error, result){
			var decimal = result;
			tokenInContract.methods.name().call({from: fakeAddr}, function(error, result){
				var name = result;
				// console.log("Name:"+name+" Decimals"+decimal)
				tokenInContract.methods.balanceOf(userAddr).call({from: fakeAddr}, function(error, result){
					// console.log(result)
					var bal = (result / (10 ** decimal)).toFixed(5)
					// console.log(bal)
					callback(name, decimal,bal);
				})
			})
		})
	}
	// getTokenInfor('0xe9e7cea3dedca5984780bafc599bd69add087d56','0xa781f67c8097394449217246fa3ff3303d91f018',function(name,decimal){

	// });

	function approveTrade(){

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

	function signAndSend(tx,privateKey){
		const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);
		signPromise.then((signedTx) => {
		  // raw transaction string may be available in .raw or 
		  // .rawTransaction depending on which signTransaction
		  // function was called
		  const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
		  sentTx.on("receipt", receipt => {
		    // do something when receipt comes back
		    console.log(receipt);
		  });
		  sentTx.on("error", err => {
		    // do something on transaction error
		    console.log(err)
		  });
		}).catch((err) => {
		  // do something when promise fails
		  console.log(err)
		});
	}
})
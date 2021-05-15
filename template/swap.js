const ethers = require(‘ethers’)
const {ChainId, Token, TokenAmount, Fetcher, Pair, Route, Trade, TradeType, Percent} = require('@pancakeswap-libs/sdk');
const Web3 = require(‘web3’);
const {JsonRpcProvider} = require("@ethersproject/providers");

require(“dotenv”).config()

const provider = new JsonRpcProvider('https://bsc-dataseed1.binance.org/');
const web3 = new Web3('wss://apis.ankr.com/wss/c40792ffe3514537be9fb4109b32d257/946dd909d324e5a6caa2b72ba75c5799/binance/full/main');

const { address: admin } = web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY)

console.log(Modulos cargados)

const PANCAKE_ROUTER_V2 = '0x10ed43c718714eb63d5aa57b78b54704e256024e';
const PANCAKE_ROUTER_V1 = '0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F';

//web3.toChecksumAddress(‘INSERT ADDRESS HERE’) Need this?

var SAFEMOON = '0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3';
var WBNB = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
var BUSD = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56';

const addresses = {
    INPUT_TOKEN: WBNB,
    OUTPUT_TOKEN: SAFEMOON,
    PANCAKE_ROUTER: PANCAKE_ROUTER_V2
}

// 1/1000 = 0.001
const ONE_ETH_IN_WEI = web3.utils.toBN(web3.utils.toWei('1'))//BN->(BIG NUMBER) || toWei → Converts any ether value value into wei.
const tradeAmount = ONE_ETH_IN_WEI.div(web3.utils.toBN('1000'))//tradeAmount = ONE_ETH_IN_WEI/1000

console.log(tradeAmount + tradeAmount );

const init = async () => {

const [INPUT_TOKEN, OUTPUT_TOKEN] = await Promise.all(
    [addresses.INPUT_TOKEN, addresses.OUTPUT_TOKEN].map(tokenAddress => (
        new Token(
            ChainId.MAINNET,
            tokenAddress,
            18
        )
    )));

console.log(` <<<<<------- pair-------->>>>>`)
const pair = await Fetcher.fetchPairData(INPUT_TOKEN, OUTPUT_TOKEN, provider)
//console.log(JSON.stringify(pair));
console.log(` <<<<<------- route-------->>>>>`)
const route = await new Route([pair], INPUT_TOKEN)
//console.log(JSON.stringify(route));
console.log(` <<<<<------- Trade-------->>>>>`)
const trade = await new Trade(route, new TokenAmount(INPUT_TOKEN, tradeAmount), TradeType.EXACT_INPUT)
//console.log(JSON.stringify(trade));


//https://uniswap.org/docs/v2/javascript-SDK/trading/
const slippageTolerance = new Percent('16', '100') // 
console.log("slippageTolerance: " + JSON.stringify(slippageTolerance));


// create transaction parameters
const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw
const path = [INPUT_TOKEN.address, OUTPUT_TOKEN.address]
const to = admin
const deadline = Math.floor(Date.now() / 1000) + 60 * 20

// Create signer
const wallet = new ethers.Wallet(
    Buffer.from(
    process.env.PRIVATE_KEY, 
    "hex"
    )
)
const signer = wallet.connect(provider)

// Create Pancakeswap ethers Contract
const pancakeswap = new ethers.Contract(
    addresses.PANCAKE_ROUTER,
    ['function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'],
    signer
)

//Allow input token
if(true)
{

    console.log(`Allow Pancakeswap <<<<<------- START-------->>>>>`)
    let abi = ["function approve(address _spender, uint256 _value) public returns (bool success)"]
    let contract = new ethers.Contract(INPUT_TOKEN.address, abi, signer)
    let aproveResponse = await contract.approve(addresses.PANCAKE_ROUTER, ethers.utils.parseUnits('1000.0', 18), {gasLimit: 100000, gasPrice: 5e9})
    console.log(JSON.stringify(aproveResponse))
    console.log(`Allow Pancakeswap <<<<<------- END-------->>>>>`)
    
}

if(true)
{   

    console.log(`Ejecutando transaccion`)       
    var amountInParam = ethers.utils.parseUnits('0.001', 18);
    var amountOutMinParam = ethers.utils.parseUnits(web3.utils.fromWei(amountOutMin.toString()), 18);
    
    console.log("amountInParam: " + amountInParam);
    console.log("amountOutMinParam: " + amountOutMinParam);
    console.log("amountOutMin: " + amountOutMin);

    
    
    
    const tx = await pancakeswap.swapExactTokensForTokens(
        amountInParam,
        amountOutMinParam,
        path,
        to,
        deadline,
        { gasLimit: ethers.utils.hexlify(300000), gasPrice: ethers.utils.parseUnits("9", "gwei") }
    )

    console.log(`Tx-hash: ${tx.hash}`)
        const receipt = await tx.wait();
        console.log(`Tx was mined in block: ${receipt.blockNumber}`)
}
}

init()
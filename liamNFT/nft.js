
const Web3 = require('web3');
const abi = require('./nftAbi.json');
let tokenHolders = require('./tokenholder');
require('dotenv').config()

var ObjectArray = require('object-array');
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded());
const cors = require('cors');
const corsOpts = {
    origin: '*',

    methods: [
        'GET',
        'POST',
    ],

    allowedHeaders: [
        'Content-Type',
    ],
};

app.use(cors(corsOpts));
var cron = require('cron');
const { promisify } = require('util')
const sleep = promisify(setTimeout)

var Tx = require("ethereumjs-tx");

const web3 = new Web3(process.env.rpcUrl);

var contractABI = abi;
var contractAddress = process.env.nftContractAddress;
arraofholder = tokenHolders.tokenHolder

function percentage(num, per) {
    return (num / 100) * per;
}

twopercent = Math.round(percentage(arraofholder.length, 2));
onepercent = Math.round(percentage(arraofholder.length, 1));
halfpercent = Math.round(percentage(arraofholder.length, 0.25));

let swapno = 112;
var counter = 0;
let fromSwapNo;
let toSwapNo;
let GreenTokenUri;
let BlueTokenUri;
let PurpleTokenUri;
let Milestone;
let status;


var a = ObjectArray();
temp = a;

var contract = new web3.eth.Contract(contractABI, contractAddress);

var myAddress = process.env.minterWalletAddress;
var minterPrivateKey = process.env.minterPrivateKey
var privateKey = Buffer.from(String( minterPrivateKey ), 'hex')

const chainId = process.env.ChainID;

const send = async (artwork, arr, tokenType) => {


    var count;

    count = await web3.eth.getTransactionCount(myAddress);


    const cdata = contract.methods.TokenDis(artwork, arr, tokenType);
    const gas = await cdata.estimateGas({ from: myAddress });
    const gasPrice = await web3.eth.getGasPrice();

    var rawTransaction =
    {
        from: myAddress,
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gas + 10000),
        to: contractAddress,
        value: "0x0",
        data: cdata.encodeABI(),
        nonce: web3.utils.toHex(count),
        chainId: web3.utils.toHex(chainId)
    };

    console.log(rawTransaction);
    //creating tranaction via ethereumjs-tx
    var transaction = new Tx(rawTransaction);
    //signing transaction with private key
    transaction.sign(privateKey);
    //sending transacton via web3 module
    web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
        .on("transactionHash", async (txHash, err) => {
            if (!err) {
                console.log(txHash);
                // return txHash
                // res.status(200).json({ message: "Transaction placed", data: txHash });
            } else {
                console.log(err);
                //  res.status(400).json({ error: err });
            }
        })

}

const doSomething = async (g_uri, b_uri, p_uri, Milestone) => {
    //await sleep(2000)
    for (let i = 0; i < 3; i++) {
        if (i === 0) {
            let twopercentArray = [];
            let tokenType = Milestone + " :common"
            for (let j = 0; j < twopercent; j++) {

                min = Math.ceil(0);
                max = Math.floor(arraofholder.length);
                randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
                twopercentArray.push(arraofholder[randomNum])
            }

            console.log()
            console.log("======Txn for 2 %")
            console.log()
            send(g_uri, twopercentArray, tokenType)
            await sleep(6000)
        }
        else if (i === 1) {
            await sleep(8000)
            let onepercentArray = [];
            let tokenType = Milestone + " :rare"
            for (let j = 0; j < onepercent; j++) {

                min = Math.ceil(0);
                max = Math.floor(arraofholder.length);
                randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
                onepercentArray.push(arraofholder[randomNum])

            }
            console.log()
            console.log("======Txn for 1 %")
            console.log()
            send(b_uri, onepercentArray, tokenType)
        }
        else if (i === 2) {
            await sleep(8000)
            let halfpercentArray = [];
            let tokenType = Milestone + " :legendary"
            for (let j = 0; j < halfpercent; j++) {

                min = Math.ceil(0);
                max = Math.floor(arraofholder.length);
                randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
                halfpercentArray.push(arraofholder[randomNum])
            }
            console.log()
            console.log("======Txn for 0.25 %")
            console.log()
            send(p_uri, halfpercentArray, tokenType)
        }
    }

}


app.post('/addMileStone', function (req, res) {

    try {

        var from = req.body.from;
        var to = req.body.to;
        var greenTokenUri = req.body.greenTokenUri;
        var blueTokenUri = req.body.blueTokenUri;
        var purpleTokenUri = req.body.purpleTokenUri;
        var status = "false";
        var Milestone = req.body.milestone;
        a.push({
            from: from,
            to: to,
            greenTokenUri: greenTokenUri,
            blueTokenUri: blueTokenUri,
            purpleTokenUri: purpleTokenUri,
            status: status,
            Milestone: Milestone
        });
        res.status(200).json(a);

    } catch (error) {
        res.send({ responseCode: 404, responseMessage: "error in catch" })
    }

})

app.get('/getAllMilestone', function (req, res) {
    //res.status(200).json( temp );
    let tempArr = Object.values(a)

    let arr2 = []
    try {
        if (tempArr.length > 0) {
            for (let i = 0; i < tempArr.length; i++) {
                let obj = {}
                obj["mileStone"] = tempArr[i].to
                obj["reached"] = tempArr[i].status
                obj["set"] = i
                obj["assets"] = {
                    "assetsOne": {
                        type: "Common"
                    },
                    "assetsTwo": {
                        type: "Rare"
                    },
                    "assetsThree": {
                        type: "Legendary"
                    }
                };
                arr2.push(obj)

            }
            res.status(200).json({ Result: arr2 })
        } else {
            res.send({ responseCode: 500, responseMessage: "Blank Milestone" })
        }

    } catch (error) {
        res.send({ responseCode: 404, responseMessage: "error in catch" })
    }


})

app.get('/getMilestoneIDforSelection', async function (req, res) {
    try {
        const tempLen1 = Object.values(a)
        tempLen = tempLen1.length
        if (tempLen === 0) {

            res.send({ responseCode: 500, responseMessage: "Blank Milestone" })
        }
        else {

            res.status(200).json(temp);
        }
    } catch (error) {
        return res.send({ responseCode: 404, responseMessage: "error in catch" })

    }

})


app.get('/selectmilestone/:id', async function (req, res) {

    let id;
    let l = (Object.keys(a).length)
    let mileStonearr = [];

    try {
        const FORloop = async () => {


            id = req.params.id;
            mileStonearr.push(a[id])
            fromSwapNo = mileStonearr[0].from
            toSwapNo = mileStonearr[0].to
            GreenTokenUri = mileStonearr[0].greenTokenUri
            BlueTokenUri = mileStonearr[0].blueTokenUri
            PurpleTokenUri = mileStonearr[0].purpleTokenUri
            Milestone = mileStonearr[0].Milestone
            status = "true"
        }
        await FORloop();

        // console.log(temp)
        for (let i = 0; i < l; i++) {

            if (a[id] === a[id]) {
              //  console.log(a[id])
                a[id].status = "true"
                break
            }
            else {

            }
        }


        res.status(200).json({ fromSwapNo, toSwapNo, GreenTokenUri, BlueTokenUri, PurpleTokenUri, Milestone, status });

    } catch (error) {

        return res.send({ responseCode: 404, responseMessage: "error in catch" })

    }


})



app.get('/NextMilestone', function (req, res) {
    try {
        let NextMilestoneTemp = Object.values(a)
        if (NextMilestoneTemp.length > 0) {
            for (let i = 0; i < NextMilestoneTemp.length; i++) {
                if (NextMilestoneTemp[i].status === "false") {
                    NextMilestone = (NextMilestoneTemp[i].to);

                    break

                } else {
                    res.send({ responseCode: 500, responseMessage: "Not enough Milestone" })
                }
            }
            res.status(200).json({ NextMilestone });
        }
        else {

            res.send({ responseCode: 500, responseMessage: "Blank Milestone" })
        }



    } catch (error) {

        return res.send({ responseCode: 404, responseMessage: "error in catch" })
    }


})

app.get('/RemoveMilestone', function (req, res) {
    try {
        temp = Object.values(a);
        console.log(temp.length)
        if (temp.length > 0) {
            a.pop();
            res.status(200).json({ "Milestones": a });
        } else {
            res.send({ responseCode: 500, responseMessage: "Blank Milestone" })
        }

    } catch (error) {
        return res.send({ responseCode: 404, responseMessage: "error in catch" })
    }


})

app.get('/NFTartworks', async function (req, res) {
    try {
        finalblock = await web3.eth.getBlockNumber();
        const results = await contract.getPastEvents('TokenType', {

            fromBlock: 0,
            toBlock: finalblock


        });

        const results1 = await contract.getPastEvents('MintedTime', {

            fromBlock: 0,
            toBlock: finalblock

        });

        const results2 = await contract.getPastEvents('Transfer', {


            fromBlock: 0,
            toBlock: finalblock

        });



        let All_NFT_Artworks = [];

        obj = {}
        for (let i = 0; i < results.length; i++) {
            let nfttokenobj = {};
            nfttokenobj["TokenID"] = (results[i].returnValues.tokenId)
            nfttokenobj["TokenType"] = (results[i].returnValues.Type)
            nfttokenobj["TimeStamp"] = (results1[i].returnValues.timeStamp)
            nfttokenobj["NFTtokenAddress"] = (results1[i].address)
            nfttokenobj["TokenAddress"] = (results2[i].returnValues.to)

            All_NFT_Artworks.push(nfttokenobj);


        }

        // console.log(All_NFT_Artworks)
        res.status(200).json(All_NFT_Artworks)
        res.end();



    } catch (error) {
        return res.send({ responseCode: 404, responseMessage: "error in catch" })

    }


})


app.get('/getSwapnNoforToken', async function (req, res) {
    const Web3 = require('web3');
    const Abi = require('./LMabi.json');
    var ContractAddress = process.env.liquidityAddress;

    const web3 = new Web3(process.env.rpcUrl_2);

    var Contract = new web3.eth.Contract(Abi, ContractAddress);

    const initialblock = 7640157;
    const finalblock = await web3.eth.getBlockNumber();
   // const finalblock = 7640158;
    const loop = (Number(finalblock) - Number(initialblock)) / 1000;



    var i;
    var lastcount;
    try {

        for (i = 0; i < loop; i++) {



            if (i == 0) {

                let fromblock = initialblock;

                let toblock = fromblock + 1000;

                const results = await Contract.getPastEvents('Swap', {
                    fromBlock: fromblock,
                    toBlock: toblock,
                });

                lastcount = toblock;

                counter = counter + Number(results.length);
                console.log("fromBlock", fromblock);
                console.log("toblock", toblock);
                console.log("Swap", results.length);

                console.log("-------------------------------");


            }

            else {
                let fromblock = lastcount + 1;

                let toblock = fromblock + 1000;

                const results = await Contract.getPastEvents('Swap', {
                    fromBlock: fromblock,
                    toBlock: toblock,
                });

                lastcount = toblock;
                counter = counter + Number(results.length);
                console.log("fromBlock", fromblock);
                console.log("toblock", toblock);
                console.log("Swap", results.length);

                console.log("-------------------------------");

            }

        }

        console.log("TotalSwap", counter);
     //   counter = req.body.counter;
     
        swapno = counter;
        res.status(200).json({ swaps:counter })
        res.end()

    } catch (error) {

        return res.send({ responseCode: 404, responseMessage: "error in catch" })
    }



})


app.post('/sendTransaction', function (req, res) {
    try {
        var job = new cron.CronJob('*/1 * * * *', function () {
            if (fromSwapNo === undefined && toSwapNo === undefined && GreenTokenUri === undefined && BlueTokenUri === undefined && PurpleTokenUri === undefined && Milestone === undefined) {
                res.send({ responseCode: 500, responseMessage: "Frist select milestone!!!" })

            }
            else if (swapno > fromSwapNo && swapno < toSwapNo) {

                doSomething(GreenTokenUri, BlueTokenUri, PurpleTokenUri, Milestone);
            }
            else {

               // res.send({ responseCode: 500, responseMessage: "May be selected milstone is end or wrong selection!!!" })
                console.log("{ responseMessage: May be selected milstone is end or wrong selection!!! }")
            }

        }, null, true);
        job.start();

    } catch (error) {

        return res.send({ responseCode: 404, responseMessage: "error in catch" })
    }


})

app.listen(process.env.PORT, () => console.log('listening on port 9000!'))








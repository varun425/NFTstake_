###### Kitty token
Filename = kittyToken.sol
Steps:

0) copy-paste dev-wallet address in smart contract (devWallet = "0x00..") ,this is the address where the fee of 0.5% fee gets distributed to a developer wallet for future development operations.

1) Deploy HokkaiduInu-Kittytoken.sol on network 

2) Add HOKK token in wallet

3) send token 100 hokk token to some other address

4) 0.5 hokk will reflect to devWallet

###### NFTtoken
Solidity Filename = nft.sol
Steps:

0) Deploy NFTToken-nft.sol , set nfttoken name and symbol 

1) Copy-paste nft contract-address in .env file  

2) Copy-paste NFTToken-nft.sol abi in nftAbi.json file 

###### API

0) addMilestone -(To add x number of milestone)

api input 

{
    "from": 0,
    "to": 100,
    "greenTokenUri": "green.json",
    "blueTokenUri": "blue.json",
    "purpleTokenUri": "purple.json",
    "milestone":"CAT Sleeping "
}

api output

{
    "6d05246e16414a80b22e9919e732fe88": {
        "from": 0,
        "to": 100,
        "greenTokenUri": "green.json",
        "blueTokenUri": "blue.json",
        "purpleTokenUri": "purple.json",
        "status": "false",
        "Milestone": "CAT Sleeping "
    }
}

1) getAllMilestone - (To get status of milestones)

api output

{
    "Result": [
        {
            "mileStone": 100,
            "reached": "true",
            "set": 0,
            "assets": {
                "assetsOne": {
                    "type": "Common"
                },
                "assetsTwo": {
                    "type": "Rare"
                },
                "assetsThree": {
                    "type": "Legendary"
                }
            }
        }
    ]
}

2) getMilestoneIDforSelection - (To get id of each milestone so that selection of milestone can be done )

api output 

{
    "6d05246e16414a80b22e9919e732fe88": {
        "from": 0,
        "to": 100,
        "greenTokenUri": "green.json",
        "blueTokenUri": "blue.json",
        "purpleTokenUri": "purple.json",
        "status": "false",
        "Milestone": "CAT Sleeping "
    }
}

3) selectmilestone - (Select one milestone from number of x milestone  )

api output 

{
    "fromSwapNo": 0,
    "toSwapNo": 100,
    "GreenTokenUri": "green.json",
    "BlueTokenUri": "blue.json",
    "PurpleTokenUri": "purple.json",
    "Milestone": "CAT Sleeping ",
    "status": "true"
}

4) sendTransaction - (Send transaction and minting of token will start for selected milestone)

5) NFTartworks - (Fetch all released nft tokens)

api output 

[
    {
        "TokenType": "CAT Dancing :common",
        "TimeStamp": "1623398470",
        "NFTtokenAddress": "0xAb37F08DF4ea6fFd38f8136ba15C740d8b4E33A9",
        "TokenAddress": "0x3FcE4D58F162f824a883Bb6b2980C434bbb51F50"
    },
    {
        "TokenType": "CAT Dancing :common",
        "TimeStamp": "1623398470",
        "NFTtokenAddress": "0xAb37F08DF4ea6fFd38f8136ba15C740d8b4E33A9",
        "TokenAddress": "0x3Fe7BbC08fB5b76991F8966d755789a97ec6Db94"
    }
]

6) NextMilestone - (get next milestone)

api output 

{
    "NextMilestone": 10000
}

7) RemoveMilestone - (Remove last milestone)

8) getSwapnNoforToken - (Fetch no of swaps for kitty token happening on network)
 
api output 

{
    "swaps": 202
}


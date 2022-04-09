const express               = require("express");
const dbOperation           = require("./dbFiles/dbOperation");
const cors                  = require("cors");
const { ethers, network }   = require("hardhat");

const GGNFT                 = require('./src/artifacts/contracts/GGNFT.sol/GGNFT.json');




dbOperation.getTransferEventLog().then(response =>{
    console.log(response);
})

async function main() {


    let [owner, second] = await ethers.getSigners();
    console.log("GG NFT deployed to:", GGNFT.address);
    let myerc20 = await ethers.getContractAt("GGNFT",
        GGNFT.address,
        owner);

    let filter = myerc20.filters.Transfer()

    // let filter = myerc20.filters.Transfer(owner.address)
    // let filter = myerc20.filters.Transfer(null, owner.address)

    // logsFrom = await erc20.queryFilter(filter, -10, "latest");

    // filter = {
    //     address: ERC20Addr.address,
    //     topics: [
    //         ethers.utils.id("Transfer(address,address,uint256)")
    //     ]
    // }

    ethers.provider.on(filter, (event) => {

      console.log(event)

        // const decodedEvent = myerc20.interface.decodeEventLog(
        //     "Transfer", //
        //     event.data,
        //     event.topics
        // );
        // console.log(decodedEvent);
        dbOperation.addTransferEventLog(event);
        
    })
}

main()


// const app = express();
// const port = 8000;
// app.listen(port, () => {
//     console.log(`App server now listening to port ${port}`);
//   });
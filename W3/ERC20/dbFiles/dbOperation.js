const config                =require('./dbConfig'),
        sql                 =require('mssql');


const getTransferEventLog = async() =>{
    try{
        console.log(config);
        let pool = await sql.connect(config);
        let transferLogs = await pool.request().query("select * from TransferEventLog");
        console.log(transferLogs);
        return transferLogs;
    }
    catch(error){
        console.log(error);
    }
}

const addTransferEventLog = async(EventLog) =>{
    try{
        let pool = await sql.connect(config);
        let sqlInsert = `INSERT INTO [dbo].[TransferEventLog]
        ([tokenId]
        ,[address]
        ,[blockHash]
        ,[blockNumber]
        ,[data]
        ,[logIndex]
        ,[removed]
        ,[topics]
        ,[transactionHash]
        ,[transactionIndex])
        VALUES
           (${EventLog.tokenId}
           ,'${EventLog.address}'
           ,'${EventLog.blockHash}'
           ,${EventLog.blockNumber}
           ,'${EventLog.data}'
           ,${EventLog.logIndex}
           ,${EventLog.removed}
           ,'${EventLog.topics}'
           ,'${EventLog.transactionHash}'
           ,${EventLog.transactionIndex}`;

        console.log(sqlInsert);
        
        let transferLogs = await pool.request().query(sqlInsert);

        console.log(transferLogs);

        return transferLogs;
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    getTransferEventLog,
    addTransferEventLog
}
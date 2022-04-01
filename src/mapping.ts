import { near, log, BigInt, json, JSONValueKind } from "@graphprotocol/graph-ts"
import {  AfterWithdrawToken, BurnCoin, FtTransfer, FtTransferCall, OnMintTransfer, Poke, RegisterAccount } from "../generated/schema" // ensure to add any entities you define in schema.graphql

export function handleReceipt(receipt: near.ReceiptWithOutcome): void {
  const actions = receipt.receipt.actions;
  
  for (let i = 0; i < actions.length; i++) {
    handleAction(
      actions[i], 
      receipt.receipt, 
      receipt.block.header,
      receipt.outcome,
      receipt.receipt.signerPublicKey
      )
  }
}

function handleAction(
  action: near.ActionValue,
  receipt: near.ActionReceipt,
  blockHeader: near.BlockHeader,
  outcome: near.ExecutionOutcome,
  publicKey: near.PublicKey
): void {
  
  if (action.kind != near.ActionKind.FUNCTION_CALL) {
    log.info("Early return: {}", ["Not a function call"]);
    return;
  }
  
  const functionCall = action.toFunctionCall();

  // change the methodName here to the methodName emitting the log in the contract
  if (functionCall.methodName == "poke") {
    const receiptId = receipt.id.toBase58()

      // Maps the JSON formatted log to the LOG entity
      let pokes = new Poke(`${receiptId}`)

      // Standard receipt properties - likely do not need to change
      pokes.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      pokes.blockHeight = BigInt.fromU64(blockHeader.height)
      pokes.blockHash = blockHeader.hash.toBase58()
      pokes.predecessorId = receipt.predecessorId
      pokes.receiverId = receipt.receiverId
      pokes.signerId = receipt.signerId
      pokes.signerPublicKey = publicKey.bytes.toBase58()
      pokes.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      pokes.tokensBurned = outcome.tokensBurnt
      pokes.outcomeId = outcome.id.toBase58()
      pokes.executorId = outcome.executorId
      pokes.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs != null && outcome.logs.length > 0){
        
        let splitString = outcome.logs[0].split(' ')
        pokes.price = BigInt.fromString(splitString[3])
        pokes.accountId = splitString[0].toString()

        pokes.save()
      
      } 
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "after_withdraw_token") {
    const receiptId = receipt.id.toBase58()

      // Maps the JSON formatted log to the LOG entity
      let afterWithdraw = new AfterWithdrawToken(`${receiptId}`)

      // Standard receipt properties - likely do not need to change
      afterWithdraw.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      afterWithdraw.blockHeight = BigInt.fromU64(blockHeader.height)
      afterWithdraw.blockHash = blockHeader.hash.toBase58()
      afterWithdraw.predecessorId = receipt.predecessorId
      afterWithdraw.receiverId = receipt.receiverId
      afterWithdraw.signerId = receipt.signerId
      afterWithdraw.signerPublicKey = publicKey.bytes.toBase58()
      afterWithdraw.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      afterWithdraw.tokensBurned = outcome.tokensBurnt
      afterWithdraw.outcomeId = outcome.id.toBase58()
      afterWithdraw.executorId = outcome.executorId
      afterWithdraw.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs != null && outcome.logs.length > 0){
        let splitString2 = outcome.logs[0].split('"')
        let splitString = outcome.logs[0].split(' ')
        afterWithdraw.amountWithdrawn = BigInt.fromString(splitString[4])
        afterWithdraw.accountId = splitString2[1].toString()

        afterWithdraw.save()
      
      } 
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "ft_transfer") {
    const receiptId = receipt.id.toBase58()

      // Maps the JSON formatted log to the LOG entity
      let transfer = new FtTransfer(`${receiptId}`)

      // Standard receipt properties - likely do not need to change
      transfer.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      transfer.blockHeight = BigInt.fromU64(blockHeader.height)
      transfer.blockHash = blockHeader.hash.toBase58()
      transfer.predecessorId = receipt.predecessorId
      transfer.receiverId = receipt.receiverId
      transfer.signerId = receipt.signerId
      transfer.signerPublicKey = publicKey.bytes.toBase58()
      transfer.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      transfer.tokensBurned = outcome.tokensBurnt
      transfer.outcomeId = outcome.id.toBase58()
      transfer.executorId = outcome.executorId
      transfer.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs != null && outcome.logs.length > 0){
        
        let splitString = outcome.logs[0].split(' ')
        transfer.amount = BigInt.fromString(splitString[1])
        transfer.recieverId = splitString[5].toString()
        transfer.senderId = splitString[3].toString()

        transfer.save()
      
      } 
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "on_mint_transfer") {
    const receiptId = receipt.id.toBase58()

      // Maps the JSON formatted log to the LOG entity
      let mintTransfer = new OnMintTransfer(`${receiptId}`)

      // Standard receipt properties - likely do not need to change
      mintTransfer.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      mintTransfer.blockHeight = BigInt.fromU64(blockHeader.height)
      mintTransfer.blockHash = blockHeader.hash.toBase58()
      mintTransfer.predecessorId = receipt.predecessorId
      mintTransfer.receiverId = receipt.receiverId
      mintTransfer.signerId = receipt.signerId
      mintTransfer.signerPublicKey = publicKey.bytes.toBase58()
      mintTransfer.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      mintTransfer.tokensBurned = outcome.tokensBurnt
      mintTransfer.outcomeId = outcome.id.toBase58()
      mintTransfer.executorId = outcome.executorId
      mintTransfer.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs != null && outcome.logs.length > 0){
        let splitString = outcome.logs[0].split('"')
        let stringArray = outcome.logs[0].split(' ')
        let stringArray2 = stringArray[3].split("(").join(",").split(")").join(",").split(",") 
        mintTransfer.amountMinted = BigInt.fromString(stringArray2[1]) 
        mintTransfer.accountId = splitString[1].toString()
        

        mintTransfer.save()
      
      } 
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "ft_transfer_call") {
    const receiptId = receipt.id.toBase58()

      // Maps the JSON formatted log to the LOG entity
      let transferCall = new FtTransferCall(`${receiptId}`)

      // Standard receipt properties - likely do not need to change
      transferCall.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      transferCall.blockHeight = BigInt.fromU64(blockHeader.height)
      transferCall.blockHash = blockHeader.hash.toBase58()
      transferCall.predecessorId = receipt.predecessorId
      transferCall.receiverId = receipt.receiverId
      transferCall.signerId = receipt.signerId
      transferCall.signerPublicKey = publicKey.bytes.toBase58()
      transferCall.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      transferCall.tokensBurned = outcome.tokensBurnt
      transferCall.outcomeId = outcome.id.toBase58()
      transferCall.executorId = outcome.executorId
      transferCall.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs != null && outcome.logs.length > 0){
        let splitString = outcome.logs[0].split(' ')
        transferCall.amountTransfered = BigInt.fromString(splitString[1]) 
        transferCall.transferedFrom = splitString[3].toString()
        transferCall.transferedTo = splitString[5].toString()
        

        transferCall.save()
      
      } 
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "burn_coin") {
    const receiptId = receipt.id.toBase58()

      // Maps the JSON formatted log to the LOG entity
      let burn = new BurnCoin(`${receiptId}`)

      // Standard receipt properties - likely do not need to change
      burn.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      burn.blockHeight = BigInt.fromU64(blockHeader.height)
      burn.blockHash = blockHeader.hash.toBase58()
      burn.predecessorId = receipt.predecessorId
      burn.receiverId = receipt.receiverId
      burn.signerId = receipt.signerId
      burn.signerPublicKey = publicKey.bytes.toBase58()
      burn.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      burn.tokensBurned = outcome.tokensBurnt
      burn.outcomeId = outcome.id.toBase58()
      burn.executorId = outcome.executorId
      burn.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs != null && outcome.logs.length > 0){
        let splitString = outcome.logs[0].split(' ')
        let splitString1 = outcome.logs[1].split(',').join(' ').split('"').join('').split(' ')
        let splitString2 = outcome.logs[2].split(',').join(' ').split(' ')
        let splitString3 = outcome.logs[3].split(',').join(' ').split(' ')

        if(splitString3[0] == "Transfer") {  // https://explorer.near.org/transactions/8aLAhpxTTxtQazD2ut2zv5cFkf8y8pVCAcxPmZ6mSFcS#FnmmZQsLCWFoL6eNRS7bksSrwohieka4yjZ2U4Szdxp3
          burn.currentTime = BigInt.fromString(splitString[3])
          burn.sysTime = BigInt.fromString(splitString1[6])
          burn.totalCoin = BigInt.fromString(splitString1[8]) 
          burn.totalUnpaidStableFee = BigInt.fromString(splitString1[14]) 
          burn.systemIndex =  BigInt.fromString(splitString1[11])
          burn.index = BigInt.fromString(splitString2[8])
          burn.userUnpaidStableFee= BigInt.fromString(splitString2[5])
          burn.amountTransfered= BigInt.fromString(splitString3[1])
          burn.transferedTo = splitString3[5].toString()
          burn.transferedFrom = splitString3[3].toString()
          
          burn.save()
        } 
        else if (splitString3[0] == "Current"){  //https://explorer.near.org/transactions/9CFmEY5GNyd33hc9B2YRMgKj3qMvhUqrkfV1D8JNqh8a#FBJq4SbGhKa18MbiiHBm4uXmWj4CNFPhfQLRTf84F8c3
          burn.currentTime = BigInt.fromString(splitString[3])
          burn.reward = BigInt.fromString(splitString1[8])
          burn.index = BigInt.fromString(splitString1[11])
          burn.sysTime = BigInt.fromString(splitString2[6])
          burn.totalCoin = BigInt.fromString(splitString1[8]) 
          burn.totalUnpaidStableFee = BigInt.fromString(splitString2[14]) 
          burn.systemIndex =  BigInt.fromString(splitString2[11])
          burn.userUnpaidStableFee= BigInt.fromString(splitString3[5])
          
          burn.save()
        
        }
        else if (outcome.logs.length == 6){  //going to need to add a if(outcome.logs.length > 3) https://explorer.near.org/transactions/7qMwmwhDXNhyZTRBCADCYNwZuxrAA6XfbikAfJSBtknC#2SboVMJ6JVFfmUrN8aPiNYUAdo1iN29ivTdykmma1bnB
          let splitString4 = outcome.logs[4].split(',').join(' ').split(' ') 
          //let splitString5 = outcome.logs[5].split(',').join(' ').split(' ') causing issues posssibly is only an array of 4?
          //burn.currentTime = BigInt.fromString(splitString[3])
          //burn.token = splitString1[10].toString()
          log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
        }

        else if (outcome.logs.length == 5){  //5  https://explorer.near.org/transactions/B1SRemCgyjhx3CTTaX49MPjK5Exiuzoa4Zq7ckHaWoTE#4tQhMwRLHDjvqzdurkCp9jaFsLAVvVJRUhhdcVK6ByBa
          let splitString4 = outcome.logs[4].split(',').join(' ').split(' ')
          log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
        }

        else if (outcome.logs.length == 3){ //https://explorer.near.org/transactions/B73rG2NTjVpUKZhMoBWfSDzmTeLpQhLP3Hj5wnYZEkzN#Am2jvifibB9NZcypZ3FWycU4J2fGa8GDVgCzHqw2XkkZ

        }
      } 
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "register_account") {
    const receiptId = receipt.id.toBase58()

      // Maps the JSON formatted log to the LOG entity
      let register = new RegisterAccount(`${receiptId}`)

      // Standard receipt properties - likely do not need to change
      register.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      register.blockHeight = BigInt.fromU64(blockHeader.height)
      register.blockHash = blockHeader.hash.toBase58()
      register.predecessorId = receipt.predecessorId
      register.receiverId = receipt.receiverId
      register.signerId = receipt.signerId
      register.signerPublicKey = publicKey.bytes.toBase58()
      register.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      register.tokensBurned = outcome.tokensBurnt
      register.outcomeId = outcome.id.toBase58()
      register.executorId = outcome.executorId
      register.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs != null && outcome.logs.length > 0){
        
        let splitString = outcome.logs[0].split('：')
        register.gas = BigInt.fromString(splitString[1])


        register.save()
      
      } 
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

}

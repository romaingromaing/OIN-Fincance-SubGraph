import { near, log, BigInt, json, JSONValueKind } from "@graphprotocol/graph-ts"
import {  AfterWithdrawToken, BurnCoin, ClaimReward, FtTransfer, FtTransferCall, MintCoin, OnClaimDisReward, OnClaimMinReward, OnMintTransfer, Poke, RegisterAccount, WithdrawToken } from "../generated/schema" // ensure to add any entities you define in schema.graphql

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
        
        
        if(outcome.logs.length == 4){
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
        }

        else if (outcome.logs.length == 3 ){ // https://explorer.near.org/transactions/B73rG2NTjVpUKZhMoBWfSDzmTeLpQhLP3Hj5wnYZEkzN#Am2jvifibB9NZcypZ3FWycU4J2fGa8GDVgCzHqw2XkkZ
          burn.currentTime = BigInt.fromString(splitString[3])
          burn.sysTime = BigInt.fromString(splitString1[6])
          burn.totalCoin = BigInt.fromString(splitString1[8])
          burn.systemIndex = BigInt.fromString(splitString1[11])
          burn.totalUnpaidStableFee = BigInt.fromString(splitString1[14])
          burn.userUnpaidStableFee = BigInt.fromString(splitString2[5])
          burn.index= BigInt.fromString(splitString2[8])
        
          burn.save()
        } 


        else if (outcome.logs.length == 5) {
          let splitString3 = outcome.logs[3].split(',').join(' ').split(' ')
          let splitString4 = outcome.logs[4].split(',').join(' ').split(' ')

          if (splitString4[0] == "Current"){  // https://explorer.near.org/transactions/B1SRemCgyjhx3CTTaX49MPjK5Exiuzoa4Zq7ckHaWoTE#4tQhMwRLHDjvqzdurkCp9jaFsLAVvVJRUhhdcVK6ByBa
            burn.currentTime = BigInt.fromString(splitString[3])
            burn.token = splitString1[9].toString()
            burn.totalReward = BigInt.fromString(splitString1[12])
            burn.rewardSpeed = BigInt.fromString(splitString1[15])
            burn.index = BigInt.fromString(splitString1[18])
            burn.doubleScale = BigInt.fromString(splitString1[21])
            burn.reward =BigInt.fromString(splitString2[8])
            burn.sysTime = BigInt.fromString(splitString3[6])
            burn.totalCoin = BigInt.fromString(splitString3[8])
            burn. systemIndex = BigInt.fromString(splitString3[11])
            burn.totalUnpaidStableFee = BigInt.fromString(splitString3[14])
            burn.userUnpaidStableFee = BigInt.fromString(splitString4[5]) 
          
            burn.save() //this one works and is finsihed
        }
          else if(splitString4[0] == "Transfer") {   //https://explorer.near.org/transactions/GeJx3iMn4yeDRXEVMUM1m6vFWkgo3qYnGbgAP2vWX7ZE#EPhtWu6SF23k6mY8vgsktGgEp8v7mABa5FgNZf716deo
            burn.currentTime = BigInt.fromString(splitString[3])
            burn.reward = BigInt.fromString(splitString1[8])
            burn.index = BigInt.fromString(splitString1[11])
            burn.sysTime = BigInt.fromString(splitString2[6])
            burn.totalCoin = BigInt.fromString(splitString2[8])
            burn.systemIndex = BigInt.fromString(splitString2[11])
            burn.totalUnpaidStableFee = BigInt.fromString(splitString2[14])
            burn.userUnpaidStableFee= BigInt.fromString(splitString3[5])
            burn.transferedFrom = splitString4[3].toString()
            burn.transferedTo = splitString4[5].toString()
            burn.amountTransfered = BigInt.fromString(splitString4[1]) 

            burn.save()
        }
      }

      else if (outcome.logs.length == 6){  //going to need to add a if(outcome.logs.length > 3) https://explorer.near.org/transactions/7qMwmwhDXNhyZTRBCADCYNwZuxrAA6XfbikAfJSBtknC#2SboVMJ6JVFfmUrN8aPiNYUAdo1iN29ivTdykmma1bnB
        let splitString3 = outcome.logs[3].split(',').join(' ').split(' ')
        let splitString4 = outcome.logs[4].split(',').join(' ').split(' ') 
        let splitString5 = outcome.logs[5].split(',').join(' ').split(' ')

        burn.currentTime = BigInt.fromString(splitString[3])
        burn.token = splitString1[9].toString()
        burn.totalReward = BigInt.fromString(splitString1[12])
        burn.rewardSpeed = BigInt.fromString(splitString1[15])
        burn.index = BigInt.fromString(splitString1[18])
        burn.doubleScale = BigInt.fromString(splitString1[21])
        burn.reward =BigInt.fromString(splitString2[8])
        burn.sysTime = BigInt.fromString(splitString3[6])
        burn.totalCoin = BigInt.fromString(splitString3[8])
        burn. systemIndex = BigInt.fromString(splitString3[11])
        burn.totalUnpaidStableFee = BigInt.fromString(splitString3[14])
        burn.userUnpaidStableFee = BigInt.fromString(splitString4[5]) 
        burn.transferedFrom = splitString5[3].toString()
        burn.transferedTo = splitString5[5].toString()
        burn.amountTransfered = BigInt.fromString(splitString5[1]) 
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

  if (functionCall.methodName == "mint_coin") {
    const receiptId = receipt.id.toBase58()

      // Maps the JSON formatted log to the LOG entity
      let mint = new MintCoin(`${receiptId}`)

      // Standard receipt properties - likely do not need to change
      mint.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      mint.blockHeight = BigInt.fromU64(blockHeader.height)
      mint.blockHash = blockHeader.hash.toBase58()
      mint.predecessorId = receipt.predecessorId
      mint.receiverId = receipt.receiverId
      mint.signerId = receipt.signerId
      mint.signerPublicKey = publicKey.bytes.toBase58()
      mint.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      mint.tokensBurned = outcome.tokensBurnt
      mint.outcomeId = outcome.id.toBase58()
      mint.executorId = outcome.executorId
      mint.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs != null && outcome.logs.length > 0){
        let splitString = outcome.logs[0].split(' ')
        let splitString2 = outcome.logs[2].split(',').join(' ').split(' ')
        
        
        if (outcome.logs.length == 4) {
          let splitString1 = outcome.logs[1].split(',').join(' ').split(' ')

          mint.currentTime = BigInt.fromString(splitString[3])
          mint.currentSysTime = BigInt.fromString(splitString1[6])
          mint.totalCoin = BigInt.fromString(splitString1[8])
          mint.systemIndex = BigInt.fromString(splitString1[11])
          mint.totalUnpaidStableFee = BigInt.fromString(splitString1[14])
          mint.userUnpaidStableFee = BigInt.fromString(splitString2[5])
          mint.index = BigInt.fromString(splitString2[8])

          mint.save()
        }

        else if (outcome.logs.length == 6) { //longer log output variation
          let splitString1 = outcome.logs[1].split(',').join(' ').split('"').join('').split(' ')
          let splitString3 = outcome.logs[3].split(',').join(' ').split(' ')
          let splitString4 = outcome.logs[4].split(',').join(' ').split(' ')
          let splitString5 = outcome.logs[5].split(',').join(' ').split(' ')

          mint.currentTime = BigInt.fromString(splitString[3])
          mint.token = splitString1[9].toString()
          mint.totalReward = BigInt.fromString(splitString1[12])
          mint.rewardSpeed = BigInt.fromString(splitString1[15])
          mint.rewardIndex = BigInt.fromString(splitString1[18])
          mint.doubleScale = BigInt.fromString(splitString1[21])
          mint.userReward = BigInt.fromString(splitString2[8])
          mint.currentSysTime = BigInt.fromString(splitString3[6])
          mint.totalCoin = BigInt.fromString(splitString3[8])
          mint.systemIndex = BigInt.fromString(splitString3[11])
          mint.totalUnpaidStableFee = BigInt.fromString(splitString3[14])
          mint.userUnpaidStableFee = BigInt.fromString(splitString4[5])
          mint.index = BigInt.fromString(splitString4[8])

          mint.save()
        }

      } 
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "withdraw_token") {
    const receiptId = receipt.id.toBase58()

      // Maps the JSON formatted log to the LOG entity
      let withdraw = new WithdrawToken(`${receiptId}`)

      // Standard receipt properties - likely do not need to change
      withdraw.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      withdraw.blockHeight = BigInt.fromU64(blockHeader.height)
      withdraw.blockHash = blockHeader.hash.toBase58()
      withdraw.predecessorId = receipt.predecessorId
      withdraw.receiverId = receipt.receiverId
      withdraw.signerId = receipt.signerId
      withdraw.signerPublicKey = publicKey.bytes.toBase58()
      withdraw.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      withdraw.tokensBurned = outcome.tokensBurnt
      withdraw.outcomeId = outcome.id.toBase58()
      withdraw.executorId = outcome.executorId
      withdraw.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs != null && outcome.logs.length > 0){
        
        let splitString = outcome.logs[0].split(':').join('').split(' ')
        let splitString1 = outcome.logs[1].split(' ')
        let splitString2 = outcome.logs[2].split(',').join(' ').split('"').join('').split(' ')
        let splitString3 = outcome.logs[3].split(',').join(' ').split(' ')

        if(outcome.logs.length <= 5){ 
          if(splitString3[0] == 'Current'){ // 2 versions https://explorer.near.org/transactions/4QpsnoXWFwdz5FddLQeWDmoxeQvuPY9RzKEyxVDivASp  https://explorer.near.org/transactions/d53Kb9uwkoeKD9ULXQN4aMpeoQNbfrE94BULNwircCr
          
            withdraw.token = BigInt.fromString(splitString[1])
            withdraw.amount = BigInt.fromString(splitString[3])
            withdraw.currentTime = BigInt.fromString(splitString1[3])
            withdraw.currentSysTime = BigInt.fromString(splitString2[6])
            withdraw.totalCoin = BigInt.fromString(splitString2[8])
            withdraw.systemIndex= BigInt.fromString(splitString2[11])
            withdraw.totalUnpaidStableFee = BigInt.fromString(splitString2[14])
            withdraw.userUnpaidStableFee = BigInt.fromString(splitString3[5])
            withdraw.index = BigInt.fromString(splitString3[8])

            withdraw.save()
          }
          else{  //https://explorer.near.org/transactions/Er2qQAK5jEDxx7iTczpn9Wq6NqFzZqXaLB98LQFeZuLk#E4WAECaMGmAtVkx9p93KxtA83EJD4qHepYRd5x43J4qu
            let splitString4 = outcome.logs[4].split(',').join(' ').split(' ')
            withdraw.token = BigInt.fromString(splitString[1])
            withdraw.amount = BigInt.fromString(splitString[3])
            withdraw.currentTime = BigInt.fromString(splitString1[3])
            withdraw.userReward = BigInt.fromString(splitString2[8])
            withdraw.rewardIndex = BigInt.fromString(splitString2[11])
            withdraw.currentSysTime = BigInt.fromString(splitString3[6])
            withdraw.totalCoin = BigInt.fromString(splitString3[8])
            withdraw.systemIndex= BigInt.fromString(splitString3[11])
            withdraw.totalUnpaidStableFee = BigInt.fromString(splitString3[14])
            withdraw.userUnpaidStableFee = BigInt.fromString(splitString4[5])
            withdraw.index = BigInt.fromString(splitString4[8])


            withdraw.save()
          }
        }
        else if (outcome.logs.length == 7){  //https://explorer.near.org/transactions/9d61j3T7RqFg9hFifVSfTfi14jLtyv5AAems9HwmKdqF#3GqdJybZpywcSV7fkcf8Cy2F8gyFyX4GA95ntkEwKfdJ
          let splitString4 = outcome.logs[4].split(',').join(' ').split(' ')
          let splitString5 = outcome.logs[5].split(',').join(' ').split(' ')
          
          withdraw.token = BigInt.fromString(splitString[1])
          withdraw.amount = BigInt.fromString(splitString[3])
          withdraw.currentTime = BigInt.fromString(splitString1[3])
          withdraw.tokenReward = splitString2[9].toString()
          withdraw.totalReward = BigInt.fromString(splitString2[12])
          withdraw.rewardSpeed = BigInt.fromString(splitString2[15])
          withdraw.rewardIndex = BigInt.fromString(splitString2[18])
          withdraw.doubleScale = BigInt.fromString(splitString2[21])
          withdraw.userReward = BigInt.fromString(splitString3[8])
          withdraw.currentSysTime = BigInt.fromString(splitString4[6])
          withdraw.totalCoin = BigInt.fromString(splitString4[8])
          withdraw.systemIndex= BigInt.fromString(splitString4[11])
          withdraw.totalUnpaidStableFee = BigInt.fromString(splitString4[14])
          withdraw.userUnpaidStableFee = BigInt.fromString(splitString5[5])
          withdraw.index = BigInt.fromString(splitString5[8])

          withdraw.save()
        }
      } 

  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "claim_reward") {
    const receiptId = receipt.id.toBase58()

      // Maps the JSON formatted log to the LOG entity
      let claim = new ClaimReward(`${receiptId}`)

      // Standard receipt properties - likely do not need to change
      claim.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      claim.blockHeight = BigInt.fromU64(blockHeader.height)
      claim.blockHash = blockHeader.hash.toBase58()
      claim.predecessorId = receipt.predecessorId
      claim.receiverId = receipt.receiverId
      claim.signerId = receipt.signerId
      claim.signerPublicKey = publicKey.bytes.toBase58()
      claim.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      claim.tokensBurned = outcome.tokensBurnt
      claim.outcomeId = outcome.id.toBase58()
      claim.executorId = outcome.executorId
      claim.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs != null && outcome.logs.length > 0){
        let splitString = outcome.logs[0].split(' ')
        
        if(outcome.logs.length == 2){ // https://explorer.near.org/transactions/FMhiLEDLwiihPMb6DvfraC8dHiznjgRgrev3iWHLNwX5
          let splitString1 = outcome.logs[1].split(' ')
          
          claim.currentTime = BigInt.fromString(splitString[3])
          claim.accountId = splitString1[0].toString()
          claim.tokenClaimed = splitString1[2].toString()
          claim.rewardClaimed = BigInt.fromString(splitString1[4])
          

          claim.save()
        }
       
        else if (outcome.logs.length == 3){ //https://explorer.near.org/transactions/8cvvqNQGN7hm6prFfC9ekztRBNQRX1pC385V1zgPf9fo
          let splitString1 = outcome.logs[1].split(',').join('').split(' ')
          let splitString2 = outcome.logs[2].split(' ')
          
          claim.currentTime = BigInt.fromString(splitString[3])
          claim.index = BigInt.fromString(splitString1[10])
          claim.accountId = splitString2[0].toString()
          claim.tokenClaimed = splitString2[2].toString()
          claim.rewardClaimed = BigInt.fromString(splitString2[4])

          claim.save()
        }
      } 

  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "on_claim_min_reward") {
    const receiptId = receipt.id.toBase58()

      // Maps the JSON formatted log to the LOG entity
      let claim = new OnClaimMinReward(`${receiptId}`)

      // Standard receipt properties - likely do not need to change
      claim.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      claim.blockHeight = BigInt.fromU64(blockHeader.height)
      claim.blockHash = blockHeader.hash.toBase58()
      claim.predecessorId = receipt.predecessorId
      claim.receiverId = receipt.receiverId
      claim.signerId = receipt.signerId
      claim.signerPublicKey = publicKey.bytes.toBase58()
      claim.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      claim.tokensBurned = outcome.tokensBurnt
      claim.outcomeId = outcome.id.toBase58()
      claim.executorId = outcome.executorId
      claim.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs != null && outcome.logs.length > 0){ //https://explorer.near.org/transactions/31T3Y912cC6DuwwFgxo9fjXqHngXZ7Qpgds3qWT1SsxM
        let splitString = outcome.logs[0].split(' ')
        let splitString1 = outcome.logs[1].split('"').join('').split('(').join(' ').split(')').join('').split(' ')

        claim.accountId = splitString1[0].toString()
        claim.tokenToClaim = BigInt.fromString(splitString1[3])
    
        claim.save()
      } 

  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "on_claim_dis_reward") {
    const receiptId = receipt.id.toBase58()

      // Maps the JSON formatted log to the LOG entity
      let claim = new OnClaimDisReward(`${receiptId}`)

      // Standard receipt properties - likely do not need to change
      claim.blockTime = BigInt.fromU64(blockHeader.timestampNanosec/1000000)
      claim.blockHeight = BigInt.fromU64(blockHeader.height)
      claim.blockHash = blockHeader.hash.toBase58()
      claim.predecessorId = receipt.predecessorId
      claim.receiverId = receipt.receiverId
      claim.signerId = receipt.signerId
      claim.signerPublicKey = publicKey.bytes.toBase58()
      claim.gasBurned = BigInt.fromU64(outcome.gasBurnt)
      claim.tokensBurned = outcome.tokensBurnt
      claim.outcomeId = outcome.id.toBase58()
      claim.executorId = outcome.executorId
      claim.outcomeBlockHash = outcome.blockHash.toBase58()

      // Log parsing
      if(outcome.logs != null && outcome.logs.length > 0){ //https://explorer.near.org/transactions/31T3Y912cC6DuwwFgxo9fjXqHngXZ7Qpgds3qWT1SsxM
        let splitString = outcome.logs[0].split(',').join(' ').split('"').join('').split('(').join(' ').split(')').join('').split(' ')

        claim.accountId = splitString[3].toString()
        claim.depositorNearGain = BigInt.fromString(splitString[6])
    
        claim.save()
      } 

  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

}

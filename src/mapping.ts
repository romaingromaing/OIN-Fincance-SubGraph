import { near, log, BigInt, json, JSONValueKind } from "@graphprotocol/graph-ts"
import {  AfterWithdrawToken, BurnCoin, FtTransfer, OnMintTransfer, Poke } from "../generated/schema" // ensure to add any entities you define in schema.graphql

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
        pokes.log = outcome.logs[0]
        
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
        afterWithdraw.log = outcome.logs[0]
        
        let splitString = outcome.logs[0].split(' ')
        afterWithdraw.amountWithdrawn = BigInt.fromString(splitString[4])
        afterWithdraw.accountId = splitString[0].toString()

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
        transfer.log = outcome.logs[0]
        
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
        mintTransfer.log = outcome.logs[0]
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

}

import { near, log, BigInt, json, JSONValueKind } from "@graphprotocol/graph-ts"
import {  Poke } from "../generated/schema" // ensure to add any entities you define in schema.graphql

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


}

import { BigInt, BigDecimal } from "@graphprotocol/graph-ts"
import {
  Contract,
  BidAccepted,
  BidderRefunded,
  RoundFinalised
} from "../generated/Contract/Contract"
import { Bid } from "../generated/schema"

let ONE_ETH = new BigDecimal(BigInt.fromI32(1).times(BigInt.fromI32(10).pow(18)))

export function handleBidAccepted(event: BidAccepted): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = new Bid(event.transaction.from.toHex().toString() + event.params._timeStamp.toString())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  // if (entity == null) {
  //   entity = new Bid(event.transaction.from.toHex())
  // }

  // Entity fields can be set based on event parameters
  entity._round = event.params._round
  entity._timeStamp = event.params._timeStamp
  entity._param = event.params._param
  entity._amount = event.params._amount
  entity._ethAmount = new BigDecimal(event.params._amount) / ONE_ETH
  entity._bidder = event.params._bidder

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.accessControls(...)
  // - contract.artistFundSplitter(...)
  // - contract.auctionStartTime(...)
  // - contract.currentRound(...)
  // - contract.highestBidFromRound(...)
  // - contract.highestBidderFromRound(...)
  // - contract.minBid(...)
  // - contract.numOfRounds(...)
  // - contract.roundLengthInSeconds(...)
  // - contract.secondsInADay(...)
  // - contract.twistedTokenCreator(...)
  // - contract.winningRoundParameter(...)
}

export function handleBidderRefunded(event: BidderRefunded): void {}

export function handleRoundFinalised(event: RoundFinalised): void {}

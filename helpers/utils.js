const ethers = require("ethers")
const { tokenInfo } = require('../config/config')
// ethers.BigNumber({ ROUNDING_MODE: ethers.BigNumber.leng }) 

const moment = require('moment')

// define functions and constants
const CONSTANT_1K = 1000
const CONSTANT_10K = 10 * CONSTANT_1K
const CONSTANT_100K = 10 * CONSTANT_10K
const CONSTANT_1M = 10 * CONSTANT_100K
const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const UNISWAP_FACTORY = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
const UNISWAP_INIT_CODEHASH = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'

bn = function(number, defaultValue = null) { if (number == null) { if (defaultValue == null) { return null } number = defaultValue } return ethers.BigNumber.from(number) }

tokens = function (amount) { return (bn(amount).mul(bn(10).pow(tokenInfo.decimals))).toString() }
tokensBN = function (amount) { return (bn(amount).mul(bn(10).pow(tokenInfo.decimals))) }
bnToInt = function (bnAmount) { return bnAmount.div(bn(10).pow(tokenInfo.decimals)) }

dateToEpoch = function (dated) { return moment(dated, "DD/MM/YYYY HH:mm").valueOf() / 1000 }
timeInSecs = function (days, hours, mins, secs) { return days * hours * mins * secs }
timeInDays = function (secs) { return (secs / (60 * 60 * 24)).toFixed(2) }
timeInDate = function (secs) { return moment(secs * 1000).format("DD MMM YYYY hh:mm a") }

vestedAmount = function (total, now, start, cliffDuration, duration) { return now < start + cliffDuration ? ethers.BigNumber.from(0) : total.mul(now - start).div(duration) }
returnWeight = function (sourceWeight, destBal, destWeight, amount, block, op) {
  // console.log({sourceWeight, destBal, destWeight, amount})
  if (bn(destBal).eq(bn("0"))) return bn(0)
  const dstWeight = bn(destWeight).mul(bn(destBal))
  const srcWeight = bn(sourceWeight).mul(bn(amount))

  const totalWeight = dstWeight.add(srcWeight)
  const totalAmount = bn(destBal).add(amount)

  const totalAmountBy2 = totalAmount.div(bn(2))
  const roundUpWeight = totalWeight.add(totalAmountBy2)
  let holderWeight = roundUpWeight.div(totalAmount)
  if (op == "transfer") {
    return { holderWeight, totalAmount };
  } else {
    holderWeight = block
    return { holderWeight, totalAmount };
  }
}

module.exports = {
  CONSTANT_1K,
  CONSTANT_10K,
  CONSTANT_100K,
  CONSTANT_1M,
  WETH,
  UNISWAP_FACTORY,
  UNISWAP_INIT_CODEHASH,
  bn,
  tokens,
  tokensBN,
  bnToInt,
  dateToEpoch,
  timeInSecs,
  timeInDays,
  timeInDate,
  vestedAmount,
  returnWeight,
}

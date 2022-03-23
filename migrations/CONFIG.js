const anchor = require('@project-serum/anchor');
const { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const { web3, BN } = anchor
const { PublicKey, SystemProgram, Keypair, Transaction } = web3
const _ = require('lodash')
const preflightCommitment = 'recent';
const connection = new anchor.web3.Connection(process.env.SOL_URL, preflightCommitment);
const wallet = anchor.Wallet.local()

const provider = new anchor.Provider(connection, wallet, {
  preflightCommitment,
  commitment: 'recent',
});

anchor.setProvider(provider);

const nowUix = _.round(Date.now() / 1000)
const IDO_DECIMALS = 3
const TRADE_DECIMALS = 6

// IDO decimals 3: HPj2tDRKNQN6ZRHAX99dVkaJUhtWvmjE4PnMPsUVYTxH
// IDO decimals 9: 21sXd6E1shHL1meTE6drNQi8aAeJ95sQuLZzUXrzdn7o
// USDC decimals 6: 4WFDSbUJJBYbLkh5UCx6gj48vrPUavhRSYGBUCMWrNmt
// USDC decimals 9: FkhzENMDtKeDQJt49HoYnhS2zvRF1yEcvfgWcRQuiijJ
const DEV_POOL_CONFIG = {
  POOL_ID: new PublicKey("Bt1JML2xXCYMvD48SfJ3ZqTmxjzzWL78t1NsBv7xhER8"),
  PROGRAM_ID: new PublicKey('6WjS3dLCwMSXD3sJME3C7i3snxEnqD9U7bbkNeYXFQz7'),
  AMOUNT_CONFIG_ID: new PublicKey('7sVpbGWCXwSjaW1yMT4xAta4Wz5s7rHjmrTUCvCohxqg'),
  IDO_TOKEN_ID: new PublicKey('HPj2tDRKNQN6ZRHAX99dVkaJUhtWvmjE4PnMPsUVYTxH'),
  IDO_DECIMALS,
  TRADE_TOKEN_ID: new PublicKey('4WFDSbUJJBYbLkh5UCx6gj48vrPUavhRSYGBUCMWrNmt'),
  TRADE_DECIMALS,
  IDO_AMOUNT: getIdoAmount(100_000),
  START_TIME: new BN(nowUix + 60 * 5),
  END_TIME: new BN(nowUix + 60 * 60 * 24),
  TRADE_VALUE: getNumber(0.1),
  TAX_SELLER: new BN(5),
  TAX_USER: new BN(5),
  SELLER: new PublicKey('HV4DykGhCeXiffo3Co1W8pvst2ePks8Ph8fbvhjpVnpi'),
  HAS_WHITELIST: true,
  VESTING_SCHEDULES: [
    { id: 0, date: new BN(nowUix), percentage: getNumber(50) },
    { id: 1, date: new BN(nowUix + 60), percentage: getNumber(50) },
  ],
  POOL_TIER_CONFIG: [
    { id: 0, tokensForSale: getIdoAmount( 0), allocatedToken: getNumber(0) },
    { id: 1, tokensForSale: getIdoAmount( 5_000), allocatedToken: getNumber(0) },
    { id: 2, tokensForSale: getIdoAmount(15_000), allocatedToken: getNumber(0) },
    { id: 3, tokensForSale: getIdoAmount(30_000), allocatedToken: getNumber(0) },
    { id: 4, tokensForSale: getIdoAmount(50_000), allocatedToken: getNumber(0) }
  ],
  AMOUNT_COST_TIER_CONFIG: [ // this is GLOBAL
    { id: 0, costAmount: getTradeAmount(0), requiredAmount: getNumber(0) },
    { id: 1, costAmount: getTradeAmount(10), requiredAmount: getNumber(1_000) },
    { id: 2, costAmount: getTradeAmount(100), requiredAmount: getNumber(10_000) },
    { id: 3, costAmount: getTradeAmount(500), requiredAmount: getNumber(50_000) },
    { id: 4, costAmount: getTradeAmount(1000), requiredAmount: getNumber(100_000) }
  ]
}

// IDO decimals 3: GJxLat6TH3g12Wxo6ocTnrN2SgxUp3eiD3APbprsguww
// IDO decimals 9: DrtJdBAohBfNcZrwUdxCFqKLLKUTjejkZFdvmyRxAZey
// USDC decimals 6: CFNTawJnmFPvTJX4UY98qFaSg16iQam8uq8EJRB3AT5H
// USDC decimals 9: 23jC8Tr1EdNPh24cNBZBhRvUyvYrpRLnSgwDo1W5tgGH
// const TEST_POOL_CONFIG = {
//   POOL_ID: new PublicKey("7sUYx5RqCuv649AZB63k7gLHt6AvtedRXvVUk5fawRmv"),
//   PROGRAM_ID: new PublicKey('6WjS3dLCwMSXD3sJME3C7i3snxEnqD9U7bbkNeYXFQz7'),
//   AMOUNT_CONFIG_ID: new PublicKey('12QCEuDPeEZeGTMcH6yQRfu8GnerWDCJT8K9tqiccw28'),
//   IDO_TOKEN_ID: new PublicKey('GJxLat6TH3g12Wxo6ocTnrN2SgxUp3eiD3APbprsguww'),
//   IDO_DECIMALS,
//   TRADE_TOKEN_ID: new PublicKey('CFNTawJnmFPvTJX4UY98qFaSg16iQam8uq8EJRB3AT5H'),
//   TRADE_DECIMALS,
//   IDO_AMOUNT: getIdoAmount(10000),
//   START_TIME: new BN(nowUix + 60 * 5),
//   END_TIME: new BN(nowUix + 60 * 60 * 24),
//   TRADE_VALUE: getNumber(0.1),
//   TAX_SELLER: new BN(5),
//   TAX_USER: new BN(5),
//   SELLER: new PublicKey('HV4DykGhCeXiffo3Co1W8pvst2ePks8Ph8fbvhjpVnpi'),
//   HAS_WHITELIST: true,
//   VESTING_SCHEDULES: [
//     { id: 0, date: new BN(nowUix + 120), percentage: getNumber(50) },
//     { id: 1, date: new BN(nowUix + 300), percentage: getNumber(50) },
//   ]
// }

// IDO TESTTTT 9: GWw447sTHYaQXGsLrb7HANASBJzQyYJXRa44T5MciX42
// USDC decimals 6: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
// const MAIN_POOL_CONFIG = {
//   POOL_ID: new PublicKey("7xnEw2iV8J1fJeDTVeq5GFmJ12cqPZ7P3aDz1yN5rCi1"),
//   PROGRAM_ID: new PublicKey('6WjS3dLCwMSXD3sJME3C7i3snxEnqD9U7bbkNeYXFQz7'),
//   AMOUNT_CONFIG_ID: new PublicKey('GXXjoBbzWjcMXNjmBEcbvtSpD8VNeXR7u6psyuYPd96R'),
//   IDO_TOKEN_ID: new PublicKey('GWw447sTHYaQXGsLrb7HANASBJzQyYJXRa44T5MciX42'),
//   IDO_DECIMALS,
//   TRADE_TOKEN_ID: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
//   TRADE_DECIMALS,
//   IDO_AMOUNT: getIdoAmount(10000),
//   START_TIME: new BN(nowUix + 60 * 5),
//   END_TIME: new BN(nowUix + 60 * 60 * 6),
//   TRADE_VALUE: getNumber(0.1),
//   TAX_SELLER: new BN(5),
//   TAX_USER: new BN(5),
//   SELLER: new PublicKey('4SDHENPHwYK6wj4PtBzvwZKMJ983Q1gmNC9SowsvbxNp'),
//   HAS_WHITELIST: true,
//   VESTING_SCHEDULES: [
//     { id: 0, date: new BN(nowUix + 60 * 60 * 24 * 4), percentage: getNumber(50) },
//     { id: 1, date: new BN(nowUix + 60 * 60 * 24 * 5), percentage: getNumber(50) },
//   ]
// }

const POOL_CONFIG = DEV_POOL_CONFIG

const program = new anchor.Program(idl, POOL_CONFIG.PROGRAM_ID);
const idoToken = new Token(connection, POOL_CONFIG.IDO_TOKEN_ID, TOKEN_PROGRAM_ID, wallet.payer)
const tradeToken = new Token(connection, POOL_CONFIG.TRADE_TOKEN_ID, TOKEN_PROGRAM_ID, wallet.payer)

const ENV_CONFIG = {
  provider, connection, wallet, program, idoToken, tradeToken,
  TOKEN_PROGRAM_ID: TOKEN_PROGRAM_ID,
  RENT_PROGRAM_ID: anchor.web3.SYSVAR_RENT_PUBKEY,
  CLOCK_PROGRAM_ID: anchor.web3.SYSVAR_CLOCK_PUBKEY,
  SYSTEM_PROGRAM_ID: SystemProgram.programId,
}

function getIdoAmount (amount) {
  return new BN(amount * 10 ** IDO_DECIMALS)
}
function getTradeAmount (amount) {
  return new BN(amount * 10 ** TRADE_DECIMALS)
}
function getNumber (num) {
  return new BN(num * 10 ** 9)
}
async function getPoolSign () {
  const [_poolSigner,] = await anchor.web3.PublicKey.findProgramAddress(
    [POOL_CONFIG.POOL_ID.toBuffer()],
    program.programId
  );
  return _poolSigner
}
async function getPoolAcount() {
  return await program.account.poolAccount.fetch(POOL_CONFIG.POOL_ID)
}
async function getAssociatedTokenAddress(mintAddress, owner) {
  return await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mintAddress, owner, true)
}
async function validateTokens() {
  const idoMintInfo = await idoToken.getMintInfo()
  const tradeMintInfo = await tradeToken.getMintInfo()
  if (idoMintInfo.decimals !== POOL_CONFIG.IDO_DECIMALS) {
    throw new Error('IDO decimals not match')
  }
  if (tradeMintInfo.decimals !== POOL_CONFIG.TRADE_DECIMALS) {
    throw new Error('TRADE decimals not match')
  }
}

const utils = {
  getIdoAmount, getTradeAmount, getNumber, getPoolSign, getPoolAcount, getAssociatedTokenAddress, validateTokens
}

module.exports = {
  POOL_CONFIG,
  ENV_CONFIG,
  utils,
}
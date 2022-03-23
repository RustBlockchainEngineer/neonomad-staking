const anchor = require('@project-serum/anchor');
const idl = require('../target/idl/cropper_staking.json')
const { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const { web3, BN } = anchor
const { PublicKey, SystemProgram, Keypair, Transaction } = web3
const _ = require('lodash')
const preflightCommitment = 'recent';
const connection = new anchor.web3.Connection(process.env.SOL_URL, preflightCommitment);
const wallet = anchor.Wallet.local()
const utf8 = anchor.utils.bytes.utf8;

const provider = new anchor.Provider(connection, wallet, {
  preflightCommitment,
  commitment: 'recent',
});

anchor.setProvider(provider);

const DEV_POOL_CONFIG = {
  PROGRAM_ID: new PublicKey('2PB1GQHQTQtj6WgPTjNnmVc6r8WP9EUQw4SoniABCp1v'),
  REWARD_TOKEN_ID: new PublicKey('21sXd6E1shHL1meTE6drNQi8aAeJ95sQuLZzUXrzdn7o'),
  POOL_POINT: new BN('1000'),
  POOL_AMOUNT_MULTIPLIER: new BN('1'),
  FARM_RATE: getNumber(0.095), // 3_000_000 token per years
  REWARD_CONFIGS: [
    { duration: new BN(1 * 30 * 24 * 60 * 60), extraPercentage: getNumber(0) },
    { duration: new BN(3 * 30 * 24 * 60 * 60), extraPercentage: getNumber(10) },
    { duration: new BN(6 * 30 * 24 * 60 * 60), extraPercentage: getNumber(30) },
    { duration: new BN(365 * 24 * 60 * 60), extraPercentage: getNumber(100) },
    // { duration: new BN(0), extraPercentage: getNumber(0) },
    // { duration: new BN(60), extraPercentage: getNumber(25) },
    // { duration: new BN(120), extraPercentage: getNumber(50) },
    // { duration: new BN(180), extraPercentage: getNumber(100) },
  ]
}

const MAIN_POOL_CONFIG = {
  PROGRAM_ID: new PublicKey('2PB1GQHQTQtj6WgPTjNnmVc6r8WP9EUQw4SoniABCp1v'),
  REWARD_TOKEN_ID: new PublicKey('5tN42n9vMi6ubp67Uy4NnmM5DMZYN8aS8GeB3bEDHr6E'),
  POOL_POINT: new BN('1000'),
  POOL_AMOUNT_MULTIPLIER: new BN('1'),
  FARM_RATE: getNumber(0.01), // 3_000_000 token per years
  REWARD_CONFIGS: [
    { duration: new BN(1 * 30 * 24 * 60 * 60), extraPercentage: getNumber(0) },
    { duration: new BN(3 * 30 * 24 * 60 * 60), extraPercentage: getNumber(10) },
    { duration: new BN(6 * 30 * 24 * 60 * 60), extraPercentage: getNumber(30) },
    { duration: new BN(365 * 24 * 60 * 60), extraPercentage: getNumber(100) },
    // { duration: new BN(0), extraPercentage: getNumber(0) },
    // { duration: new BN(60), extraPercentage: getNumber(25) },
    // { duration: new BN(120), extraPercentage: getNumber(50) },
    // { duration: new BN(180), extraPercentage: getNumber(100) },
  ]
}

const FARM_CONFIG = MAIN_POOL_CONFIG

const program = new anchor.Program(idl, FARM_CONFIG.PROGRAM_ID);
const rewardToken = new Token(connection, FARM_CONFIG.REWARD_TOKEN_ID, TOKEN_PROGRAM_ID, wallet.payer)

const ENV_CONFIG = {
  provider, connection, wallet, program, rewardToken,
  TOKEN_PROGRAM_ID: TOKEN_PROGRAM_ID,
  RENT_PROGRAM_ID: anchor.web3.SYSVAR_RENT_PUBKEY,
  CLOCK_PROGRAM_ID: anchor.web3.SYSVAR_CLOCK_PUBKEY,
  SYSTEM_PROGRAM_ID: SystemProgram.programId,
}

function getNumber (num) {
  return new BN(num * 10 ** 9)
}
async function getStateAccount() {
  const stateSigner = await getStateSigner()
  const {rewardVault, startTime, tokenPerSecond} = await program.account.stateAccount.fetch(stateSigner)
  return {publicKey: stateSigner, rewardVault, startTime, tokenPerSecond}
}
async function getStateSigner () {
  const [_poolSigner,] = await anchor.web3.PublicKey.findProgramAddress(
    [utf8.encode('state')],
    program.programId
  );
  return _poolSigner
}
async function getPoolSigner () {
  const [_poolSigner,] = await anchor.web3.PublicKey.findProgramAddress(
    [FARM_CONFIG.REWARD_TOKEN_ID.toBuffer()],
    program.programId
  );
  return _poolSigner
}
async function getRewardConfigSigner () {
  const [_poolSigner,] = await anchor.web3.PublicKey.findProgramAddress(
    [utf8.encode('extra')],
    program.programId
  );
  return _poolSigner
}
async function getAssociatedTokenAddress (mintAddress, owner) {
  return await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mintAddress, owner, true)
}

const utils = {
  getNumber, getStateSigner, getPoolSigner, getAssociatedTokenAddress, getStateAccount, getRewardConfigSigner
}

module.exports = {
  FARM_CONFIG,
  ENV_CONFIG,
  utils,
}
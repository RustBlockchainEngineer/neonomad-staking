// client.js is used to introduce the reader to generating clients from IDLs.
// It is not expected users directly test with this example. For a more
// ergonomic example, see `tests/basic-0.js` in this workspace.

const anchor = require('@project-serum/anchor');
const { BN, web3, Program, ProgramError, Provider } = anchor
const { PublicKey, SystemProgram, Keypair, Transaction } = web3
const { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const utf8 = anchor.utils.bytes.utf8;
const { ENV_CONFIG, utils, STAKING_CONFIG } = require('./CONFIG')
const { program, provider } = ENV_CONFIG

async function main () {
  let pools = await program.account.farmPoolAccount.all()
  await program.rpc.changeTokensPerSecond(STAKING_CONFIG.STAKING_RATE, {
    accounts: {
      state: await utils.getStateSigner(),
      authority: provider.wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      systemProgram: SystemProgram.programId,
    },
    remainingAccounts: pools.map(p => ({
      pubkey: p.publicKey,
      isWritable: true,
      isSigner: false
    }))
  })
  let poolInfo = await program.account.farmPoolAccount.fetch(await utils.getPoolSigner())
  let stateInfo = await program.account.stateAccount.fetch(await utils.getStateSigner())
  console.log({stateInfo, poolInfo})
}

console.log('Running client.');
main().then(() => console.log('Success')).catch(e => console.error(e));

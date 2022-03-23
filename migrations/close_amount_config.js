// client.js is used to introduce the reader to generating clients from IDLs.
// It is not expected users directly test with this example. For a more
// ergonomic example, see `tests/basic-0.js` in this workspace.

const anchor = require('@project-serum/anchor');

const { ENV_CONFIG, POOL_CONFIG, utils } = require('./CONFIG')

const { program, idoToken, tradeToken, provider } = ENV_CONFIG
const { BN } = anchor

async function main () {
  await program.rpc.closeAmountConfigAccount({
    accounts: {
      amountConfigAccount: POOL_CONFIG.AMOUNT_CONFIG_ID,
      costMint: POOL_CONFIG.TRADE_TOKEN_ID,
      authority: provider.wallet.publicKey,
      closeAuthority: provider.wallet.publicKey,
      systemProgram: ENV_CONFIG.SYSTEM_PROGRAM_ID,
    },
  })
}

console.log('Running client.');
main().then(() => console.log('Success')).catch(e => console.error(e));

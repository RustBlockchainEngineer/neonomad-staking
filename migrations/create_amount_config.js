// client.js is used to introduce the reader to generating clients from IDLs.
// It is not expected users directly test with this example. For a more
// ergonomic example, see `tests/basic-0.js` in this workspace.

const anchor = require('@project-serum/anchor');

const { ENV_CONFIG, POOL_CONFIG, utils } = require('./CONFIG')
const { program, idoToken, tradeToken, provider, connection } = ENV_CONFIG
const { BN, web3 } = anchor

async function main () {
  await utils.validateTokens()
  const amountConfigAccount = anchor.web3.Keypair.generate();
  await program.rpc.createAmountConfigAccount(
    POOL_CONFIG.AMOUNT_COST_TIER_CONFIG,
    {
      accounts: {
        amountConfigAccount: amountConfigAccount.publicKey,
        authority: provider.wallet.publicKey,
        costMint: POOL_CONFIG.TRADE_TOKEN_ID,
        systemProgram: ENV_CONFIG.SYSTEM_PROGRAM_ID,
      },
      signers: [amountConfigAccount],
      instructions: [
        await program.account.amountConfigAccount.createInstruction(amountConfigAccount, 8 + 68 + 17 * POOL_CONFIG.AMOUNT_COST_TIER_CONFIG.length),
      ]
    })
  console.log("AmountConfig=", amountConfigAccount.publicKey.toString())
}

console.log('Running client.');
main().then(() => console.log('Success')).catch(e => console.error(e));

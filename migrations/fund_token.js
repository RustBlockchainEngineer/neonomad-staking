// client.js is used to introduce the reader to generating clients from IDLs.
// It is not expected users directly test with this example. For a more
// ergonomic example, see `tests/basic-0.js` in this workspace.

const anchor = require('@project-serum/anchor');

const { ENV_CONFIG, POOL_CONFIG, utils } = require('./CONFIG')

const { program, idoToken, tradeToken, provider } = ENV_CONFIG

async function main () {
  const poolAccountInfo = await utils.getPoolAcount()
  await program.rpc.fund(POOL_CONFIG.IDO_AMOUNT, {
    accounts: {
      poolAccount: POOL_CONFIG.POOL_ID,
      poolSigner: await utils.getPoolSign(),
      authority: provider.wallet.publicKey,
      idoUserVault: await utils.getAssociatedTokenAddress(POOL_CONFIG.IDO_TOKEN_ID, provider.wallet.publicKey),
      idoPoolVault: poolAccountInfo.idoPoolVault,
      tokenProgram: ENV_CONFIG.TOKEN_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      systemProgram: ENV_CONFIG.SYSTEM_PROGRAM_ID
    }
  })
}

console.log('Running client.');
main().then(() => console.log('Success')).catch(e => console.error(e));

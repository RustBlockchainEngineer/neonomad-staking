// client.js is used to introduce the reader to generating clients from IDLs.
// It is not expected users directly test with this example. For a more
// ergonomic example, see `tests/basic-0.js` in this workspace.

const anchor = require('@project-serum/anchor');

const { ENV_CONFIG, POOL_CONFIG, utils } = require('./CONFIG')

const { program, idoToken, tradeToken, provider } = ENV_CONFIG

async function main () {
  const poolAccount = await utils.getPoolAcount()
  console.log({ seller: poolAccount.seller, creatorAuthority: poolAccount.creatorAuthority, tradePoolVault: poolAccount.tradePoolVault, poolSigner: await utils.getPoolSign(), sellerVault: await utils.getAssociatedTokenAddress(POOL_CONFIG.TRADE_TOKEN_ID, poolAccount.seller), creatorVault: await utils.getAssociatedTokenAddress(POOL_CONFIG.TRADE_TOKEN_ID, poolAccount.creatorAuthority) })
  const tx = await program.rpc.withdrawFunds(
    {
      accounts: {
        poolAccount: POOL_CONFIG.POOL_ID,
        poolSigner: await utils.getPoolSign(),
        authority: ENV_CONFIG.wallet.publicKey,
        tradeSellerVault: await utils.getAssociatedTokenAddress(POOL_CONFIG.TRADE_TOKEN_ID, poolAccount.seller),
        tradeCreatorVault: await utils.getAssociatedTokenAddress(POOL_CONFIG.TRADE_TOKEN_ID, poolAccount.creatorAuthority),
        tradePoolVault: poolAccount.tradePoolVault,
        tokenProgram: ENV_CONFIG.TOKEN_PROGRAM_ID,
        rent: ENV_CONFIG.RENT_PROGRAM_ID,
        clock: ENV_CONFIG.CLOCK_PROGRAM_ID,
        systemProgram: ENV_CONFIG.SYSTEM_PROGRAM_ID,
      },
    }
  );

  console.log(await program.account.poolAccount.all())
}

console.log('Running client.');
main().then(() => console.log('Success')).catch(e => console.error(e));

// client.js is used to introduce the reader to generating clients from IDLs.
// It is not expected users directly test with this example. For a more
// ergonomic example, see `tests/basic-0.js` in this workspace.

const anchor = require('@project-serum/anchor');

const { ENV_CONFIG, POOL_CONFIG, utils } = require('./CONFIG')

const { program, idoToken, tradeToken, provider } = ENV_CONFIG

async function main () {
  await utils.validateTokens()
  const poolAccount = anchor.web3.Keypair.generate()
  const [_poolSigner, _bump] = await anchor.web3.PublicKey.findProgramAddress(
    [poolAccount.publicKey.toBuffer()],
    program.programId
  );
  const idoPoolVault = await idoToken.createAccount(_poolSigner)
  const tradePoolVault = await tradeToken.createAccount(_poolSigner)
  await program.rpc.createPool(
    _bump,
    POOL_CONFIG.START_TIME,
    POOL_CONFIG.END_TIME,
    POOL_CONFIG.TRADE_VALUE,
    POOL_CONFIG.TAX_SELLER,
    POOL_CONFIG.TAX_USER,
    POOL_CONFIG.HAS_WHITELIST,
    {
      accounts: {
        poolAccount: poolAccount.publicKey,
        poolSigner: _poolSigner,
        seller: POOL_CONFIG.SELLER,
        creatorAuthority: ENV_CONFIG.wallet.publicKey,
        amountConfigAccount: POOL_CONFIG.AMOUNT_CONFIG_ID,
        idoMint: idoToken.publicKey,
        idoPoolVault: idoPoolVault,
        tradeMint: tradeToken.publicKey,
        tradePoolVault: tradePoolVault,
        tokenProgram: ENV_CONFIG.TOKEN_PROGRAM_ID,
        rent: ENV_CONFIG.RENT_PROGRAM_ID,
        clock: ENV_CONFIG.CLOCK_PROGRAM_ID,
        systemProgram: ENV_CONFIG.SYSTEM_PROGRAM_ID,
      },
      signers: [poolAccount],
      instructions: [
        await program.account.poolAccount.createInstruction(poolAccount, 8 + 302 + 17 * 12 + 17 * POOL_CONFIG.AMOUNT_COST_TIER_CONFIG.length) // max 12 vesting schedule
      ]
    }
  );

  console.log('POOL=', poolAccount.publicKey.toString())
  console.log(await program.account.poolAccount.fetch(poolAccount.publicKey))
}

console.log('Running client.');
main().then(() => console.log('Success')).catch(e => console.error(e));

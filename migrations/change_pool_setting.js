// client.js is used to introduce the reader to generating clients from IDLs.
// It is not expected users directly test with this example. For a more
// ergonomic example, see `tests/basic-0.js` in this workspace.

const anchor = require('@project-serum/anchor');
const { BN } = anchor;

const { ENV_CONFIG, POOL_CONFIG, utils } = require('./CONFIG')

const { program, idoToken, tradeToken, provider } = ENV_CONFIG

// new BN(Date.now() / 1000)

async function main () {
  await program.rpc.changePoolSetting({
    hasWhitelist: null,
    startTime: null,
    endTime:  new BN(Date.now() / 1000 + 7*24*60*60),
    taxSeller: null,
    taxUser: null,
    seller: null,
    tradeValue: utils.getNumber(0.1),
    paused: null,
    amountConfigAccount: null,
  }, {
    accounts: {
      poolAccount: POOL_CONFIG.POOL_ID,
      creatorAuthority: provider.wallet.publicKey
    }
  })
  console.log(await program.account.poolAccount.fetch(POOL_CONFIG.POOL_ID))
}

console.log('Running client.');
main().then(() => console.log('Success')).catch(e => console.error(e));;

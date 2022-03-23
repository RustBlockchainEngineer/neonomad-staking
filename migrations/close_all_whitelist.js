// client.js is used to introduce the reader to generating clients from IDLs.
// It is not expected users directly test with this example. For a more
// ergonomic example, see `tests/basic-0.js` in this workspace.

const anchor = require('@project-serum/anchor');
const csv = require('csvtojson')
const { ENV_CONFIG, POOL_CONFIG, utils } = require('./CONFIG')
const solanaWeb3 = require('@solana/web3.js');
const { BN } = anchor
const { PublicKey } = anchor.web3
const { program, idoToken, tradeToken, provider, connection } = ENV_CONFIG

async function main () {
    const whitelistAccounts = await program.account.poolWhitelistAccount.all(POOL_CONFIG.POOL_ID.toBuffer())
    for (const whitelistAccount of whitelistAccounts) {
      await program.rpc.closeWhitelistAccount({
        accounts: {
          poolAccount: POOL_CONFIG.POOL_ID,
          poolWhitelistAccount: whitelistAccount.publicKey,
          creatorAuthority: provider.wallet.publicKey,
          closeAuthority: new PublicKey("HV4DykGhCeXiffo3Co1W8pvst2ePks8Ph8fbvhjpVnpi"),
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        },
      })
      console.log('Closed ', whitelistAccount.publicKey.toString())
    }
}

console.log('Running client.');
main().then(() => console.log('Success')).catch(e => console.error(e));
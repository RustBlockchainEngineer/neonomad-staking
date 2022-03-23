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
const _ = require('lodash')
const MAX_LEN = 300
const MAX_LEN_TX = 30

async function main () {
  const poolAccount = await utils.getPoolAcount()
  if (!poolAccount.hasWhitelist) throw new Error("Pool no need whitelist")

  let wallets = await csv().fromFile('migrations/whitelist.csv')
  wallets = wallets.map(({ address }) => address)
  let validWallets = _.uniq(wallets).map(a => new PublicKey(a))

  const whitelistAccounts = await program.account.poolWhitelistAccount.all(POOL_CONFIG.POOL_ID.toBuffer())
  whitelistAccounts.forEach(x => console.log(`${x.publicKey} ${x.account.whitelist.length}`))
  const addedWhitelist = _.flatten(whitelistAccounts.map(w => w.account.whitelist.slice(0, w.account.len))).map(x => new PublicKey(x.toString()))

  validWallets = validWallets.filter(w => !addedWhitelist.find(added => added.equals(w)))
  console.log("Will add=", validWallets.length)
  for (const whitelistAccount of whitelistAccounts) {
    let remainedSpace = MAX_LEN - whitelistAccount.account.len
    while (remainedSpace && validWallets.length) {
      const willAdds = validWallets.splice(0, _.min([remainedSpace, MAX_LEN_TX]))
      remainedSpace -= willAdds.length
      await program.rpc.addWhitelist(willAdds, {
        accounts: {
          poolAccount: POOL_CONFIG.POOL_ID,
          poolWhitelistAccount: whitelistAccount.publicKey,
          creatorAuthority: provider.wallet.publicKey
        }
      })
      console.log(`${whitelistAccount.publicKey.toString()} Added=${willAdds.length}`)
    }

    if (!validWallets.length) break
  }
  while (validWallets.length) {
    const whitelistAccount = anchor.web3.Keypair.generate()
    console.log("Create WhitelistAccount=", whitelistAccount.publicKey.toString())
    await program.rpc.createWhitelistAccount({
      accounts: {
        poolAccount: POOL_CONFIG.POOL_ID,
        poolWhitelistAccount: whitelistAccount.publicKey,
        creatorAuthority: provider.wallet.publicKey,
        systemProgram: ENV_CONFIG.SYSTEM_PROGRAM_ID,
      },
      signers: [whitelistAccount]
    })
    let remainedSpace = MAX_LEN
    while (remainedSpace && validWallets.length) {
      const willAdds = validWallets.splice(0, _.min([remainedSpace, MAX_LEN_TX]))
      remainedSpace -= willAdds.length
      await program.rpc.addWhitelist(willAdds, {
        accounts: {
          poolAccount: POOL_CONFIG.POOL_ID,
          poolWhitelistAccount: whitelistAccount.publicKey,
          creatorAuthority: provider.wallet.publicKey
        }
      })
      console.log(`${whitelistAccount.publicKey.toString()} Added=${willAdds.length}`)
    }
  }
}

console.log('Running client.');
main().then(() => console.log('Success')).catch(e => console.error(e));

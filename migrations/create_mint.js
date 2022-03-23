// client.js is used to introduce the reader to generating clients from IDLs.
// It is not expected users directly test with this example. For a more
// ergonomic example, see `tests/basic-0.js` in this workspace.

const anchor = require('@project-serum/anchor');
const { ENV_CONFIG, POOL_CONFIG, utils } = require('./CONFIG')
const { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID } = require("@solana/spl-token");

const { provider } = ENV_CONFIG

async function main() {
  const mint = await Token.createMint(
    provider.connection,
    provider.wallet.payer,
    provider.wallet.publicKey,
    null,
    9,
    TOKEN_PROGRAM_ID
  );
  console.log(mint.publicKey.toString())
}

console.log('Running client.');
main().then(() => console.log('Success'));

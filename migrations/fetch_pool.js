// client.js is used to introduce the reader to generating clients from IDLs.
// It is not expected users directly test with this example. For a more
// ergonomic example, see `tests/basic-0.js` in this workspace.

const anchor = require('@project-serum/anchor');
const { ENV_CONFIG, POOL_CONFIG, utils } = require('./CONFIG')

async function main() {
  // Address of the deployed program.
  // const programId = new anchor.web3.PublicKey('8qfptuxZcEsssSP8ALoVvpf1aMB6gVwMd4chf2FcrdZD');

  // // Generate the program client from IDL.
  // const program = new anchor.Program(idl, programId);

  // // Execute the RPC.
  // await program.rpc.initialize();
  // #endregion main

  console.log(await ENV_CONFIG.program.account.poolAccount.all())

  // console.log()
}

console.log('Running client.');
main().then(() => console.log('Success'));

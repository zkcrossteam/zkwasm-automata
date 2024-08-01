import { ZKWasmAppRpc } from "zkwasm-ts-server";

const CMD_INSTALL_PLAYER = 1n;

function createCommand(nonce: bigint, command: bigint, objindex: bigint) {
  return (nonce << 16n) + (objindex << 8n) + command;
}

let account = "1234";

const rpc = new ZKWasmAppRpc("http://localhost:3000");

async function main() {
  let nonce = 0n;
  let install_command = createCommand(nonce, CMD_INSTALL_PLAYER, 0n);
  await rpc.sendTransaction([install_command,0n,0n,0n], account);

  // Get the state response
  let state = await rpc.queryState(account);

  // Parse the response to ensure it is a plain JSON object
  const parsedState = JSON.parse(JSON.stringify(state));

  // Extract the data from the parsed response
  const data = JSON.parse(parsedState.data);

  console.log("player info:");
  console.log(data[0]);

  console.log("object info:");
  console.log(data[1]);

  console.log("global time:");
  console.log(data[2]);

  let config = await rpc.query_config();
  console.log("config", config);
}

main();

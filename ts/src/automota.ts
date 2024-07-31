import { query, LeHexBN, ZKWasmAppRpc } from "zkwasm-ts-server";
import BN from "bn.js";

/* The modifier mush less than eight */
function encode_modifier(modifiers: Array<bigint>) {
  let c = 0n;
  for (const m of modifiers) {
    c = (c << 8n) + m;
  }
  return c;
}

const CMD_INSTALL_PLAYER = 1n;
const CMD_INSTALL_OBJECT = 2n;
const CMD_RESTART_OBJECT = 3n;
const CMD_WITHDRAW= 4n;
const CMD_DEPOSIT = 4n;

function addrToParams(bn: BN): Array<bigint> {
  // address is encoded in BigEndian
  const mask = new BN('ffffffffffffffff', 16);
  let a = bn.and(mask).toArray('le', 8);
  let b = bn.shrn(64).and(mask).toArray('le', 8);
  let c = bn.shrn(128).and(mask).toArray('le', 8);
  let aHex = a.map(byte => byte.toString(16).padStart(2, '0')).join('');
  let bHex = b.map(byte => byte.toString(16).padStart(2, '0')).join('');
  let cHex = c.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return [BigInt(`0x${cHex}`), BigInt(`0x${bHex}`), BigInt(`0x${aHex}`)];
}

function createCommand(command: bigint, objindex: bigint) {
  return (command << 32n) + objindex;
}

let account = "1234";

const rpc = new ZKWasmAppRpc("http://localhost:3000");


async function main() {
  let finished = 0;

  let config = await rpc.query_config();
  console.log("config", config);

  let install_command = createCommand(CMD_INSTALL_PLAYER, 0n);
  finished = await rpc.sendTransaction([install_command,0n,0n,0n], account);
  console.log("install player processed at:", finished);

  let modifiers = encode_modifier([0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n]);
  let command = createCommand(CMD_INSTALL_OBJECT, 0n);
  finished = await rpc.sendTransaction([command, modifiers,0n,0n], account);
  console.log("install object processed at:", finished);

  command = createCommand(CMD_INSTALL_OBJECT, 0n);
  finished = await rpc.sendTransaction([command, modifiers,0n,0n], account);
  console.log("install object processed at:", finished);

  let state = await rpc.queryState(account);
  console.log("query state:", state);

  let accountInfo = new LeHexBN(query(account).pkx).toU64Array();
  let command_deposit = createCommand(CMD_DEPOSIT, 0n);
  finished = await rpc.sendTransaction([command_deposit, accountInfo[1], accountInfo[2], 1000n], account);
  console.log("deposit processed at:", finished);

  let command_withdraw = createCommand(CMD_WITHDRAW, 0n);
  let addParams = addrToParams(new BN('123456789011121314', 16));
  finished = await rpc.sendTransaction([command_withdraw, addParams[0], addParams[1], addParams[2]], account);
  console.log("withdraw processed at:", finished);
}

main();

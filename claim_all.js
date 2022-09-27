import { Api, JsonRpc } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig.js"; // development only
// import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import fetch from "node-fetch";
import * as cron from "node-cron";
import moment from "moment";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
// import * as notify from "../telegram/telegraf/notify.js";

const privateKeys = [process.env.cs1claim, process.env.cd3claim];

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc("https://wax.greymass.com", { fetch });
// const rpc = new JsonRpc("https://wax.eosusa.news/", { fetch }); //https://wax.eosio.online/endpoints
// const rpc = new JsonRpc("http://wax.api.eosnation.io/", { fetch });
// const rpc = new JsonRpc("https://wax.greymass.com"); //required to read blockchain state
const api = new Api({ rpc, signatureProvider }); //required to submit transactions

const cs1 = "cryptosebus1";
const cs1_perm = "claim";
const cd3 = "cryptodysia3";
const cd3_perm = "claim";

// let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
// let current_date = date.format("YYYY-MM-DD HH:mm:ss");
// let next_hour = date.add(1, "hours").format("HH");
const date = "YYYY-MM-DD HH:mm:ss";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function cs1_claim_rplanet() {
  // while (true) {
  try {
    // console.log(new Date() + "\nclaiming...");
    const transaction = await api.transact(
      {
        actions: [
          {
            account: "s.rplanet",
            name: "claim",
            authorization: [{ actor: cs1, permission: cs1_perm }],
            data: {
              to: cs1,
            },
          },
        ],
      },
      { blocksBehind: 3, expireSeconds: 30 }
    );
    // console.log(`> 🦁   RP claimed  🐷 | ${moment(new Date()).format(date)}`); //🦁
    console.log(
      `  🦁  | ${moment(new Date()).format(date)} | ${
        transaction.transaction_id
      }`
    );
    // console.log(
    //   `https://wax.bloks.io/transaction/${transaction.transaction_id}`
    // );
    // console.log("- 🦁   RP verifying..."); //🆚
    setTimeout(() => {
      cs1_claim_rplanet();
    }, 5000);
  } catch (error) {
    if (error.message == "assertion failure with message: E_NOTHING_TO_CLAIM") {
      console.log("  ✅  | nothing to claim, waiting...");
      // console.log("- 🦁   RP nothing to claim ✅");
      // console.log(
      //   `- 🦁   RP trying to claim again at ${moment(new Date())
      //     .add(1, "hours")
      //     .format("HH")}:03:00...`
      // ); //⏩
    } else {
      setTimeout(() => {
        console.log(`  🦁  | ${moment(new Date()).format(date)} | error`);
        console.log(error);
        // notify.sendMessage(error);
        cs1_claim_rplanet();
      }, 10000);
    }
  }
  // }
}

async function cd3_claim_rplanet() {
  try {
    // console.log(Date() + "\nclaiming...");
    const transaction = await api.transact(
      {
        actions: [
          {
            account: "s.rplanet",
            name: "claim",
            authorization: [{ actor: cd3, permission: cd3_perm }],
            data: {
              to: cd3,
            },
          },
        ],
      },
      { blocksBehind: 3, expireSeconds: 30 }
    );
    // console.log(`> 🐵   RP claimed  🐷 | ${moment(new Date()).format(date)}`); //🦁
    console.log(
      `  🐵  | ${moment(new Date()).format(date)} | ${
        transaction.transaction_id
      }`
    );
    // console.log(
    //   `https://wax.bloks.io/transaction/${transaction.transaction_id}`
    // );
    // console.log("- 🐵   RP verifying..."); //🆚
    setTimeout(() => {
      cd3_claim_rplanet();
    }, 5000);
  } catch (error) {
    if (error.message == "assertion failure with message: E_NOTHING_TO_CLAIM") {
      // console.log("  ✅  | nothing to claim | waiting...");
      // console.log(
      //   `- 🐵   RP trying to claim again at ${moment(new Date())
      //     .add(2, "hours")
      //     .format("HH")}:03:00...`
      // ); //⏩
    } else {
      setTimeout(() => {
        console.log(`  🐵  | ${moment(new Date()).format(date)} | error`);
        console.log(error);
        // notify.sendMessage(error);
        cd3_claim_rplanet();
      }, 10000);
    }
  }
  // }
}

async function all_claim_greenrabbit() {
  // while (true) {
  try {
    // console.log(Date() + "\nclaiming staking.gr...");
    const transaction = await api.transact(
      {
        actions: [
          {
            account: "staking.gr",
            name: "claim",
            authorization: [{ actor: cs1, permission: cs1_perm }],
            data: {
              user: cs1,
            },
          },
          {
            account: "driveless.gr",
            name: "claim",
            authorization: [{ actor: cs1, permission: cs1_perm }],
            data: {
              user: cs1,
              collection: "greenrabbit",
            },
          },
          {
            account: "staking.gr",
            name: "claim",
            authorization: [{ actor: cd3, permission: cd3_perm }],
            data: {
              user: cd3,
              collection: "greenrabbit",
            },
          },
        ],
      },
      { blocksBehind: 3, expireSeconds: 30 }
    );
    // console.log(`> 🦁🐵 GR claimed  🐰 | ${moment(new Date()).format(date)}`); //🦁
    console.log(
      ` 🦁🐵 | ${moment(new Date()).format(date)} | ${
        transaction.transaction_id
      }`
    );
    // console.log("- 🦁🐵 GR verifying...");
    setTimeout(() => {
      all_claim_greenrabbit();
    }, 5000);
  } catch (error) {
    if (
      error.message ==
      "assertion failure with message: nothing to claim just yet"
    ) {
      console.log(" ✅✅ | nothing to claim, waiting...");
      // console.log("- 🦁🐵 GR trying to claim again at 17:03:00..."); //⏩
    } else {
      setTimeout(() => {
        console.log(` 🦁🐵 | ${moment(new Date()).format(date)} | error`);
        console.log(error);
        // notify.sendMessage(error);
        all_claim_greenrabbit();
      }, 10000);
    }
    // }
  }
}

// cs1_claim_rplanet();
// cd3_claim_rplanet();
// all_claim_greenrabbit();

cron.schedule("3 * * * *", cs1_claim_rplanet);
console.log("  🦁  | waiting to claim on min 3...");
cron.schedule("3 0,2,4,6,8,10,12,14,16,18,20,22 * * *", cd3_claim_rplanet);
console.log("  🐵  | waiting to claim on min 3 of even hour...");

cron.schedule("0 17 * * */1", all_claim_greenrabbit);
console.log(" 🦁🐵 | waiting to claim at 17:00:00...");

// console.log(
//   `🦁🐵 | ${moment(new Date()).format(
//     date
//   )} | 6ac208e08d2a636824124d7556087e23e9076f8fbc6329b1d8fca40cd732b3a6`
// ); //🆔

// cd3_claim_greenrabbit();
// cs1_claim_greenrabbit();
// cron.schedule("0 17 * * */1", cs1_claim_greenrabbit);
// console.log("~ 🦁 GR 🐰 waiting to claim at 17:00:00...");
// cron.schedule("0 17 * * */1", cd3_claim_greenrabbit);
// console.log("~ 🐵 GR 🐰 waiting to claim at 17:00:00...");//🦋

// async function test() {
//   // let date = moment(new Date()).format(date);

//   // let date = moment(new Date());
//   // let current_date = date.format(date);
//   console.log(`> GR claimed  🐰 | ${moment(new Date()).format(date)}`); //🦁
//   await sleep(2000);
//   console.log(`> GR claimed  🐰 | ${moment(new Date()).format(date)}`); //🦁
//   // console.log(mmnt() + " 00 nothing to claim ✅");
//   // console.log(new Date().toISOString("en-US"));
//   // console.log(mmnt() + " 01 nothing to claim ✅");
//   // await sleep(2000);
//   // console.log(mmnt() + " 02 nothing to claim ✅");
// }

// test();

// let date = moment(new Date());
// function mmnt() {
//   let current_date = date.format(date);
// console.log(current_date);
// }

// setTimeout(function () {
//   console.log(mmnt);
// }, 2000);
// setTimeout(console.log(mmnt), 2000);

// setTimeout(function () {
//   let date = moment(new Date());
//   let current_date = date.format(date);
//   console.log(`${current_date} | 01 nothing to claim ✅`);
// }, 2000);

// setTimeout(function () {
//   let current_date = date.format(date);
//   console.log(`${current_date} | 02 nothing to claim ✅`);
// }, 2000);

// function date(x) {
//   moment(x).format("YYYY-MM-DD HH:mm:ss");
// }

// console.log("> GR claimed  🐷 | 2022>09-25 12:03:01");
// console.log("> GR trying to claim again at 17:03:00..."); //⏩

// async function cs1_claim_greenrabbit() {
//   // while (true) {
//   try {
//     // console.log(Date() + "\nclaiming staking.gr...");
//     const transaction = await api.transact(
//       {
//         actions: [
//           {
//             account: "staking.gr",
//             name: "claim",
//             authorization: [{ actor: cs1, permission: cs1_perm }],
//             data: {
//               user: cs1,
//             },
//           },
//           {
//             account: "driveless.gr",
//             name: "claim",
//             authorization: [{ actor: cs1, permission: cs1_perm }],
//             data: {
//               user: cs1,
//               collection: "greenrabbit",
//             },
//           },
//         ],
//       },
//       { blocksBehind: 3, expireSeconds: 30 }
//     );
//     console.log(`> 🦁 GR claimed  🐰 | ${moment(new Date()).format(date)}`); //🦁
//     console.log(`- 🦁 GR ${transaction.transaction_id}`);
//     console.log("- 🦁 GR verifying..."); //🦋
//     setTimeout(() => {
//       cs1_claim_greenrabbit();
//     }, 5000);
//   } catch (error) {
//     if (
//       error.message ==
//       "assertion failure with message: nothing to claim just yet"
//     ) {
//       console.log("- 🦁 GR nothing to claim ✅");
//       console.log("- 🦁 GR trying to claim again at 17:03:00..."); //⏩
//     } else {
//       setTimeout(() => {
//         console.log(`* 🦁 GR ${moment(new Date()).format(date)} | ${error}`);
//         cs1_claim_greenrabbit();
//       }, 10000);
//     }
//     // }
//   }
// }

// async function cd3_claim_greenrabbit() {
//   // while (true) {
//   try {
//     // console.log(Date() + "\nclaiming staking.gr...");
//     const transaction = await api.transact(
//       {
//         actions: [
//           {
//             account: "staking.gr",
//             name: "claim",
//             authorization: [{ actor: cd3, permission: cd3_perm }],
//             data: {
//               user: cd3,
//               collection: "greenrabbit",
//             },
//           },
//         ],
//       },
//       { blocksBehind: 3, expireSeconds: 30 }
//     );
//     console.log(`> 🐵 GR claimed  🐰 | ${moment(new Date()).format(date)}`); //🦁
//     console.log(`- 🐵 GR ${transaction.transaction_id}`);
//     console.log("- 🐵 GR verifying..."); //🦋
//     setTimeout(() => {
//       cd3_claim_greenrabbit();
//     }, 5000);
//   } catch (error) {
//     if (
//       error.message ==
//       "assertion failure with message: nothing to claim just yet"
//     ) {
//       console.log("- 🐵 GR nothing to claim ✅");
//       console.log("- 🐵 GR trying to claim again at 17:03:00..."); //⏩
//     } else {
//       setTimeout(() => {
//         console.log(`* 🐵 GR ${moment(new Date()).format(date)} | ${error}`);
//         cd3_claim_greenrabbit();
//       }, 10000);
//     }
//     // }
//   }
// }

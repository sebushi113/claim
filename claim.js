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
// const rpc = new JsonRpc("https://wax.greymass.com", { fetch });
// const rpc = new JsonRpc("https://wax.eosusa.news/", { fetch }); //https://wax.eosio.online/endpoints
const rpc = new JsonRpc("http://wax.api.eosnation.io/", { fetch });
// const rpc = new JsonRpc("https://wax.greymass.com"); //required to read blockchain state
const api = new Api({ rpc, signatureProvider }); //required to submit transactions

const cs1 = process.env.cs1;
const cs1_perm = process.env.cs1perm;
const cd3 = process.env.cd3;
const cd3_perm = process.env.cd3perm;

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
      // { blocksBehind: 3, expireSeconds: 30 }
      { useLastIrreversible: true, expireSeconds: 300 }
    );
    console.log(
      `  🦁   | ${moment(new Date()).format(date)}   ${
        transaction.transaction_id
      }`
    );
    setTimeout(() => {
      cs1_claim_rplanet();
    }, 10000);
  } catch (error) {
    if (error.message == "assertion failure with message: E_NOTHING_TO_CLAIM") {
      console.log("  ✅   | nothing to claim, waiting...");
      // console.log("- 🦁   RP nothing to claim ✅");
      // console.log(
      //   `- 🦁   RP trying to claim again at ${moment(new Date())
      //     .add(1, "hours")
      //     .format("HH")}:03:00...`
      // ); //⏩
    } else {
      setTimeout(() => {
        console.log(`  🦁   | ${moment(new Date()).format(date)} | error`);
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
      // { blocksBehind: 3, expireSeconds: 30 }
      { useLastIrreversible: true, expireSeconds: 300 }
    );
    console.log(
      `  🐵   | ${moment(new Date()).format(date)} | ${
        transaction.transaction_id
      }`
    );
    setTimeout(() => {
      cd3_claim_rplanet();
    }, 10000);
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
        console.log(`  🐵   | ${moment(new Date()).format(date)} | error`);
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
      // { blocksBehind: 3, expireSeconds: 30 }
      { useLastIrreversible: true, expireSeconds: 300 }
    );
    console.log(
      ` 🦁🐵 | ${moment(new Date()).format(date)} | ${
        transaction.transaction_id
      }`
    );
    setTimeout(() => {
      all_claim_greenrabbit();
    }, 10000);
  } catch (error) {
    if (
      error.message ==
      "assertion failure with message: nothing to claim just yet"
    ) {
      console.log(" ✅✅ | nothing to claim, waiting...");
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

console.log("\x1b[36m", "rpc  | " + rpc.endpoint, "\x1b[0m");

cron.schedule("3 * * * *", cs1_claim_rplanet);
console.log("  🦁   | waiting to claim on min 3...");
cron.schedule("3 0,2,4,6,8,10,12,14,16,18,20,22 * * *", cd3_claim_rplanet);
console.log("  🐵   | waiting to claim on min 3 of even hour...");

cron.schedule("0 17 * * */1", all_claim_greenrabbit);
console.log(" 🦁🐵 | waiting to claim at 13:00:00...");

/*
git add .
git commit -am "make it better"
git push heroku master
heroku scale worker=1
heroku logs --tail
heroku run node claim.js //?
heroku restart
heroku scale web=0
git push heroku main //?
git push --force heroku
*/

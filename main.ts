import { notifyChannel } from "./lib/discord.ts";
import { env } from "./lib/env.ts";
import { getProfile } from "./lib/twitcasting.ts";

const USERID = env("USERID");

let latest = {
  first: false,
  user: {
    is_live: false,
  },
};

const watch = async () => {
  const profile = await getProfile(USERID);

  if (latest.first) {
    console.log("First run");
    latest = { first: false, ...profile };
  }

  // ライブ状況
  if (profile.user.is_live !== latest.user.is_live) {
    console.log("Found Change", "ライブ", profile.user.is_live);

    await notifyChannel(`ライブ${profile.user.is_live ? "開始" : "終了"}`);
    latest.user.is_live = profile.user.is_live;
  }
};

const main = async () => {
  console.log("Exec", new Date());

  try {
    await watch();
  } catch (e) {
    console.error(e);
  }

  console.log("---");
};

setInterval(async () => await main(), 30 * 1000);
await main();

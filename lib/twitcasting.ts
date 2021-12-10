import { encode } from "https://deno.land/std/encoding/base64.ts";
import { env } from "./env.ts";

const TWITCASTING_ID = env("TWITCASTING_ID");
const TWITCASTING_SECRET = env("TWITCASTING_SECRET");

const getToken = () => {
  return encode(`${TWITCASTING_ID}:${TWITCASTING_SECRET}`);
};

const getUser = async (token: string, userid: string) => {
  const res = await fetch(
    `https://apiv2.twitcasting.tv/users/${userid}`,
    {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-Api-Version": "2.0",
        "Authorization": `Basic ${token}`,
      },
    },
  );

  if (!res.ok) {
    console.error(res);
    throw new Error("Request Error");
  }

  const result = await res.json();
  return result;
};

export const getProfile = async (userid: string) => {
  const token = getToken();
  const user = await getUser(token, userid);
  return user;
};

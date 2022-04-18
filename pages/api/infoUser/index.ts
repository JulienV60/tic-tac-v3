import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../src/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accesstoken = req.cookies.AccessToken;

  const mongodb = await getDatabase();
  const auth0searchUser = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/userinfo`,
    {
      method: "Post",
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    }
  )
    .then((data) => data.json())
    .then((result) => result.email);

  const searchDbUser = await mongodb
    .db()
    .collection("Users")
    .findOne({ email: auth0searchUser })
    .then((data) => data?._id);

  const byId = await mongodb
    .db()
    .collection("Collaborateurs")
    .findOne({ idUser: searchDbUser?.toString() });

  res.end(JSON.stringify(byId));
}

import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../src/database";
import cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const queryCode = req.query.code;
  console.log("hello");
  const mongodb = await getDatabase();
  const auth0 = await fetch(`${process.env.AUTH0_TOKEN}`, {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: `grant_type=authorization_code&client_id=${process.env.AUTH0_CLIENT_ID}&client_secret=${process.env.AUTH0_CLIENT_SECRET}&code=${queryCode}&redirect_uri=${process.env.AUTH0_LOCAL}`,
  })
    .then((data) => data.json())
    .then((token) => token);

  const tokenAccess = auth0.access_token;
  const tokenId = auth0.id_token;
  const auth0searchUser = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/userinfo`,
    {
      method: "Post",
      headers: {
        Authorization: `Bearer ${tokenAccess}`,
      },
    }
  ).then((data) => data.json());
  const mailUserAuth0 = auth0searchUser.email;
  const searchDbUser = await mongodb
    .db()
    .collection("Users")
    .findOne({ email: mailUserAuth0 })
    .then((data) => data?.email);
  const searchCategory = await mongodb
    .db()
    .collection("Users")
    .findOne({ email: mailUserAuth0 })
    .then((data) => data?.profile);
  if (searchDbUser === mailUserAuth0) {
    const cookies = res.setHeader("Set-Cookie", [
      cookie.serialize("AccessToken", tokenAccess, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 60 * 60,
        sameSite: "lax",
        path: "/",
      }),
      cookie.serialize("IdToken", tokenId, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 60 * 60,
        sameSite: "lax",
        path: "/",
      }),
    ]);
    if (searchCategory === "Manager") {
      res.redirect(303, "/manager");
    } else if (searchCategory === "Collaborateur") {
      res.redirect(303, "/collaborateur");
    } else {
      res.redirect("/404");
    }
  } else {
    res.redirect("/404");
  }
}

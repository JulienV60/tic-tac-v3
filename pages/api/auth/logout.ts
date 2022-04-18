import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth0 = `https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${process.env.AUTH0_LOCAL}`;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Set-Cookie", [
    cookie.serialize("AccessToken", "deleted", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 0,
      path: "/",
    }),
    cookie.serialize("IdToken", "deleted", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 0,
      path: "/",
    }),
  ]);
  res.redirect(303, auth0);
}

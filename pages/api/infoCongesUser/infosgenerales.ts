import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../src/database";

import jwt_decode from "jwt-decode";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessTokken = req.cookies.IdToken;
  const decoded: any = jwt_decode(accessTokken);

  const mongodb = await getDatabase();
  const Dispo = await mongodb
    .db()
    .collection("Collaborateurs")
    .findOne({ email: decoded.email })
    .then((result) => {
      console.log(result?.droit_cp);
    });
  res.end(JSON.stringify({ data: "data" }));
}

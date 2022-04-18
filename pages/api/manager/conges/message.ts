import type { NextApiRequest, NextApiResponse } from "next";
import jwt_decode from "jwt-decode";
import { userId, userProfil } from "../../../../src/userInfos";
import { getDatabase } from "../../../../src/database";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = JSON.parse(req.body);
    const message = body.message;
    const id = body.id;
    const index = body.index;

    const mongodb = await getDatabase();
    const accessTokken = req.cookies.IdToken;

    let profile;
    let idUser;
    let decoded: any;
    if (accessTokken === undefined) {
      profile = null;
    } else {
      decoded = jwt_decode(accessTokken);
      profile = await userProfil(decoded.email);
      idUser = await userId(decoded.email);
    }
    const searchConges = await mongodb
      .db()
      .collection("Collaborateurs")
      .updateOne(
        { [`conges.${index}.id`]: id },
        {
          $set: {
            message: message,
          },
        }
      );

    res.redirect(303, "/manager/conges");
  }
}

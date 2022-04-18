import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../src/database";
import jwt_decode from "jwt-decode";
import { userId, userProfil } from "../../../src/userInfos";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const accessTokken = req.cookies.IdToken;
    const date = JSON.parse(req.body);

    const alldate = date.date;
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
    const mongodb = await getDatabase();
    const date1 = moment(`${alldate[0]}`);
    const date2 = moment(`${alldate[1]}`);
    const diff = date2.diff(date1);
    const diffInDays = date2.diff(date1, "day");

    const userFound = await mongodb
      .db()
      .collection("Collaborateurs")
      .updateOne(
        {
          idUser: idUser?.toString(),
        },
        {
          $push: {
            conges: {
              id: uuidv4(),
              start: alldate[0],
              end: alldate[1],
              approuved: false,
              traited: false,
              nbrdays: diffInDays,
            },
          },
        }
      );
    res.redirect(303, "/collaborateur/conges");
  } else {
    res.end(JSON.stringify(req.body));
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import { getCookies } from "cookies-next";
import moment from "moment";
import { getDatabase } from "../../../../../src/database";
import { ObjectId } from "mongodb";
import { ObjectID } from "bson";
import jwt_decode from "jwt-decode";
import { userProfil } from "../../../../../src/userInfos";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const mongodb = await getDatabase();
    const semaineSelected = parseInt(req.query.semaine.toString()) - 1;
    const day = parseInt(req.query.day.toString()) - 1;
    const idUser = req.query.id;
    let planning = null;

    if (semaineSelected !== -1) {
      planning = await mongodb
        .db()
        .collection("Collaborateurs")
        .findOne({
          _id: new ObjectID(idUser.toString()),
        })
        .then((result) => result?.horaires[semaineSelected]);
    }

    res.end(JSON.stringify({ planningData: planning, id: idUser }));
  }
}

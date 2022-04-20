import type { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";
import { getDatabase } from "../../../../../src/database";
import { ObjectId } from "mongodb";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = JSON.parse(req.body);
  console.log("----------------", data);
  const dateElement = moment(data.start).locale("fr").format("L");

  const heureElementStart = moment(data.start).locale("fr").format("LT");

  const heureElementEnd = moment(data.end).locale("fr").format("LT");

  const numeroSemaine =
    parseInt(moment(data.start).locale("fr").format("w")) - 1;
  console.log(numeroSemaine);
  const numeroJourSemaine =
    parseInt(moment(data.start).locale("fr").format("e")) + 1;
  console.log(numeroJourSemaine);
  const mongodb = await getDatabase();

  const collaborateur = await mongodb
    .db()
    .collection("Collaborateurs")
    .updateOne(
      {
        _id: new ObjectId(data.collaborateur),
      },
      {
        $set: {
          [`horaires.${numeroSemaine}.${numeroJourSemaine}.horaires`]: "",
          [`horaires.${numeroSemaine}.${numeroJourSemaine}.heure_necessaire`]:
            "",
          [`horaires.${numeroSemaine}.${numeroJourSemaine}.heure_realisees`]:
            "",
        },
      }
    );

  res.redirect(`${req.headers.referer}`);
}

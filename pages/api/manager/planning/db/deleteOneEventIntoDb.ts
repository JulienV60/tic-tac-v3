import type { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";
import { getDatabase } from "../../../../../src/database";
import { ObjectId } from "mongodb";
import getWeek from "date-fns/getWeek";
import getDay from "date-fns/getDay";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = JSON.parse(req.body);
  const dateElement = moment(data.start).locale("fr").format("L");
  const heureElementStart = moment(data.start).locale("fr").format("LT");
  const heureElementEnd = moment(data.end).locale("fr").format("LT");
  const weekNumber = getWeek(new Date(data.start)) - 2;
  const numeroSemaine = weekNumber;
  const dayNumber = getDay(new Date(data.start));
  const numeroJourSemaine = dayNumber;
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
  console.log(collaborateur);

  res.redirect(`${req.headers.referer}`);
}

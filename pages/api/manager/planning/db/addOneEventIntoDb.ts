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
  console.log(data);
  const dateElement = moment(data.start).locale("fr").format("L");
  const heureElementStart = moment(data.start).locale("fr").format("LT");
  const heureElementEnd = moment(data.end).locale("fr").format("LT");
  const weekNumber = getWeek(new Date(data.start)) - 2;
  const numeroSemaine = weekNumber;
  console.log(numeroSemaine);
  const dayNumber = getDay(new Date(data.start));
  const numeroJourSemaine = dayNumber;
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
          [`horaires.${numeroSemaine}.${numeroJourSemaine}.horaires`]: `${data.start}/${data.end}`,
          [`horaires.${numeroSemaine}.${numeroJourSemaine}.heure_necessaire`]: `${
            moment(data.end).diff(data.start, "minutes") / 60
          }`,
          [`horaires.${numeroSemaine}.${numeroJourSemaine}.heure_realisees`]: `${
            Math.floor(Math.random() * (11 - 2)) + 2
          }`,
        },
      }
    );

  res.redirect(`${req.headers.referer}`);
}

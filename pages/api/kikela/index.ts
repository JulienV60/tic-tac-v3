import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../src/database";
import { getDay, getWeek } from "date-fns";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const weekNumber = getWeek(new Date()) - 1;
    const dayNumber = getDay(new Date());
    const body = JSON.parse(req.body);

    const nom = body.nom;
    const prenom = body.prenom;

    const mongodb = await getDatabase();
    const Dispo = await mongodb
      .db()
      .collection("Collaborateurs")
      .findOne({ profile: "Collaborateur", nom: nom, prenom: prenom })
      .then((result) => {
        if (result !== null) {
          if (result.horaires[weekNumber][dayNumber].horaires !== "") {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
    res.end(Dispo.toString());
  }
}

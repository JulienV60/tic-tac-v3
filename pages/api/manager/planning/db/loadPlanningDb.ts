import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../../../src/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const mongodb = await getDatabase();
    const semaineSelected = parseInt(req.query.semaine.toString()) - 1;

    // const idUser = req.query.id;
    let planning = null;

    // if (15 !== -1) {
    planning = await mongodb
      .db()
      .collection("Collaborateurs")
      .find({
        profile: "Collaborateur",
      })
      .toArray()
      .then((result) =>
        result.map((element) => {
          return {
            id: element._id.toString(),
            horaires: element.horaires[semaineSelected],
          };
        })
      );
    // }

    res.end(JSON.stringify({ planningData: planning }));
  }
}

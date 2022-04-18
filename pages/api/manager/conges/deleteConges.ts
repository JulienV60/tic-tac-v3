import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../../src/database";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = JSON.parse(req.body.split("/")[0]);
  const message = req.body.split("/")[1];
  const queryId = data.test;
  const queryIndex = data.i;
  const queryDay = data.day;
  console.log(data);
  console.log(message);

  const mongodb = await getDatabase();
  const searchSoldesCp = await mongodb
    .db()
    .collection("Collaborateurs")
    .findOne({ [`conges.${queryIndex}.id`]: queryId })
    .then((cp) => {
      return cp?.soldes_cp;
    });
  const newSoldes = searchSoldesCp - parseInt(queryDay.toString());

  const searchConges = await mongodb
    .db()
    .collection("Collaborateurs")
    .updateOne(
      { [`conges.${queryIndex}.id`]: queryId },
      {
        $set: {
          [`conges.${queryIndex}.traited`]: true,
          message: message,
        },
      }
    );
  res.redirect(303, "/manager/conges");
}

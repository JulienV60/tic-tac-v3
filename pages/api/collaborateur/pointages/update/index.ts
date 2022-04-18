import { NextApiRequest, NextApiResponse } from "next";
import jwt_decode from "jwt-decode";
import { userId, userProfil } from "../../../../../src/userInfos";
import { getDatabase } from "../../../../../src/database";
import moment from "moment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    console.log("hello");
    const accessTokken = req.cookies.IdToken;
    const data = JSON.parse(req.body);
    const heureMatin = new Date(data.heureMatin).toString();
    const heureAprem = new Date(data.heureAprem).toString();
    const motif = data.motif;
    const jour = data.jour;
    const heureMatinFormat = `${jour} ${heureMatin.substring(
      16,
      heureMatin.length
    )}`;
    const heureApremFormat = `${jour} ${heureAprem.substring(
      16,
      heureAprem.length
    )}`;

    const numeroSemaine = parseInt(moment(jour).locale("fr").format("w")) - 1;

    const numeroJourSemaine =
      parseInt(moment(jour).locale("fr").format("e")) + 1;

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

    //Thu Apr 14 2022 06:15:00 GMT+0200 (heure d’été d’Europe centrale)/Thu Apr 14 2022 15:30:00 GMT+0200 (heure d’été d’Europe centrale)
    const collaborateur = await mongodb
      .db()
      .collection("Collaborateurs")
      .updateOne(
        {
          idUser: idUser?.toString(),
        },
        {
          $set: {
            [`horaires.${numeroSemaine}.${numeroJourSemaine}.horaires`]: `${heureMatinFormat}/${heureApremFormat}`,
            [`horaires.${numeroSemaine}.${numeroJourSemaine}.regulariser`]:
              true,
            [`horaires.${numeroSemaine}.${numeroJourSemaine}.heure_realisees`]: `${parseFloat(
              (
                moment(heureApremFormat).diff(heureMatinFormat, "minutes") / 60
              ).toString()
            )}`,
          },
        }
      );

    res.end(JSON.stringify("test"));
  } else {
    res.end(JSON.stringify("test"));
  }
}

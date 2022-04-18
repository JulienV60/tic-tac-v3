import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fs = require("fs");
  fs.readFile("ArrayPlanning.json", "utf8", function (err: any, data: any) {
    const content = data.split("]");

    fs.unlink("ArrayPlanning.json", (err: any) => {
      if (err) throw err;
      console.log("Fichier supprimé !");
    });

    const arrayReturned = content.forEach((element: any, index: number) => {
      const elementFormatString = element.replace("[", "");
      const elementFormatJson = JSON.parse(elementFormatString);

      const stringReceived = JSON.parse(req.body);

      if (elementFormatJson.id === stringReceived.id) {
        fs.appendFile(
          "ArrayPlanning.json",
          `[${JSON.stringify(stringReceived)}]`,
          function (err: any) {
            if (err) throw err;
            console.log("Fichier mis à jour !");
          }
        );
      } else {
        fs.appendFile(
          "ArrayPlanning.json",
          `[${JSON.stringify(elementFormatJson)}]`,
          function (err: any) {
            if (err) throw err;
            console.log("Fichier mis à jour !");
          }
        );
      }
    });
  });

  res.end(JSON.stringify({ data: "data" }));
}

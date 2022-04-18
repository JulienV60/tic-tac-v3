import type { NextApiRequest, NextApiResponse } from "next";
import { getCookies } from "cookies-next";
import { getDatabase } from "../../../src/database";
import { access } from "fs";
import moment from "moment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    res.end("pl");
  }
}

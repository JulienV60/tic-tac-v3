import type { NextApiRequest, NextApiResponse } from "next";
import { getCookies } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return res.status(200).json({ cookie: getCookies({ req, res }) });
}

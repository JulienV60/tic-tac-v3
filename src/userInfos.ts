import { getDatabase } from "./database";

export async function userProfil(userInfo: string) {
  const mongodb = await getDatabase();
  const userFound = await mongodb
    .db()
    .collection("Users")
    .findOne({
      email: userInfo,
    })
    .then((result) => result?.profile);
  return userFound;
}

export async function userId(userInfo: string) {
  const mongodb = await getDatabase();
  const userIdFound = await mongodb
    .db()
    .collection("Users")
    .findOne({
      email: userInfo,
    })
    .then((result) => result?._id);
  return userIdFound;
}
export async function userRayon(userInfo: string) {
  const mongodb = await getDatabase();
  const userIdFound = await mongodb
    .db()
    .collection("Collaborateurs")
    .findOne({
      email: userInfo,
    })
    .then((result) => result?.rayon);

  return userIdFound;
}

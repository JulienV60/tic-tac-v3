import { GetServerSideProps, NextPage } from "next";
import { Layout } from "../../components/LayoutCollab";
import jwt_decode from "jwt-decode";
import React from "react";
import { userId, userProfil } from "../../src/userInfos";
import { getDatabase } from "../../src/database";
import moment from "moment";
import getWeek from "date-fns/getWeek";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const weekNumber = getWeek(new Date()) - 1;
  const accessTokken = context.req.cookies.IdToken;
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
  if (profile === "Collaborateur") {
    const numeroSemaine = weekNumber - 1;
    const numeroSemaineSuivante = weekNumber;
    const mongodb = await getDatabase();
    const searchCongesActual = await mongodb
      .db()
      .collection("Collaborateurs")
      .findOne({ idUser: idUser?.toString() })
      .then((data) => data?.horaires[numeroSemaine]);

    const searchCongesNext = await mongodb
      .db()
      .collection("Collaborateurs")
      .findOne({ idUser: idUser?.toString() })
      .then((data) => data?.horaires[numeroSemaineSuivante]);
    const allDateActuel = searchCongesActual.map(
      (element: any, index: number) => {
        if (index !== 0) {
          return {
            nameday: element.designation,
            date: element.date,
            horairesStart: moment(element.horaires.split("/")[0]).format(
              "HH:MM"
            ),
            horairesEnd: moment(element.horaires.split("/")[1]).format("HH:MM"),
          };
        }
      }
    );

    const allDateNext = searchCongesNext.map((element: any, index: number) => {
      if (index !== 0) {
        return {
          nameday: element.designation,
          date: element.date,
          horairesStart: moment(element.horaires.split("/")[0]).format("HH:MM"),
          horairesEnd: moment(element.horaires.split("/")[1]).format("HH:MM"),
        };
      }
    });

    const infoArrayConges = await mongodb
      .db()
      .collection("Collaborateurs")
      .findOne({ idUser: idUser?.toString() })
      .then((result) => {
        return result?.conges;
      });

    const congesNotApprouved = infoArrayConges.filter(
      (element: any, index: any) => element.traited === false
    );
    const searchMessage = await mongodb
      .db()
      .collection("Collaborateurs")
      .findOne({ idUser: idUser?.toString() })
      .then((data) => data?.message);
    const numSemaine = weekNumber;

    const contingentActuel = await mongodb
      .db()
      .collection("Collaborateurs")
      .findOne({ idUser: idUser?.toString() })
      .then((result) => result?.horaires);
    const heures: any[] = [];

    for (let i = 0; i <= numSemaine; i++) {
      for (let j = 0; j < 7; j++) {
        heures.push(contingentActuel[i][j].heure_necessaire);
      }
    }

    const sommeHeures = heures.filter((element: any) => {
      return parseInt(element + element);
    });

    let sumTotalHeuresRea = 0;
    for (let i = 0; i < sommeHeures.length; i++) {
      sumTotalHeuresRea += parseInt(sommeHeures[i]);
    }
    const heuresSUp: any[] = [];
    for (let z = 0; z <= numSemaine; z++) {
      for (let x = 0; x < 7; x++) {
        heuresSUp.push(contingentActuel[z][x].heure_realisees);
      }
    }
    const sommesHeuresSup = heuresSUp.filter((element: any) => {
      return parseInt(element + element);
    });
    let sumTotalHeuresSup = 0;
    for (let i = 0; i < sommesHeuresSup.length; i++) {
      sumTotalHeuresSup += parseInt(sommesHeuresSup[i]);
    }
    const differenceHeureReaetHeuresFaites =
      parseInt(sumTotalHeuresRea.toString()) -
      parseInt(sumTotalHeuresSup.toString());

    const searchUserConnected = await mongodb
      .db()
      .collection("Collaborateurs")
      .findOne({ idUser: idUser?.toString() })
      .then((data) => data?.horaires)
      .then((semaine) => semaine[weekNumber - 2]);

    const diff = searchUserConnected.map((element: any, index: any) => {
      if (element.heure_realisees != element.heure_necessaire) {
        if (index !== 0) {
          return {
            designation: element.designation,
            date: element.date.toString(),
            diff:
              parseInt(element.heure_necessaire) -
              parseInt(element.heure_realisees),
            regulariser: element.regulariser.toString(),
          };
        }
      } else {
      }
    });

    return {
      props: {
        anomalie: JSON.stringify(diff),
        differenceCumuleActuel: differenceHeureReaetHeuresFaites,
        contigentCumule: sumTotalHeuresSup,
        contingentActuel: sumTotalHeuresRea,
        message: JSON.stringify(searchMessage),
        congesPending: JSON.stringify(congesNotApprouved),
        allDate: JSON.stringify(allDateActuel),
        allDateNext: JSON.stringify(allDateNext),
        profileUser: profile,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};
export default function Home(props: any) {
  const message = JSON.parse(props.message);
  const allDateActual = JSON.parse(props.allDate);
  const allDateNext = JSON.parse(props.allDateNext);
  const congesPending = JSON.parse(props.congesPending);
  const contingentActuel = props.contingentActuel;
  const contingentCumule = props.contigentCumule;
  const differenceCumuleActuel = props.differenceCumuleActuel;
  const anomalie = JSON.parse(props.anomalie);
  const temps = moment().locale("FR").format("DD-MM-YYYY");

  return (
    <Layout>
      <span className="NomPage">
        <h1>ACCUEIL</h1>
      </span>
      <div className="dashboard">
        <div className="anomalie">Anomalie</div>
        <div className="dataAnomalie">
          {anomalie.map((element: any, index: any) => {
            if (index !== 0) {
              if (element.diff === 0 || element.diff > 0) {
                <></>;
              } else {
                return (
                  <div className="dataDay" key={index}>
                    <div className="dayAnomalie">
                      {" "}
                      {element?.designation.toUpperCase()}
                    </div>
                    <p> {element?.date}</p>
                    <p>{element?.diff === 0 ? <></> : element?.diff}H</p>
                  </div>
                );
              }
            }
          })}
        </div>
        <div className="message">Message</div>
        <div className="datamessage">{message}</div>
        <div className="horaires"> Horaires</div>
        <div className="horaires-left">
          <div className="week-title-left"> SEMAINE ACTUELLE </div>
          <section className="row-horaires">
            {allDateActual.map((element: any) => {
              if (element !== null) {
                return (
                  <>
                    {/* ======= SEMAINE ACTUELLE =========  */}
                    <div className="card-horaires">
                      <div className="day">
                        {element.nameday.toUpperCase()}
                        <p>{element.date}</p>
                      </div>

                      <p className="dash">Début: {element.horairesStart}</p>

                      <p className="dash">Fin: {element.horairesEnd}</p>
                    </div>
                    {/* ======= FIN SEMAINE ACTUELLE ======== */}
                  </>
                );
              }
            })}
          </section>
        </div>
        <div className="horaires-right">
          <div className="week-title-right"> SEMAINE SUIVANTE </div>
          <section className="dataHorairesSemainesSuivantes">
            {allDateNext.map((element: any) => {
              if (element !== null) {
                return (
                  <>
                    {/* ============ SEMAINE SUIVANTE  ============== */}
                    <div className="card-horaires">
                      <div className="day">
                        {element.nameday.toUpperCase()}
                        <p>{element.date}</p>
                      </div>

                      <p className="dash">
                        {" "}
                        Début:
                        {element.horairesStart === undefined ? (
                          <>Planning non programmé</>
                        ) : (
                          element.horairesStart
                        )}
                      </p>

                      <p className="dash">Fin: {element.horairesEnd}</p>
                    </div>
                    {/* ============ FIN SEMAINE SUIVANTE  ============== */}
                  </>
                );
              }
            })}
          </section>
        </div>
        <div className="compteurs">Compteurs </div>
        <div className="ecarts">Écarts </div>
        <div className="datacompteurs">
          <p>
            Contingent contractuel cumulé au {temps} : {contingentActuel} h
          </p>
          <p>
            Contingent contractuel ajusté au {temps} : {contingentCumule} h
          </p>
        </div>
        <div className="dataecarts">
          Écart entre contingent cumulé et ajuste : {differenceCumuleActuel}{" "}
          Heures
        </div>
        <div className="conges">Demandes de congés </div>
        {congesPending.map((element: any, index: number) => {
          if (element.traited === false) {
            return (
              <div
                key={index}
                className="dataconges"
                style={{ borderRadius: "5px" }}
              >
                <p> Commence le : {moment(element.start).format("L")}</p>{" "}
                <p> Finis le : {moment(element.end).format("L")}</p>{" "}
                <p> Nombres de jours : {element.nbrdays}</p>
              </div>
            );
          }
        })}
      </div>
    </Layout>
  );
}

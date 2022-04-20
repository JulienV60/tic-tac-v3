import { Datepicker } from "@mobiscroll/react";
import { GetServerSideProps, NextPage } from "next";
import { Card, Button } from "react-bootstrap";
import { Layout } from "../../components/LayoutCollab";
import jwt_decode from "jwt-decode";
import { userId, userProfil } from "../../src/userInfos";
import { getDatabase } from "../../src/database";
import React, { useState } from "react";
import moment from "moment";

export const getServerSideProps: GetServerSideProps = async (context) => {
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
    const mongodb = await getDatabase();

    const congesInfo = await mongodb
      .db()
      .collection("Collaborateurs")
      .findOne({ idUser: idUser?.toString() })
      .then((result) => {
        return { droitCP: result?.droit_cp, soldesCP: result?.soldes_cp };
      });

    const infoArrayConges = await mongodb
      .db()
      .collection("Collaborateurs")
      .findOne({ idUser: idUser?.toString() })
      .then((result) => {
        return result?.conges;
      });

    if (infoArrayConges !== undefined) {
      const congesNotApprouved = infoArrayConges.filter(
        (element: any, index: any) => element.traited === false
      );
      const nbrDayAwait = congesNotApprouved.map((element: any, index: any) => {
        if (element.traited === false) {
          return element.nbrdays;
        }
      });
      const congesApprouved = infoArrayConges.filter(
        (element: any, index: any) => element.approuved === true
      );
      const congesRefused = infoArrayConges.filter(
        (element: any, index: any) =>
          element.approuved === false && element.traited === true
      );
      const congesTake = congesApprouved.map((element: any, index: any) => {
        return element.nbrdays;
      });

      let sum = 0;
      for (let i = 0; i < congesTake.length; i++) {
        sum += congesTake[i];
      }

      let sumNbrAwait = 0;
      for (let i = 0; i < nbrDayAwait.length; i++) {
        sumNbrAwait += nbrDayAwait[i];
      }

      return {
        props: {
          demandeRefused: congesRefused.length,
          demandeawait: congesNotApprouved.length,
          demandeApprouved: congesApprouved.length,
          nbrTake: sum,
          data: congesInfo,
          nbrNbrAwait: sumNbrAwait,
          dataListConges: JSON.stringify(infoArrayConges),
        },
      };
    } else {
      return {
        props: {
          demandeawait: null,
          data: congesInfo,
        },
      };
    }
  } else {
    return {
      notFound: true,
    };
  }
};

export default function Conges(props: any) {
  const [date, setMyDate] = React.useState();
  const [soldePrevision, setSoldePrevision] = React.useState(
    parseInt(props.data.soldesCP) - parseInt(props.nbrNbrAwait)
  );
  const [calendar, setCalendar] = React.useState();
  const [showbutton, setShowButton] = React.useState(false);
  let dataConges = [];
  if (props.demandeawait !== null) {
    dataConges = JSON.parse(props.dataListConges);
  }
  const pickerChange = async (ev: any) => {
    const date: any = ev.value;
    const dateStart = moment(date[0]);
    const dateEnd = moment(date[1]);
    const diffInDays = dateEnd.diff(dateStart, "day");

    if (diffInDays <= soldePrevision) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
    setMyDate(ev.value);
  };
  const sendDate = async (e: any) => {
    const test = await fetch("/api/collaborateur", {
      method: "POST",
      body: JSON.stringify({ date: date }),
    });
    window.location.reload();
  };

  return (
    <>
      <Layout>
        <div className="container">
          {/* ============== SOLDES DES CONGES PAYES ============ */}

          <section className="leave-section">
            <div className="leave-title">
              <h3 className="leave-h3 ">Soldes des congés payés</h3>
            </div>
            <div>
              <div>
                <form
                  method="POST"
                  action={`${process.env.AUTH0_LOCAL}/api/collaborateur`}
                >
                  <div className="container-picker">
                    <Datepicker
                      themeVariant="light"
                      controls={["calendar"]}
                      select="range"
                      rangeHighlight={true}
                      showRangeLabels={true}
                      value={date}
                      onChange={pickerChange}
                      endIcon="calendar"
                    />
                  </div>

                  {showbutton === true ? (
                    <button
                      type="button"
                      className="btn"
                      style={{ backgroundColor: "#2f9dac", color: "white" }}
                      onClick={sendDate}
                      id="date"
                    >
                      Valider
                    </button>
                  ) : (
                    <></>
                  )}
                </form>
              </div>
            </div>
            <div className="container-leave">
              <div className="leave-history">
                <div>
                  <div className="leave-title">Droits</div>
                  <p>{props.data.droitCP}</p>
                </div>
                <div>
                  <div className="leave-title"> Pris </div>
                  <p>{props.nbrTake}</p>
                </div>
                <div>
                  <div className="leave-title"> Soldes </div>
                  <p>{props.data.soldesCP}</p>
                </div>
                <div>
                  <div className="leave-title">Demandes en cours </div>
                  <p>{props.demandeawait}</p>
                </div>
                <div>
                  <div className="leave-title">Demandes acceptées </div>
                  <p>{props.demandeApprouved}</p>
                </div>
                <div>
                  <div className="leave-title">Demandes refusées</div>
                  <p>{props.demandeRefused}</p>
                </div>
                <div>
                  <div className="leave-title">Soldes prévitionnels</div>
                  <p>{soldePrevision}</p>
                </div>
              </div>
            </div>
          </section>

          {/* ============== HISTORIQUES DES DEMANDES EN COURS ============ */}

          <section className="leave-section">
            <div className="leave-title" style={{ borderRadius: "5px" }}>
              <h3 className="leave-h3">Historiques des demandes en cours</h3>
            </div>

            {dataConges.map((element: any, index: number) => {
              if (element.traited === false) {
                return (
                  <div className="container-leave">
                    <div
                      key={index}
                      className="leave-history"
                      style={{ borderRadius: "5px" }}
                    >
                      <div className="start">
                        <div className="leave-title">Date de Début</div>
                        <p>{moment(element.start).format("L")}</p>
                      </div>
                      <div className="end">
                        <div className="leave-title">Date de fin</div>
                        <p>{moment(element.end).format("L")}</p>
                      </div>
                      <div className="quantity">
                        <div className="leave-title">Quantité</div>
                        <p>{element.nbrdays}</p>
                      </div>
                      <div className="rest">
                        <div className="leave-title">Statut</div>
                        En cours
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </section>

          {/* ============== HISTORIQUES DES DEMANDES REFUSEES ============ */}

          <section className="leave-section">
            <div className="leave-title" style={{ borderRadius: "5px" }}>
              <h3 className="leave-h3">Historiques des demandes refusées</h3>
            </div>

            {dataConges.map((element: any, index: number) => {
              if (element.approuved === false && element.traited === true) {
                return (
                  <div className="container-leave">
                    <div key={index} className="leave-history">
                      <div className="start">
                        <div className="leave-title"> Date de Début</div>
                        <p>{moment(element.start).format("L")}</p>
                      </div>
                      <div className="end">
                        <div className="leave-title">Date de fin</div>
                        <p>{moment(element.end).format("L")}</p>
                      </div>
                      <div className="quantity">
                        <div className="leave-title">Quantité</div>
                        {element.nbrdays}
                      </div>
                      <div>
                        <div className="leave-title">Statut</div>
                        <p className="red">Refusée</p>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </section>

          {/* ============== HISTORIQUES DES DEMANDES ACCEPTEES ============ */}

          <section className="leave-section">
            <div className="leave-title">
              <h3 className="leave-h3">Historiques des demandes acceptées</h3>
            </div>

            {dataConges.map((element: any, index: number) => {
              if (element.approuved === true) {
                return (
                  <div className="container-leave">
                    <div key={index} className="leave-history">
                      <div>
                        <div className="leave-title">Date de Début</div>
                        <p>{moment(element.start).format("L")}</p>
                      </div>
                      <div>
                        <div className="leave-title">Date de fin</div>
                        <p> {moment(element.end).format("L")}</p>
                      </div>
                      <div>
                        <div className="leave-title">Quantité</div>
                        <p> {element.nbrdays}</p>
                      </div>
                      <div>
                        <div className="leave-title">Statut</div>
                        <p className="green"> Acceptée</p>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </section>
        </div>
      </Layout>
    </>
  );
}

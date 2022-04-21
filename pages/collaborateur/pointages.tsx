import { Button, Datepicker, Input } from "@mobiscroll/react";
import { setOptions, localeFr } from "@mobiscroll/react";
import React from "react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
setOptions({
  locale: localeFr,
  theme: "ios",
  themeVariant: "light",
});
import { GetServerSideProps, NextPage } from "next";
import { Layout } from "../../components/LayoutCollab";
import { userProfil } from "../../src/userInfos";
import jwt_decode from "jwt-decode";
import moment from "moment";
import { Form, Toast } from "react-bootstrap";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const accessTokken = req.cookies.IdToken;
  let profile;
  let decoded: any;
  if (accessTokken === undefined) {
    profile = null;
  } else {
    decoded = jwt_decode(accessTokken);
    profile = await userProfil(decoded.email);
  }

  if (profile === "Collaborateur") {
    return {
      props: {
        prenoms: "",
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

export default function Pointages(props: any) {
  const [semaine, setMySemaine] = React.useState();
  const [numSemaine, setNumSemaine] = React.useState(
    parseInt(moment().format("w")) - 1
  );
  const [jour, setMyJour] = React.useState("");
  const [afficheFormJour, setAfficheFormJour] = React.useState(false);
  const [afficheFormPointage, setAfficheFormPointage] = React.useState(false);
  const [afficheButtonValide, setAfficheButtonValide] = React.useState(false);
  const [regulariser, setRegulariser] = React.useState(false);
  const [heurePlanif, setHeurePlanif] = React.useState(0);
  const [heuresRea, setHeuresRea] = React.useState(0);
  const [horaireMatin, setHoraireMatin] = React.useState("");
  const [horaireAprem, setHoraireAprem] = React.useState("");
  const [heureReaMatin, setHeureReaMatin] = React.useState("");
  const [heureReaAprem, setHeureReaAprem] = React.useState("");
  const [heureMatinCorrige, setHeureMatinCorrige] = React.useState("");
  const [heureApremCorrige, setHeureApremCorrige] = React.useState("");
  const [motif, setMotif] = React.useState("autres");
  const [show, setShow] = React.useState(false);
  const motifChange = async (ev: any) => {
    setMotif(ev);
  };
  const changeMatinCorrection = async (ev: any) => {
    setHeureMatinCorrige(ev.value);
  };
  const changeApremCorrection = async (ev: any) => {
    setHeureApremCorrige(ev.value);

    if (heureMatinCorrige !== null && ev.value !== null) {
      setAfficheButtonValide(true);
    } else {
      setAfficheButtonValide(false);
    }
  };

  const sendPointage = async () => {
    const send = await fetch("/api/collaborateur/pointages/update", {
      method: "POST",
      body: JSON.stringify({
        jour: new Date(jour).toDateString(),
        heureMatin: heureMatinCorrige,
        heureAprem: heureApremCorrige,
        motif: motif,
      }),
    });
    setShow(true);
  };

  const pickerChangeJour = async (ev: any) => {
    setMyJour(ev.value);
    if (jour !== null) {
      const dataHoraires = await fetch("/api/collaborateur/pointages", {
        method: "POST",
        body: JSON.stringify({
          semaine: parseInt(moment(ev.value).locale("fr").format("w")) - 1,
          jour: ev.value,
        }),
      })
        .then((result) => result.json())
        .then((response) => response);

      setAfficheFormPointage(true);
      setHeurePlanif(parseInt(dataHoraires.heuresPlanif.toString()));
      setHeuresRea(parseInt(dataHoraires.heuresrea.toString()));

      if (dataHoraires.heureMatin === "") {
        setHoraireMatin("Aucunes heures");
        setHoraireAprem("Aucunes heures");
        setHeureReaMatin("Aucunes heures");
        setHeureReaAprem("Aucunes heures");
      } else {
        setHoraireMatin(dataHoraires.heureMatin);
        setHoraireAprem(dataHoraires.heureAprem);
        setHeureReaMatin(dataHoraires.heureReaMatin);
        setHeureReaAprem(dataHoraires.heureReaAprem);
        setRegulariser(dataHoraires.regulariser);
      }
    }
  };

  return (
    <div>
      <Layout />{" "}
      <Toast
        onClose={() => setShow(false)}
        show={show}
        className="modalPlanning"
        delay={2000}
        autohide
        style={{
          backgroundColor: "white",
          marginTop: "15rem",
          width: "25rem",
          height: "10rem",
        }}
      >
        <Toast.Header>
          <strong
            className="me-auto"
            style={{
              fontSize: "3rem",
              textAlign: "center",
              color: "black",
              fontFamily: "Bebas Neue",
              marginTop: "1rem",
              marginLeft: "1.5rem",
            }}
          >
            Modification validée !
          </strong>
        </Toast.Header>
      </Toast>
      <span className="NomPage">
        <h1>Pointages</h1>
      </span>
      <form className="form-example-pointages container">
        <div
          className="container p-5 my-5 border"
          style={{
            backgroundColor: "#2f9dac",
            borderRadius: "10px",
          }}
        >
          <div className="form-example-jour">
            <label className="LabelPointagesHoraires">
              Jour
              <Datepicker
                calendarType="month"
                calendarSize={1}
                display="anchored"
                endIcon="calendar"
                onChange={pickerChangeJour}
              />
            </label>
          </div>
          {afficheFormPointage === true ? (
            <>
              <div className="form-example-planifie">
                <label className="LabelPointagesHoraires">
                  Horaires planifié:
                </label>{" "}
                <input
                  className="InputFormPointages"
                  type="horairesPointages"
                  name="horairesPointages"
                  id="horairesPointages"
                  value={`${heurePlanif}`}
                />
              </div>
              <div className="form-example-total">
                <label className="LabelPointages">Total travaillé:</label>{" "}
                <input
                  className="InputFormPointages"
                  type="horairesPointages"
                  name="horairesPointages"
                  id="horairesPointages"
                  value={`${heuresRea}`}
                />
              </div>

              <div className="horairesPlanning">
                <p>Planning de la journée</p>
                <div className="form-example-horaires">
                  <label className="LabelVerifHoraires">
                    Matin
                    <Datepicker
                      controls={["time"]}
                      display="bottom"
                      themeVariant="light"
                      showRangeLabels={true}
                      touchUi={false}
                      endIcon="clock"
                      value={`${horaireMatin}`}
                    />
                  </label>
                </div>

                <div className="form-example-horaires">
                  <label className="LabelVerifHoraires">
                    Après-midi
                    <Datepicker
                      controls={["time"]}
                      themeVariant="light"
                      display="bottom"
                      select="range"
                      showRangeLabels={true}
                      touchUi={true}
                      endIcon="clock"
                      value={`${horaireAprem}`}
                    />
                  </label>
                </div>
              </div>
              <div className="PointagesHoraires">
                <p>Pointages</p>
                <div className="form-example-horaires">
                  <label className="LabelPointagesHoraires">
                    Matin
                    <Datepicker
                      controls={["time"]}
                      display="bottom"
                      themeVariant="light"
                      select="date"
                      returnFormat="iso8601"
                      showRangeLabels={true}
                      touchUi={true}
                      endIcon="clock"
                      value={`${heureReaMatin}`}
                    />
                  </label>
                </div>
                {regulariser === true ? (
                  <div className="form-example-horaires">
                    <label className="LabelPointagesHoraires">
                      Après-midi
                      <Datepicker
                        controls={["time"]}
                        themeVariant="light"
                        display="bottom"
                        select="date"
                        returnFormat="iso8601"
                        showRangeLabels={true}
                        touchUi={true}
                        endIcon="clock"
                        value={`${heureReaAprem}`}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="form-example-horaires">
                    <label className="LabelPointagesHoraires">
                      Après-midi
                      <Datepicker
                        controls={["time"]}
                        themeVariant="light"
                        display="bottom"
                        select="date"
                        returnFormat="iso8601"
                        showRangeLabels={true}
                        touchUi={true}
                        endIcon="clock"
                        value={`${heureReaAprem}`}
                      />
                    </label>
                  </div>
                )}
              </div>
              {horaireMatin !== "Aucunes heures" && regulariser === false ? (
                <>
                  <div className="correctionHoraires">
                    <p>Correction</p>
                    <div className="form-example-horaires">
                      <label className="LabelCorrectionHoraires">
                        Matin
                        <Datepicker
                          controls={["time"]}
                          themeVariant="light"
                          display="anchored"
                          select="date"
                          showRangeLabels={true}
                          touchUi={true}
                          endIcon="clock"
                          onChange={changeMatinCorrection}
                        />
                      </label>
                    </div>

                    <div className="form-example-horaires">
                      <label className="LabelCorrectionHoraires">
                        Après-midi
                        <Datepicker
                          controls={["time"]}
                          display="anchored"
                          themeVariant="light"
                          select="date"
                          showRangeLabels={true}
                          touchUi={true}
                          endIcon="clock"
                          onChange={changeApremCorrection}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="MotifPointages">
                    <p>Motif: </p>

                    <select
                      className="form-select"
                      id="motifs"
                      name="motifs"
                      onChange={(event) => {
                        motifChange(event.target.value);
                      }}
                      aria-label="Default select example"
                    >
                      {" "}
                      <option style={{ display: "anchored" }} value="medicale">
                        Médicale
                      </option>
                      <option value="familiale">Familiale</option>
                      <option value="administratif">Administratif</option>{" "}
                      <option value="formation">Formation</option>
                      <option value="autres" selected>
                        Autres
                      </option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    {" "}
                    <span
                      style={{
                        fontFamily: "Bebas Neue",
                        textAlign: "center",
                        fontSize: "3rem",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Aucun horaire à corriger ! 🥳
                    </span>
                  </div>
                </>
              )}

              {afficheButtonValide === true ? (
                <button
                  onClick={sendPointage}
                  type="button"
                  className="boutonValidation btn btn-light"
                >
                  Valider
                </button>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </form>
    </div>
  );
}

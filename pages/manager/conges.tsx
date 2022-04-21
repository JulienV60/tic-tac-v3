import { GetServerSideProps, NextPage } from "next";
import LayoutManager from "../../components/LayoutManager";
import jwt_decode from "jwt-decode";
import { userProfil, userRayon } from "../../src/userInfos";
import PageNotFound from "../../components/PageNotFound";
import { getDatabase } from "../../src/database";
import moment from "moment";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import Link from "next/link";
export const getServerSideProps: GetServerSideProps = async (context) => {
  const mongodb = await getDatabase();

  const accessTokken = context.req.cookies.IdToken;
  let profile;
  let decoded: any;
  let rayon;
  if (accessTokken === undefined) {
    profile = null;
  } else {
    decoded = jwt_decode(accessTokken);
    profile = await userProfil(decoded.email);
    rayon = await userRayon(decoded.email);
  }
  if (profile === "Manager") {
    const searchconges = await mongodb
      .db()
      .collection("Collaborateurs")
      .find({ rayon: rayon })
      .toArray()
      .then((result: any) => result)
      .then((data: any) =>
        data.map((element: any) => {
          let arrayAllCongeTraited: any = [];
          if (element.conges.length !== 0) {
            return {
              firstName: element.prenom,
              lastName: element.nom,
              mail: element.email,
              soldes_cp: element.soldes_cp,
              conges: element.conges.map((element: any) => {
                if (element.traited === false) {
                  arrayAllCongeTraited.push(false);
                  return `${element.start}/${element.end}/${
                    element.nbrdays
                  }/${element.id.toString()}/${element.nbrdays}/${element.id}`;
                } else {
                  arrayAllCongeTraited.push(true);
                }
              }),
              allCongeTraited: arrayAllCongeTraited,
            };
          }
        })
      );

    return {
      props: {
        conges: JSON.stringify(searchconges),
        category: profile,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

function Conges(props: any) {
  const [message, setMessage] = React.useState("");
  const [index, setIndex] = React.useState<number>();
  const result = JSON.parse(props.conges);
  const [id, setId] = React.useState("");
  const [showTrue, setShowTrue] = React.useState(false);
  const handleCloseTrue = () => setShowTrue(false);
  const handleShowTrue = () => setShowTrue(true);
  const [showFalse, setShowFalse] = React.useState(false);
  const handleCloseFalse = () => setShowFalse(false);
  const handleShowFalse = () => setShowFalse(true);
  const [toSend, setToSend] = React.useState("");
  async function handleSubmit(event: any) {
    if (message !== "") {
      const test = await fetch("/api/manager/conges/message", {
        method: "POST",
        body: JSON.stringify({ message: message, id: id, index: index }),
      }).then((result) => result.json());
    }
  }

  async function modalTrue(objet: any) {
    handleShowTrue();
    setToSend(JSON.stringify(objet));
  }

  async function modalFalse(objet: any) {
    handleShowFalse();
    setToSend(JSON.stringify(objet));
  }
  async function acceptConges() {
    handleCloseTrue();
    const data = JSON.parse(toSend);
    const idDemande = data?.test;
    const indexDemande = data.i;
    const dayDemande = data.day;
    message;
    const api = await fetch(`/api/manager/conges/validConges`, {
      method: "POST",

      body: `${toSend}/${message}`,
    });
    window.location.reload();
  }
  async function refusConges() {
    handleCloseFalse();
    const data = JSON.parse(toSend);
    const idDemande = data?.test;
    const indexDemande = data.i;
    const dayDemande = data.day;
    message;
    console.log(data);
    const api = await fetch(`/api/manager/conges/deleteConges`, {
      method: "POST",
      body: `${toSend}/${message}`,
    });
    window.location.reload();
  }

  return (
    <LayoutManager>
      <span className="NomPage">
        <h1>Demandes Congés</h1>
      </span>
      <div className="">
        <Modal show={showTrue} onHide={handleCloseTrue} centered>
          <Modal.Header closeButton>
            <Modal.Title>Entrer votre message </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              className="form-control"
              placeholder="Entrer votre message"
              onChange={(event) => {
                setMessage(event.target.value);
              }}
              type="text"
            ></input>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseTrue}>
              Fermer
            </Button>
            <Button variant="primary" onClick={acceptConges}>
              Sauvegarder
            </Button>
          </Modal.Footer>
        </Modal>{" "}
        <Modal show={showFalse} onHide={handleCloseFalse} centered>
          <Modal.Header closeButton>
            <Modal.Title>Entrer votre message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              className="form-control"
              placeholder="Entrer votre message"
              type="text"
              onChange={(event) => {
                setMessage(event.target.value);
              }}
            ></input>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseFalse}>
              Fermer
            </Button>
            <Button variant="primary" onClick={refusConges}>
              Sauvegarder
            </Button>
          </Modal.Footer>
        </Modal>
        {result.map((element: any) => {
          if (element !== null) {
            if (element.allCongeTraited.includes(false)) {
              return (
                <div className="row overflow-auto " key={element.id}>
                  <div className="col-2 fondGris">
                    <div
                      style={{
                        height: "20rem",
                        textAlign: "center",
                        marginLeft: "1rem",
                        marginTop: "1rem",
                        backgroundColor: "#888",
                        paddingTop: "2rem",
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        color: "white",
                        borderRadius: "10px",
                      }}
                    >
                      <div>
                        <h5 className="card-title">
                          <span style={{ textDecoration: "underline" }}>
                            Nom
                          </span>{" "}
                          : <br></br> <br></br>
                          {element.firstName}
                        </h5>{" "}
                        <br></br>
                        <h5 className="card-title">
                          <span style={{ textDecoration: "underline" }}>
                            Prenom
                          </span>{" "}
                          : <br></br> <br></br>
                          {element.lastName}
                        </h5>{" "}
                        <br></br>
                        <h5 className="card-title">
                          <span style={{ textDecoration: "underline" }}>
                            {" "}
                            Soldes CP
                          </span>{" "}
                          :<br></br> <br></br>
                          {element.soldes_cp}
                        </h5>
                      </div>
                    </div>
                  </div>

                  {element.conges.map((e: any, index: number) => {
                    if (e !== null) {
                      return (
                        <div className="col-2">
                          <div
                            style={{
                              textAlign: "center",
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "1rem",
                              border: "1px solid white",
                              backgroundColor: "#2f9dac",
                              color: "white",
                              lineHeight: "3rem",
                              borderRadius: "10px",
                              paddingTop: "1rem",
                              paddingBottom: "1rem",
                              marginLeft: "1rem",
                            }}
                          >
                            <div>
                              <span style={{ textDecoration: "underline" }}>
                                Demande N°{index + 1}
                              </span>
                              <div>
                                <span style={{ textDecoration: "underline" }}>
                                  Commence le
                                </span>{" "}
                                : <br></br>
                                {moment(e.split("/")[0]).format("L")}
                              </div>
                              <div className="end">
                                <span style={{ textDecoration: "underline" }}>
                                  Fini le
                                </span>
                                : <br></br>{" "}
                                {moment(e.split("/")[1]).format("L")}
                              </div>
                              <div>
                                <span style={{ textDecoration: "underline" }}>
                                  Nombre de jours
                                </span>{" "}
                                : <br></br>
                                {e.split("/")[2]}
                              </div>{" "}
                              {element.soldes_cp - e.split("/")[2] < 0 ? (
                                <form
                                  action={`/api/manager/conges/deleteConges?${
                                    e.split("/")[3]
                                  }&i=${index}&day=${e.split("/")[4]}`}
                                  method="POST"
                                >
                                  <Button
                                    className="btn"
                                    style={{
                                      backgroundColor: "red",
                                      width: "3rem",
                                      marginLeft: "4.4rem",
                                      color: "white",
                                      borderRadius: "10px",
                                    }}
                                  >
                                    <CloseIcon />
                                  </Button>
                                </form>
                              ) : (
                                <div className="row">
                                  <div className="col-2">
                                    <Button
                                      className="btn btn-red"
                                      style={{
                                        backgroundColor: "red",
                                        marginLeft: "10rem",
                                        marginTop: "1rem",
                                        color: "white",
                                        borderRadius: "10px",
                                      }}
                                      onClick={() =>
                                        modalFalse({
                                          test: e.split("/")[3],
                                          i: index,
                                          day: e.split("/")[4],
                                        })
                                      }
                                    >
                                      <CloseIcon />
                                    </Button>
                                  </div>
                                  <div className="col-2">
                                    <Button
                                      className="btn btn-green"
                                      style={{
                                        marginTop: "1rem",
                                        backgroundColor: "green",
                                        color: "white",
                                        borderRadius: "10px",
                                      }}
                                      onClick={() =>
                                        modalTrue({
                                          test: e.split("/")[3],
                                          i: index,
                                          day: e.split("/")[4],
                                        })
                                      }
                                    >
                                      <DoneIcon />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                  <span
                    style={{
                      borderBottom: "3px solid gray",
                      marginTop: "1rem",
                    }}
                  ></span>
                </div>
              );
            }
          }
        })}
      </div>
    </LayoutManager>
  );
}

export default Conges;

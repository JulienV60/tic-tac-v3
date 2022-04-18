import { GetServerSideProps } from "next";
import React from "react";
import LayoutManager from "../../components/LayoutManager";
import moment from "moment";

import { AnyError } from "mongodb";
import { PrecisionManufacturing } from "@mui/icons-material";
import jwt_decode from "jwt-decode";
import PageNotFound from "../../components/PageNotFound";
import { userProfil } from "../../src/userInfos";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const accessTokken = context.req.cookies.IdToken;
  let profile;
  let decoded: any;
  if (accessTokken === undefined) {
    profile = null;
  } else {
    decoded = jwt_decode(accessTokken);
    profile = await userProfil(decoded.email);
  }

  if (profile === "Manager") {
    return {
      props: {
        profileUser: profile,
      },
    };
  } else {
    return {
      props: {
        profileUser: null,
      },
    };
  }
};

export default function Kikela(props: any) {
  const [prenom, setPrenom] = React.useState("");
  const [nom, setNom] = React.useState("");
  const [dispo, setDispo] = React.useState("");
  const handleSubmit = async (event: any) => {
    if (prenom !== "" || nom !== "") {
      const test = await fetch("/api/kikela", {
        method: "POST",
        body: JSON.stringify({ nom: nom, prenom: prenom }),
      }).then((result) => result.json());

      if (test === true) {
        setDispo("Present sur la base du planning");
      } else {
        setDispo("Absent sur la base du planning");
      }
    } else {
      setDispo("");
    }
  };

  if (props.profileUser === "Manager") {
    return (
      <div>
        <LayoutManager>
          {/* <div className="parent">
          <form>
              <div className="div1">Entrez votre Nom</div>
              <div className="div2"></div>
              <div className="div3">Entrez votre Prénom</div>
              <div className="div4"></div>
            </form>
          </div> */}

          <div>
            <div
              className="container p-5 my-5 border"
              style={{
                backgroundColor: "#2f9dac",
              }}
            >
              <form className="">
                <div className="row d-flex justify-content-between">
                  <div className="col w-75" style={{ marginLeft: "20rem" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Entrer votre nom"
                      name="nom"
                      onChange={(event) => {
                        setNom(event.target.value);
                      }}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Entrer votre Prenom"
                      name="prenom"
                      onChange={(event) => {
                        setPrenom(event.target.value);
                      }}
                    />
                  </div>
                  <div className="col">
                    <button
                      onClick={handleSubmit}
                      type="button"
                      className="btn "
                      style={{ backgroundColor: "white", color: "#2f9dac" }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div
              className="container p-5 my-5 border"
              style={{
                backgroundColor: "#2f9dac",
              }}
            >
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Nom: {nom}</li>
                <li className="list-group-item">Prénom: {prenom}</li>
                <li className="list-group-item">Dispo: {dispo}</li>
              </ul>
            </div>
          </div>
        </LayoutManager>
      </div>
    );
  } else {
    return <PageNotFound />;
  }
}

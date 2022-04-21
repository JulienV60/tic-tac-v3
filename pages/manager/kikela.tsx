import { GetServerSideProps } from "next";
import React, { useState } from "react";
import LayoutManager from "../../components/LayoutManager";
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
  const [afficheResult, setAfficheResult] = React.useState(<></>);
  const handleSubmit = async (event: any) => {
    if (prenom !== "" || nom !== "") {
      const test = await fetch("/api/kikela", {
        method: "POST",
        body: JSON.stringify({ nom: nom, prenom: prenom }),
      }).then((result) => result.json());

      if (test === true) {
        setAfficheResult(
          <div
            className="container p-5 my-5 border rounded"
            style={{
              backgroundColor: "#2f9dac",
            }}
          >
            <span
              style={{
                backgroundColor: "white",
                fontFamily: "Bebas Neue",
                textAlign: "center",
                fontSize: "2rem",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {nom} {prenom} est present sur la base du planning
            </span>
          </div>
        );
      } else {
        setAfficheResult(
          <div
            className="container p-5 my-5 border rounded"
            style={{
              backgroundColor: "#2f9dac",
              fontFamily: "Bebas Neue",
              textAlign: "center",
            }}
          >
            {nom} {prenom} est absent sur la base du planning
          </div>
        );
      }
    }
  };

  if (props.profileUser === "Manager") {
    return (
      <LayoutManager>
        <span className="NomPage">
          <h1>Kikéla</h1>
        </span>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "Bebas Neue" }}>
            Verifiez si un collaborateur travail aujourd&apos;hui, ses horaires
            ne seront pas affichés pour des raisons de confidentialité.
          </h2>
        </div>
        <div>
          <div>
            <div
              className="container p-5 my-5 border rounded"
              style={{
                backgroundColor: "#2f9dac",
              }}
            >
              <form className="d-flex justify-content-center ">
                <div className="row d-flex w-100">
                  <div className="col mt-2">
                    <input
                      type="text"
                      className="form-control "
                      placeholder="Entrer votre nom"
                      name="nom"
                      onChange={(event) => {
                        setNom(event.target.value);
                      }}
                    />
                  </div>
                  <div className="col mt-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Entrer votre prénom"
                      name="prenom"
                      onChange={(event) => {
                        setPrenom(event.target.value);
                      }}
                    />
                  </div>
                  <div className="col mt-2 d-flex justify-content-center">
                    <button
                      onClick={handleSubmit}
                      type="button"
                      className="home-btn"
                      style={{ marginTop: "0" }}
                    >
                      Rechercher
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {afficheResult}
          </div>
        </div>
      </LayoutManager>
    );
  } else {
    return <PageNotFound />;
  }
}

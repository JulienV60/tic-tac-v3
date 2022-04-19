import { GetServerSideProps } from "next";
import React from "react";
import { Layout } from "../../components/LayoutCollab";
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

  if (profile === "Collaborateur") {
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

  if (props.profileUser === "Collaborateur") {
    return (
      <Layout>
        <div className="p-5">
          <div className="p-5">
            <div
              className="container p-5 my-5 border rounded"
              style={{
                backgroundColor: "#2f9dac",
              }}
            >
              <form className="d-flex justify-content-center ">
                <div className="row d-flex w-75">
                  <div className="col w-75 ">
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
                  <div className="col w-75">
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
                  <div className="col w-25">
                    <button
                      onClick={handleSubmit}
                      type="button"
                      className="btn btn-primary "
                    >
                      Rechercher
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div
              className="container p-5 my-5 border rounded"
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
        </div>
      </Layout>
    );
  } else {
    return <PageNotFound />;
  }
}

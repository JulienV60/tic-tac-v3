import { GetServerSideProps } from "next";
import React from "react";
import { Layout } from "../../components/LayoutCollab";
import jwt_decode from "jwt-decode";
import PageNotFound from "../../components/PageNotFound";
import { userProfil } from "../../src/userInfos";
import { v4 as uuid } from "uuid";
// import CldCustUploadLgRestApi from "../../components/uploadPicture";
export default function Rh(props: any) {
  const [selectedImage, setSelectedImage] = React.useState(null);
  return (
    <div
      style={{ backgroundColor: "#2f9dac", height: "100%", marginTop: "5rem" }}
    >
      <h1
        style={{
          paddingTop: "2rem",
          color: "white",
          fontFamily: "Bebas Neue",
          backgroundColor: "#2f9dac",
          textAlign: "center",
        }}
      >
        Création Collaborateurs/Managers
      </h1>
      <div className="formRh">
        <form
          action="/api/rh"
          method="POST"
          style={{ width: "50rem", lineHeight: "5rem", textAlign: "center" }}
        >
          <div className="form-group">
            <label
              style={{
                fontFamily: "Bebas Neue",
                fontSize: "2rem",
                textAlign: "center",
              }}
            >
              Nom
            </label>
            <input
              type="text"
              className="form-control"
              id="formGroupExampleInput"
              placeholder="Nom"
              name="nom"
            />
          </div>
          <label style={{ fontFamily: "Bebas Neue", fontSize: "2rem" }}>
            Prénom
          </label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput2"
            placeholder="Prenom"
            name="prenom"
          />
          <label style={{ fontFamily: "Bebas Neue", fontSize: "2rem" }}>
            Email
          </label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput2"
            placeholder="Email"
            name="email"
          />{" "}
          <label style={{ fontFamily: "Bebas Neue", fontSize: "2rem" }}>
            Numero Magasin
          </label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput2"
            placeholder="Numero magasin"
            name="numeromagasin"
          />{" "}
          <label
            style={{
              fontFamily: "Bebas Neue",
              fontSize: "2rem",
              textAlign: "center",
            }}
          >
            Numero Rayon
          </label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput2"
            placeholder="Numero rayon"
            name="numerorayon"
          />
          <div
            className="form-check"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <input
              className="form-check-input"
              type="radio"
              name="exampleRadios"
              id="exampleRadios1"
              value="Collaborateur"
              checked
              style={{ width: "2rem", height: "2rem" }}
            />
            <label
              className="form-check-label"
              style={{
                marginLeft: "1rem",
                fontFamily: "Bebas Neue",
                fontSize: "2rem",
              }}
            >
              Collaborateur
            </label>
            <input
              style={{ marginLeft: "1rem", width: "2rem", height: "2rem" }}
              className="form-check-input"
              type="radio"
              name="exampleRadios"
              id="exampleRadios2"
              value="Manager"
            />
            <label
              className="form-check-label"
              style={{
                marginLeft: "1rem",
                fontFamily: "Bebas Neue",
                fontSize: "2rem",
              }}
            >
              Manager
            </label>
          </div>{" "}
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: "white",
              color: "#2f9dac",
              width: "10rem",
            }}
          >
            Envoyer
          </button>{" "}
          {/* <CldCustUploadLgRestApi /> */}{" "}
        </form>
      </div>
    </div>
  );
}

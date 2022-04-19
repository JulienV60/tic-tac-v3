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
    <div>
      <h1
        style={{
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
          style={{ width: "50rem", textAlign: "center" }}
        >
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              className="form-control"
              id="formGroupExampleInput"
              placeholder="Nom"
              name="nom"
            />
          </div>
          <label>Prénom</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput2"
            placeholder="Prenom"
            name="prenom"
          />
          <label>Email</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput2"
            placeholder="Email"
            name="email"
          />{" "}
          <label>Numero Magasin</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput2"
            placeholder="Numeromagasin"
            name="numeromagasin"
          />{" "}
          <label>Numero Rayon</label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput2"
            placeholder="Numerorayon"
            name="numerorayon"
          />
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="exampleRadios"
              id="exampleRadios1"
              value="Collaborateur"
              checked
            />
            <label className="form-check-label">Collaborateur</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="exampleRadios"
              id="exampleRadios2"
              value="Manager"
            />
            <label className="form-check-label">Manager</label>
          </div>{" "}
          {/* <CldCustUploadLgRestApi /> */}{" "}
        </form>
      </div>
      <button type="submit">Envoyer</button>{" "}
    </div>
  );
}

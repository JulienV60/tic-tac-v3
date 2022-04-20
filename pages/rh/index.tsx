import React from "react";
import Link from "next/link";
import { Button } from "react-bootstrap";
// import CldCustUploadLgRestApi from "../../components/uploadPicture";
export default function Rh(props: any) {
  const [selectedImage, setSelectedImage] = React.useState(null);
  return (
    <div
      className=""
      style={{
        backgroundColor: "#2f9dac",
        height: "62.5rem",
      }}
    >
      <Link href="/" passHref={true}>
        <Button
          type="submit"
          style={{ marginLeft: "1rem" }}
          className="home-btn"
          variant="#2f9dac"
          color="#2f9dac"
        >
          <span className="connexionText">Page Accueil</span>
        </Button>
      </Link>
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
            name="prenom"
          />
          <label style={{ fontFamily: "Bebas Neue", fontSize: "2rem" }}>
            Email
          </label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput2"
            name="email"
          />{" "}
          <label style={{ fontFamily: "Bebas Neue", fontSize: "2rem" }}>
            Numero Magasin
          </label>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput2"
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
          <Button
            type="submit"
            className="home-btn"
            variant="#2f9dac"
            color="#2f9dac"
          >
            <span className="connexionText">Envoyer</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

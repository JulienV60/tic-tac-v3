import Head from "next/head";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Button,
  Container,
  Dropdown,
  Form,
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import { Router } from "@mui/icons-material";

export const Layout: React.FC<any> = ({ children }) => {
  const [user, setUser] = React.useState<any>([{}]);
  const router = useRouter();
  React.useEffect(() => {
    async function apiToken() {
      const info = await fetch(`/api/infoUser`).then((data) => data.json());
      if (info === null || info === undefined) {
      } else {
        setUser(info);
      }
    }
    apiToken();
  }, []);

  return (
    <div>
      <Navbar bg="#2f9dac" expand={false}>
        <Container fluid>
          <div
            className="d-flex justify-content-between  "
            style={{ width: "100%" }}
          >
            <div
              style={{
                fontFamily: "Bebas Neue",
                color: "white",
                fontSize: "1.6rem",
              }}
            >
              <Navbar.Toggle
                aria-controls="offcanvasNavbar"
                style={{
                  backgroundColor: "white",
                  margin: " 0.8rem 1rem ",
                  color: "2f9dac",
                }}
              />
              Collaborateur:{" "}
              {user?.img === null ? <></> : <img className="header-resource-avatar" src={`${user?.img}`}></img>}{" "}
            </div>

            <Navbar.Brand
              href="/collaborateur"
              style={{
                color: "white",
                fontFamily: "Bebas Neue",
                width: "15rem",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              {user.nom === null ? <>nom</> : user.nom}{" "}
              {user.prenom === null ? <>prénom</> : user.prenom} <HomeIcon />
              <Link href="/api/auth/logout" passHref={true}>
                <LogoutIcon />
              </Link>
            </Navbar.Brand>
          </div>

          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
            variant="white"
            style={{
              backgroundColor: "#2f9dac",
              textAlign: "center",
              lineHeight: "4rem",
            }}
          >
            <Offcanvas.Header
              closeButton
              style={{
                backgroundColor: "white",
              }}
            >
              <Offcanvas.Title
                id="offcanvasNavbarLabel"
                style={{
                  color: "#2f9dac",
                  fontFamily: "Bebas Neue",
                  marginBottom: "1.6rem",
                  paddingTop: "0.5rem",
                  fontSize: "3.4rem",
                  lineHeight: "2rem",
                  paddingLeft: "8.7rem",
                  height: "1.5rem",
                }}
              >
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body
              style={{
                paddingTop: "5rem",
                color: "#2f9dac",
                fontFamily: "Bebas Neue",
                lineHeight: "6rem",
              }}
            >
              <Nav className="justify-content-start flex-grow-3 pe-3">
                <Dropdown style={{ lineHeight: "7rem" }}>
                  <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "#333",
                      fontFamily: "Bebas Neue",
                      fontSize: "2rem",
                      marginLeft: "0.5rem",
                      marginBottom: "1rem",
                    }}
                    href="/collaborateur"
                  >
                    Accueil
                  </Dropdown.Item>
                  <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "#333",
                      fontFamily: "Bebas Neue",
                      fontSize: "2rem",
                      marginLeft: "0.5rem",
                      marginBottom: "1rem",
                    }}
                    href="/collaborateur/planning"
                  >
                    Plannings Collectif
                  </Dropdown.Item>
                  <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      fontFamily: "Bebas Neue",
                      color: "#333",
                      fontSize: "2rem",
                      marginLeft: "0.5rem",
                      marginBottom: "1rem",
                    }}
                    href="/collaborateur/pointages"
                  >
                    Pointages
                  </Dropdown.Item>
                  <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "#333",
                      fontFamily: "Bebas Neue",
                      fontSize: "2rem",
                      marginLeft: "0.5rem",
                      marginBottom: "1rem",
                    }}
                    href="/collaborateur/conges"
                  >
                    Congés
                  </Dropdown.Item>
                  <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "#333",
                      fontFamily: "Bebas Neue",
                      fontSize: "2rem",
                      marginLeft: "0.5rem",
                      marginBottom: "1rem",
                    }}
                    href="/collaborateur/kikela"
                  >
                    Kikéla
                  </Dropdown.Item>
                  <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "#333",
                      fontFamily: "Bebas Neue",
                      fontSize: "2rem",
                      marginLeft: "0.5rem",
                      marginBottom: "1rem",
                    }}
                    href="/api/auth/logout"
                  >
                    Déconnexion
                  </Dropdown.Item>
                </Dropdown>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      {children}
    </div>
  );
};

import type { GetServerSideProps, NextPage } from "next";
import LoginIcon from "@mui/icons-material/Login";
import { Card, Button, Row, Col } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import { userProfil } from "../src/userInfos";
import PageNotFound from "../components/PageNotFound";

const Home: NextPage = (props: any) => {
  return (
    <>
      {/* ======= HOMEPAGE NO CONNECTED START ======== */}

      <section className="home-no-connected">
        <div className="info-card">
          <div className="container-home-image">
            <Card.Img
              src="/undraw_Time_management_re_tk5w (2).png"
              alt="home image"
            />
          </div>
        </div>

        <div className="rigth-side">
          <h2>Bienvenue, sur le nouveau Tac-Tic.</h2>
          <form action="/api/auth/login" method="GET">
            <Button
              type="submit"
              className="home-btn"
              variant="#2f9dac"
              color="#2f9dac"
            >
              <LoginIcon />
            </Button>
          </form>
        </div>
      </section>

      {/* ======= HOMEPAGE NO CONNECTED END ======== */}
    </>
  );
};

export default Home;

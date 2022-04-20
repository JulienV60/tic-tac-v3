import type { NextPage } from "next";
import LoginIcon from "@mui/icons-material/Login";
import { Card, Button } from "react-bootstrap";
import Link from "next/link";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
const Home: NextPage = (props: any) => {
  return (
    <div className="entireHomepage">
      {/* ======= HOMEPAGE NO CONNECTED START ======== */}

      <section className="home-no-connected">
        <div className="info-card">
          <div className="container-home-image">
            <Card.Img
              src="/undraw_time_management_re_tk5w_1.png"
              alt="home image"
            />
          </div>
        </div>

        <div className="rigth-side">
          <h2>
            Bienvenue, sur le nouveau{" "}
            <span className="TacTicHomepage">Tac-Tic</span>.
          </h2>
          <div className="boutonConnexion">
            <form action="/api/auth/login" method="GET">
              <Button
                type="submit"
                className="home-btn"
                variant="#2f9dac"
                color="#2f9dac"
              >
                <span className="connexionText">Connexion</span>
                <LoginIcon />
              </Button>
              <Link href="/rh" passHref={true}>
                <Button
                  type="submit"
                  className="home-btn"
                  variant="#2f9dac"
                  color="#2f9dac"
                >
                  Accès RH <ManageAccountsIcon />
                </Button>
              </Link>
            </form>
          </div>
        </div>
      </section>

      {/* ======= HOMEPAGE NO CONNECTED END ======== */}
    </div>
  );
};

export default Home;

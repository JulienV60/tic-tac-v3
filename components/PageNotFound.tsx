import Head from "next/head";
import React from "react";
import Link from "next/link";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";
const PageNotFound: React.FC = () => {
  return (
    <div className="error">
      <h1>
        Erreur 404,<br></br>page introuvable.{" "}
        <form method="GET" action="/">
          <button className="btn btn-success ">Back Home</button>
        </form>
      </h1>
      <img src="/undraw_Taken_re_yn20.png" alt="" />
    </div>
  );
};
export default PageNotFound;

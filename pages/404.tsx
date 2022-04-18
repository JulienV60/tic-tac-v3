export default function fail() {
  return (
    <>
      <div className="error-page">
        <div className="left-side-error">
          <h1>
            Erreur 404,<br></br>page introuvable.
          </h1>

          <form method="GET" action="/">
            <button className="error-btn">Back Home</button>
          </form>
        </div>
        <div className="right-side-error">
          <img className="error-image" src="/undraw_Taken_re_yn20.png" alt="" />
        </div>
      </div>
    </>
  );
}

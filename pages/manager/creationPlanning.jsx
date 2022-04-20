import React, { useEffect, useState } from "react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import { Eventcalendar, formatDate, localeFr } from "@mobiscroll/react";
import { getDatabase } from "../../src/database";
import LayoutManager from "../../components/LayoutManager";
const milestones = [];
import { Toast, Header } from "react-bootstrap";
import moment from "moment";
import jwt_decode from "jwt-decode";
import { userProfil } from "../../src/userInfos";
export const getServerSideProps = async (context) => {
  const accessTokken = context.req.cookies.IdToken;
  let profile;
  let decoded;
  if (accessTokken === undefined) {
    profile = null;
  } else {
    decoded = jwt_decode(accessTokken);
    profile = await userProfil(decoded.email);
  }

  if (profile === "Manager") {
    const mongodb = await getDatabase();
    const listCollaborateurs = await mongodb
      .db()
      .collection("Collaborateurs")
      .find({ profile: "Collaborateur" })
      .toArray();

    const listPrenom = listCollaborateurs.map((element) => {
      return { prenom: element.prenom, _id: element._id, img: element.img };
    });

    const data = await fetch(
      `${
        process.env.AUTH0_LOCAL
      }/api/manager/planning/db/loadPlanningDb?semaine=${parseInt(
        moment().locale("fr").format("w")
      )}`
    ).then((result) => result.json());

    return {
      props: {
        prenoms: JSON.stringify(listPrenom),
        dataPlanningInit: JSON.stringify(data),
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

function App(props) {
  const [myEvents, setEvents] = React.useState();
  const [dataPlanning, setDataPlanning] = React.useState(
    JSON.parse(props.dataPlanningInit)
  );
  const [semaineShow, setsemaineShow] = React.useState(
    parseInt(moment().locale("fr").format("w")) - 1
  );

  const [show, setShow] = useState(false);
  const [test, setTest] = useState(<></>);
  const prenoms = JSON.parse(props.prenoms);

  const view = React.useMemo(() => {
    return {
      schedule: {
        type: "week",
        allDay: false,
        startDay: 1,
        endDay: 7,
        startTime: "06:00",
        endTime: "21:00",
      },
    };
  }, []);

  const myResources = React.useMemo(() => {
    return prenoms.map((element, index) => {
      return {
        id: element._id,
        name: element.prenom,
        color: "#f7c4b4",
        img: element.img,
      };
    });
  }, []);

  //à la creation d'un evenement
  const onEventCreated = React.useCallback((args) => {
    fetch("/api/manager/planning/db/addOneEventIntoDb", {
      method: "POST",
      body: JSON.stringify({
        collaborateur: args.event.resource,
        start: args.event.start.toString(),
        end: args.event.end.toString(),
      }),
    });
    setShow(true);
  }, []);

  //à la modification d'un evenement
  const eventUpdate = React.useCallback((args) => {
    fetch("/api/manager/planning/db/updateOneEventIntoDb", {
      method: "POST",
      body: JSON.stringify({
        collaborateur: args.event.resource,
        start: args.event.start.toString(),
        end: args.event.end.toString(),
      }),
    });
    setShow(true);
  }, []);

  //à la suppression d'un evenement
  const eventClose = React.useCallback((args) => {
    fetch("/api/manager/planning/db/deleteOneEventIntoDb", {
      method: "POST",
      body: JSON.stringify({
        collaborateur: args.event.resource,
        start: args.event.start.toString(),
        end: args.event.end.toString(),
      }),
    });
    setShow(true);
  }, []);

  //function recuperation de la data mongo par semaine
  async function getDataPlanningDb(semaineShow) {
    const data = await fetch(
      `/api/manager/planning/db/loadPlanningDb?semaine=${semaineShow}`
    ).then((result) => result.json());

    setDataPlanning(data);
  }

  useEffect(() => {
    getDataPlanningDb(semaineShow);
  }, [semaineShow]);

  //lorsque la semaine change
  useEffect(() => {
    const dataEvent = [];
    const eventsPlanning = dataPlanning.planningData.map((element, index) => {
      const test = element.horaires.map((ele, index) => {
        const splitHoraires = ele.horaires.split("/");

        if (index !== 0 && splitHoraires.length !== 1) {
          dataEvent.push({
            id: `${index}:${element.id}`,
            color: "#2f9dac",
            start: formatDate(
              "YYYY-MM-DDTHH:mm:ss.000Z",
              new Date(splitHoraires[0])
            ),
            end: formatDate(
              "YYYY-MM-DDTHH:mm:ss.000Z",
              new Date(splitHoraires[1])
            ),
            busy: true,
            description: "Weekly meeting with team",
            location: "Office",
            resource: `${element.id}`,
          });
        }
      });
    });

    setEvents(dataEvent);
  }, [dataPlanning]);

  const renderDay = (args) => {
    const date = args.date;

    const dayNr = date.getDay();
    const task =
      milestones.find((obj) => {
        return +new Date(obj.date) === +date;
      }) || {};
    const numeroSemaine = parseInt(
      moment(args.date).locale("fr").format("w") - 1
    );
    setsemaineShow(numeroSemaine);

    return (
      <div className="header-template-container">
        <div className="header-template-date">
          <div className="header-template-day-name">
            {formatDate("DDDD", date)}
          </div>
          <div className="header-template-day">
            {formatDate("MMMM DD", date)}
          </div>
        </div>
        <div
          className="header-template-task"
          style={{ background: task.color }}
        >
          {task.name}
        </div>
      </div>
    );
  };

  const renderCustomResource = (resource) => {
    return (
      <div className="header-resource-template-content">
        <img
          className="header-resource-avatar pictures_creationPlanning"
          src={resource.img}
        />
        <div className="header-resource-name">{resource.name}</div>
      </div>
    );
  };
  return (
    <LayoutManager>
      <Toast
        onClose={() => setShow(false)}
        show={show}
        className="modalPlanning"
        delay={2000}
        autohide
        style={{ backgroundColor: "#2f9dac" }}
      >
        <Toast.Header>
          <strong className="me-auto">Modification</strong>
        </Toast.Header>
        <Toast.Body style={{ color: "white" }}>
          Modification validée !
        </Toast.Body>
      </Toast>
      <Eventcalendar
        className="planning"
        theme="ios"
        themeVariant="light"
        clickToCreate={true}
        dragToCreate={true}
        dragToMove={true}
        dragToResize={true}
        locale={localeFr}
        onEventCreated={onEventCreated}
        onEventUpdate={eventUpdate}
        onEventDelete={eventClose}
        view={view}
        data={myEvents}
        resources={myResources}
        groupBy="date"
        renderDay={renderDay}
        renderResource={renderCustomResource}
      />
    </LayoutManager>
  );
}

export default App;

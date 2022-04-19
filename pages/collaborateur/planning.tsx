import { GetServerSideProps } from "next";
import { getDatabase } from "../../src/database";
import moment from "moment";
import {
  Eventcalendar,
  getJson,
  formatDate,
  MbscCalendarEvent,
  MbscEventcalendarView,
  MbscResource,
  localeFr,
} from "@mobiscroll/react";
import React from "react";
import jwt_decode from "jwt-decode";
import { userProfil } from "../../src/userInfos";
import getWeek from "date-fns/getWeek";
import { Layout } from "../../components/LayoutCollab";
import GeneratePDF from "../../components/PdfGenerator";

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const weekNumber = getWeek(new Date()) - 1;
  const accessTokken = req.cookies.IdToken;
  let profile;
  let decoded: any;
  if (accessTokken === undefined) {
    profile = null;
  } else {
    decoded = jwt_decode(accessTokken);
    profile = await userProfil(decoded.email);
  }

  if (profile === "Collaborateur") {
    const mongodb = await getDatabase();

    //list of collaborateurs
    const listCollaborateurs = await mongodb
      .db()
      .collection("Collaborateurs")
      .find({ profile: "Collaborateur" })
      .toArray();

    //return prenom id and img of collaborateurs
    const listPrenom = listCollaborateurs.map((element) => {
      return { prenom: element.prenom, _id: element._id, img: element.img };
    });

    const data = await fetch(
      `${process.env.AUTH0_LOCAL}/api/manager/planning/db/loadPlanningDb?semaine=${weekNumber}`
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

export default function IndexManager(props: any) {
  const weekNumber = getWeek(new Date()) - 1;

  const [dataPlanning, setDataPlanning] = React.useState(
    JSON.parse(props.dataPlanningInit)
  );
  const prenoms = JSON.parse(props.prenoms);
  const [myEvents, setEvents] = React.useState<MbscCalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = React.useState(moment().format());
  const [semaineShow, setsemaineShow] = React.useState(weekNumber);

  async function onSelectedDateChange(args: any) {
    console.log(args);
    if (parseInt(moment(args).locale("fr").format("w")) - 1 !== semaineShow) {
      const data = await fetch(
        `/api/manager/planning/db/loadPlanningDb?semaine=${
          parseInt(moment(args).locale("fr").format("w")) - 1
        }`
      ).then((result) => result.json());

      setDataPlanning(data);
      setsemaineShow(parseInt(moment(args).locale("fr").format("w")) - 1);
      setSelectedDate(moment(args).format());
    } else {
      setSelectedDate(moment(args).format());
    }
  }

  const view = React.useMemo<MbscEventcalendarView>(() => {
    return {
      schedule: {
        type: "day",
        allDay: false,
        startDay: 1,
        endDay: 6,
        startTime: "06:00",
        endTime: "21:00",
      },
    };
  }, []);
  const myResources = React.useMemo(() => {
    return prenoms.map((element: any, index: number) => {
      return {
        id: element._id,
        name: element.prenom,
        color: "#f7c4b4",
        img: element.img,
      };
    });
  }, []);

  React.useEffect(() => {
    const dataPlanningDbFilter: any = [];

    const dataEvent: any = [];
    const eventsPlanning = dataPlanning.planningData.map(
      (element: any, index: number) => {
        const test = element.horaires.map((ele: any, index: number) => {
          const splitHoraires = ele.horaires.split("/");

          if (
            index !== 0 &&
            splitHoraires.length !== 1 &&
            ele.date === moment(selectedDate).locale("fr").format("DD/MM/YYYY")
          ) {
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
      }
    );

    setEvents(dataEvent);
  }, [selectedDate]);

  const renderDay = (args: any) => {
    const date = args.date;

    return (
      <div className="header-template-container">
        <p>ko</p>
        <div className="header-template-date">
          <div className="header-template-day-name">
            {formatDate("DDDD", date)}
          </div>
          <div className="header-template-day">
            {formatDate("MMMM DD", date)}
          </div>
        </div>
      </div>
    );
  };

  const renderCustomResource = (resource: MbscResource) => {
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
    <Layout>
      <GeneratePDF data={myEvents} ressources={myResources}/>
      <Eventcalendar
        className="planning"
        theme="ios"
        themeVariant="light"
        locale={localeFr}
        view={view}
        data={myEvents}
        resources={myResources}
        groupBy="date"
        renderDay={renderDay}
        onSelectedDateChange={(args) => onSelectedDateChange(args.date)}
        renderResource={renderCustomResource}
      />
    </Layout>
  );
}

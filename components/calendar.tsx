import {
  Eventcalendar,
  Draggable,
  Popup,
  Input,
  Textarea,
  Select,
  setOptions,
  toast,
  MbscEventcalendarView,
  localeFr,
} from "@mobiscroll/react";
import React from "react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
setOptions({
  locale: localeFr,
  theme: "ios",
  themeVariant: "light",
});

const tasks = [
  {
    title: "Small wrap",
    color: "#637e57",
    start: "2022-04-11T00:00",
    end: "2022-04-12T00:00",
    length: "2 days",
  },
  {
    title: "Full-size wrap",
    color: "#50789d",
    start: "2022-04-11T00:00",
    end: "2022-04-13T00:00",
    length: "3 days",
  },
  {
    title: "Mid-size wrap",
    color: "#6c5d45",
    start: "2022-04-11T00:00",
    end: "2022-04-13T00:00",
    length: "3 days",
  },
  {
    title: "Roadster wrap",
    color: "#9da721",
    start: "2022-04-11T00:00",
    end: "2022-04-13T00:00",
    length: "3 days",
  },
  {
    title: "SUV wrap",
    color: "#cd6957",
    start: "2022-04-11T00:00",
    end: "2022-04-14T00:00",
    length: "4 days",
  },
  {
    title: "Hypercar wrap",
    color: "#7a5886",
    start: "2022-04-11T00:00",
    end: "2022-04-15T00:00",
    length: "5 days",
  },
];

const myData = [
  { value: "1", text: "Roly Chester" },
  { value: "2", text: "Tucker Wayne" },
  { value: "3", text: "Baker Brielle" },
  { value: "4", text: "Jami Walter" },
  { value: "5", text: "Patrick Toby" },
  { value: "6", text: "Tranter Logan" },
  { value: "7", text: "Payton Sinclair" },
];

function Task(props: any) {
  const [draggable, setDraggable] = React.useState();

  const setDragElm = React.useCallback((elm: any) => {
    setDraggable(elm);
  }, []);

  return (
    <div
      ref={setDragElm}
      style={{ background: props.data.color }}
      className="external-event-task"
    >
      <div>{props.data.title}</div>
      <div>{props.data.length}</div>
      <Draggable dragData={props.data} element={draggable} />
    </div>
  );
}

const App: React.FC = () => {
  const [isOpen, setOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>("");
  const [details, setDetails] = React.useState<string>("");
  const [technician, setTechnician] = React.useState<string>("");
  const [anchor, setAnchor] = React.useState<any>(null);

  const view = React.useMemo<MbscEventcalendarView>(() => {
    return {
      calendar: { labels: true },
    };
  }, []);

  const invalid = React.useMemo(() => {
    return [
      {
        recurring: {
          repeat: "weekly",
          weekDays: "SA,SU",
        },
      },
    ];
  }, []);

  const fillDialog = React.useCallback((args: any) => {
    setTitle(args.event.title);
    setDetails(args.event.details);
    setTechnician(args.event.technician);
    setAnchor(args.target);
    setOpen(true);
  }, []);

  const onEventCreated = React.useCallback(
    (args: any) => {
      fillDialog(args);
    },
    [fillDialog]
  );

  const eventUpdateFail = React.useCallback(() => {
    toast({
      message: "Can't create event on this date",
    });
  }, []);

  const onClose = React.useCallback(() => {
    setOpen(false);
    toast({
      message: "New task added",
    });
  }, []);

  const changeSelected = React.useCallback((event: any) => {
    setTechnician(event.value);
  }, []);

  return (
    <div className="mbsc-grid mbsc-no-padding">
      <div className="mbsc-row">
        <div className="mbsc-col-sm-9 external-event-calendar">
          <Eventcalendar
            view={view}
            invalid={invalid}
            dragToMove={true}
            externalDrop={true}
            onEventCreated={onEventCreated}
            onEventCreateFailed={eventUpdateFail}
            onEventUpdateFailed={eventUpdateFail}
          />
        </div>
        <div className="mbsc-col-sm-3">
          <div className="mbsc-form-group-title">Available tasks</div>
          {tasks.map((task, i) => (
            <Task key={i} data={task} />
          ))}
        </div>
        <Popup
          display="anchored"
          width={400}
          contentPadding={false}
          touchUi={false}
          headerText="Assign task"
          buttons={["ok"]}
          anchor={anchor}
          isOpen={isOpen}
          onClose={onClose}
        >
          <div className="mbsc-form-group">
            <Input label="Task" defaultValue={title} readOnly></Input>
            <Textarea
              label="Details"
              defaultValue={details}
              placeholder="Add description..."
            ></Textarea>
            <Select
              data={myData}
              value={technician}
              onChange={changeSelected}
              display="anchored"
              touchUi={false}
              label="Technician"
              inputProps={{ placeholder: "Please select..." }}
            />
          </div>
        </Popup>
      </div>
    </div>
  );
};
export default App;

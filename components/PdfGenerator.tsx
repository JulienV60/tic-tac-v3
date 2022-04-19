import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import moment from "moment";
import { Button } from 'react-bootstrap';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
export default function GeneratePDF(props: any) {
  const test: any = [];
  let date = "";
 props.ressources.forEach((element: any) => {
    props.data.forEach((ele: any) => {
      date = moment(ele.start).locale("fr").format("L");
      if (element.id === ele.resource) {
        test.push([element.name, `${moment(ele.start).format("HH:mm")} h`,`${moment(ele.end).format("HH:mm")} h`]);
      }
    })
  })

  function generate() {

    const doc = new jsPDF({
    orientation: "landscape",

    });

    // Or use javascript directly:
    autoTable(doc, {
      head: [[`${date}`,"Debut","Fin"]],
      body: test,
      tableWidth: 'wrap',
      styles: { cellPadding: 8,fontSize: 15,cellWidth:90,halign:"center" },
    })

  doc.save(`horaire-${date}.pdf`)
  }

  return (
    <div>
      <Button variant="success" style={{backgroundColor:"#2f9dac"}} onClick={generate} ><PictureAsPdfIcon/></Button>
    </div>
  )
}

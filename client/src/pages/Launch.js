import { useMemo } from "react";
import { Appear, Button, Loading, Paragraph } from "arwes";
import Clickable from "../components/Clickable";

const Launch = props => {
  const selectorBody = useMemo(() => {
    return props.planets?.map(planet => 
      <option value={planet.kepler_name} key={planet.kepler_name}>{planet.kepler_name}</option>
    );
  }, [props.planets]);

  const today = new Date().toISOString().split("T")[0];

  return <Appear id="launch" animate show={props.entered}>
    <Paragraph>Programe el lanzamiento de una misión para un viaje interestelar a uno de los exoplanetas de Kepler.</Paragraph>
    <Paragraph>Solo los planetas confirmados que cumplan con los siguientes criterios están disponibles para las primeras misiones programadas:</Paragraph>
    <ul>
      <li>Radio planetario &lt; 1,6 veces el radio de la Tierra</li>
      <li>Flujo estelar efectivo &gt; 0,36 veces el valor de la Tierra y &lt; 1,11 veces el valor de la Tierra</li>
    </ul>

    <form onSubmit={props.submitLaunch} style={{display: "inline-grid", gridTemplateColumns: "auto auto", gridGap: "10px 20px"}}>
      <label htmlFor="launch-day">Fecha lanzamiento</label>
      <input type="date" id="launch-day" name="launch-day" min={today} max="2040-12-31" defaultValue={today} />
      <label htmlFor="mission-name">Mision</label>
      <input type="text" id="mission-name" name="mission-name" />
      <label htmlFor="rocket-name">Cohete</label>
      <input type="text" id="rocket-name" name="rocket-name" defaultValue="Explorer IS1" />
      <label htmlFor="planets-selector">Exoplaneta destino</label>
      <select id="planets-selector" name="planets-selector">
        {selectorBody}
      </select>
      <Clickable>
        <Button animate 
          show={props.entered} 
          type="submit" 
          layer="success" 
          disabled={props.isPendingLaunch}>
          Lanzar Mision ✔
        </Button>
      </Clickable>
      {props.isPendingLaunch &&
        <Loading animate small />
      }
    </form>
  </Appear>
};

export default Launch;
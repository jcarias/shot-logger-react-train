import React from "react";
import { calcDaysElapsedFloor, dateFromTimeStamp } from "../utils/dateUtils";
import ObjectUtils from "../utils/ObjectUtils";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { urls } from "../utils/urlUtils";
import { BodyPartName } from "./BoodyPartName";

const WidgetLastShot = props => {
  const computeLastDate = () => {
    if (!ObjectUtils.isEmpty(props.lastShotData)) {
      let lastDate = dateFromTimeStamp(props.lastShotData.date);
      return lastDate.toLocaleDateString();
    } else {
      return "Never";
    }
  };

  const computeDaysSinceLastShot = () => {
    if (!ObjectUtils.isEmpty(props.lastShotData)) {
      let diffDays = calcDaysElapsedFloor(
        dateFromTimeStamp(props.lastShotData.date)
      );
      if (diffDays === 0) {
        return "(Hoje)";
      } else if (diffDays === 1) {
        return "(Ontem)";
      } else {
        return "(Há " + diffDays + " dias atrás)";
      }
    }
  };

  return (
    <div className={props.className + " card bg-light"}>
      <div className="card-body">
        <h5 className="card-title my-2">Última Injeção</h5>{" "}
        {!ObjectUtils.isEmpty(props.lastShotData) && (
          <React.Fragment>
            <div className="card-subtitle">
              {computeLastDate()}{" "}
              <small className="text-muted">{computeDaysSinceLastShot()}</small>
            </div>
            <ul className="list-group bg-light my-2 small">
              <li className="list-group-item disabled">
                Local:{" "}
                <strong>
                  <BodyPartName
                    part={props.lastShotData.bodyPart}
                    parts={props.bodyParts}
                  />
                </strong>
              </li>
              <li className="list-group-item disabled">
                Lote: <strong> {props.lastShotData.batchNumber}</strong>
              </li>
              <li className="list-group-item disabled">
                Validade: <strong> {props.lastShotData.cadVal}</strong>
              </li>
            </ul>
          </React.Fragment>
        )}
        {ObjectUtils.isEmpty(props.lastShotData) && (
          <React.Fragment>
            <h6 className="card-subtitle my-2 text-muted">
              Nenhuma injeção encontrada.
            </h6>
            <p className="card-text">
              Por favor, insira uma nova injectção usando o botão abaixo.
            </p>
          </React.Fragment>
        )}
      </div>
      <div className="card-body text-center pt-0">
        <div className="btn-group" role="group">
          <Button
            color="primary"
            tag={props => <Link to={urls.inputShot.path} {...props} />}
          >
            {urls.inputShot.name}
          </Button>
          {!ObjectUtils.isEmpty(props.lastShotData) && (
            <Button
              color="secondary"
              tag={props => <Link to={urls.shotList.path} {...props} />}
            >
              {urls.shotList.name}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WidgetLastShot;

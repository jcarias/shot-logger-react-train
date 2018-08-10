import React, { Component } from "react";
import { firebaseDatabase } from "../utils/firebaseUtils";
import { calcDaysElapsedFloor, dateFromTimeStamp } from "../utils/dateUtils";
import ObjectUtils from "../utils/ObjectUtils";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { urls } from "../utils/urlUtils";
import { BodyPartName } from "./BoodyPartName";

class WidgetLastShot extends Component {
  state = {
    data: {}
  };

  componentDidMount = () => {
    let query = firebaseDatabase
      .ref("shots")
      .orderByChild("date")
      .limitToLast(1);
    query.on("value", snap => {
      let dataReceived = snap.val();
      for (const key in dataReceived) {
        this.setState({ data: dataReceived[key] });
        break;
      }
    });
  };

  computeLastDate = () => {
    if (!ObjectUtils.isEmpty(this.state.data)) {
      let lastDate = dateFromTimeStamp(this.state.data.date);
      return lastDate.toLocaleDateString();
    } else {
      return "Never";
    }
  };

  computeDaysSinceLastShot = () => {
    if (!ObjectUtils.isEmpty(this.state.data)) {
      let diffDays = calcDaysElapsedFloor(
        dateFromTimeStamp(this.state.data.date)
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

  render() {
    return (
      <div className="card bg-light">
        <div className="card-body">
          <h5 className="card-title my-2">Última Injeção</h5>{" "}
          {!ObjectUtils.isEmpty(this.state.data) && (
            <React.Fragment>
              <div className="card-subtitle">
                {this.computeLastDate()}{" "}
                <small className="text-muted">
                  {this.computeDaysSinceLastShot()}
                </small>
              </div>
              <ul className="list-group bg-light my-2 small">
                <li className="list-group-item disabled">
                  Local:{" "}
                  <strong>
                    <BodyPartName
                      part={this.state.data.bodyPart}
                      parts={this.props.bodyParts}
                    />
                  </strong>
                </li>
                <li className="list-group-item disabled">
                  Lote: <strong> {this.state.data.batchNumber}</strong>
                </li>
                <li className="list-group-item disabled">
                  Validade: <strong> {this.state.data.cadVal}</strong>
                </li>
              </ul>
            </React.Fragment>
          )}
          {ObjectUtils.isEmpty(this.state.data) && (
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
            {!ObjectUtils.isEmpty(this.state.data) && (
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
  }
}

export default WidgetLastShot;

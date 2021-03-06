import React, { Component } from "react";
import { firebaseDatabase } from "../utils/firebaseUtils";
import { getDateAsString } from "../utils/dateUtils";
import { Alert } from "reactstrap";
import { CadValDisplay } from "./CadValDisplay";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { urls } from "../utils/urlUtils";

class WidgetCurrentPrescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loading: true,
      loaded: false
    };
  }

  isDataEmpty = () => {
    return (
      Object.keys(this.state.data).length === 0 &&
      this.state.data.constructor === Object
    );
  };

  componentDidMount = () => {
    this.setState({ loading: true });
    let query = firebaseDatabase
      .ref("prescriptions")
      .orderByChild("dateCollected")
      .limitToFirst(1);
    query.on("value", snap => {
      let dataReceived = snap.val();
      for (const key in dataReceived) {
        this.setState({ data: dataReceived[key], loading: false });
        break;
      }
    });
  };

  render() {
    return (
      <div className={this.props.className + " card bg-light"}>
        <div className="card-body">
          <h5 className="card-title">Prescrição Actual</h5>
          {this.state.loading && (
            <Alert color="secondary">
              A obter dados. Por favor, aguarde...
            </Alert>
          )}

          {!this.state.loading &&
            !this.isDataEmpty() && (
              <ul className="list-group bg-light">
                <li className="list-group-item">
                  Injeções: <strong> {this.state.data.numberOfShots}</strong>
                  <span className="badge badge-pill badge-success float-right">
                    {this.state.data.shotsAvailable + " Disponívies"}
                  </span>
                </li>
                <li className="list-group-item disabled small">
                  Data:{" "}
                  <strong>
                    {getDateAsString(this.state.data.dateCollected)}
                  </strong>
                </li>
                <li className="list-group-item disabled small">
                  Lote: <strong>{this.state.data.batchNumber}</strong>
                </li>
                <li className="list-group-item disabled small">
                  Cad./Val.:{" "}
                  <strong>
                    <CadValDisplay
                      className="text-info"
                      month={this.state.data.expirationMonth}
                      year={this.state.data.expirationYear}
                    />
                  </strong>
                </li>
              </ul>
            )}
          {!this.state.loading &&
            this.isDataEmpty() && (
              <React.Fragment>
                <h6 className="card-subtitle my-2 text-muted">
                  Nenhuma prescrição encontrada.
                </h6>
                <p className="card-text">
                  Por favor, insira uma nova prescrição usando o botão abaixo.
                </p>
              </React.Fragment>
            )}
        </div>
        <div className="card-body text-center">
          <div className="btn-group" role="group">
            <Button
              color="primary"
              tag={props => (
                <Link to={urls.inputPrescriptions.path} {...props} />
              )}
            >
              {urls.inputPrescriptions.name}
            </Button>
            {!this.isDataEmpty() && (
              <Button
                color="secondary"
                tag={props => <Link to={urls.prescriptions.path} {...props} />}
              >
                {urls.prescriptions.name}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default WidgetCurrentPrescription;

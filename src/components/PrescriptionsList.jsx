import React, { Component } from "react";
import { ButtonGroup, Button, Alert, Table } from "reactstrap";
import ObjectUtils from "../utils/ObjectUtils";
import FirebaseService from "../utils/FirebaseService";
import { CadValDisplay } from "./CadValDisplay";
import { getDateAsString } from "../utils/dateUtils";
import { firebaseDatabase } from "../utils/firebaseUtils";
import { Link } from "react-router-dom";
import { urls } from "../utils/urlUtils";
import LoadingAlert from "./LoadingAlert";
import ModalConfirm from "./ModalConfirm";

class PrescriptionsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "ALL",
      dataLoading: false,
      dataLoaded: false,
      modalDeleteShown: false,
      data: {},
      modalData: {}
    };
    this.confirmDelete = this.confirmDelete.bind(this);
    this.toggle = this.toggle.bind(this);
    this.deletePrescription = this.deletePrescription.bind(this);
  }

  fetchData = (filter, callBackFn) => {
    const nodePath = "prescriptions";

    if (filter === "ALL") {
      FirebaseService.getDataList(nodePath, dataReceived =>
        callBackFn(dataReceived)
      );
    } else if (filter === "AVAILABLE") {
      firebaseDatabase
        .ref(nodePath)
        .orderByChild("shotsAvailable")
        .startAt(1)
        .on("value", dataSnapshot => {
          let items = FirebaseService.buildDataArray(dataSnapshot);
          callBackFn(items);
        });
    } else if (filter === "DEPLETED") {
      firebaseDatabase
        .ref(nodePath)
        .orderByChild("shotsAvailable")
        .endAt(0)
        .on("value", dataSnapshot => {
          let items = FirebaseService.buildDataArray(dataSnapshot);
          callBackFn(items);
        });
    }
  };

  componentDidMount = () => {
    this.setState({ dataLoading: true, dataLoaded: false });
    this.fetchData(this.state.filter, dataReceived => {
      this.setState(
        {
          data: dataReceived,
          dataLoading: false,
          dataLoaded: true
        },
        () => console.log(this.state)
      );
    });
  };

  onRadioBtnClick = newFilter => {
    this.fetchData(newFilter, dataReceived => {
      this.setState({
        filter: newFilter,
        data: dataReceived,
        dataLoading: false,
        dataLoaded: true
      });
    });
  };

  confirmDelete(data) {
    this.setState({
      modalDeleteShown: true,
      modalData: data
    });
  }

  toggle() {
    this.setState({
      modalDeleteShown: !this.state.modalDeleteShown
    });
  }

  deletePrescription() {
    console.log(this.state.modalData);
    FirebaseService.remove("prescriptions", this.state.modalData.key).then(
      () => {
        this.setState({
          modalDeleteShown: false,
          modalData: {}
        });
      }
    );
  }

  render() {
    return (
      <React.Fragment>
        <div className="my-3 clearfix">
          <h5 className="float-left">Lista de Prescrições</h5>
          <div className="float-right">
            <Button
              color="primary"
              tag={props => (
                <Link to={urls.inputPrescriptions.path} {...props} />
              )}
            >
              {urls.inputPrescriptions.name}
            </Button>
          </div>
        </div>
        <div className="my-3 clearfix">
          <span className="h6">Ver apenas:</span>
          <ButtonGroup className="ml-3">
            <Button
              color="secondary"
              onClick={() => this.onRadioBtnClick("ALL")}
              active={this.state.filter === "ALL"}
            >
              Tudo
            </Button>
            <Button
              color="secondary"
              onClick={() => this.onRadioBtnClick("AVAILABLE")}
              active={this.state.filter === "AVAILABLE"}
            >
              Disponíveis
            </Button>
            <Button
              color="secondary"
              onClick={() => this.onRadioBtnClick("DEPLETED")}
              active={this.state.filter === "DEPLETED"}
            >
              Esgotados
            </Button>
          </ButtonGroup>
        </div>
        {this.state.dataLoading && (
          <LoadingAlert msg="A carregar dados. Por favor, aguarde..." />
        )}
        {this.state.dataLoaded &&
          ObjectUtils.isEmpty(this.state.data) && (
            <React.Fragment>
              <hr />
              <Alert color="warning">
                Nenhuma prescrição encontrada. Por favor, insira uma nova
                prescrição.
              </Alert>
            </React.Fragment>
          )}
        {this.state.dataLoaded &&
          !ObjectUtils.isEmpty(this.state.data) && (
            <Table hover>
              <thead>
                <tr>
                  <th>Data Recolha</th>
                  <th>Lote #</th>
                  <th>Validade</th>
                  <th>Disponíveis</th>
                  <th>Total</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.state.data.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td>{getDateAsString(value.dateCollected)}</td>
                      <td>{value.batchNumber}</td>
                      <td>
                        <CadValDisplay
                          month={value.expirationMonth}
                          year={value.expirationYear}
                        />
                      </td>
                      <td>{value.shotsAvailable}</td>
                      <td>{value.numberOfShots}</td>
                      <td align="right">
                        <Button
                          size="sm"
                          color="secondary"
                          tag={props => (
                            <Link
                              to={
                                urls.editPrescription.pathWithoutParam +
                                value.key
                              }
                              {...props}
                            />
                          )}
                        >
                          Editar
                        </Button>
                        <Button
                          color="danger"
                          size="sm"
                          className="ml-3"
                          onClick={() => this.confirmDelete(value)}
                        >
                          Apagar
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="6" />
                </tr>
              </tfoot>
            </Table>
          )}

        <ModalConfirm
          open={this.state.modalDeleteShown}
          title="Apagar prescrição"
          destructive={true}
          handleConfirmSelection={this.deletePrescription}
          handleCancelSelection={this.toggle}
        >
          Apagar prescrição obtida a{" "}
          {getDateAsString(this.state.modalData.dateCollected)}
          <br /> Lote: <strong>{this.state.modalData.batchNumber}</strong>
          <br /> Validade:{" "}
          <strong>
            <CadValDisplay
              month={this.state.modalData.expirationMonth}
              year={this.state.modalData.expirationYear}
            />
          </strong>
        </ModalConfirm>
      </React.Fragment>
    );
  }
}

export default PrescriptionsList;

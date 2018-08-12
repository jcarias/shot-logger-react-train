import React, { Component } from "react";
import { ButtonGroup, Button, Alert, Table } from "reactstrap";
import ObjectUtils from "../utils/ObjectUtils";
import FirebaseService from "../utils/FirebaseService";
import { CadValDisplay } from "./CadValDisplay";
import { getDateAsString } from "../utils/dateUtils";
import { firebaseDatabase } from "../utils/firebaseUtils";

class PrescriptionsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "ALL",
      dataLoading: false,
      dataLoaded: false,
      data: {}
    };
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

  render() {
    return (
      <React.Fragment>
        <div className="my-3 clearfix">
          <h5 className="float-left">Lista de Prescrições</h5>
          <div className="float-right">
            <Button color="primary" className="ml-3">
              Adicionar Prescrição
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
          <Alert color="primary">A carregar dados. Por favor, aguarde...</Alert>
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
      </React.Fragment>
    );
  }
}

export default PrescriptionsList;

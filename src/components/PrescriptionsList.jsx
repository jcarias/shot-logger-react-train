import React, { Component } from "react";
import { ButtonGroup, Button, Alert } from "reactstrap";
import ObjectUtils from "../utils/ObjectUtils";
import FirebaseService from "../utils/FirebaseService";

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

  componentDidMount = () => {
    this.setState({ dataLoading: true, dataLoaded: false });
    FirebaseService.getDataList("prescriptions", dataReceived => {
      this.setState({
        data: dataReceived,
        dataLoading: false,
        dataLoaded: true
      });
    });
  };
  onRadioBtnClick(filter) {
    this.setState({ filter });
  }

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
            <Alert color="warning">
              Nenhuma prescrição encontrada. Por favor, insira uma nova
              prescrição.
            </Alert>
          )}
        {this.state.dataLoaded &&
          !ObjectUtils.isEmpty(this.state.data) && (
            <Alert color="secondary">Adicionar a tabela aqui!</Alert>
          )}
      </React.Fragment>
    );
  }
}

export default PrescriptionsList;

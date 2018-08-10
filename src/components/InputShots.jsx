import React, { Component } from "react";
import ObjectUtils from "../utils/ObjectUtils";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import FirebaseService from "../utils/FirebaseService";
import { MonthYearInput } from "./MontYearInput";
import YearSelect from "./YearSelect";
import { getDateAsString, getTimeAsString } from "../utils/dateUtils";

class InputShots extends Component {
  constructor(props) {
    super(props);

    if (ObjectUtils.isEmpty(this.props.data)) {
      this.state = {
        date: new Date(),
        time: undefined,
        bodyPart: undefined,
        batchNumber: undefined,
        key: undefined,
        cadVal: null
      };
    }
  }

  componentDidMount = () => {
    if (!ObjectUtils.isEmpty(this.props.location.state)) {
      const { data } = this.props.location.state;
      let shotToEdit = {
        key: data.key,
        date: getDateAsString(data.date),
        time: getTimeAsString(data.date),
        batchNumber: data.batchNumber,
        bodyPart: data.bodyPart,
        cadVal: data.cadVal,
        cadVal_month: data.cadVal.split("/")[0],
        cadVal_year: data.cadVal.split("/")[1]
      };

      this.setState({ ...shotToEdit });
    }

    FirebaseService.getDataList("bodyParts", bodyPartsData => {
      this.setState({ bodyParts: bodyPartsData });
    });

    FirebaseService.getDataList("prescriptions", prescriptionsData => {
      this.setState({ prescriptions: prescriptionsData });
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  isValid = () => {
    return true;
  };

  handleSaveBtn = () => {
    let date = new Date(this.state.date);
    if (this.state.time && this.state.time.indexOf(":") > -1) {
      date.setHours(this.state.time.split(":")[0]);
      date.setMinutes(this.state.time.split(":")[1]);
    }

    if (this.isValid()) {
      let objectToSubmit = {
        date: date.getTime(),
        bodyPart: this.state.bodyPart,
        batchNumber: this.state.batchNumber,
        cadVal: this.state.cadVal_month + "/" + this.state.cadVal_year
      };

      if (this.state.key) {
        FirebaseService.updateData("shots", this.state.key, objectToSubmit);
      } else {
        FirebaseService.pushData("shots", objectToSubmit);
      }

      this.props.history.goBack();
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="card bg-light my-3">
          <div className="card-header">
            <div className="clearfix">
              <h3 className="float-left">
                {this.state.key != null ? "Editar" : "Adicionar Nova"} Injeção
              </h3>
              <div className="float-right">
                <Button onClick={this.props.history.goBack}>Voltar</Button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <Form>
              <FormGroup>
                <Label for="date">Data:</Label>
                <Input
                  type="date"
                  name="date"
                  id="date"
                  placeholder="Data da aplicação"
                  value={this.state.date}
                  onChange={this.handleChange("date")}
                />
              </FormGroup>
              <FormGroup>
                <Label for="time">Hora:</Label>
                <Input
                  type="time"
                  name="time"
                  id="time"
                  placeholder="Hora da aplicação"
                  value={this.state.time}
                  onChange={this.handleChange("time")}
                />
              </FormGroup>
              <FormGroup>
                <Label for="bodyPart">Local:</Label>
                {this.state.bodyParts && (
                  <select
                    className="form-control"
                    id="bodyPart"
                    value={this.state.bodyPart}
                    onChange={this.handleChange("bodyPart")}
                  >
                    <option key={-1} value={undefined}>
                      Escolha...
                    </option>
                    {this.state.bodyParts.map((value, index) => {
                      return (
                        <option key={index} value={value.key}>
                          {value.name}
                        </option>
                      );
                    })}
                  </select>
                )}
              </FormGroup>

              <FormGroup>
                <Label for="prescrioptions">Prescrições disponíveis:</Label>
                {this.state.prescriptions &&
                  !ObjectUtils.isEmpty(this.state.prescriptions) && (
                    <select
                      className="form-control"
                      id="bodyPart"
                      value={this.state.prescription}
                      onChange={this.handleChange("prescription")}
                    >
                      <option key={-1} value={undefined}>
                        Escolha...
                      </option>
                      {this.state.prescriptions.map((value, index) => {
                        return (
                          <option key={index} value={value.key}>
                            {value.batchNumber}
                          </option>
                        );
                      })}
                    </select>
                  )}
                {this.state.prescriptions &&
                  ObjectUtils.isEmpty(this.state.prescriptions) && (
                    <span className="ml-3 text-muted strong">
                      Sem prescrições disponíveis
                    </span>
                  )}
              </FormGroup>

              <FormGroup>
                <Label for="batchNumber">Lote:</Label>
                <Input
                  type="text"
                  id="batchNumber"
                  name="batchNumber"
                  value={this.state.batchNumber}
                  onChange={this.handleChange("batchNumber")}
                />
              </FormGroup>
              <FormGroup>
                <Label for="cadVal">Validade:</Label>
                <MonthYearInput
                  className="form-control"
                  value={this.state.cadVal_month}
                  handleChangeEvent={this.handleChange("cadVal_month")}
                />

                <YearSelect
                  className="form-control"
                  value={this.state.cadVal_year}
                  intervalSize={3}
                  handleChangeEvent={this.handleChange("cadVal_year")}
                />
              </FormGroup>
              <Button color="primary" onClick={this.handleSaveBtn}>
                Gravar
              </Button>
              <Button className="ml-3" onClick={this.props.history.goBack}>
                Cancelar
              </Button>
            </Form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default InputShots;

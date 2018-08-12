import React, { Component } from "react";
import { getDateAsString } from "../utils/dateUtils";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col
} from "reactstrap";
import { MonthYearInput } from "./MontYearInput";
import YearSelect from "./YearSelect";
import { FaArrowAltCircleLeft, FaCheck, FaTimes } from "react-icons/fa";
import FirebaseService from "../utils/FirebaseService";

class InputPrescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateCollected: getDateAsString(new Date()),
      batchNumber: "",
      expirationMonth: 0,
      expirationYear: new Date().getFullYear() + 3,
      numberOfShots: 4,
      shotsAvailable: 4
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount = () => {
    const { id } = this.props.match.params;

    if (!(id === undefined || !id)) {
      this.setState({ id });
      FirebaseService.getUniqueDataBy("prescriptions", id, data =>
        this.setState({ ...data }, () => console.log(this.state))
      );
    }
  };

  handleChange(event) {
    if (event) {
      this.setState({
        [event.target.name]: event.target.value
      });

      if (event.target.name === "numberOfShots" && !this.state.id) {
        this.setState({
          shotsAvailable: event.target.value
        });
      }
    }
  }

  handleChangeSpecial = name => event => {
    if (event) {
      this.setState({ [name]: event.target.value });
    }
  };

  handleFormSubmit() {
    let objectToSubmit = {
      dateCollected: this.state.dateCollected,
      batchNumber: this.state.batchNumber,
      expirationMonth: this.state.expirationMonth,
      expirationYear: this.state.expirationYear,
      numberOfShots: this.state.numberOfShots,
      shotsAvailable: this.state.shotsAvailable
    };

    if (this.state.id) {
      FirebaseService.updateData(
        "prescriptions",
        this.state.id,
        objectToSubmit
      );
    } else {
      FirebaseService.pushData("prescriptions", objectToSubmit);
    }
    this.props.history.goBack();
  }

  render() {
    return (
      <Card color="light" className="my-3">
        <CardHeader>
          <div className="clearfix">
            <h3 className="float-left">
              {this.state.id != null ? "Editar" : "Adicionar Nova"} Prescrição
            </h3>
            <div className="float-right">
              <Button onClick={this.props.history.goBack}>
                <FaArrowAltCircleLeft /> Voltar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <Form>
            <FormGroup>
              <Label for="dateCollected">Data obtenção</Label>
              <Input
                id="dateCollected"
                name="dateCollected"
                type="date"
                value={this.state.dateCollected}
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="batchNumber">No. Lote</Label>
              <Input
                id="batchNumber"
                name="batchNumber"
                type="text"
                value={this.state.batchNumber}
                onChange={this.handleChange}
              />
            </FormGroup>
            <Row>
              <Col sm="6">
                <FormGroup>
                  <Label for="expirationMonth">Validade (Mês):</Label>
                  <MonthYearInput
                    id="expirationMonth"
                    name="expirationMonth"
                    className="form-control"
                    value={this.state.cadVal_month}
                    handleChangeEvent={this.handleChangeSpecial(
                      "expirationMonth"
                    )}
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="expirationYear">Validade (Ano):</Label>
                  <YearSelect
                    id="expirationYear"
                    className="form-control"
                    value={this.state.expirationYear}
                    intervalSize={3}
                    handleChangeEvent={this.handleChangeSpecial(
                      "expirationYear"
                    )}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <FormGroup>
                  <Label for="numberOfShots">Total Injeções:</Label>
                  <Input
                    id="numberOfShots"
                    name="numberOfShots"
                    type="number"
                    className="form-control"
                    value={this.state.numberOfShots}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="shotsAvailable">Injeções Disponíveis:</Label>
                  <Input
                    id="shotsAvailable"
                    name="shotsAvailable"
                    type="number"
                    className="form-control"
                    readOnly={true}
                    value={this.state.shotsAvailable}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <div className="float-right">
              <Button onClick={this.handleFormSubmit} color="primary">
                Gravar <FaCheck />
              </Button>
              <Button onClick={this.props.history.goBack} className="ml-3">
                Cancelar <FaTimes />
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

export default InputPrescription;

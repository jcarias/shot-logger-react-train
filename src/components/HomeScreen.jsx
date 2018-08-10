import React, { Component } from "react";
import WidgetLastShot from "./WidgetLastShot";
import WidgetCurrentPrescription from "./WidgetCurrentPrescription";
import { Row, Col } from "reactstrap";
import FirebaseService from "../utils/FirebaseService";
import ObjectUtils from "../utils/ObjectUtils";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    FirebaseService.getDataList("bodyParts", shotsData => {
      this.setState({ bodyParts: shotsData });
    });
  };

  getBodyPartName = bodyPart => {
    if (!ObjectUtils.isEmpty(this.state.bodyParts)) {
      let found = this.state.bodyParts.find(function(val) {
        return val.key === bodyPart;
      });
      return found ? (
        found.name
      ) : (
        <span className="badge badge-pill badge-warning">Desconhecido</span>
      );
    } else {
      return bodyPart;
    }
  };

  render() {
    return (
      <React.Fragment>
        <Row className="my-4">
          <Col>
            <WidgetLastShot bodyParts={this.state.bodyParts} />
          </Col>

          <Col>
            <WidgetCurrentPrescription />
          </Col>
        </Row>

        <Row>
          <Col>&lt;Tabela com as últimas 5 injeções&gt;</Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default HomeScreen;

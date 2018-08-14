import React, { Component } from "react";
import WidgetLastShot from "./WidgetLastShot";
import WidgetCurrentPrescription from "./WidgetCurrentPrescription";
import { Row, Col } from "reactstrap";
import FirebaseService from "../utils/FirebaseService";
import ObjectUtils from "../utils/ObjectUtils";
import { firebaseDatabase } from "../utils/firebaseUtils";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.fetchBodyParts = this.fetchBodyParts.bind(this);
    this.fetchLastShot = this.fetchLastShot.bind(this);
  }

  fetchBodyParts = () => {
    FirebaseService.getDataList("bodyParts", shotsData => {
      this.setState({ bodyParts: shotsData });
    });
  };

  fetchLastShot = () => {
    let query = firebaseDatabase
      .ref("shots")
      .orderByChild("date")
      .limitToLast(1);
    query.on("value", snap => {
      let dataReceived = snap.val();
      for (const key in dataReceived) {
        this.setState({ lastShotData: dataReceived[key] });
        break;
      }
    });
  };

  componentDidMount = () => {
    this.fetchBodyParts();
    this.fetchLastShot();
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
        <Row>
          <Col>
            <WidgetLastShot
              className="mt-4"
              bodyParts={this.state.bodyParts}
              lastShotData={this.state.lastShotData}
            />
          </Col>

          <Col>
            <WidgetCurrentPrescription className="mt-4" />
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

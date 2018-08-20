import React, { Component } from "react";
import WidgetLastShot from "./WidgetLastShot";
import WidgetCurrentPrescription from "./WidgetCurrentPrescription";
import { Row, Col } from "reactstrap";
import FirebaseService from "../utils/FirebaseService";
import ObjectUtils from "../utils/ObjectUtils";
import { firebaseDatabase } from "../utils/firebaseUtils";
import { AggregateWidget } from "./AggregateWidget";
import { FaSyringe, FaClock, FaMedkit, FaClipboardCheck } from "react-icons/fa";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalShots: 0,
      lastShotDate: "Nenhuma encontrada.",
      daysSinceLastShot: "Never",
      availableShots: {
        total: 0,
        status: "info",
        additionalInfo: ""
      },
      totalShots: 0,
      availablePrescriptions: 0
    };

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
    this.buildShotsAggregate();
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

  buildShotsAggregate() {
    FirebaseService.getDataList("shots", shotsData => {
      console.log(shotsData);
      this.setState({
        totalShots: shotsData.length
      });
    });
  }

  render() {
    return (
      <React.Fragment>
        <Row className="mt-4">
          <Col>
            <AggregateWidget
              icon={<FaSyringe className="mr-1" />}
              className="border rounded text-info border-info p-3"
              title="Total Injeções"
              value={this.state.totalShots}
              info={
                <React.Fragment>
                  Ver <a href="/shot-list">lista...</a>
                </React.Fragment>
              }
            />
          </Col>
          <Col>
            <AggregateWidget
              icon={<FaClock />}
              className="border rounded text-info border-info p-3"
              title="Última injeção"
              value={this.state.daysSinceLastShot}
              info={this.state.lastShotDate}
            />
          </Col>
          <Col>
            <AggregateWidget
              icon={<FaClipboardCheck />}
              className="border rounded text-info border-info p-3"
              title="Injeções disponíveis"
              value={this.state.daysSinceLastShot}
              info={this.state.lastShotDate}
            />
          </Col>{" "}
          <Col>
            <AggregateWidget
              icon={<FaMedkit />}
              className="border rounded text-info border-info p-3"
              title="Prescrições Médicas"
              value={this.state.daysSinceLastShot}
              info={this.state.lastShotDate}
            />
          </Col>
        </Row>
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
      </React.Fragment>
    );
  }
}

export default HomeScreen;

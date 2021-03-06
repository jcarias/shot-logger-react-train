import React, { Component } from "react";
import "./App.css";
import { Container } from "reactstrap";
import SLNavbar from "./components/SLNavbar";
import HomeScreen from "./components/HomeScreen";
import ShotsList from "./components/ShotsList";
import { Route } from "react-router-dom";
import { urls } from "./utils/urlUtils";
import InputShots from "./components/InputShots";
import PrescriptionsList from "./components/PrescriptionsList";
import InputPrescription from "./components/InputPrescription";
import CameraTest from "./components/CameraTest";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <Container>
          <SLNavbar />

          <Route
            exact={true}
            path={urls.home.path}
            render={props => <HomeScreen {...props} />}
          />
          <Route
            exact={true}
            path={urls.shotList.path}
            render={props => <ShotsList {...props} />}
          />
          <Route
            exact={true}
            path={urls.inputShot.path}
            render={props => {
              return <InputShots {...props} />;
            }}
          />
          <Route
            exact={true}
            path={urls.prescriptions.path}
            render={props => {
              return <PrescriptionsList {...props} />;
            }}
          />
          <Route
            exact={true}
            path={urls.inputPrescriptions.path}
            render={props => {
              return <InputPrescription {...props} />;
            }}
          />
          <Route
            exact={true}
            path={urls.editPrescription.path}
            render={props => {
              return <InputPrescription {...props} />;
            }}
          />
          <Route
            exact={true}
            path={urls.photoBooth.path}
            render={props => {
              return <CameraTest {...props} />;
            }}
          />
        </Container>
      </React.Fragment>
    );
  }
}

export default App;

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
        </Container>
      </React.Fragment>
    );
  }
}

export default App;

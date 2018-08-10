import React from "react";
import { Alert } from "reactstrap";
import logo from "../logo.svg";

export function LoadingAlert(props) {
  return (
    <Alert color={props.color || "primary"} className="clearfix">
      <img src={logo} className="App-logo small float-left" alt="react logo" />
      <span className="float-left">{props.msg}</span>
    </Alert>
  );
}

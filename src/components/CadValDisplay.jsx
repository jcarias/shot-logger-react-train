import { getMonthName } from "../utils/dateUtils";
import React from "react";

export function CadValDisplay(props) {
  return (
    <span className={props.className}>
      {getMonthName(props.month) + "/" + props.year}
    </span>
  );
}

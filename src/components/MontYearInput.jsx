import React from "react";
import { months } from "../utils/dateUtils";

export function MonthYearInput(props) {
  return (
    <select
      className={props.className}
      onChange={props.handleChangeEvent}
      value={props.value}
    >
      {months.map((month, index) => {
        return (
          <option key={index} value={month.value}>
            {month.name}
          </option>
        );
      })}
    </select>
  );
}

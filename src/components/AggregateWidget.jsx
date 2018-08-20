import React from "react";

export const AggregateWidget = props => {
  return (
    <div>
      <p>{props.title}</p>
      <h1>{props.value}</h1>
      <p className="small">{props.delta}</p>
    </div>
  );
};

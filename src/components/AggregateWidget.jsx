import React from "react";

export const AggregateWidget = props => {
  return (
    <div className={props.className}>
      <span>{props.title}</span>
      <h1 className="clearfix">
        <span className="float-left">{props.icon}</span>
        <span className="float-right">{props.value}</span>
      </h1>
      <span className="small text-muted">{props.info}</span>
    </div>
  );
};

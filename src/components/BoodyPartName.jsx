import React from "react";
import ObjectUtils from "../utils/ObjectUtils";

export function BodyPartName(props) {
  const { part: bodyPart, parts: bodyParts } = props;

  const getBodyPartName = bodyPart => {
    if (!ObjectUtils.isEmpty(bodyParts)) {
      let found = bodyParts.find(function(val) {
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

  return getBodyPartName(bodyPart);
}

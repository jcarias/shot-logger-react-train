import React, { Component } from "react";
import FirebaseService from "../utils/FirebaseService";
import ObjectUtils from "../utils/ObjectUtils";
import { getDateAsString, getTimeAsString } from "../utils/dateUtils";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { urls } from "../utils/urlUtils";
import { firebaseDatabase } from "../utils/firebaseUtils";
import { BodyPartName } from "./BoodyPartName";
import { getMonthName } from "../utils/dateUtils";
import { CadValDisplay } from "./CadValDisplay";

class ShotsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteConfirm: {
        isOpen: false
      }
    };
  }

  fetchData = callback => {
    const nodePath = "shots";
    let query = firebaseDatabase.ref(nodePath);
    query.on("value", dataSnapshot => {
      let items = [];
      dataSnapshot.forEach(childSnapshot => {
        let item = childSnapshot.val();
        item["key"] = childSnapshot.key;
        items.push(item);
      });

      let sorted = items.sort((a, b) => a.date < b.date);

      callback(sorted);
    });
  };

  componentDidMount = () => {
    if (ObjectUtils.isEmpty(this.props.bodyParts)) {
      FirebaseService.getDataList("bodyParts", shotsData => {
        this.setState({ bodyParts: shotsData });
      });
    }

    this.fetchData(shotsData => {
      this.setState({ data: shotsData });
    });
  };

  deleteShot = shot => {
    FirebaseService.remove("shots", shot.key);
  };

  render() {
    return (
      <React.Fragment>
        <div className="my-3 clearfix">
          <h5 className="float-left">Lista de Injeções</h5>
          <div className="float-right">
            <Button
              color="primary"
              tag={props => <Link to={urls.inputShot.path} {...props} />}
            >
              {urls.inputShot.name}
            </Button>
          </div>
        </div>

        {ObjectUtils.isEmpty(this.state) && (
          <div className="alert alert-primary" role="alert">
            A obter dados, por favor aguarde...
          </div>
        )}

        {this.state.data &&
          ObjectUtils.isEmpty(this.state.data) && (
            <div className="alert alert-secondary" role="alert">
              Não foram encontrados dados.
            </div>
          )}

        {!ObjectUtils.isEmpty(this.state.data) &&
          this.state.data.length > 0 && (
            <table className="table table-hover mt-4">
              <thead>
                <tr>
                  <th scope="col" className="text-center">
                    Data
                  </th>
                  <th scope="col" className="text-center">
                    Hora
                  </th>
                  <th scope="col">Local</th>
                  <th scope="col" className="text-center">
                    Lote
                  </th>
                  <th scope="col" className="text-center">
                    Validade
                  </th>
                  <th scope="col" />
                </tr>
              </thead>
              <tbody>
                {this.state.data.map((value, key) => (
                  <tr key={key}>
                    <td className="text-center">
                      {getDateAsString(value.date)}
                    </td>
                    <td className="text-center">
                      {getTimeAsString(value.date)}
                    </td>
                    <td>
                      <BodyPartName
                        part={value.bodyPart}
                        parts={this.state.bodyParts}
                      />
                    </td>
                    <td className="text-center">{value.batchNumber}</td>
                    <td className="text-center">
                      <CadValDisplay
                        month={value.cadVal.split("/")[0]}
                        year={value.cadVal.split("/")[1]}
                      />
                    </td>
                    <td className="text-right">
                      <Button
                        color="secondary"
                        className="btn-sm"
                        tag={props => (
                          <Link
                            to={{
                              pathname: urls.inputShot.path,
                              state: {
                                data: value
                              }
                            }}
                            {...props}
                          />
                        )}
                      >
                        Editar
                      </Button>
                      <button
                        className="btn btn-danger btn-sm ml-2"
                        onClick={() => this.deleteShot(value)}
                      >
                        Apagar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </React.Fragment>
    );
  }
}

export default ShotsList;

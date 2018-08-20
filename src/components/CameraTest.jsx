import React, { Component } from "react";
import Camera, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { Container, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";

class CameraTest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: [],
      config: {
        idealFacingMode: FACING_MODES.USER,
        idealResolution: { width: 525, height: 331 },
        imageType: IMAGE_TYPES.JPG,
        imageCompression: 0.97,
        isMaxResolution: false,
        isImageMirror: false,
        isDisplayStartCameraError: true,
        sizeFactor: 1,
        controlsEnabled: false
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleBooleanChange = this.handleBooleanChange.bind(this);
  }

  onTakePhoto(dataUri) {
    let newPhotoData = {
      timeStamp: new Date(),
      imageData: dataUri
    };
    this.setState({ photos: [...this.state.photos, newPhotoData] });
  }

  onCameraError(error) {
    this.setState({
      config: {
        ...this.state.config,
        controlsEnabled: false
      }
    });
    console.error("onCameraError", error);
  }

  onCameraStart(stream) {
    console.log("onCameraStart");
    this.setState({
      config: {
        ...this.state.config,
        controlsEnabled: true
      }
    });
  }

  onCameraStop() {
    console.log("onCameraStop");
    this.setState({
      config: {
        ...this.state.config,
        controlsEnabled: false
      }
    });
  }

  handleChange(event) {
    if (event) {
      this.setState({
        config: {
          ...this.state.config,
          [event.target.name]: event.target.value
        }
      });
    }
  }

  handleBooleanChange(event) {
    if (event) {
      this.setState({
        config: {
          ...this.state.config,
          [event.target.name]: event.target.value === "true"
        }
      });
    }
  }

  listItems = () => {
    return (
      <React.Fragment>
        {this.state.photos.length > 0 &&
          this.state.photos.map((photoData, index) => (
            <div
              key={index}
              className="thumbnail"
              style={{ display: "inline-block" }}
            >
              <img
                src={photoData.imageData}
                width="160"
                height="120"
                className="img-thumbnail"
                alt="Foto"
              />
              <div className="caption">
                <p>{photoData.timeStamp.toLocaleString()}</p>
              </div>
            </div>
          ))}
      </React.Fragment>
    );
  };

  render() {
    return (
      <Container>
        <Row>
          <Col xs="6">
            <h4>Camera</h4>
            <Camera
              onTakePhoto={dataUri => {
                this.onTakePhoto(dataUri);
              }}
              onCameraError={error => {
                this.onCameraError(error);
              }}
              idealFacingMode={this.state.config.idealFacingMode}
              idealResolution={this.state.config.idealResolution}
              imageType={this.state.config.imageType}
              imageCompression={this.state.config.imageCompression}
              isMaxResolution={this.state.config.isMaxResolution}
              isImageMirror={this.state.config.isImageMirror}
              isDisplayStartCameraError={
                this.state.config.isDisplayStartCameraError
              }
              sizeFactor={this.state.config.sizeFactor}
              onCameraStart={stream => {
                this.onCameraStart(stream);
              }}
              onCameraStop={() => {
                this.onCameraStop();
              }}
            />
          </Col>
          <Col>
            <h4>Definições</h4>
            <Form>
              <FormGroup row>
                <Label for="idealFacingMode" sm={6}>
                  idealFacingMode
                </Label>
                <Col sm={6}>
                  <Input
                    type="select"
                    name="idealFacingMode"
                    id="idealFacingMode"
                    value={this.state.config.idealFacingMode}
                    onChange={this.handleChange}
                    disabled={!this.state.config.controlsEnabled}
                  >
                    <option value={FACING_MODES.USER}>
                      {FACING_MODES.USER}
                    </option>
                    <option value={FACING_MODES.ENVIRONMENT}>
                      {FACING_MODES.ENVIRONMENT}
                    </option>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="imageType" sm={6}>
                  imageType
                </Label>
                <Col sm={6}>
                  <Input
                    type="select"
                    name="imageType"
                    id="imageType"
                    value={this.state.config.imageType}
                    onChange={this.handleChange}
                    disabled={!this.state.config.controlsEnabled}
                  >
                    <option value={IMAGE_TYPES.JPG}>JPG</option>
                    <option value={IMAGE_TYPES.PNG}>PNG</option>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="isImageMirror" sm={6}>
                  isImageMirror
                </Label>
                <Col sm={6}>
                  <Input
                    type="select"
                    name="isImageMirror"
                    id="isImageMirror"
                    value={this.state.config.isImageMirror}
                    onChange={this.handleBooleanChange}
                    disabled={!this.state.config.controlsEnabled}
                  >
                    <option value={true}>Sim</option>
                    <option value={false}>Não</option>
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="isMaxResolution" sm={6}>
                  isMaxResolution
                </Label>
                <Col sm={6}>
                  <Input
                    type="select"
                    name="isMaxResolution"
                    id="isMaxResolution"
                    value={this.state.config.isMaxResolution}
                    onChange={this.handleBooleanChange}
                    disabled={!this.state.config.controlsEnabled}
                  >
                    <option value={true}>Sim</option>
                    <option value={false}>Não</option>
                  </Input>
                </Col>
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4>Fotografias: {this.state.photos.length}</h4>
            {this.state.photos.length > 0 && this.listItems()}{" "}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default CameraTest;

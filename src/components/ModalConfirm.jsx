import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class ModalConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: this.props.open
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <Modal
        isOpen={this.props.open}
        toggle={this.toggle}
        className={this.props.className}
      >
        <ModalHeader toggle={this.toggle}>
          <span className="text-danger">{this.props.title}</span>
        </ModalHeader>
        <ModalBody>{this.props.children}</ModalBody>
        <ModalFooter>
          <Button
            color={this.props.destructive ? "danger" : "primary"}
            onClick={this.props.handleConfirmSelection}
          >
            OK
          </Button>{" "}
          <Button color="secondary" onClick={this.props.handleCancelSelection}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ModalConfirm;

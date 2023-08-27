import React from 'react';
import {Modal, Button} from "react-bootstrap"

const Error = ({modalError,setModalError,mjsError}) => {

  const cerrarModal =()=>{
   setModalError(!modalError);
}

  return (
    <>
      <Modal show={modalError} onHide={cerrarModal} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>No se pudo completar la solicitud.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mjsError === 101 ? "Ya existe un registro con esta informacion." : "Ah ocurrido un inconveniente!. intente nuevamente si persiste comuniquese con un administrador."}
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-danger" onClick={cerrarModal} type="button" >Ok</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
 
export default Error;
import React from 'react';
import { Modal,Card,Button,ListGroup } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

const Ficha = ({mostrarFicha,setMostrarFicha,ficha}) => {

    const cerrarModalFicha =()=>{
        setMostrarFicha(!mostrarFicha)
    }

    return ( 
        <Modal show={mostrarFicha} onHide={cerrarModalFicha}>
            <Modal.Header closeButton>
                { ficha !== undefined ? 
                <Modal.Title> Motivo : {ficha.motivo}</Modal.Title>:
                <Modal.Title>Sin Informacion</Modal.Title>}
            </Modal.Header>
            <Modal.Body>
                <Card border="info">
                    {ficha !== undefined ? 
                        <Card.Body>
                            <Card.Title>Doctor: {ficha.creadoPor} - {ficha.especialidad}</Card.Title>
                                <Card.Text>Descripcion: {ficha.descripcionCaso}  
                                </Card.Text>
                        </Card.Body> : 
                    <Card.Body>
                        <Card.Title><Icon.ExclamationDiamond size={30} /> Sin Informacion.</Card.Title>
                    </Card.Body>}
                </Card>
            </Modal.Body>
            <Modal.Footer>
               <div className='pie'>{ficha !== undefined ? <span className="blockquote-footer">Creado el dia: {ficha.creadoEl.split("T")[0]}</span> : ""}</div> 
                <Button className="btn-danger" onClick={cerrarModalFicha} type="button" >Cerrar</Button>
            </Modal.Footer>
        </Modal>
     );
}
export default Ficha;
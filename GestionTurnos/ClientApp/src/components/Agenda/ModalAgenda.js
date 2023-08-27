import React, { useEffect, useState } from 'react';
import {Button, Modal, Form, FormGroup,Spinner} from "react-bootstrap"
import {usePost} from './../utils/useHTTP'

const modeloAgenda = {
    id : 0,
    activo:false,
}

const ModalAgenda = ({mostrarModal,setMostrarModal,actualizarGrilla,editar,setEditar}) => {
    const [agenda,setAgenda] = useState(modeloAgenda);
    const [turno,setTurno] = useState("");

    const cerrarModal =()=>{
        setMostrarModal(!mostrarModal)  
        setEditar(null)
    }

    const actualizarDatoCheck = (e) => {
        setAgenda(
            { ...agenda, ["activo"]: e.target.checked }
        )
        console.log(agenda)
    }
    const [dataP,pending,errorP,executePost] = usePost("api/agenda/update")

    const enviarDatos = (e) => {
        executePost(agenda)
    }
    useEffect(()=>{
        if(errorP){
            actualizarGrilla(true,dataP);
        }
        if( !errorP && errorP !== undefined){
            actualizarGrilla(false,dataP);
        }
    },[errorP])

    useEffect(()=>{
        if(editar){
            setAgenda(editar)
            setTurno(editar.horaTurno.split(":")[0] + ":"+editar.horaTurno.split(":")[1]+"hs");
        }
        
    },[editar])
    return (  
        <Modal show={mostrarModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
            <Modal.Title>
                Paciente {agenda.apellidoNombre}<br/>
                {agenda.documento}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <p> 
                Motivo {agenda.motivo}<br/> 
                Turno el dia: {agenda.fechaTurno} a las {turno} </p>
                <FormGroup className='mb-3'>
                    <Form.Check type="checkbox"
                        label="Se Presento al turno"
                        name="activo"
                        onChange={(e) => actualizarDatoCheck(e)}
                        checked={agenda.activo} />
                </FormGroup>
            </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button className="btn-danger" onClick={cerrarModal} type="button" >Cancelar</Button>
        {pending ? <Button className="btn-dark" onClick={enviarDatos} type="button" disabled>
        <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/> Procesando... </Button>
        :<Button className="btn-dark" onClick={enviarDatos}  type="button">Confirmar</Button> }
        </Modal.Footer>
    </Modal>
    );
}
 
export default ModalAgenda;
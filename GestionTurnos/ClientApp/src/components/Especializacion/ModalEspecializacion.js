import React, { useEffect, useState } from 'react';
import {Button, Modal, Form, FormGroup,Spinner} from "react-bootstrap"
import {usePut, usePost} from './../utils/useHTTP'

const modeloEspecializacion = {
    id : 0,
    descripcion:"",
    activo:false,
}

const ModalGenero = ({mostrarModal,setMostrarModal,actualizarGrilla,editar,setEditar}) => {
    const [especializacion,setEspecializacion] = useState(modeloEspecializacion);
    const [pending,setPending] = useState(false);

    const actualizarDato = (e) => {
        setEspecializacion(
            { ...especializacion, [e.target.name]: e.target.value}
        )
    }
    const actualizarDatoCheck = (e) => {
        setEspecializacion(
            { ...especializacion, [e.target.name]: e.target.checked }
        )
    }
    const [dataG,pendingG,errorG,executePost] = usePost("api/especializacion/insert")
    const [dataM,pendingM,errorM,executePut]= usePut("api/especializacion/update")

    const enviarDatos = (e)=>{
        if(especializacion.id == 0){
            executePost(especializacion)
        }else{
            executePut(especializacion);
        }
        setEspecializacion(modeloEspecializacion)
    }
    useEffect(()=>{
        if(pendingM || pendingG){
            setPending(true)
        } else{
            setPending(false)
        }
    },[pendingG,pendingM])

    useEffect(()=>{
        if(errorG){
            actualizarGrilla(true,dataG);
        }
        if( !errorG && errorG != undefined){
            actualizarGrilla(false,dataG);
        }
    },[errorG])

    useEffect(()=>{
        if(errorM){
            actualizarGrilla(true,dataM);
        }
        if(!errorM && errorM != undefined){
            actualizarGrilla(false,dataM);
        }
       
    },[errorM])

    useEffect(()=>{
        if(editar != null){
            setEspecializacion(editar)
        }else{
            setEspecializacion(modeloEspecializacion)
        }
    },[editar])

    const cerrarModal =()=>{
        setMostrarModal(!mostrarModal)
        setEditar(null)
    }
    return (  
        <Modal show={mostrarModal} onHide={cerrarModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {especializacion.id == 0 ? "Nueva Especializacion":"Editar Especializacion"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FormGroup>
                        <Form.Label>Descripcion</Form.Label>
                        <Form.Control name="descripcion"
                            onChange={(e) => actualizarDato(e)}
                            value={especializacion.descripcion}
                            autoComplete={'off'}  />
                    </FormGroup>
                    <br/>
                    <FormGroup className='mb-3'>
                        <Form.Check type="checkbox"
                            label="Activo"
                            name="activo"
                            onChange={(e) => actualizarDatoCheck(e)}
                            checked={especializacion.activo} />
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn-danger" onClick={cerrarModal} type="button" >Cancelar</Button>
                {pending ? <Button className="btn-dark" onClick={enviarDatos} type="button" disabled>
                    <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /> Procesando... </Button>
                    : <Button className="btn-dark" onClick={enviarDatos} type="button">Confirmar</Button>}
            </Modal.Footer>
        </Modal>
    );
}
 
export default ModalGenero;
import React, { useEffect, useState } from 'react';
import {Button, Modal, Form, FormGroup,Spinner} from "react-bootstrap"
import {usePut, usePost} from './../utils/useHTTP'

const modeloGenero = {
    id : 0,
    descripcion:"",
    activo:false,
}

const ModalGenero = ({mostrarModal,setMostrarModal,actualizarGrilla,editar,setEditar}) => {
    const [genero,setGenero] = useState(modeloGenero);
    const [pending,setPending] = useState(false);

    const actualizarDato = (e) => {
        setGenero(
            { ...genero, [e.target.name]: e.target.value}
        )
    }
    const actualizarDatoCheck = (e) => {
        setGenero(
            { ...genero, [e.target.name]: e.target.checked }
        )
    }
    const [dataG,pendingG,errorG,executePost] = usePost("api/genero/insert")
    const [dataM,pendingM,errorM,executePut]= usePut("api/genero/update")

    const enviarDatos = (e)=>{
        if(genero.id == 0){
            executePost(genero)
            setGenero(modeloGenero)
        }else{
            executePut(genero);
        }
        setPending(false)
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
            setGenero(editar)
        }else{
            setGenero(modeloGenero)
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
                    {genero.id == 0 ? "Nuevo Genero":"Editar Genero"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FormGroup>
                        <Form.Label>Descripcion</Form.Label>
                        <Form.Control name="descripcion"
                            onChange={(e) => actualizarDato(e)}
                            value={genero.descripcion}
                            autoComplete={'off'} />
                    </FormGroup>
                    <br/>
                    <FormGroup className='mb-3'>
                        <Form.Check type="checkbox"
                            label="Activo"
                            name="activo"
                            onChange={(e) => actualizarDatoCheck(e)}
                            checked={genero.activo} />
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
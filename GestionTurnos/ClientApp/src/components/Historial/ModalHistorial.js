import React,{useState,useEffect} from 'react';
import {Button, Modal, Form, FormGroup, Spinner,InputGroup} from "react-bootstrap"
import {usePut, usePost,useSelect} from './../utils/useHTTP'

const modeloHistorial = {
    id : 0,
    motivo:"",
    descripcionCaso:"",
    pacienteId:0,
} 

const ModalHistorial = ({mostrarModal,setMostrarModal,actualizarGrilla,editar,setEditar,id}) => {
    const [historial,setHistorial] = useState(modeloHistorial);
    const [pending,setPending] = useState(false); 

    const actualizarDato = (e) => {
        setHistorial({ ...historial, [e.target.name]: e.target.value}
        )}

    const [dataG,pendingG,errorG,executePost] = usePost("api/historial/insert")
    const [dataM,pendingM,errorM,executePut]= usePut("api/historial/update")
    
    const enviarDatos = (e)=>{
            if(historial.id == 0){
              executePost(historial)
              setHistorial(modeloHistorial)
              setEditar(null);
            }else{
                executePut(historial);
                setHistorial(modeloHistorial)
                setEditar(null);
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
                setHistorial(editar)
                setHistorial({...editar,'pacienteId': id})
            }else{
                setHistorial(modeloHistorial)
                setHistorial({...historial,'pacienteId': id})
            }
        },[editar,id])
    
        const cerrarModal =()=>{
            setEditar(modeloHistorial)
            setMostrarModal(!mostrarModal)
        }
    return (  
        <Modal show={mostrarModal} onHide={cerrarModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {historial.id == 0 ? "Nuevo Caso":"Editar Caso"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FormGroup>
                        <Form.Label>Motivo de la Consulta</Form.Label>
                        <Form.Control name="motivo"
                            onChange={(e) => actualizarDato(e)}
                            value={historial.motivo}
                            autoComplete={'off'}  />
                    </FormGroup>
                    <FormGroup className='mt-3'>
                        <InputGroup>
                            <InputGroup.Text>Descripcion Caso</InputGroup.Text>
                            <Form.Control as="textarea" aria-label="With textarea"
                                name="descripcionCaso"
                                onChange={(e) => actualizarDato(e)}
                                value={historial.descripcionCaso}
                                autoComplete={'off'}
                                style={{height:'200px'}} />
                        </InputGroup>
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
export default ModalHistorial
import React,{useState,useEffect} from 'react';
import {Button, Modal, Form, FormGroup, Spinner} from "react-bootstrap"
import {usePut, usePost,useSelect} from './../utils/useHTTP'

const modeloPaciente = {
    id : 0,
    documento:"",
    apellidoNombre:"",
    direccion:"",
    telefono:"",
    perfilId:0,
    especializacionId:0,
    generoId:0,
    activo:false,
} 

const ModalPacinte = ({mostrarModal,setMostrarModal,actualizarGrilla,editar,setEditar}) => {
    const [paciente,setPaciente] = useState(modeloPaciente);
    const [pending,setPending] = useState(false); 

    const actualizarDato = (e) => {
        setPaciente(
            { ...paciente, [e.target.name]: e.target.value}
        )}

    const actualizarDatoCheck = (e) => {
        setPaciente(
            { ...paciente, [e.target.name]: e.target.checked }
        )}

        const [dataG,pendingG,errorG,executePost] = usePost("api/paciente/insert")
        const [dataM,pendingM,errorM,executePut]= usePut("api/paciente/update")
        const [genero,islogingGenero,errorGenero] = useSelect({url:"api/genero/list?search="})

        const enviarDatos = (e)=>{
            if(paciente.id == 0){
              executePost(paciente)
              setPaciente(modeloPaciente)
            }else{
                executePut(paciente);
                setPaciente(modeloPaciente)
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
                setPaciente(editar)
            }else{
                setPaciente(modeloPaciente)
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
                    {paciente.id == 0 ? "Nuevo Paciente":"Editar Paciente"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FormGroup>
                        <Form.Check type="checkbox"
                            label="Activo"
                            name="activo"
                            onChange={(e) => actualizarDatoCheck(e)}
                            checked={paciente.activo} style={{float:'right'}}/>
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Documento</Form.Label>
                        <Form.Control name="documento"
                            onChange={(e) => actualizarDato(e)}
                            value={paciente.documento}
                            autoComplete={'off'}  />
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Apellido Nombre</Form.Label>
                        <Form.Control name="apellidoNombre"
                            onChange={(e) => actualizarDato(e)}
                            value={paciente.apellidoNombre}
                            autoComplete={'off'}  />
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Direccion</Form.Label>
                        <Form.Control name="direccion"
                            onChange={(e) => actualizarDato(e)}
                            value={paciente.direccion}
                            autoComplete={'off'}  />
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Telefono</Form.Label>
                        <Form.Control name="telefono"
                            type='number'
                            onChange={(e) => actualizarDato(e)}
                            value={paciente.telefono}
                            autoComplete={'off'}  />
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Selecione un Genero</Form.Label>
                        <Form.Select name='generoId'
                            onChange={(e) => actualizarDato(e)}
                            value={paciente.generoId}>
                            {genero.map(generoItem => (
                                <option key={generoItem.id} value={generoItem.id}>{generoItem.descripcion}</option>
                            ))}
                            <option disabled key={0} value={0}>Debe Elegir un genero</option>
                        </Form.Select>
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
 
export default ModalPacinte;
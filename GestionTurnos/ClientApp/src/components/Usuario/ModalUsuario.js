import React, { useEffect, useState } from 'react';
import {Button, Modal, Form, FormGroup, Spinner} from "react-bootstrap"
import {usePut, usePost,useSelect} from './../utils/useHTTP'

const modeloUsuario = {
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

const ModalUsuario = ({mostrarModal,setMostrarModal,actualizarGrilla,editar,setEditar}) => {
    const [usuario,setUsuario] = useState(modeloUsuario);
    const [pending,setPending] = useState(false); 
    
    const actualizarDato = (e) => {
        setUsuario(
            { ...usuario, [e.target.name]: e.target.value}
        )
    }

    const actualizarDatoCheck = (e) => {
        setUsuario(
            { ...usuario, [e.target.name]: e.target.checked }
        )
    }
    const [dataG,pendingG,errorG,executePost] = usePost("api/user/insert")
    const [dataM,pendingM,errorM,executePut]= usePut("api/user/update")

    const [perfil,isloging,error] = useSelect({url:"api/perfil/list?search="})
    const [especialidad,islogingEsp,errorEsp] = useSelect({url:"api/especializacion/list?search="})
    const [genero,islogingGenero,errorGenero] = useSelect({url:"api/genero/list?search="})

    const enviarDatos = (e)=>{
        if(usuario.id == 0){
          executePost(usuario)
          setUsuario(modeloUsuario)
        }else{
            executePut(usuario);
            setUsuario(modeloUsuario)
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
            setUsuario(editar)
        }else{
            setUsuario(modeloUsuario)
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
                    {usuario.id == 0 ? "Nuevo Usuario":"Editar Usuario"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FormGroup>
                        <Form.Check type="checkbox"
                            label="Activo"
                            name="activo"
                            onChange={(e) => actualizarDatoCheck(e)}
                            checked={usuario.activo} style={{float:'right'}}/>
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Documento</Form.Label>
                        <Form.Control name="documento"
                            onChange={(e) => actualizarDato(e)}
                            value={usuario.documento}
                            autoComplete={'off'}  />
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Apellido Nombre</Form.Label>
                        <Form.Control name="apellidoNombre"
                            onChange={(e) => actualizarDato(e)}
                            value={usuario.apellidoNombre}
                            autoComplete={'off'}  />
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Direccion</Form.Label>
                        <Form.Control name="direccion"
                            onChange={(e) => actualizarDato(e)}
                            value={usuario.direccion}
                            autoComplete={'off'}  />
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Telefono</Form.Label>
                        <Form.Control name="telefono"
                            type='number'
                            onChange={(e) => actualizarDato(e)}
                            value={usuario.telefono}
                            autoComplete={'off'}  />
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Selecione un Genero</Form.Label>
                        <Form.Select name='generoId'
                            onChange={(e) => actualizarDato(e)}
                            value={usuario.generoId}>
                            {genero.map(generoItem => (
                                <option key={generoItem.id} value={generoItem.id}>{generoItem.descripcion}</option>
                            ))}
                            <option disabled key={0} value={0}>Debe Elegir un genero</option>
                        </Form.Select>
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Selecione un Perfil</Form.Label>
                        <Form.Select name='perfilId'
                            onChange={(e) => actualizarDato(e)}
                            value={usuario.perfilId}>
                            {perfil.map(perfilItem => (
                                <option key={perfilItem.id} value={perfilItem.id}>{perfilItem.descripcion}</option>
                            ))}
                            <option disabled key={0} value={0}>Debe Elegir un perfil</option>
                        </Form.Select>
                    </FormGroup>
                    <FormGroup>
                        <Form.Label>Selecione una Especialidad</Form.Label>
                        <Form.Select name='especializacionId'
                            onChange={(e) => actualizarDato(e)}
                            value={usuario.especializacionId}>
                            {especialidad.map(espec => (
                                <option key={espec.id} value={espec.id}>{espec.descripcion}</option>
                            ))}
                            <option disabled key={0} value={0}>Debe Elegir una Especialidad</option>
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
export default ModalUsuario;
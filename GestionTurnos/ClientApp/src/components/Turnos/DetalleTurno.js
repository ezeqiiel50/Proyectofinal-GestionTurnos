import React, { useEffect, useState } from 'react';
import {Button, Modal, Form, FormGroup,Spinner,Table} from "react-bootstrap"
import {usePut, usePost,useGetPer} from './../utils/useHTTP'
import * as Icon from 'react-bootstrap-icons';
import ErrorTable from '../../common/ErrorCarga';
import SinInfoTable from '../../common/SinInfoTable';

var today = new Date();

const modeloTurno = {
    Id:0,
    pacienteId : 0,
    motivo:"",
    fechaTurno:"",
    horaTurno:"",
    profesionalId:0
}

const DetalleTurno = ({mostrarModal,setMostrarModal,actualizarGrilla,doctorId,setDoctorId,editar,setEditar}) => {
    const [turno,setTurno] = useState(modeloTurno);
    const [list, setList] = useState([]);
    const [fecha,setFecha] = useState(today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2)+ "-" + today.getDate());

    const [dataP,pendingP,errorP,executePost] = usePost("api/turno/insert")

    const [turnos,pendingTurno,error,executeGet]= useGetPer("api/turno/list?id="+doctorId+"&fecha="+fecha)
    
    const enviarDatos = (e)=>{
        e.preventDefault();
        if(turno.Id === 0){
            executePost(turno);
            setTurno(modeloTurno)
        }
    }

    useEffect(()=>{
        if(errorP){ actualizarGrilla(true,dataP);}
        if( !errorP && errorP != undefined){actualizarGrilla(false,dataP); }
    },[errorP])

    
    const actualizarDato = (e) => {
        setTurno(
            { ...turno, [e.target.name]: e.target.value}
        )
        if(e.target.name === "fechaTurno"){
            setFecha(e.target.value);
        }
    }

    const actualizarFecha = (e) => {
       setTurno(
        { ...turno, ["horaTurno"]: e})
    }

    const cerrarModal =()=>{
        setMostrarModal(!mostrarModal)
        setDoctorId(null)
    }

    useEffect(() => {
        if(fecha !== undefined && doctorId != undefined){
            executeGet();
            setTurno(
                { ...turno, ["profesionalId"]: doctorId, ["fechaTurno"]: fecha});
        }
    }, [doctorId,fecha]);

    useEffect(() => {
        setList(turnos.horarios);
    }, [turnos]);
    
    return (  
        <Modal show={mostrarModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
            <Modal.Title>
                Asignar Turno para<br/> Doctor: {turnos.nombreDoctor} - {turnos.especialidad}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{paddingBottom:'0px'}}>
                <FormGroup>
                    <Form.Label>Fecha del Turno</Form.Label>
                    <Form.Control name="fechaTurno"
                        type='date'
                        onChange={(e) => actualizarDato(e)}
                        autoComplete={'off'}
                        value={fecha}
                        required />
                </FormGroup>
                <FormGroup>
                    <Form.Label>Documento del paciente</Form.Label>
                    <Form.Control name="pacienteId"
                        type='number'
                        onChange={(e) => actualizarDato(e)}
                        autoComplete={'off'}
                        required = {true} />
                </FormGroup>
                <FormGroup className='mb-3'>
                    <Form.Label>Motivo de la consulta</Form.Label>
                    <Form.Control name="motivo"
                        onChange={(e) => actualizarDato(e)}
                        autoComplete={'off'}
                        required />
                </FormGroup>
            {list != undefined ? list.length > 0 ?
                <Table bordered hover>
                    <thead>
                        <tr>
                            <th scope="col">Horarios Disponibles</th>
                            <th scope="col" style={{ textAlign: "center", width: '130px' }}>Seleciona</th>
                        </tr>
                    </thead>
                    <tbody>
                         {list.map(
                            (item) => (
                                <tr key={item} className={'light'}>
                                    <td>
                                        {item}
                                    </td>
                                     <td>
                                         <FormGroup>
                                             <Form.Check type="radio"
                                                 label="Activo"
                                                 name="horaTurno"
                                                 onChange={(e) => actualizarFecha(item)}/>
                                         </FormGroup>
                                     </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>: <ErrorTable /> : <SinInfoTable />}
        </Modal.Body>
        <Modal.Footer>
        <Button className="btn-danger" onClick={cerrarModal} type="button" >Cancelar</Button>
        {pendingP ? <Button className="btn-dark" onClick={enviarDatos} type="button" disabled>
        <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/> Procesando... </Button>
        :<Button className="btn-dark" onClick={enviarDatos}  type="button">Confirmar</Button> }
        </Modal.Footer>
    </Modal>
    );
}
 
export default DetalleTurno;
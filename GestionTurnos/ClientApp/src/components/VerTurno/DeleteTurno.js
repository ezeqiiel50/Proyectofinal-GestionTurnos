import React,{useState,useEffect} from 'react';
import {usePost} from './../utils/useHTTP'
import { Modal,Button,Spinner } from 'react-bootstrap';

const modeloTurno = {
    id : 0,
} 

const DeleteTurno = ({mostrarFicha,setMostrarFicha,ficha,actualizarGrillaDelete}) => {
    const [turnoId,setTurnoId] = useState(modeloTurno);
    const [pending,setPending] = useState(false); 
    
    const cerrarModalFicha =()=>{
        setMostrarFicha(!mostrarFicha)
        setTurnoId(null);
    }
    const [data,pendingG,error,executePost] = usePost("api/turno/delete")

    const enviarDatos = (e)=>{
          executePost(turnoId)
          setPending(false)
          setTurnoId(null);
    }

    useEffect(()=>{
        if(error){
            actualizarGrillaDelete(true,data);
        }
        if(!error && error != undefined){
            actualizarGrillaDelete(false,data);
        }
    },[error])

    useEffect(() => {
        if (ficha) {
            setTurnoId( { ...turnoId, ["id"]: ficha.id });
        }
    }, [ficha])

    return ( 
        <Modal show={mostrarFicha} onHide={cerrarModalFicha}>
            <Modal.Header closeButton>
                { ficha !== undefined ? 
                <Modal.Title> Motivo : {ficha.motivo}</Modal.Title>:
                <Modal.Title>Sin Informacion</Modal.Title>}
            </Modal.Header>
            <Modal.Body>
                <div>
                    {ficha !== undefined ? 
                     <p>¿Esta seguro que desea eliminar el turno con el Doctor {ficha.apellidoProfesion} 
                       el dia {ficha.fechaTurno} a la hora {ficha.horaTurno.split(":")[0] + ":"+ficha.horaTurno.split(":")[1]+"hs"}? </p> : ""}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn-danger" onClick={cerrarModalFicha} type="button" >Cerrar</Button>
                {pending ? <Button className="btn-dark" onClick={enviarDatos} type="button" disabled>
                    <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /> Procesando... </Button>
                    : <Button className="btn-dark" onClick={enviarDatos} type="button">Confirmar</Button>}
            </Modal.Footer>
        </Modal>
     );
}
export default DeleteTurno;
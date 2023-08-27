import React, { useState, useEffect } from 'react';
import {useGet} from './../utils/useHTTP'
import Loading from './../../common/Loading';
import * as Icon from 'react-bootstrap-icons';
import SinInfo from './../../common/SinInfo'
import ErrorCarga  from '../../common/ErrorCarga';
import DetalleTurno from './DetalleTurno'
import Error from './../../common/Error';
import { Container,Row, Col, Table,Button,InputGroup,Form,FormGroup,Pagination } from 'react-bootstrap';

const Items_Per_Page = 5;

const Turnos = () => {
    const [modalError, setModalError] = useState(false);
    const [mjsError, setMjsError] = useState();
    const [editar,setEditar] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [doctorId ,setDoctorId] = useState();
    const [currentPage,setCurrentPage] = useState(1);
    const [countPage,setCountPage] = useState(1);
    const [run,setRun] = useState(0);
    const [search, setSearch] = useState("");
    const inputSearch = React.createRef();

    const [doctores,isloging,error] = useGet({url:"api/turno/listdoctores",run:run})
    const [data ,setData] = useState([...doctores].splice(0,Items_Per_Page));
    
    const handlerBuscar = () => {
        setSearch(inputSearch.current.value)
    }

    const results = !search ? data : doctores.filter((dato) =>
    dato.especialidad.toLowerCase().includes(search.toLocaleLowerCase())) 

    const enviarDatos=(valor)=>{
     setDoctorId(valor.id)
     setMostrarModal(!mostrarModal)
    };

    useEffect(() => {
        setData([...doctores].splice(0, Items_Per_Page))
        const count_Page = doctores.length / Items_Per_Page;
        setCountPage(Math.ceil(count_Page));
    }, [doctores])

    const pagHandler = (numberPage) => {

        if (numberPage >= currentPage) {
            const totalData = doctores.length;
            const firstIndex = (numberPage - 1) * Items_Per_Page;
            if (firstIndex === totalData) return;
            setData([...doctores].splice(firstIndex, Items_Per_Page))
            setCurrentPage(numberPage)
        } else {
            if (numberPage < 0) return;
            const firstIndex = (numberPage - 1) * Items_Per_Page;
            setData([...doctores].splice(firstIndex, Items_Per_Page))
            setCurrentPage(numberPage);
        }
    }
    function actualizarGrilla(error,mjs){
        if (!error) {
            setMostrarModal(!mostrarModal);
            setRun(run + 1);
        } else {
            setMjsError(mjs);
            setMostrarModal(false);
            setModalError(error);
        }
        setCurrentPage(1)
    };

    let items = [];
    for (let number = 1; number <= countPage; number++) {
        items.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => pagHandler(number)}>
                {number}
            </Pagination.Item>,
        );
    }

    return ( 
    <Container>
        <Row>
            <Col sm>
                <h2>Turnos Disponibles</h2>
            </Col>
        </Row>
        <Row>
            <Col sm >
                <FormGroup className='anchoBuscador'>
                    <InputGroup className="mb-3">
                        <Form.Control
                            onChange={handlerBuscar}
                            placeholder="Buscar por especialidad"
                            aria-label="Recipient's username with two button addons"
                            ref={inputSearch} />
                    </InputGroup>
                </FormGroup>
            </Col>
        </Row>
        <Row>
            <Col sm> {isloging ? (<Loading />) : results.length > 0 ? (<div>
                <Table bordered hover className='bodyData'>
                    <thead>
                        <tr>
                            <th scope="col">Doctores - Especialidad</th>
                            <th scope="col" style={{ textAlign: "center" }}>Ver Turnos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(
                            (item) => (
                                <tr key={item.id}>
                                    <td>{item.nombre} - {item.especialidad}</td>
                                    <td style={{ textAlign: "center" }}><Button variant="outline-dark" onClick={() => enviarDatos(item)}><Icon.Calendar2Event size={20} /></Button></td>
                                </tr>
                            ))}
                    </tbody>
                </Table><Pagination>{items}</Pagination></div>) : error ? <ErrorCarga /> : <SinInfo />}
            </Col>
        </Row>

            <DetalleTurno mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                actualizarGrilla={actualizarGrilla}

                doctorId={doctorId}
                setDoctorId={setDoctorId}
                editar={editar}
                setEditar = {setEditar} />

                <Error
                modalError={modalError}
                setModalError={setModalError}
                mjsError={mjsError} />
</Container> );
}
 
export default Turnos;
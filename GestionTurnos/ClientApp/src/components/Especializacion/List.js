import React, { useState,useEffect } from 'react';
import { Container,Row, Col, Table,Button,InputGroup,Form,FormGroup,Pagination } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import {useGet} from './../utils/useHTTP'
import Loading from './../../common/Loading'
import SinInfo from './../../common/SinInfo'
import ErrorCarga  from '../../common/ErrorCarga';
import Error from './../../common/Error';
import ModalEspecializacion from './ModalEspecializacion';

const Items_Per_Page = 5;

const List = () =>{
    const [search, setSearch] = useState("");
    const [modalError, setModalError] = useState(false);
    const [mjsError, setMjsError] = useState();
    const [mostrarModal, setMostrarModal] = useState(false);
    const [editar,setEditar] = useState(null);
    const [run,setRun] = useState(0);
    const [currentPage,setCurrentPage] = useState(1);
    const [countPage,setCountPage] = useState(1);

    const inputSearch = React.createRef();
    
    const [espec,isloging,error] = useGet({url:"api/especializacion/list?search=",run:run})

    const [data ,setData] = useState([...espec].splice(0,Items_Per_Page));

    const handlerBuscar = () => {
        setSearch(inputSearch.current.value)
    }
    const results = !search ? data : espec.filter((dato) =>
        dato.descripcion.toLowerCase().includes(search.toLocaleLowerCase())) 

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
    
    const enviarDatos=(espec)=>{
        setEditar(espec)
        setMostrarModal(!mostrarModal)
    };

    const pagHandler = (numberPage) => {

        if (numberPage >= currentPage) {
            const totalData = espec.length;
            const firstIndex = (numberPage - 1) * Items_Per_Page;
            if (firstIndex === totalData) return;
            setData([...espec].splice(firstIndex, Items_Per_Page))
            setCurrentPage(numberPage)
        } else {
            if (numberPage < 0) return;
            const firstIndex = (numberPage - 1) * Items_Per_Page;
            setData([...espec].splice(firstIndex, Items_Per_Page))
            setCurrentPage(numberPage);
        }
    }
    useEffect(() => {
        setData([...espec].splice(0, Items_Per_Page))
        const count_Page = espec.length / Items_Per_Page;
        setCountPage(Math.ceil(count_Page));
    }, [espec]);

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
                <h2>Especializacion</h2>
            </Col>
        </Row>
        <Row>
            <Col sm>
                <FormGroup className='anchoBuscador'>
                    <InputGroup className="mb-3">
                        <Form.Control
                            onChange={handlerBuscar}
                            placeholder="Buscar por Descripcion"
                            aria-label="Recipient's username with two button addons"
                            ref={inputSearch}/>
                         <Button variant="outline-info" onClick={() => setMostrarModal(!mostrarModal)}><Icon.PlusCircle size={20} /></Button>
                    </InputGroup>
                </FormGroup>
            </Col>
        </Row>
        <Row>
            <Col sm>{isloging ? (<Loading />) : results.length > 0 ? (<div>
                <Table bordered hover className='bodyData' >
                    <thead>
                        <tr>
                            <th scope="col">Descripcion</th>
                            <th scope="col" style={{ textAlign: "center" }}>Tarea</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(
                            (item) => (
                                <tr key={item.id} className={item.activo ? "" : "table-active"}>
                                    <td>{item.descripcion} <br />{item.activo ? "Activo" : "Desactivado"}</td>
                                    <td style={{ textAlign: "center" }}><Button variant="outline-dark" onClick={() => enviarDatos(item)}><Icon.PencilSquare size={20} /></Button></td>
                                </tr>
                            ))}
                    </tbody>
                </Table><Pagination>{items}</Pagination></div>) : error ? <ErrorCarga /> : <SinInfo />}
            </Col>
        </Row>
        <ModalEspecializacion
            mostrarModal={mostrarModal}
            setMostrarModal={setMostrarModal}
            actualizarGrilla={actualizarGrilla}

            editar={editar}
            setEditar={setEditar} />

        <Error
            modalError={modalError}
            setModalError={setModalError}
            mjsError={mjsError} />
    </Container>
    )}; 

export default List;
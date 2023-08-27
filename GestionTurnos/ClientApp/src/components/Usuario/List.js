import React, { useState,useEffect }  from 'react';
import { Container,Row, Col, Card,Button,InputGroup,Form,FormGroup,Pagination } from 'react-bootstrap';
import {useGet} from './../utils/useHTTP'
import ModalUsuario from './ModalUsuario';
import Error from './../../common/Error';
import Loading from '../../common/Loading';
import ErrorCarga from '../../common/ErrorCarga';
import SinInfo from '../../common/SinInfo';
import * as Icon from 'react-bootstrap-icons';

const Items_Per_Page = 2;

const List = () => {
    const [run, setRun] = useState(0)
    const [search, setSearch] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [editar,setEditar] = useState(null);
    const [mjsError, setMjsError] = useState();
    const [modalError, setModalError] = useState(false);
    const [currentPage,setCurrentPage] = useState(1);
    const [countPage,setCountPage] = useState(1);

    const inputSearch = React.createRef();

    const [users, isloging, error] = useGet({ url: "api/user/list?search=", run: run })

    const [data ,setData] = useState([...users].splice(0,Items_Per_Page));

    const handlerBuscar = () => {
        setSearch(inputSearch.current.value)
    }

    const results = !search ? data : users.filter((dato) =>
        dato.documento.toLowerCase().includes(search.toLocaleLowerCase()))
    
    function actualizarGrilla(error, mjs) {
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

    const enviarDatos=(genero)=>{
        setEditar(genero)
        setMostrarModal(!mostrarModal)
    };

    const pagHandler = (numberPage) => {

        if (numberPage >= currentPage) {
            const totalData = users.length;
            const firstIndex = (numberPage - 1) * Items_Per_Page;
            if (firstIndex === totalData) return;
            setData([...users].splice(firstIndex, Items_Per_Page))
            setCurrentPage(numberPage)
        } else {
            if (numberPage < 0) return;
            const firstIndex = (numberPage - 1) * Items_Per_Page;
            setData([...users].splice(firstIndex, Items_Per_Page))
            setCurrentPage(numberPage);
        }
    }
 
    useEffect(() => {
        setData([...users].splice(0, Items_Per_Page))
        const count_Page = users.length / Items_Per_Page;
        setCountPage(Math.ceil(count_Page));
    }, [users]);

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
                <h2>Usuarios</h2>
                </Col>
            </Row>
            <Row>
                <Col sm>
                    <FormGroup className='anchoBuscador'>
                        <InputGroup>
                            <Form.Control
                                onChange={handlerBuscar}
                                placeholder="Buscar usuarios por Documento"
                                aria-label="Recipient's username with two button addons"
                                ref={inputSearch}
                            />
                            <Button variant="outline-info" onClick={() => setMostrarModal(!mostrarModal)}><Icon.PersonPlus size={20} /></Button>
                        </InputGroup>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col sm>{isloging ? (<Loading />) : results.length > 0 ? (<div>{results.map(
                    (item) => (
                        <Row key={item.id}>
                            <Col sm>
                                <Card border={item.activo ? "success" : "danger"} style={{border: '2px solid' }} className='bodyData'>
                                    <Card.Header>{item.documento}<span style={{ float: 'right' }}>{item.perfilDescripcion}</span></Card.Header>
                                    <Card.Body>
                                        <Card.Title>{item.apellidoNombre} - {item.especDescripcion} </Card.Title>
                                        <Card.Text>
                                            <Icon.Telephone size={20} /> {item.telefono}
                                            <span style={{ float: 'right' }}>Sexo: {item.generoDescripcion}</span>
                                        </Card.Text>
                                        <Card.Text>
                                            <Icon.Houses size={20} /> Direccion: {item.direccion}
                                        </Card.Text>
                                        <Card.Text>
                                            <Icon.PersonLock size={20} /> Usuario: {item.emailUser}
                                        </Card.Text>
                                    </Card.Body>
                                    <Card.Footer>
                                        <span style={{ float: 'right' }}>
                                            <Button variant="outline-warning" onClick={() => enviarDatos(item)}><Icon.PencilSquare size={20} /></Button>
                                        </span>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        </Row>
                    ))}<br/><Pagination>{items}</Pagination></div>): error ? <ErrorCarga /> : <SinInfo />}
                </Col>
            </Row>
           <ModalUsuario
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
    );
}
export default List;
import React,{useState,useEffect} from 'react';
import { Container,Row, Col, Card,Button,InputGroup,Form,FormGroup,Pagination } from 'react-bootstrap';
import ModalPaciente from './ModalPaciente';
import * as Icon from 'react-bootstrap-icons';
import Error from './../../common/Error';
import Loading from '../../common/Loading';
import ErrorCarga from '../../common/ErrorCarga';
import SinInfo from '../../common/SinInfo';
import {useGet} from './../utils/useHTTP'

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

    const [pacientes, isloging, error] = useGet({ url: "api/paciente/list?search=", run: run })
    const [data ,setData] = useState([...pacientes].splice(0,Items_Per_Page));

    const handlerBuscar = () => {
        setSearch(inputSearch.current.value)
    }

    const results = !search ? data : pacientes.filter((dato) =>
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
            const totalData = pacientes.length;
            const firstIndex = (numberPage - 1) * Items_Per_Page;
            if (firstIndex === totalData) return;
            setData([...pacientes].splice(firstIndex, Items_Per_Page))
            setCurrentPage(numberPage)
        } else {
            if (numberPage < 0) return;
            const firstIndex = (numberPage - 1) * Items_Per_Page;
            setData([...pacientes].splice(firstIndex, Items_Per_Page))
            setCurrentPage(numberPage);
        }
    }

    useEffect(() => {
        setData([...pacientes].splice(0, Items_Per_Page))
        const count_Page = pacientes.length / Items_Per_Page;
        setCountPage(Math.ceil(count_Page));
    }, [pacientes]);

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
                    <h2>Pacientes</h2>
                </Col>
            </Row>
            <Row>
                <Col sm>
                    <FormGroup className='anchoBuscador'>
                        <InputGroup>
                            <Form.Control
                                onChange={handlerBuscar}
                                placeholder="Buscar pacientes por Documento"
                                aria-label="Recipient's username with two button addons"
                                ref={inputSearch}/>
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
                                <Card border={item.activo ? "success" : "danger"} style={{ border: '2px solid' }} className='bodyData'>
                                    <Card.Header>{item.documento} - {item.apellidoNombre}</Card.Header>
                                    <Card.Body>
                                        <Card.Text>
                                            <Icon.Telephone size={20} /> {item.telefono}
                                            <span style={{ float: 'right' }}>Sexo: {item.generoDescripcion}</span>
                                        </Card.Text>
                                        <Card.Text>
                                            <Icon.Houses size={20} /> Direccion: {item.direccion}
                                            <span style={{ float: 'right' }}>
                                                <Button variant="outline-warning" onClick={() => enviarDatos(item)}><Icon.PencilSquare size={20} /></Button>
                                            </span>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    ))}<br/><Pagination>{items}</Pagination></div>): error ? <ErrorCarga /> : <SinInfo />}
                </Col>
            </Row>
            <ModalPaciente
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
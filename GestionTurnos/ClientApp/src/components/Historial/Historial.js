import React,{useState,useEffect} from 'react';
import {useGet,useGetPer} from './../utils/useHTTP'
import { Container,Row, Col, Table,Button,InputGroup,Form,FormGroup, Pagination,Card } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import Loading from '../../common/Loading';
import Error from './../../common/Error';
import ErrorCarga from '../../common/ErrorCarga';
import SinInfo from '../../common/SinInfo';
import SinHistorial from '../../common/SinHistorial'
import ModalHistorial from './ModalHistorial'
import Ficha from './Ficha'

const Items_Per_Page = 5;

const Historial = () => {
    const [mostrarFicha, setMostrarFicha] = useState(false);
    const [ficha,setFicha] = useState();
    const [countPage,setCountPage] = useState(1);
    const [id ,setId] = useState(0)
    const [currentPage,setCurrentPage] = useState(1);
    const [editar,setEditar] = useState(null);
    const [mjsError, setMjsError] = useState();
    const [modalError, setModalError] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [search, setSearch] = useState("");
    const [paciente, setPaciente] = useState();
    const [list, setList] = useState();
    const [datas ,setData] = useState();
    const inputSearch = React.createRef();

    const [data,pending,error,executeGet]= useGetPer("api/historial/list?search="+search)
    
    const enviarDatos=(historial)=>{
        setEditar(historial)
        setMostrarModal(!mostrarModal)
    };

    const enviarFicha=(historial)=>{
        setFicha(historial)
        setMostrarFicha(!mostrarFicha)
    };

    function actualizarGrilla(error, mjs) {
        if (!error) {
            setMostrarModal(!mostrarModal);
            executeGet();
        } else {
            setMjsError(mjs);
            setMostrarModal(false);
            setModalError(error);
        }
        setCurrentPage(1)
    };

    const handlerBuscar = () => {
        setSearch(inputSearch.current.value)
    }

    const Buscar = () => {
        if (search) {
            executeGet();
        } }

    useEffect(() => {
        setPaciente(data.paciente);
        setList(data.list);
        if(data.paciente){
            setId(data.paciente.id)
        }
    }, [data]);

    useEffect(() => {
        if (list !== undefined) {
            setData([...list].splice(0, Items_Per_Page))
            const count_Page = list.length / Items_Per_Page;
            setCountPage(Math.ceil(count_Page));
        }
    },[list])

    const pagHandler = (numberPage) => {

        if (numberPage >= currentPage) {
            const totalData = list.length;
            const firstIndex = (numberPage - 1) * Items_Per_Page;
            if (firstIndex === totalData) return;
            setData([...list].splice(firstIndex, Items_Per_Page))
            setCurrentPage(numberPage)
        } else {
            if (numberPage < 0) return;
            const firstIndex = (numberPage - 1) * Items_Per_Page;
            setData([...list].splice(firstIndex, Items_Per_Page))
            setCurrentPage(numberPage);
        }
    }

    let items = [];
    for (let number = 1; number <= countPage; number++) {
        items.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => pagHandler(number)}>
                {number}
            </Pagination.Item>,
        );}

    return ( 
        <Container>
            <Row>
                <Col sm>
                    <h2>Nuevo Caso</h2>
                </Col>
            </Row>
            <Row>
                <Col sm>
                    <FormGroup className='anchoBuscador'>
                        <InputGroup className="mb-3">
                            <Form.Control
                               onChange={handlerBuscar}
                                type='number'
                                placeholder="Buscar paciente por Documento"
                                aria-label="Recipient's username with two button addons"
                                ref={inputSearch}/>
                            <Button variant="outline-primary" onClick={Buscar}><Icon.Search size={20} /></Button>
                        </InputGroup>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col sm>{pending ? <Loading /> : error ? <ErrorCarga /> : paciente !== undefined ? (paciente.documento !== null ?
                    <div>
                        <Card border={paciente.activo ? "primary" : "danger"} className='bodyData'>
                            <Card.Header>{paciente.documento} - {paciente.apellidoNombre} <span style={{ float: 'right' }} >
                                <Button variant="outline-success" onClick={() => setMostrarModal(!mostrarModal)}><Icon.FileEarmarkPlus size={20} /></Button></span>
                            </Card.Header>
                        </Card>
                         {datas === undefined ? <Loading /> : datas.length > 0 ? <div style={{ marginTop: '-10px' }}>
                            <Table bordered hover className='bodyData' >
                                <thead>
                                    <tr>
                                        <th scope="col">Motivo</th>
                                        <th scope="col" style={{ textAlign: "center", width: '130px' }}>Tarea</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {datas.map(
                                        (item) => (
                                            <tr key={item.id} className={'light'}>
                                                <td>{item.motivo}</td>
                                                <td style={{ textAlign: "center" }}>
                                                    <Button variant="outline-info" onClick={() => enviarFicha(item)} style={{ marginRight: '5px' }}><Icon.Eye size={15} /></Button>
                                                    <Button variant="outline-dark" onClick={() => enviarDatos(item)}><Icon.PencilSquare size={15} /></Button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </Table><Pagination>{items}</Pagination>
                        </div> : <SinHistorial />}
                    </div> : <SinInfo />) : <SinInfo />}
                </Col>
            </Row>
            <ModalHistorial
            mostrarModal={mostrarModal} 
            setMostrarModal={setMostrarModal} 
            actualizarGrilla={actualizarGrilla}
            editar={editar}
            setEditar={setEditar}
            id= {id} />

            <Ficha
                mostrarFicha={mostrarFicha}
                setMostrarFicha={setMostrarFicha}
                ficha={ficha} />

            <Error
                modalError={modalError}
                setModalError={setModalError}
                mjsError={mjsError} />
        </Container>
    );
}
 
export default Historial;
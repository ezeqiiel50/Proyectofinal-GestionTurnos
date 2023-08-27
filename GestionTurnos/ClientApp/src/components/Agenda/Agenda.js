import React, {useState,useEffect} from 'react';
import {useGet} from './../utils/useHTTP'
import {Container,Row,Col,Form,FormGroup,Card,Table,Button,Pagination,InputGroup} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import ModalAgenda from './ModalAgenda'
import Loading from './../../common/Loading'
import SinInfo from './../../common/SinInfo'
import ErrorCarga  from '../../common/ErrorCarga';
import Error from './../../common/Error';

var today = new Date();
const Items_Per_Page = 5;

const Agenda = () => {
    const [search, setSearch] = useState("");
    const [fecha,setFecha] = useState(today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2)+ "-" + today.getDate());
    const [modalError, setModalError] = useState(false);
    const [mjsError, setMjsError] = useState();
    const [mostrarModal, setMostrarModal] = useState(false);
    const [editar,setEditar] = useState(null);
    const [run,setRun] = useState(0);
    const [currentPage,setCurrentPage] = useState(1);
    const [countPage,setCountPage] = useState(1);
    const [flag,setFlag]= useState(0);
    const inputSearch = React.createRef();

    const [agenda,isloging,error] = useGet({url:"api/agenda/list?fecha="+fecha,run:run})

    const [data ,setData] = useState([...agenda].splice(0,Items_Per_Page));

    const cambiarFecha = (e) => {
        setFecha(e.target.value)
        setFlag(flag +1);
    }

    useEffect(() => {
        if(flag !== 0){setRun(run + 1); }
    }, [flag]);

    const handlerBuscar = () => {
        setSearch(inputSearch.current.value)
    }

    const enviarDatos=(dato)=>{
        setEditar(dato)
        setMostrarModal(!mostrarModal)
    };

    const results = !search ? data : agenda.filter((dato) =>
    dato.documento.toLowerCase().includes(search.toLocaleLowerCase())) 

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

    const pagHandler = (numberPage) => {

        if (numberPage >= currentPage) {
            const totalData = agenda.length;
            const firstIndex = (numberPage - 1) * Items_Per_Page;
            if (firstIndex === totalData) return;
            setData([...agenda].splice(firstIndex, Items_Per_Page))
            setCurrentPage(numberPage)
        } else {
            if (numberPage < 0) return;
            const firstIndex = (numberPage - 1) * Items_Per_Page;
            setData([...agenda].splice(firstIndex, Items_Per_Page))
            setCurrentPage(numberPage);
        }
    }

    useEffect(() => {
        setData([...agenda].splice(0, Items_Per_Page))
        const count_Page = agenda.length / Items_Per_Page;
        setCountPage(Math.ceil(count_Page));
    }, [agenda]);

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
                    <h2>Mi Agenda</h2>
                </Col>
            </Row>
            <Row>
                <Col sm>
                    <Card border="dark" className='anchoBuscador'>
                        <FormGroup className='bodyData'>
                            <Card.Body style={{marginTop:'-15px'}}>
                                <Card.Title><Form.Label>Selecione la Fecha que desea ver su agenda</Form.Label></Card.Title>
                                <Form.Control name="fechaTurno"
                                    type='date'
                                    onChange={(e) => cambiarFecha(e)}
                                    autoComplete={'off'}
                                    value={fecha}
                                    required />
                                <Card.Title className='mt-3'><Form.Label>Buscar en los turnos del dia Selecionado</Form.Label></Card.Title>
                                <Form.Control
                                    type='number'
                                    onChange={handlerBuscar}
                                    placeholder="por Documento"
                                    aria-label="Recipient's username with two button addons"
                                    ref={inputSearch} />
                            </Card.Body>
                        </FormGroup>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col sm>{isloging ? (<Loading />) : results.length > 0 ? (<div>
                    <Table bordered hover className='bodyData' >
                        <thead>
                            <tr>
                                <th scope="col">Paciente - Horario Del Turno</th>
                                <th scope="col" style={{ textAlign: "center" }}>Tarea</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(
                                (item) => (
                                    <tr key={item.id} className={item.activo ? "table-success" : "table-warning"}>
                                        <td>{item.documento} - {item.apellidoNombre}<br />{item.horaTurno.split(":")[0] + ":"+item.horaTurno.split(":")[1]+"hs"} - Visita {item.activo ? "Cumplida" : "Pendiente"}</td>
                                        <td style={{ textAlign: "center" }}><Button variant="outline-dark" onClick={() => enviarDatos(item)}><Icon.PencilSquare size={20} /></Button></td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table> {!search ?<Pagination>{items}</Pagination>:"" }</div>) : error ? <ErrorCarga /> : <SinInfo />}
                </Col>
            </Row>
            <ModalAgenda
                mostrarModal={mostrarModal}
                setMostrarModal={setMostrarModal}
                actualizarGrilla={actualizarGrilla}
                editar={editar}
                setEditar={setEditar} />

            <Error
                modalError={modalError}
                setModalError={setModalError}
                mjsError={mjsError} />
        </Container>);
}
 
export default Agenda;
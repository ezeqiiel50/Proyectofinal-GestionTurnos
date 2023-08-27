import React from 'react';
import { Container,Row ,Col} from "react-bootstrap";
import { BrowserRouter as Router, Route,Routes } from "react-router-dom";
import { useState,useEffect,useRef,useContext} from "react";
import Loading from '../../common/Loading';
import ErrorCarga from '../../common/ErrorCarga';
import Header from "../Header/Header"
import Menu from '../Menu/Menu';
import Historial from "../Historial/Historial";
import ListGenero from "../Genero/List";
import ListPerfil from "../Perfil/List";
import ListUsuarios from "../Usuario/List";
import ListPaciente from "../Paciente/List"
import ListEspecializacion from "../Especializacion/List";
import VerTurno from '../VerTurno/VerTurno'
import Turnos from "../Turnos/Turnos";
import Home from "../Home/Home"
import Agenda from "../Agenda/Agenda"
import RouteProtegida from "../../router/RouteProtegida"
import { UserContext } from '../Context/UserContext';

const Princiapl = () => {
    const [style, setStyle] = useState("ColMenu")
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    const {userData,pending,error} = useContext(UserContext);

    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setStyle('ColMenu');
                } else {
                    if (style === 'ColMenuFlo') {
                        MostrarMenu();
                    }
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    const MostrarMenu = () => {
        if (style === 'ColMenu') {
            setStyle('ColMenuFlo');
        }
        if (style === 'ColMenuFlo') {
            setStyle('ColMenu');
        }
    };

    return (
        <Container fluid="sm">
            <Row ref={wrapperRef}>
                <Col md={12} sm={8}>
                    <Header MostrarMenu={MostrarMenu} />
                </Col>
            </Row>
            <Row style={{ marginTop: '60px' }}>
            {pending ? <Loading/> : !error ?
                <Router>
                    <Col sm className={style} ref={wrapperRef}>
                        <Menu />
                    </Col>
                        <Col md={10} sm className="caja">
                            <Routes>
                                <Route path="/" Component={Home} />
                                <Route path="/turnos" element={<Turnos/>}/>
                                <Route path="/verturnos" element={<VerTurno/>}/>
                                <Route path="/pacientes" element={<ListPaciente/>}/>
                                <Route path="/historial" element={<Historial/>}/>
                                <Route path="/agenda" element={<Agenda/>}/>
                                <Route element={<RouteProtegida />}>
                                <Route path="/usuarios" element={<ListUsuarios/>}/>
                                <Route path="/generos" element={<ListGenero />} />
                                <Route path="/especializacion" element={<ListEspecializacion />} />
                                <Route path="/perfil" element={<ListPerfil />} />
                                </Route>
                            </Routes>
                        </Col>
                </Router> : <ErrorCarga/> }
            </Row> 
        </Container>
    );
}
export default Princiapl;
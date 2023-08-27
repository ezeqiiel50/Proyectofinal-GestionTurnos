import React,{useContext,useState,useEffect} from 'react';
import './Menu.css'
import { UserContext } from '../Context/UserContext'
import {Container, Nav,NavDropdown, Row ,Col,Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';

const Menu = () => {
    const [rol,setRol] = useState();
    const { userData } = useContext(UserContext);

    useEffect(() => {
        if (userData !== undefined) {
            setRol(userData.rolName)
        }
    }, [userData]);
    return (
        <>
            <Container className='lateral'>
                <Row>
                    <Col>
                        <Nav defaultActiveKey="/" className="flex-column" id="sidebar">
                            <div className='TituloMenu'>
                                <h5>Sistema de<br /> Turno</h5>
                            </div>
                            <Nav.Item>
                                <NavLink className={'menu'} to="/" ><Icon.House size={20} /><span className='Title'>Inicio</span></NavLink>
                            </Nav.Item>
                            {rol === "ADMIN" || rol === "DOCTOR" ?
                            <Nav.Item>
                                <NavLink className={'menu'} to="/agenda" ><Icon.Clipboard2Pulse size={20} /><span className='Title'>Mi Agenda</span></NavLink>
                            </Nav.Item> : ""}
                            {rol === "ADMIN" || rol === "DOCTOR" ?
                                <Nav.Item>
                                    <NavLink className={'menu'} to="/historial">
                                        <Icon.Folder2 size={20} /><span className='Title'>Nuevo Caso</span>
                                    </NavLink>
                                </Nav.Item> : ""}
                            <Nav.Item>
                                <NavLink className={'menu'} to="/pacientes">
                                    <Icon.JournalMedical size={20} /><span className='Title'>Pacientes</span>
                                </NavLink>
                            </Nav.Item>
                            {rol === "ADMIN" ? <Nav.Item>
                                <NavLink className={'menu'} to="/usuarios">
                                    <Icon.Person size={20} /><span className='Title'>Usuarios</span>
                                </NavLink>
                            </Nav.Item> : ""}
                            <NavDropdown className={'menu'} title='Turnos' id="nav-dropdown">
                                <Nav.Item>
                                    <NavLink className={'item-menu dropdown-item'} to="/turnos">
                                        Asignar Turnos
                                    </NavLink>
                                </Nav.Item>
                                <Nav.Item>
                                    <NavLink className={'item-menu dropdown-item'} to="/VerTurnos">
                                        Turnos Asignados
                                    </NavLink>
                                </Nav.Item>
                            </NavDropdown>
                            {rol === "ADMIN" || rol === "SECRE" ?
                                <NavDropdown className={'menu'} title='Configuraciones' id="nav-dropdown">
                                    <Nav.Item>
                                        <NavLink className={'item-menu dropdown-item'} to="/generos">
                                            Generos
                                        </NavLink>
                                    </Nav.Item>
                                    {rol === "ADMIN" ?
                                        <Nav.Item>
                                            <NavLink className={'item-menu dropdown-item'} to="/perfil">
                                                Perfiles
                                            </NavLink>
                                        </Nav.Item> : ""}
                                    <Nav.Item>
                                        <NavLink className={'item-menu dropdown-item'} to="/especializacion">
                                            Especializacion
                                        </NavLink>
                                    </Nav.Item>
                                </NavDropdown> : ""}
                        </Nav>
                    </Col>
                </Row>
            </Container>
        </>     
    );
}
 
export default Menu;
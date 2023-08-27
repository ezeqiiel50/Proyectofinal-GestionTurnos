import React,{useEffect, useState} from 'react';
import './header.css'
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../../authConfig";
import {Container , Navbar,Button} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

const Header = ({ MostrarMenu}) => {
    const [label ,setLabel] = useState('')
    const msalInstance = new PublicClientApplication(msalConfig);
    const nombre = msalInstance.getAllAccounts()[0].name.split(" ");
    const iniciales = nombre[0].charAt(0) + nombre[1].charAt(0).toUpperCase();

    useEffect(() => {
        setLabel(iniciales)
    }, [iniciales]);

    const handleLogout = async () => {
        msalInstance.logoutRedirect({
          postLogoutRedirectUri: "/",
        });
    };
    return (
        <>
        <Navbar bg="dark" data-bs-theme="dark" fixed="top" className='header'>
            <Button className="burger btn-dark" type="button" onClick={MostrarMenu}><Icon.List size={20} /></Button>
            <Navbar.Brand className="titulo justify-content-end text-white" style={{ marginLeft: '70px' }}>
                <Icon.Calendar2Check size={20} /> 
                <span style={{ marginLeft: '15px' }}>Sistema de Turno</span>
            </Navbar.Brand>
            <Container>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text className='text-white icono'>
                            <div className='Perfil'>
                                <a className='CenterElement' style={{ color: 'white' }}>
                                {label}
                                </a>
                                <div className="dropdown-content">
                                    <a onClick={handleLogout}>Cerrar Session</a>
                                </div>
                            </div>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        </>
    );
}
export default Header;
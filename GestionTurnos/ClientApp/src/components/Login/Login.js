import React from 'react';
import { Container,Row ,Col,Button, Navbar,Image } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import { msalConfig } from "../../authConfig";
import { PublicClientApplication } from "@azure/msal-browser";

const Login = () => {
    const msalInstance = new PublicClientApplication(msalConfig);
    const handleLogin = async () => {
        try {
          const response = await msalInstance.loginRedirect();
        } catch (error) {
          console.log(error);
        }
      };

    return ( <Container>
        <Row>
            <Col sm>
                <Navbar bg="light" data-bs-theme="light">
                    <Container>
                        <Navbar.Brand>Sistema Turnos</Navbar.Brand>
                    </Container>
                </Navbar>
            </Col>
        </Row>
        <Row>
            <Col sm className="text-center mt-3">
               <Image src="/logo.jpg" thumbnail style={{backgroundRepeat: "no-repeat",width: "250px"}}/>
               </Col>
        </Row>
        <Row>
            <Col sm className="text-center mt-3">
                <p>Inicia session con tus creedenciales de Microsoft</p>
                <Button variant="outline-info" onClick={handleLogin}><Icon.Microsoft size={20} />  Login</Button>
            </Col>
        </Row>
    </Container> );
}
 
export default Login;
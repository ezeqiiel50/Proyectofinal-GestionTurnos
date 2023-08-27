import React from 'react';
import * as Icon from 'react-bootstrap-icons';
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../../authConfig";
import { Container,Col,Row,Card } from 'react-bootstrap';

const Home = () => {
    const msalInstance = new PublicClientApplication(msalConfig);
    const nombre = msalInstance.getAllAccounts()[0].name;

    return (
        <Container>
            <Row>
                <Col sm>
                    <h2> </h2>
                </Col>
            </Row>
            <Row>
                <Col sm>
                    <Card border="info" className='bodyData'>
                        <Card.Body>
                            <Card.Title>¡Saludos {nombre}!  <Icon.EmojiSmile size={30} /></Card.Title>
                            <Card.Text>
                                El sistema de gestion de turnos esta diseñado para ayudar a un trabajo eficas y sencillo.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>);
}
export default Home;
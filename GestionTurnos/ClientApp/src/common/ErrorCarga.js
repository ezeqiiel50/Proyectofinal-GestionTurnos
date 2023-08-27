import React from 'react';
import {Card,Row,Col} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

const ErrorCarga = () => {
    return ( 
        <Row>
            <Col sm md={8}><Card border="danger" className='bodyData'>
                <Card.Body>
                    <Card.Title>Atencion!</Card.Title>
                    <Card.Text>
                        Lo sentimos, ah ocurrido un error, comuniquese con el administrador.  <Icon.Tools size={30} />
                    </Card.Text>
                </Card.Body>
            </Card></Col>
        </Row>
     );
}
 
export default ErrorCarga;
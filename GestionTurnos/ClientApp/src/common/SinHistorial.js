import React from 'react';
import {Card,Row,Col} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

const SinHistorial = () => {
    return (<Row>
        <Col sm md={8}>
            <Card border="info" className='bodyData'>
                <Card.Body>
                    <Card.Title><Icon.ExclamationDiamond size={30} /> Sin Historial.</Card.Title>
                </Card.Body>
            </Card>
        </Col>
    </Row>);
}
 
export default SinHistorial;
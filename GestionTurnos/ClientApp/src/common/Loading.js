import React from 'react';
import {Spinner,Row,Col} from 'react-bootstrap';

const Loading = () => {
    return (
        <Row>
            <Col sm>
                <div className='d-flex justify-content-evenly mt-4'>
                    <Spinner animation="border" role="info">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </div>
            </Col>
        </Row>
    );
}
export default Loading;
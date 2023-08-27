import React from 'react';
import {Card,Row,Col} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

function SinInfoTable() {
  return (
    <>
      <Row>
        <Col sm>
          <Card border="info">
            <Card.Body>
              <Card.Title><Icon.ExclamationDiamond size={30} /> Atención!</Card.Title>
              <Card.Text>
                No encontramos registros, intentalo nuevamente.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
    </>
  );
}
export default SinInfoTable;
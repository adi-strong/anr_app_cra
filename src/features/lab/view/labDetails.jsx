import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Card, Col, Row, Table} from "react-bootstrap";

const nStyle = {
  fontWeight: 800,
  color: '#0909b0'
}

const uStyle2 = { borderBottom: '2px solid #0909b0' }

export default function LabDetails() {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <div className='mt-5 pt-10 px-10 pe-10 mb-3' style={uStyle2}>
        <h2 style={nStyle} className='text-center'>CLINIC OFFICE</h2>
        <h6 className='text-center'>rue Philippe 49 731 Dumas-sur-Lebrun</h6>
      </div>
      
      
      <Row  >
        <Col sm={6} className='mb-2'>
          <div className='p-2' style={{ border: '1px solid lightgray', height: 120 }}>
            <Card.Title className='mb-5'>Nom : </Card.Title>
            <Card.Title className='mb-5'>Prénom : </Card.Title>
            <Card.Title className='mb-0'>Âge : </Card.Title>
          </div>
        </Col>
        
        <Col sm={6} className='mb-2'>
          <div className='p-2' style={{ border: '1px solid lightgray', height: 120 }}>
            <Card.Title className='mb-5'>Date : </Card.Title>
            <Card.Title>Numéro : </Card.Title>
          </div>
        </Col>
      </Row>
      
      <Table bordered responsive className='mt-5'>
        <thead>
        <tr>
          <th>Prélèvement</th>
          <th>Paramètre</th>
          <th>Val. Trouvée</th>
          <th>Val. de référence</th>
          <th>Unité</th>
          <th>Observation</th>
        </tr>
        </thead>
        
        <tbody>
        </tbody>
      </Table>
      
      <h4 className='card-title mt-5 mb-2'>INTERPRÉTATION</h4>
      <div className='p-2' style={{ border: '1px solid lightgray' }}>
      </div>
    </ErrorBoundary>
  )
}

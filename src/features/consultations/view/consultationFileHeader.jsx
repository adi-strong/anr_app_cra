import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Col, Row} from "react-bootstrap";

const nStyle = {
  fontWeight: 800,
  color: '#0909b0'
}

const nStyle2 = { color: '#0909b0', }

const uStyle2 = { borderBottom: '2px solid #0909b0' }

const uStyle3 = { borderBottom: '2px dotted #0909b0' }

const style = {
  borderTop: '3px solid #0909b0',
  borderBottom: '3px solid #0909b0',
}

export default function ConsultationFileHeader() {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      {/* HEADER ******************************************************************* */}
      <div className='mt-5 pt-10 px-10 pe-10 mb-3' style={uStyle2}>
        <h5 className='text-center fw-bold'>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h5>
        <h6 style={nStyle} className='text-center'>MINISTÈRE DE LA SANTÉ</h6>
        <h2 style={nStyle} className='text-center'>CLINIC OFFICE</h2>
        <h6 className='text-center'>rue Philippe 49 731 Dumas-sur-Lebrun</h6>
      </div>
      
      <h6 className='text-center'>
        FICHE DE CONSULTATION <span className='text-decoration-underline'>n°1</span>
      </h6>
      {/* END HEADER *************************************************************** */}
      
      {/* PATIENT ******************************************************************* */}
      <Row className='px-10 pe-10 pt-1' style={nStyle2}>
        <Col md={2} className='mb-3 fw-bold'>Nom</Col>
        <Col md={10} className='mb-3' style={uStyle3}></Col>
        
        <Col md={2} className='mb-3 fw-bold'>adresse</Col>
        <Col md={10} className='mb-3' style={uStyle3}></Col>
      </Row>
      
      <Row className='px-10 pe-10' style={nStyle2}>
        <Col md={2} className='mb-3 fw-bold'>n° Tél</Col>
        <Col md={2} className='mb-3' style={uStyle3}></Col>
        
        <Col md={2} className='mb-3 fw-bold px-4'>état-civil</Col>
        <Col md={2} className='mb-3' style={uStyle3}></Col>
        
        <Col md={2} className='mb-3 fw-bold px-8'>âge</Col>
        <Col md={2} className='mb-3' style={uStyle3}></Col>
      </Row>
      
      <Row className='px-10 pe-10' style={nStyle2}>
        <Col md={2} className='mb-3 fw-bold'>Sexe</Col>
        <Col md={1} className='mb-3' style={uStyle3}></Col>
        
        <Col md={2} className='mb-3 fw-bold px-8'>Poids</Col>
        <Col md={1} className='mb-3' style={uStyle3}></Col>
        
        <Col md={2} className='mb-3 fw-bold px-8'>FC</Col>
        <Col md={4} className='mb-3' style={uStyle3}></Col>
      </Row>
      
      <Row className='px-10 pe-10' style={nStyle2}>
        <Col md={3} className='mb-3 fw-bold'>FR, Cycle / min</Col>
        <Col md={9} className='mb-3' style={uStyle3}></Col>
      </Row>
      
      <Row style={style} className='mx-10 me-8'>
        <Col sm={6} style={{ borderRight: '0.5px solid #0909b0' }}>
          <h5 className='mt-3' style={nStyle2}>ANTÉCÉDENTS Médicaux</h5>
          <div style={{ wordWrap: 'break-word' }}>
          </div>
        </Col>
        
        <Col sm={6} style={{ borderLeft: '0.5px solid #0909b0' }}>
          <h5 className='mt-3' style={nStyle2}>
            Mentions particuliers - Allergies - Affections chroniques <br/> ou Gynéco-obstétriques
          </h5>
          <div style={{ wordWrap: 'break-word' }}>
          </div>
        </Col>
        
        <Col sm={6} style={{ borderRight: '0.5px solid #0909b0', borderTop: '0.5px solid #0909b0' }}>
          <h5 className='mt-3' style={nStyle2}>
            Chirurgicaux
          </h5>
          <div style={{ wordWrap: 'break-word' }}>
          </div>
        </Col>
        
        <Col sm={6} style={{ borderLeft: '0.5px solid #0909b0', borderTop: '0.5px solid #0909b0' }}>
          <h5 className='mt-3' style={nStyle2}>
            Familiaux
          </h5>
          <div style={{ wordWrap: 'break-word' }}>
          </div>
        </Col>
      </Row>
      {/* END PATIENT *************************************************************** */}
    </ErrorBoundary>
  )
}

import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError} from "../../../components";
import PropTypes from "prop-types";
import {Button, Col, Form, Row} from "react-bootstrap";
import {useState} from "react";
import {consultErrors/*, consultFields*/} from "../model";

export default function EditConsultForm({loader, data}) {
  // const [fields, setFields] = useState(consultFields)
  const [errors/*, setErrors*/] = useState(consultErrors)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <div className='mx-5 me-5 pt-10'>
        <h3 className='card-title'> Suivi & observations</h3>
        
        <Row className='mb-5' style={{ borderBottom: '1px solid lightgray' }}>
          <Col md={6} className='mb-3' style={{ borderRight: '1px solid lightgray' }}>
            <h4 className='card-title'><i className='bi bi-person'/> Patient(e)</h4>
          </Col>
          
          <Col md={6} className='mb-3' style={{ borderLeft: '1px solid lightgray' }}>
            <Form onSubmit={e => e.preventDefault()}>
              <Form.Group>
                <h4 className='card-title'>
                  <i className='bi bi-file-earmark-text'/> Fiche <code>*</code>
                </h4>
                <FeedbackError error={errors.type}/>
              </Form.Group>
              <Button disabled={false} type='submit' className='d-block w-100'>
                Mettre à jour
              </Button>
            </Form>
          </Col>
        </Row>
        
        <Row className='mb-5' style={{ borderBottom: '1px solid lightgray' }}>
          <Col md={6} className='mb-3' style={{ borderRight: '1px solid lightgray' }}>
            <h5 className='card-title mt-2'>
              <i className='bi bi-clipboard-pulse'/> Antécédents médicaux
            </h5>
            
            <div style={{ wordWrap: 'break-word' }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi harum incidunt itaque magnam,
              nam nostrum quam quia. Ab aspernatur esse excepturi ipsa iusto magnam maiores nostrum,
              quibusdam quos tenetur vero.
            </div>
          </Col>
          
          <Col md={6} className='mb-3' style={{ borderLeft: '1px solid lightgray' }}>
            <h5 className='card-title mt-2'>
              <i className='bi bi-file-medical me-1'/>
              <small>
                Mentions particulières - Allergies - Affections
                chroniques ou Gynéco-obstétriques
              </small>
            </h5>
            
            
            <div style={{ wordWrap: 'break-word' }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium consequatur
              debitis dignissimos doloremque numquam rerum similique! Facilis officiis rerum saepe.
              Earum eligendi illo itaque, iure maiores maxime odio quibusdam voluptatibus.
            </div>
          </Col>
        </Row>
        
        <Row className='mb-5'>
          <Col md={6} className='mb-3' style={{ borderRight: '1px solid lightgray' }}>
            <h4 className='card-title mt-2'>
              <i className='bi bi-heart-pulse'/> Chirurgicaux
            </h4>
            
            <div style={{ wordWrap: 'break-word' }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi harum incidunt itaque magnam,
              nam nostrum quam quia. Ab aspernatur esse excepturi ipsa iusto magnam maiores nostrum,
              quibusdam quos tenetur vero.
            </div>
          </Col>
          
          <Col md={6} className='mb-3' style={{ borderLeft: '1px solid lightgray' }}>
            <h4 className='card-title mt-2'>
              <i className='bi bi-heart-pulse-fill me-1'/>
              Familiaux
            </h4>
            
            
            <div style={{ wordWrap: 'break-word' }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium consequatur
              debitis dignissimos doloremque numquam rerum similique! Facilis officiis rerum saepe.
              Earum eligendi illo itaque, iure maiores maxime odio quibusdam voluptatibus.
            </div>
          </Col>
        </Row>
      </div>
    </ErrorBoundary>
  )
}

EditConsultForm.propTypes = {
  loader: PropTypes.bool,
  data: PropTypes.any,
}

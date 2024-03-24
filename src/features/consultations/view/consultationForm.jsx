import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, FieldsAlert} from "../../../components";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import {useState} from "react";
import {consultErrors, consultFields, onConsultationSubmit} from "../model";
import {onFieldChange} from "../../../services/form.handler.service";

export default function ConsultationForm() {
  const [validated, setValidated] = useState(false)
  const [fields, setFields] = useState(consultFields)
  const [errors, setErrors] = useState(consultErrors)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <FieldsAlert className='mt-5'/>
      
      <Form
        noValidate
        validated={validated}
        onSubmit={e => onConsultationSubmit(
          e,
          fields,
          setFields,
          errors,
          setErrors,
          setValidated,
        )}>
        
        <Row>
          <Col className='mb-3'>
            <Card>
              <Card.Body>
                <h4 className='card-title'><i className='bi bi-person'/> Patient(e) <code>*</code></h4>
                
                <FeedbackError error={errors.patient}/>
              </Card.Body>
            </Card>
          </Col>
          
          <Col className='mb-3'>
            <Card>
              <Card.Body>
                <h4 className='card-title'>
                  <i className='bi bi-file-earmark-text'/> Fiche <code>*</code>
                </h4>
                <FeedbackError error={errors.type}/>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Card className='mb-3'>
          <Card.Body>
            <Row>
              <Col md={6} className='mb-3' style={{ borderRight: '1px solid lightgray' }}>
                <h5 className='card-title mt-2'>
                  <i className='bi bi-clipboard-pulse'/> Antécédents médicaux
                </h5>
                <Form.Control
                  disabled={false}
                  as='textarea'
                  value={fields.medicalBackground}
                  name='medicalBackground'
                  onChange={e => onFieldChange(e, fields, setFields)}
                  placeholder='...'
                  rows={8}/>
              </Col>
              
              <Col md={6} className='mb-3' style={{ borderLeft: '1px solid lightgray' }}>
                <h5 className='card-title mt-2'>
                  <i className='bi bi-file-medical me-1'/>
                  <small>
                    Mentions particulières - Allergies - Affections
                    chroniques ou Gynéco-obstétriques
                  </small>
                </h5>
                
                <Form.Control
                  disabled={false}
                  as='textarea'
                  value={fields.specialMentions}
                  name='specialMentions'
                  onChange={e => onFieldChange(e, fields, setFields)}
                  placeholder='...'
                  rows={8}/>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <Card className='mb-3'>
          <Card.Body>
            <Row>
              <Col md={6} className='mb-3' style={{ borderRight: '1px solid lightgray' }}>
                <h4 className='card-title mt-2'>
                  <i className='bi bi-heart-pulse'/> Chirurgicaux
                </h4>
                
                <Form.Control
                  disabled={false}
                  as='textarea'
                  value={fields.surgical}
                  name='surgical'
                  onChange={e => onFieldChange(e, fields, setFields)}
                  placeholder='...'
                  rows={8}/>
              </Col>
              
              <Col md={6} className='mb-3' style={{ borderLeft: '1px solid lightgray' }}>
                <h4 className='card-title mt-2'>
                  <i className='bi bi-heart-pulse-fill me-1'/>
                  Familiaux
                </h4>
                
                <Form.Control
                  disabled={false}
                  as='textarea'
                  value={fields.family}
                  name='family'
                  onChange={e => onFieldChange(e, fields, setFields)}
                  placeholder='...'
                  rows={8}/>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Body>
            <h4 className='card-title'><i className='bi bi-activity'/> Signes vitaux</h4>
            
            <Row>
              <Col md={6} className='mb-3'>
                <Form.Label htmlFor='temperature'>Température</Form.Label>
                <Form.Control
                  disabled={false}
                  isInvalid={errors.temperature !== null}
                  id='temperature'
                  name='temperature'
                  value={fields.temperature}
                  onChange={e => onFieldChange(e, fields, setFields)}
                  placeholder='T°'/>
                <FeedbackError error={errors.temperature}/>
              </Col>
              
              <Col md={6} className='mb-3'>
                <Form.Label htmlFor='weight'>Poids</Form.Label>
                <Form.Control
                  disabled={false}
                  isInvalid={errors.weight !== null}
                  id='weight'
                  name='weight'
                  value={fields.weight}
                  onChange={e => onFieldChange(e, fields, setFields)}
                  placeholder='Kg'/>
                <FeedbackError error={errors.weight}/>
              </Col>
              
              <Col md={6} className='mb-3'>
                <Form.Label htmlFor='bloodPressure'>Tension artérielle</Form.Label>
                <Form.Control
                  disabled={false}
                  isInvalid={errors.bloodPressure !== null}
                  id='bloodPressure'
                  name='bloodPressure'
                  value={fields.bloodPressure}
                  onChange={e => onFieldChange(e, fields, setFields)}
                  placeholder='Cm Hg, ...'/>
                <FeedbackError error={errors.bloodPressure}/>
              </Col>
              
              <Col md={6} className='mb-3'>
                <Form.Label htmlFor='cardiacFrequency'>Fréquence cardiaque</Form.Label>
                <Form.Control
                  disabled={false}
                  isInvalid={errors.cardiacFrequency !== null}
                  id='cardiacFrequency'
                  name='cardiacFrequency'
                  value={fields.cardiacFrequency}
                  onChange={e => onFieldChange(e, fields, setFields)}
                  placeholder='bpm, ...'/>
                <FeedbackError error={errors.cardiacFrequency}/>
              </Col>
              
              <Col md={6} className='mb-3'>
                <Form.Label htmlFor='respiratoryRate'>Fréquence respiratoire</Form.Label>
                <Form.Control
                  disabled={false}
                  isInvalid={errors.respiratoryRate !== null}
                  id='respiratoryRate'
                  name='respiratoryRate'
                  value={fields.respiratoryRate}
                  onChange={e => onFieldChange(e, fields, setFields)}
                  placeholder='Pm, ...'/>
                <FeedbackError error={errors.respiratoryRate}/>
              </Col>
              
              <Col md={6} className='mb-3'>
                <Form.Label htmlFor='oxygenSaturation'>Saturation en oxygène</Form.Label>
                <Form.Control
                  disabled={false}
                  isInvalid={errors.oxygenSaturation !== null}
                  id='oxygenSaturation'
                  name='oxygenSaturation'
                  value={fields.oxygenSaturation}
                  onChange={e => onFieldChange(e, fields, setFields)}
                  placeholder='SpO², ...'/>
                <FeedbackError error={errors.oxygenSaturation}/>
              </Col>
              
              <hr/>
              <div className='text-end'>
                <Button type='button' variant='light' disabled={false} className='me-1'>
                  <i className='bi bi-trash'/> Effacer
                </Button>
                
                <Button type='submit' disabled={false} className='me-1'>
                  <i className='bi bi-check'/> Valider
                </Button>
              </div>
            </Row>
          </Card.Body>
        </Card>
        
      </Form>
    </ErrorBoundary>
  )
}

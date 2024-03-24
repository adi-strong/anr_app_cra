import {ErrorBoundary} from "react-error-boundary";
import {DatePickerForm, FallBackRender, FeedbackError} from "../../../components";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import {useState} from "react";
import {onDatePickerChange} from "../../../services/form.handler.service";
import {hospErrors, hospFields} from "../model/hosp.service";
import placeholderImg from '../../../assets/images/placeholder/placeholder-4by3.svg';

export default function HospitalizationForm() {
  const [fields, setFields] = useState(hospFields)
  const [errors, setErrors] = useState(hospErrors)
  const [isSelected, setIsSelected] = useState(false)
  
  const toggleSelect = () => {
    setErrors(hospErrors)
    setFields(hospFields)
    setIsSelected(!isSelected)
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form onSubmit={e => e.preventDefault()}>
        <Card className='mt-5'>
          <Card.Body>
            <Row>
              <Col className='mb-3'>
                <h3 className='card-title'><i className='bi bi-hospital'/> Hospitalisation</h3>
              </Col>
              
              <Col className='mb-3'>
                <Form.Switch
                  disabled={false}
                  className='float-end'
                  id='isSelected'
                  label={<>Sélectionner pour hospitaliser le patient</>}
                  name='isSelected'
                  value={isSelected}
                  checked={isSelected}
                  onChange={toggleSelect}/>
              </Col>
            </Row>
            
            <Row>
              <Col md={6} className='mb-3'>
                <div className='mb-3'>
                  <Form.Label><code>*</code> Date d'arrivée</Form.Label> <br/>
                  <DatePickerForm
                    isRequired
                    disabled={!isSelected}
                    label={null}
                    date={fields.startAt}
                    onChange={e => onDatePickerChange(e, 'startAt', fields, setFields)}
                    name='releasedAt'/>
                  <FeedbackError error={errors.startAt}/>
                </div>
                
                <Row>
                  <Col md={6} className='mb-3'>
                    <Form.Label><code>*</code> Chambre</Form.Label>
                    <FeedbackError error={errors.bedroom}/>
                  </Col>
                  
                  <Col md={6} className='mb-3'>
                    <Form.Label><code>*</code> Lit d'hospitalisation</Form.Label>
                    <FeedbackError error={errors.bed}/>
                  </Col>
                </Row>
              </Col>
              
              <Col md={6} className='mb-3'>
                <Row>
                  <Col className='mb-3'>
                    <Form.Label>Date de sortie</Form.Label> <br/>
                    <DatePickerForm
                      disabled={!isSelected}
                      label={null}
                      date={fields.leaveAt}
                      onChange={e => onDatePickerChange(e, 'leaveAt', fields, setFields)}
                      name='releasedAt'/>
                    <FeedbackError error={errors.leaveAt}/>
                  </Col>
                  
                  <Col className='mb-3'>
                    <img src={placeholderImg} className='img-fluid' alt=''/>
                  </Col>
                </Row>
              </Col>
            </Row>
            
            <Button disabled={!isSelected} type='submit' className='d-block w-100'>
              Valider
            </Button>
          </Card.Body>
        </Card>
      </Form>
    </ErrorBoundary>
  )
}

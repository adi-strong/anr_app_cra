import {ErrorBoundary} from "react-error-boundary";
import {DatePickerForm, FallBackRender, FeedbackError, FieldsAlert, QuillEditor} from "../../../components";
import PropTypes from "prop-types";
import {Button, Col, Form, InputGroup, Modal, Row} from "react-bootstrap";
import {useState} from "react";
import {labErrors, labFields, labObserverOptions, onAddLabItem} from "../model/lab.service";
import {onDatePickerChange} from "../../../services/form.handler.service";
import {onArrayChange, onRemoveArrayItem} from "../../../services";

export default function LabFormModal({show, onHide}) {
  const [fields, setFields] = useState(labFields)
  const [errors, setErrors] = useState(labErrors)
  const [draft, setDraft] = useState('')
  
  function handleHide() {
    setErrors(labErrors)
    setFields(labFields)
    onHide()
  }
  
  function onInterpretationChange(value) {
    setDraft(value)
    setFields({...fields, interpretation: value})
  }
  
  const onBlur = () => setFields({...fields, interpretation: draft})
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Modal show={show} onHide={onHide} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title><i className='bi bi-plus'/> Paramètres d'analyse(s)</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <FieldsAlert/>
          
          <Row>
            <Col className='mb-3'>
              <Form.Label><code>*</code> Date</Form.Label> <br/>
              <DatePickerForm
                isRequired
                disabled={false}
                label={null}
                date={fields.releasedAt}
                onChange={e => onDatePickerChange(e, 'releasedAt', fields, setFields)}
                name='releasedAt'/>
            </Col>
            
            <Col className='mb-3'>
              <Form.Label><code>*</code> Patient(e)</Form.Label>
              <FeedbackError error={errors.patient}/>
            </Col>
          </Row>
          
          <div className='mb-3 bg-light p-2'>
            {fields.parameters.length > 0 && fields.parameters.map((p, i) =>
              <Row key={i}>
                <Col className='mb-1'>
                  <Form.Text><small><code>*</code> Prélèvement</small></Form.Text>
                  <Form.Control
                    required
                    autoFocus
                    autoComplete='off'
                    disabled={false}
                    size='sm'
                    name='levy'
                    value={p.levy}
                    onChange={e => onArrayChange(
                      e,
                      i,
                      'parameters',
                      fields.parameters,
                      fields,
                      setFields
                    )}/>
                </Col>
                
                <Col className='mb-1'>
                  <Form.Text><small>Paramètre</small></Form.Text>
                  <Form.Control
                    autoComplete='off'
                    disabled={false}
                    size='sm'
                    name='parameter'
                    value={p.parameter}
                    onChange={e => onArrayChange(
                      e,
                      i,
                      'parameters',
                      fields.parameters,
                      fields,
                      setFields
                    )}/>
                </Col>
                
                <Col className='mb-1'>
                  <Form.Text><small><code>*</code> Val. Trouvée</small></Form.Text>
                  <Form.Control
                    autoComplete='off'
                    required
                    disabled={false}
                    size='sm'
                    name='valueFound'
                    value={p.valueFound}
                    onChange={e => onArrayChange(
                      e,
                      i,
                      'parameters',
                      fields.parameters,
                      fields,
                      setFields
                    )}/>
                </Col>
                
                <Col className='mb-1'>
                  <Form.Text><small>Val. Réf.</small></Form.Text>
                  <Form.Control
                    disabled={false}
                    size='sm'
                    autoComplete='off'
                    name='referenceValue'
                    value={p.referenceValue}
                    onChange={e => onArrayChange(
                      e,
                      i,
                      'parameters',
                      fields.parameters,
                      fields,
                      setFields
                    )}/>
                </Col>
                
                <Col className='mb-1'>
                  <Form.Text><small>Unité</small></Form.Text>
                  <Form.Control
                    disabled={false}
                    autoComplete='off'
                    size='sm'
                    name='unit'
                    value={p.unit}
                    onChange={e => onArrayChange(
                      e,
                      i,
                      'parameters',
                      fields.parameters,
                      fields,
                      setFields
                    )}/>
                </Col>
                
                <Col className='mb-1'>
                  <Form.Text><small><code>*</code> Observation</small></Form.Text>
                  <InputGroup>
                    <Form.Select
                      required
                      disabled={false}
                      size='sm'
                      autoComplete='off'
                      name='observation'
                      value={p.observation}
                      onChange={e => onArrayChange(
                        e,
                        i,
                        'parameters',
                        fields.parameters,
                        fields,
                        setFields
                      )}>
                      {labObserverOptions.length > 0 && labObserverOptions.map(o =>
                        <option key={o.value} value={o.value}>{o.label}</option>)}
                    </Form.Select>
                    {fields.parameters.length > 1 &&
                      <Button
                        type='button'
                        size='sm'
                        variant='danger'
                        onClick={() => onRemoveArrayItem(
                          i,
                          'parameters',
                          fields.parameters,
                          fields,
                          setFields
                        )}
                        disabled={false}><i className='bi bi-dash'/></Button>}
                  </InputGroup>
                </Col>
              </Row>)}
            
            <Button
              disabled={false}
              type='button'
              variant='dark'
              className='d-block w-100 mt-2'
              onClick={() => onAddLabItem(fields, setFields)}
              size='sm'>
              <i className='bi bi-plus'/> Ajouter
            </Button>
          </div>
          
          <QuillEditor
            label='INTERPRÉTATION'
            value={fields.interpretation}
            onBlur={onBlur}
            onChange={onInterpretationChange}/>
        </Modal.Body>
        
        <Modal.Footer>
          <Button disabled={false} variant='light' onClick={handleHide}>
            <i className='bi bi-x'/> Annuler
          </Button>
          
          <Button disabled={false} onClick={handleHide}>
            <i className='bi bi-check'/> Valider
          </Button>
        </Modal.Footer>
      </Modal>
    </ErrorBoundary>
  )
}

LabFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
}

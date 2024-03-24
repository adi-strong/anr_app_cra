import {ErrorBoundary} from "react-error-boundary";
import {DatePickerForm, FallBackRender, FeedbackError, QuillEditor} from "../../../components";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import {onDatePickerChange} from "../../../services/form.handler.service";
import {useState} from "react";
import {onAddPrescriptionItem, prescriptionErrors, prescriptionFields, respOptions} from "../model";
import {onArrayChange, onRemoveArrayItem} from "../../../services";

export default function PrescriptionForm() {
  const [fields, setFields] = useState(prescriptionFields)
  const [errors/*, setErrors*/] = useState(prescriptionErrors)
  const [draft, setDraft] = useState('')
  
  function onCommentChange(value) {
    setDraft(value)
    setFields({...fields, comment: value})
  }
  
  const onBlur = () => setFields({...fields, comment: draft})
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form onSubmit={e => e.preventDefault()}>
        <div className='mb-3'>
          <Form.Label><code>*</code> Date</Form.Label> <br/>
          <DatePickerForm
            isRequired
            disabled={false}
            label={null}
            date={fields.releasedAt}
            onChange={e => onDatePickerChange(e, 'releasedAt', fields, setFields)}
            name='releasedAt'/>
        </div>
        
        <div className='mb-3 bg-light p-2'>
          <Form.Label className='mb-0'><code>*</code> PRESCRIPTION(s) :</Form.Label>
          {fields.orders.length > 0 && fields.orders.map((o, i) =>
            <Row key={i}>
              <Col className='mb-1'>
                <Form.Text><code>*</code> Produit / Recommandation, ...</Form.Text>
                <Form.Control
                  required
                  autoFocus
                  disabled={false}
                  autoComplete='off'
                  size='sm'
                  id='medicine'
                  name='medicine'
                  value={o.medicine}
                  onChange={e => onArrayChange(
                    e,
                    i,
                    'medicine',
                    fields.orders,
                    fields,
                    setFields,
                  )}/>
              </Col>
              
              <Col className='mb-1'>
                <Form.Text><code>*</code> Posologie / Directive, ...</Form.Text>
                <Form.Control
                  required
                  disabled={false}
                  autoComplete='off'
                  size='sm'
                  id='directing'
                  name='directing'
                  value={o.directing}
                  onChange={e => onArrayChange(
                    e,
                    i,
                    'medicine',
                    fields.orders,
                    fields,
                    setFields,
                  )}/>
              </Col>
              
              <Col className='mb-1'>
                <Form.Text>Responsabilité</Form.Text>
                <InputGroup>
                  <Form.Select
                    disabled={false}
                    autoComplete='off'
                    size='sm'
                    id='responsibilityOf'
                    name='responsibilityOf'
                    value={o.responsibilityOf}
                    onChange={e => onArrayChange(
                      e,
                      i,
                      'medicine',
                      fields.orders,
                      fields,
                      setFields,
                    )}>
                    {respOptions.length > 0 && respOptions.map(r =>
                      <option key={r.value} value={r.value}>{r.label}</option>)}
                  </Form.Select>
                  {fields.orders.length > 1 &&
                    <Button
                      type='button'
                      variant='danger'
                      size='sm'
                      onClick={() => onRemoveArrayItem(
                        i,
                        'orders',
                        fields.orders,
                        fields,
                        setFields
                      )}
                      disabled={false}>
                      <i className='bi bi-dash'/>
                    </Button>}
                </InputGroup>
              </Col>
            </Row>)}
          <FeedbackError error={errors.orders}/>
          
          <Button
            disabled={false}
            className='mt-2 d-block w-100'
            type='button'
            size='sm'
            variant='dark'
            onClick={() => onAddPrescriptionItem(fields, setFields)}>
            <i className='bi bi-plus'/> Ajouter
          </Button>
        </div>
        
        <QuillEditor
          value={fields.comment}
          label='Commentaire'
          onBlur={onBlur}
          onChange={onCommentChange}/>
      </Form>
    </ErrorBoundary>
  )
}

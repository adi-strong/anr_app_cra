import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, FieldsAlert} from "../../../components";
import PropTypes from "prop-types";
import {useMemo, useState} from "react";
import {
  finErrors,
  finFields,
  onAddExpenseItem,
  onExpenseItemChange,
  onFinReset,
  onRemoveExpenseItem
} from "../model/finances.service";
import {Button, Col, Form, InputGroup, Modal, Row} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";

export default function AddEntriesModal({show, onHide}) {
  const [fields, setFields] = useState(finFields)
  const [errors, setErrors] = useState(finErrors)
  
  const total = useMemo(() => {
    let sum = 0
    if (fields.items.length > 0) {
      const items = fields.items
      for (const key in items) {
        const item = items[key]
        const qty = isNaN(parseFloat(item.qty)) || item.qty < 0 ? 1 : parseFloat(item.qty)
        const amount = isNaN(parseFloat(item.amount)) || item.amount < 0 ? 1 : parseFloat(item.amount)
        sum += (amount * qty)
      }
    }
    
    return sum
  }, [fields])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Modal show={show} onHide={onHide} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title><i className='bi bi-plus'/> Enregistrer une entrée</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <FieldsAlert/>
          
          <div className='mb-3'>
            <Form.Label htmlFor='name'><code>*</code> Motif / Raison</Form.Label>
            <Form.Control
              required
              autoFocus
              disabled={false}
              autoComplete='off'
              isInvalid={errors.reason !== null}
              name='reason'
              value={fields.reason}
              onChange={e => onFieldChange(e, fields, setFields)}/>
            <FeedbackError error={errors.reason}/>
          </div>
          
          <Row>
            <Col className='mb-3'>
              <Form.Label htmlFor='bearer'><code>*</code> Porteur</Form.Label>
              <Form.Control
                required
                autoComplete='off'
                disabled={false}
                isInvalid={errors.bearer !== null}
                name='bearer'
                value={fields.bearer}
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.bearer}/>
            </Col>
            
            <Col>
              <Form.Label htmlFor='currency'><code>*</code> Devise</Form.Label>
            </Col>
          </Row>
          
          <div className='p-2 bg-light mb-3' style={{ border: '1px solid lightgray' }}>
            {fields.items.length > 0 && fields.items.map((t, i) =>
              <Row key={i} className='mb-2'>
                <Col className='mb-1'>
                  <Form.Text>Type</Form.Text>
                  <Form.Control
                    autoFocus
                    disabled={false}
                    autoComplete='off'
                    size='sm'
                    name='name'
                    value={t.name}
                    onChange={e => onExpenseItemChange(e, i, fields, setFields)}/>
                </Col>
                <Col className='mb-1'>
                  <Form.Text>Nbre / Qté</Form.Text>
                  <Form.Control
                    disabled={false}
                    autoComplete='off'
                    size='sm'
                    type='number'
                    name='qty'
                    value={t.qty}
                    onChange={e => onExpenseItemChange(e, i, fields, setFields)}/>
                </Col>
                <Col className='mb-1'>
                  <InputGroup>
                    <Form.Control
                      disabled={false}
                      autoComplete='off'
                      size='sm'
                      style={{ position: 'relative', top: 22 }}
                      type='number'
                      name='amount'
                      value={t.amount}
                      onChange={e => onExpenseItemChange(e, i, fields, setFields)}/>
                    <InputGroup.Text style={{ position: 'relative', top: 22, height: 29.69 }}>
                      FC
                    </InputGroup.Text>
                    {fields.items.length > 1 &&
                      <Button
                        disabled={false}
                        variant='danger'
                        size='sm'
                        onClick={() => onRemoveExpenseItem(i, fields, setFields)}
                        style={{ position: 'relative', top: 22 }}>
                        <i className='bi bi-dash'/>
                      </Button>}
                  </InputGroup>
                </Col>
              </Row>)}
            
            <Button
              disabled={false}
              variant='dark'
              size='sm'
              className='w-100 d-block'
              onClick={() =>onAddExpenseItem(fields, setFields)}>
              <i className='bi bi-plus'/>
            </Button>
          </div>
          
          <div
            className='p-2 bg-light d-flex justify-content-between'
            style={{ border: '1px solid lightgray' }}>
            <span style={{ fontWeight: 800 }}>TOTAL</span>
            <span style={{ fontWeight: 800 }}>
              {total} FC
            </span>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <Button
            variant='light'
            className='me-1 mb-1'
            onClick={() => onFinReset(setErrors, setFields)}
            disabled={false}>
            <i className='bi bi-trash'/> Effacer
          </Button>
          
          <Button disabled={false} className='mb-1' onClick={() => {}}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </ErrorBoundary>
  )
}

AddEntriesModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
}

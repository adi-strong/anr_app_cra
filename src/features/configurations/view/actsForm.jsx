import {useState} from "react";
import {provinceFields, onAddTypeItem} from "../model/province.service";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError} from "../../../components";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import {onExpenseCatItemChange, onRemoveExpenseCatItem} from "../../finances/model/expense.categoy.service";
import PropTypes from "prop-types";

export default function ActsForm({onHide}) {
  const [validated/*, setValidated*/] = useState(false)
  const [fields, setFields] = useState(provinceFields)
  // const [currency , setCurrency] = useState(null)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form
        noValidate
        validated={validated}
        onSubmit={e => {}}>
        
        <div className='mb-3'>
          <Form.Label htmlFor='currency'><code>*</code> Devise</Form.Label>
        </div>
        
        {fields.length > 0 && fields.map((f, i) =>
          <Row key={i} className='mb-1'>
            <Col className='mb-1'>
              <Form.Text>Nom de l'acte</Form.Text>
              <Form.Control
                required
                autoFocus
                disabled={false}
                autoComplete='off'
                isInvalid={f.errors.name !== null}
                name='name'
                value={f.name}
                onChange={e => onExpenseCatItemChange(e, i, fields, setFields)}/>
              <FeedbackError error={f.errors.name}/>
            </Col>
            
            <Col className='mb-1'>
              <Form.Text>Prix</Form.Text>
              <InputGroup className='mb-1'>
                <Form.Control
                  required
                  disabled={false}
                  autoComplete='off'
                  isInvalid={f.errors.price !== null}
                  type='number'
                  name='price'
                  value={f.price}
                  onChange={e => onExpenseCatItemChange(e, i, fields, setFields)}/>
                <InputGroup.Text>FC</InputGroup.Text>
                {fields.length > 1 &&
                  <Button
                    disabled={false}
                    type='button'
                    variant='danger'
                    onClick={() => onRemoveExpenseCatItem(
                      i,
                      fields,
                      setFields
                    )}><i className='bi bi-dash'/></Button>}
              </InputGroup>
              <FeedbackError error={f.errors.price}/>
            </Col>
          </Row>)}
        {fields.length < 10 &&
          <Button
            type='button'
            variant='dark'
            disabled={false}
            className='d-block w-100'
            onClick={() => onAddTypeItem(
              fields,
              setFields
            )}><i className='bi bi-plus'/></Button>} <hr/>
        
        <div className='text-end'>
          <Button
            type='button'
            variant='light'
            className='me-1 mb-1'
            onClick={() => {}}
            disabled={false}>
            <i className='bi bi-trash'/> Effacer
          </Button>
          
          <Button type='submit' disabled={false} className='mb-1'>
            Enregistrer
          </Button>
        </div>
      </Form>
    </ErrorBoundary>
  )
}

ActsForm.propTypes = { onHide: PropTypes.func.isRequired }

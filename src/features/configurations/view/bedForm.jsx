import {useState} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError} from "../../../components";
import {Button, Form, InputGroup} from "react-bootstrap";
import PropTypes from "prop-types";
import {bedErrors, bedFields} from "../model/bed.service";
import {onFieldChange} from "../../../services/form.handler.service";

export default function BedForm({onHide}) {
  const [validated/*, setValidated*/] = useState(false)
  const [fields, setFields] = useState(bedFields)
  const [errors/*, setErrors*/] = useState(bedErrors)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form
        noValidate
        validated={validated}
        onSubmit={e => {}}>
        
        <div className='mb-3'>
          Image
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='name'><code>*</code> N° / Désignation</Form.Label>
          <Form.Control
            required
            autoFocus
            id='name'
            disabled={false}
            autoComplete='off'
            isInvalid={errors.name !== null}
            name='name'
            value={fields.name}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.name}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='currency'><code>*</code> Devise</Form.Label>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='price' className='me-1'><code>*</code> Prix</Form.Label>
          <Form.Text>(/ jour)</Form.Text>
          <InputGroup>
            <Form.Control
              required
              id='price'
              type='number'
              disabled={false}
              autoComplete='off'
              isInvalid={errors.price !== null}
              name='price'
              value={fields.price}
              onChange={e => onFieldChange(e, fields, setFields)}/>
            <InputGroup.Text>$</InputGroup.Text>
          </InputGroup>
          <FeedbackError error={errors.price}/>
        </div>
        
        <div>
          <Form.Label htmlFor='currency'>Chambre</Form.Label>
        </div> <hr/>
        
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

BedForm.propTypes = { onHide: PropTypes.func.isRequired }

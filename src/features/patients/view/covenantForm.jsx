import {ErrorBoundary} from "react-error-boundary";
import {FeedbackError, FallBackRender, FieldsAlert} from "../../../components";
import {Button, Card, Form} from "react-bootstrap";
import CovenantsList from "./CovenantsList";
import PropTypes from "prop-types";
import {useState} from "react";
import {covenantErrors, covenantFields, onCovenantSubmit} from "../model/patients.service";
import {onFieldChange} from "../../../services/form.handler.service";

export default function CovenantForm({data, loader = false}) {
  const [validated, setValidated] = useState(false)
  const [fields, setFields] = useState(covenantFields)
  const [errors, setErrors] = useState(covenantErrors)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form
        noValidate
        validated={validated}
        onSubmit={e => onCovenantSubmit(
          e,
          fields,
          setFields,
          errors,
          setErrors,
          setValidated,
        )}>
        <FieldsAlert/>
        Logo
        
        <div className='mb-3'>
          <Form.Label htmlFor='name'><code>*</code> Dénomination</Form.Label>
          <Form.Control
            required
            autoFocus
            autoComplete='off'
            disabled={false}
            isInvalid={errors.name !== null}
            name='name'
            value={fields.name}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.name}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='focal'>Point focal</Form.Label>
          <Form.Control
            autoComplete='off'
            disabled={false}
            isInvalid={errors.focal !== null}
            name='focal'
            value={fields.focal}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.focal}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='phone'><code>*</code> N° Tél</Form.Label>
          <Form.Control
            required
            autoComplete='off'
            disabled={false}
            isInvalid={errors.phone !== null}
            name='phone'
            value={fields.phone}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.phone}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            autoComplete='off'
            type='email'
            isInvalid={errors.email !== null}
            disabled={false}
            name='email'
            value={fields.email}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.email}/>
        </div>
        
        <div>
          <Form.Label htmlFor='address'><code>*</code> Adresse</Form.Label>
          <Form.Control
            required
            autoComplete='off'
            as='textarea'
            isInvalid={errors.address !== null}
            disabled={false}
            name='address'
            placeholder='Adresse de la société...'
            value={fields.address}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.address}/>
        </div> <hr/>
        
        <Card.Title className='mb-3'><i className='bi bi-pin-map-fill'/> Emplacement</Card.Title>
        <div className='mb-3'>
          <Form.Label htmlFor='longitude'>Longitude</Form.Label>
          <Form.Control
            autoComplete='off'
            isInvalid={errors.longitude !== null}
            disabled={false}
            name='longitude'
            value={fields.longitude}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.longitude}/>
        </div>
        
        <div>
          <Form.Label htmlFor='latitude'>Latitude</Form.Label>
          <Form.Control
            autoComplete='off'
            isInvalid={errors.latitude !== null}
            disabled={false}
            name='latitude'
            value={fields.latitude}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.latitude}/>
        </div>
        
        
        <hr/>
        <div className='text-end'>
          <Button
            type='button'
            variant='light'
            className='me-1 mb-1'
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

CovenantsList.propTypes = {
  data: PropTypes.any,
  loader: PropTypes.bool,
}

import {ErrorBoundary} from "react-error-boundary";
import {FeedbackError, FallBackRender} from "../../../components";
import {useState} from "react";
import {accountPasswordErrors, accountPasswordFields, onPasswordSubmit} from "../model";
import {Button, Col, Form} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";

export default function ChangePasswordForm() {
  const [validated, setValidated] = useState(false)
  const [fields, setFields] = useState(accountPasswordFields)
  const [errors, setErrors] = useState(accountPasswordErrors)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form
        noValidate
        validated={validated}
        onSubmit={e => onPasswordSubmit(
          e,
          fields,
          setFields,
          errors,
          setErrors,
          setValidated
        )}>
        
        <Form.Group className='mb-3 row'>
          <Col md={4} className='mb-1 text-uppercase'>
            <Form.Label htmlFor='password'>Nouveau mot de passe</Form.Label>
          </Col>
          
          <Col md={8} className='mb-1'>
            <Form.Control
              required
              autoFocus
              isInvalid={errors.password !== null}
              disabled={false}
              autoComplete='off'
              type='password'
              id='password'
              name='password'
              placeholder='**************'
              value={fields.password}
              onChange={e => onFieldChange(e, fields, setFields)}/>
            <FeedbackError error={errors.password}/>
          </Col>
        </Form.Group>
        
        <Form.Group className='mb-3 row'>
          <Col md={4} className='mb-1 text-uppercase'>
            <Form.Label htmlFor='repeatPassword'>Confirmation</Form.Label>
          </Col>
          
          <Col md={8} className='mb-1'>
            <Form.Control
              disabled={false}
              isInvalid={errors.repeatPassword !== null}
              autoComplete='off'
              type='password'
              id='repeatPassword'
              name='repeatPassword'
              placeholder='**************'
              value={fields.repeatPassword}
              onChange={e => onFieldChange(e, fields, setFields)}/>
            <FeedbackError error={errors.repeatPassword}/>
          </Col>
        </Form.Group>
        
        <div className='text-end'>
          <Button disabled={false} type='submit'>
            Modifier
          </Button>
        </div>
        
      </Form>
    </ErrorBoundary>
  )
}

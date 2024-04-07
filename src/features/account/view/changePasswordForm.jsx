import {ErrorBoundary} from "react-error-boundary";
import {FeedbackError, FallBackRender} from "../../../components";
import {useEffect, useState} from "react";
import {accountPasswordErrors, accountPasswordFields} from "../model";
import {Button, Col, Form, Spinner} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";
import {useEditUserPasswordMutation} from "../../staff/model/user.api.slice";
import toast from "react-hot-toast";

export default function ChangePasswordForm({data}) {
  const [fields, setFields] = useState(accountPasswordFields)
  const [errors, setErrors] = useState(accountPasswordErrors)
  const [editUserPassword, {isLoading, isError, error}] = useEditUserPasswordMutation()
  
  const onReset = () => {
    setErrors(accountPasswordErrors)
    setFields(accountPasswordFields)
  }
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setErrors(accountPasswordErrors)
    if (fields.password !== fields.repeatPassword) {
      setErrors(s => ({...s, repeatPassword: 'Mots de passe non identiques.'}))
    }
    else {
      try {
        const send = await editUserPassword({...fields, id: data.id})
        if (send?.data) {
          toast.success('Modification bien efféctuée.')
          onReset()
        }
      } catch (e) {
        toast.error('Problème de connexion.')
      }
    }
  }
  
  useEffect(() => {
    if (isError) {
      const {violations} = error?.data
      if (violations) violations.forEach(({ propertyPath, message }) => {
        setErrors(s => ({...s, [propertyPath]: message}))
      })
    }
  }, [isError, error])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form onSubmit={onSubmit}>
        
        <Form.Group className='mb-3 row'>
          <Col md={4} className='mb-1 text-uppercase'>
            <Form.Label htmlFor='password'>Nouveau mot de passe</Form.Label>
          </Col>
          
          <Col md={8} className='mb-1'>
            <Form.Control
              required
              autoFocus
              isInvalid={errors.password !== null}
              disabled={isLoading}
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
              disabled={isLoading}
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
          <Button disabled={isLoading} type='submit'>
            {isLoading && <Spinner animation='grow' size='sm' className='me-1'/>}
            {isLoading ? 'Veuillez patienter' : 'Modifier'}
          </Button>
        </div>
        
      </Form>
    </ErrorBoundary>
  )
}

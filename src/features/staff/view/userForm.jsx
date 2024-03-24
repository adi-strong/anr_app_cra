import {useState} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, FieldsAlert} from "../../../components";
import {Button, Form} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";
import CovenantsList from "../../patients/view/CovenantsList";
import PropTypes from "prop-types";
import {userErrors, userFields} from "../model/user.service";

export default function UserForm({data, loader = false}) {
  const [validated/*, setValidated*/] = useState(false)
  const [fields, setFields] = useState(userFields)
  const [errors/*, setErros*/] = useState(userErrors)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form
        noValidate
        validated={validated}
        onSubmit={e => {}}>
        <FieldsAlert/>
        
        <div className='mb-3'>
          <Form.Label htmlFor='username'><code>*</code> Username</Form.Label>
          <Form.Control
            required
            autoFocus
            autoComplete='off'
            disabled={false}
            isInvalid={errors.username !== null}
            name='username'
            value={fields.username}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.username}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='password'><code>*</code> Mot de passe</Form.Label>
          <Form.Control
            required
            autoComplete='off'
            disabled={false}
            type='password'
            isInvalid={errors.password !== null}
            name='password'
            value={fields.password}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.password}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='confirmPassword'>Confirmation du mot de passe</Form.Label>
          <Form.Control
            autoComplete='off'
            disabled={false}
            type='password'
            isInvalid={errors.confirmPassword !== null}
            name='confirmPassword'
            value={fields.confirmPassword}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.confirmPassword}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='agent'>Agent</Form.Label>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='fullName'><code>*</code> Nom complet</Form.Label>
          <Form.Control
            required
            autoComplete='off'
            disabled={false}
            isInvalid={errors.fullName !== null}
            name='fullName'
            value={fields.fullName}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.fullName}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='email'><code>*</code> Email</Form.Label>
          <Form.Control
            required
            autoComplete='off'
            disabled={false}
            type='email'
            isInvalid={errors.email !== null}
            name='email'
            value={fields.email}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.email}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='phone'><code>*</code> N° de téléphone</Form.Label>
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
        
        <div>
          <Form.Switch
            required
            disabled={false}
            isInvalid={errors.isActive !== null}
            type='checkbox'
            id='isActive'
            label={<>Activation / Désactivation <code>*</code></>}
            name='isActive'
            value={fields.isActive}
            checked={fields.isActive}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.isActive}/>
        </div> <hr/>
        
        <div className='text-end'>
          <Button
            type='button'
            variant='light'
            className='me-1 mb-1'
            disabled={false}>
            <i className='bi bi-trash'/> Effacer
          </Button>
          
          <Button type='submit' disabled={false} className='mb-1'>
            Valider
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

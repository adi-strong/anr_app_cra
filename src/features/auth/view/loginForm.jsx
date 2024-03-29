import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Alert, Button, Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import {credentials, onCredentialSubmit} from "../services/auth.service";
import {onFieldChange} from "../../../services/form.handler.service";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useAuthMutation} from "../services/auth.api.slice";

export default function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const from = location?.state?.from?.pathname || '/app/profile'
  
  const [fields, setFields] = useState(credentials)
  const [error, setError] = useState(null)
  const [auth, {isLoading}] = useAuthMutation()
  
  const {token} = useSelector(state => state.auth)
  
  useEffect(() => {
    if (token) navigate(from, {replace: true})
  }, [token, navigate, from])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      {error &&
        <Alert dismissible variant='danger' onClick={() => setError(null)}>
          <i className='bi bi-exclamation-circle-fill'/> {error}.
        </Alert>}
      
      <Form onSubmit={e => onCredentialSubmit(
        e,
        fields,
        setFields,
        navigate,
        auth,
        setError,
        dispatch
      )}>
        <div className='mb-3'>
          <Form.Label htmlFor='username' className='text-uppercase'>Username</Form.Label>
          <Form.Control
            autoFocus
            disabled={isLoading}
            autoComplete='off'
            placeholder="Entrez votre nom d'utilisateur"
            id='username'
            name='username'
            value={fields.username}
            onChange={e => onFieldChange(e, fields, setFields)}/>
        </div>
        <div className='mb-3'>
          <div className='d-flex justify-content-between'>
            <Form.Label htmlFor='password' className='text-uppercase'>Mot de passe</Form.Label>
            <Link to='#!'>
              <small>Mot de Passe Oublié ?</small>
            </Link>
          </div>
          
          <div className='input-group input-group-merge'>
            <Form.Control
              disabled={isLoading}
              autoComplete='off'
              type='password'
              placeholder='············'
              id='password'
              name='password'
              value={fields.password}
              onChange={e => onFieldChange(e, fields, setFields)}/>
          </div>
        </div>
        
        <div>
          <Button disabled={isLoading} className='d-grid w-100 d-block' type='submit'>
            {!isLoading && 'Se connecter'}
            {isLoading && <>Veuillez patinter</>}
          </Button>
        </div>
      </Form>
    </ErrorBoundary>
  )
}

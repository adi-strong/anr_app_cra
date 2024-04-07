import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError} from "../../../components";
import {useEffect, useState} from "react";
import {useEditUserPasswordMutation} from "../model/user.api.slice";
import toast from "react-hot-toast";
import {Button, Form, Spinner} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";
import {entrypoint} from "../../../app/store";
import avatar2 from "../../../assets/images/avatar/default_profile.jpg";
import {roleLabel} from "../model/user.service";

export default function EditUserPassForm({data, onHide, onRefresh}) {
  const [fields, setFields] = useState({password: ''})
  const [errors, setErrors] = useState({password: null})
  const [editUserPassword, {isLoading, isError, error}] = useEditUserPasswordMutation()
  
  const onReset = () => {
    setErrors({password: null})
    setFields({password: ''})
  }
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setErrors({password: null})
    if (data) {
      try {
        const send = await editUserPassword({...fields, id: data.id})
        if (send?.data) {
          toast.success('Réinitialisation bien efféctuée.')
          onReset()
          onHide()
          onRefresh()
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
        {data && (
          <div className='mb-3'>
            <p>
              <img
                src={data?.agentAccount && data.agentAccount?.profile
                  ? entrypoint+data.agentAccount.profile?.contentUrl
                  : avatar2}
                alt=""
                className='avatar-md avatar rounded-circle me-2'/>
              <span className='text-dark'>{data.username}</span> ({data?.fullName}){' '}
              [{roleLabel[data?.roles[0]]}]
            </p>
          </div>
        )}
        
        <div>
          <Form.Label htmlFor='password'><code>*</code> Mot de passe</Form.Label>
          <Form.Control
            required
            autoComplete='off'
            disabled={isLoading}
            type='password'
            isInvalid={errors.password !== null}
            name='password'
            value={fields.password}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.password}/>
        </div> <hr/>
        
        <Button type='submit' disabled={isLoading} className='mb-1'>
          {!isLoading && <i className='bi bi-check me-1'/>}
          {isLoading && <Spinner animation='grow' size='sm' className='me-1'/>}
          {isLoading ? 'Veuillez patienter' : 'Valider'}
        </Button>
      </Form>
    </ErrorBoundary>
  )
}

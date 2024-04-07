import {useEffect, useMemo, useState} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, FieldsAlert, ReactSelectField} from "../../../components";
import {Button, Form, Spinner} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";
import CovenantsList from "../../patients/view/CovenantsList";
import PropTypes from "prop-types";
import {rolesOptions, userErrors, userFields} from "../model/user.service";
import {useGetAgentsListQuery, useLazyGetLoadAgentsQuery} from "../model/agent.api.slice";
import toast from "react-hot-toast";
import {useSelector} from "react-redux";
import {useEditUserMutation, usePostNewUserMutation} from "../model/user.api.slice";

export default function UserForm({data, onRefresh, onHide, loader = false}) {
  const [fields, setFields] = useState(userFields)
  const [errors, setErrors] = useState(userErrors)
  const [getLoadAgents] = useLazyGetLoadAgentsQuery()
  const [postNewUser, {isLoading, isError, error}] = usePostNewUserMutation()
  const [editUser, {isLoading: isEditLoading, isError: isEditError, error: editError}] = useEditUserMutation()
  
  const {nbPages} = useSelector(state => state.config)
  const {data: agents=[], isLoading: isALoading, isError: isAError, error: aError} = useGetAgentsListQuery(nbPages)
  
  let agentOptions
  const {user: session} = useSelector(state => state.auth)
  
  agentOptions = useMemo(() => {
    let obj = []
    if (!isAError && agents.length > 0) {
      obj = agents.map(p => ({
        label: p?.name?.toUpperCase()+' '+(p?.firstName ? p.firstName.toUpperCase()+' ' : ''),
        value: `/api/agents/${p.id}`,
        pseudo: p?.pseudo,
        phone: p?.phone,
      }))
    }
    
    return obj
  }, [isAError, agents])
  
  async function onLoadAgents(keywords) {
    try {
      const search = await getLoadAgents(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  useEffect(() => {
    if (isAError) {
      if (aError?.error) toast.error(aError.error)
      if (aError?.data && aError.data['hydra:description']) toast.error(aError.data['hydra:description'])
    }
  }, [isAError, aError]) // agent errors
  
  const onReset = () => {
    setErrors(userErrors)
    setFields(userFields)
  }
  
  const onAgentChange = e => {
    const agentAccount = e
    const phone = e && e?.phone ? e.phone : ''
    const username = e ? e?.pseudo : ''
    const fullName = e ? e?.label?.toLowerCase() : ''
    
    setFields(s => ({...s, phone, username, fullName, agentAccount}))
  }
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setErrors(userErrors)
    if (!data && fields.password !== fields.confirmPassword) {
      setErrors(s => ({...s, confirmPassword: 'Mots de passe non identiques.'}))
    }
    else {
      try {
        const send = data ? await editUser(fields) : await postNewUser(fields)
        if (send?.data) {
          toast.success('Opération bien efféctuée.')
          if (!data) onReset()
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
    if (isEditError) {
      const {violations} = editError?.data
      if (violations) violations.forEach(({ propertyPath, message }) => {
        setErrors(s => ({...s, [propertyPath]: message}))
      })
    }
  }, [isError, isEditError, editError, error])
  
  useEffect(() => {
    if (data) {
      const agentAccount = data?.agentAccount ? {
        label: data.agentAccount?.name?.toUpperCase()+' '+(data.agentAccount?.firstName ? data.agentAccount.firstName.toUpperCase()+' ' : ''),
        value: `/api/agents/${data.agentAccount.id}`,
        pseudo: data.agentAccount?.pseudo,
        phone: data.agentAccount?.phone,
      } : null
      
      setFields({
        username: data.username,
        fullName: data?.fullName ? data.fullName : '',
        role: data?.roles && data.roles.length > 0 ? data.roles[0] : '',
        phone: data?.phone ? data.phone : '',
        email: data?.email ? data.email : '',
        isActive: data?.isActive,
        id: data.id,
        agentAccount,
      })
    }
  }, [data])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form
        onSubmit={onSubmit}>
        <FieldsAlert/>
        
        <div className='mb-3'>
          <Form.Label htmlFor='agent'>Agent</Form.Label>
          <ReactSelectField
            isAsync
            disabled={isALoading || isLoading || isEditLoading}
            value={fields.agentAccount}
            values={agentOptions}
            onChange={e => onAgentChange(e)}
            onLoadOptions={onLoadAgents}
            placeholder='-- Compte agent --'/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='username'><code>*</code> Username</Form.Label>
          <Form.Control
            required
            autoFocus
            autoComplete='off'
            disabled={isLoading || isEditLoading}
            isInvalid={errors.username !== null}
            name='username'
            value={fields.username}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.username}/>
        </div>
        
        {!data && (
          <>
            <div className='mb-3'>
              <Form.Label htmlFor='password'><code>*</code> Mot de passe</Form.Label>
              <Form.Control
                required
                autoComplete='off'
                disabled={isLoading || isEditLoading}
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
                disabled={isLoading || isEditLoading}
                type='password'
                isInvalid={errors.confirmPassword !== null}
                name='confirmPassword'
                value={fields.confirmPassword}
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.confirmPassword}/>
            </div>
          </>
        )}
        
        <div className='mb-3'>
          <Form.Label htmlFor='fullName'><code>*</code> Nom complet</Form.Label>
          <Form.Control
            required
            autoComplete='off'
            disabled={isLoading || isEditLoading}
            isInvalid={errors.fullName !== null}
            name='fullName'
            value={fields.fullName}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.fullName}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            autoComplete='off'
            disabled={isLoading || isEditLoading}
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
            disabled={isLoading || isEditLoading}
            isInvalid={errors.phone !== null}
            name='phone'
            value={fields.phone}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.phone}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='role'>Rôle utilisateur</Form.Label>
          <Form.Select
            autoComplete='off'
            disabled={isLoading || isEditLoading}
            id='role'
            name='role'
            value={fields.role}
            onChange={e => onFieldChange(e, fields, setFields)}>
            {rolesOptions.length > 0 && rolesOptions.map((r, i) =>
              (i < rolesOptions.length - 1) &&
              <option key={i} value={r.value}>{r.label}</option>)}
            {session && session?.roles[0] === 'ROLE_SUPER_ADMIN' && (
              <option value={rolesOptions[rolesOptions.length - 1]}>{rolesOptions[rolesOptions.length - 1].label}</option>
            )}
          </Form.Select>
        </div>
        
        <div>
          <Form.Switch
            disabled={isLoading || isEditLoading}
            isInvalid={errors.isActive !== null}
            type='checkbox'
            id='isActive'
            label={<>Activation / Désactivation</>}
            name='isActive'
            value={fields.isActive}
            checked={fields.isActive}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.isActive}/>
        </div> <hr/>
        
        <div className='text-end'>
          {!data &&
            <Button
              type='button'
              variant='light'
              className='me-1 mb-1'
              onClick={onReset}
              disabled={isLoading || isEditLoading}>
              <i className='bi bi-trash'/> Effacer
            </Button>}
          
          <Button type='submit' disabled={isLoading || isEditLoading} className='mb-1'>
            {!(isLoading || isEditLoading) && <i className='bi bi-check me-1'/>}
            {(isLoading || isEditLoading) && <Spinner animation='grow' size='sm' className='me-1'/>}
            {(isLoading || isEditLoading) ? 'Veuillez patienter' : 'Valider'}
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

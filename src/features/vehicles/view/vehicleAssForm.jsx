import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, ReactSelectField} from "../../../components";
import {Button, Form, Spinner} from "react-bootstrap";
import {useEffect, useMemo, useState} from "react";
import {vehicleAssErrors, vehicleAssFields} from "../model/vehicle.service";
import {useGetAgentsListQuery, useLazyGetLoadAgentsQuery} from "../../staff/model/agent.api.slice";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import {onFieldChange} from "../../../services/form.handler.service";
import {usePostNewVehicleAssignmentMutation} from "../model/vehicle.ass.api.slice";

export default function VehicleAssForm({vehicle, onHide, onRefresh}) {
  const [fields, setFields] = useState(vehicleAssFields)
  const [errors, setErrors] = useState(vehicleAssErrors)
  const [isSelected, setIsSelected] = useState(false)
  const [getLoadAgents] = useLazyGetLoadAgentsQuery()
  const [postNewVehicleAssignment, {isLoading, isError, error}] = usePostNewVehicleAssignmentMutation()
  
  const {nbPages} = useSelector(state => state.config)
  const {data: agents=[], isLoading: isAgentLoading, isError: isAgentError} = useGetAgentsListQuery(nbPages)
  
  let agentOptions
  agentOptions = useMemo(() => {
    let obj
    if (!isAgentError && agents.length > 0) {
      obj = agents.map(p => ({
        label: p?.name?.toUpperCase()+' '+(p?.firstName ? p.firstName.toUpperCase()+' ' : ''),
        value: `/api/agents/${p.id}`,
      }))
    }
    
    return obj
  }, [isAgentError, agents])
  
  const toggleIsSelected = () => {
    const value = !isSelected
    setIsSelected(value)
    setFields({...fields, startAt: '', endAt: ''})
  }
  
  const onReset = () => {
    setErrors(vehicleAssErrors)
    setFields(vehicleAssFields)
  }
  
  async function onLoadAgents(keywords) {
    try {
      const search = await getLoadAgents(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setErrors(vehicleAssErrors)
    let send
    
    const formData = new FormData()
    
    if (fields?.agent) formData.append('agent', fields.agent?.value)
    if (fields?.startAt) formData.append('startAt', fields.startAt)
    if (fields?.endAt) formData.append('endAt', fields.endAt)
    if (fields?.file) formData.append('file', fields.file)
    
    if (vehicle) {
      formData.append('vehicle', vehicle['@id'])
      
      if (!isSelected) {
        if (!(fields.startAt && fields.endAt)) toast.error('La durée doit être renseignée.')
        else {
          send = await postNewVehicleAssignment(formData)
          if (send?.data) {
            toast.success('Opération bien efféctuée.')
            onReset()
            onHide()
            onRefresh()
          }
        }
      }
      else {
        send = await postNewVehicleAssignment(formData)
        if (send?.data) {
          toast.success('Opération bien efféctuée.')
          onReset()
          onHide()
          onRefresh()
        }
      }
    }
  }
  
  useEffect(() => {
    if (isError) {
      const {violations} = error?.data
      if (violations) violations.forEach(({ propertyPath, message }) => {
        setErrors(s => ({ ...s, [propertyPath]: message }))
      })
    }
  }, [isError, error])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form onSubmit={onSubmit}>
        <div className='mb-3'>
          <Form.Label><code>*</code> Agent</Form.Label>
          <ReactSelectField
            isAsync
            required
            disabled={isAgentLoading || isLoading}
            value={fields.agent}
            values={agentOptions}
            onChange={e => setFields({...fields, agent: e})}
            onLoadOptions={onLoadAgents}
            placeholder='-- --'/>
          {errors?.agent && <code><i className='bi bi-exclamation-circle-fill'/> {errors.agent}</code>}
        </div>
        
        <div className='mb-3'>
          <Form.Switch
            disabled={isLoading}
            type='checkbox'
            id='isSelected'
            value={isSelected}
            checked={isSelected}
            onChange={toggleIsSelected}
            label={<div>Durée {isSelected && ' : Indéterminée'}</div>}/>
        </div>
        
        {!isSelected && (
          <>
            <div className='mb-3'>
              <Form.Label htmlFor='startAt'><code>*</code> Date de début</Form.Label>
              <Form.Control
                disabled={isLoading}
                id='startAt'
                type='date'
                name='startAt'
                value={fields.startAt}
                onChange={e => onFieldChange(e, fields, setFields)}/>
            </div>
            
            <div>
              <Form.Label htmlFor='endAt'><code>*</code> Date de fin</Form.Label>
              <Form.Control
                disabled={isLoading}
                id='endAt'
                type='date'
                name='endAt'
                value={fields.endAt}
                onChange={e => onFieldChange(e, fields, setFields)}/>
            </div>
          </>
        )}
        
        <hr/>
        <div className='text-end'>
          <Button disabled={isLoading} type='button' variant='light' className='me-1' onClick={onReset}>
            <i className='bi bi-trash'/> Effacer
          </Button>
          
          <Button type='submit' disabled={isLoading}>
            {isLoading && <Spinner animation='grow' size='sm' className='me-1'/>}
            {isLoading ? 'Veuillez patienter' : 'Valider'}
          </Button>
        </div>
      </Form>
    </ErrorBoundary>
  )
}

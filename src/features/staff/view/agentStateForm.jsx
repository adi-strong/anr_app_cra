import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {useEffect, useState} from "react";
import {Button, Form, Spinner} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";
import {agentStateOptions} from "../../../services";
import toast from "react-hot-toast";
import {usePostNewAgentStateMutation} from "../model/agent.api.slice";

// 'active', 'inactive', 'suspended', 'leave', 'unavailable'

export default function AgentStateForm({data, onHide, onRefresh}) {
  const [agent, setAgent] = useState({state: '', startAt: '', endAt: '', docFile: ''})
  const [postNewAgentState, {isLoading}] = usePostNewAgentStateMutation()
  
  useEffect(() => {
    if (data) {
      setAgent(s => ({...s, state: data.state,}))
    }
  }, [data])
  
  const onChange = e => {
    setAgent({state: '', startAt: '', endAt: '', docFile: ''})
    onFieldChange(e, agent, setAgent)
  }
  
  const onSubmit = async (e) => {
    e.preventDefault()
    if (data) {
      const formData = new FormData()
      if (agent?.state) formData.append('state', agent.state)
      if (data.id) formData.append('agentId', data.id)
      if (agent?.startAt) formData.append('startAt', agent.startAt)
      if (agent?.endAt) formData.append('endAt', agent.endAt)
      if (agent?.file) formData.append('file', agent.file)
      
      try {
        const send = await postNewAgentState(formData)
        if  (send?.data) {
          toast.success('Opération bien efféctuée.')
          onHide()
          onRefresh()
        }
      } catch (e) {
        toast.error('Problème de connexion.')
      }
    }
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form onSubmit={onSubmit}>
        <div className='mb-3'>
          <Form.Label htmlFor='state'><code>*</code> État</Form.Label>
          <Form.Select
            disabled={isLoading}
            id='state'
            name='state'
            value={agent.state}
            onChange={e => onChange(e)}>
            {agentStateOptions.length > 0 && agentStateOptions.map((s, i) =>
              <option key={i} value={s.value}>{s.label}</option>)}
          </Form.Select>
        </div>
        
        {(agent.state === 'suspended' ||
          agent.state === 'leave' ||
          agent.state === 'unavailable') && (
          <>
            <div className='mb-3'>
              <Form.Label htmlFor='startAt'>
                Date de début
              </Form.Label>
              <Form.Control
                disabled={isLoading}
                id='startAt'
                type='date'
                name='startAt'
                value={agent.startAt}
                onChange={e => onChange(e)}/>
            </div>
            
            <div className='mb-3'>
              <Form.Label htmlFor='endAt'>
                Date de fin
              </Form.Label>
              <Form.Control
                disabled={isLoading}
                id='endAt'
                type='date'
                name='endAt'
                value={agent.endAt}
                onChange={e => onChange(e)}/>
            </div>
            
            <div>
              <Form.Label htmlFor='docFile'>
                Document
              </Form.Label>
              <Form.Control
                disabled={isLoading}
                id='docFile'
                type='file'
                name='docFile'
                onChange={e => onChange(e)}/>
            </div>
          </>
        )}
        
        {(agent.state === 'retired' || agent.state === 'dead') && (
          <>
            <div className='mb-3'>
              <Form.Label htmlFor='startAt'>
                Date
              </Form.Label>
              <Form.Control
                disabled={isLoading}
                id='startAt'
                type='date'
                name='startAt'
                value={agent.startAt}
                onChange={e => onChange(e)}/>
            </div>
            
            <div>
              <Form.Label htmlFor='docFile'>
                Document
              </Form.Label>
              <Form.Control
                disabled={isLoading}
                id='docFile'
                type='file'
                name='docFile'
                onChange={e => onChange(e)}/>
            </div>
          </>
        )}
        
        <hr/>
        <Button disabled={isLoading} type='submit' className='d-block w-100'>
          {!isLoading && <i className='bi bi-check me-1'/>}
          {isLoading && <Spinner animation='grow' size='sm' className='me-1'/>}
          {isLoading ? 'Veuillez patienter' : 'Valider'}
        </Button>
      </Form>
    </ErrorBoundary>
  )
}

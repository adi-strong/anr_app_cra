import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, ReactSelectField} from "../../../components";
import {Button, Form, InputGroup} from "react-bootstrap";
import {useEffect, useMemo, useState} from "react";
import {salaryErrors, salaryFields} from "../model/salary.service";
import {useGetAgentsListQuery, useLazyGetLoadAgentsQuery} from "../../staff/model/agent.api.slice";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import {onFieldChange} from "../../../services/form.handler.service";

export default function SalaryCartForm({state, setState, loader = false}) {
  const [fields, setFields] = useState({...salaryFields, agent: null, agentId: null})
  const [errors, setErrors] = useState({...salaryErrors, agent: null, agentId: null})
  const [getLoadAgents] = useLazyGetLoadAgentsQuery()
  
  const {nbPages} = useSelector(state => state.config)
  const {data: agents=[], isLoading, isError, error} = useGetAgentsListQuery(nbPages)
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  let agentOptions
  
  agentOptions = useMemo(() => {
    let obj = []
    if (!isError && agents.length) {
      obj = agents.map(a => ({
        label: a?.name?.toUpperCase()+' '+(a?.firstName ? a.firstName.toUpperCase()+' ' : ''),
        value: a['@id'],
        id: a?.id,
      }))
    }
    
    return obj
  }, [isError, agents])
  
  const onReset = () => setFields({...salaryFields, agent: null, agentId: null})
  
  async function onLoadAgents(keywords) {
    try {
      const search = await getLoadAgents(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onAgentChange = (e) => {
    const agent = e
    const agentId = e ? e.id : null
    setFields(s => ({...s, agent, agentId}))
  }
  
  const onSubmit = (e) => {
    e.preventDefault()
    setErrors({...salaryErrors, agent: null, agentId: null})
    const items = [...state.items]
    const baseAmount = isNaN(parseFloat(fields.baseAmount)) ? 0 : parseFloat(fields.baseAmount)
    const riskPremiumAmount = isNaN(parseFloat(fields.riskPremiumAmount))
      ? 0 : parseFloat(fields.riskPremiumAmount)
    const functionBonusAmount = isNaN(parseFloat(fields.functionBonusAmount))
      ? 0 : parseFloat(fields.functionBonusAmount)
    
    const total = baseAmount + riskPremiumAmount + functionBonusAmount
    
    if (baseAmount <= 0.00) setErrors({...errors, baseAmount: 'Salaire de base invalide.'})
    else if (!fields.agent) toast.error("Aucun agent sélectionné.")
    else {
      if (items.length > 0) {
        const findAgent = items.find(a => a?.agentId === fields.agentId)
        if (findAgent) toast.error('Agent déjà ajouté.')
        else {
          items.push({...fields, baseAmount, riskPremiumAmount, functionBonusAmount, total})
          setState(s => ({...s, items, total}))
          onReset()
        }
      }
      else {
        items.push({...fields, baseAmount, riskPremiumAmount, functionBonusAmount, total})
        setState(s => ({...s, items, total}))
        onReset()
      }
    }
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form onSubmit={onSubmit}>
        <div className='mb-3'>
          <Form.Label><code>*</code> Agent</Form.Label>
          <ReactSelectField
            isAsync
            required
            disabled={isLoading}
            value={fields.agent}
            values={agentOptions}
            onLoadOptions={onLoadAgents}
            onChange={e => onAgentChange(e)}
            placeholder='-- Veuillez sélectionner un agent --'/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='baseAmount'><code>*</code> Salaire de base</Form.Label>
          <InputGroup>
            <Form.Control
              required
              disabled={loader}
              isInvalid={errors.baseAmount !== null}
              type='number'
              id='baseAmount'
              name='baseAmount'
              value={fields.baseAmount}
              onChange={e => onFieldChange(e, fields, setFields)}/>
            <InputGroup.Text>
              {state?.currency && state.currency?.symbol}
            </InputGroup.Text>
          </InputGroup>
          <FeedbackError error={errors.baseAmount}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='riskPremiumAmount'>Prime de risque</Form.Label>
          <InputGroup>
            <Form.Control
              disabled={loader}
              type='number'
              id='riskPremiumAmount'
              name='riskPremiumAmount'
              value={fields.riskPremiumAmount}
              onChange={e => onFieldChange(e, fields, setFields)}/>
            <InputGroup.Text>
              {state?.currency && state.currency?.symbol}
            </InputGroup.Text>
          </InputGroup>
        </div>
        
        <div>
          <Form.Label htmlFor='functionBonusAmount'>Prime de fonction</Form.Label>
          <InputGroup>
            <Form.Control
              disabled={loader}
              type='number'
              id='functionBonusAmount'
              name='functionBonusAmount'
              value={fields.functionBonusAmount}
              onChange={e => onFieldChange(e, fields, setFields)}/>
            <InputGroup.Text>
              {state?.currency && state.currency?.symbol}
            </InputGroup.Text>
          </InputGroup>
        </div>
        
        <hr/>
        <div className='text-end'>
          <Button disabled={loader} type='button' variant='light' onClick={onReset} className='me-2'>
            <i className='bi bi-trash'/> Effacer
          </Button>
          
          <Button disabled={loader} type='submit' variant='info' className='text-white'>
            <i className='bi bi-plus'/> Ajouter
          </Button>
        </div>
      </Form>
    </ErrorBoundary>
  )
}

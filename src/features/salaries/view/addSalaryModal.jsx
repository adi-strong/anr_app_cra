import {useEffect, useMemo, useState} from "react";
import toast from "react-hot-toast";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, FieldsAlert, ReactSelectField} from "../../../components";
import {Button, Col, Form, InputGroup, Modal, Row, Spinner} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";
import PropTypes from "prop-types";
import {usePostNewSalaryMutation} from "../model/salary.api.slice";
import {useSelector} from "react-redux";
import {useGetYearsListQuery, useLazyGetLoadYearsQuery} from "../../configurations/model/year.api.slice";
import {salaryErrors, salaryFields} from "../model/salary.service";
import {monthOptions} from "../../../services";
import {useGetUniqueCurrencyQuery} from "../../configurations/model/currency.api.slice";
import InputGroupText from "react-bootstrap/InputGroupText";

export default function AddSalaryModal({show, onHide, agent, onRefresh}) {
  const [open, setOpen] = useState(false)
  const [fields, setFields] = useState(salaryFields)
  const [errors, setErrors] = useState(salaryErrors)
  const [postNewSalary, {isLoading, isError, error}] = usePostNewSalaryMutation()
  const [getLoadYears] = useLazyGetLoadYearsQuery()
  
  const {nbPages} = useSelector(state => state.config)
  const {data: years=[], isYearError, isYearLoading} = useGetYearsListQuery(nbPages)
  const {data: currencyParams, isCurrencyError} = useGetUniqueCurrencyQuery(1)
  
  let yearOptions, currencyOptions, total
  
  yearOptions = useMemo(() => {
    let obj= []
    if (!isYearError && years.length > 0) obj = years.map(p => ({
      label: p?.name?.toUpperCase(),
      value: p['@id']
    }))
    
    return obj
  }, [isYearError, years])
  
  currencyOptions = useMemo(() => {
    const obj = []
    if (!isCurrencyError && currencyParams) {
      if (currencyParams?.first) {
        obj.push(currencyParams.first)
        setFields(s => ({...s, currency: currencyParams.first}))
      }
      if (currencyParams?.last) obj.push(currencyParams.last)
    }
    
    return obj
  }, [isCurrencyError, currencyParams])
  
  total = useMemo(() => {
    let sum = 0
    const baseAmount = isNaN(parseFloat(fields.baseAmount)) ? 0 : parseFloat(fields.baseAmount)
    const riskPremiumAmount = isNaN(parseFloat(fields.riskPremiumAmount)) ? 0 : parseFloat(fields.riskPremiumAmount)
    const functionBonusAmount = isNaN(parseFloat(fields.functionBonusAmount)) ? 0 : parseFloat(fields.functionBonusAmount)
    
    sum += (baseAmount + riskPremiumAmount + functionBonusAmount)
    
    return sum
  }, [fields])
  
  const toggleOpen = () => setOpen(!open)
  
  const onReset = () => {
    setErrors(salaryFields)
    setFields(salaryErrors)
  }
  
  async function onLoadYears(keywords) {
    try {
      const search = await getLoadYears(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onCurrencyChange = e => {
    const currency = e
    const baseAmount = 0
    const functionBonusAmount = 0
    const riskPremiumAmount = 0
    
    if (!currency) toast.error('La Devise doit être renseignée.')
    else {
      setFields({...fields, currency, baseAmount, functionBonusAmount, riskPremiumAmount})
    }
  }
  
  const onSubmit = async () => {
    setErrors(salaryErrors)
    if (agent) {
      if (currencyParams && currencyParams?.rate && currencyParams.rate <= 0) toast.error('Taux invalide')
      else {
        const baseAmount = isNaN(parseFloat(fields.baseAmount)) ? 0 : parseFloat(fields.baseAmount)
        const riskPremiumAmount = isNaN(parseFloat(fields.riskPremiumAmount)) ? 0 : parseFloat(fields.riskPremiumAmount)
        const functionBonusAmount = isNaN(parseFloat(fields.functionBonusAmount)) ? 0 : parseFloat(fields.functionBonusAmount)
        
        if (baseAmount <= 0.00) {
          toast.error('Salaire de base invalide.')
        }
        else {
          try {
            const send = await postNewSalary({
              ...fields,
              riskPremiumAmount,
              functionBonusAmount,
              total,
              agent: agent['@id'],
              rate: currencyParams.rate?.toString(),
            })
            
            if (send?.data) {
              toast.success('Opération bien efféctuée.')
              onReset()
              setOpen(false)
              onHide()
              onRefresh()
            }
            else setOpen(false)
          }
          catch (e) { toast.error('Problème de connexion.') }
        }
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
      <Modal show={show} onHide={onHide} size='lg'>
        <Modal.Header className='bg-light' closeButton>
          <Modal.Title><i className='bi bi-plus'/> Paiement salaire</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <FieldsAlert/>
          
          <Row>
            <Col className='mb-3'>
              <Form.Label><code>*</code> Année</Form.Label>
              <ReactSelectField
                isAsync
                disabled={isLoading || isYearLoading}
                value={fields.year}
                onChange={e => setFields({...fields, year: e})}
                onLoadOptions={onLoadYears}
                values={yearOptions}
                placeholder='-- --'/>
              {errors?.year && <code><i className='bi bi-exclamation-circle-fill'/> {errors.year}</code>}
            </Col>
            
            <Col className='mb-3'>
              <Form.Label htmlFor='month'><code>*</code> Mois</Form.Label>
              <Form.Select
                isInvalid={errors.month !== null}
                disabled={isLoading}
                autoComplete='off'
                id='month'
                name='month'
                value={fields.month}
                onChange={e => onFieldChange(e, fields, setFields)}>
                {monthOptions.length > 0 && monthOptions.map(m =>
                  <option key={m.label} value={m.value}>{m.label}</option>)}
              </Form.Select>
                <FeedbackError error={errors.month}/>
            </Col>
          </Row>
          
          <div className='mb-3'>
            <Form.Label><code>*</code> Devise</Form.Label>
            <ReactSelectField
              disabled={isLoading}
              value={fields.currency}
              values={currencyOptions}
              onChange={e => onCurrencyChange(e)}/>
          </div>
          
          <Row>
            <Col className='mb-3'>
              <Form.Label htmlFor='baseAmount'><code>*</code> Salaire de base</Form.Label>
              <InputGroup>
                <Form.Control
                  isInvalid={errors.baseAmount !== null}
                  disabled={isLoading}
                  autoComplete='off'
                  type='number'
                  id='baseAmount'
                  name='baseAmount'
                  value={fields.baseAmount}
                  onChange={e => onFieldChange(e, fields, setFields)}/>
                <InputGroupText>{fields?.currency && fields.currency?.symbol}</InputGroupText>
              </InputGroup>
              <FeedbackError error={errors.baseAmount}/>
            </Col>
            
            <Col className='mb-3'>
              <Form.Label htmlFor='riskPremiumAmount'>Prime de risque</Form.Label>
              <InputGroup>
                <Form.Control
                  isInvalid={errors.riskPremiumAmount !== null}
                  disabled={isLoading}
                  autoComplete='off'
                  type='number'
                  id='riskPremiumAmount'
                  name='riskPremiumAmount'
                  value={fields.riskPremiumAmount}
                  onChange={e => onFieldChange(e, fields, setFields)}/>
                <InputGroupText>{fields?.currency && fields.currency?.symbol}</InputGroupText>
              </InputGroup>
                <FeedbackError error={errors.riskPremiumAmount}/>
            </Col>
            
            <Col className='mb-3'>
              <Form.Label htmlFor='functionBonusAmount'>Prime de fonction</Form.Label>
              <InputGroup>
                <Form.Control
                  isInvalid={errors.riskPremiumAmount !== null}
                  disabled={isLoading}
                  autoComplete='off'
                  type='number'
                  id='functionBonusAmount'
                  name='functionBonusAmount'
                  value={fields.functionBonusAmount}
                  onChange={e => onFieldChange(e, fields, setFields)}/>
                <InputGroupText>{fields?.currency && fields.currency?.symbol}</InputGroupText>
              </InputGroup>
                <FeedbackError error={errors.functionBonusAmount}/>
            </Col>
          </Row>
          
          <div className='d-flex justify-content-between bg-light p-2' style={{ border: '1px solid lightgray' }}>
            <span className='fw-bold'>NET À PAYER</span>
            <span className='fw-bold'>
              {parseFloat(total).toFixed(2)+' '}
              {fields?.currency && fields.currency?.symbol}
            </span>
          </div>
        </Modal.Body>
        
        <Modal.Footer className='bg-light'>
          {open && (
            <>
              <Button disabled={isLoading} variant='dark' onClick={toggleOpen}>
                <i className='bi bi-x'/> Annuler
              </Button>
              
              <Button disabled={isLoading} variant='outline-success' onClick={onSubmit}>
                {!isLoading && <i className='bi bi-exclamation-circle-fill me-1'/>}
                {isLoading && <Spinner animation='grow' size='sm' className='me-1'/>}
                {isLoading ? 'Veuillez patienter' : 'Valider'}
              </Button>
            </>
          )}
          
          {!open && (
            <>
              <Button disabled={isLoading} variant='secondary' onClick={onHide}>
                <i className='bi bi-x'/> Fermer
              </Button>
              
              <Button disabled={isLoading} onClick={toggleOpen}>
                Créer
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </ErrorBoundary>
  )
}

AddSalaryModal.propTypes = {
  agent: PropTypes.any,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
}

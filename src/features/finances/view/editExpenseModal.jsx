import {useEffect, useMemo, useState} from "react";
import {expFields, finErrors, onExpenseItemChange, onRemoveExpenseItem} from "../model/finances.service";
import {useGetExpTypesListQuery, useLazyGetLoadExpTypesQuery} from "../model/exp.type.api.slice";
import {useEditExpenseMutation} from "../model/expenses.api.slice";
import {useSelector} from "react-redux";
import {useGetUniqueCurrencyQuery} from "../../configurations/model/currency.api.slice";
import toast from "react-hot-toast";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, FieldsAlert, ReactSelectField} from "../../../components";
import {Button, Col, Form, InputGroup, Modal, Row, Spinner} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";
import PropTypes from "prop-types";

export default function EditExpenseModal({show, onHide, data, onRefresh}) {
  const [fields, setFields] = useState(expFields)
  const [errors, setErrors] = useState(finErrors)
  const [getLoadExpTypes] = useLazyGetLoadExpTypesQuery()
  const [editExpense, {isLoading, isError, error}] = useEditExpenseMutation()
  
  const total = useMemo(() => {
    let sum = 0
    if (fields.operations.length > 0) {
      const items = fields.operations
      for (const key in items) {
        const item = items[key]
        const qty = isNaN(parseFloat(item.qty)) || item.qty < 0 ? 1 : parseFloat(item.qty)
        const amount = isNaN(parseFloat(item.amount)) || item.amount < 0 ? 1 : parseFloat(item.amount)
        sum += (amount * qty)
      }
    }
    
    return sum
  }, [fields])
  
  const {nbPages} = useSelector(state => state.config)
  const {data: types=[], isLoading: isDLoading, isError: isDError, error: dError}
    = useGetExpTypesListQuery(nbPages)
  
  const {data: params, isError: isCError} = useGetUniqueCurrencyQuery(1)
  
  let typeOptions, currencyOptions
  
  typeOptions = useMemo(() => {
    let obj = []
    if (!isDError && types.length > 0) {
      obj = types.map(p => ({
        label: p.name.toUpperCase(),
        value: p['@id']
      }))
    }
    
    return obj
  }, [isDError, types])
  
  currencyOptions = useMemo(() => {
    const obj = []
    if (!isCError && params) {
      if (params?.first) {
        obj.push(params.first)
        setFields(s => ({...s, currency: params.first}))
      }
      if (params?.last) obj.push(params.last)
    }
    
    return obj
  }, [isCError, params])
  
  async function onLoadTypes(keywords) {
    try {
      const search = await getLoadExpTypes(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onTypeChange = (e, index) => {
    const operations = [...fields.operations]
    operations[index]['type'] = e
    setFields({...fields, operations})
  }
  
  const onCurrencyChange = (e) => {
    const qty = 0
    const amount = 0
    const currency = e
    if (!currency) toast.error('La Devise est requise.')
    else {
      let operations = [...fields.operations]
      operations = operations.map(o => ({...o, qty, amount}))
      setFields({...fields, currency, operations})
    }
  }
  
  const onReset = () => {
    setErrors(finErrors)
    setFields(expFields)
  }
  
  const onAddItem = () => {
    const operations = [...fields.operations]
    operations.push({type: null, qty: 0, amount: 0})
    setFields({...fields, operations})
  }
  
  const onSubmit = async () => {
    setErrors(finErrors)
    try {
      const send = await editExpense({...fields, rate: params?.rate?.toString(), total: total?.toString()})
      if (send?.data) {
        toast.success('Opération bien efféctuée.')
        setFields(expFields)
        setErrors(finErrors)
        onHide()
      }
    } catch (e) {
      toast.error('Problème de connexion.')
    }
  }
  
  useEffect(() => {
    if (isDError) {
      if (dError?.error) toast.error(dError.error)
      if (dError?.data && dError.data['hydra:description']) toast.error(dError.data['hydra:description'])
    }
  }, [isDError, dError])
  
  useEffect(() => {
    if (isError) {
      const {violations} = error?.data
      if (violations) violations.forEach(({ propertyPath, message }) => {
        setErrors(s => ({...s, [propertyPath]: message}))
      })
    }
  }, [isError, error])
  
  useEffect(() => {
    if (data) {
      const operations = data?.operations && data.operations
        ? data.operations.map(o => ({
          qty: o?.qty,
          amount: o?.amount,
          type: o?.type ? {label: o.type?.label, value: o.type?.value} : null,
        })) : []
      
      setFields(s => ({
        ...s,
        object: data.object,
        bearer: data.bearer,
        currency: data?.currency ? data.currency : null,
        id: data.id,
        operations,
      }))
    }
  }, [data])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Modal show={show} onHide={onHide} size='lg'>
        <Modal.Header closeButton className='bg-primary'>
          <Modal.Title className='text-white'><i className='bi bi-pencil-square'/> Édtion de la dépense</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <FieldsAlert/>
          
          <div className='mb-3'>
            <Form.Label htmlFor='object'><code>*</code> Motif / Raison</Form.Label>
            <Form.Control
              required
              autoFocus
              autoComplete='off'
              disabled={isLoading}
              isInvalid={errors.object !== null}
              name='object'
              value={fields.object}
              onChange={e => onFieldChange(e, fields, setFields)}/>
            <FeedbackError error={errors.object}/>
          </div>
          
          <Row>
            <Col className='mb-3'>
              <Form.Label htmlFor='bearer'><code>*</code> Bénéficiaire</Form.Label>
              <Form.Control
                required
                autoComplete='off'
                disabled={isLoading}
                isInvalid={errors.bearer !== null}
                name='bearer'
                value={fields.bearer}
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.bearer}/>
            </Col>
            <Col>
              <Form.Label htmlFor='currency'><code>*</code> Devise</Form.Label>
              <ReactSelectField
                required
                disabled={isLoading}
                value={fields.currency}
                onChange={e => onCurrencyChange(e)}
                placeholder='-- --'
                values={currencyOptions}/>
              {errors.currency && <code><i className='bi bi-exclamation-circle-fill'/> {errors.currency}</code>}
            </Col>
          </Row>
          
          <div className='p-2 bg-light mb-3' style={{ border: '1px solid lightgray' }}>
            {fields.operations.length > 0 && fields.operations.map((t, i) =>
              <Row key={i} className='mb-2'>
                <Col className='mb-1'>
                  <Form.Text>Type</Form.Text>
                  <ReactSelectField
                    isAsync
                    required
                    disabled={isDLoading}
                    onChange={e => onTypeChange(e, i)}
                    value={t.type}
                    values={typeOptions}
                    onLoadOptions={onLoadTypes}
                    placeholder='-- --'/>
                </Col>
                <Col className='mb-1'>
                  <Form.Text>Nbre / Qté</Form.Text>
                  <Form.Control
                    disabled={isLoading}
                    autoComplete='off'
                    type='number'
                    name='qty'
                    value={t.qty}
                    onChange={e => onExpenseItemChange(e, i, fields, setFields)}/>
                </Col>
                <Col className='mb-1'>
                  <InputGroup>
                    <Form.Control
                      disabled={isLoading}
                      autoComplete='off'
                      style={{ position: 'relative', top: 22 }}
                      type='number'
                      name='amount'
                      value={t.amount}
                      onChange={e => onExpenseItemChange(e, i, fields, setFields)}/>
                    <InputGroup.Text style={{ position: 'relative', top: 22, }}>
                      {fields?.currency && fields.currency?.symbol}
                    </InputGroup.Text>
                    {fields.operations.length > 1 &&
                      <Button
                        disabled={isLoading}
                        variant='danger'
                        onClick={() => onRemoveExpenseItem(i, fields, setFields)}
                        style={{ position: 'relative', top: 22 }}>
                        <i className='bi bi-dash'/>
                      </Button>}
                  </InputGroup>
                </Col>
              </Row>)}
            
            <Button
              disabled={isLoading}
              variant='dark'
              size='sm'
              className='w-100 d-block'
              onClick={onAddItem}>
              <i className='bi bi-plus'/>
            </Button>
          </div>
          
          <div
            className='p-2 bg-light d-flex justify-content-between'
            style={{ border: '1px solid lightgray' }}>
            <span style={{ fontWeight: 800 }}>TOTAL</span>
            <span style={{ fontWeight: 800 }}>
              {total} {fields?.currency && fields.currency?.symbol}
            </span>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <Button
            variant='light'
            className='me-1 mb-1'
            onClick={onReset}
            disabled={isLoading}>
            <i className='bi bi-trash'/> Effacer
          </Button>
          
          <Button disabled={isLoading} className='mb-1' onClick={onSubmit}>
            {isLoading && <Spinner animation='grow' size='sm' className='me-1'/>}
            {!isLoading ? 'Valider' : 'Veuillez patienter'}
          </Button>
        </Modal.Footer>
      </Modal>
    </ErrorBoundary>
  )
}

EditExpenseModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
}

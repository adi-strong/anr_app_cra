import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, ReactSelectField} from "../../../components";
import {Button, Card, Col, Form, Modal, Row, Spinner} from "react-bootstrap";
import {useEffect, useMemo, useState} from "react";
import MainSalaryForm from "./mainSalaryForm";
import SalaryCartForm from "./salaryCartForm";
import {useSelector} from "react-redux";
import {useGetYearsListQuery, useLazyGetLoadYearsQuery} from "../../configurations/model/year.api.slice";
import {useGetUniqueCurrencyQuery} from "../../configurations/model/currency.api.slice";
import toast from "react-hot-toast";
import {onFieldChange} from "../../../services/form.handler.service";
import {monthOptions} from "../../../services";
import {usePostNewSalaryResourceMutation} from "../model/salary.api.slice";

function ConfirmModal({show, onHide, onSubmit}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Modal show={show} onHide={onHide}>
        <Modal.Header className='bg-warning'>
          <Modal.Title>
            <i className='bi bi-exclamation-triangle-fill'/> Confirmation
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className='text-center'>
          <code>
            <small>
              <i className='bi bi-exclamation-circle-fill'/> Cette action est irréversible.
            </small>
          </code> <br/> <br/>
          
          Veuillez confirmer cette opération <i className='bi bi-exclamation-triangle-fill text-danger'/>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant='light' onClick={onHide}>
            <i className='bi bi-x'/> Annuler
          </Button>
          
          <Button autoFocus variant='warning' onClick={onSubmit}>
            <i className='bi bi-check'/> Valider
          </Button>
        </Modal.Footer>
      </Modal>
    </ErrorBoundary>
  )
}

export default function SalaryPaymentForm() {
  const [postNewSalaryResource, {isLoading, isError, error}] = usePostNewSalaryResourceMutation()
  const [fields, setFields] = useState({
    currency: null,
    rate: 0,
    month: '',
    year: null,
    yearId: null,
    items: []
  })
  const [getLoadYears] = useLazyGetLoadYearsQuery()
  const [show, setShow] = useState(false)
  
  const toggleShow = () => setShow(!show)
  
  const onReset = () => setFields({...fields, year: null, yearId: null, month: '', items: []})
  
  const onRemoveItem = index => {
    const items = [...fields.items]
    items.splice(index, 1)
    setFields({...fields, items})
  }
  
  const {nbPages} = useSelector(state => state.config)
  const {data: years=[], isYearError, isYearLoading} = useGetYearsListQuery(nbPages)
  const {data: currencyParams, isCurrencyError} = useGetUniqueCurrencyQuery(1)
  
  let yearOptions, currencyOptions
  
  yearOptions = useMemo(() => {
    let obj= []
    if (!isYearError && years.length > 0) obj = years.map(p => ({
      label: p?.name?.toUpperCase(),
      value: p['@id'],
      id: p.id,
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
  
  async function onLoadYears(keywords) {
    try {
      const search = await getLoadYears(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onCurrencyChange = e => {
    const currency = e
    
    if (!currency) toast.error('La Devise doit être renseignée.')
    else {
      setFields({...fields, currency, items: []})
    }
  }
  
  const onYearChange = e => {
    const year = e
    const yearId = e ? e.id : null
    setFields({...fields, year, yearId})
  }
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  const onSubmit = async () => {
    toggleShow()
    try {
      const send = await postNewSalaryResource(fields)
      if (send?.data) {
        toast.success('Paiement bien efféctué.')
        onReset()
      }
    } catch (e) {
      toast.error('Problème de connexion.')
    }
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Row>
        <Col md={8} className='mb-3'>
          <Card>
            <Card.Body>
              <h4 className='card-title'>Formulaie de paiement</h4>
              <Row>
                <Col className='mb-3'>
                  <Form.Label><code>*</code> Année</Form.Label>
                  <ReactSelectField
                    isAsync
                    disabled={isYearLoading || isLoading}
                    value={fields.year}
                    onChange={e => onYearChange(e)}
                    onLoadOptions={onLoadYears}
                    values={yearOptions}
                    placeholder='-- --'/>
                </Col>
                
                <Col className='mb-3'>
                  <Form.Label htmlFor='month'><code>*</code> Mois</Form.Label>
                  <Form.Select
                    disabled={isLoading}
                    autoComplete='off'
                    id='month'
                    name='month'
                    value={fields.month}
                    onChange={e => onFieldChange(e, fields, setFields)}>
                    {monthOptions.length > 0 && monthOptions.map(m =>
                      <option key={m.label} value={m.value}>{m.label}</option>)}
                  </Form.Select>
                </Col>
              </Row>
              
              <Row>
                <Col className='mb-3'>
                  <Form.Label><code>*</code> Devise</Form.Label>
                  <ReactSelectField
                    disabled={false}
                    value={fields.currency}
                    values={currencyOptions}
                    onChange={e => onCurrencyChange(e)}/>
                </Col>
              </Row>
              
              <MainSalaryForm
                onReset={onReset}
                loader={isLoading}
                state={fields}
                setState={setFields}
                onRemoveItem={onRemoveItem}/>
              
              <Button onClick={toggleShow} size='sm' disabled={isLoading} className='d-block w-100'>
                {isLoading && <Spinner animation='grow' size='sm' className='me-1'/>}
                {isLoading ? 'Veuillez patienter' : 'Valider'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className='mb-3'>
          <Card>
            <Card.Body>
              <h4 className='card-title'><i className='bi bi-cart'/> Ajouter un agent</h4>
              <SalaryCartForm
                loader={isLoading}
                state={fields}
                setState={setFields}/>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <ConfirmModal show={show} onHide={toggleShow} onSubmit={onSubmit}/>
    </ErrorBoundary>
  )
}

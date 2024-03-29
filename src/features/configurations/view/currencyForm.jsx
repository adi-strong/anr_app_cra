import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Button, Col, Form, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {onFieldChange} from "../../../services/form.handler.service";
import {useEditCurrencyMutation} from "../model/currency.api.slice";
import toast from "react-hot-toast";

export default function CurrencyForm({data, loader, onRefresh}) {
  const [fields, setFields] = useState({first: '', last: '', rate: 0, id: null})
  const [editCurrency, {isLoading}] = useEditCurrencyMutation()
  
  useEffect(() => {
    if (data) {
      setFields({
        first: data.first,
        last: data.last,
        rate: data.rate,
        id: data.id
      })
    }
  }, [data]);
  
  const onSubmit = async e => {
    e.preventDefault()
    try {
      const send = await editCurrency(fields)
      if (send?.data) {
        toast.success('Opération bien efféctuée.')
        onRefresh()
      }
    } catch (e) {
      toast.error('Problème de connexion.')
    }
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form onSubmit={onSubmit}>
        <Row className='align-items-center mb-8'>
          <Col className='mb-3 mb-md-0'>
            <Form.Label className="col-sm-4 col-form-label">Première Devise</Form.Label>
          </Col>
          <Col className='mb-3'>
            <Form.Select
              disabled
              value={fields?.first ? fields.first?.value : ''}
              onChange={() => {}}>
              <option value={fields?.first ? fields.first?.value : ''}>
                {fields?.first ? fields.first?.value : ''}
              </option>
            </Form.Select>
          </Col>
        </Row>
        
        <Row className='align-items-center mb-8'>
          <Col className='mb-3 mb-md-0'>
            <Form.Label className="col-sm-4 col-form-label">Deuxième Devise</Form.Label>
          </Col>
          <Col className='mb-3'>
            <Form.Select
              disabled
              value={fields?.last ? fields.last?.value : ''}
              onChange={() => {}}>
              <option value={fields?.last ? fields.last?.value : ''}>
                {fields?.last ? fields.last?.value : ''}
              </option>
            </Form.Select>
          </Col>
        </Row>
        
        <Row className='align-items-center mb-3'>
          <Col className='mb-3 mb-md-0'>
            <Form.Label className="col-sm-4 col-form-label">Taux</Form.Label>
          </Col>
          <Col className='mb-3'>
            <Form.Control
              disabled={loader || isLoading}
              type='number'
              name='rate'
              value={fields.rate}
              onChange={e => onFieldChange(e, fields, setFields)}/>
          </Col>
        </Row>
        
        <Row className='align-items-center mb-3'>
          <Col md={6} className='mb-3 mb-md-0'/>
          <Col md={6} className='mb-3'>
            <Button disabled={loader || isLoading} type='submit'>
              {isLoading && 'Veuillez patienter.'}
              {!isLoading && 'Valider'}
            </Button>
          </Col>
        </Row>
      </Form>
    </ErrorBoundary>
  )
}

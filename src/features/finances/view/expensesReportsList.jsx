import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {useReactToPrint} from "react-to-print";
import {Button, Card, Col, Form, InputGroup, Row, Table} from "react-bootstrap";
import {onSetNbPages} from "../../config/config.slice";
import {nbPageOptions} from "../../../services";
import {onFieldChange} from "../../../services/form.handler.service";
import {useSearchExpenseReportResourcesMutation} from "../model/expenses.api.slice";
import toast from "react-hot-toast";
import {RepeatableTableRowsLoader} from "../../../loaders";
import ExpenseReportItem from "./expenseReportItem";
import {useGetUniqueCurrencyQuery} from "../../configurations/model/currency.api.slice";

const thItems = [
  {label: 'Motif'},
  {label: 'Bénéficiaire'},
  {label: 'Taux'},
]

const style = {fontSize: '0.7rem'}

export default function ExpensesReportsList() {
  const dispatch = useDispatch()
  const printRef = useRef()
  const {nbPages} = useSelector(state => state.config)
  const {data: params} = useGetUniqueCurrencyQuery(1)
  
  const [keyword, setKeyword] = useState('')
  const [reports, setReports] = useState([])
  const [sum, setSum] = useState({total1: 0, total2: 0})
  const [search, setSearch] = useState({startAt: '', endAt: ''})
  const [searchRecoveriesResources, {isLoading, isError, error}] = useSearchExpenseReportResourcesMutation()
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current
  })
  
  const onSubmit = async (e) => {
    e.preventDefault()
    let send
    const startAt = search.startAt, endAt = search.endAt
    try {
      if (startAt && endAt) send = await searchRecoveriesResources(search)
      else if (startAt) send = await searchRecoveriesResources({startAt})
      else if (endAt) send = await searchRecoveriesResources({endAt})
      
      if (send?.data) {
        setReports(send.data?.data)
        setSum({total1: send.data?.total1, total2: send.data?.total2})
      }
    } catch (e) {
      toast.error('Problème de connexion.')
    }
  }
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Card.Header className='bg-white pt-5'>
        <Card.Title>
          Rapport
        </Card.Title>
        
        <Row className='px-3 pe-1'>
          <Col md={7} className='mb-2 d-flex'>
            <Button disabled={isLoading} variant='info' className='text-white' onClick={handlePrint}>
              <i className='bi bi-printer-fill'/> Imprimer
            </Button>
            
            <Form.Select
              disabled={isLoading}
              className='mx-1 me-1 w-15'
              value={nbPages}
              onChange={({target}) => dispatch(onSetNbPages(target.value))}>
              {nbPageOptions.map(o =>
                <option key={o.value} value={o.value}>{o.label}</option>)}
            </Form.Select>
            
            <Form.Control
              disabled={isLoading}
              className='w-40'
              autoComplete='off'
              value={keyword}
              placeholder='Recherche...'
              onChange={({target}) => setKeyword(target.value)}/>
          </Col>
          
          <Col md={5} className='mb-2'>
            <Form onSubmit={onSubmit}>
              <div className='d-flex'>
                <Form.Control
                  disabled={isLoading}
                  type='date'
                  name='startAt'
                  value={search.startAt}
                  className='me-2'
                  onChange={e => onFieldChange(e, search, setSearch)}/>
                
                <InputGroup>
                  <Form.Control
                    disabled={isLoading}
                    type='date'
                    name='endAt'
                    value={search.endAt}
                    onChange={e => onFieldChange(e, search, setSearch)}/>
                  
                  <Button type='submit' variant='secondary' disabled={isLoading}>
                    <i className='bi bi-search'/>
                  </Button>
                </InputGroup>
              </div>
            </Form>
          </Col>
        </Row>
      </Card.Header>
      
      <Card.Body>
        <div className='container-fluid pt-1' ref={printRef}>
          <Table className='text-nowrap' bordered>
            <thead className='table-light fw-bold'>
            <tr>
              {thItems.length > 0 && thItems.map(t =>
                <th key={t.label} className='align-middle p-1 text-uppercase' style={style}>{t.label}</th>)}
              <th className='align-middle p-1 text-uppercase text-end' style={style}>
                Total {params && params?.first?.symbol}
              </th>
              <th className='align-middle p-1 text-uppercase text-end' style={style}>
                Total {params && params?.last?.symbol}
              </th>
            </tr>
            </thead>
            
            <tbody>
            {!isError && !isLoading && reports.length > 0 && reports.map(r =>
              <ExpenseReportItem key={r.id} data={r}/>)}
            </tbody>
            
            {!isError && !isLoading && reports.length > 0 &&
              <tfoot>
              <tr>
                <td className='align-middle p-1' style={{ fontSize: '0.7rem', fontWeight: 800 }} colSpan={3}>TOTAUX</td>
                
                <td className='align-middle p-1 text-end' style={{ fontSize: '0.7rem', fontWeight: 800 }}>
                  {parseFloat(sum.total1).toFixed(2)}
                </td>
                
                <td className='align-middle p-1 text-end' style={{ fontSize: '0.7rem', fontWeight: 800 }}>
                  {parseFloat(sum.total2).toFixed(2)}
                </td>
              </tr>
              </tfoot>}
          </Table>
        </div>
        {isLoading && <RepeatableTableRowsLoader/>}
      </Card.Body>
    </ErrorBoundary>
  )
}

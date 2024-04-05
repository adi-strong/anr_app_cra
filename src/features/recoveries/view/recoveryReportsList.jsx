import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Button, Card, Col, Form, InputGroup, Row, Table} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {onSetNbPages} from "../../config/config.slice";
import {nbPageOptions} from "../../../services";
import {useEffect, useMemo, useRef, useState} from "react";
import {onFieldChange} from "../../../services/form.handler.service";
import {useReactToPrint} from "react-to-print";
import toast from "react-hot-toast";
import {RepeatableTableRowsLoader} from "../../../loaders";
import {useSearchRecoveriesResourcesMutation} from "../model/recovery.api.slice";
import RecoveryReportItem from "./recoveryReportItem";
import SimplePagination from "../../../components/paginations/SimplePagination";

const thItems = [
  {label: 'Activité'},
  {label: 'Province'},
  {label: 'Société'},
  {label: 'Agent'},
  {label: 'Date'},
]

const style = {fontSize: '0.7rem'}

export default function RecoveryReportsList() {
  const dispatch = useDispatch()
  const printRef = useRef()
  const {nbPages} = useSelector(state => state.config)
  const [searchRecoveriesResources, {isLoading, isError, error}] = useSearchRecoveriesResourcesMutation()
  const [recoveries, setRecoveries] = useState([])
  const [keyword, setKeyword] = useState('')
  
  const [search, setSearch] = useState({startAt: '', endAt: ''})
  
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
      
      if (send?.data) setRecoveries(send.data)
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
  
  let items, currentItems
  
  items = useMemo(() => {
    let obj = []
    if (!isError && recoveries.length > 0) {
      obj = recoveries.filter(r =>
        (r?.agent && r.agent?.name?.toLowerCase().includes(keyword.toLowerCase())) ||
        (r?.agent && r.agent?.lastName && r.lastName?.toLowerCase().includes(keyword.toLowerCase())) ||
        (r?.agent && r.agent?.firstName && r.firstName?.toLowerCase().includes(keyword.toLowerCase())) ||
        
        (r?.province && r.province?.toLowerCase().includes(keyword.toLowerCase())) ||
        (r?.activity && r.activity?.toLowerCase().includes(keyword.toLowerCase())) ||
        (r?.society && r.society?.name?.toLowerCase().includes(keyword.toLowerCase()))
      )
    }
    
    return obj
  }, [isError, recoveries, keyword])
  
  const [itemOffset, setItemOffset] = useState(0)
  
  const endOffset = itemOffset + nbPages
  
  currentItems = useMemo(() => {
    return items?.slice(itemOffset, endOffset)
  }, [items, endOffset, itemOffset])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Card.Header className='bg-white pt-5'>
        <Card.Title>
          Rapport régulations sécuritaires, télécom & TIC
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
            </tr>
            </thead>
            
            <tbody>
            {!isError && !isLoading &&
              currentItems.length > 0 && currentItems.map(r => <RecoveryReportItem key={r.id} data={r}/>)}
            </tbody>
          </Table>
        </div>
        
        {!isError && !isLoading && recoveries &&
          <div className='mt-3 px-3 pe-3'>
            <SimplePagination
              items={items}
              setItemOffset={setItemOffset}
              itemsPerPage={nbPages}/>
          </div>}
        
        {isLoading && <RepeatableTableRowsLoader/>}
      </Card.Body>
    </ErrorBoundary>
  )
}

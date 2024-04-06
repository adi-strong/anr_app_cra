import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useMemo, useRef, useState} from "react";
import {useReactToPrint} from "react-to-print";
import {Button, Col, Form, InputGroup, Row, Table} from "react-bootstrap";
import {onSetNbPages} from "../../config/config.slice";
import {nbPageOptions} from "../../../services";
import {onFieldChange} from "../../../services/form.handler.service";
import FuelSupplyReportItem from "./FuelSupplyReportItem";
import toast from "react-hot-toast";
import {useSearchFuelSupplyReportsResourcesMutation} from "../model/fuel.site.api.service";
import {RepeatableTableRowsLoader} from "../../../loaders";
import SimplePagination from "../../../components/paginations/SimplePagination";

const thItems = [
  {label: 'ID'},
  {label: 'QTÉ.'},
  {label: 'STOCK'},
  {label: 'SITE'},
  {label: 'DATE'},
]

const style = {fontSize: '0.7rem'}

export default function FuelSupplyReportsList() {
  const dispatch = useDispatch()
  const printRef = useRef()
  const {nbPages} = useSelector(state => state.config)
  
  const [reports, setReports] = useState([])
  const [keyword, setKeyword] = useState('')
  const [search, setSearch] = useState({startAt: '', endAt: ''})
  
  const [searchFuelSupplyReportsResources, {isLoading, isError, error}] = useSearchFuelSupplyReportsResourcesMutation()
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current
  })
  
  const onSubmit = async (e) => {
    e.preventDefault()
    let send
    const startAt = search.startAt, endAt = search.endAt
    try {
      if (startAt && endAt) send = await searchFuelSupplyReportsResources(search)
      else if (startAt) send = await searchFuelSupplyReportsResources({startAt})
      else if (endAt) send = await searchFuelSupplyReportsResources({endAt})
      
      if (send?.data) {
        setReports(send.data)
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
  
  let items, currentItems
  
  items = useMemo(() => {
    let obj = []
    if (!isError && reports.length > 0) {
      obj = reports.filter(r =>
        (r?.id && r.id?.toString().toLowerCase().includes(keyword.toLowerCase())) ||
        (r?.quantity && r.quantity?.toString().toLowerCase().includes(keyword.toLowerCase())) ||
        (r?.fuel && r.fuel?.toString().toLowerCase().includes(keyword.toLowerCase())) ||
        (r?.site && r.site?.toString().toLowerCase().includes(keyword.toLowerCase())) ||
        (r?.createdAt && r.createdAt?.toString().toLowerCase().includes(keyword.toLowerCase()))
      )
    }
    
    return obj
  }, [isError, reports, keyword])
  
  const [itemOffset, setItemOffset] = useState(0)
  
  const endOffset = itemOffset + nbPages
  
  currentItems = useMemo(() => {
    return items?.slice(itemOffset, endOffset)
  }, [items, endOffset, itemOffset])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Row className='px-3 pe-1 pt-5'>
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
            currentItems.length > 0 && currentItems.map((r, i) =>
              <FuelSupplyReportItem key={i} data={r}/>)}
          </tbody>
        </Table>
      </div>
      
      {!isError && !isLoading && reports &&
        <div className='mt-3 px-3 pe-3'>
          <SimplePagination
            items={items}
            setItemOffset={setItemOffset}
            itemsPerPage={nbPages}/>
        </div>}
      
      {isLoading && <RepeatableTableRowsLoader/>}
    </ErrorBoundary>
  )
}

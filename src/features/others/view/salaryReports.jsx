import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, ReactSelectField} from "../../../components";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useMemo, useRef, useState} from "react";
import {useReactToPrint} from "react-to-print";
import {Button, Col, Form, InputGroup, Row, Table} from "react-bootstrap";
import {onSetNbPages} from "../../config/config.slice";
import {monthOptions, nbPageOptions} from "../../../services";
import {useGetYearsListQuery, useLazyGetLoadYearsQuery} from "../../configurations/model/year.api.slice";
import toast from "react-hot-toast";
import {onFieldChange} from "../../../services/form.handler.service";
import {useSearchSalaryResourcesMutation} from "../../salaries/model/salary.api.slice";
import {RepeatableTableRowsLoader} from "../../../loaders";
import SimplePagination from "../../../components/paginations/SimplePagination";
import SalaryReportItem from "./salaryReportItem";

const thItems = [
  {label: 'Agent'},
  {label: 'Grade'},
  {label: 'Fonction'},
  {label: 'Salaire de base', className: 'text-end'},
  {label: 'Prime de risque', className: 'text-end'},
  {label: 'Prime de fonction', className: 'text-end'},
  {label: 'Net payé', className: 'text-end'},
]

const style = { fontSize: '0.7rem' }

export default function SalaryReports() {
  const dispatch = useDispatch()
  const printRef = useRef()
  
  const {nbPages} = useSelector(state => state.config)
  const {data: years=[], isYearError, isYearLoading} = useGetYearsListQuery(nbPages)
  
  let yearOptions
  
  yearOptions = useMemo(() => {
    let obj= []
    if (!isYearError && years.length > 0) obj = years.map(p => ({
      label: p?.name?.toUpperCase(),
      value: p['@id'],
      id: p.id,
    }))
    
    return obj
  }, [isYearError, years])
  
  const [getLoadYears] = useLazyGetLoadYearsQuery()
  const [reports, setReports] = useState([])
  const [search, setSearch] = useState({year: null, yearId: null, month: ''})
  const [keyword, setKeyword] = useState('')
  const [searchSalaryResources, {isLoading, isError, error}] = useSearchSalaryResourcesMutation()
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current
  })
  
  async function onLoadYears(keywords) {
    try {
      const search = await getLoadYears(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onYearChange = (e) => {
    const year = e
    const yearId = e ? e.id : null
    setSearch({...search, year, yearId})
  }
  
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const send = await searchSalaryResources(search)
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
      obj = reports.filter(s =>
        (s?.agent && s.agent.name.toLowerCase().includes(keyword.toLowerCase())) ||
        (s?.agent && s.agent?.lastName && s.agent.lastName.toLowerCase().includes(keyword.toLowerCase())) ||
        (s?.agent && s.agent?.firstName && s.agent.firstName.toLowerCase().includes(keyword.toLowerCase())) ||
        (s?.baseAmount && s.baseAmount.toLowerCase().includes(keyword.toLowerCase())) ||
        (s?.functionBonusAmount && s.functionBonusAmount.toLowerCase().includes(keyword.toLowerCase())) ||
        (s?.riskPremiumAmount && s.riskPremiumAmount.toLowerCase().includes(keyword.toLowerCase())) ||
        (s?.total && s.total?.toString().toLowerCase().includes(keyword.toLowerCase())) ||
        (s?.grade && s.grade?.toLowerCase().includes(keyword.toLowerCase())) ||
        (s?.job && s.job?.toLowerCase().includes(keyword.toLowerCase()))
      )
    }
    
    return obj
  }, [isError, reports, keyword])
  
  const [itemOffset, setItemOffset] = useState(0)
  
  const endOffset = itemOffset + nbPages
  
  currentItems = useMemo(() => {
    return items?.slice(itemOffset, endOffset)
  }, [items, endOffset, itemOffset])
  
  let total
  
  total = useMemo(() => {
    let sum = 0
    if (!isError && reports.length > 0) {
      for (const key in reports) {
        const report = reports[key]
        const total = isNaN(parseFloat(report.total)) ? 0 : parseFloat(report.total)
        sum += total
      }
    }
    
    return sum
  }, [isError, reports])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Row className='px-2 pt-5'>
        <Col md={7} className='mb-2'>
          <div className='d-flex'>
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
          </div>
        </Col>
        
        <Col md={5} className='mb-2'>
          <Form onSubmit={onSubmit}>
            <Row>
              <Col className='mb-1'>
                <ReactSelectField
                  isAsync
                  disabled={isYearLoading || isLoading}
                  value={search.year}
                  onChange={e => onYearChange(e)}
                  onLoadOptions={onLoadYears}
                  values={yearOptions}
                  placeholder='-- Année --'/>
              </Col>
              
              <Col className='mb-3'>
                <InputGroup>
                  <Form.Select
                    disabled={isLoading}
                    autoComplete='off'
                    id='month'
                    name='month'
                    value={search.month}
                    onChange={e => onFieldChange(e, search, setSearch)}>
                    {monthOptions.length > 0 && monthOptions.map(m =>
                      <option key={m.label} value={m.value}>{m.label}</option>)}
                  </Form.Select>
                  <Button type='submit' disabled={isLoading} variant='secondary'>
                    <i className='bi bi-search'/>
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      
      <div ref={printRef} className='container-fluid pt-2'>
        <Table responsive bordered>
          <thead className='bg-light'>
          <tr>
            {thItems.length > 0 && thItems.map((t, i) =>
              <th key={i} className={`align-middle p-1 ${t?.className}`} style={style}>{t.label}</th>)}
          </tr>
          </thead>
          
          <tbody>
          {!isError && !isLoading &&
            currentItems.length > 0 && currentItems.map((r, i) =>
              <SalaryReportItem key={i} data={r}/>)}
          </tbody>
          
          <tfoot>
          {!isError && !isLoading &&
            <tr>
              <th className='align-middle p-1' style={{ fontSize: '0.7rem', fontWeight: 800 }} colSpan={6}>
                TOTAL
              </th>
              <th className='align-middle text-end p-1' style={{ fontSize: '0.7rem', fontWeight: 800 }}>
                {parseFloat(total).toFixed(2)}
              </th>
            </tr>}
          </tfoot>
        </Table>
        
        {isLoading && <RepeatableTableRowsLoader/>}
      </div>
      
      {!isError && !isLoading && reports &&
        <div className='mt-3 px-3 pe-3'>
          <SimplePagination
            items={items}
            setItemOffset={setItemOffset}
            itemsPerPage={nbPages}/>
        </div>}
    </ErrorBoundary>
  )
}

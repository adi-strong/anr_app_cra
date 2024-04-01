import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {onSetNbPages} from "../../config/config.slice";
import toast from "react-hot-toast";
import {ErrorBoundary} from "react-error-boundary";
import {APIPagination, FallBackRender} from "../../../components";
import {Alert, Card, Col, Form, Row, Spinner, Table} from "react-bootstrap";
import {nbPageOptions} from "../../../services";
import {RepeatableTableRowsLoader} from "../../../loaders";
import {
  nbSalariesPages,
  useGetSalariesListQuery,
  useLazyGetPaginatedSalariesListQuery
} from "../model/salary.api.slice";
import SalaryItem from "./salaryItem";
import {salary2Items} from "../model/salary.service";

export default function SalariesList() {
  const [page, setPage] = useState(1)
  const [isPaginated, setIsPaginated] = useState(false)
  
  const [getPaginatedDepartmentsList, {
    data: paginatedItems = [],
    isFetching: isPaginatedFetching,
    isError: isPaginatedError,
    error: paginatedError,
  }] = useLazyGetPaginatedSalariesListQuery()
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const {nbPages} = useSelector(state => state.config)
  const {data: agents = [], isLoading, isFetching, isError, error, refetch} = useGetSalariesListQuery(nbPages)
  
  const onTogglePages = async ({target}): void => {
    dispatch(onSetNbPages(target.value))
    setPage(1)
    
    if (isPaginated) await getPaginatedDepartmentsList({page, pages: nbPages})
    else await refetch()
  }
  
  const onPaginateQuery = async p => {
    try {
      setIsPaginated(true)
      await getPaginatedDepartmentsList({page: p, pages: nbPages})
    }
    catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onProvinceRefresh = async (pages = null) => {
    if (isPaginated) {
      onPaginateQuery(page)
    }
    else {
      setPage(1)
      setIsPaginated(false)
      await refetch()
    }
  }
  
  const onRefresh = async () => {
    setPage(1)
    setIsPaginated(false)
    await refetch()
  }
  
  let items
  items = useMemo(() => {
    let obj = []
    if (!(isError && isPaginatedError)) {
      if (page > 1 && paginatedItems.length > 0 && isPaginated) obj = paginatedItems.map(a => a)
      else if (agents.length > 0) obj = agents.map(p => p)
      else obj = []
    }
    else obj = []
    
    return obj
  }, [
    isError,
    agents,
    page,
    isPaginatedError,
    isPaginated,
    paginatedItems])
  
  useEffect(() => {
    if (isPaginatedError) {
      if (paginatedError?.error) toast.error(paginatedError.error)
      if (paginatedError?.data && paginatedError.data['hydra:description']) {
        toast.error(paginatedError.data['hydra:description'])
      }
    }
  }, [isPaginatedError, paginatedError])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Card.Header className='bg-white pt-5'>
        <Card.Title>
          {isFetching && <Spinner animation='grow' size='sm' className='text-primary me-1'/>}
          {!isFetching &&
            <i
              className='bi bi-arrow-clockwise text-primary me-1'
              onClick={onRefresh}
              style={{ cursor: 'pointer' }} />}
          Salaires
        </Card.Title>
        
        <Row>
          <Col md={6} className='mb-2 d-flex'>
            <Link to='#!' className='me-1 mb-1 btn btn-primary'>
              Salaire par groupe
            </Link>
            
            <Form.Group className='mb-1'>
              <Form.Select
                disabled={isLoading}
                value={nbPages}
                onChange={onTogglePages}>
                {nbPageOptions.map(o =>
                  <option key={o.value} value={o.value}>{o.label}</option>)}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Header>
      
      <div>
        <Table className='text-nowrap'>
          <thead className='table-light'>
          <tr>
            {salary2Items.length > 0 && salary2Items.map(t =>
              <th key={t.label} className='align-middle'>
                {t.label}
              </th>)}
          </tr>
          </thead>
          
          <tbody>
          {items.length > 0 && items.map(p =>
            <SalaryItem
              key={p.id}
              page={page}
              onPaginate={onPaginateQuery}
              isPaginated={isPaginated}
              data={p}
              pages={nbPages}
              navigate={navigate}
              onRefresh={onProvinceRefresh}/>)}
          </tbody>
        </Table>
        {isLoading && <RepeatableTableRowsLoader/>}
        {!isLoading && isError && <Alert variant='danger'>{error?.error}</Alert>}
        
        {nbSalariesPages > 1 &&
          <Row className='mt-3 px-3 pe-3'>
            <Col>
              {isPaginatedFetching && <Spinner animation='border' size='sm' className='text-primary'/>}
            </Col>
            
            <Col>
              <APIPagination
                page={page - 1}
                setPage={setPage}
                onPaginate={onPaginateQuery}
                count={nbSalariesPages}/>
            </Col>
          </Row>}
      </div>
    </ErrorBoundary>
  )
}

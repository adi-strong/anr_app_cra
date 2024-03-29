import {ErrorBoundary} from "react-error-boundary";
import {APIPagination, AppOffCanvas, FallBackRender} from "../../../components";
import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Alert, Button, Card, Col, Form, Row, Spinner, Table} from "react-bootstrap";
import {onSetNbPages} from "../../config/config.slice";
import {nbPageOptions} from "../../../services";
import AddExpenseCategoriesForm from "./addExpenseCategoriesForm";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {RepeatableTableRowsLoader} from "../../../loaders";
import SimplePagination from "../../../components/paginations/SimplePagination";
import {
  nbExpTypesPages,
  useGetExpTypesListQuery,
  useLazyGetPaginatedExpTypesListQuery,
  useLazyGetSearchedExpTypesListQuery
} from "../model/exp.type.api.slice";
import ExpTypeItem from "./expTypeItem";

export default function ExpenseCategoriesList() {
  const [search, setSearch] = useState({keyword: '', temp: ''})
  const [show, setShow] = useState(false)
  const [page, setPage] = useState(1)
  const [isPaginated, setIsPaginated] = useState(false)
  const [isSearched, setIsSearched] = useState(false)
  
  const [getPaginatedDepartmentsList, {
    data: paginatedItems = [],
    isFetching: isPaginatedFetching,
    isError: isPaginatedError,
    error: paginatedError,
  }] = useLazyGetPaginatedExpTypesListQuery()
  
  const [getSearchedDepartmentsList, {
    data: searchedItems = [],
    isFetching: isSearchedFetching,
    isError: isSearchedError,
    error: searchedError,
  }] = useLazyGetSearchedExpTypesListQuery()
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const {nbPages} = useSelector(state => state.config)
  const {data: departments = [], isLoading, isFetching, isError, error, refetch} = useGetExpTypesListQuery(nbPages)
  
  const onTogglePages = async ({target}): void => {
    dispatch(onSetNbPages(target.value))
    setPage(1)
    
    if (isSearched) {
      setIsPaginated(false)
    }
    else if (isPaginated) await getPaginatedDepartmentsList({page, pages: nbPages})
    else await refetch()
  }
  
  const toggleShow = () => setShow(!show)
  
  const onSearchKeyUpChange = ({target}) => setSearch({keyword: target.value, temp: target.value})
  
  const onPaginateQuery = async p => {
    try {
      setIsPaginated(true)
      setIsSearched(false)
      await getPaginatedDepartmentsList({page: p, pages: nbPages})
    }
    catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onSearchQuery = async (e, name) => {
    if (e) e.preventDefault()
    setSearch({...search, keyword: ''})
    try {
      setIsSearched(true)
      setIsPaginated(false)
      setPage(1)
      await getSearchedDepartmentsList(name)
    }
    catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onProvinceRefresh = async (pages = null) => {
    if (isSearched) {
      setIsPaginated(false)
      onSearchQuery(null, search.temp)
    }
    else if (isPaginated) {
      setIsSearched(false)
      onPaginateQuery(page)
    }
    else {
      setPage(1)
      setIsSearched(false)
      setIsPaginated(false)
      await refetch()
    }
  }
  
  const onRefresh = async () => {
    setPage(1)
    setIsSearched(false)
    setIsPaginated(false)
    await refetch()
  }
  
  const [itemOffset, setItemOffset] = useState(0)
  
  let items, sItems, currentItems
  items = useMemo(() => {
    let obj = []
    if (!(isError && isPaginatedError)) {
      if (page > 1 && paginatedItems.length > 0 && isPaginated) obj = paginatedItems.filter(p =>
        p.name?.toLowerCase().includes(search.keyword.toLowerCase())
      )
      else if (departments.length > 0) obj = departments.filter(p =>
        p.name?.toLowerCase().includes(search.keyword.toLowerCase())
      )
      else obj = []
    }
    else obj = []
    
    return obj
  }, [
    isError,
    departments,
    search,
    page,
    isPaginatedError,
    isPaginated,
    paginatedItems])
  
  sItems = useMemo(() => {
    let obj
    if (!isSearchedError && isSearched) {
      if (searchedItems.length > 0) obj = searchedItems.filter(p =>
        p.name.toLowerCase().includes(search.keyword.toLowerCase())
      )
      else obj = []
    }
    else obj = []
    
    return obj
  }, [isSearchedError, isSearched, searchedItems, search])
  
  const endOffset = itemOffset + nbPages
  
  currentItems = useMemo(() => {
    return sItems?.slice(itemOffset, endOffset)
  }, [sItems, endOffset, itemOffset])
  
  useEffect(() => {
    if (isPaginatedError) {
      if (paginatedError?.error) toast.error(paginatedError.error)
      if (paginatedError?.data && paginatedError.data['hydra:description']) {
        toast.error(paginatedError.data['hydra:description'])
      }
    }
    
    if (isSearchedError) {
      if (searchedError?.error) toast.error(searchedError.error)
      if (searchedError?.data && searchedError.data['hydra:description']) {
        toast.error(searchedError.data['hydra:description'])
      }
    }
  }, [isPaginatedError, isSearchedError, paginatedError, searchedError])
  
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
          Liste des provinces
        </Card.Title>
        
        <Row>
          <Col md={6} className='mb-2 d-flex'>
            <Button disabled={false} className='me-1 mb-1' onClick={toggleShow}>
              Ajouter <i className='bi bi-chevron-double-right'/>
            </Button>
            
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
          
          <Col className='mb-2'>
            <div className='justify-content-md-end'>
              <Form onSubmit={e => onSearchQuery(e, search.temp)}>
                <Form.Control
                  disabled={isSearchedFetching || isPaginatedFetching || isLoading}
                  autoComplete='off'
                  name='keyword'
                  placeholder='Rechercher'
                  value={search.keyword}
                  onChange={onSearchKeyUpChange}/>
              </Form>
            </div>
          </Col>
        </Row>
      </Card.Header>
      
      <div>
        <Table className='text-nowrap'>
          <thead className='table-light'>
          <tr>
            <th className='align-middle'>TYPE</th>
            <th className='text-end text-primary'/>
          </tr>
          </thead>
          
          <tbody>
          {!isError && !isSearched && items.length > 0 && items.map(p =>
            <ExpTypeItem
              key={p.id}
              isSearched={isSearched}
              onSearchQuery={onSearchQuery}
              page={page}
              onPaginate={onPaginateQuery}
              isPaginated={isPaginated}
              name={search.temp}
              data={p}
              pages={nbPages}
              navigate={navigate}
              onRefresh={onProvinceRefresh}/>)}
          
          {isSearched && currentItems?.length > 0 && currentItems.map(p =>
            <ExpTypeItem
              key={p.id}
              isSearched={isSearched}
              onSearchQuery={onSearchQuery}
              page={page}
              onPaginate={onPaginateQuery}
              isPaginated={isPaginated}
              name={search.temp}
              data={p}
              pages={nbPages}
              navigate={navigate}
              onRefresh={onProvinceRefresh}/>)}
          </tbody>
        </Table>
        {isLoading && <RepeatableTableRowsLoader/>}
        {!isLoading && isError && <Alert variant='danger'>{error?.error}</Alert>}
        
        {!isSearched && nbExpTypesPages > 1 &&
          <Row className='mt-3 px-3 pe-3'>
            <Col>
              {isPaginatedFetching && <Spinner animation='border' size='sm' className='text-primary'/>}
            </Col>
            
            <Col>
              <APIPagination
                page={page - 1}
                setPage={setPage}
                onPaginate={onPaginateQuery}
                count={nbExpTypesPages}/>
            </Col>
          </Row>}
        
        {isSearched &&
          <div className='mt-3 px-3 pe-3'>
            <SimplePagination
              items={sItems}
              setItemOffset={setItemOffset}
              itemsPerPage={nbPages}/>
          </div>}
      </div>
      
      <AppOffCanvas
        show={show}
        onHide={toggleShow}
        title={<><i className='bi bi-plus'/> Ajout de types</>}
        children={<AddExpenseCategoriesForm onHide={toggleShow} pages={nbPages} onRefresh={onProvinceRefresh}/>}/>
    </ErrorBoundary>
  )
}

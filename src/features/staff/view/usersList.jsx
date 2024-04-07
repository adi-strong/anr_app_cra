import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {onSetNbPages} from "../../config/config.slice";
import toast from "react-hot-toast";
import {ErrorBoundary} from "react-error-boundary";
import {APIPagination, AppOffCanvas, FallBackRender} from "../../../components";
import {Alert, Button, Card, Col, Form, Row, Spinner, Table} from "react-bootstrap";
import {nbPageOptions} from "../../../services";
import {RepeatableTableRowsLoader} from "../../../loaders";
import SimplePagination from "../../../components/paginations/SimplePagination";
import {
  nbUsersPages,
  useGetUsersListQuery,
  useLazyGetPaginatedUsersListQuery,
  useLazyGetSearchedUsersListQuery
} from "../model/user.api.slice";
import {userItems} from "../model/user.service";
import UserItem from "./userItem";
import UserForm from "./userForm";

export default function UsersList() {
  const [search, setSearch] = useState({keyword: '', temp: ''})
  const [page, setPage] = useState(1)
  const [isPaginated, setIsPaginated] = useState(false)
  const [isSearched, setIsSearched] = useState(false)
  const [show, setShow] = useState(false)
  
  const [getPaginatedDepartmentsList, {
    data: paginatedItems = [],
    isFetching: isPaginatedFetching,
    isError: isPaginatedError,
    error: paginatedError,
  }] = useLazyGetPaginatedUsersListQuery()
  
  const [getSearchedDepartmentsList, {
    data: searchedItems = [],
    isFetching: isSearchedFetching,
    isError: isSearchedError,
    error: searchedError,
  }] = useLazyGetSearchedUsersListQuery()
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const {nbPages} = useSelector(state => state.config)
  const {data: agents = [], isLoading, isFetching, isError, error, refetch} = useGetUsersListQuery(nbPages)
  
  const toggleShow = () => setShow(!show)
  
  const onTogglePages = async ({target}): void => {
    dispatch(onSetNbPages(target.value))
    setPage(1)
    
    if (isSearched) {
      setIsPaginated(false)
    }
    else if (isPaginated) await getPaginatedDepartmentsList({page, pages: nbPages})
    else await refetch()
  }
  
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
        (p.username.toLowerCase().includes(search.keyword.toLowerCase())) ||
        (p?.fullName && p.fullName.toLowerCase().includes(search.keyword.toLowerCase())) ||
        (p?.phone && p.phone.toLowerCase().includes(search.keyword.toLowerCase())) ||
        (p?.email && p.email.toLowerCase().includes(search.keyword.toLowerCase()))
      )
      else if (agents.length > 0) obj = agents.filter(p =>
        (p.username.toLowerCase().includes(search.keyword.toLowerCase())) ||
        (p?.fullName && p.fullName.toLowerCase().includes(search.keyword.toLowerCase())) ||
        (p?.phone && p.phone.toLowerCase().includes(search.keyword.toLowerCase())) ||
        (p?.email && p.email.toLowerCase().includes(search.keyword.toLowerCase()))
      )
      else obj = []
    }
    else obj = []
    
    return obj
  }, [
    isError,
    agents,
    search,
    page,
    isPaginatedError,
    isPaginated,
    paginatedItems])
  
  sItems = useMemo(() => {
    let obj
    if (!isSearchedError && isSearched) {
      if (searchedItems.length > 0) obj = searchedItems.filter(p =>
        (p.username.toLowerCase().includes(search.keyword.toLowerCase())) ||
        (p?.fullName && p.fullName.toLowerCase().includes(search.keyword.toLowerCase())) ||
        (p?.phone && p.phone.toLowerCase().includes(search.keyword.toLowerCase())) ||
        (p?.email && p.email.toLowerCase().includes(search.keyword.toLowerCase()))
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
          Liste des utilisateurs
        </Card.Title>
        
        <Row>
          <Col md={6} className='mb-2 d-flex'>
            <Button disabled={isLoading} className='me-1 mb-1' onClick={toggleShow}>
              Créer <i className='bi bi-chevron-right'/>
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
            {userItems.length > 0 && userItems.map(t =>
              <th key={t.label} className='align-middle'>
                {t.label}
              </th>)}
            <th className='align-middle'>Actif / Inactif</th>
            <th className='text-end text-primary'/>
          </tr>
          </thead>
          
          <tbody>
          {!isError && !isSearched && items.length > 0 && items.map(p =>
            <UserItem
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
            <UserItem
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
        
        {!isSearched && nbUsersPages > 1 &&
          <Row className='mt-3 px-3 pe-3'>
            <Col>
              {isPaginatedFetching && <Spinner animation='border' size='sm' className='text-primary'/>}
            </Col>
            
            <Col>
              <APIPagination
                page={page - 1}
                setPage={setPage}
                onPaginate={onPaginateQuery}
                count={nbUsersPages}/>
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
        title={<>Création d'un compte utilisateur</>}
        children={<UserForm onHide={toggleShow} onRefresh={onRefresh}/>}
        show={show}
        onHide={toggleShow}/>
    </ErrorBoundary>
  )
}

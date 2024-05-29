import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {useEffect, useMemo, useState} from "react";
import {Button, Col, Form, InputGroup, Row, Spinner, Table} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {onSetNbPages} from "../../config/config.slice";
import {nbPageOptions} from "../../../services";
import {
  useGetSearchDailyNewsQuery,
  useGetSearchNewsResourceMutation
} from "../services/news.api.slice";
import toast from "react-hot-toast";
import {RepeatableTableRowsLoader} from "../../../loaders";
import {newsItems} from "../services/news.conf.service";
import NewsItem from "./newsItem";
import {onFieldChange} from "../../../services/form.handler.service";
import SimplePagination from "../../../components/paginations/SimplePagination";

export default function NewsReportsList() {
  const [page, setPage] = useState(1)
  const [keywords, setKeywords]
    = useState({startAt: '', endAt: ''})
  const dispatch = useDispatch()
  const [isSearch, setIsSearch] = useState(false)
  const [search, setSearch] = useState('')
  const [items, setItems] = useState([])
  const [itemOffset, setItemOffset] = useState(0)
  const [getSearchNewsResource, {isLoading: isLoad, isError: isErr, error: err}]
    = useGetSearchNewsResourceMutation()
  
  const {nbPages} = useSelector(state => state.config)
  const {data: news=[], isLoading, isFetching, isError, error, refetch}
    = useGetSearchDailyNewsQuery()
  
  const onRefresh = async () => {
    setPage(1)
    setIsSearch(false)
    await refetch()
    setItems(news)
  }
  
  const onSearchQuery = async (e) => {
    e.preventDefault()
    let send
    const startAt = keywords.startAt, endAt = keywords.endAt
    try {
      if (startAt && endAt) send = await getSearchNewsResource(keywords)
      else if (startAt) send = await getSearchNewsResource({startAt})
      else if (endAt) send = await getSearchNewsResource({endAt})
      
      if (send?.data) {
        setItems(send?.data)
        setIsSearch(true)
      }
    } catch (e) {
      toast.error('Problème de connexion.')
    }
  }
  
  // *****************************************************************************************
  
  let currentItems, newsData
  useEffect(() => {
    let obj = []
    if (!isError && !isSearch && news.length > 0) {
      obj = news.map(a => a)
      setItems(obj)
    }
  }, [news, search, isError, isSearch])
  
  newsData = useMemo(() => {
    let obj = []
    if (items?.length > 0) {
      obj = items.map(a => a)
      obj = obj.filter(a => a?.title.toLowerCase().includes(search.toLowerCase()))
    }
    
    return obj
  }, [items, search])
  
  const endOffset = itemOffset + nbPages
  
  currentItems = useMemo(() => {
    return newsData?.slice(itemOffset, endOffset)
  }, [newsData, endOffset, itemOffset])
  
  // *****************************************************************************************
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) {
        toast.error(error.data['hydra:description'])
      }
    }
    
    if (isErr) {
      if (err?.error) toast.error(err.error)
      if (err?.data && err.data['hydra:description']) {
        toast.error(err.data['hydra:description'])
      }
    }
  }, [isError, error, isErr, err])
  
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <Row className='mt-3'>
        <Col md={7} className='mb-2 d-flex'>
          <Form.Select
            disabled={isLoading}
            className='mx-1 me-1 w-15'
            value={nbPages}
            onChange={({target}) =>
              dispatch(onSetNbPages(target.value))}>
            {nbPageOptions.map(o =>
              <option key={o.value} value={o.value}>{o.label}</option>)}
          </Form.Select>
          
          <Form.Control
            disabled={isLoading || isLoad}
            className='w-40'
            autoComplete='off'
            value={search}
            placeholder='Recherche...'
            onChange={({target}) => setSearch(target.value)}/>
        </Col>
        
        <Col className='mb-2'>
          <Form onSubmit={onSearchQuery}>
            <div className='d-flex'>
              <Form.Control
                disabled={isLoading || isLoad}
                type='date'
                name='startAt'
                value={keywords.startAt}
                className='me-2'
                onChange={e => onFieldChange(e, keywords, setKeywords)}/>
              
              <InputGroup>
                <Form.Control
                  disabled={isLoading || isLoad}
                  type='date'
                  name='endAt'
                  value={search.endAt}
                  onChange={e => onFieldChange(e, keywords, setKeywords)}/>
                
                <Button type='submit' variant='secondary' disabled={isLoading || isLoad}>
                  <i className='bi bi-search'/>
                </Button>
              </InputGroup>
            </div>
          </Form>
        </Col>
      </Row>
      
      <div>
        <Table className='text-nowrap'>
          <thead className='table-light'>
          <tr>
            {newsItems.length > 0 && newsItems.map((t, i) =>
              <th key={i} className='align-middle'>{t.label}</th>)}
            <th className='align-middle text-end text-primary'>
              {!isFetching &&
                <i
                  className='bi bi-arrow-clockwise'
                  style={{cursor: 'pointer'}}
                  onClick={onRefresh}
                />}
              
              {isFetching && <Spinner animation='grow' size='sm'/>}
            </th>
          </tr>
          </thead>
          
          <tbody>
          {!isError && currentItems && currentItems?.length > 0 && currentItems.map(p =>
            <NewsItem
              key={p.id}
              onSearchQuery={onSearchQuery}
              page={page}
              data={p}
              pages={nbPages}/>)}
          </tbody>
        </Table>
      </div>
      
      {isLoading && <RepeatableTableRowsLoader/>}
      
      {!(isLoading || isLoad) && !isError && !isErr &&
        <div className='mt-3 px-3 pe-3'>
          <SimplePagination
            items={newsData}
            setItemOffset={setItemOffset}
            itemsPerPage={nbPages}/>
        </div>}
    </ErrorBoundary>
  )
}

import {entrypoint} from "../../../app/store";
import avatar2 from "../../../assets/images/avatar/default_profile.jpg";
import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {memo, useEffect, useMemo, useState} from "react";
import {onSetNbPages, onToggleMenu} from "../../config/config.slice";
import {useGetSoonRetiredAgentsQuery} from "../model/agent.stats.api.service";
import toast from "react-hot-toast";
import {PageLayout} from "../../../layouts";
import {Button, Card, Col, Form, Row, Spinner, Table} from "react-bootstrap";
import {nbPageOptions} from "../../../services";
import {agentStatItems} from "../model/agent.service";
import SimplePagination from "../../../components/paginations/SimplePagination";
import {RepeatableTableRowsLoader} from "../../../loaders";

const Item = ({a}) => {
  const profile = a?.profile ? entrypoint+a.profile?.contentUrl : avatar2
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr key={a.id}>
        <td className='align-middle'>{a?.register}</td>
        
        <td className="align-middle">
          <div className="d-flex align-items-center">
            <div>
              <img src={profile} alt="" className="avatar-md avatar rounded-circle"/>
            </div>
            <div className="ms-3 lh-1">
              <h5 className=" mb-1">
                <Link to={`/app/agents/${a.id}/show`} className='text-dark'>
                  {a.name.toUpperCase()+' '}
                  {a?.lastName && a.lastName?.toUpperCase()+' '}
                  <span className='text-capitalize'>{a?.firstName && a.firstName}</span>
                </Link>
              </h5>
              {a?.grade &&
                <p className="mb-0">
                  {a.grade.name.toLowerCase()+' '}/{' '}
                  <Link to={`/app/grades/${a.grade.id}/show`}><i className='bi bi-link'/></Link>
                </p>}
            </div>
          </div>
        </td>
        
        <td className='align-middle'>
          {a?.age ? a.age+' ans' : '-'}
        </td>
        
        <td className='align-middle'>
          <Link to={`/app/agents/${a.id}/show`}>
            <i className='bi bi-eye'/>
          </Link>
        </td>
      </tr>
    </ErrorBoundary>
  )
}

const SoonRetiredAgents = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  const {data: agents=[], isLoading, isFetching, isError, error, refetch} = useGetSoonRetiredAgentsQuery('LIST')
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  const {nbPages} = useSelector(state => state.config)
  const [search, setSearch] = useState('')
  const [itemOffset, setItemOffset] = useState(0)
  
  let items, currentItems
  items = useMemo(() => {
    let obj = []
    if (!isError && agents.length > 0) obj = agents.filter(a =>
      (a.name.toLowerCase().includes(search.toLowerCase())) ||
      (a?.lastName && a.lastName.toLowerCase().includes(search.toLowerCase())) ||
      (a?.firstName && a.firstName.toLowerCase().includes(search.toLowerCase()))
    )
    else obj = []
    
    return obj
  }, [isError, agents, search])
  
  const endOffset = itemOffset + nbPages
  
  currentItems = useMemo(() => {
    return items?.slice(itemOffset, endOffset)
  }, [items, endOffset, itemOffset])
  
  const onRefresh = async () => await refetch()
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Agents retraités'/>
      <PageLayout>
        <AppBreadcrumb title='Agents retraités'/>
        
        <Card>
          <Card.Header className='bg-white pt-5'>
            <Card.Title>
              {isFetching && <Spinner animation='grow' size='sm' className='text-primary me-1'/>}
              {!isFetching &&
                <i
                  className='bi bi-arrow-clockwise text-primary me-1'
                  onClick={onRefresh}
                  style={{ cursor: 'pointer' }} />}
              <i className='bi bi-person-fill-up text-primary'/> Liste des agents retraités
            </Card.Title>
            
            <Row>
              <Col md={5} className='mb-3 d-flex'>
                <Button disabled={isLoading} className='me-1 mb-1'>
                  <i className='bi bi-printer-fill'/> Imprimer
                </Button>
                
                <Form.Group className='mb-1'>
                  <Form.Select
                    disabled={isLoading}
                    value={nbPages}
                    onChange={({target}) => dispatch(onSetNbPages(target.value))}>
                    {nbPageOptions.map(o =>
                      <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={7} className='mb-3 justify-content-md-end'>
                <Form.Control
                  disabled={isFetching}
                  autoComplete='off'
                  placeholder='Rechercher'
                  value={search}
                  onChange={({target}) => setSearch(target.value)}/>
              </Col>
            </Row>
          </Card.Header>
          
          <div>
            <Table responsive>
              <thead className='table-light'>
              <tr>
                {agentStatItems.length > 0 && agentStatItems.map(t =>
                  <th key={t.label} className='align-middle'>{t.label}</th>)}
                <th className='align-middle'/>
              </tr>
              </thead>
              
              <tbody>
              {!isError && currentItems?.length > 0 && currentItems?.map(a =>
                <Item key={a.id} a={a}/>)}
              </tbody>
            </Table>
          </div>
          
          {!isError && agents &&
            <div className='mt-3 px-3 pe-3'>
              <SimplePagination
                items={items}
                setItemOffset={setItemOffset}
                itemsPerPage={nbPages}/>
            </div>}
          {isLoading && <RepeatableTableRowsLoader/>}
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(SoonRetiredAgents)

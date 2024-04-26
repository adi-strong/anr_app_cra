import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, AppOffCanvas, FallBackRender, PageHeading, RemoveModal} from "../../../components";
import {memo, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Button, Col, Row, Spinner, Tab, Tabs} from "react-bootstrap";
import bgImg from "../../../assets/images/background/logo.png";
import avatar1 from "../../../assets/images/avatar/default_profile.jpg";
import {useDeleteAgentMutation, useGetUniqueAgentQuery} from "../model/agent.api.slice";
import {entrypoint} from "../../../app/store";
import {agentTabsItems} from "../model/agent.service";
import AgentOverview from "./agentOverview";
import AgentMissions from "./agentMissions";
import AgentSalaries from "./agentSalaries";
import AgentFolders from "./agentFolders";
import AgentAssignments from "./agentAssignments";
import AgentMedicalFiles from "./agentMedicalFiles";
import toast from "react-hot-toast";
import AgentStateForm from "./agentStateForm";

const ShowAgent = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  const [key, setKey] = useState('overview')
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [deleteAgent, {isLoading: isDeLoading}] = useDeleteAgentMutation()
  
  const toggleOpen = () => setOpen(!open)
  const {id} = useParams()
  const {data, isLoading, isFetching, isError, error, refetch} = useGetUniqueAgentQuery(id)
  
  const toggleShow = () => setShow(!show)
  
  const onRefresh = async () => await refetch()
  
  const onDelete = async () => {
    toggleOpen()
    const send = await deleteAgent(data)
    if (!send?.error) {
      toast.success('Suppression bien efféctuée.')
      navigate('/app/agents', {replace: true})
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
      <PageHeading title='Agent'/>
      <PageLayout>
        <AppBreadcrumb title={`Agent n°${id}`}/>
        <Row className='align-items-center'>
          <Col xxl={12}>
            <div
              className='rounded-top'
              style={{
                background: `url(${bgImg}) no-repeat`,
                backgroundSize: 'cover',
                paddingTop: '25rem',
              }}/>
            
            <div className='bg-white rounded-bottom smooth-shadow-sm'>
              <div className='d-flex align-items-center justify-content-between pt-4 pb-6 px-4'>
                <div className='d-flex align-items-center'>
                  <div className='avatar-xxl avatar-online me-2
                      position-relative d-flex justify-content-end
                      align-items-end mt-n10'>
                    <img
                      src={!(isError && isLoading) && data && data?.profile ? entrypoint+data.profile?.contentUrl : avatar1}
                      className="avatar-xxl rounded-circle border border-4 border-white-color-40" alt=""/>
                  </div>
                  
                  <div className='lh-1'>
                    <h2 className="mb-0">
                      {!(isError && isLoading) && data && (
                        <>
                          {data.name.toUpperCase()+' '}
                          {data?.lastName && data.lastName.toUpperCase()+' '}
                          <span className='text-capitalize'>{data?.firstName && data.firstName.toUpperCase()}</span>
                        </>
                      )}
                      <Link
                        to="#!"
                        className="text-decoration-none"
                        data-bs-toggle="tooltip"
                        data-placement="top"
                        title="" data-original-title="Beginner"/>
                    </h2>
                    
                    <div className="mb-0 d-block">
                      {!isFetching &&
                        <i
                          className='bi bi-arrow-clockwise text-primary me-1'
                          onClick={onRefresh}
                          style={{ cursor: 'pointer' }}/>}
                      
                      {isFetching && <Spinner animation='grow' size='sm' className='text-primary me-1'/>}
                      
                      {!(isError && isLoading) && data && (
                        <>
                          {data?.job && data.job.name.toLowerCase()}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  {!(isError && isLoading) && data && (
                    <div className='d-flex'>
                      <Button
                        disabled={isFetching}
                        variant='warning'
                        onClick={toggleShow}
                        className='me-2'>
                        État <i className='bi bi-chevron-right'/>
                      </Button>
                      
                      <Link
                        to={`/app/agents/${data.id}/edit`}
                        className="d-none d-md-block btn btn-primary">
                        Modifier
                      </Link>
                      
                      <Button
                        disabled={isDeLoading}
                        variant='danger'
                        className='mx-1'
                        onClick={toggleOpen}>
                        <i className='bi bi-trash'/> Supprimer
                      </Button>
                    </div>
                  )}
                  
                  {isLoading && (
                    <>
                      <Button disabled={isFetching} variant='outline-primary'>Modifier</Button>
                      <Button disabled={isFetching} variant='danger' className='mx-1'>
                        <i className='bi bi-trash'/> Supprimer
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <Tabs
                onSelect={k => setKey(k)}
                activeKey={key}
                variant='pills'
                className='nav-lt-tab px-4'>
                {agentTabsItems.length > 0 && agentTabsItems.map((p, i) =>
                  <Tab key={i} title={p.title} eventKey={p.event}/>)}
              </Tabs>
            </div>
            
            <div className='py-6'>
              <Row>
                {key === 'overview' &&
                  <AgentOverview
                    agent={data}
                    isError={isError}
                    loader={isLoading}/>}
                
                {key === 'missions' &&
                  <AgentMissions
                    agent={data}
                    isError={isError}
                    onRefresh={onRefresh}
                    loader={isLoading}/>}
                
                {key === 'salaries' &&
                  <AgentSalaries
                    agent={data}
                    isError={isError}
                    onRefresh={onRefresh}
                    loader={isLoading}/>}
                
                {key === 'folders' &&
                  <AgentFolders
                    agent={data}
                    isError={isError}
                    onRefresh={onRefresh}
                    loader={isLoading}/>}
                
                {key === 'assignments' &&
                  <AgentAssignments
                    agent={data}
                    isError={isError}
                    onRefresh={onRefresh}
                    loader={isLoading}/>}
                
                {key === 'medical' &&
                  <AgentMedicalFiles
                    agent={data}
                    isError={isError}
                    onRefresh={onRefresh}
                    loader={isLoading}/>}
              </Row>
            </div>
          </Col>
        </Row>
      </PageLayout>
      
      {data &&
        <RemoveModal
          message={`cet agent (${data?.name?.toUpperCase()})`}
          onRemove={onDelete}
          data={data}
          show={open}
          onHide={toggleOpen}
          onRefresh={onRefresh}/>}
      
      {data &&
        <AppOffCanvas
          title="état de l'agent"
          children={<AgentStateForm data={data} onHide={toggleShow} onRefresh={onRefresh}/>}
          show={show}
          onHide={toggleShow}/>}
    </ErrorBoundary>
  )
}

export default memo(ShowAgent)

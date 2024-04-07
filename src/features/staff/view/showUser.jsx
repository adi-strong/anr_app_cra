import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, AppOffCanvas, FallBackRender, PageHeading, RemoveModal} from "../../../components";
import {useDispatch} from "react-redux";
import {memo, useEffect, useState} from "react";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Button, Col, Row, Spinner, Tab, Tabs} from "react-bootstrap";
import bgImg from "../../../assets/images/background/profile-cover.jpg";
import avatar1 from "../../../assets/images/avatar/default_profile.jpg";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDeleteUserMutation, useGetUniqueUserQuery} from "../model/user.api.slice";
import {entrypoint} from "../../../app/store";
import UserForm from "./userForm";
import toast from "react-hot-toast";
import ShowUserOverview from "./showUserOverview";

const tabs = [
  {title: 'Aperçu', event: 'overview'},
]

const ShowUser = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  const [key, setKey] = useState('overview')
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [deleteUser, {isLoading: isDelLoading}] = useDeleteUserMutation()
  
  const onDelete = async () => {
    toggleShow()
    try {
      const send = await deleteUser(data)
      if (send?.data) {
        toast.success('Suppression bien efféctuée.')
        navigate('/app/users', {replace: true})
      }
    } catch (e) {
      toast.error('Problème de connexion.')
    }
  }
  
  const toggleOpen = () => setOpen(!open)
  
  const toggleShow = () => setShow(!show)
  
  const {id} = useParams()
  const {data, isError, isFetching, isLoading, refetch} = useGetUniqueUserQuery(id)
  
  const onRefresh = async () => await refetch()
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Mon Profile'/>
      <PageLayout>
        <AppBreadcrumb title='Compte utilisateur'/>
        <Row className='align-items-center'>
          <Col xxl={12}>
            <div
              className='pt-20 rounded-top'
              style={{
                background: `url(${bgImg}) no-repeat`,
                backgroundSize: 'cover',
              }}/>
            
            <div className='bg-white rounded-bottom smooth-shadow-sm'>
              <div className='d-flex align-items-center justify-content-between pt-4 pb-6 px-4'>
                <div className='d-flex align-items-center'>
                  <div className='avatar-xxl avatar-indicators avatar-online me-2
                      position-relative d-flex justify-content-end
                      align-items-end mt-n10'>
                    <img
                      src={!isError && data && data?.agentAccount && data.agentAccount?.profile
                        ? entrypoint+data.agentAccount.profile?.contentUrl
                        : avatar1}
                      className="avatar-xxl rounded-circle border border-4 border-white-color-40" alt=""/>
                  </div>
                  
                  <div className='lh-1'>
                    <h2 className="mb-0">
                      {isLoading && <small className='fw-normal'>Chargement en cours...</small>}
                      {!(isError && isLoading) && data && <span className="text-capitalize">{data?.fullName}</span>}
                      <Link
                        to="#!"
                        className="text-decoration-none"
                        data-bs-toggle="tooltip"
                        data-placement="top"
                        title="" data-original-title="Beginner"/>
                    </h2>
                    
                    <p className="mb-0 d-block">
                      {!(isError && isLoading) && data && `@${data.username}`} <br/> <br/>
                      
                      {!(isError && isLoading) && data && (
                        <>
                          {data?.agentAccount &&
                            <><Link to={`/app/agents/${data.agentAccount.id}/show`}>
                              <i className='bi bi-person-fill'/> Voir les détails de l'agent</Link> | </>}
                          <span className='text-primary' style={{ cursor: 'pointer' }} onClick={onRefresh}>
                            {!isFetching && <i className='bi bi-arrow-clockwise me-1'/>}
                            {isFetching && <Spinner animation='grow' size='sm' className='me-1'/>}
                            Actualiser cette page
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Button
                    disabled={isLoading || isDelLoading}
                    variant='danger'
                    className="me-1"
                    onClick={toggleShow}>
                    Supprimer
                  </Button>
                  
                  <Button
                    disabled={isLoading || isDelLoading}
                    variant='outline-primary'
                    onClick={toggleOpen}>
                    Éditer ce compte
                  </Button>
                </div>
              </div>
              
              <Tabs
                onSelect={k => setKey(k)}
                activeKey={key}
                variant='pills'
                className='nav-lt-tab px-4'>
                {tabs.length > 0 && tabs.map((p, i) =>
                  <Tab key={i} title={p.title} eventKey={p.event}/>)}
              </Tabs>
            </div>
            
            <div className='py-6'>
              <Row>
                {key === 'overview' && <ShowUserOverview error={isError} loader={isLoading} data={data}/>}
              </Row>
            </div>
          </Col>
        </Row>
      </PageLayout>
      
      {!(isError && isLoading) && data &&
        <AppOffCanvas
          show={open}
          onHide={toggleOpen}
          title={<><i className='bi bi-pencil'/> Modification du Profil</>}
          children={<UserForm data={data} onRefresh={onRefresh} onHide={toggleOpen}/>} />}
     
      {!(isError && isLoading) && data &&
        <RemoveModal
          data={data}
          onRemove={onDelete}
          message={`cet utilisateur (${data.username})`}
          show={show}
          onHide={toggleShow}
          onRefresh={onRefresh}/>}
    </ErrorBoundary>
  )
}

export default memo(ShowUser)

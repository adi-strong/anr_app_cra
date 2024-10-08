import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, AppOffCanvas, FallBackRender, PageHeading, RowContent2} from "../../../components";
import {memo, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Button, Card, Col, Modal, Row, Spinner} from "react-bootstrap";
import {useDisUsedVehicleMutation, useGetUniqueVehicleQuery} from "../model/vehicle.api.slice";
import {Link, useParams} from "react-router-dom";
import {FadeSpinLoader} from "../../../loaders";
import toast from "react-hot-toast";
import VehicleForm from "./vehicleForm";
import {entrypoint} from "../../../app/store";
import VehicleAssForm from "./vehicleAssForm";
import avatar2 from "../../../assets/images/avatar/default_profile.jpg";
import VehicleAssignmentsList from "./vehicleAssignmentsList";

const ConfirmDisUsedModal = ({show, onHide, onSubmit, data}) => {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Modal show={show} onHide={onHide}>
        <Modal.Header className='bg-danger' closeButton>
          <Modal.Title className='text-light'><i className='bi bi-question-circle-fill'/> Désaffectation</Modal.Title>
        </Modal.Header>
        
        <Modal.Body className='text-center'>
          <code>
            <small>
              <i className='bi bi-exclamation-circle-fill'/> Cette action est irréversible.
            </small>
          </code> <br/>
          En ête-vous certain(e) <i className='bi bi-question-circle-fill text-danger'/>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant='light' onClick={onHide}>
            <i className='bi bi-x'/> Annuler
          </Button>
          
          <Button autoFocus variant='danger' onClick={onSubmit}>
            <i className='bi bi-check'/> Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
    </ErrorBoundary>
  )
}

const ShowVehicle = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'patrimony' }))
  }, [dispatch])
  
  const {id} = useParams()
  const {data, isLoading, isFetching, isError, error, refetch} = useGetUniqueVehicleQuery(id)
  
  const onRefresh = async () => await refetch()
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
  const [click, setClick] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [disUsedVehicle, {isLoading: isDisUsedLoading, isError: isDisUsedError, error: disUsedError}]
    = useDisUsedVehicleMutation()
  
  const toggleShow = () => setShow(!show)
  
  const toggleOpen = () => setOpen(!open)
  
  const toggleClick = () => setClick(!click)
  
  const toggleConfirm = () => setConfirm(!confirm)
  
  const onDisUsedSubmit = async () => {
    toggleConfirm()
    try {
      const send = await disUsedVehicle(data)
      if (send?.data) {
        toast.success('Désaffectation OK.')
        onRefresh()
      }
    } catch (e) {
      toast.error('Problème de connexion.')
    }
  }
  
  useEffect(() => {
    if (isDisUsedError) {
      if (disUsedError?.error) toast.error(disUsedError.error)
      if (disUsedError?.data && disUsedError.data['hydra:description']) {
        toast.error(disUsedError.data['hydra:description'])
      }
    }
  }, [isDisUsedError, disUsedError])
  
  const {show: theme} = useSelector(state => state.theme)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title={`Véhicule`}/>
      <PageLayout>
        <AppBreadcrumb title={`Véhicule`}/>
        
        <Row>
          <Col className='mb-3'>
            <Button disabled={isFetching} variant='danger' onClick={toggleOpen} className='me-1'>
              <i className='bi bi-trash'/> Supprimer
            </Button>
            
            <Button disabled={isFetching} onClick={toggleShow}>
              <i className='bi bi-pencil-square'/> Modifier
            </Button>
          </Col>
          
          <Col className='mb-3 text-md-end'>
            <Link className='btn btn-link' to='/app/vehicles'>
              <i className='bi bi-arrow-left'/> Retour à la liste
            </Link>
            
            <Button disabled={isFetching} variant='link' onClick={onRefresh}>
              {isFetching && <Spinner animation='grow' size='sm' className='me-1'/>}
              {!isFetching && <i className='bi bi-arrow-clockwise me-1'/>}
              Actualiser
            </Button>
          </Col>
        </Row>
        
        <Card>
          <Card.Body>
            {!(isError && isLoading) && (
              <>
                <h4 className="card-title fw-bold mt-3">
                  <i className='bi bi-ev-front'/> {!isError && data && data.brand}
                </h4> <hr/>
                
                {!(isError && isLoading) && data &&
                  <Row>
                    <Col className='mb-3'>
                      <RowContent2 title='Marque' content={data.brand?.toUpperCase()}/>
                      <RowContent2 title='Type' content={data?.type && data.type.name?.toUpperCase()}/>
                      <RowContent2 title='Immatriculation' content={data?.numberplate && data.numberplate?.toUpperCase()}/>
                      <RowContent2 title='N° Chassis' content={data?.chassis && data.chassis?.toUpperCase()}/>
                    </Col>
                    
                    <Col className='mb-3'>
                      <RowContent2
                        title='Attestation de véhicule'
                        content={(
                          <>
                            <i className='bi bi-cloud-download me-1'/>
                            <a href={entrypoint+data.certificate?.contentUrl} target='_blank' rel='noreferrer'>
                              {data?.certificate && data.certificate?.contentUrl?.substring(12)}
                            </a>
                          </>
                        )}/>
                      
                      <RowContent2 title='Affectation' content={(
                        <>
                          {!data?.agent &&
                            <Button disabled={isFetching} onClick={toggleClick}>
                              Nouvelle affectation <i className='bi bi-chevron-right'/>
                            </Button>}
                          
                          {data?.agent && (
                            <>
                              <img
                                src={data.agent?.profile ? entrypoint+data.agent.profile?.contentUrl : avatar2}
                                alt=""
                                className="avatar-md avatar rounded-circle me-1"/>
                              <Link
                                to={`/app/agents/${data.agent.id}/show`}
                                className={`text-${theme ? 'light-success' : 'dark'}`}>
                                {data.agent.name?.toUpperCase()+' '}
                                {data.agent?.lastName && data.agent.lastName?.toUpperCase()+' '}
                                {data.agent?.firstName && data.agent.firstName?.toUpperCase()}
                              </Link>
                              <span className='mx-2'>
                                <small>
                                  ({data.agent?.grade && data.agent.grade.name?.toUpperCase()})
                                </small>
                              </span>
                              
                              <br/> <br/>
                              <Button disabled={isFetching || isDisUsedLoading} variant='danger' onClick={toggleConfirm}>
                                <i className='bi bi-x-circle me-1'/>
                                Désaffecter
                              </Button>
                            </>
                          )}
                        </>
                      )}/>
                    </Col>
                  </Row>}
              </>
            )}
            
            {isLoading && <FadeSpinLoader loading={isLoading}/>}
          </Card.Body>
        </Card>
        
        <Card className='mt-4'>
          <Card.Body>
            <h4 className="card-title mt-3">
              <i className='bi bi-clock-history'/> Historique des affectations
            </h4>
            
            {!(isError && isLoading) && data && data?.vehicleAssignments && data.vehicleAssignments.length > 0 &&
              <VehicleAssignmentsList assignments={data.vehicleAssignments}/>}
          </Card.Body>
        </Card>
      </PageLayout>
      
      {!isError && data &&
        <ConfirmDisUsedModal
          data={data}
          show={confirm}
          onSubmit={onDisUsedSubmit}
          onHide={toggleConfirm}/>}
      
      {!isError && data &&
        <AppOffCanvas
          title={<><i className='bi bi-person-plus'/> Nouvelle affectation du véhicule</>}
          children={<VehicleAssForm vehicle={data} onHide={toggleClick} onRefresh={onRefresh}/>}
          show={click}
          onHide={toggleClick}/>}
      
      {!isError && data &&
        <AppOffCanvas
          title={<><i className='bi bi-pencil-square'/> Modification véhicule</>}
          children={<VehicleForm onRefresh={onRefresh} onHide={toggleShow} data={data}/>}
          show={show}
          onHide={toggleShow}/>}
    </ErrorBoundary>
  )
}

export default memo(ShowVehicle)

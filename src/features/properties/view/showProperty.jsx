import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, AppOffCanvas, FallBackRender, MapComponent, PageHeading, RowContent2} from "../../../components";
import {memo, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {Link, useParams} from "react-router-dom";
import toast from "react-hot-toast";
import {useDisUsedPropertyMutation, useGetUniquePropertyQuery} from "../model/property.api.slice";
import {PageLayout} from "../../../layouts";
import {Button, Card, Col, Modal, Row, Spinner} from "react-bootstrap";
import {FadeSpinLoader} from "../../../loaders";
import {entrypoint} from "../../../app/store";
import avatar2 from "../../../assets/images/avatar/default_profile.jpg";
import PropertyAssForm from "./propertyAssForm";
import VehicleAssignmentsList from "../../vehicles/view/vehicleAssignmentsList";

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

const ShowProperty = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'patrimony' }))
  }, [dispatch])
  
  const [show, setShow] = useState(false)
  const [click, setClick] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [disUsedProperty, {isLoading: isDisUsedLoading, isError: isDisUsedError, error: disUsedError}]
    = useDisUsedPropertyMutation()
  
  const {id} = useParams()
  const {data, isLoading, isFetching, isError, error, refetch} = useGetUniquePropertyQuery(id)
  
  const onRefresh = async () => await refetch()
  
  const toggleShow = () => setShow(!show)
  
  const toggleClick = () => setClick(!click)
  
  const toggleConfirm = () => setConfirm(!confirm)
  
  const onDisUsedSubmit = async () => {
    toggleConfirm()
    try {
      const send = await disUsedProperty(data)
      if (send?.data) {
        toast.success('Désaffectation OK.')
        onRefresh()
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
  
  useEffect(() => {
    if (isDisUsedError) {
      if (disUsedError?.error) toast.error(disUsedError.error)
      if (disUsedError?.data && disUsedError.data['hydra:description']) {
        toast.error(disUsedError.data['hydra:description'])
      }
    }
  }, [isDisUsedError, disUsedError])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title={`Propriété`}/>
      <PageLayout>
        <AppBreadcrumb title={`Propriété`}/>
        
        <Row>
          <Col className='mb-3'>
            <Button disabled={isFetching} variant='danger' onClick={toggleShow} className='me-1'>
              <i className='bi bi-trash'/> Supprimer
            </Button>
            
            <Link to={`/app/properties/${data ? data.id+'/edit' : '#!'}`} className='btn btn-primary'>
              <i className='bi bi-pencil-square'/> Modifier
            </Link>
          </Col>
          
          <Col className='mb-3 text-md-end'>
            <Link className='btn btn-link' to='/app/properties'>
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
                  <i className='bi bi-house-exclamation-fill me-1'/>
                  {data?.type && data.type.name.toUpperCase()}
                </h4> <hr/>
                
                <Row>
                  <Col className='mb-3'>
                    <RowContent2 title='Type' content={data?.type && data.type.name.toUpperCase()}/>
                    <RowContent2 title='Province' content={data?.province && data.province.name.toUpperCase()}/>
                    <RowContent2
                      title='Commune'
                      content={data?.commune && data.commune.toUpperCase()}/>
                    <RowContent2 title='Quartier / Secteur' content={data?.quarter && data.quarter.toUpperCase()}/>
                    <RowContent2 title='Avenue' content={data?.avenue && data.avenue.toUpperCase()}/>
                    <RowContent2 title='Numéro' content={data?.number && data.number}/>
                    <RowContent2 title='surface' content={data?.surface && data.surface}/>
                    <RowContent2 title='Nombre de pièces(s)' content={data?.pieces && data.pieces}/>
                  </Col>
                  
                  {(data?.longitude && data?.latitude) &&
                    <Col className='mb-3'>
                      <MapComponent longitude={data.longitude} latitude={data.latitude}/>
                    </Col>}
                </Row> <hr/>
                
                <Row className='mt-3'>
                  <Col className='mb-3'>
                    <RowContent2 title='Description' content={(
                      <div style={{ whiteSpace: 'pre' }}>
                        {data?.description && data.description}
                      </div>
                    )}/>
                  </Col>
                  
                  <Col className='mb-3'>
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
                            <Link to={`/app/agents/${data.agent.id}/show`} className='text-dark'>
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
                </Row>
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
            
            {!(isError && isLoading) && data && data?.propertyAssignments && data.propertyAssignments.length > 0 &&
              <VehicleAssignmentsList assignments={data.propertyAssignments}/>}
          </Card.Body>
        </Card>
      </PageLayout>
      
      {!isError && data &&
        <ConfirmDisUsedModal data={data} show={confirm} onHide={toggleConfirm} onSubmit={onDisUsedSubmit}/>}
      
      {!isError && data &&
        <AppOffCanvas
          title={<><i className='bi bi-person-plus'/> Nouvelle affectation propriété</>}
          children={<PropertyAssForm onHide={toggleClick} onRefresh={onRefresh} vehicle={data}/>}
          show={click}
          onHide={toggleClick}/>}
    </ErrorBoundary>
  )
}

export default memo(ShowProperty)

import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, AppOffCanvas, FallBackRender, PageHeading, RowContent2} from "../../../components";
import {memo, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Button, Card, Col, Row, Spinner} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import toast from "react-hot-toast";
import {FadeSpinLoader} from "../../../loaders";
import {useGetUniqueSocietyQuery} from "../model/society.api.slice";
import {entrypoint} from "../../../app/store";
import SocietyForm from "./societyForm";
import RecoveriesList from "./recoveriesList";

const ShowSociety = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'recovery' }))
  }, [dispatch])
  
  const {id} = useParams()
  const {data, isLoading, isFetching, isError, error, refetch} = useGetUniqueSocietyQuery(id)
  
  const onRefresh = async () => await refetch()
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
  
  const toggleShow = () => setShow(!show)
  
  const toggleOpen = () => setOpen(!open)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Société'/>
      <PageLayout>
        <AppBreadcrumb title='Société'/>
        
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
            <Link className='btn btn-link' to='/app/societies'>
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
            {!(isError && isLoading) && data && (
              <>
                <h4 className="card-title fw-bold mt-3">
                  <i className='bi bi-house-exclamation-fill me-1'/>
                  {data.name.toUpperCase()}
                </h4> <hr/>
                
                <Row>
                  <Col className='mb-3'>
                    <RowContent2 title='Dénomination' content={data.name.toUpperCase()}/>
                    <RowContent2 title='Nom commercial' content={data?.tradeName && data.tradeName.toUpperCase()}/>
                    
                    <RowContent2
                      title='RCCM'
                      content={data?.rccm && (
                        <>
                          <i className='bi bi-cloud-download me-1'/>
                          <a href={entrypoint+data.rccm?.contentUrl} target='_blank' rel='noreferrer'>
                            {data.rccm?.contentUrl?.substring(12)}
                          </a>
                        </>
                      )}/>
                    
                    <RowContent2 title="Type d'activité" content={data?.type && data.type.name.toUpperCase()}/>
                    <RowContent2 title='Point focal' content={data?.focal && data.focal.toUpperCase()}/>
                  </Col>
                  
                  <Col className='mb-3'>
                    <RowContent2 title='N° Tél.' content={data?.phone && data.phone}/>
                    
                    <RowContent2 title='Adresse' content={data?.address && (
                      <div style={{ whiteSpace: 'pre' }}>{data.address}</div>
                    )}/>
                    
                    <RowContent2 title='Province' content={data?.province && data.province.name.toUpperCase()}/>
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
              <i className='bi bi-clock-history'/> Régulations Sécuritaires, Télécom & TIC
            </h4> <hr/>
            
            {!(isError && isLoading) && data && data?.societyRecoveries && data.societyRecoveries?.length > 0 &&
              <RecoveriesList recoveries={data.societyRecoveries}/>}
          </Card.Body>
        </Card>
      </PageLayout>
      
      {!isError && data && (
        <AppOffCanvas
          title={<><i className='bi bi-pencil-square'/> Modification de la société</>}
          children={<SocietyForm data={data} onRefresh={onRefresh} onHide={toggleShow}/>}
          show={show}
          onHide={toggleShow}/>
      )}
    </ErrorBoundary>
  )
}

export default memo(ShowSociety)

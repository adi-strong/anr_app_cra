import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading, RowContent2} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {Link, useParams} from "react-router-dom";
import {Button, Card, Col, Row, Spinner} from "react-bootstrap";
import toast from "react-hot-toast";
import {useGetUniqueRecoveryQuery} from "../model/recovery.api.slice";
import {FadeSpinLoader} from "../../../loaders";
import {PageLayout} from "../../../layouts";
import {entrypoint} from "../../../app/store";

const ShowRecovery = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'recovery' }))
  }, [dispatch])
  
  const {id} = useParams()
  const {data, isLoading, isFetching, isError, error, refetch} = useGetUniqueRecoveryQuery(id)
  
  const onRefresh = async () => await refetch()
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Recouvrement'/>
      <PageLayout>
        <AppBreadcrumb title='Régulation Sécuritaire, Télécom & TIC'/>
        
        <div className='mb-3 text-md-end'>
          <Link className='btn btn-link' to='/app/societies'>
            <i className='bi bi-arrow-left'/> Retour à la liste
          </Link>
          
          <Button disabled={isFetching} variant='link' onClick={onRefresh}>
            {isFetching && <Spinner animation='grow' size='sm' className='me-1'/>}
            {!isFetching && <i className='bi bi-arrow-clockwise me-1'/>}
            Actualiser
          </Button>
        </div>
        
        <Card>
          <Card.Body>
            {!(isError && isLoading) && data && (
              <>
                <h4 className='card-title fw-bold'>
                  <Link to={`/app/societies/${data?.society?.id}/show`}>
                    <i className='bi bi-house-check-fill'/> {data?.society?.name?.toUpperCase()}
                  </Link>
                </h4> <hr/>
                
                <Row>
                  <Col className='mb-3'>
                    <RowContent2 title='Société' content={data?.society && data.society?.name?.toUpperCase()}/>
                    <RowContent2 title='Nom commercial' content={data?.society && data.society?.tradeName?.toUpperCase()}/>
                    <RowContent2 title='Adresse' content={data?.society && data.society?.address}/>
                    <RowContent2 title='Province' content={data?.province && data.province?.name?.toUpperCase()}/>
                    <RowContent2 title='Activité' content={data?.type && data.type?.name?.toUpperCase()}/>
                    
                    <RowContent2
                      title='Rccm'
                      content={data?.society?.rccm && (
                        <>
                          <i className='bi bi-cloud-download me-1'/>
                          <a href={entrypoint+data.society.rccm?.contentUrl} target='_blank' rel='noreferrer'>
                            {data.society.rccm?.contentUrl?.substring(12)}
                          </a>
                        </>
                      )}/>
                  </Col>
                  
                  <Col className='mb-3'>
                    <RowContent2 title='Homologation de sécurité' content={data?.certificate && (
                      <>
                        <i className='bi bi-cloud-download-fill me-1'/>
                        <a href={entrypoint+data.certificate?.contentUrl} target='_blank' rel='noreferrer'>
                          {data.certificate?.contentUrl?.substring(12)}
                        </a>
                      </>
                    )}/>
                    <RowContent2 title='Avis de passage' content={data?.certificate && (
                      <>
                        <i className='bi bi-cloud-download-fill me-1'/>
                        <a href={entrypoint+data.callingCard?.contentUrl} target='_blank' rel='noreferrer'>
                          {data.callingCard?.contentUrl?.substring(12)}
                        </a>
                      </>
                    )}/>
                    <RowContent2 title='PV' content={data?.certificate && (
                      <>
                        <i className='bi bi-cloud-download-fill me-1'/>
                        <a href={entrypoint+data.pv?.contentUrl} target='_blank' rel='noreferrer'>
                          {data.pv?.contentUrl?.substring(12)}
                        </a>
                      </>
                    )}/>
                    <RowContent2 title='Formulaire' content={data?.certificate && (
                      <>
                        <i className='bi bi-cloud-download-fill me-1'/>
                        <a href={entrypoint+data.form?.contentUrl} target='_blank' rel='noreferrer'>
                          {data.form?.contentUrl?.substring(12)}
                        </a>
                      </>
                    )}/>
                    <RowContent2 title='Note de frais' content={data?.certificate && (
                      <>
                        <i className='bi bi-cloud-download-fill me-1'/>
                        <a href={entrypoint+data.expenseReport?.contentUrl} target='_blank' rel='noreferrer'>
                          {data.expenseReport?.contentUrl?.substring(12)}
                        </a>
                      </>
                    )}/>
                    <RowContent2 title='Preuve de paiement' content={data?.certificate && (
                      <>
                        <i className='bi bi-cloud-download-fill me-1'/>
                        <a href={entrypoint+data.proofOfPayment?.contentUrl} target='_blank' rel='noreferrer'>
                          {data.proofOfPayment?.contentUrl?.substring(12)}
                        </a>
                      </>
                    )}/>
                  </Col>
                </Row>
              </>
            )}
            
            {isLoading && <FadeSpinLoader loading={isLoading}/>}
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(ShowRecovery)

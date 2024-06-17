import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Button, Card, Spinner} from "react-bootstrap";
import {Link, useParams} from "react-router-dom";
import {useGetUniqueNewsQuery} from "../services/news.api.slice";
import {FadeSpinLoader} from "../../../loaders";
import htmlParser from "html-react-parser";
import moment from "moment";
import {useReactToPrint} from "react-to-print";
import {entrypoint} from "../../../app/store";
import "react-image-gallery/styles/css/image-gallery.css";
import {allowedImgExtensions, allowedVideoExtensions, isValidFileExtension} from "../../../services";

const ShowNews = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'dashboard' }))
  }, [dispatch])
  
  const {id} = useParams()
  const printRef = useRef()
  const {data, isLoading, isFetching, isError, refetch} = useGetUniqueNewsQuery(id)
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current
  })
  
  const onRefresh = async () => await refetch()
  
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <PageHeading title={`Information n°${id}`}/>
      <PageLayout>
        <AppBreadcrumb title={`Information n°${id}`}/>
        
        <div className='d-flex justify-content-between mb-3'>
          <div>
            <Button disabled={isFetching} variant='link' onClick={onRefresh}>
              {isFetching && <Spinner animation='grow' size='sm' className='me-1'/>}
              {!isFetching && <i className='bi bi-arrow-clockwise me-1'/>}
              Actualiser
            </Button>
            
            <Link to='/app/news' className='mx-1'>
              <i className='bi bi-box-arrow-in-down-left'/> Retour à la liste
            </Link>
          </div>
          
          <Button disabled={isFetching} variant='info' className='text-light' onClick={handlePrint}>
            <i className='bi bi-printer-fill'/> Imprimer
          </Button>
        </div>
        
        <Card>
          <Card.Body>
            {isLoading && <FadeSpinLoader loading={isLoading}/>}
            {!(isError && isLoading) && data && (
              <>
                <div ref={printRef} className='container-fluid mt-10'>
                  <h2 className={`fw-bold text-${data?.title ? 'primary' : 'dark'} mt-3`}>
                    <i className='bi bi-info-circle-fill'/> {data?.title ? data.title : 'Aucun titre'}
                  </h2>
                  <div className='meta-top'>
                    <ul style={{ display: 'flex', flexWrap: 'wrap' }}>
                      <li className='d-flex align-items-center me-4'>
                        <i className='bi bi-person text-primary me-1'/> {data?.user && (
                        <Link to={`/app/users/${data?.id}/show`}>
                          {data.user?.fullName}
                        </Link>
                      )}
                      </li>
                      <li className='d-flex align-items-center me-4'>
                        <i className='bi bi-clock text-primary me-2'/>
                        {data?.releasedAt && moment(data?.releasedAt).calendar()}
                      </li>
                      <li className='d-flex align-items-center me-4'>
                        <i className='bi bi-pin-map text-primary me-2'/>
                        {data?.address ? data.address : '... ?'}
                      </li>
                      <li className='d-flex align-items-center text-uppercase'>
                        <i className='bi bi-newspaper text-primary me-2'/>
                        {data?.sort ? data.sort : '... ?'}
                      </li>
                    </ul>
                  </div>
                  <hr/>
                  
                  <div className='text-dark mb-4'>
                    {data?.content && htmlParser(data?.content)}
                    
                    <div className='bg-light shadow-sm p-2' style={{ borderRadius: 9 }}>
                      <h4 className='mt-3'><i className='bi bi-paperclip'/> Fichier(s) joint(s)</h4>
                      <hr/>
                      
                      {data?.images && data?.images.length > 0 && data.images.map((file, index) => (
                        <div key={index}>
                          <a href={entrypoint+file?.contentUrl} target='_blank' rel='noreferrer'>
                            {isValidFileExtension(
                              file?.contentUrl,
                              allowedImgExtensions,
                              allowedVideoExtensions
                            ) === 'photo'
                              ? <i className='bi bi-file-earmark-image me-1'/>
                              : isValidFileExtension(
                              file?.contentUrl,
                              allowedImgExtensions,
                              allowedVideoExtensions
                            ) === 'video'
                                ? <i className='bi bi-file-earmark-play-fill me-1'/>
                                : <i className='bi bi-file-earmark-text me-1'/>}
                            {file?.contentUrl?.substring(12)}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(ShowNews)

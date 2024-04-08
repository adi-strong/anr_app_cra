import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {useParams} from "react-router-dom";
import toast from "react-hot-toast";
import {useGetUniqueMedicalQuery} from "../../medical/model/medical.api.slice";
import {PageLayout} from "../../../layouts";
import {Button, Card, Col, Row, Spinner, Table} from "react-bootstrap";
import {FadeSpinLoader} from "../../../loaders";
import logo from "../../../assets/images/background/logo.png";
import moment from "moment";
import htmlParser from "html-react-parser";
import {entrypoint} from "../../../app/store";
import EditMedicalFileModal from "./editMedicalFileModal";

const nStyle = {
  fontWeight: 800,
  color: '#0909b0'
}

const style = {fontSize: '0.6rem'}

const style2 = {fontSize: '0.6rem', fontWeight: 800}

const uStyle2 = { borderBottom: '2px solid #0909b0' }

const ShowMedicalFile = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  const {id} = useParams()
  const {data, isLoading, isFetching, isError, error, refetch} = useGetUniqueMedicalQuery(id)
  
  const onRefresh = async () => await refetch()
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  const [show, setShow] = useState(false)
  
  const toggleShow = () => setShow(!show)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title={`Fiche médicale n° ${id}`}/>
      <PageLayout>
        <AppBreadcrumb title={`Fiche médicale n° ${id}`}/>
        
        
        <div className='d-flex justify-content-between mb-4'>
          <div>
            <Button disabled={isFetching} className='me-1' variant='link' onClick={onRefresh}>
              {isFetching && <Spinner animation='grow' size='sm' className='me-1'/>}
              {!isFetching && <i className='bi bi-arrow-clockwise me-1'/>}
              Actualiser
            </Button>
          </div>
          
          <div>
            {!(isError && isLoading) && data &&
              <Button disabled={isFetching} onClick={toggleShow} className='me-1'>
                <i className='bi bi-plus-square-fill'/> Observation
              </Button>}
          </div>
        </div>
        
        
        <Card>
          <Card.Body>
            <div className='mt-5 pt-10 px-10 pe-10 mb-3' style={uStyle2}>
              <Row>
                <Col sm={6} className='mb-3'>
                  <img src={logo} className='rounded-circle' width={80} height={80} alt=''/>
                </Col>
                
                <Col sm={6} className='mb-3 text-end text-dark'>
                  N° 1 | le{' '}
                  {!(isError && isLoading) && data && data?.releasedAt && moment(data.releasedAt).format('ll')}
                </Col>
              </Row>
              
              <h2 style={nStyle} className='text-center'>
                AGENCE NATIONALE DE RENSEIGNEMENTS
              </h2>
              <h6 className='text-center'>rue Philippe 49 731 Dumas-sur-Lebrun</h6>
            </div>
            
            <div className='mt-5 px-10 pe-10 mb-3 text-center'>
              <div className='mt-8 text-start'>
                <Card.Title>
                  <span className="fw-bold">Responsable</span> : <br/>
                  {!(isError && isLoading) && data && data?.agent && (
                    <>
                      {data.agent.name.toUpperCase()+' '}
                      {data.agent?.lastName && data.agent.lastName.toUpperCase()+' '}
                      {data.agent?.firstName && data.agent.firstName.toUpperCase()}
                    </>
                  )}
                </Card.Title>
              </div>
              
              <h4 className='card-title fw-bold'>FICHE MÉDICALE
                <span className='mx-1 fw-normal text-decoration-underline'>n°{id}</span>
              </h4>
              
              {!(isError && isLoading) && data && (
                <>
                  <Table responsive bordered style={{ border: '1px solid #000' }}>
                    <tbody>
                    <tr>
                      <td className='p-1 align-middle bg-light text-uppercase text-start text-dark' style={style2}>nom</td>
                      <td className='p-1 align-middle text-uppercase text-start text-dark' style={style}>
                        {data.agent.name}
                      </td>
                    </tr>
                    
                    <tr>
                      <td className='p-1 align-middle bg-light text-uppercase text-start text-dark' style={style2}>postnom</td>
                      <td className='p-1 align-middle text-uppercase text-start text-dark' style={style}>
                        {data.agent?.lastName && data.agent.lastName}
                      </td>
                    </tr>
                    
                    <tr>
                      <td className='p-1 align-middle bg-light text-uppercase text-start text-dark' style={style2}>prénom</td>
                      <td className='p-1 align-middle text-uppercase text-start text-dark' style={style}>
                        {data.agent?.firstName && data.agent.firstName}
                      </td>
                    </tr>
                    
                    <tr>
                      <td className='p-1 align-middle bg-light text-uppercase text-start text-dark' style={style2}>grade</td>
                      <td className='p-1 align-middle text-uppercase text-start text-dark' style={style}>
                        {data.agent?.grade && data.agent.grade?.name}
                      </td>
                    </tr>
                    
                    <tr>
                      <td className='p-1 align-middle bg-light text-uppercase text-start text-dark' style={style2}>fonction</td>
                      <td className='p-1 align-middle text-uppercase text-start text-dark' style={style}>
                        {data.agent?.job && data.agent.job?.name}
                      </td>
                    </tr>
                    
                    <tr>
                      <td className='p-1 align-middle bg-light text-uppercase text-start text-dark' style={style2}>fichier</td>
                      <td className='p-1 align-middle text-lowercase text-start text-dark' style={style}>
                        {data?.docObject &&
                          <>
                            <i className='bi bi-cloud-download me-1'/>
                            <a href={entrypoint+data.docObject?.contentUrl} target='_blank' rel='noreferrer'>
                              {data.docObject?.contentUrl?.substring(12)}
                            </a>
                          </>}
                      </td>
                    </tr>
                    </tbody>
                    
                    <tfoot>
                    <tr>
                      <th className='align-middle p-1 bg-light-primary text-center text-uppercase' style={style2}>
                        <i className='bi bi-pencil-square'/> avis / observation
                      </th>
                      <td className='text-start text-dark'>
                        {data?.observation && htmlParser(data.observation)}
                      </td>
                    </tr>
                    </tfoot>
                  </Table>
                </>
              )}
            </div>
            
            {isLoading && <FadeSpinLoader loading={isLoading}/>}
          </Card.Body>
        </Card>
      </PageLayout>
      
      {!(isError && isLoading) && data &&
        <EditMedicalFileModal
          data={data}
          show={show}
          onRefres={onRefresh}
          onHide={toggleShow}/>}
    </ErrorBoundary>
  )
}

export default memo(ShowMedicalFile)
